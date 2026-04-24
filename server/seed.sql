-- Seed Users
INSERT INTO users (email, password, full_name, role) VALUES
('admin@exportcontrol.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin'),
('analyst@exportcontrol.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Analyst', 'analyst'),
('reviewer@exportcontrol.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob Reviewer', 'reviewer');

-- Seed Sanctioned Entities (15+ items)
INSERT INTO sanctioned_entities (entity_name, entity_type, country, sanctions_list, designation_date, reason, aliases, status, risk_score) VALUES
('Rostec Corporation', 'State Corporation', 'Russia', 'SDN List (OFAC)', '2022-02-28', 'Russian defense conglomerate involved in military equipment production', 'Rostec, Russian Technologies', 'active', 95),
('Huawei Technologies Co.', 'Corporation', 'China', 'Entity List (BIS)', '2019-05-16', 'Activities contrary to US national security interests', 'Huawei, HW Tech', 'active', 88),
('Iranian Revolutionary Guard Corps', 'Military Organization', 'Iran', 'SDN List (OFAC)', '2019-04-15', 'Designated Foreign Terrorist Organization', 'IRGC, Sepah', 'active', 99),
('Korea Mining Development Trading Corp', 'State Enterprise', 'North Korea', 'SDN List (OFAC)', '2009-06-12', 'Weapons of mass destruction proliferation', 'KOMID', 'active', 97),
('Almaz-Antey', 'Defense Corporation', 'Russia', 'SDN List (OFAC)', '2014-07-16', 'Manufacturer of SA-11 surface-to-air missiles', 'Almaz Antey, Concern Almaz-Antey', 'active', 93),
('Syrian Scientific Studies and Research Center', 'Government Agency', 'Syria', 'SDN List (OFAC)', '2005-06-29', 'Chemical weapons development program', 'SSRC, CERS', 'active', 96),
('Kalashnikov Concern', 'Defense Manufacturer', 'Russia', 'SDN List (OFAC)', '2014-07-16', 'Arms manufacturing for Russian military', 'Kalashnikov, Izhmash', 'active', 89),
('Semiconductor Manufacturing Intl Corp', 'Semiconductor Manufacturer', 'China', 'Entity List (BIS)', '2020-12-18', 'Military-civil fusion risk', 'SMIC', 'active', 85),
('Hikvision Digital Technology', 'Technology Company', 'China', 'Entity List (BIS)', '2019-10-07', 'Surveillance technology used in human rights abuses', 'Hikvision, Hangzhou Hikvision', 'active', 82),
('National Iranian Oil Company', 'State Enterprise', 'Iran', 'SDN List (OFAC)', '2018-11-05', 'Primary source of funding for Iranian regime', 'NIOC', 'active', 91),
('Belarusian Military Industry Committee', 'Government Agency', 'Belarus', 'SDN List (OFAC)', '2021-06-21', 'Support for Lukashenko regime', 'Beltech, BMIC', 'active', 78),
('Wagner Group', 'Private Military Company', 'Russia', 'SDN List (OFAC)', '2023-01-26', 'Destabilizing activities in multiple countries', 'PMC Wagner, Prigozhin Group', 'active', 98),
('Pakistan Atomic Energy Commission', 'Government Agency', 'Pakistan', 'Entity List (BIS)', '1998-06-01', 'Nuclear weapons proliferation concerns', 'PAEC', 'active', 87),
('Aerospace Long-March Intl Trade Co', 'State Enterprise', 'China', 'Entity List (BIS)', '2018-08-01', 'Missile technology proliferation', 'ALIT, CALT Trading', 'active', 84),
('Venezuelan Military Industries Company', 'State Enterprise', 'Venezuela', 'SDN List (OFAC)', '2019-03-19', 'Support for Maduro regime', 'CAVIM', 'active', 76),
('Norinco Group', 'Defense Conglomerate', 'China', 'SDN List (OFAC)', '2003-05-28', 'Weapons proliferation to Iran', 'China North Industries', 'active', 90);

