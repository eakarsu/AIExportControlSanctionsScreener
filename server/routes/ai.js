const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const { callOpenRouter } = require('../services/openrouter');

// 1. AI Entity Screening
router.post('/screen-entity', auth, async (req, res) => {
  try {
    const { entity_name, country, entity_type } = req.body;
    const sanctions = await pool.query('SELECT entity_name, country, sanctions_list, risk_score FROM sanctioned_entities');
    const denied = await pool.query('SELECT party_name, country, list_source FROM denied_parties');

    const systemPrompt = `You are an expert export control and sanctions compliance analyst. Analyze the given entity against known sanctions lists and denied party lists. Provide a structured risk assessment with: 1) Match Analysis 2) Risk Level (Critical/High/Medium/Low) 3) Recommended Action 4) Regulatory References. Be thorough and professional.`;
    const userPrompt = `Screen this entity for sanctions compliance:
Entity: ${entity_name}
Country: ${country || 'Unknown'}
Type: ${entity_type || 'Unknown'}

Known Sanctioned Entities: ${JSON.stringify(sanctions.rows.slice(0, 10))}
Known Denied Parties: ${JSON.stringify(denied.rows.slice(0, 10))}

Provide detailed screening analysis.`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ entity_name, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. AI Export Classification
router.post('/classify-item', auth, async (req, res) => {
  try {
    const { item_name, description, technical_specs } = req.body;
    const systemPrompt = `You are an expert in US export control classification (EAR and ITAR). Classify the given item and determine: 1) Likely ECCN or USML category 2) Control type (EAR/ITAR) 3) License requirements 4) Whether it's dual-use 5) Risk level. Reference specific regulatory provisions.`;
    const userPrompt = `Classify this item for export control:
Item: ${item_name}
Description: ${description || 'Not provided'}
Technical Specifications: ${technical_specs || 'Not provided'}

Provide detailed export classification analysis.`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ item_name, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. AI Transaction Risk Assessment
router.post('/assess-transaction', auth, async (req, res) => {
  try {
    const { exporter, consignee, item, destination, value } = req.body;
    const countries = await pool.query('SELECT country_name, embargo_level, risk_tier FROM restricted_countries');

    const systemPrompt = `You are an export control compliance officer. Assess the risk of this export transaction considering: 1) Destination country risk 2) End-user concerns 3) Item sensitivity 4) Red flags 5) Overall risk score (0-100) 6) Recommended actions. Be specific about regulatory requirements.`;
    const userPrompt = `Assess this export transaction:
Exporter: ${exporter}
Consignee: ${consignee}
Item: ${item}
Destination: ${destination}
Value: $${value || 'Unknown'}

Restricted Countries: ${JSON.stringify(countries.rows)}

Provide comprehensive risk assessment.`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ transaction: { exporter, consignee, destination }, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. AI Country Risk Analysis
router.post('/country-risk', auth, async (req, res) => {
  try {
    const { country_name } = req.body;
    const systemPrompt = `You are a geopolitical and export control risk analyst. Analyze the given country for: 1) Current sanctions programs 2) Export control restrictions 3) Risk tier assessment 4) Key regulations (EAR, OFAC, etc.) 5) Recent developments 6) Compliance recommendations. Be thorough and cite specific regulations.`;
    const userPrompt = `Analyze export control and sanctions risk for: ${country_name}

Provide comprehensive country risk analysis for export compliance purposes.`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ country_name, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. AI End-Use Analysis
router.post('/end-use-analysis', auth, async (req, res) => {
  try {
    const { stated_end_use, item, end_user, country } = req.body;
    const systemPrompt = `You are an export control end-use analyst. Evaluate the stated end-use for: 1) Legitimacy assessment 2) Red flags for WMD/military diversion 3) Consistency with end-user profile 4) EAR §744 implications 5) Recommended due diligence steps 6) Risk level. Reference specific "know your customer" red flags from BIS guidance.`;
    const userPrompt = `Analyze this end-use statement:
Stated End-Use: ${stated_end_use}
Item: ${item || 'Not specified'}
End-User: ${end_user || 'Not specified'}
Country: ${country || 'Not specified'}

Evaluate the legitimacy and risk of this end-use.`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ stated_end_use, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 6. AI Document Compliance Review
router.post('/review-document', auth, async (req, res) => {
  try {
    const { document_type, content, transaction_ref } = req.body;
    const systemPrompt = `You are an export compliance document reviewer. Review the document for: 1) Completeness 2) Regulatory compliance 3) Red flags 4) Missing required elements 5) Recommendations for improvement 6) Pass/Fail assessment. Reference specific regulatory requirements for the document type.`;
    const userPrompt = `Review this compliance document:
Document Type: ${document_type}
Related Transaction: ${transaction_ref || 'N/A'}
Content: ${content}

Provide detailed compliance review.`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ document_type, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 7. AI Dual-Use Assessment
router.post('/dual-use-check', auth, async (req, res) => {
  try {
    const { item_name, specs, intended_use } = req.body;
    const systemPrompt = `You are a dual-use technology assessment expert. Analyze whether the item has dual-use (civilian/military) applications: 1) Civilian applications 2) Potential military applications 3) Wassenaar Arrangement relevance 4) EAR classification likelihood 5) Control recommendations 6) Risk assessment. Be specific about technical thresholds that trigger controls.`;
    const userPrompt = `Assess dual-use potential:
Item: ${item_name}
Specifications: ${specs || 'Not provided'}
Intended Use: ${intended_use || 'Not stated'}

Analyze dual-use classification requirements.`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ item_name, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 8. AI Compliance Report Generator
router.post('/generate-report', auth, async (req, res) => {
  try {
    const stats = await Promise.all([
      pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE risk_score >= 90) as high_risk FROM sanctioned_entities'),
      pool.query("SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'denied') as denied FROM transactions"),
      pool.query("SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE match_found = true) as matches FROM screening_results"),
    ]);

    const systemPrompt = `You are a Chief Compliance Officer generating an executive compliance report. Create a professional report with: 1) Executive Summary 2) Key Metrics 3) Risk Assessment Overview 4) Notable Findings 5) Compliance Gaps 6) Recommendations 7) Action Items. Format it professionally.`;
    const userPrompt = `Generate a compliance report based on these metrics:
Sanctioned Entities: ${stats[0].rows[0].total} total, ${stats[0].rows[0].high_risk} high-risk
Transactions: ${stats[1].rows[0].total} total, ${stats[1].rows[0].denied} denied
Screening Results: ${stats[2].rows[0].total} total, ${stats[2].rows[0].matches} matches found

Generate comprehensive compliance report.`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ report: analysis, generated_at: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 9. AI License Recommendation
router.post('/license-recommendation', auth, async (req, res) => {
  try {
    const { item, destination, end_user, eccn } = req.body;
    const systemPrompt = `You are an export licensing specialist. Recommend the appropriate license type and process: 1) License Type Required 2) Available License Exceptions 3) Application Requirements 4) Estimated Processing Time 5) Conditions/Provisos Likely 6) Alternative Approaches. Reference specific EAR provisions and license exception criteria.`;
    const userPrompt = `Recommend export license approach:
Item: ${item}
ECCN: ${eccn || 'Not yet classified'}
Destination: ${destination}
End User: ${end_user || 'Not specified'}

What license is required and what exceptions may apply?`;

    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ item, destination, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 10. AI Denied Party Deep Search
router.post('/denied-party-search', auth, async (req, res) => {
  try {
    const { party_name, country, party_type } = req.body;
    const denied = await pool.query('SELECT party_name, party_type, country, list_source, reason FROM denied_parties');
    const systemPrompt = `You are a denied party screening specialist with expertise in BIS Denied Persons List, Entity List, Unverified List, and Military End-User List. Perform deep analysis: 1) Name matching analysis (exact, partial, phonetic, transliteration) 2) Alias detection 3) Corporate family tree analysis 4) Risk indicators 5) Historical enforcement actions 6) Recommended screening disposition.`;
    const userPrompt = `Deep search denied party lists for:
Party Name: ${party_name}
Country: ${country || 'Unknown'}
Type: ${party_type || 'Unknown'}

Known Denied Parties: ${JSON.stringify(denied.rows)}

Provide comprehensive denied party screening analysis.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ party_name, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 11. AI Sanctions List Analyzer
router.post('/sanctions-analysis', auth, async (req, res) => {
  try {
    const { list_name, entity_name } = req.body;
    const sanctions = await pool.query('SELECT entity_name, entity_type, country, sanctions_list, reason, risk_score FROM sanctioned_entities');
    const systemPrompt = `You are a sanctions list intelligence analyst. Analyze sanctions designations: 1) Designation basis and legal authority 2) Scope of restrictions (asset freeze, trade prohibition, travel ban) 3) Related/affiliated entities 4) Evasion patterns to watch 5) De-listing likelihood 6) Compliance obligations for US persons and non-US persons.`;
    const userPrompt = `Analyze sanctions list entry:
List: ${list_name || 'All lists'}
Entity: ${entity_name || 'General analysis'}

Current sanctioned entities in database: ${JSON.stringify(sanctions.rows)}

Provide detailed sanctions intelligence analysis.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ list_name, entity_name, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 12. AI Transaction Pattern Detection
router.post('/transaction-patterns', auth, async (req, res) => {
  try {
    const transactions = await pool.query('SELECT transaction_ref, exporter_name, consignee_name, destination_country, value_usd, status, risk_score, screening_status FROM transactions ORDER BY created_at DESC');
    const systemPrompt = `You are a financial crime and trade compliance analytics expert. Analyze transaction patterns for: 1) Suspicious patterns (structuring, unusual routing, value anomalies) 2) High-risk corridors 3) Repeat offender indicators 4) Sanctions evasion tactics 5) Red flag clusters 6) Recommendations for enhanced monitoring. Use pattern recognition to identify systemic risks.`;
    const userPrompt = `Analyze these export transactions for suspicious patterns:

Transactions: ${JSON.stringify(transactions.rows)}

Identify patterns, anomalies, and systemic risks.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ report: analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 13. AI Red Flag Detector
router.post('/red-flag-detect', auth, async (req, res) => {
  try {
    const { scenario_description, parties, items, destination } = req.body;
    const systemPrompt = `You are a BIS "Know Your Customer" red flag specialist. Using the official BIS Red Flag Indicators and OFAC guidance, analyze for: 1) Each applicable red flag indicator with citation 2) Severity rating per indicator 3) Cumulative risk assessment 4) Mandatory reporting obligations 5) Required due diligence steps 6) Go/No-Go recommendation. Reference the specific BIS red flag indicators list.`;
    const userPrompt = `Detect red flags in this export scenario:
Scenario: ${scenario_description || 'Not provided'}
Parties Involved: ${parties || 'Not specified'}
Items: ${items || 'Not specified'}
Destination: ${destination || 'Not specified'}

Identify all applicable BIS red flag indicators.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 14. AI Compliance Gap Analysis
router.post('/compliance-gaps', auth, async (req, res) => {
  try {
    const [entities, transactions, licenses, docs, screenings] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM sanctioned_entities'),
      pool.query("SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE screening_status = 'not_screened') as unscreened FROM transactions"),
      pool.query("SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'expired') as expired FROM export_licenses"),
      pool.query("SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE compliance_status = 'pending_review') as pending FROM compliance_documents"),
      pool.query("SELECT COUNT(*) as total FROM screening_results"),
    ]);
    const systemPrompt = `You are an Internal Compliance Program (ICP) auditor. Perform a gap analysis: 1) Screening coverage gaps 2) Documentation deficiencies 3) License management issues 4) Training needs 5) Process weaknesses 6) Regulatory compliance gaps 7) Prioritized remediation plan 8) BIS/DDTC voluntary self-disclosure considerations.`;
    const userPrompt = `Analyze compliance program gaps:
Sanctioned Entities Monitored: ${entities.rows[0].total}
Transactions: ${transactions.rows[0].total} total, ${transactions.rows[0].unscreened} not screened
Export Licenses: ${licenses.rows[0].total} total, ${licenses.rows[0].expired} expired
Compliance Documents: ${docs.rows[0].total} total, ${docs.rows[0].pending} pending review
Screening Results: ${screenings.rows[0].total}

Identify all compliance program gaps and recommend fixes.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ report: analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 15. AI Regulatory Update Advisor
router.post('/regulatory-updates', auth, async (req, res) => {
  try {
    const { regulation_area, country } = req.body;
    const systemPrompt = `You are an export control regulatory advisor tracking changes in EAR, ITAR, OFAC sanctions, EU regulations, and Wassenaar Arrangement. Advise on: 1) Recent regulatory changes and effective dates 2) Impact on current operations 3) New compliance obligations 4) Transition timelines 5) Required policy updates 6) Training requirements 7) Industry best practices for adaptation.`;
    const userPrompt = `Provide regulatory update advisory:
Regulation Area: ${regulation_area || 'All areas (EAR, ITAR, OFAC, EU)'}
Country Focus: ${country || 'Global'}

What are the latest regulatory developments and their compliance impact?`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ regulation_area, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 16. AI Penalty Risk Calculator
router.post('/penalty-risk', auth, async (req, res) => {
  try {
    const { violation_type, violation_details, voluntary_disclosure } = req.body;
    const systemPrompt = `You are an export control enforcement and penalty specialist. Calculate potential penalties: 1) Applicable statutes (IEEPA, AECA, EAR) 2) Civil penalty ranges 3) Criminal penalty exposure 4) Aggravating factors 5) Mitigating factors 6) Voluntary self-disclosure benefits 7) Historical enforcement comparison 8) Recommended response strategy. Reference specific penalty guidelines from BIS and OFAC.`;
    const userPrompt = `Calculate penalty risk for:
Violation Type: ${violation_type || 'Not specified'}
Details: ${violation_details || 'Not provided'}
Voluntary Disclosure: ${voluntary_disclosure || 'Not determined'}

Assess potential penalties and recommend response strategy.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ violation_type, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 17. AI Export Route Analysis
router.post('/route-analysis', auth, async (req, res) => {
  try {
    const { origin, destination, transit_countries, item } = req.body;
    const countries = await pool.query('SELECT country_name, country_code, restriction_type, embargo_level FROM restricted_countries');
    const systemPrompt = `You are a trade route and transshipment risk analyst. Analyze the export route for: 1) Transshipment/diversion risks at each point 2) Known diversion hubs 3) Free trade zone concerns 4) Re-export restrictions 5) Country-specific routing red flags 6) Alternative compliant routes 7) Documentation requirements per leg 8) Overall route risk score.`;
    const userPrompt = `Analyze export route risk:
Origin: ${origin || 'United States'}
Destination: ${destination}
Transit Countries: ${transit_countries || 'Direct shipment'}
Item: ${item || 'Not specified'}

Restricted Countries: ${JSON.stringify(countries.rows)}

Assess routing risks and diversion potential.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ origin, destination, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 18. AI Audit Log Analysis
router.post('/audit-analysis', auth, async (req, res) => {
  try {
    const logs = await pool.query(`SELECT al.action, al.entity_type, al.details, al.created_at, u.full_name
      FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 50`);
    const systemPrompt = `You are a compliance audit and internal controls specialist. Analyze audit logs for: 1) Activity patterns and anomalies 2) Segregation of duties concerns 3) Unauthorized access attempts 4) Process compliance deviations 5) Timeliness of reviews 6) Completeness of audit trail 7) Recommendations for control improvements 8) Regulatory audit readiness assessment.`;
    const userPrompt = `Analyze these audit logs for compliance concerns:

Audit Logs: ${JSON.stringify(logs.rows)}

Identify anomalies, control weaknesses, and audit readiness issues.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ report: analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 19. AI Screening Accuracy Review
router.post('/screening-review', auth, async (req, res) => {
  try {
    const screenings = await pool.query('SELECT screening_type, entity_screened, match_found, match_score, matched_entity, risk_level, recommendation FROM screening_results ORDER BY created_at DESC');
    const systemPrompt = `You are a screening quality assurance analyst. Review screening results for: 1) False positive analysis 2) Potential false negatives (missed matches) 3) Screening methodology effectiveness 4) Score threshold optimization 5) Coverage completeness 6) Process improvement recommendations 7) Quality metrics summary 8) Benchmarking against industry standards.`;
    const userPrompt = `Review screening results for quality and accuracy:

Screening Results: ${JSON.stringify(screenings.rows)}

Assess screening accuracy and recommend improvements.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ report: analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 20. AI License Expiry Monitor
router.post('/license-monitor', auth, async (req, res) => {
  try {
    const licenses = await pool.query('SELECT license_number, license_type, applicant_name, destination_country, expiration_date, status, conditions FROM export_licenses ORDER BY expiration_date ASC');
    const systemPrompt = `You are an export license portfolio manager. Analyze the license portfolio: 1) Expiring/expired licenses requiring action 2) License utilization assessment 3) Renewal priorities 4) Condition compliance status 5) Portfolio optimization recommendations 6) Risk of operating without valid licenses 7) Upcoming regulatory changes affecting licenses 8) Action timeline with priorities.`;
    const userPrompt = `Analyze export license portfolio:

