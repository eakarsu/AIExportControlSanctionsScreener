import React, { useState } from 'react';
import { api } from '../services/api';

// /ai/supply-chain-trace — JSON-array vendor input (tier-by-tier)
// JWT Bearer is attached automatically by services/api.js.
const SAMPLE_VENDORS = JSON.stringify([
  { name: 'Apex Components Ltd', country: 'Taiwan', tier: 1 },
  { name: 'Northern Steel Co', country: 'China', tier: 2 },
  { name: 'Global Logistics Hub DMCC', country: 'UAE', tier: 2 },
  { name: 'Eastern Foundry GmbH', country: 'Germany', tier: 3 },
], null, 2);

export default function AISupplyChainTrace() {
  const [product, setProduct] = useState('Industrial CNC controller');
  const [destination, setDestination] = useState('United States');
  const [notes, setNotes] = useState('');
  const [vendorsText, setVendorsText] = useState(SAMPLE_VENDORS);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    let vendors;
    try {
      vendors = JSON.parse(vendorsText);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      return;
    }
    if (!Array.isArray(vendors) || vendors.length === 0) {
      setError('Provide an array with at least one vendor.');
      return;
    }
    if (vendors.length > 30) {
      setError('Max 30 vendors per request.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.ai.supplyChainTrace({ product, destination, notes, vendors });
      setResult(data);
    } catch (err) {
      const msg = err.message || 'Request failed';
      if (/503|unavailable|no api key|OPENROUTER/i.test(msg)) {
        setError('AI service unavailable. Set OPENROUTER_API_KEY on the backend, then retry.');
      } else {
        setError(msg);
      }
    }
    setLoading(false);
  };

  return (
    <div className="ai-page">
      <div className="ai-header">
        <h1>AI Supply-Chain Trace <span className="ai-badge">AI POWERED</span></h1>
        <p>Trace tier-by-tier vendor exposure to sanctioned/denied parties and restricted countries.</p>
      </div>
      <form className="ai-form" onSubmit={submit}>
        <div className="form-group">
          <label>Product</label>
          <input value={product} onChange={e => setProduct(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Final destination</label>
          <input value={destination} onChange={e => setDestination(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
        </div>
        <div className="form-group">
          <label>Vendors JSON (array of {'{ name, country, tier }'}, max 30) *</label>
          <textarea
            value={vendorsText}
            onChange={e => setVendorsText(e.target.value)}
            rows={12}
            required
            style={{ fontFamily: 'monospace' }}
          />
        </div>
        <button type="submit" className="ai-submit" disabled={loading}>
          {loading ? 'Tracing...' : 'Run Supply-Chain Trace'}
        </button>
      </form>
      {error && <div className="error-msg">{error}</div>}
      {loading && (
        <div className="ai-loading">
          <div className="spinner"></div>
          AI is tracing supply chain...
        </div>
      )}
      {result && (
        <div className="ai-result">
          <div className="ai-result-header">
            <h3>Supply-Chain Trace — {result.vendor_count ?? 0} vendor(s)</h3>
            <span className="ai-result-timestamp">
              {result.timestamp ? new Date(result.timestamp).toLocaleString() : ''}
            </span>
          </div>
          <div className="ai-result-body">
            <pre style={{ whiteSpace: 'pre-wrap' }}>{result.analysis}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
