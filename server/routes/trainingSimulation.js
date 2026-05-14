// Training simulation: interactive scenarios for compliance training.
const router = require('express').Router();
const auth = require('../middleware/auth');
const { callOpenRouter } = require('../services/openrouter');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const pool = require('../db');
router.use(aiRateLimiter);

const SCENARIOS = {
  iran: { title: 'Inbound RFQ from Iran-linked broker', difficulty: 'medium' },
  ofac_list: { title: 'Recently added OFAC SDN match', difficulty: 'hard' },
  dual_use: { title: 'Dual-use software request from Russia', difficulty: 'hard' },
  end_use: { title: 'Suspicious civilian end-use disclosure', difficulty: 'medium' },
};

// GET /api/training-simulation/scenarios
router.get('/scenarios', auth, (req, res) => res.json({ scenarios: SCENARIOS }));

// POST /api/training-simulation/play { scenario_key, user_answer }
router.post('/play', auth, async (req, res) => {
  try {
    const { scenario_key, user_answer } = req.body || {};
    if (!scenario_key || !user_answer) return res.status(400).json({ error: 'scenario_key + user_answer required' });
    if (!SCENARIOS[scenario_key]) return res.status(404).json({ error: 'scenario not found' });
    const system = `You are an export-compliance trainer. Evaluate the trainee answer for the scenario "${SCENARIOS[scenario_key].title}". Output JSON {"correct":bool,"score":0..100,"feedback":"...","ideal_answer":"..."}.`;
    let parsed;
    try {
      const raw = await callOpenRouter([{ role: 'system', content: system }, { role: 'user', content: user_answer }]);
      try { parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw); } catch { parsed = { raw }; }
    } catch (e) {
      return res.status(503).json({ error: 'LLM unavailable' });
    }
    try {
      await pool.query(`INSERT INTO training_runs (user_id, scenario_key, score, payload, created_at) VALUES ($1,$2,$3,$4,NOW())`, [req.user?.id, scenario_key, Number(parsed.score) || 0, JSON.stringify(parsed)]);
    } catch {}
    return res.json({ scenario_key, evaluation: parsed });
  } catch (e) {
    return res.status(500).json({ error: 'play failed' });
  }
});

module.exports = router;