-- Seed Denied Parties (15+ items)
INSERT INTO denied_parties (party_name, party_type, country, list_source, federal_register_notice, effective_date, reason, status) VALUES
('Ahmad Al-Rashid', 'Individual', 'Syria', 'Denied Persons List', 'FR 2023-04521', '2023-03-15', 'Export violations related to dual-use electronics', 'active'),
('TechFlow Electronics Ltd', 'Company', 'China', 'Denied Persons List', 'FR 2022-18934', '2022-09-01', 'Illegal diversion of controlled semiconductors', 'active'),
('Viktor Petrov', 'Individual', 'Russia', 'Denied Persons List', 'FR 2023-11287', '2023-06-20', 'Attempted procurement of defense articles', 'active'),
('Global Precision Industries', 'Company', 'Pakistan', 'Denied Persons List', 'FR 2021-25634', '2021-12-10', 'Nuclear proliferation activities', 'active'),
('Mehdi Karimi Trading', 'Company', 'Iran', 'Denied Persons List', 'FR 2022-07891', '2022-04-15', 'Sanctions evasion and money laundering', 'active'),
('Chen Wei Electronics', 'Company', 'China', 'Unverified List', 'FR 2023-09876', '2023-05-01', 'Unable to verify end-use of controlled items', 'active'),
('Omar Hassan', 'Individual', 'Libya', 'Denied Persons List', 'FR 2021-33456', '2021-11-30', 'Arms trafficking violations', 'active'),
('Belarustechnika JSC', 'Company', 'Belarus', 'Denied Persons List', 'FR 2022-14567', '2022-07-15', 'Military end-use violations', 'active'),
('Raj Patel Export Services', 'Company', 'India', 'Unverified List', 'FR 2023-02345', '2023-02-01', 'Failure to provide end-use certificates', 'active'),
('Kim Sung Electronics', 'Company', 'North Korea', 'Denied Persons List', 'FR 2020-45678', '2020-08-20', 'WMD procurement network', 'active'),
('Falcon Trading DMCC', 'Company', 'UAE', 'Denied Persons List', 'FR 2023-07654', '2023-04-10', 'Transshipment of controlled technology', 'active'),
('Maria Sokolova', 'Individual', 'Russia', 'Denied Persons List', 'FR 2022-29876', '2022-10-15', 'Export of defense articles without license', 'active'),
('Myanmar Metals Corp', 'Company', 'Myanmar', 'Denied Persons List', 'FR 2021-18765', '2021-06-01', 'Support for military junta', 'active'),
('Ali Mohammed Trading', 'Company', 'Yemen', 'Denied Persons List', 'FR 2022-34567', '2022-08-20', 'Diversion of humanitarian goods', 'active'),
('DarkMatter Technologies', 'Company', 'UAE', 'Entity List', 'FR 2019-23456', '2019-11-01', 'Cyber surveillance tools proliferation', 'active'),
('Juan Carlos Morales', 'Individual', 'Venezuela', 'SDN List', 'FR 2023-12345', '2023-01-15', 'Drug trafficking and sanctions evasion', 'active');

-- Seed Restricted Countries (15+ items)
INSERT INTO restricted_countries (country_name, country_code, restriction_type, embargo_level, governing_regulation, risk_tier, description, effective_date, status) VALUES
('Russia', 'RU', 'Comprehensive Sanctions', 'Full Embargo', 'EAR Part 746', 'Tier 1', 'Comprehensive trade restrictions due to Ukraine invasion', '2022-02-24', 'active'),
('China', 'CN', 'Entity-Based Restrictions', 'Partial Embargo', 'EAR Part 744', 'Tier 2', 'Technology transfer controls, military end-use restrictions', '2020-01-01', 'active'),
('Iran', 'IR', 'Comprehensive Sanctions', 'Full Embargo', 'ITSR 31 CFR 560', 'Tier 1', 'Comprehensive trade and financial sanctions', '1995-05-06', 'active'),
('North Korea', 'KP', 'Comprehensive Sanctions', 'Full Embargo', 'NKSR 31 CFR 510', 'Tier 1', 'Complete trade embargo and asset freeze', '2008-06-26', 'active'),
('Syria', 'SY', 'Comprehensive Sanctions', 'Full Embargo', 'SySR 31 CFR 542', 'Tier 1', 'Comprehensive economic sanctions', '2011-08-18', 'active'),
('Cuba', 'CU', 'Comprehensive Sanctions', 'Full Embargo', 'CACR 31 CFR 515', 'Tier 1', 'Comprehensive trade and travel restrictions', '1962-02-03', 'active'),
('Venezuela', 'VE', 'Sectoral Sanctions', 'Partial Embargo', 'EO 13884', 'Tier 2', 'Government-related transactions blocked', '2019-08-05', 'active'),
('Belarus', 'BY', 'Targeted Sanctions', 'Partial Embargo', 'EAR Part 746', 'Tier 2', 'Restrictions supporting Russia sanctions', '2022-03-02', 'active'),
('Myanmar', 'MM', 'Targeted Sanctions', 'Partial Embargo', 'BSR 31 CFR 525', 'Tier 2', 'Sanctions against military junta', '2021-02-11', 'active'),
('Libya', 'LY', 'Targeted Sanctions', 'Partial Embargo', 'LSR 31 CFR 570', 'Tier 2', 'Arms embargo and asset freezes', '2011-02-25', 'active'),
('Somalia', 'SO', 'Arms Embargo', 'Partial Embargo', 'UNSCR 733', 'Tier 2', 'UN arms embargo', '1992-01-23', 'active'),
('Sudan', 'SD', 'Comprehensive Sanctions', 'Full Embargo', 'SSR 31 CFR 538', 'Tier 1', 'Trade and financial sanctions', '1997-11-03', 'active'),
('Iraq', 'IQ', 'Targeted Sanctions', 'Limited Restrictions', 'EAR Part 746', 'Tier 3', 'WMD-related restrictions', '2003-08-06', 'active'),
('Afghanistan', 'AF', 'Targeted Sanctions', 'Partial Embargo', 'EO 14064', 'Tier 2', 'Taliban-related sanctions', '2022-02-11', 'active'),
('Yemen', 'YE', 'Arms Embargo', 'Partial Embargo', 'UNSCR 2216', 'Tier 2', 'Arms embargo on Houthi forces', '2015-04-14', 'active'),
('Eritrea', 'ER', 'Arms Embargo', 'Partial Embargo', 'UNSCR 1907', 'Tier 3', 'UN arms embargo', '2009-12-23', 'active');

