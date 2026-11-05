-- Table en jeu : notes de scène privées du MJ, et réactions des participants sur le journal.
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS live_notes text NOT NULL DEFAULT '';

-- Une réaction vise un événement du journal (campaign_live_events ou character_play_events) :
-- pas de clé étrangère, l'appartenance à la campagne est vérifiée par l'API.
CREATE TABLE IF NOT EXISTS campaign_live_reactions (
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  event_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('bravo','aie','tension')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, user_id, kind)
);
CREATE INDEX IF NOT EXISTS campaign_live_reactions_campaign ON campaign_live_reactions(campaign_id);
