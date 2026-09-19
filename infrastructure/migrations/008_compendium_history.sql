CREATE TABLE IF NOT EXISTS compendium_history (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  view_count integer NOT NULL DEFAULT 1 CHECK (view_count >= 1),
  PRIMARY KEY (user_id, article_id)
);

CREATE INDEX IF NOT EXISTS compendium_history_user_viewed_idx
  ON compendium_history(user_id, viewed_at DESC);
