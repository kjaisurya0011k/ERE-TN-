-- EDUNOVA V3 Migration: NOVA AI Conversations, Messages, and Saved Roadmaps

CREATE TABLE IF NOT EXISTS nova_conversations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token   VARCHAR(128),
    title           VARCHAR(255) NOT NULL DEFAULT 'Career Guidance',
    language        VARCHAR(16) NOT NULL DEFAULT 'en',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nova_conv_user ON nova_conversations (user_id);
CREATE INDEX IF NOT EXISTS idx_nova_conv_session ON nova_conversations (session_token);

CREATE TABLE IF NOT EXISTS nova_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES nova_conversations(id) ON DELETE CASCADE,
    role            VARCHAR(16) NOT NULL, -- 'user', 'assistant', 'system'
    content         TEXT NOT NULL,
    action_payload  TEXT, -- JSON for action buttons & roadmap data
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nova_msg_conv ON nova_messages (conversation_id);

CREATE TABLE IF NOT EXISTS saved_roadmaps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    goal            VARCHAR(255) NOT NULL,
    roadmap_json    TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_saved_roadmaps_user ON saved_roadmaps (user_id);
