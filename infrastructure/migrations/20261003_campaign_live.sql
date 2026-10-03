BEGIN;
CREATE TABLE IF NOT EXISTS campaign_live_combatants (
 id uuid PRIMARY KEY,
 campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
 source_kind text NOT NULL CHECK(source_kind IN ('npc','creature')),
 source_id uuid NOT NULL,
 name text NOT NULL,
 data jsonb NOT NULL,
 hp integer NOT NULL,
 pv_max integer NOT NULL CHECK(pv_max>0),
 death integer NOT NULL,
 initiative_bonus integer NOT NULL,
 initiative integer,
 pa integer NOT NULL DEFAULT 0,
 pa_per_round integer NOT NULL DEFAULT 0,
 round integer NOT NULL DEFAULT 1,
 visible boolean NOT NULL DEFAULT false,
 version integer NOT NULL DEFAULT 1,
 removed boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_live_combatants_campaign ON campaign_live_combatants(campaign_id,removed);
CREATE TABLE IF NOT EXISTS campaign_live_events (
 id uuid PRIMARY KEY,
 campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
 created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 kind text NOT NULL,
 payload jsonb NOT NULL,
 request_payload jsonb NOT NULL,
 public boolean NOT NULL DEFAULT false,
 image bytea,
 mime text,
 withdrawn boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_live_events_campaign ON campaign_live_events(campaign_id,created_at DESC);
COMMIT;
