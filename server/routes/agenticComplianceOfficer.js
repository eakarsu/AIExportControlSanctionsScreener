// Agentic compliance officer: "expand to 10 new markets" → screens countries,
// identifies restricted end-uses, recommends licensing strategy.
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { callOpenRouter } = require('../services/openrouter');
router.use(aiRateLimiter);

// POST /api/agentic-compliance-officer/plan { markets:[country_codes], products:[ids] }
router.post('/plan', auth, async (req, res) => {
  try {
    const { markets = [], products = [] } = req.body || {};
    if (!Array.isArray(markets) || !markets.length) return res.status(400).json({ error: 'markets[] required' });
    const restricted = await pool.query(`SELECT country_code, restrictions FROM restricted_countries WHERE country_code = ANY($1)`, [markets]).catch(() => ({ rows: [] }));
    const eccn = await pool.query(`SELECT id, eccn_code, controls FROM controlled_items WHERE id = ANY($1)`, [products]).catch(() => ({ rows: [] }));
    const system = 'You are a chief export-compliance officer. Output JSON {"go_no_go":[{"market":"...","decision":"go|no-go|conditional","rationale":"..."}],"required_licenses":["..."],"watch_list_actions":["..."]}.';
    let parsed;
    try {
      const raw = await callOpenRouter([{ role: 'system', content: system }, { role: 'user', content: `Markets: ${markets.join(',')}\nProducts: ${JSON.stringify(eccn.rows)}\nRestrictions: ${JSON.stringify(restricted.rows)}` }]);
      try { parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw); } catch { parsed = { raw }; }
    } catch (e) {
      return res.status(503).json({ error: 'LLM unavailable', detail: e.message });
    }
    return res.json({ markets, products, plan: parsed });
  } catch (e) {
    return res.status(500).json({ error: 'plan failed' });
  }
});

module.exports = router;