-- Seed Controlled Items (15+ items)
INSERT INTO controlled_items (item_name, eccn, usml_category, control_type, description, technical_specs, license_requirement, classification_basis, dual_use, risk_level) VALUES
('Advanced Radar System', '3A001', NULL, 'EAR', 'Phased array radar for tracking and surveillance', 'Frequency: 1-40 GHz, Range: 500km', 'License required for all destinations', 'Technical parameters exceed EAR thresholds', true, 'high'),
('Night Vision Goggles Gen III', NULL, 'XII(c)', 'ITAR', 'Third generation image intensifier night vision', 'Resolution: 64 lp/mm, SNR: 25+', 'ITAR controlled - State Dept approval required', 'USML Category XII', false, 'critical'),
('5-Axis CNC Machine', '2B001', NULL, 'EAR', 'Computer numerical control machine tool', 'Positioning accuracy: 0.001mm, 5-axis simultaneous', 'License required for D:1 countries', 'Exceeds positioning accuracy threshold', true, 'high'),
('Thermal Imaging Camera', '6A003', NULL, 'EAR', 'Uncooled infrared focal plane array camera', 'NETD: <40mK, Resolution: 640x480', 'License required for most destinations', 'ITAR-waiver items controlled under EAR', true, 'high'),
('Encryption Module AES-256', '5A002', NULL, 'EAR', 'Hardware encryption module with AES-256', 'Key length: 256-bit, Throughput: 10Gbps', 'License Exception ENC available', 'Exceeds 56-bit encryption threshold', true, 'medium'),
('Inertial Navigation System', '7A003', NULL, 'EAR', 'Ring laser gyroscope navigation system', 'Drift rate: <0.01 deg/hr', 'License required for D:1 countries', 'Accuracy exceeds control threshold', true, 'critical'),
('Carbon Fiber Composite', '1C010', NULL, 'EAR', 'High-modulus carbon fiber composite material', 'Tensile modulus: >600 GPa', 'License required for WMD concerns', 'Exceeds tensile modulus threshold', true, 'high'),
('Satellite Communication Terminal', '5A001', NULL, 'EAR', 'Military-grade SATCOM ground terminal', 'Frequency: Ka-band, Data rate: 100Mbps', 'License required for most destinations', 'Military communication capability', true, 'high'),
('Chemical Agent Detector', '1A004', NULL, 'EAR', 'Portable chemical warfare agent detection system', 'Detection: nerve, blister, blood agents', 'License required for CB concerns', 'Chemical weapons detection capability', true, 'high'),
('Unmanned Aerial Vehicle', NULL, 'VIII(a)', 'ITAR', 'Tactical UAV with ISR payload capability', 'Endurance: 24hrs, Ceiling: 25,000ft', 'ITAR controlled - State Dept approval', 'USML Category VIII', false, 'critical'),
('Semiconductor Lithography Equipment', '3B001', NULL, 'EAR', 'Deep UV lithography system for IC manufacturing', 'Wavelength: 193nm, Resolution: 7nm', 'License required for Entity List parties', 'Advanced semiconductor manufacturing', true, 'critical'),
('Biological Safety Cabinet Class III', '2B352', NULL, 'EAR', 'Containment equipment for biological agents', 'HEPA filtration, negative pressure', 'License required for CB concerns', 'Biological weapons concern', true, 'high'),
('High-Speed Digital Oscilloscope', '3A002', NULL, 'EAR', 'Digital sampling oscilloscope', 'Bandwidth: >4 GHz, Sample rate: 40 GS/s', 'License required for D:1 countries', 'Exceeds bandwidth threshold', true, 'medium'),
('Maraging Steel 350', '1C002', NULL, 'EAR', 'Ultra-high strength steel alloy', 'UTS: >2050 MPa', 'License required for nuclear concerns', 'Nuclear-applicable material', true, 'high'),
('GPS Jamming Equipment', NULL, 'XI(a)', 'ITAR', 'Electronic warfare GPS denial system', 'Effective range: 50km', 'ITAR controlled - strict prohibition', 'USML Category XI', false, 'critical'),
('Toxin Production Equipment', '2B352', NULL, 'EAR', 'Fermentation vessel with containment', 'Volume: 100L, P3 containment', 'License required for all destinations', 'Biological weapons production capable', true, 'critical');