Licenses: ${JSON.stringify(licenses.rows)}
Current Date: ${new Date().toISOString().split('T')[0]}

Identify expiry risks, compliance gaps, and renewal priorities.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ report: analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 21. AI Embargo Impact Assessment
router.post('/embargo-impact', auth, async (req, res) => {
  try {
    const { country, business_activity } = req.body;
    const countries = await pool.query('SELECT * FROM restricted_countries WHERE country_name ILIKE $1', [`%${country || ''}%`]);
    const systemPrompt = `You are a sanctions and embargo impact analyst. Assess business impact: 1) Scope of applicable sanctions/embargoes 2) Affected business lines and products 3) Wind-down requirements and timelines 4) Grandfathered transactions 5) Humanitarian exemptions 6) Financial impact estimation 7) Alternative market strategies 8) Compliance program adjustments needed.`;
    const userPrompt = `Assess embargo impact:
Country: ${country}
Business Activity: ${business_activity || 'General trade'}

Country Data: ${JSON.stringify(countries.rows)}

Analyze the full business impact of applicable embargoes.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ country, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 22. AI Compliance Training Generator
router.post('/training-generator', auth, async (req, res) => {
  try {
    const { topic, audience, level } = req.body;
    const systemPrompt = `You are an export control compliance training specialist. Generate training content: 1) Learning objectives 2) Key concepts with examples 3) Real-world case studies 4) Common pitfalls and mistakes 5) Best practices 6) Quiz questions with answers 7) Regulatory references 8) Further reading resources. Make it engaging and practical.`;
    const userPrompt = `Generate compliance training material:
