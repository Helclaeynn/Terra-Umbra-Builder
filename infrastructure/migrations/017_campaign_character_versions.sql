ALTER TABLE characters ADD COLUMN IF NOT EXISTS campaign_id uuid REFERENCES campaigns(id) ON DELETE SET NULL;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS source_character_id uuid REFERENCES characters(id) ON DELETE SET NULL;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS source_version integer;
ALTER TABLE characters ADD COLUMN IF NOT EXISTS source_snapshot jsonb;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS admission_rules text NOT NULL DEFAULT '' CHECK(char_length(admission_rules)<=4000);
ALTER TABLE campaign_members ADD COLUMN IF NOT EXISTS admission_status text NOT NULL DEFAULT 'none' CHECK(admission_status IN ('none','pending','changes_requested','rejected','approved'));
ALTER TABLE campaign_members ADD COLUMN IF NOT EXISTS admission_version integer NOT NULL DEFAULT 1;
ALTER TABLE campaign_members ADD COLUMN IF NOT EXISTS approved_basis jsonb;
ALTER TABLE campaign_members ADD COLUMN IF NOT EXISTS approved_snapshot jsonb;
ALTER TABLE campaign_members ADD COLUMN IF NOT EXISTS approved_at timestamptz;
CREATE INDEX IF NOT EXISTS characters_campaign_idx ON characters(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE OR REPLACE FUNCTION campaign_character_basis(d jsonb) RETURNS jsonb LANGUAGE sql IMMUTABLE AS $$
 SELECT jsonb_build_object('creation',d->'creation','attributes',d->'attributes','skills',d->'skills','talents',d->'talents','talentChoices',d->'talentChoices','disadvantages',d->'disadvantages','edge',d->'edge','edgeAttributes',d->'edgeAttributes','nature',d->'truth'->'nature','creationTruthTalents',d->'truth'->'truthTalents','creationCorruptionTalents',d->'truth'->'corruptionTalents')
$$;
CREATE TABLE IF NOT EXISTS campaign_admission_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 author_id uuid REFERENCES users(id) ON DELETE SET NULL,
 character_id uuid REFERENCES characters(id) ON DELETE SET NULL,
 kind text NOT NULL,
 message text NOT NULL CHECK(char_length(message)<=4000),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS campaign_admission_messages_member_idx ON campaign_admission_messages(campaign_id,user_id,created_at);
-- Preserve existing sheets and fork each currently attached state. Old gains are not guessed or subtracted.
DO $$ DECLARE r record; copy_id uuid; BEGIN
 FOR r IN SELECT m.campaign_id,m.user_id,ch.id,ch.name,ch.data,ch.version FROM campaign_members m JOIN characters ch ON ch.id=m.character_id AND ch.owner_id=m.user_id WHERE ch.campaign_id IS NULL LOOP
  INSERT INTO characters(owner_id,name,data,version,campaign_id,source_character_id,source_version,source_snapshot) VALUES(r.user_id,r.name,r.data,1,r.campaign_id,r.id,r.version,r.data) RETURNING id INTO copy_id;
  INSERT INTO character_revisions(character_id,revision,name,data,reason,created_by) VALUES(copy_id,1,r.name,r.data,'campaign-fork',r.user_id);
  UPDATE campaign_members SET character_id=copy_id,admission_status='pending',admission_version=admission_version+1 WHERE campaign_id=r.campaign_id AND user_id=r.user_id;
  UPDATE campaign_session_rewards e SET character_id=copy_id FROM campaign_sessions s WHERE e.session_id=s.id AND s.campaign_id=r.campaign_id AND e.character_id=r.id;
  UPDATE campaign_session_effects e SET character_id=copy_id FROM campaign_sessions s WHERE e.session_id=s.id AND s.campaign_id=r.campaign_id AND e.character_id=r.id;
  INSERT INTO campaign_admission_messages(campaign_id,user_id,character_id,kind,message) VALUES(r.campaign_id,r.user_id,copy_id,'migration','Version de campagne créée à partir de l’état existant. Les acquis antérieurs sont conservés ; le MJ doit valider cette base de départ.');
 END LOOP;
END $$;
