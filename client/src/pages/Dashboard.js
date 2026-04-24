import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const dataCards = [
  { title: 'Sanctioned Entities', desc: 'Manage OFAC SDN, Entity List, and other sanctions designations', icon: 'SE', href: '/sanctioned-entities', style: 'card-alert' },
  { title: 'Denied Parties', desc: 'Track denied persons and unverified list entries', icon: 'DP', href: '/denied-parties', style: 'card-alert' },
  { title: 'Restricted Countries', desc: 'Monitor embargoed and restricted destination countries', icon: 'RC', href: '/restricted-countries', style: 'card-alert' },
  { title: 'Controlled Items', desc: 'Manage EAR and ITAR controlled items and classifications', icon: 'CI', href: '/controlled-items', style: 'card-data' },
  { title: 'Transactions', desc: 'Track and screen export transactions for compliance', icon: 'TX', href: '/transactions', style: 'card-data' },
  { title: 'Export Licenses', desc: 'Manage export license applications and approvals', icon: 'EL', href: '/export-licenses', style: 'card-data' },
  { title: 'Compliance Documents', desc: 'Review and manage compliance documentation', icon: 'CD', href: '/compliance-documents', style: 'card-data' },
  { title: 'Restricted End Uses', desc: 'Track prohibited end-uses including WMD and military', icon: 'EU', href: '/restricted-end-uses', style: 'card-alert' },
  { title: 'Screening Results', desc: 'View all entity and transaction screening outcomes', icon: 'SR', href: '/screening-results', style: 'card-data' },
  { title: 'Audit Logs', desc: 'Complete audit trail of all compliance activities', icon: 'AL', href: '/audit-logs', style: 'card-data' },
];

