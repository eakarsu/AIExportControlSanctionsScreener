const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const [entities, parties, countries, items, transactions, licenses, docs, endUses, screenings, logs] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM sanctioned_entities'),
      pool.query('SELECT COUNT(*) as count FROM denied_parties'),
      pool.query('SELECT COUNT(*) as count FROM restricted_countries'),
      pool.query('SELECT COUNT(*) as count FROM controlled_items'),
      pool.query('SELECT COUNT(*) as count FROM transactions'),
      pool.query('SELECT COUNT(*) as count FROM export_licenses'),
      pool.query('SELECT COUNT(*) as count FROM compliance_documents'),
      pool.query('SELECT COUNT(*) as count FROM restricted_end_uses'),
      pool.query('SELECT COUNT(*) as count FROM screening_results'),
      pool.query('SELECT COUNT(*) as count FROM audit_logs'),
    ]);
    const blocked = await pool.query("SELECT COUNT(*) as count FROM transactions WHERE status = 'denied'");
    const flagged = await pool.query("SELECT COUNT(*) as count FROM transactions WHERE screening_status = 'flagged'");
    const highRisk = await pool.query("SELECT COUNT(*) as count FROM sanctioned_entities WHERE risk_score >= 90");

    res.json({
      sanctioned_entities: +entities.rows[0].count,
      denied_parties: +parties.rows[0].count,
      restricted_countries: +countries.rows[0].count,
      controlled_items: +items.rows[0].count,
      transactions: +transactions.rows[0].count,
      export_licenses: +licenses.rows[0].count,
      compliance_documents: +docs.rows[0].count,
      restricted_end_uses: +endUses.rows[0].count,
      screening_results: +screenings.rows[0].count,
      audit_logs: +logs.rows[0].count,
      blocked_transactions: +blocked.rows[0].count,
      flagged_transactions: +flagged.rows[0].count,
      high_risk_entities: +highRisk.rows[0].count,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
