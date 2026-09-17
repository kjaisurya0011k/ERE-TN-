-- ====================================================================
-- ERE-TN Database Seed Script: Verified Scholarships & Welfare Schemes
-- Target: PostgreSQL / Flyway / Backend Data Seed
-- Verified Official Website & Application URLs Included
-- ====================================================================

-- 1. Insert Providers
INSERT INTO providers (id, name, type, description, official_website, state, verification_status, last_verified_date)
VALUES
('prov-sabari-foundation', 'Sabari Foundation / Rajalakshmi Educational Trust', 'FOUNDATION', 'Administering full and partial merit-based scholarships for 190+ and 180+ cut-off students in Rajalakshmi Institutions.', 'https://www.ritchennai.org', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-shiv-nadar-foundation', 'Shiv Nadar Foundation / SSN Trust', 'FOUNDATION', 'Philanthropic foundation providing 100% free higher education to top board rankers and rural government school toppers.', 'https://www.ssn.edu.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-sapthagiri-trust', 'Sapthagiri Educational Trust / Leo Muthu Foundation', 'FOUNDATION', 'Sponsoring full tuition and hostel fee waivers for meritorious 12th students joining Sri Sairam Institutions.', 'https://sairam.edu.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-bannari-amman-trust', 'Bannari Amman Educational Trust', 'FOUNDATION', 'Trust offering 100% free tuition and boarding scholarships for 190+ cut-off engineering aspirants.', 'https://www.bitsathy.ac.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-kpr-charities', 'KPR Charities & Educational Trust', 'FOUNDATION', 'Providing full and 50% tuition and hostel sponsorships for 190+ and 180+ cut-off engineering students in Coimbatore.', 'https://kpriet.ac.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-vlb-trust', 'V.L.B. Trust', 'FOUNDATION', 'Offering tuition fee waivers for meritorious cut-off holders in Sri Krishna Institutions.', 'https://www.skcet.ac.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-saveetha-trust', 'Saveetha Educational Trust', 'FOUNDATION', 'Awarding 100% and 50% tuition fee waivers for 190+ and 180+ cut-off students in Saveetha Engineering College.', 'https://saveetha.ac.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-veltech-trust', 'Vel Tech Trust', 'FOUNDATION', 'Mahatma Gandhi National Merit Scholarship offering up to 100% tuition and hostel scholarships.', 'https://www.veltech.edu.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-tn-cuwwb', 'Tamil Nadu Construction Workers Welfare Board', 'STATE_GOVERNMENT', 'Statutory welfare board providing annual educational stipends and hostel support for children of registered construction workers.', 'https://tnuwwb.tn.gov.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-tn-unorganized-board', 'Tamil Nadu Unorganized Workers Welfare Boards', 'STATE_GOVERNMENT', 'State welfare boards for auto drivers, tailoring, manual labour, and craft workers providing higher education assistance.', 'https://tnuwwb.tn.gov.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-tn-higher-edu', 'Department of Higher Education, Govt of Tamil Nadu', 'STATE_GOVERNMENT', 'Administering 7.5% Govt School 100% Free Education Quota and First Graduate Fee Concession.', 'https://www.tneaonline.org', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-tn-adi-dravidar', 'Adi Dravidar & Tribal Welfare Department, Govt of Tamil Nadu', 'STATE_GOVERNMENT', 'Providing 100% Post-Matric Free Higher Education for SC, ST, SCA, and SCC students.', 'https://escholarship.tn.gov.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-tn-bcmbc', 'BC, MBC & Minorities Welfare Department, Govt of Tamil Nadu', 'STATE_GOVERNMENT', 'Providing Post-Matric fee reimbursement and hostel maintenance allowance.', 'https://bcmbcmw.tn.gov.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-agaram-foundation', 'Agaram Foundation', 'FOUNDATION', 'Flagship NGO founded by Actor Suriya providing 100% free higher education, hostel, and mentorship to rural poor students.', 'https://agaram.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-maatram-foundation', 'Maatram Foundation', 'FOUNDATION', 'Educational foundation offering 100% free college seats across partner institutions in Tamil Nadu.', 'https://maatramfoundation.com', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-team-everest', 'Team Everest NGO', 'FOUNDATION', 'NGO offering 100% college tuition fees and skill coaching for parentless and single-parent students.', 'https://www.teameverest.ngo', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-aicte-india', 'All India Council for Technical Education (AICTE)', 'CENTRAL_GOVERNMENT', 'Apex technical education council providing Pragati (Girls), Saksham (PwD), and Swanath scholarships.', 'https://scholarships.gov.in', 'All India', 'VERIFIED', CURRENT_DATE),
('prov-siemens-foundation', 'Siemens India Foundation', 'CORPORATE_CSR', 'CSR foundation providing 100% tuition, laptop, and stipends for Government Engineering College students.', 'https://www.siemens.com/in/en/company/sustainability/corporate-citizenship/siemens-scholarship-program.html', 'All India', 'VERIFIED', CURRENT_DATE),
('prov-kotak-foundation', 'Kotak Education Foundation', 'CORPORATE_CSR', 'Providing Kotak Kanya Scholarship of ₹1.5 Lakhs/year for girl students in professional degree programs.', 'https://kotakeducation.org', 'All India', 'VERIFIED', CURRENT_DATE),
('prov-wipro-foundation', 'Wipro Consumer Care & Wipro Cares', 'CORPORATE_CSR', 'Administering Santoor Women’s Scholarship of ₹24,000/year for girls from Govt/Govt-aided schools.', 'https://www.santoorscholarship.com', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE),
('prov-federal-bank', 'Federal Bank Hormis Memorial Foundation', 'CORPORATE_CSR', 'Providing 100% tuition fee refunds for merit-admitted MBBS, Engineering, Agriculture, and Nursing students.', 'https://www.federalbank.co.in', 'Tamil Nadu', 'VERIFIED', CURRENT_DATE)
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, official_website = EXCLUDED.official_website;

-- 2. Insert Institutions
INSERT INTO institutions (id, name, type, university_affiliation, state, district, website, verification_status, description)
VALUES
('inst-rit-chennai', 'Rajalakshmi Institute of Technology', 'AFFILIATED_COLLEGE', 'Anna University', 'Tamil Nadu', 'Chennai', 'https://www.ritchennai.org', 'VERIFIED', 'Top tier autonomous engineering institution in Chennai providing Sabari Foundation full cut-off scholarships.'),
('inst-ssn-chennai', 'SSN College of Engineering', 'AUTONOMOUS_COLLEGE', 'Anna University', 'Tamil Nadu', 'Chennai', 'https://www.ssn.edu.in', 'VERIFIED', 'Premier autonomous engineering institution offering 100% full ride scholarships for top rankers and rural school toppers.'),
('inst-sairam-chennai', 'Sri Sairam Engineering College', 'AUTONOMOUS_COLLEGE', 'Anna University', 'Tamil Nadu', 'Chennai', 'https://sairam.edu.in', 'VERIFIED', 'Autonomous institution in West Tambaram with Leo Muthu 100% and 50% merit cut-off fee waivers.'),
('inst-bit-sathy', 'Bannari Amman Institute of Technology', 'AUTONOMOUS_COLLEGE', 'Anna University', 'Tamil Nadu', 'Erode', 'https://www.bitsathy.ac.in', 'VERIFIED', 'Top engineering college in Sathyamangalam providing full free tuition and boarding for 190+ cut-off holders.'),
('inst-kpr-coimbatore', 'KPR Institute of Engineering and Technology', 'AUTONOMOUS_COLLEGE', 'Anna University', 'Tamil Nadu', 'Coimbatore', 'https://kpriet.ac.in', 'VERIFIED', 'Autonomous institution offering 100% free education for 190+ cut-off and 50% fee waivers for 180+ cut-off.'),
('inst-skcet-coimbatore', 'Sri Krishna College of Engineering and Technology', 'AUTONOMOUS_COLLEGE', 'Anna University', 'Tamil Nadu', 'Coimbatore', 'https://www.skcet.ac.in', 'VERIFIED', 'Leading autonomous college in Coimbatore offering VLB Trust merit fee concessions.'),
('inst-saveetha-chennai', 'Saveetha Engineering College', 'AUTONOMOUS_COLLEGE', 'Anna University', 'Tamil Nadu', 'Chennai', 'https://saveetha.ac.in', 'VERIFIED', 'Autonomous engineering college offering 100% and 50% tuition fee waivers for 190+ and 180+ cut-offs.')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, website = EXCLUDED.website;

-- 3. Insert Opportunities
INSERT INTO opportunities (
    id, title, description, opportunity_type, government_level, provider_id, institution_id, institution_name,
    education_level, state, eligibility_summary, benefits_description, financial_amount,
    official_source_url, official_application_url, application_method, contact_helpline, verification_status,
    last_verified_date, featured, tuition_fee_support, hostel_support
)
VALUES
(
    'opp-rit-sabari-190-free',
    'Rajalakshmi Institutions (REC/RIT) 100% Free Seat (Sabari Foundation)',
    'Full tuition fee and hostel/transport fee waiver for students with 190+ cut-off in 12th standard engineering admissions.',
    'SCHOLARSHIP', 'INSTITUTION_MERIT', 'prov-sabari-foundation', 'inst-rit-chennai', 'Rajalakshmi Institute of Technology / REC',
    'UNDERGRADUATE', 'Tamil Nadu', 'TNEA Engineering Cut-off >= 190.00 / 200 in 12th Board examinations for PCM stream.',
    '100% Free Tuition Fee for 4 years + 100% Free Hostel & Mess OR Free College Bus Transportation.',
    200000, 'https://www.ritchennai.org/scholarship.php', 'https://www.ritchennai.org/admissions.php', 'College Admissions / TNEA Counseling', '044-67181600',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-rit-sabari-180-half',
    'Rajalakshmi Institutions (REC/RIT) 50% Merit Scholarship (Sabari Foundation)',
    '50% fee concession on tuition and hostel/transport for students scoring 180 to 189.5 cut-off in 12th board exams.',
    'SCHOLARSHIP', 'INSTITUTION_MERIT', 'prov-sabari-foundation', 'inst-rit-chennai', 'Rajalakshmi Institute of Technology / REC',
    'UNDERGRADUATE', 'Tamil Nadu', 'TNEA Cut-off between 180.00 and 189.50 / 200 in 12th Board examinations.',
    '50% Tuition Fee waiver + 50% concession on Hostel/Mess charges or College Bus charges for 4 years.',
    100000, 'https://www.ritchennai.org', 'https://www.ritchennai.org/admissions.php', 'College Admissions Office', '044-67181600',
    'VERIFIED', CURRENT_DATE, FALSE, TRUE, TRUE
),
(
    'opp-ssn-merit-full-195',
    'SSN College of Engineering 100% Free Education & Rural Topper Scholarship',
    'SSN Trust 100% scholarship for top 25 board rankers and rural government school toppers in Tamil Nadu.',
    'SCHOLARSHIP', 'INSTITUTION_MERIT', 'prov-shiv-nadar-foundation', 'inst-ssn-chennai', 'SSN College of Engineering',
    'UNDERGRADUATE', 'Tamil Nadu', 'Top 25 State Board rankers or TNEA Cut-off >= 195.00 / 200; dedicated seats for Rural Govt School toppers.',
    '100% Free Tuition Fee + Free Shared Hostel Accommodation + Free Mess Food + Annual Book Allowance.',
    250000, 'https://www.ssn.edu.in/scholarships/', 'https://www.ssn.edu.in/admissions/', 'Merit List / Counseling', '044-27469700',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-sairam-leomuthu-190',
    'Sri Sairam Institutions 100% Free Seat (Leo Muthu Foundation)',
    '100% Free tuition and hostel seat for students with 190+ cut-off in 12th board examinations.',
    'SCHOLARSHIP', 'INSTITUTION_MERIT', 'prov-sapthagiri-trust', 'inst-sairam-chennai', 'Sri Sairam Engineering College',
    'UNDERGRADUATE', 'Tamil Nadu', '12th Standard TNEA Cut-Off >= 190.00 / 200.',
    '100% Tuition Fee Waiver + 100% Free Hostel/Mess or College Bus transport charges.',
    180000, 'https://sairam.edu.in', 'https://sairam.edu.in/admissions/', 'College Admissions / Counseling', '044-22512222',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-bit-bannari-190',
    'Bannari Amman Institute of Technology (BIT) 100% Full Scholarship',
    'Complete tuition fee and boarding scholarship for 190+ cut-off holders in engineering.',
    'SCHOLARSHIP', 'INSTITUTION_MERIT', 'prov-bannari-amman-trust', 'inst-bit-sathy', 'Bannari Amman Institute of Technology',
    'UNDERGRADUATE', 'Tamil Nadu', 'TNEA Cut-Off >= 190.00 / 200 in 12th Board examinations.',
    '100% Tuition Fee Waiver + 100% Free Hostel Accommodation and Mess Food for 4 years.',
    190000, 'https://www.bitsathy.ac.in', 'https://www.bitsathy.ac.in/admission/', 'TNEA Counseling / Direct Merit', '04295-226000',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-kpr-charities-190',
    'KPR Institute of Engineering 100% Free Higher Education Scheme',
    '100% Free engineering education for 190+ cut-off students in Coimbatore.',
    'SCHOLARSHIP', 'INSTITUTION_MERIT', 'prov-kpr-charities', 'inst-kpr-coimbatore', 'KPR Institute of Engineering and Technology',
    'UNDERGRADUATE', 'Tamil Nadu', '12th Standard TNEA Cut-Off >= 190.00 / 200.',
    '100% Tuition Fee Waiver + 100% Free Hostel & Food for all 4 years. (Cut-off 180-189 gets 50% waiver).',
    185000, 'https://kpriet.ac.in', 'https://kpriet.ac.in/admissions/', 'College Merit / TNEA', '0422-2635600',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-tn-construction-board-edu',
    'Tamil Nadu Construction Workers Welfare Board Educational Grant',
    'Educational assistance and hostel aid for children of registered construction workers in Tamil Nadu.',
    'SCHOLARSHIP', 'STATE_GOVERNMENT', 'prov-tn-cuwwb', NULL, NULL,
    'UNDERGRADUATE', 'Tamil Nadu', 'Parent must be an active registered member of TN Construction Workers Welfare Board.',
    'Arts/Science: ₹1,500 to ₹3,000/yr; Professional degrees: ₹4,000 to ₹6,000/yr (Hostel assistance up to ₹12,000/yr).',
    12000, 'https://tnuwwb.tn.gov.in/schemes', 'https://tnuwwb.tn.gov.in', 'Online e-Sevai / Labour Office', '044-24335111',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-tn-75-govt-school',
    'Tamil Nadu 7.5% Government School Quota 100% Free Higher Education Scheme',
    '100% government-funded free education covering tuition, hostel, food, and exam fees for TN Govt school students.',
    'SCHOLARSHIP', 'STATE_GOVERNMENT', 'prov-tn-higher-edu', NULL, NULL,
    'UNDERGRADUATE', 'Tamil Nadu', 'Studied Classes 6 to 12 continuously in Tamil Nadu Government Schools admitted via Counseling.',
    '100% Full Free Education: Complete Tuition Fees, Hostel Accommodation, Food, Special Fees, and University Exam Fees paid by Govt of Tamil Nadu.',
    200000, 'https://www.tn.gov.in/department/11', 'https://www.tneaonline.org', 'Automated via Single Window Counseling', '044-22351014',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-tn-first-graduate',
    'Tamil Nadu First Graduate Tuition Fee Concession (முதல் தலைமுறை பட்டதாரி)',
    'State government fee concession for first-generation graduates admitted via single-window counseling.',
    'SCHOLARSHIP', 'STATE_GOVERNMENT', 'prov-tn-higher-edu', NULL, NULL,
    'UNDERGRADUATE', 'Tamil Nadu', 'First person in the entire family to graduate from college; admitted via TNEA / Govt Counseling.',
    'Direct tuition fee concession of ₹25,000/year (Non-Accredited) to ₹27,500/year (Accredited courses).',
    27500, 'https://www.tnesevai.tn.gov.in', 'https://www.tnesevai.tn.gov.in', 'e-Sevai First Graduate Certificate during Counseling', '044-22351014',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, FALSE
),
(
    'opp-agaram-vidhai',
    'Agaram Foundation Vidhai 100% Free Higher Education Sponsorship',
    'Full college, hostel, mess, and mentorship sponsorship for poor and deserving students from Tamil Nadu.',
    'SCHOLARSHIP', 'NON_PROFIT_TRUST', 'prov-agaram-foundation', NULL, NULL,
    'UNDERGRADUATE', 'Tamil Nadu', 'Economically disadvantaged rural students, orphans, single-parent children from Tamil Nadu with exceptional 12th marks.',
    '100% Free Higher Education: College Tuition Fees + Free Hostel + Free Food + Soft Skills Coaching + Placement Mentorship.',
    200000, 'https://agaram.in/vidhai/', 'https://agaram.in/vidhai/', 'Application -> Home Visit -> Interview', '044-42866666',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-maatram-foundation',
    'Maatram Foundation 100% Free Higher Education Program',
    'Zero-fee higher education across top partner colleges in Tamil Nadu for economically poor students.',
    'SCHOLARSHIP', 'NON_PROFIT_TRUST', 'prov-maatram-foundation', NULL, NULL,
    'UNDERGRADUATE', 'Tamil Nadu', 'Deserving students from economically deprived families (daily-wage earners, single mothers, first-generation graduates).',
    '100% Free Higher Education across top partner colleges: Zero Tuition, Zero Hostel, Zero Food, Zero Bus Fees.',
    200000, 'https://maatramfoundation.com', 'https://maatramfoundation.com/apply/', 'Online Application -> Interview', '9962299333',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-aicte-pragati-girls',
    'AICTE Pragati Scholarship for Girl Students (Technical Degree/Diploma)',
    'Central government scholarship of ₹50,000/year for meritorious girl students in technical courses.',
    'SCHOLARSHIP', 'CENTRAL_GOVERNMENT', 'prov-aicte-india', NULL, NULL,
    'UNDERGRADUATE', 'All India', 'Up to 2 girl children per family admitted to 1st year of AICTE-approved Degree or Diploma institution; Family income < ₹8,00,000/year.',
    '₹50,000 per year for all 4 years of study towards tuition fees, laptop, and academic expenses.',
    50000, 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati', 'https://scholarships.gov.in', 'National Scholarship Portal (NSP)', '011-29581000',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-siemens-scholarship',
    'Siemens Scholarship Program (100% Full Tuition + Laptop + Allowance)',
    '100% full tuition, free laptop, and internship support for Government Engineering College students.',
    'SCHOLARSHIP', 'CORPORATE_CSR', 'prov-siemens-foundation', NULL, NULL,
    'UNDERGRADUATE', 'All India', '1st-year students of Government Engineering Colleges in Mech, EEE, ECE, CS, IT; 12th PCM >= 60%; Income < ₹2,50,000/year.',
    '100% Tuition Fees Paid + Annual Book Allowance + Free Laptop + Siemens Industrial Internships.',
    150000, 'https://www.siemens.com/in/en/company/sustainability/corporate-citizenship/siemens-scholarship-program.html', 'https://www.siemens.com/in/en/company/sustainability/corporate-citizenship/siemens-scholarship-program.html', 'Online Application -> Assessment -> Interview', '1800-209-1800',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
),
(
    'opp-kotak-kanya-girls',
    'Kotak Kanya Scholarship (Girls in Professional Degrees)',
    'Corporate CSR scholarship offering ₹1.5 Lakhs/year for meritorious girl students in engineering, medical, and law.',
    'SCHOLARSHIP', 'CORPORATE_CSR', 'prov-kotak-foundation', NULL, NULL,
    'UNDERGRADUATE', 'All India', 'Meritorious girl students with >= 85% in 12th admitted to 1st year Engineering, MBBS, Architecture, or Law; Income < ₹6,00,000.',
    '₹1,50,000 per year towards tuition fees, hostel, laptop, and academic expenses until graduation.',
    150000, 'https://kotakeducation.org/kotak-kanya-scholarship/', 'https://www.buddy4study.com/page/kotak-kanya-scholarship', 'Buddy4Study Portal', '011-430-92248',
    'VERIFIED', CURRENT_DATE, TRUE, TRUE, TRUE
)
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, description = EXCLUDED.description, benefits_description = EXCLUDED.benefits_description,
    financial_amount = EXCLUDED.financial_amount, official_source_url = EXCLUDED.official_source_url,
    official_application_url = EXCLUDED.official_application_url, contact_helpline = EXCLUDED.contact_helpline,
    tuition_fee_support = EXCLUDED.tuition_fee_support, hostel_support = EXCLUDED.hostel_support;

-- 4. Insert Tags
INSERT INTO opportunity_tags (opportunity_id, tag)
VALUES
('opp-rit-sabari-190-free', '190+ Cut-off'), ('opp-rit-sabari-190-free', '100% Free Hostel'), ('opp-rit-sabari-190-free', '100% Free Tuition'), ('opp-rit-sabari-190-free', 'Sabari Foundation'),
('opp-rit-sabari-180-half', '180+ Cut-off'), ('opp-rit-sabari-180-half', '50% Free Tuition'), ('opp-rit-sabari-180-half', '50% Free Hostel'),
('opp-ssn-merit-full-195', '195+ Cut-off'), ('opp-ssn-merit-full-195', 'SSN Trust'), ('opp-ssn-merit-full-195', 'Rural Toppers'),
('opp-sairam-leomuthu-190', '190+ Cut-off'), ('opp-sairam-leomuthu-190', 'Leo Muthu Foundation'), ('opp-sairam-leomuthu-190', '100% Free Seat'),
('opp-bit-bannari-190', '190+ Cut-off'), ('opp-bit-bannari-190', 'BIT Sathy'), ('opp-bit-bannari-190', '100% Free Hostel'),
('opp-kpr-charities-190', '190+ Cut-off'), ('opp-kpr-charities-190', 'KPR Trust'), ('opp-kpr-charities-190', '100% Free Education'),
('opp-tn-construction-board-edu', 'Welfare Board'), ('opp-tn-construction-board-edu', 'Construction Workers'), ('opp-tn-construction-board-edu', 'TNCWWB'),
('opp-tn-75-govt-school', '7.5% Quota'), ('opp-tn-75-govt-school', '100% Free Education'), ('opp-tn-75-govt-school', 'Govt School Students'),
('opp-tn-first-graduate', 'First Graduate'), ('opp-tn-first-graduate', 'Fee Concession'),
('opp-agaram-vidhai', 'Agaram Foundation'), ('opp-agaram-vidhai', '100% Free College'), ('opp-agaram-vidhai', 'Vidhai'),
('opp-maatram-foundation', 'Maatram Foundation'), ('opp-maatram-foundation', '100% Free Seat'),
('opp-aicte-pragati-girls', 'AICTE Pragati'), ('opp-aicte-pragati-girls', 'Girls in Engineering'),
('opp-siemens-scholarship', 'Siemens Scholarship'), ('opp-siemens-scholarship', '100% Tuition'),
('opp-kotak-kanya-girls', 'Kotak Kanya'), ('opp-kotak-kanya-girls', 'Girls in STEM')
ON CONFLICT (opportunity_id, tag) DO NOTHING;