-- Seed Transactions (15+ items)
INSERT INTO transactions (transaction_ref, exporter_name, consignee_name, end_user_name, item_description, eccn, destination_country, value_usd, transaction_date, status, risk_score, screening_status) VALUES
('TXN-2024-001', 'Lockheed Martin Corp', 'BAE Systems plc', 'UK Ministry of Defence', 'Radar subsystem components', '3A001', 'United Kingdom', 2500000.00, '2024-01-15', 'approved', 15, 'cleared'),
('TXN-2024-002', 'Intel Corporation', 'Unknown Electronics GmbH', NULL, 'Advanced semiconductor chips', '3A001', 'Germany', 450000.00, '2024-02-01', 'pending', 45, 'pending_review'),
('TXN-2024-003', 'Raytheon Technologies', 'Saudi Arabian Military Industries', 'Royal Saudi Air Force', 'Missile guidance components', '7A003', 'Saudi Arabia', 8500000.00, '2024-02-15', 'under_review', 65, 'flagged'),
('TXN-2024-004', 'Applied Materials Inc', 'TSMC', 'TSMC Fab Operations', 'Lithography equipment parts', '3B001', 'Taiwan', 12000000.00, '2024-03-01', 'approved', 20, 'cleared'),
('TXN-2024-005', 'Northrop Grumman', 'Elbit Systems', 'Israeli Defense Forces', 'Night vision systems', '6A003', 'Israel', 3200000.00, '2024-03-10', 'approved', 30, 'cleared'),
('TXN-2024-006', 'General Dynamics', 'Rostec Subsidiary LLC', NULL, 'CNC machine components', '2B001', 'Russia', 750000.00, '2024-03-15', 'denied', 98, 'blocked'),
('TXN-2024-007', 'Cisco Systems', 'Huawei Cloud Division', 'Huawei Technologies', 'Network routing equipment', '5A001', 'China', 1800000.00, '2024-04-01', 'denied', 92, 'blocked'),
('TXN-2024-008', 'Boeing Defense', 'Japan Self Defense Force', 'JASDF', 'UAV spare parts', '9A610', 'Japan', 5600000.00, '2024-04-15', 'approved', 10, 'cleared'),
('TXN-2024-009', 'Thermo Fisher Scientific', 'Tehran University', 'Research Department', 'Biological containment equipment', '2B352', 'Iran', 200000.00, '2024-04-20', 'denied', 99, 'blocked'),
('TXN-2024-010', 'Honeywell Aerospace', 'Singapore Technologies', 'ST Aerospace', 'Inertial navigation units', '7A003', 'Singapore', 4100000.00, '2024-05-01', 'approved', 25, 'cleared'),
('TXN-2024-011', 'Qualcomm Inc', 'Unnamed Trading Co', NULL, 'Advanced RF chips', '3A001', 'UAE', 890000.00, '2024-05-10', 'pending', 55, 'pending_review'),
('TXN-2024-012', 'L3Harris Technologies', 'Korean Air Aerospace', 'Republic of Korea Air Force', 'Electronic warfare modules', '3A001', 'South Korea', 7200000.00, '2024-05-20', 'approved', 20, 'cleared'),
('TXN-2024-013', 'Textron Systems', 'Mystery Buyer Inc', NULL, 'Armored vehicle parts', '0A606', 'Pakistan', 1500000.00, '2024-06-01', 'under_review', 78, 'flagged'),
('TXN-2024-014', 'Motorola Solutions', 'Havana Communications', 'Cuban Telecom Ministry', 'Encrypted radio systems', '5A002', 'Cuba', 350000.00, '2024-06-10', 'denied', 95, 'blocked'),
('TXN-2024-015', 'Aerojet Rocketdyne', 'Mitsubishi Heavy Industries', 'JAXA', 'Rocket propulsion components', '9A515', 'Japan', 15000000.00, '2024-06-15', 'approved', 18, 'cleared'),
('TXN-2024-016', 'NVIDIA Corporation', 'Alibaba Cloud', 'Alibaba Group', 'AI training accelerators', '3A090', 'China', 25000000.00, '2024-07-01', 'under_review', 72, 'flagged');

