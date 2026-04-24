import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^[•\-\*] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/^(?!<[hulo]|<hr|<li)(.+)$/gm, '<p>$1</p>')
    .replace(/<p>\s*<\/p>/g, '');
  return html;
}

// Map resource names to display labels and which field to show
const DATA_SOURCE_CONFIG = {
  'sanctioned-entities': { label: 'Sanctioned Entities', displayField: 'entity_name', subField: 'country' },
  'denied-parties': { label: 'Denied Parties', displayField: 'party_name', subField: 'country' },
  'restricted-countries': { label: 'Restricted Countries', displayField: 'country_name', subField: 'embargo_level' },
  'controlled-items': { label: 'Controlled Items', displayField: 'item_name', subField: 'eccn' },
  'transactions': { label: 'Transactions', displayField: 'transaction_ref', subField: 'consignee_name' },
  'export-licenses': { label: 'Export Licenses', displayField: 'license_number', subField: 'applicant_name' },
  'compliance-documents': { label: 'Compliance Documents', displayField: 'document_name', subField: 'document_type' },
  'restricted-end-uses': { label: 'Restricted End Uses', displayField: 'end_use_name', subField: 'category' },
  'screening-results': { label: 'Screening Results', displayField: 'entity_screened', subField: 'screening_type' },
  'audit-logs': { label: 'Audit Logs', displayField: 'action', subField: 'details' },
};

export default function AIFeature({ title, description, endpoint, fields, samples, dataSources, dataFieldMap }) {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadedData, setLoadedData] = useState({});
  const [expandedSource, setExpandedSource] = useState(null);

  // Load data from related tables
  useEffect(() => {
    if (!dataSources || dataSources.length === 0) return;
    dataSources.forEach(src => {
      api.getAll(src).then(data => {
        setLoadedData(prev => ({ ...prev, [src]: data }));
      }).catch(() => {});
    });
  }, [dataSources]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.ai[endpoint](form);
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const loadSample = (sample) => {
    setForm(sample.data);
    setResult(null);
    setError('');
  };

  const fillFromRecord = (source, record) => {
    if (!dataFieldMap || !dataFieldMap[source]) return;
    const mapping = dataFieldMap[source];
    const newForm = { ...form };
    Object.entries(mapping).forEach(([formKey, recordKey]) => {
      if (record[recordKey] !== undefined && record[recordKey] !== null) {
        newForm[formKey] = String(record[recordKey]);
      }
    });
    setForm(newForm);
    setExpandedSource(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="ai-page">
      <div className="ai-header">
        <h1>{title} <span className="ai-badge">AI POWERED</span></h1>
        <p>{description}</p>
      </div>

      {/* Sample Data Buttons */}
      {samples && samples.length > 0 && (
        <div className="ai-samples">
          <div className="ai-samples-label">Load Sample Data:</div>
          <div className="ai-samples-grid">
            {samples.map((sample, i) => (
              <button key={i} className="sample-btn" onClick={() => loadSample(sample)}>
                <span className="sample-btn-icon">S{i + 1}</span>
                <span className="sample-btn-text">
                  <strong>{sample.name}</strong>
                  <small>{sample.desc}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Data Source Dropdowns */}
      {dataSources && dataSources.length > 0 && (
        <div className="ai-data-sources">
          <div className="ai-samples-label">Load from Database:</div>
          <div className="data-source-tabs">
            {dataSources.map(src => {
              const config = DATA_SOURCE_CONFIG[src];
              const data = loadedData[src] || [];
              const isExpanded = expandedSource === src;
              return (
                <div key={src} className="data-source-group">
                  <button
                    className={`data-source-tab ${isExpanded ? 'active' : ''}`}
                    onClick={() => setExpandedSource(isExpanded ? null : src)}
                  >
                    {config?.label || src} ({data.length})
                    <span className="tab-arrow">{isExpanded ? '\u25B2' : '\u25BC'}</span>
                  </button>
                  {isExpanded && (
                    <div className="data-source-dropdown">
                      {data.length === 0 ? (
                        <div className="dropdown-empty">No data available</div>
                      ) : (
                        data.map((record, idx) => (
                          <button
                            key={idx}
                            className="dropdown-item"
                            onClick={() => fillFromRecord(src, record)}
                          >
                            <span className="dropdown-item-main">
                              {record[config?.displayField] || `Record #${record.id}`}
                            </span>
                            <span className="dropdown-item-sub">
                              {record[config?.subField] || ''}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {fields.length > 0 ? (
        <form className="ai-form" onSubmit={handleSubmit}>
          {fields.map(f => (
            <div className="form-group" key={f.key}>
              <label>{f.label}{f.required && ' *'}</label>
              {f.type === 'textarea' ? (
                <textarea
                  value={form[f.key] || ''}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              ) : f.type === 'select' ? (
                <select
                  value={form[f.key] || ''}
                  onChange={e => setForm({...form, [f.key]: e.target.value})}
                  required={f.required}
                >
                  <option value="">Select...</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.key] || ''}
                  onChange={e => setForm({...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value})}
                  placeholder={f.placeholder}
                  required={f.required}
                />
              )}
            </div>
          ))}
          <button type="submit" className="ai-submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Run AI Analysis'}
          </button>
        </form>
      ) : (
        <div className="ai-form">
          <p style={{ marginBottom: 16, color: '#9ca3af' }}>Click below to run AI analysis on current system data.</p>
          <button className="ai-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Generating...' : 'Run AI Analysis'}
          </button>
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {loading && (
        <div className="ai-loading">
          <div className="spinner"></div>
          AI is analyzing... This may take a moment.
        </div>
      )}

      {result && (
        <div className="ai-result">
          <div className="ai-result-header">
            <h3>AI Analysis Result</h3>
            <span className="ai-result-timestamp">
              {result.timestamp || result.generated_at ? new Date(result.timestamp || result.generated_at).toLocaleString() : new Date().toLocaleString()}
            </span>
          </div>
          <div className="ai-result-body">
            <div
              className="ai-result-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result.analysis || result.report || '') }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
