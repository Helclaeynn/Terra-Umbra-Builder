ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

CREATE INDEX IF NOT EXISTS characters_owner_active_idx
  ON characters(owner_id, updated_at DESC)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS character_revisions (
  id bigserial PRIMARY KEY,
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  revision integer NOT NULL,
  name text NOT NULL,
  data jsonb NOT NULL,
  reason text NOT NULL DEFAULT 'saved',
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(character_id, revision)
);

CREATE INDEX IF NOT EXISTS character_revisions_character_idx
  ON character_revisions(character_id, revision DESC);

INSERT INTO character_revisions
  (character_id, revision, name, data, reason, created_by, created_at)
SELECT
  c.id,
  c.version,
  c.name,
  c.data,
  'imported',
  c.owner_id,
  c.updated_at
FROM characters c
WHERE NOT EXISTS (
  SELECT 1
  FROM character_revisions r
  WHERE r.character_id = c.id
);