-- Seed Export Licenses (15+ items)
INSERT INTO export_licenses (license_number, license_type, applicant_name, consignee_name, destination_country, item_description, eccn, value_usd, issue_date, expiration_date, status, conditions) VALUES
('LIC-2024-0001', 'Individual Validated License', 'Lockheed Martin Corp', 'BAE Systems plc', 'United Kingdom', 'Radar subsystem components for Typhoon program', '3A001', 2500000.00, '2024-01-10', '2025-01-10', 'active', 'End-use limited to Typhoon radar upgrade program'),
('LIC-2024-0002', 'Distribution License', 'Intel Corporation', 'Arrow Electronics GmbH', 'Germany', 'Commercial semiconductor distribution', '3A001', 5000000.00, '2024-02-01', '2026-02-01', 'active', 'Authorized distributors only'),
('LIC-2024-0003', 'DSP-73 Manufacturing Agreement', 'Raytheon Technologies', 'SAMI', 'Saudi Arabia', 'Missile guidance system co-production', '7A003', 50000000.00, '2024-01-15', '2029-01-15', 'active', 'Subject to Congressional notification'),
('LIC-2024-0004', 'License Exception TSR', 'MIT Lincoln Laboratory', 'Cambridge University', 'United Kingdom', 'Research collaboration on radar technology', '3E001', 0.00, '2024-03-01', '2025-03-01', 'active', 'Fundamental research exemption'),
('LIC-2024-0005', 'Individual Validated License', 'Northrop Grumman', 'Elbit Systems', 'Israel', 'Night vision technology transfer', '6A003', 3200000.00, '2024-03-05', '2025-03-05', 'active', 'No re-export without USG approval'),
('LIC-2024-0006', 'DSP-5 Permanent Export', 'Boeing Defense', 'JASDF Procurement', 'Japan', 'UAV spare parts and technical data', '9A610', 5600000.00, '2024-04-10', '2025-04-10', 'active', 'FMS case JP-P-ABC'),
('LIC-2024-0007', 'Denied', 'General Dynamics', 'Unknown Russian Entity', 'Russia', 'CNC machine tool', '2B001', 750000.00, '2024-03-15', NULL, 'denied', 'Comprehensive sanctions - Russia'),
('LIC-2024-0008', 'License Exception ENC', 'Cisco Systems', 'Vodafone Group', 'Multiple', 'Commercial encryption products', '5A002', 10000000.00, '2024-01-01', '2025-01-01', 'active', 'Mass market encryption exception'),
('LIC-2024-0009', 'Individual Validated License', 'Honeywell Aerospace', 'ST Aerospace', 'Singapore', 'Inertial measurement units', '7A003', 4100000.00, '2024-04-25', '2025-04-25', 'active', 'Civil aviation end-use only'),
('LIC-2024-0010', 'Returned Without Action', 'Thermo Fisher', 'Tehran University', 'Iran', 'Biological equipment', '2B352', 200000.00, '2024-04-20', NULL, 'rwa', 'Iran comprehensive sanctions apply'),
('LIC-2024-0011', 'DSP-5 Permanent Export', 'L3Harris Technologies', 'Korean Air Aerospace', 'South Korea', 'EW system components', '3A001', 7200000.00, '2024-05-15', '2026-05-15', 'active', 'Authorized under bilateral agreement'),
('LIC-2024-0012', 'Individual Validated License', 'Aerojet Rocketdyne', 'MHI', 'Japan', 'Rocket propulsion technology', '9A515', 15000000.00, '2024-06-10', '2026-06-10', 'active', 'H-3 launch vehicle program only'),
('LIC-2024-0013', 'Pending Review', 'NVIDIA Corporation', 'Alibaba Cloud', 'China', 'AI accelerator chips', '3A090', 25000000.00, NULL, NULL, 'pending', 'Under interagency review'),
('LIC-2024-0014', 'Denied', 'Motorola Solutions', 'Cuban Ministry', 'Cuba', 'Encrypted communications', '5A002', 350000.00, '2024-06-10', NULL, 'denied', 'Cuba comprehensive sanctions'),
('LIC-2024-0015', 'STA Authorization', 'Applied Materials', 'TSMC', 'Taiwan', 'Semiconductor manufacturing equipment', '3B001', 12000000.00, '2024-02-20', '2025-02-20', 'active', 'Strategic Trade Authorization eligible'),
('LIC-2024-0016', 'Individual Validated License', 'General Atomics', 'Turkish Aerospace', 'Turkey', 'UAV engine components', '9A610', 8500000.00, '2024-07-01', '2025-07-01', 'active', 'NATO ally - expedited review');

