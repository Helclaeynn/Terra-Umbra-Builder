CREATE TABLE IF NOT EXISTS compendium_portrait_visibility (
  article_id text NOT NULL,
  src text NOT NULL,
  visibility text NOT NULL CHECK (visibility IN ('mj', 'public')),
  uploaded boolean NOT NULL DEFAULT false,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (article_id, src)
);
CREATE INDEX IF NOT EXISTS compendium_portrait_visibility_src_idx
  ON compendium_portrait_visibility (src);
