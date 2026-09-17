-- EDUNOVA unified schema (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name       VARCHAR(160) NOT NULL,
    email           VARCHAR(180) NOT NULL UNIQUE,
    password_hash   VARCHAR(120) NOT NULL,
    phone           VARCHAR(32),
    role            VARCHAR(20)  NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT users_role_chk CHECK (role IN ('STUDENT', 'MENTOR', 'ADMIN')),
    CONSTRAINT users_status_chk CHECK (status IN ('ACTIVE', 'DISABLED', 'PENDING'))
);

CREATE TABLE institutions (
    id                      VARCHAR(80) PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    type                    VARCHAR(40)  NOT NULL,
    university_affiliation  VARCHAR(255),
    state                   VARCHAR(80)  NOT NULL,
    district                VARCHAR(80)  NOT NULL,
    website                 VARCHAR(500),
    logo_url                VARCHAR(500),
    description             TEXT,
    verification_status     VARCHAR(32)  NOT NULL DEFAULT 'NEEDS_VERIFICATION',
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_institutions_state ON institutions (state);
CREATE INDEX idx_institutions_type ON institutions (type);

CREATE TABLE student_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    age                     INTEGER,
    dob                     DATE,
    gender                  VARCHAR(24),
    state                   VARCHAR(80),
    district                VARCHAR(80),
    native_state            VARCHAR(80),
    education_level         VARCHAR(40),
    class_or_year           VARCHAR(40),
    course_branch           VARCHAR(160),
    marks_percentage        NUMERIC(5,2),
    family_annual_income    BIGINT,
    social_category         VARCHAR(20),
    community_caste         VARCHAR(80),
    religion                VARCHAR(80),
    is_pwd                  BOOLEAN NOT NULL DEFAULT FALSE,
    pwd_percentage          INTEGER,
    is_govt_school_student  BOOLEAN NOT NULL DEFAULT FALSE,
    is_first_graduate       BOOLEAN NOT NULL DEFAULT FALSE,
    is_hosteller            BOOLEAN NOT NULL DEFAULT FALSE,
    parent_occupation       VARCHAR(120),
    institution_id          VARCHAR(80) REFERENCES institutions(id),
    institution_name        VARCHAR(255),
    institution_type        VARCHAR(40),
    sports_achievement      VARCHAR(255),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE student_career_interests (
    student_profile_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    interest           VARCHAR(80) NOT NULL,
    PRIMARY KEY (student_profile_id, interest)
);

CREATE TABLE mentor_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio                     TEXT,
    title_role              VARCHAR(160),
    qualification           VARCHAR(255),
    company_or_institution  VARCHAR(255),
    years_of_experience     INTEGER,
    specialization          VARCHAR(255),
    hourly_rate             NUMERIC(10,2) NOT NULL DEFAULT 0,
    rating_avg              NUMERIC(3,2) NOT NULL DEFAULT 0,
    review_count            INTEGER NOT NULL DEFAULT 0,
    verification_status     VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    linkedin_url            VARCHAR(500),
    avatar_url              VARCHAR(500),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT mentor_status_chk CHECK (verification_status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

CREATE TABLE mentor_expertise_tags (
    mentor_profile_id UUID NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    tag               VARCHAR(80) NOT NULL,
    PRIMARY KEY (mentor_profile_id, tag)
);

CREATE TABLE mentor_languages (
    mentor_profile_id UUID NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    language          VARCHAR(40) NOT NULL,
    PRIMARY KEY (mentor_profile_id, language)
);

CREATE TABLE mentor_availability (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_profile_id UUID NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
    weekday           VARCHAR(16) NOT NULL,
    start_time        TIME NOT NULL,
    end_time          TIME NOT NULL
);

CREATE TABLE providers (
    id                  VARCHAR(80) PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    type                VARCHAR(40)  NOT NULL,
    description         TEXT,
    mission             TEXT,
    who_they_support    TEXT,
    logo_url            VARCHAR(500),
    official_website    VARCHAR(500),
    contact_email       VARCHAR(180),
    contact_phone       VARCHAR(40),
    location            VARCHAR(255),
    state               VARCHAR(80),
    verification_status VARCHAR(32) NOT NULL DEFAULT 'NEEDS_VERIFICATION',
    last_verified_date  DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_providers_type ON providers (type);
CREATE INDEX idx_providers_state ON providers (state);

CREATE TABLE provider_focus_areas (
    provider_id VARCHAR(80) NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    focus_area  VARCHAR(120) NOT NULL,
    PRIMARY KEY (provider_id, focus_area)
);

CREATE TABLE opportunities (
    id                      VARCHAR(80) PRIMARY KEY,
    title                   VARCHAR(400) NOT NULL,
    description             TEXT NOT NULL,
    opportunity_type        VARCHAR(40) NOT NULL,
    government_level        VARCHAR(40),
    provider_id             VARCHAR(80) NOT NULL REFERENCES providers(id),
    institution_id          VARCHAR(80) REFERENCES institutions(id),
    institution_name        VARCHAR(255),
    education_level         VARCHAR(40),
    state                   VARCHAR(80),
    eligibility_summary     TEXT,
    benefits_description    TEXT,
    financial_amount        BIGINT,
    official_source_url     VARCHAR(500),
    official_application_url VARCHAR(500),
    application_method      VARCHAR(80),
    contact_helpline        VARCHAR(120),
    verification_status     VARCHAR(32) NOT NULL DEFAULT 'DEMO_DATA',
    last_verified_date      DATE,
    featured                BOOLEAN NOT NULL DEFAULT FALSE,
    tuition_fee_support     BOOLEAN NOT NULL DEFAULT FALSE,
    hostel_support          BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_opp_type ON opportunities (opportunity_type);
CREATE INDEX idx_opp_provider ON opportunities (provider_id);
CREATE INDEX idx_opp_institution ON opportunities (institution_id);
CREATE INDEX idx_opp_state ON opportunities (state);
CREATE INDEX idx_opp_verification ON opportunities (verification_status);
CREATE INDEX idx_opp_title ON opportunities (title);

CREATE TABLE opportunity_tags (
    opportunity_id VARCHAR(80) NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    tag            VARCHAR(80) NOT NULL,
    PRIMARY KEY (opportunity_id, tag)
);

CREATE TABLE opportunity_eligibility (
    opportunity_id              VARCHAR(80) PRIMARY KEY REFERENCES opportunities(id) ON DELETE CASCADE,
    min_age                     INTEGER,
    max_age                     INTEGER,
    gender_allowed              VARCHAR(24),
    allowed_states              VARCHAR(400),
    allowed_education_levels    VARCHAR(400),
    allowed_courses             VARCHAR(400),
    min_marks_percentage        NUMERIC(5,2),
    max_family_income           BIGINT,
    allowed_categories          VARCHAR(200),
    religion                    VARCHAR(80),
    caste                       VARCHAR(80),
    requires_pwd                BOOLEAN,
    requires_govt_school        BOOLEAN,
    requires_first_graduate     BOOLEAN,
    requires_hosteller          BOOLEAN,
    parent_occupation           VARCHAR(120),
    allowed_institutions        VARCHAR(400),
    other_conditions            TEXT
);

CREATE TABLE opportunity_benefits (
    opportunity_id          VARCHAR(80) PRIMARY KEY REFERENCES opportunities(id) ON DELETE CASCADE,
    amount                  BIGINT,
    payment_frequency       VARCHAR(40),
    tuition_fee             BOOLEAN NOT NULL DEFAULT FALSE,
    hostel_assistance       BOOLEAN NOT NULL DEFAULT FALSE,
    book_allowance          BOOLEAN NOT NULL DEFAULT FALSE,
    exam_fee                BOOLEAN NOT NULL DEFAULT FALSE,
    equipment_assistance    BOOLEAN NOT NULL DEFAULT FALSE,
    other_benefits          TEXT,
    maximum_benefit         VARCHAR(160),
    duration                VARCHAR(80)
);

CREATE TABLE opportunity_documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id  VARCHAR(80) NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    required        BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE opportunity_application_steps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id  VARCHAR(80) NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    step_number     INTEGER NOT NULL,
    instruction     TEXT NOT NULL
);

CREATE TABLE opportunity_deadlines (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id  VARCHAR(80) NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    start_date      DATE,
    closing_date    DATE,
    label           VARCHAR(80),
    frequency       VARCHAR(40),
    is_ongoing      BOOLEAN NOT NULL DEFAULT FALSE,
    status          VARCHAR(32) NOT NULL DEFAULT 'OPEN'
);

CREATE INDEX idx_deadlines_closing ON opportunity_deadlines (closing_date);

CREATE TABLE saved_opportunities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id  VARCHAR(80) NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, opportunity_id)
);

CREATE TABLE deadline_reminders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id  VARCHAR(80) NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    remind_on       DATE NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, opportunity_id)
);

