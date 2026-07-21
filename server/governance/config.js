module.exports = {
  caseType: 'trade_screening_case', initialState: 'ingested',
  states: ['ingested', 'screened', 'escalated', 'dual_review', 'released', 'blocked', 'filed'],
  createRoles: ['trade_operator', 'compliance_officer', 'admin'],
  evidenceKinds: ['party_snapshot', 'item_classification', 'list_version', 'match_explanation', 'license_document', 'filing_receipt'],
  requiredSignals: ['listVersion', 'ruleEffectiveAt', 'matchScore', 'jurisdiction', 'policyVersion'],
  transitions: [
    { from: 'ingested', action: 'screen', to: 'screened', roles: ['trade_operator', 'compliance_officer'], requiresEvidence: true },
    { from: 'screened', action: 'escalate', to: 'escalated', roles: ['trade_operator', 'compliance_officer'], requiresEvidence: true },
    { from: 'escalated', action: 'request_dual_review', to: 'dual_review', roles: ['compliance_officer'], requiresEvidence: true },
    { from: 'dual_review', action: 'release', to: 'released', roles: ['senior_compliance_officer'], requiresEvidence: true, dualControl: true },
    { from: 'dual_review', action: 'block', to: 'blocked', roles: ['senior_compliance_officer'], requiresEvidence: true, dualControl: true },
    { from: 'released', action: 'record_filing', to: 'filed', roles: ['compliance_officer'], requiresEvidence: true, dualControl: true },
  ],
  assess: (x) => ({ disposition: Number(x.matchScore) > 0 ? 'expert_review_required' : 'no_candidate_match', legalDetermination: null, source: { listVersion: x.listVersion, ruleEffectiveAt: x.ruleEffectiveAt } }),
};
