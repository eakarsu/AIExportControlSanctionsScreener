# Audit Notes — AIExportControlSanctionsScreener

Audit source: `_AUDIT/reports/batch_03.md` § 23 (substantive, 26 AI endpoints).

## Original audit recommendations

### Missing AI counterparts
- `/beneficial-ownership-analyze` — analyze ownership chains.
- `/supply-chain-trace` — trace supply chains for sanction exposure.

### Missing non-AI features
- Bank transaction monitoring integration.
- Denied-party list auto-sync (OFAC / BIS).
- Employee training / certification tracking.
- Policy version control.

### Custom feature suggestions
- Agentic compliance officer.
- Real-time transaction screening.
- Supply-chain transparency (tier-1, tier-2 vendor screening).
- Sanctions evasion / structuring detection.
- Beneficial-ownership AI.
- Competitor benchmarking.
- Training simulation.

## Implementations applied this pass

None — 26 AI endpoints already cover entity-screening, screen-entity,
classify-item, transaction-risk, assess-transaction, country-risk,
end-use-analysis, review-document, dual-use-check, generate-report,
license-recommendation, denied-party-search, sanctions-analysis,
transaction-patterns, red-flag-detect, compliance-gaps, regulatory-updates,
penalty-risk, route-analysis, audit-analysis, screening-review,
license-monitor, embargo-impact, training-generator, eccn-lookup,
vsd-advisor.

## Prioritized backlog

1. **MECHANICAL** — Add `/api/ai/beneficial-ownership-analyze` taking
   `{ entity_id }` and an optional ownership-tree input, returning
   ultimate-beneficial-owner risk analysis.
2. **MECHANICAL** — Add `/api/ai/supply-chain-trace` taking a vendor list
   and returning tier-by-tier exposure mapping.
3. **NEEDS-CREDS** — Auto-sync of OFAC / BIS lists requires a scheduled
   ingest job and (free) HTTPS access; pure-AI scope wouldn't add value
   without that ingest.
4. **NEEDS-PRODUCT-DECISION** — Bank-transaction monitoring integration
   is per-bank and per-jurisdiction.
5. **TOO-RISKY** — Real-time transaction screening at scale requires
   latency / availability SLOs not yet defined.

## Apply pass 3 (frontend)

- **FE stack:** CRA React 18 (`client/`) — fetch-based `services/api.js`.
- **Action:** UPDATED-FE — added wiring for three previously orphaned endpoints in `routes/aiNew.js`.
- **Files modified:**
  - `client/src/services/api.js` — added `ai.bulkScreen`, `ai.complianceAlertDashboard`, `ai.transactionAutoScreen`.
  - `client/src/pages/AIBulkScreen.js` (NEW) — JSON-array input with per-entity result render (matches existing styling).
  - `client/src/App.js` — three new routes (`/ai/bulk-screen`, `/ai/compliance-alert-dashboard`, `/ai/transaction-auto-screen`) and a new "AI BATCH & DASHBOARD" sidebar section.
- The two simpler endpoints reuse the existing `<AIFeature>` component; bulk-screen needed a dedicated page for the array-of-entities body.
- JWT Bearer is added by the existing `getHeaders()` helper. 503/no-key handling: AIBulkScreen detects "503", "unavailable", or "OPENROUTER" in the error and surfaces a friendly message.
- Server already mounts `routes/aiNew.js` at `/api/ai`.
- Syntax check: `@babel/parser` (jsx plugin) PASS on App.js and AIBulkScreen.js.

## Apply pass 4 (mechanical backlog)

Added the two MECHANICAL items from the prioritized backlog: beneficial-ownership analysis and supply-chain trace.

**Backend (`server/routes/aiNew.js`):**
- `POST /api/ai/beneficial-ownership-analyze` — body `{ entity_name, country?, ownership_tree?, notes? }`. Pulls sanctioned-entities + denied-parties from DB, calls `callOpenRouter`, persists result to `screening_results` (type `beneficial_ownership_analysis`). Returns `{ entity_name, country, screening_id, analysis, timestamp }`.
- `POST /api/ai/supply-chain-trace` — body `{ product?, vendors:[{name,country,tier?}] (1..30), destination?, notes? }`. Pulls sanctioned/denied/restricted-country lists, calls `callOpenRouter`, returns `{ product, destination, vendor_count, analysis, timestamp }`.
- Both endpoints early-return **HTTP 503** when `OPENROUTER_API_KEY` is missing, addressing the pass-3 backend-hardening backlog for these two routes specifically.

**Frontend:**
- `client/src/services/api.js` — added `ai.beneficialOwnershipAnalyze`, `ai.supplyChainTrace` (JWT bearer attached via existing `getHeaders()`).
- `client/src/pages/AISupplyChainTrace.js` (NEW) — JSON-array vendor input with product/destination/notes fields, per-error 503 handling, monospace JSON textarea (mirrors existing `AIBulkScreen.js`).
- `client/src/App.js` — two new routes (`/ai/beneficial-ownership-analyze` reuses existing `<AIFeature>`; `/ai/supply-chain-trace` uses the new dedicated page) + two new sidebar links under "AI BATCH & DASHBOARD".

**Smoke test (5/8/2026, OPENROUTER_API_KEY set):**
- `pkill` on 4000 → start `node index.js` → login `admin@exportcontrol.com / password` → `POST /api/ai/beneficial-ownership-analyze` returns HTTP 200 with persisted `screening_id` and full analysis → `POST /api/ai/supply-chain-trace` returns HTTP 200 with `vendor_count: 1` and full analysis → cleanup.

**Syntax check:** `node --check` PASS on `aiNew.js`. `@babel/parser` (jsx plugin) PASS on `App.js`, `AISupplyChainTrace.js`, `api.js`.

**Backlog still deferred:** OFAC/BIS auto-sync (NEEDS-CREDS), bank-tx monitoring integration (NEEDS-PRODUCT-DECISION), real-time tx screening at scale (TOO-RISKY). The other audit "Custom feature suggestions" (agentic compliance officer, training simulation, competitor benchmarking) overlap with already-shipped endpoints.
