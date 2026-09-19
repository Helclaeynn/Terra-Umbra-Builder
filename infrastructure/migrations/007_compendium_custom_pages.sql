CREATE TABLE IF NOT EXISTS compendium_custom_articles (
  article_id text PRIMARY KEY,
  base_document jsonb NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE INDEX IF NOT EXISTS compendium_custom_articles_published_idx
  ON compendium_custom_articles(is_published, updated_at DESC);
