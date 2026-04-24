import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

function formatValue(val, key) {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'boolean') return <span className={val ? 'bool-true' : 'bool-false'}>{val ? 'Yes' : 'No'}</span>;
  if (key === 'value_usd' && val) return `$${Number(val).toLocaleString()}`;
  if (key === 'risk_score' && val !== null) {
    const level = val >= 90 ? 'critical' : val >= 70 ? 'high' : val >= 40 ? 'medium' : 'low';
    return (
      <span>
        <span className={`risk-bar risk-${level}`}><span className="risk-bar-fill"></span></span>
        {val}
      </span>
    );
  }
  if (['status','screening_status','risk_level','compliance_status','embargo_level','risk_tier'].includes(key)) {
    return <span className={`badge badge-${String(val).toLowerCase().replace(/\s/g,'_')}`}>{String(val).replace(/_/g, ' ')}</span>;
  }
  if (key === 'match_found') return <span className={val ? 'bool-true' : 'bool-false'}>{val ? 'MATCH' : 'Clear'}</span>;
  if (key === 'dual_use') return <span className={val ? 'bool-true' : 'bool-false'}>{val ? 'Dual-Use' : 'No'}</span>;
  if (key === 'match_score' && val) return `${val}%`;
  const str = String(val);
  if (str.length > 50) return str.substring(0, 50) + '...';
  return str;
}

function formatLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function CrudPage({ resource, title, fields, columns, readOnly = false }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const data = await api.getAll(resource);
      setItems(data);
    } catch (err) { setError(err.message); }
  }, [resource]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRowClick = (item) => {
    setSelected(item);
    setEditing(false);
  };

  const handleEdit = () => {
    setForm({ ...selected });
    setEditing(true);
  };

  const handleCreate = () => {
    const initial = {};
    fields.forEach(f => { initial[f.key] = f.type === 'boolean' ? false : ''; });
    setForm(initial);
    setCreating(true);
    setSelected(null);
  };

  const handleSave = async () => {
    try {
      if (creating) {
        await api.create(resource, form);
        setCreating(false);
      } else {
        const { id, created_at, updated_at, ...data } = form;
        await api.update(resource, selected.id, data);
        setSelected(null);
        setEditing(false);
      }
      loadData();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(resource, selected.id);
      setSelected(null);
      loadData();
    } catch (err) { setError(err.message); }
  };

  const renderForm = () => (
    <div className="modal-overlay" onClick={() => { setCreating(false); setEditing(false); }}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{creating ? 'New Item' : 'Edit Item'}</h2>
          <button className="modal-close" onClick={() => { setCreating(false); setEditing(false); }}>&times;</button>
        </div>
        <div className="modal-body">
          {error && <div className="error-msg">{error}</div>}
          {fields.map(f => (
            <div className="form-group" key={f.key}>
              <label>{f.label}{f.required && ' *'}</label>
              {f.type === 'textarea' ? (
                <textarea value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})} />
              ) : f.type === 'select' ? (
                <select value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: e.target.value})}>
                  <option value="">Select...</option>
                  {f.options.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                </select>
              ) : f.type === 'boolean' ? (
                <select value={form[f.key] ? 'true' : 'false'} onChange={e => setForm({...form, [f.key]: e.target.value === 'true'})}>
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              ) : (
                <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm({...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value})} />
              )}
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-edit" onClick={handleSave}>Save</button>
          <button className="btn-cancel" onClick={() => { setCreating(false); setEditing(false); }}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selected) return null;
    const allKeys = Object.keys(selected).filter(k => k !== 'id');
    return (
      <div className="modal-overlay" onClick={() => setSelected(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Details</h2>
            <button className="modal-close" onClick={() => setSelected(null)}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="detail-grid">
              {allKeys.map(k => (
                <div className={`detail-item ${['reason','description','content','ai_analysis','recommendation','notes','indicators','mitigation_measures','conditions','technical_specs','review_notes','aliases','details'].includes(k) ? 'full-width' : ''}`} key={k}>
                  <div className="detail-label">{formatLabel(k)}</div>
                  <div className="detail-value">{selected[k] === null ? '-' : String(selected[k])}</div>
                </div>
              ))}
            </div>
          </div>
          {!readOnly && (
            <div className="modal-actions">
              <button className="btn-edit" onClick={handleEdit}>Edit</button>
              <button className="btn-delete" onClick={handleDelete}>Delete</button>
              <button className="btn-cancel" onClick={() => setSelected(null)}>Close</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1>{title}</h1>
        {!readOnly && <button className="btn-new" onClick={handleCreate}>+ New Item</button>}
      </div>
      {error && <div className="error-msg">{error}</div>}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(c => <th key={c}>{formatLabel(c)}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} onClick={() => handleRowClick(item)}>
                {columns.map(c => <td key={c}>{formatValue(item[c], c)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && !editing && renderDetail()}
      {(editing || creating) && renderForm()}
    </div>
  );
}
