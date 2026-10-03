BEGIN;
CREATE TABLE IF NOT EXISTS character_play_states (
 character_id uuid PRIMARY KEY REFERENCES characters(id) ON DELETE CASCADE,
 version integer NOT NULL DEFAULT 1,
 state jsonb NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS character_play_events (
 id uuid PRIMARY KEY,
 character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
 campaign_id uuid REFERENCES campaigns(id) ON DELETE SET NULL,
 created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 kind text NOT NULL,
 payload jsonb NOT NULL,
 request_payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE character_play_events DROP CONSTRAINT IF EXISTS character_play_events_created_by_fkey;
ALTER TABLE character_play_events ADD CONSTRAINT character_play_events_created_by_fkey FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS character_play_events_character ON character_play_events(character_id,created_at DESC);
CREATE INDEX IF NOT EXISTS character_play_events_campaign ON character_play_events(campaign_id,created_at DESC);
ALTER TABLE campaign_reward_grants ADD COLUMN IF NOT EXISTS equipment jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE campaign_reward_grants DROP CONSTRAINT IF EXISTS campaign_reward_grants_check;
ALTER TABLE campaign_reward_grants DROP CONSTRAINT IF EXISTS campaign_reward_grants_nonempty;
ALTER TABLE campaign_reward_grants ADD CONSTRAINT campaign_reward_grants_nonempty
 CHECK (xp + ptv + money + renown_delta + corruption_delta > 0 OR jsonb_array_length(equipment)>0);
COMMIT;
