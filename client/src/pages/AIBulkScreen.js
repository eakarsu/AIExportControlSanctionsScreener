import React, { useState } from 'react';
import { api } from '../services/api';

// Minimal page for /ai/bulk-screen — accepts an array of entities (max 10)
// JWT is sent automatically via api.js (Bearer from localStorage).
const SAMPLE = JSON.stringify([
  { name: 'Acme Trading LLC', country: 'UAE', entity_type: 'Trading Company' },
  { name: 'Northern Steel Co', country: 'Russia', entity_type: 'Manufacturer' },
  { name: 'Global Logistics Ltd', country: 'Turkey', entity_type: 'Freight Forwarder' },
], null, 2);

export default function AIBulkScreen() {
  const [text, setText] = useState(SAMPLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    let entities;
    try {
      entities = JSON.parse(text);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      return;
    }
    if (!Array.isArray(entities) || entities.length === 0) {
      setError('Provide an array with at least one entity.');
      return;
    }
    if (entities.length > 10) {
      setError('Max 10 entities.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.ai.bulkScreen({ entities });
      setResult(data);
    } catch (err) {
      const msg = err.message || 'Request failed';
      // 503-no-key handling — server returns "AI service unavailable" or similar.
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
        <h1>AI Bulk Entity Screening <span className="ai-badge">AI POWERED</span></h1>
        <p>Screen up to 10 entities in one batch against sanctions and denied-party lists.</p>
      </div>
      <form className="ai-form" onSubmit={submit}>
        <div className="form-group">
          <label>Entities JSON (array of {'{ name, country, entity_type }'}, max 10) *</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={12}
            required
            style={{ fontFamily: 'monospace' }}
          />
        </div>
        <button type="submit" className="ai-submit" disabled={loading}>
          {loading ? 'Screening...' : 'Run Bulk Screen'}
        </button>
      </form>
      {error && <div className="error-msg">{error}</div>}
      {loading && (
        <div className="ai-loading">
          <div className="spinner"></div>
          AI is screening entities...
        </div>
      )}
      {result && (
        <div className="ai-result">
          <div className="ai-result-header">
            <h3>Bulk Screen Result — {result.matches_found ?? 0} match(es) of {result.total_screened ?? 0}</h3>
            <span className="ai-result-timestamp">
              {result.timestamp ? new Date(result.timestamp).toLocaleString() : ''}
            </span>
          </div>
          <div className="ai-result-body">
            {(result.results || []).map((r, idx) => (
              <div key={idx} style={{ border: '1px solid #374151', padding: 12, marginBottom: 12, borderRadius: 6 }}>
                <div><strong>{r.entity_name || '(unnamed)'}</strong> — {r.country || '?'}</div>
                {r.error ? (
                  <div className="error-msg">{r.error}</div>
                ) : (
                  <>
                    <div>Risk: {r.risk_level || 'n/a'} | Match: {r.match_found ? 'YES' : 'no'} | Score: {r.match_score ?? '-'}</div>
                    {r.matched_entity && <div>Matched: {r.matched_entity}</div>}
                    {r.recommendation && <div><em>Recommendation:</em> {r.recommendation}</div>}
                    {r.analysis && (
                      <details style={{ marginTop: 8 }}>
                        <summary>Full analysis</summary>
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{r.analysis}</pre>
                      </details>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
