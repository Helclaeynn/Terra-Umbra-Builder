CREATE TABLE IF NOT EXISTS campaign_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  played_on date,
  status text NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','played')),
  preparation text NOT NULL DEFAULT '' CHECK(char_length(preparation)<=20000),
  report text NOT NULL DEFAULT '' CHECK(char_length(report)<=20000),
  published boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_sessions_campaign_idx ON campaign_sessions(campaign_id,created_at DESC,id);
CREATE TABLE IF NOT EXISTS campaign_session_rewards (
  session_id uuid NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  character_name text NOT NULL,
  xp integer NOT NULL CHECK(xp>=0 AND xp<=100000),
  ptv integer NOT NULL CHECK(ptv>=0 AND ptv<=100000),
  awarded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(session_id,character_id),
  CHECK(xp+ptv>0)
);
