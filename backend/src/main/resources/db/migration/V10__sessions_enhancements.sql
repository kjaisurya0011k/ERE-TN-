-- V10: Sessions Enhancement — External Meeting URL, Approval Tracking, Notes
-- Adds meeting platform abstraction and approval audit columns to meetings.

ALTER TABLE meetings
    ADD COLUMN IF NOT EXISTS meeting_platform  VARCHAR(40)  DEFAULT 'BUILT_IN_WEBRTC',
    ADD COLUMN IF NOT EXISTS meeting_url       VARCHAR(500),
    ADD COLUMN IF NOT EXISTS approved_by       UUID         REFERENCES users(id),
    ADD COLUMN IF NOT EXISTS approved_at       TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS notes             TEXT;

-- Index for fast lookup by platform
CREATE INDEX IF NOT EXISTS idx_meetings_platform ON meetings (meeting_platform);
