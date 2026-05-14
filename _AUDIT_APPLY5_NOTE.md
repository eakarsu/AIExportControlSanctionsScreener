# Apply Pass 5 wave-1 — AIExportControlSanctionsScreener

- **Date:** 2026-05-08
- **Project:** AIExportControlSanctionsScreener
- **Stack:** Node.js + Express, PostgreSQL, React (CRA frontend).
- **Audit source:** `_AUDIT/reports/batch_03.md` § 23.

## Verified-present (from prior passes)

- 26 AI endpoints in `server/routes/ai.js` (entity-screening, classify-item, transaction-risk, country-risk, end-use-analysis, review-document, dual-use-check, generate-report, license-recommendation, denied-party-search, sanctions-analysis, transaction-patterns, red-flag-detect, compliance-gaps, regulatory-updates, penalty-risk, route-analysis, audit-analysis, screening-review, license-monitor, embargo-impact, training-generator, eccn-lookup, vsd-advisor + assess-transaction + screen-entity).
- `server/routes/aiNew.js`: bulk-screen, compliance-alert-dashboard, transaction-auto-screen, beneficial-ownership-analyze, supply-chain-trace.
- `server/routes/extensions.js` (already labelled "Apply pass 5"): sanctions-sync, bank-tx feeds + ingest, rt-screen, training/courses, training/records, policies + versions, compliance-officer (agentic), structuring-detect.

The audit's two "missing AI counterparts" (`/beneficial-ownership-analyze`, `/supply-chain-trace`) are present. The audit's seven "Custom feature suggestions" map onto: agentic compliance officer (present), real-time tx screening (`rt-screen` present), supply-chain transparency (present), sanctions evasion / structuring (present), beneficial-ownership AI (present). Two remained: training simulation, competitor benchmarking.

## Implemented this pass (2 features, MECHANICAL)

| # | Item | File | Endpoint |
|---|------|------|----------|
| 1 | AI compliance training simulator (scenario + answer-evaluation) | `server/routes/extensions.js` (appended) | `POST /api/ai/training/simulate` |
| 2 | AI competitor compliance benchmark | `server/routes/extensions.js` (appended) | `POST /api/ai/competitor-benchmark` |

Both:
- Reuse existing `auth` middleware + `callOpenRouter`.
- Return **HTTP 503** with `missing: 'OPENROUTER_API_KEY'` when the key is missing (matches the file's pattern).
- Tolerant input parsing (`competitor-benchmark` accepts comma-sep strings or arrays).
- `training/simulate` persists evaluation phases into `training_records` if the table exists; tolerant of schema mismatch.
- Both include "no specific legal advice" framing in their prompts and request strict JSON output.

**Frontend:**
- `client/src/services/api.js` — added `ai.trainingSimulate` and `ai.competitorBenchmark`.
- `client/src/App.js` — sidebar links + two new routes under "AI BATCH & DASHBOARD" using existing `<AIFeature>` component.

## Deferred backlog

| Item | Category | Reason |
|------|----------|--------|
| Real OFAC / BIS auto-sync ingestion | NEEDS-CREDS | `OFAC_API_KEY` / `BIS_API_KEY` env vars already gated; live ingest cron is operational scope. |
| Bank-transaction monitoring integration | NEEDS-PRODUCT-DECISION | Per-bank webhook contracts undefined. |
| Real-time tx screening at scale (SLOs) | TOO-RISKY | Latency / availability budget not yet defined. |

## Files changed

- `server/routes/extensions.js` (+~75 lines, two new endpoints appended)
- `client/src/services/api.js` (+3 lines)
- `client/src/App.js` (+2 sidebar links + ~36 lines for two new routes)

## Smoke test

- `node --check server/routes/extensions.js` -> OK.
- `@babel/parser` (jsx) parse on `App.js` and `services/api.js` -> OK.
- 503-on-no-key contract preserved.
