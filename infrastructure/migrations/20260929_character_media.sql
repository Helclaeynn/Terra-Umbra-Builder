-- Private character pictures, deduplicated per owner; revisions contain IDs only.
CREATE TABLE IF NOT EXISTS character_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sha256 text NOT NULL,
  mime_type text NOT NULL CHECK (mime_type IN ('image/jpeg','image/png','image/webp')),
  content bytea NOT NULL CHECK (octet_length(content) BETWEEN 12 AND 196608),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(owner_id,sha256)
);
CREATE INDEX IF NOT EXISTS character_media_owner ON character_media(owner_id);
