const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({
  summary: { exceptions_reviewed: 47, invalid_claims: 6, documentation_gaps: 9, filings_due: 3 },
  exceptions: [
    { transaction: 'TX-8810', exception: 'ENC', issue: 'missing classification memo', risk: 'high', action: 'hold shipment' },
    { transaction: 'TX-8841', exception: 'TMP', issue: 'return timeline not documented', risk: 'medium', action: 'request end-use statement' },
    { transaction: 'TX-8902', exception: 'LVS', issue: 'value threshold OK', risk: 'low', action: 'archive rationale' },
  ],
}));

module.exports = router;
