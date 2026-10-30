CREATE TABLE IF NOT EXISTS compendium_legacy_articles (
  article_id TEXT PRIMARY KEY,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS compendium_legacy_articles_archived_at_idx
  ON compendium_legacy_articles (archived_at DESC);
