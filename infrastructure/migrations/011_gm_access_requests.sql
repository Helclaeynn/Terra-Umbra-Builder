CREATE TABLE IF NOT EXISTS gm_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment text NOT NULL DEFAULT '' CHECK (char_length(comment) <= 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  decided_by uuid REFERENCES users(id) ON DELETE SET NULL,
  CHECK ((status = 'pending' AND decided_at IS NULL) OR (status <> 'pending' AND decided_at IS NOT NULL))
);

CREATE UNIQUE INDEX IF NOT EXISTS gm_access_requests_pending_user_uq
  ON gm_access_requests(user_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS gm_access_requests_user_date_idx
  ON gm_access_requests(user_id, created_at DESC);
