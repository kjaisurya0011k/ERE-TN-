-- V7: New Providers — Colleges, NGOs, Corporates, Welfare Boards
-- 60+ new provider records across all categories

-- ═══════════════════════════════════════════════════════════════════════════════
-- A. NEW COLLEGE / UNIVERSITY PROVIDERS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO providers (id, name, type, description, mission, who_they_support, state, location,
  provider_category, official_website, official_website_url, scholarship_page_url, admission_page_url,
  verification_status, last_verified_date) VALUES

('prov-ksr-edu','K.S. Rangasamy College of Technology (KSR)','COLLEGE_UNIVERSITY',
  'KSR Educational Institutions, Tiruchengode — offers merit scholarships worth ₹3.20 crore including engineering cut-off based 100% fee waivers.',
  'Accessible quality technical education for meritorious and deserving students.',
  'Engineering UG students based on merit, cut-off, and aptitude test performance.',
  'Tamil Nadu','Tiruchengode, Namakkal District','COLLEGE',
  'https://www.ksrce.ac.in','https://www.ksrce.ac.in','https://www.ksrce.ac.in/scholarship.php','https://www.ksrce.ac.in/admission.php',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-sns-eng','SNS College of Engineering','COLLEGE_UNIVERSITY',
  'SNS College of Engineering, Coimbatore — publishes 100% full scholarship and tuition scholarship categories based on +2 cut-off ≥175.',
  'Enabling academically strong students to access quality engineering education regardless of financial background.',
  'Engineering UG students with +2 cut-off ≥175; deserving students via SNS SAT.',
  'Tamil Nadu','Coimbatore','COLLEGE',
  'https://www.snsce.ac.in','https://www.snsce.ac.in','https://www.snsce.ac.in/scholarship','https://www.snsce.ac.in/admission',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-vsb-eng','VSB College of Engineering Technical Campus','COLLEGE_UNIVERSITY',
  'VSB Engineering, Coimbatore — published cut-off based scholarships: 190+ → 100% tuition + 50% hostel; 185–189.75 → 100% tuition; 180–184.75 → 50% tuition.',
  'Merit-based fee support for students entering engineering programmes.',
  'Engineering UG students with TN 12th cut-off ≥180.',
  'Tamil Nadu','Coimbatore','COLLEGE',
  'https://www.vsb.edu.in','https://www.vsb.edu.in',NULL,'https://www.vsb.edu.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-kathir-eng','Kathir College of Engineering','COLLEGE_UNIVERSITY',
  'Kathir College, Coimbatore — scholarship policy: cut-off ≥190 → 100% tuition; ≥180 → 50%; ≥170 → ₹10,000 waiver.',
  'Merit-based tuition fee support for engineering students.',
  'UG Engineering students with TN 12th engineering cut-off ≥170.',
  'Tamil Nadu','Coimbatore','COLLEGE',
  'https://www.kathir.ac.in','https://www.kathir.ac.in',NULL,'https://www.kathir.ac.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-care-eng','CARE College of Engineering','COLLEGE_UNIVERSITY',
  'CARE College of Engineering, Trichy — merit scholarship: 190+ → 100% tuition; 180–189 → 75%; 170–179 → 50%.',
  'Supporting meritorious engineering students through tuition fee waivers.',
  'UG Engineering students with TN 12th cut-off ≥170.',
  'Tamil Nadu','Tiruchirappalli','COLLEGE',
  'https://www.care.edu.in','https://www.care.edu.in',NULL,'https://www.care.edu.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-cms-eng','CMS College of Engineering','COLLEGE_UNIVERSITY',
  'CMS College, Namakkal — merit scholarship: cut-off 175+ → 100% tuition; 171–175 → 75%; 166–170 → 50%; 160–165 → 25%. Sports: up to 100% (national level).',
  'Academic and sports merit scholarships for engineering students.',
  'UG Engineering students with cut-off ≥160 and sports achievers.',
  'Tamil Nadu','Namakkal','COLLEGE',
  'https://www.cmsce.edu.in','https://www.cmsce.edu.in',NULL,'https://www.cmsce.edu.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-saveetha-eng','Saveetha Engineering College (SIMATS)','COLLEGE_UNIVERSITY',
  'Saveetha/SIMATS, Chennai — published 2026 slabs: 90–100% → 100% tuition waiver; 80–89.9% → 75%; 70–79.9% → 50%; 60–69.9% → 25%.',
  'Enabling academically strong students to join engineering programmes at reduced cost.',
  'UG Engineering students with 12th marks ≥60%.',
  'Tamil Nadu','Chennai','COLLEGE',
  'https://saveetha.ac.in','https://saveetha.ac.in','https://saveetha.ac.in/scholarship','https://saveetha.ac.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-vit-chennai','VIT Chennai','COLLEGE_UNIVERSITY',
  'VIT Chennai — 100% tuition waiver for first three board/state/district toppers; 80% waiver for school toppers with above 90% in Class 12.',
  'Rewarding academic excellence with substantial tuition support.',
  'Board toppers and high-performing Class 12 students.',
  'Tamil Nadu','Chennai','COLLEGE',
  'https://chennai.vit.ac.in','https://chennai.vit.ac.in','https://chennai.vit.ac.in/scholarship','https://chennai.vit.ac.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-srmist','SRM Institute of Science and Technology','COLLEGE_UNIVERSITY',
  'SRMIST — entrance-score based scholarship: 98+ → 100% tuition; 94–97 → 50%. Additional programme-specific slabs also available.',
  'Rewarding performance in SRM entrance examination with tuition waivers.',
  'Students admitted through SRMJEEE with high scores.',
  'Tamil Nadu','Chennai / Kattankulathur','COLLEGE',
  'https://www.srmist.edu.in','https://www.srmist.edu.in','https://www.srmist.edu.in/scholarship','https://www.srmist.edu.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-jkkn-eng','JKKN College of Engineering and Technology','COLLEGE_UNIVERSITY',
  'JKKN Trust Merit Scholarship: ₹5,000 to 100% tuition fee waiver based on academic merit for Government and Management Quota students.',
  'Merit and community-based scholarship support for engineering students.',
  'UG Engineering students (Government and Management Quota).',
  'Tamil Nadu','Namakkal','COLLEGE',
  'https://www.jkkn.ac.in','https://www.jkkn.ac.in','https://www.jkkn.ac.in/scholarship','https://www.jkkn.ac.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-sona-tech','Sona College of Technology','COLLEGE_UNIVERSITY',
  'Sona Trust institutional merit scholarship for UG students. Verify current 2026-27 slab directly.',
  'Merit-based educational support under the Sona Trust.',
  'UG students admitted to Sona College of Technology.',
  'Tamil Nadu','Salem','COLLEGE',
  'https://www.sonatech.ac.in','https://www.sonatech.ac.in',NULL,'https://www.sonatech.ac.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-kongu-eng','Kongu Engineering College','COLLEGE_UNIVERSITY',
  'Kongu Vellalar Institute of Technology Trust institutional scholarships — merit and special categories. Verify current cycle.',
  'Supporting students through institutional scholarship mechanisms.',
  'UG students at Kongu Engineering College.',
  'Tamil Nadu','Erode','COLLEGE',
  'https://www.kongu.ac.in','https://www.kongu.ac.in',NULL,'https://www.kongu.ac.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-psg-tech','PSG College of Technology','COLLEGE_UNIVERSITY',
  'PSG institutions provide merit, need-based and institutional financial assistance for UG/PG students through multiple charitable/alumni foundations.',
  'Wide network of scholarship and financial assistance programmes.',
  'UG and PG students at PSG College of Technology.',
  'Tamil Nadu','Coimbatore','COLLEGE',
  'https://www.psgtech.edu','https://www.psgtech.edu',NULL,'https://www.psgtech.edu/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-cit-cbe','Coimbatore Institute of Technology','COLLEGE_UNIVERSITY',
  'CIT publishes multiple charity/alumni trust scholarships including CIT Endowment Fund, 1991/1986-89/2000 Batch Alumni Trusts, Siragugal Trust 2017, and BC/MBC/SC/ST government schemes.',
  'Multi-source scholarship ecosystem covering merit, community and alumni-funded support.',
  'UG/PG students at CIT with various eligibility criteria.',
  'Tamil Nadu','Coimbatore','COLLEGE',
  'https://www.cit.edu.in','https://www.cit.edu.in','https://www.cit.edu.in/scholarships','https://www.cit.edu.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-kumaraguru','Kumaraguru College of Technology','COLLEGE_UNIVERSITY',
  'Kumaraguru College of Technology (KCT) — institutional scholarships and financial assistance schemes. Verify current cycle.',
  'Supporting engineering students through merit and need-based mechanisms.',
  'UG/PG students at KCT.',
  'Tamil Nadu','Coimbatore','COLLEGE',
  'https://www.kct.ac.in','https://www.kct.ac.in',NULL,'https://www.kct.ac.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-erode-sengunthar','Erode Sengunthar Engineering College','COLLEGE_UNIVERSITY',
  'Management provides merit and economically-backward scholarships and 100% tuition waiver for eligible employee wards.',
  'Merit and social-welfare scholarship support for engineering students.',
  'UG Engineering students; employee wards for 100% waiver.',
  'Tamil Nadu','Erode','COLLEGE',
  'https://www.esec.ac.in','https://www.esec.ac.in',NULL,'https://www.esec.ac.in/admissions',
  'VERIFY_CURRENT_CYCLE','2026-08-26');

