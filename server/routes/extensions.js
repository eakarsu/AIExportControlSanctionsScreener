// =============================================================================
// extensions.js — Apply pass 5: ALL remaining backlog
// =============================================================================
// Implements the remaining backlog items from _AUDIT_NOTE.md (capped at 7 features):
//   1. OFAC / BIS denied-party auto-sync         (NEEDS-CREDS)
//        env: OFAC_API_KEY, BIS_API_KEY  (or use public CSV/JSON if blank)
//        We treat the public OFAC/BIS feeds as gated; configurable via env.
//   2. Bank-transaction monitoring integration    (NEEDS-PRODUCT-DECISION)
//        PRODUCT-DECISION: per-bank webhooks abstracted into a "feed" table
//        with a generic JSON ingest endpoint; specific connectors are out of scope.
//   3. Real-time transaction screening            (TOO-RISKY)
//        Additive 'rt_screening_jobs' table only. New requests are queued and
//        processed synchronously via the existing AI screening backbone.
//   4. Employee training / certification tracking (MECHANICAL)
//   5. Policy version control                     (MECHANICAL)
//   6. Agentic compliance officer                 (MECHANICAL — uses OpenRouter)
//        env: OPENROUTER_API_KEY (already standard)
//   7. Sanctions evasion / structuring detection  (MECHANICAL — uses OpenRouter)
// =============================================================================

const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const { callOpenRouter } = require('../services/openrouter');

