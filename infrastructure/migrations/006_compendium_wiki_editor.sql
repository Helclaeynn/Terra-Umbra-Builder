CREATE TABLE IF NOT EXISTS compendium_article_edits (
  article_id text PRIMARY KEY,
  base_hash char(64) NOT NULL,
  draft jsonb,
  draft_by uuid REFERENCES users(id) ON DELETE SET NULL,
  draft_updated_at timestamptz,
  published jsonb,
  published_by uuid REFERENCES users(id) ON DELETE SET NULL,
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS compendium_article_edits_draft_idx
  ON compendium_article_edits(draft_updated_at DESC)
  WHERE draft IS NOT NULL;

CREATE INDEX IF NOT EXISTS compendium_article_edits_published_idx
  ON compendium_article_edits(published_at DESC)
  WHERE published IS NOT NULL;

CREATE TABLE IF NOT EXISTS compendium_article_edit_revisions (
  id bigserial PRIMARY KEY,
  article_id text NOT NULL,
  base_hash char(64) NOT NULL,
  document jsonb NOT NULL,
  published_by uuid REFERENCES users(id) ON DELETE SET NULL,
  published_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS compendium_article_edit_revisions_article_idx
  ON compendium_article_edit_revisions(article_id, published_at DESC);