-- Seed Compliance Documents (15+ items)
INSERT INTO compliance_documents (document_name, document_type, related_transaction, content, compliance_status, review_notes, reviewed_by) VALUES
('End-Use Certificate - BAE Systems', 'End-Use Certificate', 'TXN-2024-001', 'Certifies radar components for UK MOD Typhoon program', 'approved', 'Valid EUC on file, UK Government countersigned', 'Jane Analyst'),
('Shipper Export Declaration - Intel', 'Export Declaration', 'TXN-2024-002', 'SED for semiconductor shipment to Germany', 'pending_review', 'Awaiting consignee verification', NULL),
('Congressional Notification - SAMI', 'Government Notification', 'TXN-2024-003', 'Required congressional notification for defense sale >$25M', 'under_review', 'Submitted to DSCA, 30-day review period', 'Bob Reviewer'),
('Technology Control Plan - TSMC', 'Control Plan', 'TXN-2024-004', 'Technology control plan for lithography equipment', 'approved', 'TCP approved by BIS', 'Jane Analyst'),
('End-Use Certificate - Elbit', 'End-Use Certificate', 'TXN-2024-005', 'Night vision systems for Israeli defense use', 'approved', 'Israeli MOD countersigned', 'Bob Reviewer'),
('Denial Order - Rostec', 'Denial Order', 'TXN-2024-006', 'Transaction denied under Russia sanctions', 'denied', 'Comprehensive sanctions apply', 'Admin User'),
('Entity List Screening - Huawei', 'Screening Report', 'TXN-2024-007', 'Entity List match confirmed for Huawei division', 'denied', 'BIS Entity List - license required, presumption of denial', 'Jane Analyst'),
('FMS Letter of Offer - JASDF', 'Government Agreement', 'TXN-2024-008', 'Foreign Military Sales case for UAV parts', 'approved', 'FMS LOA executed, Congressional notification complete', 'Admin User'),
('Sanctions Screening - Tehran', 'Screening Report', 'TXN-2024-009', 'OFAC screening confirmed Iran sanctions apply', 'denied', 'Comprehensive Iran sanctions - no license available', 'Jane Analyst'),
('End-Use Certificate - ST Aero', 'End-Use Certificate', 'TXN-2024-010', 'Civil aviation end-use certification', 'approved', 'Singapore CAA certification verified', 'Bob Reviewer'),
('Due Diligence Report - UAE Buyer', 'Due Diligence', 'TXN-2024-011', 'Enhanced due diligence on unnamed UAE trading company', 'under_review', 'KYC documentation incomplete', NULL),
('NATO Certification - Korean Air', 'Government Agreement', 'TXN-2024-012', 'NATO interoperability certification for EW modules', 'approved', 'ROK-US defense cooperation agreement', 'Admin User'),
('Red Flag Assessment - Pakistan', 'Risk Assessment', 'TXN-2024-013', 'Red flags identified in Pakistan transaction', 'flagged', 'Unknown end-user, possible military diversion', 'Jane Analyst'),
('Sanctions Denial - Cuba Telecom', 'Denial Order', 'TXN-2024-014', 'Cuba comprehensive sanctions denial', 'denied', 'CACR prohibits this transaction', 'Bob Reviewer'),
('STA Eligibility Review - TSMC', 'Compliance Review', 'TXN-2024-004', 'Strategic Trade Authorization eligibility assessment', 'approved', 'Taiwan STA-eligible destination', 'Jane Analyst'),
('ICP Annual Review', 'Internal Compliance', NULL, 'Annual Internal Compliance Program review and audit', 'approved', 'No material findings, program adequate', 'Admin User');

