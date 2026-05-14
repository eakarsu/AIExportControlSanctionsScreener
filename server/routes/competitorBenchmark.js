// Competitor benchmarking: understand peer compliance posture.
const router = require('express').Router();
const auth = require('../middleware/auth');
const { callOpenRouter } = require('../services/openrouter');
const { aiRateLimiter } = require('../middleware/rateLimiter');
router.use(aiRateLimiter);

// POST /api/competitor-benchmark/compare { our_metrics:{denials,blocked,total}, peers:[{name,metrics}] }
router.post('/compare', auth, async (req, res) => {
  try {
    const { our_metrics, peers = [] } = req.body || {};
    if (!our_metrics) return res.status(400).json({ error: 'our_metrics required' });
    const system = 'Benchmark export-compliance metrics against peers and recommend top 3 process improvements. Output JSON {"ranking":[{name, score}],"recommendations":["..."]}.';
    let parsed;
    try {
      const raw = await callOpenRouter([{ role: 'system', content: system }, { role: 'user', content: JSON.stringify({ our_metrics, peers }) }]);
      try { parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw); } catch { parsed = { raw }; }
    } catch (e) {
      return res.status(503).json({ error: 'LLM unavailable' });
    }
    return res.json({ benchmark: parsed });
  } catch (e) {
    return res.status(500).json({ error: 'compare failed' });
  }
});

module.exports = router;
