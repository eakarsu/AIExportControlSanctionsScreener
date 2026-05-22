import React, { useEffect, useState } from 'react';

export default function LicenseExceptionAudit() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/license-exception-audit').then(r => r.json()).then(setData).catch(() => setData(null)); }, []);
  return <div className="page"><h1>License Exception Audit</h1><p>Review export license exception usage for documentation gaps and invalid claims.</p><div className="stats-grid">{data && Object.entries(data.summary).map(([k,v]) => <div className="stat-card" key={k}><span>{k.replaceAll('_',' ')}</span><strong>{v}</strong></div>)}</div><div className="card">{(data?.exceptions || []).map(e => <div key={e.transaction} style={{padding:12,borderBottom:'1px solid #e5e7eb'}}><strong>{e.transaction}</strong><div>{e.exception} - {e.issue} - {e.risk} - {e.action}</div></div>)}</div></div>;
}