CREATE TABLE counselling_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id),
    mentor_id       UUID NOT NULL REFERENCES users(id),
    session_date    DATE NOT NULL,
    start_time      TIME NOT NULL,
    session_type    VARCHAR(40) NOT NULL DEFAULT 'CAREER',
    status          VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT counselling_status_chk CHECK (status IN ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'))
);

CREATE TABLE chat_conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (student_id, mentor_id)
);

CREATE TABLE chat_messages (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id     UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id           UUID NOT NULL REFERENCES users(id),
    body                TEXT NOT NULL,
    read_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_conv ON chat_messages (conversation_id, created_at);

CREATE TABLE future_talks (
    id                  VARCHAR(80) PRIMARY KEY,
    title               VARCHAR(400) NOT NULL,
    speaker_name        VARCHAR(160) NOT NULL,
    speaker_role        VARCHAR(160),
    speaker_company     VARCHAR(160),
    speaker_avatar_url  VARCHAR(500),
    topic_domain        VARCHAR(80),
    talk_date           DATE NOT NULL,
    talk_time           VARCHAR(20) NOT NULL,
    duration_minutes    INTEGER NOT NULL DEFAULT 60,
    description         TEXT,
    max_participants    INTEGER,
    meeting_link        VARCHAR(500),
    status              VARCHAR(20) NOT NULL DEFAULT 'UPCOMING'
);

CREATE TABLE future_talk_registrations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talk_id         VARCHAR(80) NOT NULL REFERENCES future_talks(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (talk_id, user_id)
);

CREATE TABLE courses (
    id                  VARCHAR(80) PRIMARY KEY,
    title               VARCHAR(400) NOT NULL,
    thumbnail_url       VARCHAR(500),
    instructor_name     VARCHAR(160),
    instructor_role     VARCHAR(160),
    level               VARCHAR(24),
    duration_hours      INTEGER,
    category            VARCHAR(80),
    description         TEXT,
    is_premium          BOOLEAN NOT NULL DEFAULT FALSE,
    rating              NUMERIC(3,2) NOT NULL DEFAULT 0,
    enrolled_students   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE course_learn_items (
    course_id   VARCHAR(80) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    item        VARCHAR(255) NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (course_id, sort_order)
);

CREATE TABLE course_modules (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id   VARCHAR(80) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE lessons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id       UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    duration_minutes INTEGER,
    video_url       VARCHAR(500),
    sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE course_enrollments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id   VARCHAR(80) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (course_id, user_id)
);

CREATE TABLE lesson_progress (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id   UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed   BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (lesson_id, user_id)
);

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    type        VARCHAR(40) NOT NULL,
    link        VARCHAR(500),
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications (user_id, created_at DESC);
