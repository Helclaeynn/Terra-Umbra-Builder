ALTER TABLE campaign_sessions ADD COLUMN IF NOT EXISTS scenes jsonb NOT NULL DEFAULT '[]'::jsonb;
CREATE TABLE IF NOT EXISTS campaign_session_effects (
 id uuid PRIMARY KEY,
 session_id uuid NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
 character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
 character_name text NOT NULL,
 money bigint NOT NULL DEFAULT 0 CHECK(money BETWEEN 0 AND 1000000000),
 corruption_delta integer NOT NULL DEFAULT 0 CHECK(corruption_delta BETWEEN 0 AND 100),
 corruption_source text NOT NULL DEFAULT '',
 reason text NOT NULL CHECK(char_length(reason) BETWEEN 1 AND 500),
 before_state jsonb NOT NULL,
 after_state jsonb NOT NULL,
 applied_by uuid REFERENCES users(id) ON DELETE SET NULL,
 applied_at timestamptz NOT NULL DEFAULT now(),
 CHECK(money>0 OR corruption_delta>0)
);
CREATE INDEX IF NOT EXISTS campaign_effects_session_idx ON campaign_session_effects(session_id,applied_at);
