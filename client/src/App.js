import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CrudPage from './pages/CrudPage';
import AIFeature from './pages/AIFeature';
import AIBulkScreen from './pages/AIBulkScreen';
import AISupplyChainTrace from './pages/AISupplyChainTrace';
import './App.css';

import Batch03Features from './pages/Batch03Features';

function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">S</div>
        <div>
          <h2>ECSS</h2>
          <p className="sidebar-subtitle">Export Control & Sanctions</p>
        </div>
      </div>
      <div className="sidebar-nav">
        <Link to="/" className={isActive('/')}>Dashboard</Link>

        <div className="nav-section">DATA MANAGEMENT</div>
        <Link to="/sanctioned-entities" className={isActive('/sanctioned-entities')}>Sanctioned Entities</Link>
        <Link to="/denied-parties" className={isActive('/denied-parties')}>Denied Parties</Link>
        <Link to="/restricted-countries" className={isActive('/restricted-countries')}>Restricted Countries</Link>
        <Link to="/controlled-items" className={isActive('/controlled-items')}>Controlled Items</Link>
        <Link to="/transactions" className={isActive('/transactions')}>Transactions</Link>
        <Link to="/export-licenses" className={isActive('/export-licenses')}>Export Licenses</Link>
        <Link to="/compliance-documents" className={isActive('/compliance-documents')}>Compliance Docs</Link>
        <Link to="/restricted-end-uses" className={isActive('/restricted-end-uses')}>Restricted End Uses</Link>
        <Link to="/screening-results" className={isActive('/screening-results')}>Screening Results</Link>
        <Link to="/audit-logs" className={isActive('/audit-logs')}>Audit Logs</Link>

        <div className="nav-section">AI SCREENING & SEARCH</div>
        <Link to="/ai/screen-entity" className={`${isActive('/ai/screen-entity')} ai-nav`}>AI Entity Screening</Link>
        <Link to="/ai/denied-party-search" className={`${isActive('/ai/denied-party-search')} ai-nav`}>AI Denied Party Search</Link>
        <Link to="/ai/sanctions-analysis" className={`${isActive('/ai/sanctions-analysis')} ai-nav`}>AI Sanctions Analyzer</Link>
        <Link to="/ai/screening-review" className={`${isActive('/ai/screening-review')} ai-nav`}>AI Screening Review</Link>

        <div className="nav-section">AI CLASSIFICATION & ITEMS</div>
        <Link to="/ai/classify-item" className={`${isActive('/ai/classify-item')} ai-nav`}>AI Export Classification</Link>
        <Link to="/ai/dual-use-check" className={`${isActive('/ai/dual-use-check')} ai-nav`}>AI Dual-Use Check</Link>
        <Link to="/ai/eccn-lookup" className={`${isActive('/ai/eccn-lookup')} ai-nav`}>AI ECCN Lookup</Link>

        <div className="nav-section">AI TRANSACTION & RISK</div>
        <Link to="/ai/assess-transaction" className={`${isActive('/ai/assess-transaction')} ai-nav`}>AI Risk Assessment</Link>
        <Link to="/ai/transaction-patterns" className={`${isActive('/ai/transaction-patterns')} ai-nav`}>AI Pattern Detection</Link>
        <Link to="/ai/red-flag-detect" className={`${isActive('/ai/red-flag-detect')} ai-nav`}>AI Red Flag Detector</Link>
        <Link to="/ai/route-analysis" className={`${isActive('/ai/route-analysis')} ai-nav`}>AI Route Analysis</Link>

        <div className="nav-section">AI COUNTRY & EMBARGO</div>
        <Link to="/ai/country-risk" className={`${isActive('/ai/country-risk')} ai-nav`}>AI Country Risk</Link>
        <Link to="/ai/embargo-impact" className={`${isActive('/ai/embargo-impact')} ai-nav`}>AI Embargo Impact</Link>

        <div className="nav-section">AI LICENSING & DOCS</div>
        <Link to="/ai/license-recommendation" className={`${isActive('/ai/license-recommendation')} ai-nav`}>AI License Advisor</Link>
        <Link to="/ai/license-monitor" className={`${isActive('/ai/license-monitor')} ai-nav`}>AI License Monitor</Link>
        <Link to="/ai/review-document" className={`${isActive('/ai/review-document')} ai-nav`}>AI Document Review</Link>
        <Link to="/ai/end-use-analysis" className={`${isActive('/ai/end-use-analysis')} ai-nav`}>AI End-Use Analysis</Link>

        <div className="nav-section">AI COMPLIANCE & LEGAL</div>
        <Link to="/ai/generate-report" className={`${isActive('/ai/generate-report')} ai-nav`}>AI Compliance Report</Link>
        <Link to="/ai/compliance-gaps" className={`${isActive('/ai/compliance-gaps')} ai-nav`}>AI Gap Analysis</Link>
        <Link to="/ai/penalty-risk" className={`${isActive('/ai/penalty-risk')} ai-nav`}>AI Penalty Calculator</Link>
        <Link to="/ai/vsd-advisor" className={`${isActive('/ai/vsd-advisor')} ai-nav`}>AI Self-Disclosure</Link>
        <Link to="/ai/audit-analysis" className={`${isActive('/ai/audit-analysis')} ai-nav`}>AI Audit Analysis</Link>
        <Link to="/ai/regulatory-updates" className={`${isActive('/ai/regulatory-updates')} ai-nav`}>AI Regulatory Updates</Link>
        <Link to="/ai/training-generator" className={`${isActive('/ai/training-generator')} ai-nav`}>AI Training Generator</Link>

        <div className="nav-section">AI BATCH & DASHBOARD</div>
        <Link to="/ai/bulk-screen" className={`${isActive('/ai/bulk-screen')} ai-nav`}>AI Bulk Screen</Link>
        <Link to="/ai/compliance-alert-dashboard" className={`${isActive('/ai/compliance-alert-dashboard')} ai-nav`}>AI Compliance Alerts</Link>
        <Link to="/ai/transaction-auto-screen" className={`${isActive('/ai/transaction-auto-screen')} ai-nav`}>AI Transaction Auto-Screen</Link>
        <Link to="/ai/beneficial-ownership-analyze" className={`${isActive('/ai/beneficial-ownership-analyze')} ai-nav`}>AI Beneficial Ownership</Link>
        <Link to="/ai/supply-chain-trace" className={`${isActive('/ai/supply-chain-trace')} ai-nav`}>AI Supply-Chain Trace</Link>
        <Link to="/ai/training-simulate" className={`${isActive('/ai/training-simulate')} ai-nav`}>AI Training Simulator</Link>
        <Link to="/ai/competitor-benchmark" className={`${isActive('/ai/competitor-benchmark')} ai-nav`}>AI Competitor Benchmark</Link>
      </div>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user.full_name[0]}</div>
          <div>
            <div className="user-name">{user.full_name}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <div className="app">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
          <Route path="/batch03" element={<Batch03Features />} />
            <Route path="/" element={<Dashboard />} />

            {/* Data Management Routes */}
            <Route path="/sanctioned-entities" element={
              <CrudPage resource="sanctioned-entities" title="Sanctioned Entities"
                fields={[
                  { key: 'entity_name', label: 'Entity Name', required: true },
                  { key: 'entity_type', label: 'Entity Type', required: true },
                  { key: 'country', label: 'Country', required: true },
                  { key: 'sanctions_list', label: 'Sanctions List', required: true },
                  { key: 'designation_date', label: 'Designation Date', type: 'date' },
                  { key: 'reason', label: 'Reason', type: 'textarea' },
                  { key: 'aliases', label: 'Aliases' },
                  { key: 'status', label: 'Status', type: 'select', options: ['active','inactive','delisted'] },
                  { key: 'risk_score', label: 'Risk Score', type: 'number' },
                ]}
                columns={['entity_name','entity_type','country','sanctions_list','risk_score','status']}
              />
            } />
            <Route path="/denied-parties" element={
              <CrudPage resource="denied-parties" title="Denied Parties"
                fields={[
                  { key: 'party_name', label: 'Party Name', required: true },
                  { key: 'party_type', label: 'Party Type', required: true },
                  { key: 'country', label: 'Country', required: true },
                  { key: 'list_source', label: 'List Source', required: true },
                  { key: 'federal_register_notice', label: 'Federal Register Notice' },
                  { key: 'effective_date', label: 'Effective Date', type: 'date' },
                  { key: 'expiration_date', label: 'Expiration Date', type: 'date' },
                  { key: 'standard_order', label: 'Standard Order' },
                  { key: 'reason', label: 'Reason', type: 'textarea' },
                  { key: 'status', label: 'Status', type: 'select', options: ['active','inactive','removed'] },
                ]}
                columns={['party_name','party_type','country','list_source','status']}
              />
            } />
            <Route path="/restricted-countries" element={
              <CrudPage resource="restricted-countries" title="Restricted Countries"
                fields={[
                  { key: 'country_name', label: 'Country Name', required: true },
                  { key: 'country_code', label: 'Country Code', required: true },
                  { key: 'restriction_type', label: 'Restriction Type', required: true },
                  { key: 'embargo_level', label: 'Embargo Level', required: true },
                  { key: 'governing_regulation', label: 'Governing Regulation' },
                  { key: 'risk_tier', label: 'Risk Tier', required: true, type: 'select', options: ['Tier 1','Tier 2','Tier 3'] },
                  { key: 'description', label: 'Description', type: 'textarea' },
                  { key: 'effective_date', label: 'Effective Date', type: 'date' },
                  { key: 'status', label: 'Status', type: 'select', options: ['active','inactive'] },
                ]}
                columns={['country_name','country_code','restriction_type','embargo_level','risk_tier','status']}
              />
            } />
            <Route path="/controlled-items" element={
              <CrudPage resource="controlled-items" title="Controlled Items"
                fields={[
                  { key: 'item_name', label: 'Item Name', required: true },
                  { key: 'eccn', label: 'ECCN' },
                  { key: 'usml_category', label: 'USML Category' },
                  { key: 'control_type', label: 'Control Type', required: true, type: 'select', options: ['EAR','ITAR'] },
                  { key: 'description', label: 'Description', type: 'textarea' },
                  { key: 'technical_specs', label: 'Technical Specs', type: 'textarea' },
                  { key: 'license_requirement', label: 'License Requirement' },
                  { key: 'classification_basis', label: 'Classification Basis' },
                  { key: 'dual_use', label: 'Dual Use', type: 'boolean' },
                  { key: 'risk_level', label: 'Risk Level', type: 'select', options: ['low','medium','high','critical'] },
                ]}
                columns={['item_name','eccn','control_type','dual_use','risk_level']}
              />
            } />
            <Route path="/transactions" element={
              <CrudPage resource="transactions" title="Transactions"
                fields={[
                  { key: 'transaction_ref', label: 'Transaction Ref', required: true },
                  { key: 'exporter_name', label: 'Exporter', required: true },
                  { key: 'consignee_name', label: 'Consignee', required: true },
                  { key: 'end_user_name', label: 'End User' },
                  { key: 'item_description', label: 'Item Description', required: true, type: 'textarea' },
                  { key: 'eccn', label: 'ECCN' },
                  { key: 'destination_country', label: 'Destination Country', required: true },
                  { key: 'value_usd', label: 'Value (USD)', type: 'number' },
                  { key: 'transaction_date', label: 'Transaction Date', type: 'date' },
                  { key: 'status', label: 'Status', type: 'select', options: ['pending','approved','denied','under_review'] },
                  { key: 'risk_score', label: 'Risk Score', type: 'number' },
                  { key: 'screening_status', label: 'Screening Status', type: 'select', options: ['not_screened','pending_review','cleared','flagged','blocked'] },
                  { key: 'notes', label: 'Notes', type: 'textarea' },
                ]}
                columns={['transaction_ref','exporter_name','consignee_name','destination_country','value_usd','status','risk_score','screening_status']}
              />
            } />
            <Route path="/export-licenses" element={
              <CrudPage resource="export-licenses" title="Export Licenses"
                fields={[
                  { key: 'license_number', label: 'License Number', required: true },
                  { key: 'license_type', label: 'License Type', required: true },
                  { key: 'applicant_name', label: 'Applicant', required: true },
                  { key: 'consignee_name', label: 'Consignee', required: true },
                  { key: 'destination_country', label: 'Destination', required: true },
                  { key: 'item_description', label: 'Item Description', required: true, type: 'textarea' },
                  { key: 'eccn', label: 'ECCN' },
                  { key: 'value_usd', label: 'Value (USD)', type: 'number' },
                  { key: 'issue_date', label: 'Issue Date', type: 'date' },
                  { key: 'expiration_date', label: 'Expiration Date', type: 'date' },
                  { key: 'status', label: 'Status', type: 'select', options: ['active','expired','denied','pending','rwa','revoked'] },
                  { key: 'conditions', label: 'Conditions', type: 'textarea' },
                ]}
                columns={['license_number','license_type','applicant_name','destination_country','value_usd','status']}
              />
            } />
            <Route path="/compliance-documents" element={
              <CrudPage resource="compliance-documents" title="Compliance Documents"
                fields={[
                  { key: 'document_name', label: 'Document Name', required: true },
                  { key: 'document_type', label: 'Document Type', required: true },
                  { key: 'related_transaction', label: 'Related Transaction' },
                  { key: 'content', label: 'Content', type: 'textarea' },
                  { key: 'compliance_status', label: 'Status', type: 'select', options: ['pending_review','approved','denied','under_review','flagged'] },
                  { key: 'review_notes', label: 'Review Notes', type: 'textarea' },
                  { key: 'reviewed_by', label: 'Reviewed By' },
                ]}
                columns={['document_name','document_type','related_transaction','compliance_status','reviewed_by']}
              />
            } />
            <Route path="/restricted-end-uses" element={
              <CrudPage resource="restricted-end-uses" title="Restricted End Uses"
                fields={[
                  { key: 'end_use_name', label: 'End Use Name', required: true },
                  { key: 'category', label: 'Category', required: true },
                  { key: 'description', label: 'Description', type: 'textarea' },
                  { key: 'governing_regulation', label: 'Governing Regulation' },
                  { key: 'risk_level', label: 'Risk Level', type: 'select', options: ['low','medium','high','critical'] },
                  { key: 'indicators', label: 'Indicators', type: 'textarea' },
                  { key: 'mitigation_measures', label: 'Mitigation Measures', type: 'textarea' },
                  { key: 'status', label: 'Status', type: 'select', options: ['active','inactive'] },
                ]}
                columns={['end_use_name','category','governing_regulation','risk_level','status']}
              />
            } />
            <Route path="/screening-results" element={
              <CrudPage resource="screening-results" title="Screening Results"
                fields={[
                  { key: 'screening_type', label: 'Screening Type', required: true },
                  { key: 'entity_screened', label: 'Entity Screened', required: true },
                  { key: 'match_found', label: 'Match Found', type: 'boolean' },
                  { key: 'match_score', label: 'Match Score', type: 'number' },
                  { key: 'matched_entity', label: 'Matched Entity' },
                  { key: 'matched_list', label: 'Matched List' },
                  { key: 'risk_level', label: 'Risk Level', type: 'select', options: ['low','medium','high','critical'] },
                  { key: 'ai_analysis', label: 'AI Analysis', type: 'textarea' },
                  { key: 'recommendation', label: 'Recommendation', type: 'textarea' },
                ]}
                columns={['screening_type','entity_screened','match_found','match_score','risk_level','recommendation']}
              />
            } />
            <Route path="/audit-logs" element={
              <CrudPage resource="audit-logs" title="Audit Logs"
                fields={[]}
                columns={['action','entity_type','entity_id','user_name','details','created_at']}
                readOnly={true}
              />
            } />

            {/* ==================== AI ROUTES ==================== */}

            {/* AI Entity Screening */}
            <Route path="/ai/screen-entity" element={
              <AIFeature title="AI Entity Screening" description="Screen entities against global sanctions and denied party lists using AI analysis"
                endpoint="screenEntity"
                fields={[
                  { key: 'entity_name', label: 'Entity Name', required: true, placeholder: 'e.g., Rostec Corporation' },
                  { key: 'country', label: 'Country', placeholder: 'e.g., Russia' },
                  { key: 'entity_type', label: 'Entity Type', placeholder: 'e.g., Corporation, Individual' },
                ]}
                dataSources={['sanctioned-entities', 'denied-parties']}
                dataFieldMap={{
                  'sanctioned-entities': { entity_name: 'entity_name', country: 'country', entity_type: 'entity_type' },
                  'denied-parties': { entity_name: 'party_name', country: 'country', entity_type: 'party_type' },
                }}
                samples={[
                  { name: 'Rostec Corporation', desc: 'Russian defense conglomerate', data: { entity_name: 'Rostec Corporation', country: 'Russia', entity_type: 'State Corporation' }},
                  { name: 'Huawei Technologies', desc: 'Chinese telecom giant', data: { entity_name: 'Huawei Technologies Co.', country: 'China', entity_type: 'Corporation' }},
                  { name: 'Wagner Group', desc: 'Russian PMC', data: { entity_name: 'Wagner Group', country: 'Russia', entity_type: 'Private Military Company' }},
                  { name: 'Unknown Shell Corp', desc: 'Suspicious UAE entity', data: { entity_name: 'Global Horizon Trading DMCC', country: 'UAE', entity_type: 'Trading Company' }},
                ]}
              />
            } />

            {/* AI Denied Party Search */}
            <Route path="/ai/denied-party-search" element={
              <AIFeature title="AI Denied Party Deep Search" description="Deep search with name matching, alias detection, and corporate family analysis"
                endpoint="deniedPartySearch"
                fields={[
                  { key: 'party_name', label: 'Party Name', required: true, placeholder: 'e.g., TechFlow Electronics' },
                  { key: 'country', label: 'Country', placeholder: 'e.g., China' },
                  { key: 'party_type', label: 'Party Type', placeholder: 'e.g., Company, Individual' },
                ]}
                dataSources={['denied-parties', 'sanctioned-entities']}
                dataFieldMap={{
                  'denied-parties': { party_name: 'party_name', country: 'country', party_type: 'party_type' },
                  'sanctioned-entities': { party_name: 'entity_name', country: 'country', party_type: 'entity_type' },
                }}
                samples={[
                  { name: 'TechFlow Electronics', desc: 'Semiconductor diversion suspect', data: { party_name: 'TechFlow Electronics Ltd', country: 'China', party_type: 'Company' }},
                  { name: 'Ahmad Al-Rashid', desc: 'Syrian individual', data: { party_name: 'Ahmad Al-Rashid', country: 'Syria', party_type: 'Individual' }},
                  { name: 'Falcon Trading DMCC', desc: 'UAE transshipment company', data: { party_name: 'Falcon Trading DMCC', country: 'UAE', party_type: 'Company' }},
                  { name: 'Viktor Petrov', desc: 'Russian procurement agent', data: { party_name: 'Viktor Petrov', country: 'Russia', party_type: 'Individual' }},
                ]}
              />
            } />

            {/* AI Sanctions Analyzer */}
            <Route path="/ai/sanctions-analysis" element={
              <AIFeature title="AI Sanctions List Analyzer" description="Deep analysis of sanctions designations, legal authority, and evasion patterns"
                endpoint="sanctionsAnalysis"
                fields={[
                  { key: 'entity_name', label: 'Entity Name', placeholder: 'e.g., Wagner Group' },
                  { key: 'list_name', label: 'Sanctions List', placeholder: 'e.g., SDN List, Entity List' },
                ]}
                dataSources={['sanctioned-entities']}
                dataFieldMap={{
                  'sanctioned-entities': { entity_name: 'entity_name', list_name: 'sanctions_list' },
                }}
                samples={[
                  { name: 'IRGC Analysis', desc: 'Iranian Revolutionary Guard', data: { entity_name: 'Iranian Revolutionary Guard Corps', list_name: 'SDN List (OFAC)' }},
                  { name: 'SMIC Analysis', desc: 'Chinese semiconductor maker', data: { entity_name: 'Semiconductor Manufacturing Intl Corp', list_name: 'Entity List (BIS)' }},
                  { name: 'KOMID Analysis', desc: 'North Korean weapons trader', data: { entity_name: 'Korea Mining Development Trading Corp', list_name: 'SDN List (OFAC)' }},
                ]}
              />
            } />

            {/* AI Screening Review */}
            <Route path="/ai/screening-review" element={
              <AIFeature title="AI Screening Accuracy Review" description="Analyze screening results for false positives, missed matches, and quality metrics"
                endpoint="screeningReview"
                fields={[]}
                dataSources={['screening-results']}
                dataFieldMap={{}}
                samples={[
                  { name: 'Run Full Review', desc: 'Analyze all screening results', data: {} },
                ]}
              />
            } />

            {/* AI Export Classification */}
            <Route path="/ai/classify-item" element={
              <AIFeature title="AI Export Classification" description="Automatically classify items under EAR/ITAR export control regulations"
                endpoint="classifyItem"
                fields={[
                  { key: 'item_name', label: 'Item Name', required: true, placeholder: 'e.g., Thermal Imaging Camera' },
                  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the item...' },
                  { key: 'technical_specs', label: 'Technical Specifications', type: 'textarea', placeholder: 'Key technical parameters...' },
                ]}
                dataSources={['controlled-items']}
                dataFieldMap={{
                  'controlled-items': { item_name: 'item_name', description: 'description', technical_specs: 'technical_specs' },
                }}
                samples={[
                  { name: 'Thermal Camera', desc: 'Infrared imaging device', data: { item_name: 'Thermal Imaging Camera', description: 'Uncooled infrared focal plane array camera for surveillance', technical_specs: 'NETD: <40mK, Resolution: 640x480, Wavelength: 8-14um' }},
                  { name: 'CNC Machine', desc: '5-axis precision machining', data: { item_name: '5-Axis CNC Milling Machine', description: 'Computer numerical control machine tool for precision manufacturing', technical_specs: 'Positioning accuracy: 0.001mm, 5-axis simultaneous, work envelope: 500x400x300mm' }},
                  { name: 'Encryption Module', desc: 'AES-256 hardware crypto', data: { item_name: 'Hardware Encryption Module', description: 'Dedicated hardware encryption module with AES-256 capability', technical_specs: 'Key length: 256-bit, Throughput: 10Gbps, FIPS 140-2 Level 3' }},
                  { name: 'GPS Receiver', desc: 'High-accuracy GNSS', data: { item_name: 'Multi-Constellation GNSS Receiver', description: 'High-accuracy GPS/GLONASS/Galileo receiver module', technical_specs: 'Accuracy: 2cm RTK, Update rate: 20Hz, Anti-jamming: CRPA' }},
                ]}
              />
            } />

            {/* AI Dual-Use Check */}
            <Route path="/ai/dual-use-check" element={
              <AIFeature title="AI Dual-Use Assessment" description="Determine if items have dual civilian/military applications under Wassenaar"
                endpoint="dualUseCheck"
                fields={[
                  { key: 'item_name', label: 'Item Name', required: true, placeholder: 'e.g., 5-Axis CNC Machine' },
                  { key: 'specs', label: 'Specifications', type: 'textarea', placeholder: 'Technical specifications...' },
                  { key: 'intended_use', label: 'Intended Use', placeholder: 'e.g., Manufacturing precision parts' },
                ]}
                dataSources={['controlled-items']}
                dataFieldMap={{
                  'controlled-items': { item_name: 'item_name', specs: 'technical_specs', intended_use: 'description' },
                }}
                samples={[
                  { name: 'Carbon Fiber', desc: 'High-modulus composite', data: { item_name: 'Carbon Fiber Composite Material', specs: 'Tensile modulus: >600 GPa, Specific tensile strength: >23.6x10^6 mm', intended_use: 'Aerospace structural components' }},
                  { name: 'Night Vision', desc: 'Gen III image intensifier', data: { item_name: 'Night Vision Goggles Gen III', specs: 'Resolution: 64 lp/mm, SNR: 25+, Photocathode: GaAs', intended_use: 'Security and surveillance applications' }},
                  { name: 'Oscilloscope', desc: 'High-speed digital scope', data: { item_name: 'Digital Sampling Oscilloscope', specs: 'Bandwidth: >4 GHz, Sample rate: 40 GS/s', intended_use: 'Electronics testing and R&D' }},
                  { name: 'Drone', desc: 'Tactical UAV platform', data: { item_name: 'Fixed-Wing UAV Platform', specs: 'Endurance: 12hrs, Ceiling: 15,000ft, Payload: 5kg', intended_use: 'Agricultural surveying and mapping' }},
                ]}
              />
            } />

            {/* AI ECCN Lookup */}
            <Route path="/ai/eccn-lookup" element={
              <AIFeature title="AI ECCN Lookup Assistant" description="Step-by-step ECCN classification using Commerce Control List logic"
                endpoint="eccnLookup"
                fields={[
                  { key: 'product_description', label: 'Product Description', required: true, type: 'textarea', placeholder: 'Describe the product in detail...' },
                  { key: 'technical_parameters', label: 'Technical Parameters', type: 'textarea', placeholder: 'e.g., Frequency: 10GHz, Accuracy: 0.001mm' },
                ]}
                dataSources={['controlled-items']}
                dataFieldMap={{
                  'controlled-items': { product_description: 'description', technical_parameters: 'technical_specs' },
                }}
                samples={[
                  { name: 'Radar System', desc: 'Phased array radar', data: { product_description: 'Phased array radar system for tracking and surveillance applications with electronic beam steering', technical_parameters: 'Frequency: 1-40 GHz, Range: 500km, Beam steering: electronic' }},
                  { name: 'Biocontainment', desc: 'Class III biosafety cabinet', data: { product_description: 'Biological Safety Cabinet Class III with HEPA filtration for containment of biological agents', technical_parameters: 'HEPA filtration: 99.99%, Negative pressure, Glove port access' }},
                  { name: 'Laser System', desc: 'High-power fiber laser', data: { product_description: 'High-power continuous wave fiber laser for industrial cutting and welding', technical_parameters: 'Power: 10kW, Wavelength: 1070nm, Beam quality: M2<1.1' }},
                  { name: 'Maraging Steel', desc: 'Ultra-high strength alloy', data: { product_description: 'Maraging steel 350 grade ultra-high strength alloy for aerospace applications', technical_parameters: 'UTS: >2050 MPa, Yield: >2000 MPa, Hardness: 58 HRC' }},
                ]}
              />
            } />

            {/* AI Transaction Risk Assessment */}
            <Route path="/ai/assess-transaction" element={
              <AIFeature title="AI Transaction Risk Assessment" description="Assess export transaction risk with AI-powered analysis and scoring"
                endpoint="assessTransaction"
                fields={[
                  { key: 'exporter', label: 'Exporter', required: true, placeholder: 'e.g., Boeing Defense' },
                  { key: 'consignee', label: 'Consignee', required: true, placeholder: 'e.g., Unknown Trading Co' },
                  { key: 'item', label: 'Item', required: true, placeholder: 'e.g., Radar components' },
                  { key: 'destination', label: 'Destination Country', required: true, placeholder: 'e.g., Pakistan' },
                  { key: 'value', label: 'Value (USD)', type: 'number', placeholder: '1000000' },
                ]}
                dataSources={['transactions', 'restricted-countries']}
                dataFieldMap={{
                  'transactions': { exporter: 'exporter_name', consignee: 'consignee_name', item: 'item_description', destination: 'destination_country', value: 'value_usd' },
                  'restricted-countries': { destination: 'country_name' },
                }}
                samples={[
                  { name: 'High Risk - Russia', desc: 'CNC to Russia subsidiary', data: { exporter: 'General Dynamics', consignee: 'Rostec Subsidiary LLC', item: 'CNC machine components', destination: 'Russia', value: 750000 }},
                  { name: 'Medium Risk - China', desc: 'AI chips to Alibaba', data: { exporter: 'NVIDIA Corporation', consignee: 'Alibaba Cloud', item: 'AI training accelerator chips A100', destination: 'China', value: 25000000 }},
                  { name: 'Low Risk - Japan', desc: 'UAV parts to allied nation', data: { exporter: 'Boeing Defense', consignee: 'Japan Self Defense Force', item: 'UAV spare parts', destination: 'Japan', value: 5600000 }},
                  { name: 'Blocked - Iran', desc: 'Bio equipment to Tehran', data: { exporter: 'Thermo Fisher Scientific', consignee: 'Tehran University', item: 'Biological containment equipment', destination: 'Iran', value: 200000 }},
                ]}
              />
            } />

            {/* AI Transaction Pattern Detection */}
            <Route path="/ai/transaction-patterns" element={
              <AIFeature title="AI Transaction Pattern Detection" description="Detect suspicious patterns, structuring, and sanctions evasion across transactions"
                endpoint="transactionPatterns"
                fields={[]}
                dataSources={['transactions']}
                dataFieldMap={{}}
                samples={[
                  { name: 'Run Pattern Analysis', desc: 'Analyze all transactions for suspicious patterns', data: {} },
                ]}
              />
            } />

            {/* AI Red Flag Detector */}
            <Route path="/ai/red-flag-detect" element={
              <AIFeature title="AI Red Flag Detector" description="Identify BIS Know Your Customer red flag indicators in export scenarios"
                endpoint="redFlagDetect"
                fields={[
                  { key: 'scenario_description', label: 'Scenario Description', required: true, type: 'textarea', placeholder: 'Describe the export scenario...' },
                  { key: 'parties', label: 'Parties Involved', placeholder: 'e.g., Unknown buyer in Dubai' },
                  { key: 'items', label: 'Items', placeholder: 'e.g., CNC machines, encryption software' },
                  { key: 'destination', label: 'Destination', placeholder: 'e.g., UAE with re-export to Iran' },
                ]}
                dataSources={['transactions', 'denied-parties', 'restricted-countries']}
                dataFieldMap={{
                  'transactions': { scenario_description: 'item_description', parties: 'consignee_name', destination: 'destination_country' },
                  'denied-parties': { parties: 'party_name', destination: 'country' },
                  'restricted-countries': { destination: 'country_name' },
                }}
                samples={[
                  { name: 'UAE Transshipment', desc: 'Suspected Iran diversion', data: { scenario_description: 'A newly formed trading company in Dubai is ordering 10 high-precision CNC machines. They have no website, refuse to provide end-use certificates, and want to pay cash.', parties: 'Global Horizon Trading DMCC (est. 2 months ago)', items: '5-axis CNC machines, precision tooling', destination: 'UAE, suspected re-export to Iran' }},
                  { name: 'Unusual Payment', desc: 'Third-party payment from HK', data: { scenario_description: 'Customer in Pakistan wants to buy satellite communication equipment. Payment is coming from an unrelated company in Hong Kong. Customer claims equipment is for commercial telecom but refuses site visit.', parties: 'Mystery Buyer Inc (Pakistan), HK Holdings Ltd (payment)', items: 'Military-grade SATCOM terminals', destination: 'Pakistan' }},
                  { name: 'Rush Order', desc: 'Expedited with no docs', data: { scenario_description: 'A customer is ordering thermal imaging cameras with extreme urgency, offering to pay 200% of list price. They refuse to state the end-use and want the shipment labeled as "industrial sensors".', parties: 'Unknown Electronics GmbH', items: 'Thermal imaging cameras, NETD <40mK', destination: 'Germany (but shipping address is freight forwarder)' }},
                ]}
              />
            } />

            {/* AI Route Analysis */}
            <Route path="/ai/route-analysis" element={
              <AIFeature title="AI Export Route Analysis" description="Analyze shipping routes for transshipment and diversion risks"
                endpoint="routeAnalysis"
                fields={[
                  { key: 'origin', label: 'Origin Country', placeholder: 'e.g., United States' },
                  { key: 'destination', label: 'Final Destination', required: true, placeholder: 'e.g., Pakistan' },
                  { key: 'transit_countries', label: 'Transit Countries', placeholder: 'e.g., UAE, Malaysia' },
                  { key: 'item', label: 'Item Being Shipped', placeholder: 'e.g., Semiconductor equipment' },
                ]}
                dataSources={['restricted-countries', 'transactions']}
                dataFieldMap={{
                  'restricted-countries': { destination: 'country_name' },
                  'transactions': { destination: 'destination_country', item: 'item_description' },
                }}
                samples={[
                  { name: 'UAE-Iran Route', desc: 'Suspected diversion via Dubai', data: { origin: 'United States', destination: 'Iran', transit_countries: 'UAE (Dubai Free Zone), Turkey', item: 'Semiconductor manufacturing equipment' }},
                  { name: 'Malaysia-China', desc: 'Tech via SE Asia', data: { origin: 'United States', destination: 'China', transit_countries: 'Malaysia, Singapore', item: 'Advanced GPU computing clusters' }},
                  { name: 'Turkey-Russia', desc: 'Sanctions circumvention risk', data: { origin: 'United States', destination: 'Russia', transit_countries: 'Turkey, Georgia, Kazakhstan', item: 'Industrial CNC machinery' }},
                  { name: 'Direct to Japan', desc: 'Allied nation direct route', data: { origin: 'United States', destination: 'Japan', transit_countries: 'Direct shipment', item: 'Rocket propulsion components' }},
                ]}
              />
            } />

            {/* AI Country Risk */}
            <Route path="/ai/country-risk" element={
              <AIFeature title="AI Country Risk Analysis" description="Comprehensive country risk assessment for export compliance"
                endpoint="countryRisk"
                fields={[
                  { key: 'country_name', label: 'Country Name', required: true, placeholder: 'e.g., Iran, Russia, China' },
                ]}
                dataSources={['restricted-countries']}
                dataFieldMap={{
                  'restricted-countries': { country_name: 'country_name' },
                }}
                samples={[
                  { name: 'Russia', desc: 'Comprehensive sanctions', data: { country_name: 'Russia' }},
                  { name: 'China', desc: 'Entity-based restrictions', data: { country_name: 'China' }},
                  { name: 'Iran', desc: 'Full embargo', data: { country_name: 'Iran' }},
                  { name: 'North Korea', desc: 'Complete embargo', data: { country_name: 'North Korea' }},
                  { name: 'UAE', desc: 'Transshipment hub risk', data: { country_name: 'United Arab Emirates' }},
                ]}
              />
            } />

            {/* AI Embargo Impact */}
            <Route path="/ai/embargo-impact" element={
              <AIFeature title="AI Embargo Impact Assessment" description="Assess business impact of embargoes including wind-down and exemptions"
                endpoint="embargoImpact"
                fields={[
                  { key: 'country', label: 'Country', required: true, placeholder: 'e.g., Russia' },
                  { key: 'business_activity', label: 'Business Activity', type: 'textarea', placeholder: 'e.g., Selling industrial equipment, software licensing' },
                ]}
                dataSources={['restricted-countries', 'transactions']}
                dataFieldMap={{
                  'restricted-countries': { country: 'country_name' },
                  'transactions': { country: 'destination_country', business_activity: 'item_description' },
                }}
                samples={[
                  { name: 'Russia - Tech Sales', desc: 'Software & hardware exports', data: { country: 'Russia', business_activity: 'Enterprise software licensing, cloud services, IT hardware sales, and technical support contracts with Russian companies' }},
                  { name: 'Cuba - Telecom', desc: 'Communications equipment', data: { country: 'Cuba', business_activity: 'Selling encrypted radio systems and telecommunications infrastructure equipment to government telecom ministry' }},
                  { name: 'China - Semiconductors', desc: 'Chip manufacturing', data: { country: 'China', business_activity: 'Selling advanced semiconductor manufacturing equipment, EDA software, and providing technical support for chip fabrication' }},
                ]}
              />
            } />

            {/* AI License Advisor */}
            <Route path="/ai/license-recommendation" element={
              <AIFeature title="AI License Advisor" description="Get AI recommendations for export license types, exceptions, and process"
                endpoint="licenseRecommendation"
                fields={[
                  { key: 'item', label: 'Item', required: true, placeholder: 'e.g., Night Vision Goggles' },
                  { key: 'eccn', label: 'ECCN', placeholder: 'e.g., 6A003' },
                  { key: 'destination', label: 'Destination Country', required: true, placeholder: 'e.g., Japan' },
                  { key: 'end_user', label: 'End User', placeholder: 'e.g., JASDF' },
                ]}
                dataSources={['export-licenses', 'controlled-items', 'restricted-countries']}
                dataFieldMap={{
                  'export-licenses': { item: 'item_description', eccn: 'eccn', destination: 'destination_country', end_user: 'consignee_name' },
                  'controlled-items': { item: 'item_name', eccn: 'eccn' },
                  'restricted-countries': { destination: 'country_name' },
                }}
                samples={[
                  { name: 'Night Vision to Israel', desc: 'ITAR defense article', data: { item: 'Night Vision Goggles Gen III', eccn: '', destination: 'Israel', end_user: 'Israeli Defense Forces' }},
                  { name: 'Encryption to Germany', desc: 'ENC exception eligible', data: { item: 'AES-256 Hardware Encryption Module', eccn: '5A002', destination: 'Germany', end_user: 'Vodafone Group' }},
                  { name: 'Radar to Saudi', desc: 'FMS defense sale', data: { item: 'Phased Array Radar Subsystem', eccn: '3A001', destination: 'Saudi Arabia', end_user: 'Saudi Arabian Military Industries' }},
                  { name: 'Chips to China', desc: 'Likely denial', data: { item: 'AI Training Accelerator GPU', eccn: '3A090', destination: 'China', end_user: 'Alibaba Cloud Computing' }},
                ]}
              />
            } />

            {/* AI License Monitor */}
            <Route path="/ai/license-monitor" element={
              <AIFeature title="AI License Expiry Monitor" description="Monitor license portfolio for expirations, renewals, and compliance gaps"
                endpoint="licenseMonitor"
                fields={[]}
                dataSources={['export-licenses']}
                dataFieldMap={{}}
                samples={[
                  { name: 'Run License Audit', desc: 'Analyze all licenses for expiry risks', data: {} },
                ]}
              />
            } />

            {/* AI Document Review */}
            <Route path="/ai/review-document" element={
              <AIFeature title="AI Document Compliance Review" description="AI-powered review of export compliance documents for completeness"
                endpoint="reviewDocument"
                fields={[
                  { key: 'document_type', label: 'Document Type', required: true, placeholder: 'e.g., End-Use Certificate' },
                  { key: 'content', label: 'Document Content', required: true, type: 'textarea', placeholder: 'Paste document content here...' },
                  { key: 'transaction_ref', label: 'Related Transaction', placeholder: 'e.g., TXN-2024-001' },
                ]}
                dataSources={['compliance-documents', 'transactions']}
                dataFieldMap={{
                  'compliance-documents': { document_type: 'document_type', content: 'content', transaction_ref: 'related_transaction' },
                  'transactions': { transaction_ref: 'transaction_ref' },
                }}
                samples={[
                  { name: 'End-Use Certificate', desc: 'UK radar components', data: { document_type: 'End-Use Certificate', content: 'This certifies that the radar subsystem components (ECCN 3A001) will be used exclusively in the Eurofighter Typhoon radar upgrade program by BAE Systems for the UK Ministry of Defence. No re-export or diversion without prior USG approval.', transaction_ref: 'TXN-2024-001' }},
                  { name: 'Shipper Declaration', desc: 'Incomplete semiconductor SED', data: { document_type: 'Shipper Export Declaration', content: 'Shipment of semiconductor chips to Germany. Consignee: Unknown Electronics GmbH. Value: $450,000. No end-use statement provided. No consignee verification on file.', transaction_ref: 'TXN-2024-002' }},
                  { name: 'Red Flag Assessment', desc: 'Pakistan deal concerns', data: { document_type: 'Red Flag Assessment', content: 'Transaction involves armored vehicle parts to Mystery Buyer Inc in Pakistan. Unknown end-user. Company has no web presence. Possible military diversion concerns. No end-use certificate obtained.', transaction_ref: 'TXN-2024-013' }},
                ]}
              />
            } />

            {/* AI End-Use Analysis */}
            <Route path="/ai/end-use-analysis" element={
              <AIFeature title="AI End-Use Analysis" description="Analyze stated end-uses for WMD/military diversion red flags"
                endpoint="endUseAnalysis"
                fields={[
                  { key: 'stated_end_use', label: 'Stated End-Use', required: true, type: 'textarea', placeholder: 'e.g., Research and development for civilian applications' },
                  { key: 'item', label: 'Item', placeholder: 'e.g., CNC Machine' },
                  { key: 'end_user', label: 'End User', placeholder: 'e.g., Tehran University' },
                  { key: 'country', label: 'Country', placeholder: 'e.g., Iran' },
                ]}
                dataSources={['restricted-end-uses', 'transactions', 'controlled-items']}
                dataFieldMap={{
                  'restricted-end-uses': { stated_end_use: 'description' },
                  'transactions': { item: 'item_description', end_user: 'end_user_name', country: 'destination_country' },
                  'controlled-items': { item: 'item_name' },
                }}
                samples={[
                  { name: 'Nuclear Research', desc: 'Suspicious centrifuge order', data: { stated_end_use: 'Academic research in advanced materials science and isotope separation techniques for medical radioisotope production', item: 'High-speed centrifuge system', end_user: 'National Research Institute', country: 'Pakistan' }},
                  { name: 'Agricultural Drones', desc: 'Possible military cover', data: { stated_end_use: 'Crop monitoring and precision agriculture spraying operations in remote areas requiring long endurance flights', item: 'Fixed-wing UAV with 24hr endurance', end_user: 'Agricultural Ministry', country: 'Myanmar' }},
                  { name: 'Civilian Telecom', desc: 'Encryption for Cuba', data: { stated_end_use: 'Upgrading civilian telecommunications infrastructure for improved mobile coverage in rural areas', item: 'Encrypted radio communication systems', end_user: 'Cuban Telecom Ministry', country: 'Cuba' }},
                  { name: 'Medical Equipment', desc: 'Bio equipment to Iran', data: { stated_end_use: 'University research laboratory for pharmaceutical development and vaccine research', item: 'Biological Safety Cabinet Class III', end_user: 'Tehran University Research Department', country: 'Iran' }},
                ]}
              />
            } />

            {/* AI Compliance Report */}
            <Route path="/ai/generate-report" element={
              <AIFeature title="AI Compliance Report Generator" description="Generate executive compliance reports with metrics and recommendations"
                endpoint="generateReport"
                fields={[]}
                dataSources={['transactions', 'screening-results', 'sanctioned-entities']}
                dataFieldMap={{}}
                samples={[
                  { name: 'Generate Full Report', desc: 'Comprehensive compliance report from all data', data: {} },
                ]}
              />
            } />

            {/* AI Gap Analysis */}
            <Route path="/ai/compliance-gaps" element={
              <AIFeature title="AI Compliance Gap Analysis" description="Identify gaps in your Internal Compliance Program with remediation plan"
                endpoint="complianceGaps"
                fields={[]}
                dataSources={['transactions', 'export-licenses', 'compliance-documents', 'screening-results']}
                dataFieldMap={{}}
                samples={[
                  { name: 'Run Gap Analysis', desc: 'Full ICP gap assessment', data: {} },
                ]}
              />
            } />

            {/* AI Penalty Calculator */}
            <Route path="/ai/penalty-risk" element={
              <AIFeature title="AI Penalty Risk Calculator" description="Calculate potential civil and criminal penalties for export violations"
                endpoint="penaltyRisk"
                fields={[
                  { key: 'violation_type', label: 'Violation Type', required: true, placeholder: 'e.g., Unauthorized export, License violation' },
                  { key: 'violation_details', label: 'Violation Details', required: true, type: 'textarea', placeholder: 'Describe the violation...' },
                  { key: 'voluntary_disclosure', label: 'Voluntary Disclosure?', type: 'select', options: ['Yes','No','Under consideration'] },
                ]}
                dataSources={['transactions', 'sanctioned-entities']}
                dataFieldMap={{
                  'transactions': { violation_details: 'item_description' },
                }}
                samples={[
                  { name: 'Unlicensed Export', desc: 'Shipped without BIS license', data: { violation_type: 'Unauthorized export without license', violation_details: 'Company shipped 5-axis CNC machine (ECCN 2B001) to a company in China without obtaining required BIS export license. Discovered during internal audit 3 months after shipment.', voluntary_disclosure: 'Under consideration' }},
                  { name: 'Sanctions Violation', desc: 'Payment to SDN entity', data: { violation_type: 'OFAC sanctions violation', violation_details: 'Company processed $2M payment from entity later identified as front company for sanctioned Rostec Corporation. Transaction was not screened against SDN list before processing.', voluntary_disclosure: 'Yes' }},
                  { name: 'Denied Party Sale', desc: 'Sold to denied person', data: { violation_type: 'Export to denied party', violation_details: 'Sales team sold encryption modules to TechFlow Electronics Ltd (on Denied Persons List) without running required denied party screening. Three shipments totaling $890,000 over 6 months.', voluntary_disclosure: 'No' }},
                ]}
              />
            } />

            {/* AI Self-Disclosure */}
            <Route path="/ai/vsd-advisor" element={
              <AIFeature title="AI Voluntary Self-Disclosure Advisor" description="Get guidance on filing voluntary self-disclosures with BIS, DDTC, or OFAC"
                endpoint="vsdAdvisor"
                fields={[
                  { key: 'violation_description', label: 'Violation Description', required: true, type: 'textarea', placeholder: 'Describe the potential violation...' },
                  { key: 'discovery_date', label: 'Discovery Date', type: 'date' },
                  { key: 'parties_involved', label: 'Parties Involved', type: 'textarea', placeholder: 'Who was involved?' },
                ]}
                dataSources={['transactions', 'sanctioned-entities', 'denied-parties']}
                dataFieldMap={{
                  'transactions': { violation_description: 'item_description', parties_involved: 'consignee_name' },
                }}
                samples={[
                  { name: 'EAR Violation', desc: 'Unlicensed tech transfer', data: { violation_description: 'Engineering team shared controlled technical data (ECCN 3E001) with foreign national employee from China during joint development project. No deemed export license was obtained.', discovery_date: '2024-06-15', parties_involved: 'Internal engineering team, Chinese national contractor (H-1B visa holder)' }},
                  { name: 'ITAR Violation', desc: 'Unauthorized defense export', data: { violation_description: 'Marketing materials containing ITAR-controlled technical data for night vision system were posted on public website accessible from any country for approximately 45 days before being discovered and removed.', discovery_date: '2024-05-01', parties_involved: 'Marketing department, website administrator' }},
                  { name: 'OFAC Violation', desc: 'Sanctions screening failure', data: { violation_description: 'Due to system outage, 12 transactions totaling $3.2M were processed without OFAC screening over a 2-week period. Post-facto screening identified one transaction with a possible SDN match.', discovery_date: '2024-07-01', parties_involved: 'Compliance team, IT department, sales operations' }},
                ]}
              />
            } />

            {/* AI Audit Analysis */}
            <Route path="/ai/audit-analysis" element={
              <AIFeature title="AI Audit Log Analysis" description="Analyze audit trails for anomalies, control weaknesses, and regulatory readiness"
                endpoint="auditAnalysis"
                fields={[]}
                dataSources={['audit-logs']}
                dataFieldMap={{}}
                samples={[
                  { name: 'Run Audit Analysis', desc: 'Analyze all audit logs for anomalies', data: {} },
                ]}
              />
            } />

            {/* AI Regulatory Updates */}
            <Route path="/ai/regulatory-updates" element={
              <AIFeature title="AI Regulatory Update Advisor" description="Stay current on EAR, ITAR, OFAC, and international export control changes"
                endpoint="regulatoryUpdates"
                fields={[
                  { key: 'regulation_area', label: 'Regulation Area', placeholder: 'e.g., EAR, ITAR, OFAC, EU, Wassenaar' },
                  { key: 'country', label: 'Country Focus', placeholder: 'e.g., China, Russia' },
                ]}
                dataSources={['restricted-countries']}
                dataFieldMap={{
                  'restricted-countries': { country: 'country_name', regulation_area: 'governing_regulation' },
                }}
                samples={[
                  { name: 'China Controls', desc: 'Latest semiconductor restrictions', data: { regulation_area: 'EAR - Semiconductor Controls', country: 'China' }},
                  { name: 'Russia Sanctions', desc: 'Ukraine-related updates', data: { regulation_area: 'OFAC/EAR Russia Sanctions', country: 'Russia' }},
                  { name: 'ITAR Updates', desc: 'Defense trade controls', data: { regulation_area: 'ITAR - USML Changes', country: '' }},
                  { name: 'Wassenaar Changes', desc: 'Multilateral controls', data: { regulation_area: 'Wassenaar Arrangement - Cyber & Surveillance', country: '' }},
                  { name: 'Iran Developments', desc: 'JCPOA and sanctions', data: { regulation_area: 'OFAC Iran Sanctions Program', country: 'Iran' }},
                ]}
              />
            } />

            {/* AI Training Generator */}
            <Route path="/ai/training-generator" element={
              <AIFeature title="AI Compliance Training Generator" description="Generate custom training materials with case studies and quiz questions"
                endpoint="trainingGenerator"
                fields={[
                  { key: 'topic', label: 'Training Topic', required: true, placeholder: 'e.g., Sanctions Screening Procedures' },
                  { key: 'audience', label: 'Target Audience', placeholder: 'e.g., Sales team, New analysts, Engineers' },
                  { key: 'level', label: 'Level', type: 'select', options: ['Beginner','Intermediate','Advanced'] },
                ]}
                dataSources={['restricted-countries', 'sanctioned-entities', 'controlled-items']}
                dataFieldMap={{}}
                samples={[
                  { name: 'Screening 101', desc: 'New employee training', data: { topic: 'Sanctions Screening Fundamentals - How to screen parties against OFAC SDN, BIS Entity List, and Denied Persons List', audience: 'New compliance analysts and sales team', level: 'Beginner' }},
                  { name: 'Red Flags', desc: 'BIS red flag indicators', data: { topic: 'Recognizing Export Control Red Flags - BIS Know Your Customer guidance and suspicious transaction indicators', audience: 'Sales representatives and account managers', level: 'Intermediate' }},
                  { name: 'ECCN Classification', desc: 'Technical classification', data: { topic: 'ECCN Classification Process - How to classify items on the Commerce Control List and determine license requirements', audience: 'Engineers and product managers', level: 'Advanced' }},
                  { name: 'ITAR Compliance', desc: 'Defense trade controls', data: { topic: 'ITAR Compliance Essentials - Understanding USML categories, DSP-5 applications, and technical data controls', audience: 'Defense division employees', level: 'Intermediate' }},
                  { name: 'Sanctions Overview', desc: 'OFAC programs intro', data: { topic: 'Understanding OFAC Sanctions Programs - Country-based vs list-based sanctions, SDN list, and compliance obligations', audience: 'All employees handling international transactions', level: 'Beginner' }},
                ]}
              />
            } />

            <Route path="/ai/bulk-screen" element={<AIBulkScreen />} />

            <Route path="/ai/compliance-alert-dashboard" element={
              <AIFeature title="AI Compliance Alert Dashboard" description="Executive compliance alert summary across licenses, screening, and high-risk entities."
                endpoint="complianceAlertDashboard"
                fields={[]}
                samples={[]}
                dataSources={[]}
              />
            } />

            <Route path="/ai/transaction-auto-screen" element={
              <AIFeature title="AI Transaction Auto-Screen" description="Auto-screen all parties on a transaction (exporter, consignee, end-user)."
                endpoint="transactionAutoScreen"
                fields={[
                  { key: 'transaction_id', label: 'Transaction ID', type: 'number', required: true, placeholder: 'e.g., 1' },
                ]}
                dataSources={['transactions']}
                dataFieldMap={{ 'transactions': { transaction_id: 'id' } }}
                samples={[]}
              />
            } />

            <Route path="/ai/beneficial-ownership-analyze" element={
              <AIFeature title="AI Beneficial Ownership Analyzer" description="Trace ultimate beneficial owners (UBOs), surface OFAC 50%-rule exposure, sanctioned-shareholder risks, and shell-company indicators."
                endpoint="beneficialOwnershipAnalyze"
                fields={[
                  { key: 'entity_name', label: 'Entity Name', required: true, placeholder: 'e.g., Acme Holdings Ltd' },
                  { key: 'country', label: 'Country', placeholder: 'e.g., UAE' },
                  { key: 'ownership_tree', label: 'Ownership Tree (free text or JSON)', type: 'textarea', placeholder: 'e.g., Acme Holdings -> Vega LLC (60%) -> Mr. Ivanov (100%)' },
                  { key: 'notes', label: 'Notes', type: 'textarea' },
                ]}
                dataSources={['sanctioned-entities']}
                dataFieldMap={{
                  'sanctioned-entities': { entity_name: 'entity_name', country: 'country' },
                }}
                samples={[
                  { name: 'UAE Holding', desc: 'Suspected Russian beneficial owner', data: { entity_name: 'Acme Holdings DMCC', country: 'UAE', ownership_tree: 'Acme Holdings DMCC -> Vega Capital Ltd (60%, BVI) -> Mr. Ivanov (100%, RU passport)\nAcme Holdings DMCC -> Local Director (40%, UAE)', notes: 'Recent restructure in 2022.' }},
                  { name: 'Shell Layered', desc: 'Multi-layer shell chain', data: { entity_name: 'Global Trade Group Inc', country: 'Cyprus', ownership_tree: 'Global Trade Group -> Layer1 Ltd (Seychelles, 100%) -> Layer2 Ltd (BVI, 100%) -> Trustee X (nominee)', notes: 'Trustee structure, no UBO declared.' }},
                ]}
              />
            } />

            <Route path="/ai/supply-chain-trace" element={<AISupplyChainTrace />} />

            <Route path="/ai/training-simulate" element={
              <AIFeature
                title="AI Compliance Training Simulator"
                description="Generate a scenario question, then evaluate your trainee response. Cites EAR/OFAC/EU regulations."
                endpoint="trainingSimulate"
                fields={[
                  { key: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. dual-use exports to country X' },
                  { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['easy', 'medium', 'hard'] },
                  { key: 'scenario', label: 'Scenario (paste from phase 1 result)', type: 'textarea' },
                  { key: 'user_response', label: 'Your answer (omit on first call)', type: 'textarea' },
                ]}
                samples={[
                  { name: 'Generate scenario', data: { topic: 'transshipment risk', difficulty: 'medium' } },
                ]}
              />
            } />

            <Route path="/ai/competitor-benchmark" element={
              <AIFeature
                title="AI Competitor Compliance Benchmark"
                description="Compare your compliance program to peer practices (W-A, FATF, OFAC, SCCE)."
                endpoint="competitorBenchmark"
                fields={[
                  { key: 'our_industry', label: 'Industry', type: 'text', required: true, placeholder: 'e.g. semiconductor manufacturing' },
                  { key: 'our_size_band', label: 'Size band', type: 'select', options: ['startup', 'mid-market', 'enterprise', 'global'] },
                  { key: 'focus_areas', label: 'Focus areas (comma-sep, optional)', type: 'text', placeholder: 'screening, ECCN classification, training' },
                  { key: 'peer_practices', label: 'Known peer practices we already do (comma-sep, optional)', type: 'text' },
                ]}
                samples={[
                  { name: 'Semis, mid-market', data: { our_industry: 'semiconductor manufacturing', our_size_band: 'mid-market' } },
                ]}
              />
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
