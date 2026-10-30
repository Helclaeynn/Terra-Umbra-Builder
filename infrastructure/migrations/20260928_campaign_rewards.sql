-- Additive ledger for explicit GM awards, independent of calendar sessions.
-- Existing campaign copies, sources and session rewards are not rewritten.
BEGIN;
CREATE TABLE IF NOT EXISTS campaign_reward_batches (
  id uuid PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 500),
  request_payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_reward_batches_campaign_date_idx
  ON campaign_reward_batches(campaign_id, created_at DESC, id);
CREATE TABLE IF NOT EXISTS campaign_reward_grants (
  batch_id uuid NOT NULL REFERENCES campaign_reward_batches(id) ON DELETE CASCADE,
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  character_name text NOT NULL,
  xp integer NOT NULL CHECK (xp BETWEEN 0 AND 100000),
  ptv integer NOT NULL CHECK (ptv BETWEEN 0 AND 100000),
  money bigint NOT NULL CHECK (money BETWEEN 0 AND 1000000000),
  renown_delta integer NOT NULL CHECK (renown_delta BETWEEN 0 AND 5),
  corruption_delta integer NOT NULL CHECK (corruption_delta BETWEEN 0 AND 100),
  corruption_source text NOT NULL,
  before_state jsonb NOT NULL,
  after_state jsonb NOT NULL,
  revision integer NOT NULL CHECK (revision > 0),
  PRIMARY KEY (batch_id, character_id),
  CHECK (xp + ptv + money + renown_delta + corruption_delta > 0)
);
CREATE INDEX IF NOT EXISTS campaign_reward_grants_character_idx
  ON campaign_reward_grants(character_id, batch_id);
COMMIT;
