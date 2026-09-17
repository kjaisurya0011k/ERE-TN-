-- EDUNOVA V2 Migration: Online Meetings, WebRTC Rooms, and Enhancements

CREATE TABLE IF NOT EXISTS meetings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    description         TEXT NOT NULL,
    topic               VARCHAR(160) NOT NULL,
    meeting_type        VARCHAR(40) NOT NULL DEFAULT 'CAREER_GUIDANCE',
    meeting_date        DATE NOT NULL,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    max_participants    INTEGER NOT NULL DEFAULT 50,
    language            VARCHAR(40) NOT NULL DEFAULT 'English',
    target_audience     VARCHAR(160),
    education_level     VARCHAR(40),
    career_category     VARCHAR(80),
    meeting_agenda      TEXT,
    status              VARCHAR(32) NOT NULL DEFAULT 'PENDING_APPROVAL',
    rejection_reason    TEXT,
    room_code           VARCHAR(64) NOT NULL UNIQUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT meeting_status_chk CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'))
);

CREATE INDEX IF NOT EXISTS idx_meetings_status_date ON meetings (status, meeting_date);
CREATE INDEX IF NOT EXISTS idx_meetings_mentor ON meetings (mentor_id);

CREATE TABLE IF NOT EXISTS meeting_registrations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id  UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      VARCHAR(24) NOT NULL DEFAULT 'REGISTERED',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (meeting_id, user_id),
    CONSTRAINT meeting_reg_status_chk CHECK (status IN ('REGISTERED', 'CANCELLED', 'ATTENDED'))
);

CREATE INDEX IF NOT EXISTS idx_meeting_reg_user ON meeting_registrations (user_id);