-- ═══════════════════════════════════════════════════════════════════════════════
-- B. NGO / FOUNDATION PROVIDERS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO providers (id, name, type, description, mission, who_they_support, state, location,
  provider_category, official_website, official_website_url, scholarship_page_url,
  verification_status, last_verified_date) VALUES

('prov-anandham-foundation','Anandham Youth Foundation','NGO',
  'Selects academically strong students from poor economic backgrounds including orphaned and single-parent students, and provides 100% scholarship to selected students.',
  'Complete educational support for the most financially vulnerable meritorious students.',
  'Economically disadvantaged students including orphans and single-parent children with strong academics.',
  'Tamil Nadu','Tamil Nadu','NGO',
  'https://anandhamfoundation.org','https://anandhamfoundation.org',NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-neela-siragugal','Neela Siragugal Foundation','NGO',
  'Neela Siragugal provides the Siragugal Scholarship aimed at first-generation college students, alongside mentoring and educational support programmes.',
  'Supporting first-generation graduates through scholarships and mentoring.',
  'First-generation college students across Tamil Nadu.',
  'Tamil Nadu','Tamil Nadu','NGO',
  'https://neelasiragugal.org','https://neelasiragugal.org',NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-agni-siragugal','Agni Siragugal Foundation','NGO',
  'Educational assistance foundation supporting students requiring educational support. Current 2026-27 application cycle details require direct official verification.',
  'Educational support for students in need.',
  'Students requiring educational assistance in Tamil Nadu.',
  'Tamil Nadu','Tamil Nadu','NGO',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-goldheart','Goldheart Foundation','NGO',
  'Educational foundation supporting disadvantaged students. Current programme details require verification via the TN-NGO network.',
  'Educational support for disadvantaged students.',
  'Educationally disadvantaged students.',
  'Tamil Nadu','Tamil Nadu','NGO',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-seeeds','SEEEDS Foundation','NGO',
  'NGO providing education assistance to students in Tamil Nadu. Verify current scholarship cycle through TN-NGO educational scholarship network.',
  'Education assistance for students in need.',
  'Students requiring educational support.',
  'Tamil Nadu','Tamil Nadu','NGO',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-chief-maker','Chief Maker Foundation','NGO',
  'Education and social foundation supporting students. Verify current scholarship cycle.',
  'Student support through educational interventions.',
  'Students requiring educational support.',
  'Tamil Nadu','Tamil Nadu','NGO',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-sarojini-damodaran','Sarojini Damodaran Foundation (Vidyadhan)','FOUNDATION',
  'Vidyadhan higher-education scholarship pathway for Tamil Nadu students. Current 2026 programme confirmed for Tamil Nadu.',
  'Enabling meritorious low-income students to pursue higher education through continuation scholarships.',
  'Meritorious students from low-income families in Tamil Nadu entering higher education.',
  'Tamil Nadu','Chennai','TRUST',
  'https://www.vidyadhan.org','https://www.vidyadhan.org','https://www.vidyadhan.org/apply',
  'ACTIVE','2026-08-26'),

