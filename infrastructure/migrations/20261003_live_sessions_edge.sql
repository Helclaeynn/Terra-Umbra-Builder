CREATE TABLE IF NOT EXISTS character_edge_accounts (
 character_id uuid PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
 balance integer NOT NULL CHECK(balance BETWEEN 0 AND 8)
);
CREATE TABLE IF NOT EXISTS character_edge_uses (
 character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
 reference_id uuid NOT NULL,
 kind text NOT NULL CHECK(kind IN ('force','escape')),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(character_id,reference_id)
);
CREATE TABLE IF NOT EXISTS campaign_live_session_runs (
 session_id uuid PRIMARY KEY REFERENCES campaign_sessions(id) ON DELETE CASCADE,
 campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
 started_at timestamptz NOT NULL DEFAULT now(), ended_at timestamptz
);
CREATE TABLE IF NOT EXISTS campaign_live_context (
 campaign_id uuid PRIMARY KEY REFERENCES campaigns(id) ON DELETE CASCADE,
 session_id uuid REFERENCES campaign_sessions(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS campaign_live_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
 session_id uuid NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
 label text NOT NULL,
 snapshot jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE character_play_events ADD COLUMN IF NOT EXISTS live_session_id uuid REFERENCES campaign_sessions(id) ON DELETE SET NULL;
ALTER TABLE campaign_live_events ADD COLUMN IF NOT EXISTS live_session_id uuid REFERENCES campaign_sessions(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS character_play_session ON character_play_events(campaign_id,live_session_id,created_at DESC);
CREATE INDEX IF NOT EXISTS campaign_live_session ON campaign_live_events(campaign_id,live_session_id,created_at DESC);
CREATE OR REPLACE FUNCTION attach_live_session() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.live_session_id IS NULL AND NEW.campaign_id IS NOT NULL THEN
  SELECT session_id INTO NEW.live_session_id FROM campaign_live_context WHERE campaign_id=NEW.campaign_id;
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS attach_live_session ON character_play_events;
CREATE TRIGGER attach_live_session BEFORE INSERT ON character_play_events FOR EACH ROW EXECUTE FUNCTION attach_live_session();
DROP TRIGGER IF EXISTS attach_live_session ON campaign_live_events;
CREATE TRIGGER attach_live_session BEFORE INSERT ON campaign_live_events FOR EACH ROW EXECUTE FUNCTION attach_live_session();
ALTER TABLE campaign_reward_grants ADD COLUMN IF NOT EXISTS edge integer NOT NULL DEFAULT 0 CHECK(edge BETWEEN 0 AND 8);
ALTER TABLE campaign_reward_grants DROP CONSTRAINT IF EXISTS campaign_reward_grants_nonempty;
ALTER TABLE campaign_reward_grants ADD CONSTRAINT campaign_reward_grants_nonempty CHECK(xp+ptv+money+renown_delta+corruption_delta+edge>0 OR jsonb_array_length(equipment)>0);
ALTER TABLE campaign_session_rewards ADD COLUMN IF NOT EXISTS edge integer NOT NULL DEFAULT 0 CHECK(edge BETWEEN 0 AND 8);
ALTER TABLE campaign_session_rewards DROP CONSTRAINT IF EXISTS campaign_session_rewards_check;
ALTER TABLE campaign_session_rewards ADD CONSTRAINT campaign_session_rewards_check CHECK(xp+ptv+edge>0);
