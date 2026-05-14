// Real-time transaction screening: streaming transactions, immediate flag.
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// POST /api/realtime-tx-screen/check { counterparty, country, amount, items:[...] }
router.post('/check', auth, async (req, res) => {
  try {
    const { counterparty, country, amount, items = [] } = req.body || {};
    if (!counterparty || !country) return res.status(400).json({ error: 'counterparty + country required' });

    const flags = [];
    // Sanctioned entity match
    const denied = await pool.query(`SELECT name, list_source FROM denied_parties WHERE lower(name) LIKE $1 LIMIT 5`, [`%${counterparty.toLowerCase()}%`]).catch(() => ({ rows: [] }));
    if (denied.rows.length) flags.push({ type: 'denied_party_match', matches: denied.rows });

    // Restricted country
    const restricted = await pool.query(`SELECT country_code, severity FROM restricted_countries WHERE country_code = $1`, [country]).catch(() => ({ rows: [] }));
    if (restricted.rows.length) flags.push({ type: 'restricted_country', detail: restricted.rows[0] });

    // Structuring detection
    if (Number(amount) > 9000 && Number(amount) < 10000) flags.push({ type: 'possible_structuring', amount: Number(amount) });

    // Controlled items
    if (Array.isArray(items) && items.length) {
      const controlled = await pool.query(`SELECT id, eccn_code FROM controlled_items WHERE id = ANY($1)`, [items]).catch(() => ({ rows: [] }));
      if (controlled.rows.length) flags.push({ type: 'controlled_items', items: controlled.rows });
    }

    const action = flags.find(f => f.type === 'denied_party_match' || f.type === 'restricted_country') ? 'block' : flags.length ? 'review' : 'allow';
    try {
      await pool.query(`INSERT INTO screening_results (counterparty, country, amount, flags, action, created_at) VALUES ($1,$2,$3,$4,$5,NOW())`, [counterparty, country, Number(amount || 0), JSON.stringify(flags), action]);
    } catch {}
    return res.json({ counterparty, country, amount: Number(amount || 0), action, flags });
  } catch (e) {
    return res.status(500).json({ error: 'screen failed' });
  }
});

module.exports = router;