('prov-sathya-unar','Sathya Unar Charitable Trust','CHARITABLE_TRUST',
  'Provides scholarships to students facing financial obstacles to pursuing higher education.',
  'Removing financial barriers to higher education.',
  'Students from Tamil Nadu facing financial difficulties in accessing higher education.',
  'Tamil Nadu','Tamil Nadu','TRUST',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-right-choice','Right Choice Educational & Charitable Trust','CHARITABLE_TRUST',
  'Nagapattinam-based trust supporting students across Tamil Nadu in Engineering, MBBS, Arts, Law, Fisheries and other higher education. Assistance provided free of charge.',
  'Free educational and financial support for students across all professional disciplines.',
  'Students across Tamil Nadu in Engineering, MBBS, Arts, Law, Fisheries and other higher education.',
  'Tamil Nadu','Nagapattinam','TRUST',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-gaurav-foundation','Gaurav Foundation','CHARITABLE_TRUST',
  'Public charitable trust/NGO that provides scholarships to academically successful students wishing to continue higher studies.',
  'Scholarship support for academic achievers seeking to continue higher education.',
  'Academically successful students seeking higher education.',
  'Tamil Nadu','Tamil Nadu','TRUST',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26');

-- ═══════════════════════════════════════════════════════════════════════════════
-- C. CORPORATE / CSR PROVIDERS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO providers (id, name, type, description, mission, who_they_support, state,
  provider_category, official_website, official_website_url, scholarship_page_url,
  verification_status, last_verified_date) VALUES

('prov-dr-reddys','Dr. Reddy''s Foundation','FOUNDATION',
  'Dr. Reddy''s Foundation Sashakt Scholarship for undergraduate students.',
  'Empowering deserving students through scholarships.',
  'Undergraduate students meeting income and merit criteria.',
  'All India','CORPORATE',
  'https://www.drreddysfoundation.org','https://www.drreddysfoundation.org','https://www.b4s.in/drreddy/SAS3',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-tata-capital','Tata Capital','PRIVATE_ORGANIZATION',
  'Tata Capital Pankh Scholarship for undergraduate students from economically weaker sections.',
  'Supporting education for economically weaker students.',
  'UG students from low-income families.',
  'All India','CORPORATE',
  'https://tatacapital.com','https://tatacapital.com','https://www.b4s.in/tata/PANKH6',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-idfc-bank','IDFC FIRST Bank','PRIVATE_ORGANIZATION',
  'IDFC FIRST Bank Engineering Scholarship — up to ₹1 lakh/year for four years for eligible engineering students.',
  'Enabling engineering students from weaker economic backgrounds to complete their degree.',
  '1st year engineering students with family-income and merit criteria.',
  'All India','CORPORATE',
  'https://www.idfcfirstbank.com','https://www.idfcfirstbank.com','https://www.b4s.in/idfc/ENG',
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-tvs-cheema','TVS Cheema','INDUSTRY_ORGANIZATION',
  'TVS Cheema Financial Assistance for Diploma students covering academic-related expenses including tuition/hostel/mess/transport for eligible diploma students in Tamil Nadu/Karnataka.',
  'Supporting diploma students with comprehensive financial assistance.',
  'Eligible diploma students in Tamil Nadu and Karnataka.',
  'Tamil Nadu','CORPORATE',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-sumangala-steel','Sumangala Steel','INDUSTRY_ORGANIZATION',
  'Sumangala Steel Scholarship covering Diploma/B.E. students with Tamil Nadu/Puducherry domicile and 10th/12th qualification conditions.',
  'Supporting technical education students through CSR scholarship.',
  'Diploma and B.E. students with TN/Puducherry domicile.',
  'Tamil Nadu','CORPORATE',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-swami-dayanand','Swami Dayanand Education Foundation','FOUNDATION',
  'Private merit/need-based educational scholarship provider.',
  'Supporting deserving students through merit and need-based scholarships.',
  'Students with academic merit and financial need.',
  'All India','TRUST',
  NULL,NULL,NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26');

-- ═══════════════════════════════════════════════════════════════════════════════
-- D. TAMIL NADU WELFARE BOARD PROVIDERS (18 boards)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO providers (id, name, type, description, who_they_support, state, location,
  provider_category, official_website, official_website_url,
  verification_status, last_verified_date) VALUES

('prov-tn-construction-board','TN Construction Workers Welfare Board','STATE_GOVERNMENT',
  'Tamil Nadu Construction Workers Welfare Board (Kattumana Attai) provides educational assistance to children of registered construction workers.',
  'Sons and daughters of registered TN construction workers.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-manual-workers','TN Manual Workers Social Security & Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered manual workers under the TN social security welfare scheme.',
  'Sons and daughters of registered manual workers in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-washermen','TN Washermen Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered washermen/laundry workers in Tamil Nadu.',
  'Sons and daughters of registered washermen in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-hairdressers','TN Hair Dressers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered hairdressers/beauty-parlour workers in Tamil Nadu.',
  'Sons and daughters of registered hairdressers in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-tailors','TN Tailoring Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered tailoring workers in Tamil Nadu.',
  'Sons and daughters of registered tailors in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-handicraft','TN Handicraft Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered handicraft workers in Tamil Nadu.',
  'Sons and daughters of registered handicraft workers in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-palmtree','TN Palm Tree Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered palm-tree/neera workers in Tamil Nadu.',
  'Sons and daughters of registered palm-tree workers in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-handloom','TN Handloom & Silk Weaving Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered handloom and silk weaving workers in Tamil Nadu.',
  'Sons and daughters of registered handloom/silk weavers in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-leather','TN Footwear & Leather/Tannery Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered leather, footwear and tannery workers in Tamil Nadu.',
  'Sons and daughters of registered leather/footwear/tannery workers.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-artists','TN Artists Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered artists in Tamil Nadu.',
  'Sons and daughters of registered artists in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-goldsmiths','TN Goldsmiths Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered goldsmiths and silver-manufacturing workers in Tamil Nadu.',
  'Sons and daughters of registered goldsmiths in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-pottery','TN Pottery Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered pottery workers in Tamil Nadu.',
  'Sons and daughters of registered pottery workers in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-domestic','TN Domestic Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered domestic workers in Tamil Nadu.',
  'Sons and daughters of registered domestic workers in Tamil Nadu.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-powerloom','TN Powerloom Weaving Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered powerloom workers in Tamil Nadu.',
  'Sons and daughters of registered powerloom workers.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-streetvendor','TN Street Vendors & Shops Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered street vendors and eligible shop/establishment employees in Tamil Nadu.',
  'Sons and daughters of registered street vendors and shop workers.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-catering','TN Cooking & Catering Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered cooking and catering workers in Tamil Nadu.',
  'Sons and daughters of registered cooking/catering workers.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-drivers','TN Unorganised Drivers & Automobile Workshop Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered auto/taxi drivers and automobile workshop workers in Tamil Nadu.',
  'Sons and daughters of registered drivers and auto-workshop workers.',
  'Tamil Nadu','Chennai','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26'),

('prov-tn-firematch','TN Fire & Match Workers Welfare Board','STATE_GOVERNMENT',
  'Educational assistance for children of registered fireworks and match industry workers in Tamil Nadu.',
  'Sons and daughters of registered fire/match industry workers.',
  'Tamil Nadu','Sivakasi / Tamil Nadu','WELFARE_BOARD',
  'https://tnlabour.in','https://tnlabour.in',
  'ACTIVE','2026-08-26');

-- ═══════════════════════════════════════════════════════════════════════════════
-- E. GOVERNMENT / SPECIAL PROVIDERS (additions)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO providers (id, name, type, description, who_they_support, state, location,
  provider_category, official_website, official_website_url, scholarship_page_url,
  verification_status, last_verified_date) VALUES

('prov-tn-minority-welfare','TN Minority Welfare Department','STATE_GOVERNMENT',
  'Tamil Nadu Minority Welfare Department administers post-matric and merit-cum-means scholarships for eligible minority students.',
  'Minority students (Muslim, Christian, Sikh, Buddhist, Parsi, Jain) in Tamil Nadu.',
  'Tamil Nadu','Chennai','GOVT',
  'https://www.minoritywelfare.tn.gov.in','https://www.minoritywelfare.tn.gov.in',NULL,
  'ACTIVE','2026-08-26'),

('prov-tn-socialwelfare-pwd','TN Social Welfare & Women Empowerment Department (Differently-Abled)','STATE_GOVERNMENT',
  'Provides scholarships to differently-abled students and sons/daughters of differently-abled persons in Tamil Nadu.',
  'Differently-abled students and children of differently-abled persons across Tamil Nadu.',
  'Tamil Nadu','Chennai','GOVT',
  'https://www.tnlabour.in','https://www.tnlabour.in',NULL,
  'ACTIVE','2026-08-26'),

('prov-sdat','Sports Development Authority of Tamil Nadu (SDAT)','STATE_GOVERNMENT',
  'SDAT provides scholarships and support to students with recognised sports achievements pursuing higher education.',
  'Students with state/national/international sports achievements.',
  'Tamil Nadu','Chennai','GOVT',
  'https://www.sdat.tn.gov.in','https://www.sdat.tn.gov.in',NULL,
  'VERIFY_CURRENT_CYCLE','2026-08-26'),

('prov-ksb-central','Kendriya Sainik Board (KSB)','CENTRAL_GOVERNMENT',
  'Administers Prime Minister''s Scholarship Scheme (PMSS) for eligible wards/widows of Armed Forces and paramilitary personnel.',
  'Wards, widows and dependants of Armed Forces, Central Armed Police Forces, Railway Protection Force personnel.',
  'All India','New Delhi','GOVT',
  'https://ksb.gov.in','https://ksb.gov.in','https://ksb.gov.in/pmss.htm',
  'ACTIVE','2026-08-26'),

('prov-labour-welfare-org','Labour Welfare Organisation (Ministry of Labour, GoI)','CENTRAL_GOVERNMENT',
  'Provides educational assistance to children/wards of Beedi workers, Limestone & Dolomite Mine workers, and Cine workers.',
  'Children/wards of Beedi, Limestone/Dolomite Mine, and Cine workers.',
  'All India','New Delhi','GOVT',
  'https://labour.gov.in','https://labour.gov.in',NULL,
  'ACTIVE','2026-08-26');
