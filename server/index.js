const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('./governance/runtime').validateRuntime();

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',').map(origin => origin.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return callback(null, true);
    return callback(new Error('CORS origin denied'));
  },
}));
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
app.use('/api/license-exception-audit', require('./routes/licenseExceptionAudit'));
app.use('/api/governed-workflow', require('./governance/router'));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
