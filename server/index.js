const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sanctioned-entities', require('./routes/sanctionedEntities'));
app.use('/api/denied-parties', require('./routes/deniedParties'));
app.use('/api/restricted-countries', require('./routes/restrictedCountries'));
app.use('/api/controlled-items', require('./routes/controlledItems'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/export-licenses', require('./routes/exportLicenses'));
app.use('/api/compliance-documents', require('./routes/complianceDocuments'));
app.use('/api/restricted-end-uses', require('./routes/restrictedEndUses'));
app.use('/api/screening-results', require('./routes/screeningResults'));
app.use('/api/audit-logs', require('./routes/auditLogs'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
