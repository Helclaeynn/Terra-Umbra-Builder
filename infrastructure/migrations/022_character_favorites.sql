ALTER TABLE characters ADD COLUMN IF NOT EXISTS favorite boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS characters_owner_favorites_idx
  ON characters(owner_id, favorite DESC, updated_at DESC)
  WHERE archived_at IS NULL;
