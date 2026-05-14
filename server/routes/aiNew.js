const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { callOpenRouter } = require('../services/openrouter');

// Apply rate limiter to all routes in this file
router.use(aiRateLimiter);

// Helper: parse match info from screening AI analysis
function parseScreeningResult(analysisText, entityName) {
  const lowerText = analysisText.toLowerCase();
  const noMatchPhrases = ['no match', 'no direct match', 'no exact match', 'not found', 'clear', 'low risk'];
  const matchPhrases = ['match found', 'potential match', 'high risk', 'critical', 'confirmed match'];

  let match_found = false;
  let match_score = 0;
  let risk_level = 'low';
  let recommendation = '';
  let matched_entity = null;

  if (matchPhrases.some(p => lowerText.includes(p))) {
    match_found = true;
    match_score = lowerText.includes('critical') ? 95 : lowerText.includes('high risk') ? 80 : 60;
  } else if (noMatchPhrases.some(p => lowerText.includes(p))) {
    match_found = false;
    match_score = lowerText.includes('low risk') ? 5 : 15;
  } else {
    match_score = 25;
  }

  if (lowerText.includes('critical')) risk_level = 'critical';
  else if (lowerText.includes('high')) risk_level = 'high';
  else if (lowerText.includes('medium')) risk_level = 'medium';

  const recMatch = analysisText.match(/recommended action[:\s]+([^\n.]+)/i) ||
    analysisText.match(/recommendation[:\s]+([^\n.]+)/i);
  if (recMatch) recommendation = recMatch[1].trim();

  const entityMatch = analysisText.match(/matched (?:entity|party)[:\s]+([^\n,]+)/i);
  if (entityMatch) matched_entity = entityMatch[1].trim();

  return { match_found, match_score, risk_level, recommendation, matched_entity };
}

