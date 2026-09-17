-- V8: New Opportunities — 65+ new scholarship/assistance records
-- All opportunities reference providers inserted in V7

-- ═══════════════════════════════════════════════════════════════════════════════
-- A. COLLEGE MERIT / CUT-OFF SCHOLARSHIPS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description, financial_amount,
  official_source_url, official_application_url, official_website_url, official_scholarship_url,
  scholarship_category, tuition_waiver_pct, hostel_waiver_pct, transport_waiver_pct,
  exam_fee_covered, full_course_or_first_year, full_fee_support, sports_eligible,
  tuition_fee_support, hostel_support, verification_status, last_verified_date, featured) VALUES

-- KSR Merit Scholarship & Aptitude Test (100% up to)
('opp-ksr-merit-sat','KSR Merit Scholarship & Aptitude Test — Up to 100% Tuition Fee Waiver',
  'KSR Educational Institutions, Tiruchengode — offers scholarships worth ₹3.20 crore. Based on engineering cut-off marks and performance in KSR Scholarship Aptitude Test (SAT). Additional sports scholarship routes available reaching 100% waiver at national level.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-ksr-edu',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off for cut-off route; or qualify KSR SAT exam. Sports achievers (district/state/national) also eligible.',
  'Up to 100% tuition fee waiver based on cut-off or aptitude test score. Total scholarship pool: ₹3.20 crore. Sports route: up to 100% for national-level achievers.',
  NULL,
  'https://www.ksrce.ac.in','https://www.ksrce.ac.in/admission.php',
  'https://www.ksrce.ac.in','https://www.ksrce.ac.in/scholarship.php',
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,TRUE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',TRUE),

-- SNS 100% Full Scholarship (cut-off ≥175)
('opp-sns-full-scholarship','SNS College of Engineering — 100% Full Scholarship (Cut-off ≥175)',
  'SNS College of Engineering, Coimbatore publishes a 100% full scholarship category for students with +2 engineering cut-off ≥175. This covers tuition and may include additional support. Also available via SNS SAT for deserving students and through parent-status provisions.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-sns-eng',
  'UNDERGRADUATE','Tamil Nadu',
  '+2 / 12th engineering cut-off ≥175 / 200. Also eligible: SNS SAT qualifiers and deserving students under parent-status provisions.',
  '100% full scholarship — tuition fee covered. Hostel/transport may apply separately depending on category. Verify exact fee components for current cycle.',
  NULL,
  'https://www.snsce.ac.in','https://www.snsce.ac.in/admission',
  'https://www.snsce.ac.in','https://www.snsce.ac.in/scholarship',
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',TRUE),

-- VSB Engineering 190+ (100% tuition + 50% hostel)
('opp-vsb-eng-190','VSB Engineering — Cut-off 190+ → 100% Tuition + 50% Hostel & Bus',
  'VSB College of Engineering Technical Campus, Coimbatore — published scholarship: engineering cut-off above 190 → 100% tuition fee waiver PLUS 50% hostel and bus fee support.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-vsb-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off above 190 / 200.',
  '100% tuition fee waiver + 50% hostel fee + 50% bus fee support.',
  NULL,
  'https://www.vsb.edu.in',NULL,
  'https://www.vsb.edu.in','https://www.vsb.edu.in/admissions',
  'TYPE3_COLLEGE_MERIT',100,50,50,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,TRUE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- VSB Engineering 185–189.75 (100% tuition)
('opp-vsb-eng-185','VSB Engineering — Cut-off 185–189.75 → 100% Tuition Fee Waiver',
  'VSB College of Engineering, Coimbatore — for students with engineering cut-off between 185 and 189.75: 100% tuition fee waiver.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-vsb-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off 185.00 to 189.75 / 200.',
  '100% tuition fee waiver for the course duration.',
  NULL,'https://www.vsb.edu.in',NULL,
  'https://www.vsb.edu.in',NULL,
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- VSB Engineering 180–184.75 (50% tuition)
('opp-vsb-eng-180','VSB Engineering — Cut-off 180–184.75 → 50% Tuition Fee Waiver',
  'VSB College of Engineering, Coimbatore — for students with engineering cut-off between 180 and 184.75: 50% tuition fee waiver.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-vsb-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off 180.00 to 184.75 / 200.',
  '50% tuition fee waiver for the course duration.',
  NULL,'https://www.vsb.edu.in',NULL,
  'https://www.vsb.edu.in',NULL,
  'TYPE3_COLLEGE_MERIT',50,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- Kathir College 190+ (100%)
('opp-kathir-190','Kathir College of Engineering — Cut-off ≥190 → 100% Tuition Fee Waiver',
  'Kathir College, Coimbatore — scholarship policy: engineering cut-off ≥190 → 100% full tuition fee waiver for the course period. Also: ≥180 → 50%; ≥170 → ₹10,000 waiver.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-kathir-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off ≥190 / 200 for 100% waiver.',
  '100% tuition fee waiver for all 4 years of the UG programme.',
  NULL,'https://www.kathir.ac.in',NULL,
  'https://www.kathir.ac.in',NULL,
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- Kathir College 180+ (50%)
('opp-kathir-180','Kathir College of Engineering — Cut-off ≥180 → 50% Tuition Fee Waiver',
  'Kathir College, Coimbatore — cut-off ≥180 → 50% tuition fee waiver for the course period.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-kathir-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off 180.00 to 189.75 / 200.',
  '50% tuition fee waiver.',
  NULL,'https://www.kathir.ac.in',NULL,
  'https://www.kathir.ac.in',NULL,
  'TYPE3_COLLEGE_MERIT',50,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- CARE College 190+ (100%)
('opp-care-190','CARE College of Engineering — Cut-off 190+ → 100% Tuition Fee Waiver',
  'CARE College of Engineering, Trichy — merit scholarship: 190+ → 100% tuition fee waiver; 180–189 → 75%; 170–179 → 50%.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-care-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off ≥190 / 200.',
  '100% tuition fee waiver. (Also 75% for 180–189, 50% for 170–179).',
  NULL,'https://www.care.edu.in',NULL,
  'https://www.care.edu.in',NULL,
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- CARE College 180–189 (75%)
('opp-care-180','CARE College of Engineering — Cut-off 180–189 → 75% Tuition Fee Waiver',
  'CARE College of Engineering, Trichy — cut-off 180–189: 75% tuition fee waiver.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-care-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off 180.00 to 189.75 / 200.',
  '75% tuition fee waiver.',
  NULL,'https://www.care.edu.in',NULL,
  'https://www.care.edu.in',NULL,
  'TYPE3_COLLEGE_MERIT',75,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- CMS College 175+ (100%)
('opp-cms-175','CMS College of Engineering — Cut-off 175+ → 100% Tuition Fee Waiver',
  'CMS College of Engineering, Namakkal — merit scholarship: cut-off 175+ → 100%; 171–175 → 75%; 166–170 → 50%; 160–165 → 25%. Sports scholarship also reaches 100% for national-level achievers. Note: "175" refers to the engineering cut-off scale, not percentage.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-cms-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'TN 12th engineering cut-off ≥175 / 200 for 100% waiver. Sports (national level) also eligible for 100%.',
  '100% tuition fee waiver for eligible students. Sports route available.',
  NULL,'https://www.cmsce.edu.in',NULL,
  'https://www.cmsce.edu.in',NULL,
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,TRUE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- Saveetha 90-100% marks (100% tuition)
('opp-saveetha-90-100','Saveetha Engineering College — 90–100% in 12th → 100% Tuition Fee Waiver',
  'Saveetha/SIMATS, Chennai — published 2026 merit scholarship: students scoring 90–100% in 12th receive 100% tuition fee waiver. Additional slabs: 80–89.9% → 75%; 70–79.9% → 50%; 60–69.9% → 25%. Verify applicable programme and fee components in the institution''s current admission document.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-saveetha-eng',
  'UNDERGRADUATE','Tamil Nadu',
  '12th board marks 90–100% (for 100% waiver). Also 80–89.9% → 75%, 70–79.9% → 50%, 60–69.9% → 25%.',
  '100% tuition fee waiver for 4-year UG programme (for ≥90%). Verify exact fee components and current year slab.',
  NULL,'https://saveetha.ac.in','https://saveetha.ac.in/admissions',
  'https://saveetha.ac.in','https://saveetha.ac.in/scholarship',
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- VIT Chennai Board Topper (100%)
('opp-vit-chennai-topper','VIT Chennai — Board/State/District Topper → 100% Tuition Fee Waiver',
  'VIT Chennai — 100% tuition fee waiver for the first three board/state/district toppers. 80% tuition fee waiver for the first two school toppers with above 90% aggregate in Class 12.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-vit-chennai',
  'UNDERGRADUATE','Tamil Nadu',
  'State Board / District / School topper in Class 12. 100% waiver: first 3 board/state/district toppers. 80% waiver: first 2 school toppers with 90%+ aggregate.',
  '100% tuition fee waiver for board/state/district toppers. 80% tuition waiver for qualifying school toppers.',
  NULL,
  'https://chennai.vit.ac.in','https://chennai.vit.ac.in/admissions',
  'https://chennai.vit.ac.in','https://chennai.vit.ac.in/scholarship',
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- SRM 98+ entrance (100%)
('opp-srm-entrance-98','SRM Institute — Entrance Score 98+ → 100% Tuition Fee Waiver',
  'SRMIST — entrance-performance scholarship: SRMJEEE score 98+ → 100% tuition waiver; 94–97 → 50% waiver. Separate slabs exist for different SRMIST programmes. Important: criterion is entrance score, NOT 12th marks.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-srmist',
  'UNDERGRADUATE','Tamil Nadu',
  'SRMJEEE score ≥98 for 100% tuition waiver. Score 94–97 for 50% waiver. Applicable to specified UG programmes — verify per programme.',
  '100% tuition fee waiver for SRMJEEE score ≥98. 50% for 94–97.',
  NULL,
  'https://www.srmist.edu.in','https://www.srmist.edu.in/admissions',
  'https://www.srmist.edu.in','https://www.srmist.edu.in/scholarship',
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

-- JKKN Trust Merit (up to 100%)
('opp-jkkn-merit','JKKN Trust Merit Scholarship — ₹5,000 to 100% Tuition Fee Waiver',
  'JKKN College of Engineering and Technology, Namakkal — Trust Merit Scholarship based on academic performance for both Government Quota and Management Quota students. Award ranges from ₹5,000 to 100% tuition fee waiver.',
  'COLLEGE_SCHOLARSHIP',NULL,'prov-jkkn-eng',
  'UNDERGRADUATE','Tamil Nadu',
  'Academic merit at Class 12 / admission marks. Open to Government and Management Quota students.',
  '₹5,000 to 100% tuition fee waiver depending on merit rank.',
  NULL,
  'https://www.jkkn.ac.in','https://www.jkkn.ac.in/admissions',
  'https://www.jkkn.ac.in','https://www.jkkn.ac.in/scholarship',
  'TYPE3_COLLEGE_MERIT',100,0,0,FALSE,'FULL_COURSE',FALSE,FALSE,
  TRUE,FALSE,'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- B. NGO / FOUNDATION SCHOLARSHIPS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, provider_id,
  education_level, state, eligibility_summary, benefits_description, financial_amount,
  official_source_url, official_website_url, official_scholarship_url,
  scholarship_category, tuition_waiver_pct, full_fee_support,
  tuition_fee_support, hostel_support, full_course_or_first_year,
  verification_status, last_verified_date, featured) VALUES

('opp-anandham-100pct','Anandham Youth Foundation — 100% Scholarship for Selected Students',
  'Anandham Youth Foundation selects academically strong students from poor economic backgrounds, including orphaned and single-parent students, and provides 100% scholarship to its selected students.',
  'FOUNDATION_SCHOLARSHIP','prov-anandham-foundation',
  'UNDERGRADUATE','Tamil Nadu',
  'Academically strong students from poor economic backgrounds, including orphaned and single-parent students. Selection process by foundation.',
  '100% scholarship for selected students — tuition fee, hostel and related expenses covered. Selection is competitive.',
  NULL,
  'https://anandhamfoundation.org','https://anandhamfoundation.org',NULL,
  'TYPE4_FOUNDATION_NGO',100,TRUE,
  TRUE,TRUE,'FULL_COURSE','VERIFY_CURRENT_CYCLE','2026-08-26',TRUE),

('opp-neela-siragugal','Neela Siragugal — First Graduate Scholarship & Mentoring',
  'Neela Siragugal Foundation''s Siragugal Scholarship targets first-generation college students alongside mentoring and educational support programmes.',
  'FOUNDATION_SCHOLARSHIP','prov-neela-siragugal',
  'UNDERGRADUATE','Tamil Nadu',
  'First-generation college students from Tamil Nadu. Academic merit and financial need considered.',
  'Scholarship support plus mentoring programme. Exact amount — verify current cycle with foundation.',
  NULL,
  'https://neelasiragugal.org','https://neelasiragugal.org',NULL,
  'TYPE4_FOUNDATION_NGO',0,FALSE,
  FALSE,FALSE,'FULL_COURSE','VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

('opp-agni-siragugal','Agni Siragugal Foundation — Educational Assistance',
  'Agni Siragugal Foundation provides educational assistance to students requiring support. Current 2026-27 scholarship amount, cut-off and application URL require direct official verification.',
  'FOUNDATION_SCHOLARSHIP','prov-agni-siragugal',
  'UNDERGRADUATE','Tamil Nadu',
  'Students requiring educational assistance. Contact foundation directly for current eligibility criteria.',
  'Educational assistance — exact amount and coverage require current official verification.',
  NULL,
  NULL,NULL,NULL,
  'TYPE4_FOUNDATION_NGO',0,FALSE,
  FALSE,FALSE,'FULL_COURSE','VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

('opp-vidyadhan-tn','Vidyadhan Scholarship — Tamil Nadu (Sarojini Damodaran Foundation)',
  'Vidyadhan is a higher-education continuation scholarship by the Sarojini Damodaran Foundation. Tamil Nadu students can enter the Vidyadhan pathway. Current 2026 programme confirmed for Tamil Nadu. Tags: MERIT, LOW INCOME, HIGHER EDUCATION, CONTINUATION.',
  'FOUNDATION_SCHOLARSHIP','prov-sarojini-damodaran',
  'UNDERGRADUATE','Tamil Nadu',
  'Meritorious students from low-income families in Tamil Nadu entering higher education. Academic merit and family-income criteria apply.',
  'Continuation scholarship across the higher education programme. Amount depends on course and year — verify on Vidyadhan portal.',
  NULL,
  'https://www.vidyadhan.org','https://www.vidyadhan.org','https://www.vidyadhan.org/apply',
  'TYPE4_FOUNDATION_NGO',0,FALSE,
  FALSE,FALSE,'FULL_COURSE','ACTIVE','2026-08-26',TRUE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- C. CORPORATE CSR SCHOLARSHIPS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, provider_id,
  education_level, state, eligibility_summary, benefits_description, financial_amount,
  official_source_url, official_application_url, official_website_url,
  scholarship_category, tuition_fee_support, full_course_or_first_year,
  verification_status, last_verified_date, featured) VALUES

('opp-drreddys-sashakt','Dr. Reddy''s Foundation — Sashakt Scholarship',
  'Dr. Reddy''s Foundation Sashakt Scholarship supports undergraduate students. Verify current eligibility, income limit and application URL for 2026-27.',
  'CORPORATE_CSR','prov-dr-reddys',
  'UNDERGRADUATE','All India',
  'Undergraduate students — merit and income criteria apply. Verify current 2026-27 details on B4S portal.',
  'Financial support for higher education. Verify exact amount for current cycle.',
  NULL,
  'https://www.b4s.in/drreddy/SAS3','https://www.b4s.in/drreddy/SAS3',
  'https://www.drreddysfoundation.org',
  'TYPE4_FOUNDATION_NGO',FALSE,'FULL_COURSE',
  'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

('opp-tata-pankh','Tata Capital — Pankh Scholarship',
  'Tata Capital Pankh Scholarship for undergraduate students from economically weaker sections.',
  'CORPORATE_CSR','prov-tata-capital',
  'UNDERGRADUATE','All India',
  'UG students from low-income families. Academic merit + income criteria.',
  'Financial assistance for higher education. Verify current amount on B4S portal.',
  NULL,
  'https://www.b4s.in/tata/PANKH6','https://www.b4s.in/tata/PANKH6',
  'https://tatacapital.com',
  'TYPE4_FOUNDATION_NGO',FALSE,'FULL_COURSE',
  'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

('opp-idfc-engineering','IDFC FIRST Bank — Engineering Scholarship (Up to ₹1L/Year × 4 Years)',
  'IDFC FIRST Bank Engineering Scholarship — up to ₹1,00,000/year for four years for eligible engineering students. Current 2026 information confirms this support with family-income and other eligibility requirements.',
  'CORPORATE_CSR','prov-idfc-bank',
  'UNDERGRADUATE','All India',
  '1st year B.E./B.Tech students. Family income and merit criteria apply — verify on B4S portal.',
  'Up to ₹1,00,000 per year for up to 4 years of the engineering programme.',
  400000,
  'https://www.b4s.in/idfc/ENG','https://www.b4s.in/idfc/ENG',
  'https://www.idfcfirstbank.com',
  'TYPE4_FOUNDATION_NGO',TRUE,'FULL_COURSE',
  'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

('opp-tvs-cheema-diploma','TVS Cheema — Financial Assistance for Diploma Students',
  'TVS Cheema provides financial support for eligible diploma students covering academic-related expenses including tuition, hostel, mess and transport subject to programme rules. Tamil Nadu / Karnataka eligible.',
  'CORPORATE_CSR','prov-tvs-cheema',
  'DIPLOMA','Tamil Nadu',
  'Diploma students in Tamil Nadu or Karnataka. Income and other criteria — verify directly with TVS Cheema.',
  'Academic-related expenses including tuition, hostel, mess and transport (subject to rules).',
  NULL,NULL,NULL,NULL,
  'TYPE4_FOUNDATION_NGO',TRUE,'FULL_COURSE',
  'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE),

('opp-sumangala-steel','Sumangala Steel Scholarship — Diploma / B.E. Students',
  'Sumangala Steel Scholarship covers Diploma and B.E. students with Tamil Nadu / Puducherry domicile and specified 10th/12th qualification conditions.',
  'CORPORATE_CSR','prov-sumangala-steel',
  'UNDERGRADUATE','Tamil Nadu',
  'Diploma / B.E. students with TN or Puducherry domicile. 10th/12th qualification conditions apply — verify application document.',
  'Scholarship covering educational expenses — amount/coverage per application document.',
  NULL,NULL,NULL,NULL,
  'TYPE4_FOUNDATION_NGO',TRUE,'FULL_COURSE',
  'VERIFY_CURRENT_CYCLE','2026-08-26',FALSE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- D. GOVERNMENT FEE CONCESSIONS (TN — separate from scholarships)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description,
  official_source_url, official_application_url, official_website_url,
  scholarship_category, tuition_waiver_pct, exam_fee_covered,
  tuition_fee_support, full_course_or_first_year,
  verification_status, last_verified_date, featured) VALUES

('opp-tn-bc-postmatric','TN BC Post-Matric Scholarship',
  'Tamil Nadu Backward Classes post-matric scholarship for eligible BC students pursuing higher education (degree, diploma, professional courses). Administered by the BC/MBC/DNC Welfare Department.',
  'GOVERNMENT_SCHOLARSHIP','STATE',
  (SELECT id FROM providers WHERE id='prov-tn-bcmbc-welfare' LIMIT 1),
  'UNDERGRADUATE','Tamil Nadu',
  'BC (Backward Class) students enrolled in post-matric / higher education. Income conditions per scheme rules. TN resident.',
  'Tuition fee reimbursement + maintenance allowance per scheme rules. Amount based on course type and year.',
  'https://www.tn.gov.in','https://www.tnscholarships.in',
  'https://www.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',100,FALSE,
  TRUE,'FULL_COURSE',
  'ACTIVE','2026-08-26',FALSE),

('opp-tn-mbc-postmatric','TN MBC Post-Matric Scholarship',
  'Tamil Nadu Most Backward Classes and Denotified Communities Welfare Department post-matric scholarship for eligible MBC students in higher education.',
  'GOVERNMENT_SCHOLARSHIP','STATE',
  (SELECT id FROM providers WHERE id='prov-tn-bcmbc-welfare' LIMIT 1),
  'UNDERGRADUATE','Tamil Nadu',
  'MBC (Most Backward Class) students enrolled in post-matric / higher education. Income conditions per scheme rules. TN resident.',
  'Tuition fee reimbursement + maintenance allowance per scheme rules.',
  'https://www.tn.gov.in','https://www.tnscholarships.in',
  'https://www.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',100,FALSE,
  TRUE,'FULL_COURSE',
  'ACTIVE','2026-08-26',FALSE),

('opp-tn-dnc-postmatric','TN DNC Post-Matric Scholarship',
  'Tamil Nadu Denotified Communities post-matric scholarship for eligible DNC students in higher education.',
  'GOVERNMENT_SCHOLARSHIP','STATE',
  (SELECT id FROM providers WHERE id='prov-tn-bcmbc-welfare' LIMIT 1),
  'UNDERGRADUATE','Tamil Nadu',
  'DNC (Denotified Community) students enrolled in post-matric higher education. TN resident.',
  'Tuition fee + maintenance allowance per scheme rules.',
  'https://www.tn.gov.in','https://www.tnscholarships.in',
  'https://www.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',100,FALSE,
  TRUE,'FULL_COURSE',
  'ACTIVE','2026-08-26',FALSE),

('opp-tn-scst-fee-reimbursement','TN SC/ST Self-Financing College Fee Reimbursement',
  'Tamil Nadu Government''s fee reimbursement scheme for eligible SC/ST students studying in self-financing colleges. Administered by the Adi Dravidar & Tribal Welfare Department. Covers tuition fee for students in government-aided and self-financing colleges.',
  'GOVERNMENT_FEE_CONCESSION','STATE',
  (SELECT id FROM providers WHERE id='prov-tn-adidr-welfare' LIMIT 1),
  'UNDERGRADUATE','Tamil Nadu',
  'SC / ST / SCA / SCC students in self-financing colleges in Tamil Nadu. Family income < ₹2,50,000/year. Enrolled in recognised degree/diploma/professional programmes.',
  '100% tuition fee reimbursement in self-financing colleges + maintenance allowance.',
  'https://www.tn.gov.in','https://www.tnscholarships.in',
  'https://www.tn.gov.in',
  'TYPE2_GOVERNMENT_FEE_CONCESSION',100,FALSE,
  TRUE,'FULL_COURSE',
  'ACTIVE','2026-08-26',FALSE),

('opp-tn-perarignar-anna','TN Perarignar Anna Memorial Award (BC/MBC/DNC)',
  'Tamil Nadu Directorate of Collegiate Education Perarignar Anna Memorial Award for high-performing BC/MBC/DNC students. Based on top marks at district level in Class 12 and pursuing professional higher education.',
  'GOVERNMENT_SCHOLARSHIP','STATE',
  (SELECT id FROM providers WHERE id='prov-tn-bcmbc-welfare' LIMIT 1),
  'UNDERGRADUATE','Tamil Nadu',
  'BC/MBC/DNC students who scored top marks at district level in Class 12 board examination and are pursuing a professional degree programme.',
  'Annual financial assistance for the normal course period per scheme rules.',
  'https://www.tn.gov.in',NULL,
  'https://www.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',0,FALSE,
  FALSE,'FULL_COURSE',
  'ACTIVE','2026-08-26',FALSE),

('opp-tn-cm-merit-scst','TN Chief Minister Merit Award (SC/ST)',
  'Tamil Nadu Chief Minister''s Merit Award for high-performing students from eligible SC/ST/Adi Dravidar categories continuing education after Class 12.',
  'GOVERNMENT_SCHOLARSHIP','STATE',
  (SELECT id FROM providers WHERE id='prov-tn-adidr-welfare' LIMIT 1),
  'UNDERGRADUATE','Tamil Nadu',
  'SC/ST/Adi Dravidar students who performed well in Class 12 board exams and have enrolled in higher education.',
  'Annual financial assistance per scheme rules for the course period.',
  'https://www.tn.gov.in',NULL,
  'https://www.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',0,FALSE,
  FALSE,'FULL_COURSE',
  'ACTIVE','2026-08-26',FALSE);

-- Fix broken provider FK references by using existing providers for BC/SCST schemes
UPDATE opportunities SET provider_id = (SELECT id FROM providers WHERE id = 'prov-tn-state-dept' LIMIT 1)
  WHERE id IN ('opp-tn-bc-postmatric','opp-tn-mbc-postmatric','opp-tn-dnc-postmatric',
               'opp-tn-scst-fee-reimbursement','opp-tn-perarignar-anna','opp-tn-cm-merit-scst')
    AND provider_id IS NULL;

-- Use existing TN government provider as fallback
UPDATE opportunities SET provider_id = (SELECT id FROM providers WHERE type = 'STATE_GOVERNMENT' LIMIT 1)
  WHERE id IN ('opp-tn-bc-postmatric','opp-tn-mbc-postmatric','opp-tn-dnc-postmatric',
               'opp-tn-scst-fee-reimbursement','opp-tn-perarignar-anna','opp-tn-cm-merit-scst')
    AND provider_id IS NULL;

-- ═══════════════════════════════════════════════════════════════════════════════
-- E. WELFARE BOARD ID-CARD SCHEMES (18 boards)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description,
  official_source_url, official_application_url, official_website_url,
  scholarship_category, id_card_type, tuition_fee_support,
  full_course_or_first_year, verification_status, last_verified_date, featured) VALUES

('opp-tn-washermen-edu','TN Washermen Welfare Board — Child Education Assistance',
  'Educational assistance for sons and daughters of registered washermen/laundry workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-washermen',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Washermen Welfare Board. Son/daughter pursuing higher education.',
  'Educational assistance — amount per board rules. Claim through the welfare board portal.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_WASHERMEN_WELFARE_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-hairdressers-edu','TN Hair Dressers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered hairdressers and beauty-parlour workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-hairdressers',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Hair Dressers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_HAIR_DRESSER_WELFARE_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-tailors-edu','TN Tailoring Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered tailoring workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-tailors',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Tailoring Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_TAILOR_WELFARE_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-handicraft-edu','TN Handicraft Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered handicraft workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-handicraft',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Handicraft Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_HANDICRAFT_WELFARE_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-palmtree-edu','TN Palm Tree Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered palm-tree / neera workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-palmtree',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Palm Tree Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_PALM_TREE_WORKER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-handloom-edu','TN Handloom & Silk Weaving Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered handloom and silk weaving workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-handloom',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Handloom & Silk Weaving Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_HANDLOOM_WORKER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-leather-edu','TN Footwear & Leather/Tannery Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered leather, footwear and tannery workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-leather',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Footwear & Leather/Tannery Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_LEATHER_WORKER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-artists-edu','TN Artists Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered artists in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-artists',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Artists Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_ARTIST_WELFARE_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-goldsmiths-edu','TN Goldsmiths Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered goldsmiths and silver-manufacturing workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-goldsmiths',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Goldsmiths Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_GOLDSMITH_WELFARE_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-pottery-edu','TN Pottery Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered pottery workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-pottery',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Pottery Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_POTTERY_WORKER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-domestic-edu','TN Domestic Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered domestic workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-domestic',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Domestic Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_DOMESTIC_WORKER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-powerloom-edu','TN Powerloom Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered powerloom workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-powerloom',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Powerloom Weaving Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_POWERLOOM_WORKER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-streetvendor-edu','TN Street Vendors & Shops Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered street vendors and eligible shop/establishment employees in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-streetvendor',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Street Vendors & Shops Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_STREET_VENDOR_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-catering-edu','TN Cooking & Catering Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered cooking and catering workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-catering',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Cooking & Catering Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_COOKING_CATERING_WORKER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-drivers-edu','TN Drivers & Automobile Workshop Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered auto/taxi drivers and automobile workshop workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-drivers',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Unorganised Drivers & Automobile Workshop Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_UNORGANISED_DRIVER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-firematch-edu','TN Fire & Match Workers Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered fireworks and match industry workers in Tamil Nadu.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-firematch',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Fire & Match Workers Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_FIRE_MATCH_WORKER_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-manual-workers-edu','TN Manual Workers Social Security & Welfare Board — Child Education Assistance',
  'Educational assistance for children of registered manual workers under the TN Manual Workers Social Security and Welfare Board scheme.',
  'WELFARE_ID_ASSISTANCE','STATE','prov-tn-manual-workers',
  'UNDERGRADUATE','Tamil Nadu',
  'Parent must be registered active member of TN Manual Workers Social Security & Welfare Board.',
  'Educational assistance per board rules.',
  'https://tnlabour.in',NULL,'https://tnlabour.in',
  'TYPE5_WELFARE_ID','TN_MANUAL_WORKER_WELFARE_ID',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- F. DISABILITY / SPECIAL CATEGORY SCHOLARSHIPS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description,
  official_source_url, official_website_url,
  scholarship_category, id_card_type, disability_eligible, tuition_fee_support,
  full_course_or_first_year, verification_status, last_verified_date, featured) VALUES

('opp-tn-pwd-student','TN Scholarship for Differently-Abled Students',
  'Tamil Nadu Government scholarship for differently-abled students at IX standard and above, including degree, PG, medical, engineering, vocational and professional courses.',
  'GOVERNMENT_SCHOLARSHIP','STATE','prov-tn-socialwelfare-pwd',
  'ALL','Tamil Nadu',
  'Differently-abled student with valid disability certificate. Applicable from IX standard through degree/PG/professional courses.',
  'Educational scholarship per scheme rules — amount varies by course level. Requires disability ID/certificate and institution document.',
  'https://www.tn.gov.in','https://www.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP','TN_DIFFERENTLY_ABLED_ID',TRUE,TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-pwd-parent','TN Scholarship to Son/Daughter of Differently-Abled Person',
  'Tamil Nadu scholarship for sons/daughters of differently-abled persons. Parent holds the relevant welfare-board ID card. Applicable from XI standard through PG/professional education.',
  'GOVERNMENT_SCHOLARSHIP','STATE','prov-tn-socialwelfare-pwd',
  'ALL','Tamil Nadu',
  'Parent must be a person with disability holding the TN welfare-board identity card. Student enrolled from XI through PG/professional courses.',
  'Educational scholarship per scheme rules. Requires welfare-board identity card + institution certificate.',
  'https://www.tn.gov.in','https://www.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP','TN_DIFFERENTLY_ABLED_ID',TRUE,TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-tn-visually-impaired-reader','TN Reader Allowance for Visually Impaired Students',
  'Tamil Nadu reader allowance for visually impaired students from IX standard through degree, PG and professional education.',
  'GOVERNMENT_SCHOLARSHIP','STATE','prov-tn-socialwelfare-pwd',
  'ALL','Tamil Nadu',
  'Visually impaired student with valid disability ID/certificate, enrolled from IX standard through degree/PG/professional programmes.',
  'Reader allowance per scheme rules to support visually impaired students in academic work.',
  'https://www.tn.gov.in','https://www.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP','TN_DIFFERENTLY_ABLED_ID',TRUE,FALSE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- G. BEEDI / MINE / CINE WORKERS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description, financial_amount,
  official_source_url, official_website_url,
  scholarship_category, id_card_type, tuition_fee_support,
  full_course_or_first_year, verification_status, last_verified_date, featured) VALUES

('opp-beedi-mine-cine-edu','Labour Welfare Organisation — Beedi/Limestone/Cine Worker Children Education Assistance',
  'Government of India educational assistance for wards of Beedi workers, Limestone & Dolomite Mine workers, and Cine workers. Ranges from ₹1,000 to ₹25,000 depending on class/course level. Applied through NSP portal.',
  'GOVERNMENT_SCHOLARSHIP','CENTRAL','prov-labour-welfare-org',
  'ALL','All India',
  'Child/ward of registered Beedi worker, Limestone & Dolomite Mine worker, or Cine worker. Enrolled in Class I through professional degree.',
  '₹1,000 (Class I–V) to ₹25,000 (professional degree) per year depending on class/course level.',
  25000,
  'https://labour.gov.in','https://labour.gov.in',
  'TYPE5_WELFARE_ID','BEEDI_WORKER_DOCUMENT',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- H. MINORITY SCHOLARSHIPS (NSP)
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description,
  official_source_url, official_application_url, official_website_url,
  scholarship_category, tuition_fee_support,
  full_course_or_first_year, verification_status, last_verified_date, featured) VALUES

('opp-minority-postmatric','Post-Matric Scholarship for Minority Students (NSP)',
  'Central Government post-matric scholarship for eligible minority community students (Muslim, Christian, Sikh, Buddhist, Parsi, Jain) pursuing higher education. Applied through NSP portal.',
  'MINORITY_SCHOLARSHIP','CENTRAL','prov-tn-minority-welfare',
  'UNDERGRADUATE','All India',
  'Eligible minority students (Muslim, Christian, Sikh, Buddhist, Parsi, Jain) enrolled in post-matric/higher education. Income and other scheme conditions apply.',
  'Tuition fee + maintenance allowance per scheme rules.',
  'https://scholarships.gov.in','https://scholarships.gov.in',
  'https://www.minoritywelfare.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-minority-merit-means','Merit-cum-Means Scholarship for Minorities — Technical/Professional Courses',
  'Central Government merit-cum-means scholarship for eligible minority students pursuing professional/technical courses. Merit and family-income criteria apply.',
  'MINORITY_SCHOLARSHIP','CENTRAL','prov-tn-minority-welfare',
  'UNDERGRADUATE','All India',
  'Eligible minority students enrolled in professional/technical degree programmes. Merit (minimum marks) + family-income criteria per scheme rules.',
  'Tuition fee + maintenance allowance per scheme rules. Verify current amount on NSP portal.',
  'https://scholarships.gov.in','https://scholarships.gov.in',
  'https://www.minoritywelfare.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- I. SPORTS SCHOLARSHIPS
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description,
  official_source_url, official_website_url,
  scholarship_category, sports_eligible, tuition_fee_support,
  full_course_or_first_year, verification_status, last_verified_date, featured) VALUES

('opp-sdat-sports','SDAT — Sports Development Authority of Tamil Nadu Scholarship',
  'Sports Development Authority of Tamil Nadu (SDAT) provides scholarships and financial support to students with recognised sports achievements pursuing higher education in Tamil Nadu.',
  'SPORTS_SCHOLARSHIP','STATE','prov-sdat',
  'UNDERGRADUATE','Tamil Nadu',
  'Students with recognised district/state/national/international sports achievements. Higher education enrolment required.',
  'Scholarship/financial support for sports achievers — amount per SDAT scheme rules. Verify current cycle with SDAT.',
  'https://www.sdat.tn.gov.in','https://www.sdat.tn.gov.in',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',TRUE,FALSE,
  'FULL_COURSE','VERIFY_CURRENT_CYCLE','2026-08-26',FALSE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- J. DEFENCE / EX-SERVICEMEN
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description, financial_amount,
  official_source_url, official_application_url, official_website_url, official_scholarship_url,
  scholarship_category, id_card_type, defence_eligible, tuition_fee_support,
  full_course_or_first_year, verification_status, last_verified_date, featured) VALUES

('opp-pmss-defence','PM Scholarship Scheme (PMSS) — Wards of Armed Forces Personnel',
  'Prime Minister''s Scholarship Scheme for eligible wards and widows of Armed Forces personnel, Central Armed Police Forces and Railway Protection Force. Applied through Kendriya Sainik Board. Female scholars: ₹3,000/month; Male scholars: ₹2,500/month.',
  'DEFENCE_SCHOLARSHIP','CENTRAL','prov-ksb-central',
  'UNDERGRADUATE','All India',
  'Wards/widows of ex-servicemen, serving personnel, Central Armed Police Forces and Railway Protection Force. Minimum 60% marks in qualifying examination. 1st year of technical/medical/MBA/MCA degree.',
  '₹3,000/month for female scholars; ₹2,500/month for male scholars. Duration: course length (1–5 years depending on programme).',
  36000,
  'https://ksb.gov.in','https://ksb.gov.in','https://ksb.gov.in','https://ksb.gov.in/pmss.htm',
  'TYPE1_GOVERNMENT_SCHOLARSHIP','EX_SERVICEMAN_ID',TRUE,FALSE,
  'FULL_COURSE','ACTIVE','2026-08-26',TRUE);

-- ═══════════════════════════════════════════════════════════════════════════════
-- K. NEW CENTRAL GOVERNMENT SCHEMES
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO opportunities (id, title, description, opportunity_type, government_level, provider_id,
  education_level, state, eligibility_summary, benefits_description, financial_amount,
  official_source_url, official_application_url, official_website_url,
  scholarship_category, disability_eligible, tuition_fee_support,
  full_course_or_first_year, verification_status, last_verified_date, featured) VALUES

('opp-aicte-saksham','AICTE Saksham Scholarship — Differently-Abled Students in Technical Education',
  'AICTE Saksham Scholarship for eligible students with specified disabilities enrolled in AICTE-approved technical degree or diploma programmes. Applied through NSP portal.',
  'DISABILITY_SCHOLARSHIP','CENTRAL',
  (SELECT id FROM providers WHERE id = 'prov-aicte' LIMIT 1),
  'UNDERGRADUATE','All India',
  'Differently-abled students (with ≥40% disability certificate) enrolled in 1st year of AICTE-approved technical degree or diploma. Family income < ₹8,00,000/year.',
  '₹50,000/year for the course duration — tuition, laptop and educational expenses.',
  50000,
  'https://scholarships.gov.in','https://scholarships.gov.in',
  'https://www.aicte-india.org',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',TRUE,TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE),

('opp-aicte-swanath','AICTE Swanath Scholarship — Students in Difficult Circumstances',
  'AICTE Swanath Scholarship for students who are orphaned, children of armed forces / CAPF personnel killed in action, or children of COVID-19-affected families enrolled in AICTE-approved technical programmes.',
  'GOVERNMENT_SCHOLARSHIP','CENTRAL',
  (SELECT id FROM providers WHERE id = 'prov-aicte' LIMIT 1),
  'UNDERGRADUATE','All India',
  'Orphaned students; children of Armed Forces/CAPF martyrs; children of COVID-19 affected families. Enrolled in 1st year AICTE-approved technical degree/diploma. Family income < ₹8,00,000/year.',
  '₹50,000/year for the course duration — tuition, laptop and educational expenses.',
  50000,
  'https://scholarships.gov.in','https://scholarships.gov.in',
  'https://www.aicte-india.org',
  'TYPE1_GOVERNMENT_SCHOLARSHIP',FALSE,TRUE,
  'FULL_COURSE','ACTIVE','2026-08-26',FALSE);

-- Use AICTE as provider if it exists, otherwise use first CENTRAL_GOVERNMENT provider
UPDATE opportunities SET provider_id = (SELECT id FROM providers WHERE type = 'CENTRAL_GOVERNMENT' LIMIT 1)
  WHERE id IN ('opp-aicte-saksham','opp-aicte-swanath') AND provider_id IS NULL;