-- Seed Restricted End Uses (15+ items)
INSERT INTO restricted_end_uses (end_use_name, category, description, governing_regulation, risk_level, indicators, mitigation_measures) VALUES
('Nuclear Weapons Development', 'Nuclear', 'Development, production, or use of nuclear weapons or nuclear explosive devices', 'EAR §744.2', 'critical', 'Enrichment equipment requests, heavy water purchases, centrifuge components', 'Deny all transactions, report to BIS'),
('Chemical Weapons Production', 'Chemical/Biological', 'Production of chemical warfare agents or precursors', 'EAR §744.4', 'critical', 'Precursor chemical orders, reactor vessel requests, corrosion-resistant equipment', 'Deny all transactions, report to BIS and OPCW'),
('Biological Weapons Development', 'Chemical/Biological', 'Development of biological weapons or toxin agents', 'EAR §744.4', 'critical', 'Containment equipment, pathogen orders, aerosol dispersal technology', 'Deny all transactions, report to BIS'),
('Missile Technology Proliferation', 'Missile', 'Development of missile systems capable of delivering WMD', 'EAR §744.3', 'critical', 'Guidance systems, propulsion components, re-entry vehicle technology', 'Deny all transactions, report to MTCR partners'),
('Military Intelligence Surveillance', 'Military', 'Intelligence gathering and surveillance operations', 'EAR §744.17', 'high', 'Signals intelligence equipment, satellite imagery, communications intercept', 'License required, enhanced due diligence'),
('Conventional Arms Buildup', 'Military', 'Destabilizing accumulation of conventional weapons', 'EAR §742.4', 'high', 'Large quantity orders, inconsistent end-user profile, unusual routing', 'License required, end-use verification'),
('Human Rights Abuses', 'Human Rights', 'Items used to commit human rights abuses including surveillance of civilians', 'EAR §744.6', 'high', 'Mass surveillance systems, internet monitoring, biometric identification', 'Deny transactions, report to State Dept'),
('Cyber Weapons Development', 'Cyber', 'Development of offensive cyber capabilities and intrusion software', 'Wassenaar Arrangement', 'high', 'Zero-day exploits, intrusion software, IP network surveillance', 'License required under Wassenaar controls'),
('Terrorism Support', 'Terrorism', 'Material support for designated terrorist organizations', '18 USC §2339B', 'critical', 'Designated FTO end-users, conflict zone destinations, dual-use explosives', 'Deny all transactions, report to FBI/Treasury'),
('Drug Trafficking', 'Narcotics', 'Support for drug production or trafficking operations', 'Foreign Narcotics Kingpin Act', 'high', 'Chemical precursors, encryption for drug networks, aircraft modifications', 'Deny transactions, report to DEA'),
('Sanctions Evasion', 'Sanctions', 'Attempts to circumvent US sanctions programs', 'IEEPA', 'critical', 'Shell companies, unusual payment methods, transshipment through third countries', 'Enhanced screening, report to OFAC'),
('Military End-Use (China)', 'Military', 'Items supporting Chinese military modernization', 'EAR §744.21', 'high', 'PLA-affiliated end-users, military-civil fusion entities', 'License required, presumption of denial for military'),
('Forced Labor', 'Human Rights', 'Items produced using or supporting forced labor', 'UFLPA', 'high', 'Xinjiang-sourced materials, prison labor indicators', 'Withhold release orders, CBP enforcement'),
('Maritime Nuclear Propulsion', 'Nuclear', 'Nuclear propulsion systems for naval vessels', 'ITAR/USML Cat. VI', 'critical', 'Reactor components, fuel elements, propulsion designs', 'ITAR controlled, State Dept approval only'),
('Space Launch Vehicle Technology', 'Missile', 'Technology applicable to space launch vehicles with WMD delivery capability', 'MTCR Category I', 'high', 'Guidance systems, staging mechanisms, thrust vectoring', 'MTCR review required, case-by-case basis'),
('Directed Energy Weapons', 'Military', 'High-energy laser or microwave weapon systems', 'USML Category XII', 'critical', 'High-power laser components, HPM generators, beam steering', 'ITAR controlled, strict end-use monitoring');

