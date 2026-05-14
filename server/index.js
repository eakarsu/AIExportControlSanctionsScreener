const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

const auditLogger = require('./middleware/auditLogger');

// Routes
app.use('/api/auth', require('./routes/auth'));

// Data routes with audit logging middleware
app.use('/api/sanctioned-entities', auditLogger, require('./routes/sanctionedEntities'));
app.use('/api/transactions', auditLogger, require('./routes/transactions'));
app.use('/api/export-licenses', auditLogger, require('./routes/exportLicenses'));
app.use('/api/compliance-documents', auditLogger, require('./routes/complianceDocuments'));

// Other data routes (no audit logging needed)
app.use('/api/denied-parties', require('./routes/deniedParties'));
app.use('/api/restricted-countries', require('./routes/restrictedCountries'));
app.use('/api/controlled-items', require('./routes/controlledItems'));
app.use('/api/restricted-end-uses', require('./routes/restrictedEndUses'));
app.use('/api/screening-results', require('./routes/screeningResults'));
app.use('/api/audit-logs', require('./routes/auditLogs'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ai', require('./routes/aiNew'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/ext', require('./routes/extensions')); // Apply pass 5: backlog
app.use('/api/agentic-compliance-officer', require('./routes/agenticComplianceOfficer'));
app.use('/api/realtime-tx-screen', require('./routes/realtimeTransactionScreen'));
app.use('/api/supply-chain-transparency', require('./routes/supplyChainTransparency'));
app.use('/api/evasion-detection', require('./routes/evasionDetection'));
app.use('/api/beneficial-ownership', require('./routes/beneficialOwnership'));
app.use('/api/competitor-benchmark', require('./routes/competitorBenchmark'));
app.use('/api/training-simulation', require('./routes/trainingSimulation'));


// === Batch 03 Gaps & Frontend Mounts ===
try {
  const _batch03 = require('./routes/batch03Gaps');
  if (typeof authenticateToken === 'function') app.use('/api', authenticateToken, _batch03);
  else app.use('/api', _batch03);
} catch (_e) { /* batch03 gap routes optional */ }

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