const aiCategories = [
  {
    category: 'Screening & Search',
    cards: [
      { title: 'AI Entity Screening', desc: 'Screen entities against global sanctions and denied party lists', href: '/ai/screen-entity' },
      { title: 'AI Denied Party Search', desc: 'Deep search with name matching, alias detection, and corporate analysis', href: '/ai/denied-party-search' },
      { title: 'AI Sanctions Analyzer', desc: 'Deep analysis of sanctions designations and evasion patterns', href: '/ai/sanctions-analysis' },
      { title: 'AI Screening Review', desc: 'Analyze screening results for false positives and quality metrics', href: '/ai/screening-review' },
    ]
  },
  {
    category: 'Classification & Items',
    cards: [
      { title: 'AI Export Classification', desc: 'Automatically classify items under EAR/ITAR regulations', href: '/ai/classify-item' },
      { title: 'AI Dual-Use Check', desc: 'Assess dual civilian/military applications under Wassenaar', href: '/ai/dual-use-check' },
      { title: 'AI ECCN Lookup', desc: 'Step-by-step ECCN classification using Commerce Control List', href: '/ai/eccn-lookup' },
    ]
  },
  {
    category: 'Transaction & Risk',
    cards: [
      { title: 'AI Risk Assessment', desc: 'Assess export transaction risk with AI scoring', href: '/ai/assess-transaction' },
      { title: 'AI Pattern Detection', desc: 'Detect suspicious patterns and sanctions evasion tactics', href: '/ai/transaction-patterns' },
      { title: 'AI Red Flag Detector', desc: 'Identify BIS Know Your Customer red flag indicators', href: '/ai/red-flag-detect' },
      { title: 'AI Route Analysis', desc: 'Analyze shipping routes for transshipment and diversion risks', href: '/ai/route-analysis' },
    ]
  },
  {
    category: 'Country & Embargo',
    cards: [
      { title: 'AI Country Risk', desc: 'Comprehensive country risk assessment for compliance', href: '/ai/country-risk' },
      { title: 'AI Embargo Impact', desc: 'Assess business impact of embargoes and wind-down requirements', href: '/ai/embargo-impact' },
    ]
  },
  {
    category: 'Licensing & Documents',
    cards: [
      { title: 'AI License Advisor', desc: 'Get recommendations for export license types and exceptions', href: '/ai/license-recommendation' },
      { title: 'AI License Monitor', desc: 'Monitor license portfolio for expirations and renewals', href: '/ai/license-monitor' },
      { title: 'AI Document Review', desc: 'Review export compliance documents for completeness', href: '/ai/review-document' },
      { title: 'AI End-Use Analysis', desc: 'Analyze end-use statements for WMD/military red flags', href: '/ai/end-use-analysis' },
    ]
  },
  {
    category: 'Compliance & Legal',
    cards: [
      { title: 'AI Compliance Report', desc: 'Generate executive compliance reports with metrics', href: '/ai/generate-report' },
      { title: 'AI Gap Analysis', desc: 'Identify gaps in your Internal Compliance Program', href: '/ai/compliance-gaps' },
      { title: 'AI Penalty Calculator', desc: 'Calculate potential penalties for export violations', href: '/ai/penalty-risk' },
      { title: 'AI Self-Disclosure', desc: 'Guidance on filing voluntary self-disclosures', href: '/ai/vsd-advisor' },
      { title: 'AI Audit Analysis', desc: 'Analyze audit trails for anomalies and control weaknesses', href: '/ai/audit-analysis' },
      { title: 'AI Regulatory Updates', desc: 'Stay current on EAR, ITAR, OFAC regulatory changes', href: '/ai/regulatory-updates' },
      { title: 'AI Training Generator', desc: 'Generate custom training materials with case studies', href: '/ai/training-generator' },
    ]
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Export Control & Sanctions Compliance Overview</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <Link to="/sanctioned-entities" className="stat-card danger">
            <div className="stat-value">{stats.sanctioned_entities}</div>
            <div className="stat-label">Sanctioned Entities</div>
          </Link>
          <Link to="/denied-parties" className="stat-card danger">
            <div className="stat-value">{stats.denied_parties}</div>
            <div className="stat-label">Denied Parties</div>
          </Link>
          <Link to="/transactions" className="stat-card info">
            <div className="stat-value">{stats.transactions}</div>
            <div className="stat-label">Total Transactions</div>
          </Link>
          <div className="stat-card danger">
            <div className="stat-value">{stats.blocked_transactions}</div>
            <div className="stat-label">Blocked Transactions</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-value">{stats.flagged_transactions}</div>
            <div className="stat-label">Flagged Transactions</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-value">{stats.high_risk_entities}</div>
            <div className="stat-label">High Risk Entities</div>
          </div>
          <Link to="/restricted-countries" className="stat-card warning">
            <div className="stat-value">{stats.restricted_countries}</div>
            <div className="stat-label">Restricted Countries</div>
          </Link>
          <Link to="/export-licenses" className="stat-card info">
            <div className="stat-value">{stats.export_licenses}</div>
            <div className="stat-label">Export Licenses</div>
          </Link>
          <Link to="/screening-results" className="stat-card info">
            <div className="stat-value">{stats.screening_results}</div>
            <div className="stat-label">Screening Results</div>
          </Link>
          <Link to="/controlled-items" className="stat-card warning">
            <div className="stat-value">{stats.controlled_items}</div>
            <div className="stat-label">Controlled Items</div>
          </Link>
        </div>
      )}

      <h2 className="section-title">Data Management</h2>
      <div className="feature-cards">
        {dataCards.map((card) => (
          <Link key={card.href} to={card.href} className="feature-card">
            <div className={`card-icon ${card.style}`}>{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </Link>
        ))}
      </div>

      {aiCategories.map((cat) => (
        <div key={cat.category}>
          <h2 className="section-title ai-section-title">AI {cat.category}</h2>
          <div className="feature-cards">
            {cat.cards.map((card) => (
              <Link key={card.href} to={card.href} className="feature-card ai-feature-card">
                <div className="card-icon card-ai">AI</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
