const API_BASE = 'http://localhost:4000/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: getHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // CRUD helpers
  getAll: (resource) => request(`/${resource}`),
  getOne: (resource, id) => request(`/${resource}/${id}`),
  create: (resource, data) => request(`/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
  update: (resource, id, data) => request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (resource, id) => request(`/${resource}/${id}`, { method: 'DELETE' }),

  // Dashboard
  getStats: () => request('/dashboard/stats'),

  // AI endpoints
  ai: {
    screenEntity: (data) => request('/ai/screen-entity', { method: 'POST', body: JSON.stringify(data) }),
    classifyItem: (data) => request('/ai/classify-item', { method: 'POST', body: JSON.stringify(data) }),
    assessTransaction: (data) => request('/ai/assess-transaction', { method: 'POST', body: JSON.stringify(data) }),
    countryRisk: (data) => request('/ai/country-risk', { method: 'POST', body: JSON.stringify(data) }),
    endUseAnalysis: (data) => request('/ai/end-use-analysis', { method: 'POST', body: JSON.stringify(data) }),
    reviewDocument: (data) => request('/ai/review-document', { method: 'POST', body: JSON.stringify(data) }),
    dualUseCheck: (data) => request('/ai/dual-use-check', { method: 'POST', body: JSON.stringify(data) }),
    generateReport: () => request('/ai/generate-report', { method: 'POST', body: JSON.stringify({}) }),
    licenseRecommendation: (data) => request('/ai/license-recommendation', { method: 'POST', body: JSON.stringify(data) }),
    deniedPartySearch: (data) => request('/ai/denied-party-search', { method: 'POST', body: JSON.stringify(data) }),
    sanctionsAnalysis: (data) => request('/ai/sanctions-analysis', { method: 'POST', body: JSON.stringify(data) }),
    transactionPatterns: () => request('/ai/transaction-patterns', { method: 'POST', body: JSON.stringify({}) }),
    redFlagDetect: (data) => request('/ai/red-flag-detect', { method: 'POST', body: JSON.stringify(data) }),
    complianceGaps: () => request('/ai/compliance-gaps', { method: 'POST', body: JSON.stringify({}) }),
    regulatoryUpdates: (data) => request('/ai/regulatory-updates', { method: 'POST', body: JSON.stringify(data) }),
    penaltyRisk: (data) => request('/ai/penalty-risk', { method: 'POST', body: JSON.stringify(data) }),
    routeAnalysis: (data) => request('/ai/route-analysis', { method: 'POST', body: JSON.stringify(data) }),
    auditAnalysis: () => request('/ai/audit-analysis', { method: 'POST', body: JSON.stringify({}) }),
    screeningReview: () => request('/ai/screening-review', { method: 'POST', body: JSON.stringify({}) }),
    licenseMonitor: () => request('/ai/license-monitor', { method: 'POST', body: JSON.stringify({}) }),
    embargoImpact: (data) => request('/ai/embargo-impact', { method: 'POST', body: JSON.stringify(data) }),
    trainingGenerator: (data) => request('/ai/training-generator', { method: 'POST', body: JSON.stringify(data) }),
    eccnLookup: (data) => request('/ai/eccn-lookup', { method: 'POST', body: JSON.stringify(data) }),
    vsdAdvisor: (data) => request('/ai/vsd-advisor', { method: 'POST', body: JSON.stringify(data) }),
    bulkScreen: (data) => request('/ai/bulk-screen', { method: 'POST', body: JSON.stringify(data) }),
    complianceAlertDashboard: () => request('/ai/compliance-alert-dashboard', { method: 'POST', body: JSON.stringify({}) }),
    transactionAutoScreen: (data) => request('/ai/transaction-auto-screen', { method: 'POST', body: JSON.stringify(data) }),
    beneficialOwnershipAnalyze: (data) => request('/ai/beneficial-ownership-analyze', { method: 'POST', body: JSON.stringify(data) }),
    supplyChainTrace: (data) => request('/ai/supply-chain-trace', { method: 'POST', body: JSON.stringify(data) }),
    // Apply pass 5 wave-1
    trainingSimulate: (data) => request('/ai/training/simulate', { method: 'POST', body: JSON.stringify(data) }),
    competitorBenchmark: (data) => request('/ai/competitor-benchmark', { method: 'POST', body: JSON.stringify(data) }),
  },
};
