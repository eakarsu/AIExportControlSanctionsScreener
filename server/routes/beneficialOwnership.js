// Beneficial ownership AI: unmask true owners through corporate structures.
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// POST /api/beneficial-ownership/trace { entity_id, max_depth?:5 }
router.post('/trace', auth, async (req, res) => {
  try {
    const { entity_id, max_depth = 5 } = req.body || {};
    if (!entity_id) return res.status(400).json({ error: 'entity_id required' });

    const chain = [entity_id];
    let frontier = [entity_id];
    let depth = 0;
    while (frontier.length && depth < max_depth) {
      const r = await pool.query(`SELECT parent_id FROM entity_ownership WHERE child_id = ANY($1)`, [frontier]).catch(() => ({ rows: [] }));
      frontier = Array.from(new Set(r.rows.map(x => x.parent_id).filter(Boolean)));
      chain.push(...frontier);
      depth++;
    }
    const uniq = Array.from(new Set(chain));
    const denied = uniq.length ? await pool.query(`SELECT id, name FROM denied_parties WHERE entity_id = ANY($1)`, [uniq]).catch(() => ({ rows: [] })) : { rows: [] };
    return res.json({ entity_id, depth, chain: uniq, denied_party_hits: denied.rows });
  } catch (e) {
    return res.status(500).json({ error: 'trace failed' });
  }
});

module.exports = router;
