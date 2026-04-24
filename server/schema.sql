DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS screening_results CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS export_licenses CASCADE;
DROP TABLE IF EXISTS compliance_documents CASCADE;
DROP TABLE IF EXISTS restricted_end_uses CASCADE;
DROP TABLE IF EXISTS controlled_items CASCADE;
DROP TABLE IF EXISTS restricted_countries CASCADE;
DROP TABLE IF EXISTS sanctioned_entities CASCADE;
DROP TABLE IF EXISTS denied_parties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'analyst',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sanctioned_entities (
  id SERIAL PRIMARY KEY,
  entity_name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  sanctions_list VARCHAR(255) NOT NULL,
  designation_date DATE,
  reason TEXT,
  aliases TEXT,
  status VARCHAR(50) DEFAULT 'active',
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE denied_parties (
  id SERIAL PRIMARY KEY,
  party_name VARCHAR(255) NOT NULL,
  party_type VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  list_source VARCHAR(255) NOT NULL,
  federal_register_notice VARCHAR(255),
  effective_date DATE,
  expiration_date DATE,
  standard_order VARCHAR(10) DEFAULT 'Y',
  reason TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE restricted_countries (
  id SERIAL PRIMARY KEY,
  country_name VARCHAR(100) NOT NULL,
  country_code VARCHAR(10) NOT NULL,
  restriction_type VARCHAR(100) NOT NULL,
  embargo_level VARCHAR(50) NOT NULL,
  governing_regulation VARCHAR(255),
  risk_tier VARCHAR(20) NOT NULL,
  description TEXT,
  effective_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE controlled_items (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  eccn VARCHAR(50),
  usml_category VARCHAR(50),
  control_type VARCHAR(100) NOT NULL,
  description TEXT,
  technical_specs TEXT,
  license_requirement VARCHAR(255),
  classification_basis VARCHAR(255),
  dual_use BOOLEAN DEFAULT false,
  risk_level VARCHAR(50) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_ref VARCHAR(100) UNIQUE NOT NULL,
  exporter_name VARCHAR(255) NOT NULL,
  consignee_name VARCHAR(255) NOT NULL,
  end_user_name VARCHAR(255),
  item_description TEXT NOT NULL,
  eccn VARCHAR(50),
  destination_country VARCHAR(100) NOT NULL,
  value_usd DECIMAL(15,2),
  transaction_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  risk_score INTEGER DEFAULT 0,
  screening_status VARCHAR(50) DEFAULT 'not_screened',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE export_licenses (
  id SERIAL PRIMARY KEY,
  license_number VARCHAR(100) UNIQUE NOT NULL,
  license_type VARCHAR(100) NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  consignee_name VARCHAR(255) NOT NULL,
  destination_country VARCHAR(100) NOT NULL,
  item_description TEXT NOT NULL,
  eccn VARCHAR(50),
  value_usd DECIMAL(15,2),
  issue_date DATE,
  expiration_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  conditions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE compliance_documents (
  id SERIAL PRIMARY KEY,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  related_transaction VARCHAR(100),
  content TEXT,
  compliance_status VARCHAR(50) DEFAULT 'pending_review',
  review_notes TEXT,
  reviewed_by VARCHAR(255),
  review_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE restricted_end_uses (
  id SERIAL PRIMARY KEY,
  end_use_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  governing_regulation VARCHAR(255),
  risk_level VARCHAR(50) DEFAULT 'high',
  indicators TEXT,
  mitigation_measures TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE screening_results (
  id SERIAL PRIMARY KEY,
  screening_type VARCHAR(100) NOT NULL,
  entity_screened VARCHAR(255) NOT NULL,
  match_found BOOLEAN DEFAULT false,
  match_score DECIMAL(5,2) DEFAULT 0,
  matched_entity VARCHAR(255),
  matched_list VARCHAR(255),
  risk_level VARCHAR(50),
  ai_analysis TEXT,
  recommendation TEXT,
  screened_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id INTEGER,
  user_id INTEGER REFERENCES users(id),
  details TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
