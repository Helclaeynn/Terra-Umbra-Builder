ALTER TABLE campaign_combat_states ADD COLUMN IF NOT EXISTS participants jsonb NOT NULL DEFAULT '{}'::jsonb;
