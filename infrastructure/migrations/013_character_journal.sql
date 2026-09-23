CREATE TABLE IF NOT EXISTS character_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  played_on date NOT NULL,
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 20000),
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS character_journal_entries_character_idx
  ON character_journal_entries (character_id, created_at DESC, id DESC);
