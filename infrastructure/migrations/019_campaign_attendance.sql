CREATE TABLE IF NOT EXISTS campaign_session_attendance (
  session_id uuid NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
  campaign_id uuid NOT NULL,
  user_id uuid NOT NULL,
  response text NOT NULL CHECK(response IN ('present','uncertain','absent')),
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(session_id,user_id),
  FOREIGN KEY(campaign_id,user_id) REFERENCES campaign_members(campaign_id,user_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS campaign_attendance_member_idx ON campaign_session_attendance(campaign_id,user_id);
ALTER TABLE campaign_sessions ADD COLUMN IF NOT EXISTS creation_request_id uuid;
CREATE UNIQUE INDEX IF NOT EXISTS campaign_sessions_creation_request_idx ON campaign_sessions(campaign_id,creation_request_id);