Topic: ${topic || 'Export Control Fundamentals'}
Audience: ${audience || 'Compliance analysts'}
Level: ${level || 'Intermediate'}

Create comprehensive training content.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ topic, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 23. AI ECCN Lookup Assistant
router.post('/eccn-lookup', auth, async (req, res) => {
  try {
    const { product_description, technical_parameters } = req.body;
    const items = await pool.query('SELECT item_name, eccn, usml_category, control_type, description FROM controlled_items');
    const systemPrompt = `You are an ECCN classification specialist with deep knowledge of the Commerce Control List (CCL). For the given product: 1) Walk through the CCL classification logic step-by-step 2) Identify the most likely ECCN 3) Explain which technical parameters trigger controls 4) List applicable Export Control Classification Numbers with reasons 5) Note any "specially designed" considerations 6) Determine if EAR99 applies 7) Identify relevant License Exceptions 8) Flag if ITAR jurisdiction is possible.`;
    const userPrompt = `Perform ECCN classification lookup:
Product: ${product_description}
Technical Parameters: ${technical_parameters || 'Not specified'}

Similar items in database: ${JSON.stringify(items.rows.slice(0, 8))}

Walk through the ECCN classification process step by step.`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ product_description, analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 24. AI Voluntary Self-Disclosure Advisor
router.post('/vsd-advisor', auth, async (req, res) => {
  try {
    const { violation_description, discovery_date, parties_involved } = req.body;
    const systemPrompt = `You are a voluntary self-disclosure (VSD) specialist for BIS, DDTC, and OFAC. Advise on: 1) Whether VSD is recommended and to which agency 2) Filing requirements and format 3) Initial vs. final narrative content 4) Timeline and deadlines 5) Penalty mitigation expectations (OFAC: up to 50% reduction) 6) Corrective actions to implement 7) Privilege and confidentiality considerations 8) Parallel filing obligations.`;
    const userPrompt = `Advise on voluntary self-disclosure:
Violation: ${violation_description || 'Not described'}
Discovery Date: ${discovery_date || 'Recent'}
Parties: ${parties_involved || 'Not specified'}

Should we file a VSD? What are the requirements and benefits?`;
    const analysis = await callOpenRouter(systemPrompt, userPrompt);
    res.json({ analysis, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
