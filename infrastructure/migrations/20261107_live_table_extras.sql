-- Table en jeu : notes de scène privées du MJ.
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS live_notes text NOT NULL DEFAULT '';