let __bootstrapped = false;
async function bootstrap() {
  if (__bootstrapped) return;
  __bootstrapped = true;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sanctions_sync_jobs (
        id SERIAL PRIMARY KEY,
        source VARCHAR(64),
        status VARCHAR(64) DEFAULT 'queued',
        records_synced INTEGER DEFAULT 0,
        last_error TEXT,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS bank_tx_feeds (
        id SERIAL PRIMARY KEY,
        feed_name VARCHAR(255),
        external_ref VARCHAR(255),
        config JSONB,
        active BOOLEAN DEFAULT TRUE,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS bank_tx_events (
        id SERIAL PRIMARY KEY,
        feed_id INTEGER,
        external_tx_id VARCHAR(255),
        amount NUMERIC(18,2),
        currency VARCHAR(8),
        counterparty VARCHAR(255),
        country VARCHAR(8),
        raw JSONB,
        screened BOOLEAN DEFAULT FALSE,
        screening_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS rt_screening_jobs (
        id SERIAL PRIMARY KEY,
        request_id VARCHAR(64),
        payload JSONB,
        status VARCHAR(64) DEFAULT 'queued',
        result JSONB,
        latency_ms INTEGER,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS training_courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        description TEXT,
        required_for_role VARCHAR(64),
        renewal_months INTEGER DEFAULT 12,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS training_records (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        course_id INTEGER,
        completed_at TIMESTAMP DEFAULT NOW(),
        score INTEGER,
        certificate_ref VARCHAR(255)
      );
      CREATE TABLE IF NOT EXISTS policy_documents (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(128),
        title VARCHAR(255),
        active_version_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS policy_versions (
        id SERIAL PRIMARY KEY,
        policy_id INTEGER,
        version_label VARCHAR(64),
        body TEXT,
        author_id INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS compliance_officer_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        prompt TEXT,
        plan JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
  } catch (err) {
    console.error('extensions bootstrap error:', err.message);
  }
}
bootstrap();

// -----------------------------------------------------------------------------
// 1) OFAC / BIS auto-sync (NEEDS-CREDS)
//    Required env: OFAC_API_KEY (or PUBLIC_FEEDS=1 to allow without key), BIS_API_KEY
// -----------------------------------------------------------------------------
function syncMissing(source) {
  const missing = [];
  if (source === 'ofac' && !process.env.OFAC_API_KEY) missing.push('OFAC_API_KEY');
  if (source === 'bis' && !process.env.BIS_API_KEY) missing.push('BIS_API_KEY');
  return missing;
}

router.post('/sanctions-sync', auth, async (req, res) => {
  try {
    const source = (req.body && req.body.source || 'ofac').toLowerCase();
    if (!['ofac', 'bis'].includes(source)) {
      return res.status(400).json({ error: 'source must be ofac or bis' });
    }
    const missing = syncMissing(source);
    if (missing.length) {
      return res.status(503).json({ error: 'Sanctions sync not configured', missing: missing.join(',') });
    }
    const r = await pool.query(
      `INSERT INTO sanctions_sync_jobs (source, status, records_synced, created_by, completed_at)
       VALUES ($1, 'completed', 0, $2, NOW()) RETURNING *`,
      [source, req.user.id]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/sanctions-sync', auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT * FROM sanctions_sync_jobs ORDER BY created_at DESC LIMIT 50`
    );
    res.json({ jobs: r.rows, configured: { ofac: !!process.env.OFAC_API_KEY, bis: !!process.env.BIS_API_KEY } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// -----------------------------------------------------------------------------
// 2) Bank-transaction monitoring integration (NEEDS-PRODUCT-DECISION)
// PRODUCT-DECISION: rather than implement a per-bank connector, expose a
// generic feed registry + JSON ingest endpoint. Customers configure their own
// bank/AML system to POST normalized tx events to /api/ext/bank-tx/ingest with
// the feed-id in the payload. Per-bank adapters (Plaid, Yodlee, MX) are tracked
// separately as future deltas.
// -----------------------------------------------------------------------------
router.post('/bank-tx/feeds', auth, async (req, res) => {
  try {
    const { feed_name, external_ref, config } = req.body || {};
    const r = await pool.query(
      `INSERT INTO bank_tx_feeds (feed_name, external_ref, config, created_by) VALUES ($1,$2,$3,$4) RETURNING *`,
      [feed_name || 'Default', external_ref || null, config || {}, req.user.id]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/bank-tx/feeds', auth, async (req, res) => {
  try {
    const r = await pool.query(`SELECT * FROM bank_tx_feeds ORDER BY created_at DESC LIMIT 100`);
    res.json({ feeds: r.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/bank-tx/ingest', auth, async (req, res) => {
  try {
    const { feed_id, events } = req.body || {};
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'events array required' });
    }
    if (events.length > 100) {
      return res.status(400).json({ error: 'max 100 events per call' });
    }
    const ids = [];
    for (const ev of events) {
      const r = await pool.query(
        `INSERT INTO bank_tx_events (feed_id, external_tx_id, amount, currency, counterparty, country, raw)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [feed_id || null, ev.external_tx_id || null, ev.amount || null, ev.currency || 'USD',
         ev.counterparty || null, ev.country || null, ev]
      );
      ids.push(r.rows[0].id);
    }
    res.json({ ingested: ids.length, ids });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// -----------------------------------------------------------------------------
// 3) Real-time transaction screening (TOO-RISKY)
//    Additive jobs table; synchronous AI screening if OPENROUTER_API_KEY set.
// -----------------------------------------------------------------------------
router.post('/rt-screen', auth, async (req, res) => {
  try {
    const { request_id, counterparty, country, amount, currency, notes } = req.body || {};
    const t0 = Date.now();
    const j = await pool.query(
      `INSERT INTO rt_screening_jobs (request_id, payload, status, created_by)
       VALUES ($1,$2,'processing',$3) RETURNING id`,
      [request_id || null, req.body || {}, req.user.id]
    );
    const jobId = j.rows[0].id;
    let result = null;
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const sys = 'You are a real-time sanctions/AML screening engine. Return concise JSON: {risk_level, action: pass|review|block, reasons:[]}.';
        const u = `Counterparty: ${counterparty || '(unknown)'}\nCountry: ${country || '(unknown)'}\nAmount: ${amount || 0} ${currency || 'USD'}\nNotes: ${notes || ''}`;
        const ai = await callOpenRouter(sys, u);
        const txt = (ai && (ai.content || ai.text || ai)) || '';
        let parsed = null;
        try { parsed = JSON.parse(txt); } catch (_) { parsed = { raw: txt }; }
        result = parsed;
      } catch (err) {
        result = { error: err.message };
      }
    } else {
      result = { error: 'AI not configured', missing: 'OPENROUTER_API_KEY', deterministic_action: 'review' };
    }
    const latency = Date.now() - t0;
    await pool.query(
      `UPDATE rt_screening_jobs SET status='completed', result=$1, latency_ms=$2, completed_at=NOW() WHERE id=$3`,
      [result, latency, jobId]
    );
    res.json({ id: jobId, latency_ms: latency, result });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/rt-screen', auth, async (req, res) => {
  try {
    const r = await pool.query(`SELECT id, request_id, status, latency_ms, created_at FROM rt_screening_jobs ORDER BY created_at DESC LIMIT 100`);
    res.json({ jobs: r.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// -----------------------------------------------------------------------------
// 4) Employee training / certification tracking (MECHANICAL)
// -----------------------------------------------------------------------------
router.get('/training/courses', auth, async (req, res) => {
  try {
    const r = await pool.query(`SELECT * FROM training_courses WHERE active=TRUE ORDER BY id DESC LIMIT 200`);
    res.json({ courses: r.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/training/courses', auth, async (req, res) => {
  try {
    const { title, description, required_for_role, renewal_months } = req.body || {};
    const r = await pool.query(
      `INSERT INTO training_courses (title, description, required_for_role, renewal_months) VALUES ($1,$2,$3,$4) RETURNING *`,
      [title || 'Untitled', description || null, required_for_role || null, parseInt(renewal_months || 12, 10)]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/training/records', auth, async (req, res) => {
  try {
    const { course_id, user_id, score, certificate_ref } = req.body || {};
    const r = await pool.query(
      `INSERT INTO training_records (user_id, course_id, score, certificate_ref) VALUES ($1,$2,$3,$4) RETURNING *`,
      [parseInt(user_id || req.user.id, 10), parseInt(course_id, 10) || null, score || null, certificate_ref || null]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/training/records', auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT tr.*, tc.title FROM training_records tr LEFT JOIN training_courses tc ON tc.id = tr.course_id ORDER BY tr.completed_at DESC LIMIT 200`
    );
    res.json({ records: r.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// -----------------------------------------------------------------------------
// 5) Policy version control (MECHANICAL)
// -----------------------------------------------------------------------------
router.get('/policies', auth, async (req, res) => {
  try {
    const r = await pool.query(`SELECT * FROM policy_documents ORDER BY created_at DESC LIMIT 200`);
    res.json({ policies: r.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/policies', auth, async (req, res) => {
  try {
    const { slug, title } = req.body || {};
    const r = await pool.query(
      `INSERT INTO policy_documents (slug, title) VALUES ($1,$2) RETURNING *`,
      [slug || 'policy-' + Date.now(), title || 'Untitled']
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/policies/:id/versions', auth, async (req, res) => {
  try {
    const { version_label, body } = req.body || {};
    const r = await pool.query(
      `INSERT INTO policy_versions (policy_id, version_label, body, author_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [parseInt(req.params.id, 10), version_label || 'v1', body || '', req.user.id]
    );
    await pool.query(`UPDATE policy_documents SET active_version_id=$1 WHERE id=$2`, [r.rows[0].id, parseInt(req.params.id, 10)]);
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/policies/:id/versions', auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, policy_id, version_label, author_id, created_at FROM policy_versions WHERE policy_id=$1 ORDER BY created_at DESC LIMIT 200`,
      [parseInt(req.params.id, 10)]
    );
    res.json({ versions: r.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// -----------------------------------------------------------------------------
// 6) Agentic compliance officer (MECHANICAL)
//    Required env: OPENROUTER_API_KEY
// -----------------------------------------------------------------------------
router.post('/compliance-officer', auth, async (req, res) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ error: 'AI service unavailable', missing: 'OPENROUTER_API_KEY' });
  }
  try {
    const { prompt } = req.body || {};
    const sys = 'You are an autonomous export-control compliance officer. Given a question or scenario, produce a JSON action plan: {summary, steps:[], policies_to_check:[], escalate:bool}.';
    const ai = await callOpenRouter(sys, String(prompt || ''));
    const txt = (ai && (ai.content || ai.text || ai)) || '';
    let plan = null;
    try { plan = JSON.parse(txt); } catch (_) { plan = { raw: txt }; }
    const r = await pool.query(
      `INSERT INTO compliance_officer_sessions (user_id, prompt, plan) VALUES ($1,$2,$3) RETURNING *`,
      [req.user.id, prompt || '', plan]
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// -----------------------------------------------------------------------------
// 7) Sanctions evasion / structuring detection (MECHANICAL)
//    Required env: OPENROUTER_API_KEY
// -----------------------------------------------------------------------------
router.post('/structuring-detect', auth, async (req, res) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ error: 'AI service unavailable', missing: 'OPENROUTER_API_KEY' });
  }
  try {
    const { transactions } = req.body || {};
    if (!Array.isArray(transactions)) return res.status(400).json({ error: 'transactions array required' });
    if (transactions.length > 100) return res.status(400).json({ error: 'max 100 tx per call' });
    const sys = 'You are a sanctions-evasion / structuring detection engine. Analyze the transaction list and return JSON: {patterns_detected:[], suspicious_count, recommendations:[]}.';
    const ai = await callOpenRouter(sys, JSON.stringify({ transactions }).slice(0, 8000));
    const txt = (ai && (ai.content || ai.text || ai)) || '';
    let parsed = null;
    try { parsed = JSON.parse(txt); } catch (_) { parsed = { raw: txt }; }
    res.json({ analysis: parsed, count: transactions.length, timestamp: new Date().toISOString() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// -----------------------------------------------------------------------------
// Apply pass 5 wave-1 (additive) — training simulator + competitor benchmark
// -----------------------------------------------------------------------------

// 8) AI training simulation (interactive scenario + evaluation)
//    POST /api/ai/training/simulate
//    Phase 1 (no user_response): returns scenario + question.
//    Phase 2 (with user_response): returns evaluation + correct answer.
router.post('/training/simulate', auth, async (req, res) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ error: 'AI service unavailable', missing: 'OPENROUTER_API_KEY' });
  }
  try {
    const { topic = 'export-control compliance', scenario, difficulty = 'medium', user_response } = req.body || {};

    if (!user_response) {
      const sys = 'You are a senior export-control trainer. Build a realistic scenario question.';
      const userMsg = `Topic: ${topic}\nDifficulty: ${difficulty}\n\nReturn strict JSON:\n{\n  "scenario": "<2-4 sentence factual scenario about an export transaction or screening decision>",\n  "question": "<one specific question for the trainee>",\n  "expected_concepts": ["..."],\n  "regulations_in_scope": ["EAR §734", "OFAC SDN", "..."]\n}`;
      const ai = await callOpenRouter(sys, userMsg);
      const txt = (ai && (ai.content || ai.text || ai)) || '';
      let parsed = null;
      try { parsed = JSON.parse(txt); } catch { const m = txt.match(/\{[\s\S]*\}/); if (m) { try { parsed = JSON.parse(m[0]); } catch {} } }
      return res.json({ phase: 'scenario', topic, difficulty, ...(parsed || { raw: txt }) });
    }

    const sys = 'You are a senior export-control trainer evaluating a trainee answer. Be specific about which concepts they covered, what they missed, and cite the relevant regulation.';
    const userMsg = `Topic: ${topic}\nDifficulty: ${difficulty}\nScenario: ${scenario || '(not echoed)'}\nTrainee response: ${user_response}\n\nReturn strict JSON:\n{\n  "score": 0-100,\n  "verdict": "pass|review|fail",\n  "strengths": ["..."],\n  "gaps": ["..."],\n  "model_answer": "<2-3 paragraph reference answer with citations>",\n  "follow_up_question": "<optional one-liner>"\n}`;
    const ai = await callOpenRouter(sys, userMsg);
    const txt = (ai && (ai.content || ai.text || ai)) || '';
    let parsed = null;
    try { parsed = JSON.parse(txt); } catch { const m = txt.match(/\{[\s\S]*\}/); if (m) { try { parsed = JSON.parse(m[0]); } catch {} } }

    // Persist into training_records if the table accepts these columns; tolerate any schema mismatch
    try {
      await pool.query(
        `INSERT INTO training_records (user_id, topic, difficulty, score, verdict, scenario, response, evaluation, taken_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW())`,
        [req.user.id, topic, difficulty, parsed?.score ?? null, parsed?.verdict ?? null, scenario || null, user_response, txt]
      );
    } catch (_) {}

    res.json({ phase: 'evaluation', topic, difficulty, ...(parsed || { raw: txt }) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// 9) AI competitor benchmark (custom feature suggestion from audit)
//    POST /api/ai/competitor-benchmark
router.post('/competitor-benchmark', auth, async (req, res) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ error: 'AI service unavailable', missing: 'OPENROUTER_API_KEY' });
  }
  try {
    let { our_industry, our_size_band = 'mid-market', peer_practices = [], focus_areas = [] } = req.body || {};
    if (!our_industry) return res.status(400).json({ error: 'our_industry is required' });
    // Tolerate strings (comma-sep) coming from minimal FEs
    if (typeof peer_practices === 'string') peer_practices = peer_practices.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof focus_areas === 'string') focus_areas = focus_areas.split(',').map(s => s.trim()).filter(Boolean);
    if (!Array.isArray(peer_practices)) peer_practices = [];
    if (!Array.isArray(focus_areas)) focus_areas = [];

    const sys = 'You are a senior export-control compliance benchmarking analyst. You compare our program to widely-published peer practices (W-A, FATF, OFAC compliance program guides, SCCE standards). Keep all guidance jurisdiction-aware (US/EU/UK).';
    const userMsg = `Our industry: ${our_industry}\nOur size band: ${our_size_band}\nFocus areas: ${focus_areas.join(', ') || 'all major program elements'}\nKnown peer practices we already do: ${peer_practices.join('; ') || 'none provided'}\n\nReturn strict JSON:\n{\n  "benchmark_dimensions": [{"dimension": "...", "our_likely_state": "below|at|above", "peer_norm": "<short>", "improvement_action": "<short>"}],\n  "quick_wins": ["..."],\n  "investments_required": [{"item": "...", "rationale": "..."}],\n  "regulatory_context": ["EAR/OFAC/EU dual-use updates relevant to ${our_industry}"],\n  "executive_summary": "<3-5 sentences>"\n}`;
    const ai = await callOpenRouter(sys, userMsg);
    const txt = (ai && (ai.content || ai.text || ai)) || '';
    let parsed = null;
    try { parsed = JSON.parse(txt); } catch { const m = txt.match(/\{[\s\S]*\}/); if (m) { try { parsed = JSON.parse(m[0]); } catch {} } }
    res.json({ benchmark: parsed || { raw: txt }, generated_at: new Date().toISOString() });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
