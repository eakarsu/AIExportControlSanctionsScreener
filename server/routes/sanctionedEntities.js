const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sanctioned_entities ORDER BY risk_score DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sanctioned_entities WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { entity_name, entity_type, country, sanctions_list, designation_date, reason, aliases, status, risk_score } = req.body;
    const result = await pool.query(
      'INSERT INTO sanctioned_entities (entity_name, entity_type, country, sanctions_list, designation_date, reason, aliases, status, risk_score) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [entity_name, entity_type, country, sanctions_list, designation_date, reason, aliases, status || 'active', risk_score || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { entity_name, entity_type, country, sanctions_list, designation_date, reason, aliases, status, risk_score } = req.body;
    const result = await pool.query(
      'UPDATE sanctioned_entities SET entity_name=$1, entity_type=$2, country=$3, sanctions_list=$4, designation_date=$5, reason=$6, aliases=$7, status=$8, risk_score=$9, updated_at=NOW() WHERE id=$10 RETURNING *',
      [entity_name, entity_type, country, sanctions_list, designation_date, reason, aliases, status, risk_score, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM sanctioned_entities WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
