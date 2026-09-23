ALTER TABLE campaign_session_effects DROP CONSTRAINT IF EXISTS campaign_session_effects_reason_check;
ALTER TABLE campaign_session_effects ADD CONSTRAINT campaign_session_effects_reason_check CHECK(char_length(reason)<=500);
ALTER TABLE campaign_sessions ADD COLUMN IF NOT EXISTS starts_at timestamptz;
ALTER TABLE campaign_sessions ADD COLUMN IF NOT EXISTS ends_at timestamptz;
ALTER TABLE campaign_sessions ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '' CHECK(char_length(location)<=1000);
CREATE TABLE IF NOT EXISTS campaign_calendar_deliveries (
 session_id uuid NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 version integer NOT NULL,
 status text NOT NULL CHECK(status IN ('sending','sent','failed')),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(session_id,user_id,version)
);