-- Seed Screening Results (15+ items)
INSERT INTO screening_results (screening_type, entity_screened, match_found, match_score, matched_entity, matched_list, risk_level, ai_analysis, recommendation, screened_by) VALUES
('Entity Screening', 'BAE Systems plc', false, 0, NULL, NULL, 'low', 'No matches found on any restricted party lists. BAE Systems is a well-known UK defense contractor with existing US export relationships.', 'Clear - proceed with transaction', 1),
('Entity Screening', 'Rostec Subsidiary LLC', true, 98.5, 'Rostec Corporation', 'SDN List (OFAC)', 'critical', 'High-confidence match to OFAC SDN entity Rostec Corporation. Entity is comprehensively sanctioned under Russia/Ukraine sanctions.', 'Block - sanctioned entity match', 2),
('Denied Party Screening', 'Unknown Electronics GmbH', false, 15.2, NULL, NULL, 'medium', 'No direct matches found. However, limited publicly available information raises concerns about entity legitimacy.', 'Proceed with enhanced due diligence', 2),
('Country Risk Assessment', 'Saudi Arabia Transaction', false, 0, NULL, NULL, 'medium', 'Saudi Arabia is not comprehensively sanctioned but has restrictions on certain defense articles. Congressional notification required for FMS over $25M.', 'Proceed with appropriate licensing', 1),
('End-Use Screening', 'Tehran University Research', true, 95.0, 'Iran Sanctions Program', 'OFAC Country Programs', 'critical', 'Iran is comprehensively sanctioned. Academic research exemptions are extremely narrow and likely do not apply to controlled biological equipment.', 'Block - Iran comprehensive sanctions', 2),
('Entity Screening', 'Huawei Cloud Division', true, 92.0, 'Huawei Technologies Co.', 'Entity List (BIS)', 'high', 'Huawei Cloud Division is affiliated with Huawei Technologies, which is on the BIS Entity List. License required with presumption of denial.', 'Block - Entity List match', 2),
('Dual-Use Assessment', 'CNC Machine Export', false, 0, NULL, NULL, 'high', 'While no party match found, the 5-axis CNC machine exceeds controlled parameters and requires an export license regardless of destination.', 'License required - classified 2B001', 1),
('Transaction Screening', 'NVIDIA-Alibaba Deal', true, 78.5, 'Military-Civil Fusion Concern', 'Entity List (BIS)', 'high', 'Alibaba Cloud has known connections to Chinese military research. A100/H100 chips are controlled under 3A090 for China destinations.', 'Requires BIS license - likely denial', 2),
('Entity Screening', 'Mitsubishi Heavy Industries', false, 0, NULL, NULL, 'low', 'No restricted party matches. MHI is a well-established Japanese defense and industrial conglomerate with strong US trade relationships.', 'Clear - proceed with STA authorization', 1),
('Entity Screening', 'Mystery Buyer Inc', false, 35.0, NULL, NULL, 'high', 'No direct matches but entity could not be verified. Multiple red flags: generic company name, no web presence, Pakistan destination for defense articles.', 'Hold - requires enhanced due diligence', 2),
('Denied Party Screening', 'Falcon Trading DMCC', true, 88.0, 'Falcon Trading DMCC', 'Denied Persons List', 'critical', 'Direct match to denied party. Entity has been denied export privileges for transshipment of controlled technology.', 'Block - denied party match', 1),
('Country Risk Assessment', 'Cuba Telecom Ministry', true, 99.0, 'Cuba Sanctions Program', 'OFAC Country Programs', 'critical', 'Cuba is comprehensively sanctioned under CACR. Encrypted communications equipment is controlled and no license exceptions are available.', 'Block - Cuba comprehensive sanctions', 2),
('Entity Screening', 'Turkish Aerospace Industries', false, 5.0, NULL, NULL, 'low', 'No matches. Turkish Aerospace is a NATO-country defense contractor with existing FMS relationships.', 'Clear - NATO ally expedited processing', 1),
('End-Use Screening', 'Pakistan Armored Vehicle', true, 72.0, 'Nuclear/Missile Concern', 'BIS Red Flags', 'high', 'Pakistan is a country of nuclear proliferation concern. Unknown end-user for defense articles raises significant red flags.', 'Hold - mandatory end-use check required', 2),
('Transaction Screening', 'Singapore Navigation Units', false, 0, NULL, NULL, 'low', 'Transaction appears legitimate. ST Aerospace is verified civil aviation end-user. Singapore is STA-eligible destination.', 'Clear - STA authorization applies', 1),
('Entity Screening', 'Wagner Group Front Co.', true, 85.0, 'Wagner Group', 'SDN List (OFAC)', 'critical', 'Possible front company for sanctioned Wagner Group. Name similarity and Russia nexus warrant blocking.', 'Block - probable sanctioned entity front', 2);

-- Seed Audit Logs (15+ items)
INSERT INTO audit_logs (action, entity_type, entity_id, user_id, details) VALUES
('LOGIN', 'user', 1, 1, 'Admin user logged in successfully'),
('SCREEN_ENTITY', 'sanctioned_entity', 1, 2, 'Screened Rostec Corporation - MATCH FOUND on SDN List'),
('APPROVE_TRANSACTION', 'transaction', 1, 1, 'Approved TXN-2024-001 - BAE Systems radar components'),
('DENY_TRANSACTION', 'transaction', 6, 1, 'Denied TXN-2024-006 - Russia sanctions violation'),
('CREATE_LICENSE', 'export_license', 1, 2, 'Created license LIC-2024-0001 for Lockheed Martin'),
('SCREEN_ENTITY', 'sanctioned_entity', 2, 2, 'Screened Huawei Technologies - MATCH FOUND on Entity List'),
('UPDATE_ENTITY', 'sanctioned_entity', 12, 1, 'Updated Wagner Group risk score to 98'),
('DENY_TRANSACTION', 'transaction', 7, 2, 'Denied TXN-2024-007 - Huawei Entity List match'),
('REVIEW_DOCUMENT', 'compliance_document', 3, 3, 'Reviewed Congressional Notification for SAMI deal'),
('SCREEN_ENTITY', 'denied_party', 11, 2, 'Screened Falcon Trading - MATCH FOUND on Denied Persons List'),
('CREATE_TRANSACTION', 'transaction', 16, 2, 'Created TXN-2024-016 - NVIDIA AI accelerators to Alibaba'),
('FLAG_TRANSACTION', 'transaction', 13, 2, 'Flagged TXN-2024-013 - Red flags identified in Pakistan deal'),
('DENY_TRANSACTION', 'transaction', 9, 1, 'Denied TXN-2024-009 - Iran comprehensive sanctions'),
('LOGIN', 'user', 2, 2, 'Analyst user logged in successfully'),
('EXPORT_REPORT', 'compliance_document', 16, 1, 'Generated annual ICP review report'),
('UPDATE_COUNTRY', 'restricted_country', 1, 1, 'Updated Russia restrictions to Full Embargo');