// Bulk screening endpoint
// POST /api/ai/bulk-screen
// Body: { entities: [{name, country, entity_type}] } (max 10)
router.post('/bulk-screen', auth, async (req, res) => {
  try {
    const { entities } = req.body;
    if (!entities || !Array.isArray(entities) || entities.length === 0) {
      return res.status(400).json({ error: 'entities array is required' });
    }
    if (entities.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 entities per bulk screen request' });
    }

    const sanctions = await pool.query('SELECT entity_name, country, sanctions_list, risk_score FROM sanctioned_entities');
    const denied = await pool.query('SELECT party_name, country, list_source FROM denied_parties');

    const results = [];

    for (const entity of entities) {
      const { name, country, entity_type } = entity;
      if (!name) {
        results.push({ entity_name: null, error: 'name is required for each entity' });
        continue;
      }

      try {
        const systemPrompt = `You are an expert export control and sanctions compliance analyst. Analyze the given entity against known sanctions lists and denied party lists. Provide: 1) Match Analysis 2) Risk Level (Critical/High/Medium/Low) 3) Recommended Action. Be concise.`;
        const userPrompt = `Screen this entity:
Entity: ${name}
Country: ${country || 'Unknown'}
Type: ${entity_type || 'Unknown'}

Known Sanctioned Entities: ${JSON.stringify(sanctions.rows.slice(0, 10))}
Known Denied Parties: ${JSON.stringify(denied.rows.slice(0, 10))}`;

        const analysis = await callOpenRouter(systemPrompt, userPrompt);
        const analysisText = typeof analysis === 'string' ? analysis : analysis.content || JSON.stringify(analysis);
        const parsed = parseScreeningResult(analysisText, name);

        // Persist to screening_results
        const inserted = await pool.query(`
          INSERT INTO screening_results (screening_type, entity_screened, match_found, match_score, matched_entity, risk_level, ai_analysis, recommendation, screened_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
        `, [
          'bulk_screening',
          name,
          parsed.match_found,
          parsed.match_score,
          parsed.matched_entity,
          parsed.risk_level,
          analysisText,
          parsed.recommendation,
          req.user.id,
        ]);

        results.push({
          entity_name: name,
          country,
          entity_type,
          screening_id: inserted.rows[0].id,
          match_found: parsed.match_found,
          match_score: parsed.match_score,
          risk_level: parsed.risk_level,
          recommendation: parsed.recommendation,
          matched_entity: parsed.matched_entity,
          analysis: analysisText,
        });
      } catch (entityErr) {
        results.push({ entity_name: name, error: entityErr.message });
      }
    }

    res.json({
      total_screened: results.filter(r => !r.error).length,
      matches_found: results.filter(r => r.match_found).length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Compliance alert dashboard
// POST /api/ai/compliance-alert-dashboard
router.post('/compliance-alert-dashboard', auth, async (req, res) => {
  try {
    // Query key compliance metrics
    const [expiredLicenses, unscreenedTx, highRiskEntities, pendingDocs] = await Promise.all([
      pool.query(`SELECT COUNT(*) as count FROM export_licenses WHERE status = 'expired' OR expiration_date < NOW()`),
      pool.query(`SELECT COUNT(*) as count FROM transactions WHERE risk_score IS NULL OR screening_status = 'not_screened'`),
      pool.query(`SELECT COUNT(*) as count FROM sanctioned_entities WHERE risk_score > 80`),
      pool.query(`SELECT COUNT(*) as count FROM compliance_documents WHERE compliance_status = 'pending_review'`),
    ]);

    const metrics = {
      expired_licenses: parseInt(expiredLicenses.rows[0].count),
      unscreened_transactions: parseInt(unscreenedTx.rows[0].count),
      high_risk_entities: parseInt(highRiskEntities.rows[0].count),
      pending_compliance_docs: parseInt(pendingDocs.rows[0].count),
    };

    const systemPrompt = `You are a Chief Compliance Officer preparing an executive compliance alert dashboard. Be concise, prioritize by urgency, and give actionable recommendations.`;
    const userPrompt = `Generate an executive compliance alert summary with top 3 priorities based on these metrics:

Expired/Expiring Export Licenses: ${metrics.expired_licenses}
Unscreened Transactions: ${metrics.unscreened_transactions}
High-Risk Entities (score > 80): ${metrics.high_risk_entities}
Pending Compliance Documents: ${metrics.pending_compliance_docs}

Provide:
1. Executive Summary (2-3 sentences)
2. Top 3 Priority Actions (numbered, with urgency level: Critical/High/Medium)
3. Risk Level Assessment (Overall: Critical/High/Medium/Low)
4. Recommended timeline for resolution`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    const analysisText = typeof analysis === 'string' ? analysis : analysis.content || JSON.stringify(analysis);

    res.json({
      metrics,
      executive_summary: analysisText,
      generated_at: new Date().toISOString(),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Transaction auto-screen
// POST /api/ai/transaction-auto-screen
// Body: { transaction_id }
router.post('/transaction-auto-screen', auth, async (req, res) => {
  try {
    const { transaction_id } = req.body;
    if (!transaction_id) {
      return res.status(400).json({ error: 'transaction_id is required' });
    }

    const txResult = await pool.query('SELECT * FROM transactions WHERE id = $1', [transaction_id]);
    if (txResult.rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });

    const tx = txResult.rows[0];
    const sanctions = await pool.query('SELECT entity_name, country, sanctions_list, risk_score FROM sanctioned_entities');
    const denied = await pool.query('SELECT party_name, country, list_source FROM denied_parties');

    const parties = [
      { role: 'exporter', name: tx.exporter_name },
      { role: 'consignee', name: tx.consignee_name },
      { role: 'end_user', name: tx.end_user_name },
    ].filter(p => p.name);

    const screeningResults = [];
    let anyFlagged = false;

    for (const party of parties) {
      if (!party.name) continue;

      const systemPrompt = `You are an export control sanctions compliance analyst. Screen this entity quickly.`;
      const userPrompt = `Screen entity (${party.role}): ${party.name}
Country: ${tx.destination_country}

Known Sanctioned Entities: ${JSON.stringify(sanctions.rows.slice(0, 10))}
Known Denied Parties: ${JSON.stringify(denied.rows.slice(0, 10))}

Provide: 1) Match found? 2) Risk Level 3) Recommendation`;

      const analysis = await callOpenRouter(systemPrompt, userPrompt);
      const analysisText = typeof analysis === 'string' ? analysis : analysis.content || JSON.stringify(analysis);
      const parsed = parseScreeningResult(analysisText, party.name);

      // Save to screening_results
      const inserted = await pool.query(`
        INSERT INTO screening_results (screening_type, entity_screened, match_found, match_score, matched_entity, risk_level, ai_analysis, recommendation, screened_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
        `transaction_auto_screen_${party.role}`,
        party.name,
        parsed.match_found,
        parsed.match_score,
        parsed.matched_entity,
        parsed.risk_level,
        analysisText,
        parsed.recommendation,
        req.user.id,
      ]);

      if (parsed.match_score > 70) anyFlagged = true;

      screeningResults.push({
        role: party.role,
        entity_name: party.name,
        screening_id: inserted.rows[0].id,
        match_found: parsed.match_found,
        match_score: parsed.match_score,
        risk_level: parsed.risk_level,
        recommendation: parsed.recommendation,
      });
    }

    // Update transaction screening_status
    const newStatus = anyFlagged ? 'flagged' : 'screened';
    await pool.query(
      'UPDATE transactions SET screening_status = $1, updated_at = NOW() WHERE id = $2',
      [newStatus, transaction_id]
    );

    // Write audit log
    await pool.query(`
      INSERT INTO audit_logs (action, entity_type, entity_id, user_id, details, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'transaction_auto_screen',
      'transactions',
      transaction_id,
      req.user.id,
      JSON.stringify({ parties_screened: parties.length, flagged: anyFlagged }),
      req.ip,
    ]);

    res.json({
      transaction_id,
      transaction_ref: tx.transaction_ref,
      parties_screened: screeningResults.length,
      flagged: anyFlagged,
      screening_status: newStatus,
      results: screeningResults,
      timestamp: new Date().toISOString(),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Beneficial ownership analysis
// POST /api/ai/beneficial-ownership-analyze
// Body: { entity_name, country?, ownership_tree?, notes? }
router.post('/beneficial-ownership-analyze', auth, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'AI service unavailable: OPENROUTER_API_KEY not configured' });
    }
    const { entity_name, country, ownership_tree, notes } = req.body || {};
    if (!entity_name) {
      return res.status(400).json({ error: 'entity_name is required' });
    }

    const sanctions = await pool.query('SELECT entity_name, country, sanctions_list, risk_score FROM sanctioned_entities');
    const denied = await pool.query('SELECT party_name, country, list_source FROM denied_parties');

    const systemPrompt = `You are a beneficial ownership compliance analyst. Trace the ultimate beneficial owners (UBOs) of an entity, surface 50%-rule (OFAC) implications, sanctioned-shareholder risks, and shell-company indicators. Be concise and actionable.`;
    const userPrompt = `Analyze the ultimate beneficial ownership of:

Entity: ${entity_name}
Country: ${country || 'Unknown'}
Notes: ${notes || 'None'}

Ownership tree (if provided):
${ownership_tree ? (typeof ownership_tree === 'string' ? ownership_tree : JSON.stringify(ownership_tree, null, 2)) : 'Not provided — flag this as a data gap.'}

Known Sanctioned Entities (sample): ${JSON.stringify(sanctions.rows.slice(0, 10))}
Known Denied Parties (sample): ${JSON.stringify(denied.rows.slice(0, 10))}

Provide:
1) UBO Mapping (named individuals/entities at >=25% and >=50% thresholds)
2) OFAC 50%-Rule exposure (any sanctioned shareholder with aggregate >=50%?)
3) Shell-company / nominee indicators
4) Risk Level (Critical/High/Medium/Low)
5) Recommended Action`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    const analysisText = typeof analysis === 'string' ? analysis : analysis.content || JSON.stringify(analysis);

    // Persist to screening_results so it shows up in the audit trail
    const inserted = await pool.query(`
      INSERT INTO screening_results (screening_type, entity_screened, match_found, match_score, matched_entity, risk_level, ai_analysis, recommendation, screened_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      'beneficial_ownership_analysis',
      entity_name,
      /critical|high risk|sanctioned/i.test(analysisText),
      /critical/i.test(analysisText) ? 90 : /high/i.test(analysisText) ? 70 : 30,
      null,
      /critical/i.test(analysisText) ? 'critical' : /high/i.test(analysisText) ? 'high' : /medium/i.test(analysisText) ? 'medium' : 'low',
      analysisText,
      '',
      req.user.id,
    ]);

    res.json({
      entity_name,
      country,
      screening_id: inserted.rows[0].id,
      analysis: analysisText,
      timestamp: new Date().toISOString(),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Supply chain trace
// POST /api/ai/supply-chain-trace
// Body: { product, vendors: [{name, country, tier?}], destination?, notes? }
router.post('/supply-chain-trace', auth, async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({ error: 'AI service unavailable: OPENROUTER_API_KEY not configured' });
    }
    const { product, vendors, destination, notes } = req.body || {};
    if (!vendors || !Array.isArray(vendors) || vendors.length === 0) {
      return res.status(400).json({ error: 'vendors array is required' });
    }
    if (vendors.length > 30) {
      return res.status(400).json({ error: 'Maximum 30 vendors per supply-chain-trace request' });
    }

    const sanctions = await pool.query('SELECT entity_name, country, sanctions_list, risk_score FROM sanctioned_entities');
    const denied = await pool.query('SELECT party_name, country, list_source FROM denied_parties');
    const restricted = await pool.query('SELECT country_name, embargo_level, risk_tier FROM restricted_countries');

    const systemPrompt = `You are a supply-chain export compliance analyst. Trace tier-by-tier vendor exposure to sanctioned/denied parties and restricted countries. Be concrete and actionable.`;
    const userPrompt = `Trace supply-chain exposure:

Product: ${product || 'Unspecified'}
Final destination: ${destination || 'Unspecified'}
Notes: ${notes || 'None'}

Vendors (tier 1..N):
${vendors.map((v, i) => `${i + 1}. ${v.name || 'Unknown'} | country=${v.country || 'Unknown'} | tier=${v.tier || 'unspecified'}`).join('\n')}

Known Sanctioned Entities (sample): ${JSON.stringify(sanctions.rows.slice(0, 10))}
Known Denied Parties (sample): ${JSON.stringify(denied.rows.slice(0, 10))}
Restricted Countries: ${JSON.stringify(restricted.rows.slice(0, 20))}

Provide:
1) Per-vendor tier mapping with risk flag (clear / watch / flagged / blocked)
2) Sanctioned/denied-party hits (exact or probable)
3) Restricted-country exposure per vendor
4) Aggregate supply-chain risk level (Critical/High/Medium/Low)
5) Mitigation steps (audit, substitution, license)`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    const analysisText = typeof analysis === 'string' ? analysis : analysis.content || JSON.stringify(analysis);

    res.json({
      product,
      destination,
      vendor_count: vendors.length,
      analysis: analysisText,
      timestamp: new Date().toISOString(),
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
