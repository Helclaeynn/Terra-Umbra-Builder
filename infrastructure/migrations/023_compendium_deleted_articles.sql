CREATE TABLE IF NOT EXISTS compendium_deleted_articles (
  article_id text PRIMARY KEY,
  deleted_by uuid REFERENCES users(id) ON DELETE SET NULL,
  deleted_at timestamptz NOT NULL DEFAULT now()
);
