// Sanctions evasion detection: detect structuring (multiple small txs).
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/evasion-detection/structuring?days=30&threshold=10000
router.get('/structuring', auth, async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 30, 365);
    const threshold = Number(req.query.threshold) || 10000;

    const r = await pool.query(
      `SELECT counterparty,
              SUM(amount) AS total,
              COUNT(*) AS n,
              MAX(amount) AS max_single,
              MIN(amount) AS min_single
       FROM transactions
       WHERE created_at > NOW() - INTERVAL '1 day' * $1 AND amount < $2
       GROUP BY counterparty
       HAVING COUNT(*) >= 3 AND SUM(amount) >= $2
       ORDER BY total DESC LIMIT 100`,
      [days, threshold]
    ).catch(() => ({ rows: [] }));

    return res.json({ days, threshold, suspicious_count: r.rows.length, suspicious: r.rows });
  } catch (e) {
    return res.status(500).json({ error: 'structuring failed' });
  }
});

module.exports = router;
