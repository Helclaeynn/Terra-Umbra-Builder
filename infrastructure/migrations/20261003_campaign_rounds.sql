CREATE TABLE IF NOT EXISTS campaign_combat_states (
 campaign_id uuid PRIMARY KEY REFERENCES campaigns(id) ON DELETE CASCADE,
 active boolean NOT NULL DEFAULT false,
 mode text NOT NULL DEFAULT 'manual' CHECK (mode IN ('manual','automatic')),
 round integer NOT NULL DEFAULT 1 CHECK (round > 0),
 turns jsonb NOT NULL DEFAULT '{}'::jsonb,
 version integer NOT NULL DEFAULT 0
);
