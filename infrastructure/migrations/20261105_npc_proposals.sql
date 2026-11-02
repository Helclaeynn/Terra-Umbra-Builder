-- PNJ proposés par un joueur depuis le Builder (Contact fiable, Contact de
-- renom, contacts mineurs). Le PNJ suit les règles de création des PNJ ; il
-- n'entre au Compendium qu'après validation par un administrateur, qui le
-- publie depuis l'éditeur (article_id). Rien n'est effacé : un refus garde
-- la proposition et sa raison.
CREATE TABLE IF NOT EXISTS npc_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposed_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id uuid REFERENCES characters(id) ON DELETE SET NULL,
  max_tier text NOT NULL,
  npc jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  article_id text,
  review_note text NOT NULL DEFAULT '',
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS npc_proposals_status ON npc_proposals (status, created_at);
CREATE INDEX IF NOT EXISTS npc_proposals_by ON npc_proposals (proposed_by, created_at);
