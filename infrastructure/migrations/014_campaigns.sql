CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description)<=2000),
  gm_notes text NOT NULL DEFAULT '' CHECK (char_length(gm_notes)<=20000),
  version integer NOT NULL DEFAULT 1,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaigns_owner_idx ON campaigns(owner_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS campaign_members (
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','accepted')),
  character_id uuid REFERENCES characters(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (campaign_id,user_id),
  CHECK (status='accepted' OR character_id IS NULL)
);
CREATE INDEX IF NOT EXISTS campaign_members_user_idx ON campaign_members(user_id,campaign_id);
CREATE INDEX IF NOT EXISTS campaign_members_character_idx ON campaign_members(character_id) WHERE character_id IS NOT NULL;
