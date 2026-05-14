// Supply chain transparency: map supply chain, screen all tier-1/tier-2.
const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// POST /api/supply-chain-transparency/scan { vendor_id }
router.post('/scan', auth, async (req, res) => {
  try {
    const { vendor_id } = req.body || {};
    if (!vendor_id) return res.status(400).json({ error: 'vendor_id required' });

    const tier1 = await pool.query(`SELECT * FROM supply_chain_relationships WHERE parent_id = $1`, [vendor_id]).catch(() => ({ rows: [] }));
    const tier1Ids = tier1.rows.map(r => r.child_id);
    const tier2 = tier1Ids.length ? await pool.query(`SELECT * FROM supply_chain_relationships WHERE parent_id = ANY($1)`, [tier1Ids]).catch(() => ({ rows: [] })) : { rows: [] };

    const allVendorIds = Array.from(new Set([vendor_id, ...tier1Ids, ...tier2.rows.map(r => r.child_id)]));
    const denied = allVendorIds.length ? await pool.query(`SELECT child_id, name FROM denied_parties WHERE id = ANY($1)`, [allVendorIds]).catch(() => ({ rows: [] })) : { rows: [] };

    return res.json({
      root_vendor_id: vendor_id,
      tier1_count: tier1.rows.length,
      tier2_count: tier2.rows.length,
      total_vendors_screened: allVendorIds.length,
      denied_party_hits: denied.rows,
    });
  } catch (e) {
    return res.status(500).json({ error: 'scan failed' });
  }
});

module.exports = router;
