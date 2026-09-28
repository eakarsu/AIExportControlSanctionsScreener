import React, { useState } from 'react';
import { api } from '../services/api';
import AIScenarioButtons from '../components/AIScenarioButtons';

// /ai/supply-chain-trace — JSON-array vendor input (tier-by-tier)
// JWT Bearer is attached automatically by services/api.js.
const SCENARIOS = [
  { name: 'CNC controller', desc: 'Multi-tier industrial electronics', product: 'Industrial CNC controller', destination: 'United States', notes: '', vendors: [
    { name: 'Apex Components Ltd', country: 'Taiwan', tier: 1 },
    { name: 'Northern Steel Co', country: 'China', tier: 2 },
    { name: 'Global Logistics Hub DMCC', country: 'UAE', tier: 2 },
    { name: 'Eastern Foundry GmbH', country: 'Germany', tier: 3 },
  ] },
  { name: 'Aerospace assembly', desc: 'Defense-adjacent tier-N suppliers', product: 'Commercial avionics assembly', destination: 'United Kingdom', notes: 'Evaluate military end-use and re-export exposure.', vendors: [
    { name: 'Atlantic Avionics plc', country: 'United Kingdom', tier: 1 },
    { name: 'Anatolia Precision AS', country: 'Turkey', tier: 2 },
    { name: 'Volga Titanium Works', country: 'Russia', tier: 3 },
  ] },
  { name: 'Semiconductor tools', desc: 'Advanced-node manufacturing chain', product: 'Deep-UV lithography subsystem', destination: 'Taiwan', notes: 'Check advanced-computing and semiconductor manufacturing controls.', vendors: [
    { name: 'Formosa Fab Systems', country: 'Taiwan', tier: 1 },
    { name: 'Shenzhen Optics Ltd', country: 'China', tier: 2 },
    { name: 'Pacific Motion KK', country: 'Japan', tier: 2 },
  ] },
  { name: 'Transshipment route', desc: 'Unknown end user through intermediaries', product: 'High-speed digital oscilloscopes', destination: 'UAE', notes: 'Final end user was not disclosed; shipment may be re-exported.', vendors: [
    { name: 'Gulf Re-Export Services', country: 'UAE', tier: 1 },
    { name: 'Caspian Technical Trading', country: 'Kazakhstan', tier: 2 },
    { name: 'Unnamed End User', country: '', tier: 3 },
  ] },
];

export default function AISupplyChainTrace() {
  const [product, setProduct] = useState(SCENARIOS[0].product);
  const [destination, setDestination] = useState(SCENARIOS[0].destination);
  const [notes, setNotes] = useState(SCENARIOS[0].notes);
  const [vendorsText, setVendorsText] = useState(JSON.stringify(SCENARIOS[0].vendors, null, 2));
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
      <AIScenarioButtons samples={SCENARIOS} onSelect={(sample) => {
        setProduct(sample.product);
        setDestination(sample.destination);
        setNotes(sample.notes);
        setVendorsText(JSON.stringify(sample.vendors, null, 2));
        setResult(null);
        setError('');
      }} />
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
