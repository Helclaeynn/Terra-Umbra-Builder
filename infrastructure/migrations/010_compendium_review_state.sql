CREATE TABLE IF NOT EXISTS compendium_review_state (
  article_id text PRIMARY KEY,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  review_status text NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending', 'approved', 'rework')),
  review_note text,
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS compendium_review_state_status_idx
  ON compendium_review_state(review_status, first_seen_at DESC);

CREATE INDEX IF NOT EXISTS compendium_review_state_reviewed_idx
  ON compendium_review_state(reviewed_at DESC)
  WHERE reviewed_at IS NOT NULL;
