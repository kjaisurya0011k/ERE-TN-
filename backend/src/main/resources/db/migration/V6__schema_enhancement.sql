-- V6: Schema Enhancement — Fee Breakdown, ID-Card Types, Official URLs, New Fields
-- Run automatically by Flyway on next backend startup

-- ── opportunities table: new columns ──────────────────────────────────────────
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS tuition_waiver_pct     INT          DEFAULT 0;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS hostel_waiver_pct      INT          DEFAULT 0;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS transport_waiver_pct   INT          DEFAULT 0;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS exam_fee_covered        BOOLEAN      DEFAULT FALSE;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS full_course_or_first_year VARCHAR(20) DEFAULT 'FULL_COURSE';
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS scholarship_category   VARCHAR(40);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS id_card_type           VARCHAR(80);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS official_website_url   VARCHAR(500);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS official_scholarship_url VARCHAR(500);
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS full_fee_support        BOOLEAN      DEFAULT FALSE;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS sports_eligible         BOOLEAN      DEFAULT FALSE;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS disability_eligible     BOOLEAN      DEFAULT FALSE;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS defence_eligible        BOOLEAN      DEFAULT FALSE;

-- ── providers table: new columns ──────────────────────────────────────────────
ALTER TABLE providers ADD COLUMN IF NOT EXISTS official_website_url  VARCHAR(500);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS scholarship_page_url  VARCHAR(500);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS admission_page_url    VARCHAR(500);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS provider_category     VARCHAR(40);

-- ── Indexes for new filter columns ────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_opp_full_fee    ON opportunities(full_fee_support);
CREATE INDEX IF NOT EXISTS idx_opp_tuition_pct ON opportunities(tuition_waiver_pct);
CREATE INDEX IF NOT EXISTS idx_opp_sch_cat     ON opportunities(scholarship_category);
CREATE INDEX IF NOT EXISTS idx_opp_id_card     ON opportunities(id_card_type);
CREATE INDEX IF NOT EXISTS idx_opp_sports      ON opportunities(sports_eligible);
CREATE INDEX IF NOT EXISTS idx_opp_disability  ON opportunities(disability_eligible);
CREATE INDEX IF NOT EXISTS idx_prov_category   ON providers(provider_category);

-- ── Backfill existing opportunities with scholarship_category ─────────────────
UPDATE opportunities SET scholarship_category = 'TYPE3_COLLEGE_MERIT'
  WHERE opportunity_type IN ('COLLEGE_SCHOLARSHIP');

UPDATE opportunities SET scholarship_category = 'TYPE1_GOVERNMENT_SCHOLARSHIP'
  WHERE opportunity_type IN ('GOVERNMENT_SCHOLARSHIP', 'GOVERNMENT_SCHEME');

UPDATE opportunities SET scholarship_category = 'TYPE2_GOVERNMENT_FEE_CONCESSION'
  WHERE id IN ('opp-tn-first-graduate','opp-tn-75-govt-school','opp-tn-postmatric-scst');

UPDATE opportunities SET scholarship_category = 'TYPE4_FOUNDATION_NGO'
  WHERE opportunity_type IN ('FOUNDATION_SCHOLARSHIP','NGO_OPPORTUNITY');

UPDATE opportunities SET scholarship_category = 'TYPE5_WELFARE_ID'
  WHERE opportunity_type = 'WELFARE_ID_ASSISTANCE';

-- Backfill tuition_waiver_pct for existing 100% scholarship entries
UPDATE opportunities SET tuition_waiver_pct = 100, full_fee_support = TRUE, full_course_or_first_year = 'FULL_COURSE'
  WHERE id IN ('opp-rit-sabari-190-free','opp-ssn-merit-full-195','opp-sairam-leomuthu-190',
               'opp-bit-bannari-190','opp-kpr-charities-190','opp-tn-75-govt-school',
               'opp-agaram-vidhai');

UPDATE opportunities SET tuition_waiver_pct = 50
  WHERE id IN ('opp-rit-sabari-180-half');

-- Backfill official_website_url for existing providers
UPDATE providers SET provider_category = 'GOVT'   WHERE type IN ('CENTRAL_GOVERNMENT','STATE_GOVERNMENT');
UPDATE providers SET provider_category = 'COLLEGE' WHERE type IN ('COLLEGE_UNIVERSITY','EDUCATIONAL_INSTITUTION');
UPDATE providers SET provider_category = 'NGO'     WHERE type = 'NGO';
UPDATE providers SET provider_category = 'TRUST'   WHERE type = 'FOUNDATION';
UPDATE providers SET provider_category = 'CORPORATE' WHERE type IN ('INDUSTRY_ORGANIZATION','PRIVATE_ORGANIZATION');
