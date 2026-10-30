CREATE TABLE IF NOT EXISTS character_sheet_readers (
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  reader_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (character_id, reader_id)
);
CREATE INDEX IF NOT EXISTS character_sheet_readers_reader_idx ON character_sheet_readers (reader_id);
