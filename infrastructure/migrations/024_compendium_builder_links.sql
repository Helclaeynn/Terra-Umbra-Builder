CREATE TABLE IF NOT EXISTS compendium_builder_links (
  family text NOT NULL,
  builder_key text NOT NULL,
  article_id text NOT NULL,
  linked_by uuid REFERENCES users(id) ON DELETE SET NULL,
  linked_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (family, builder_key)
);
CREATE INDEX IF NOT EXISTS compendium_builder_links_article_idx
  ON compendium_builder_links(article_id);
