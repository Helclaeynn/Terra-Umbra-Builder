-- Directus exige une clé primaire simple par table. Les liens et les étiquettes
-- avaient une clé composée : ils reçoivent un identifiant, et l'ancienne clé
-- devient une contrainte d'unicité (même garantie qu'avant).
ALTER TABLE content_relation DROP CONSTRAINT IF EXISTS content_relation_pkey;
ALTER TABLE content_relation ADD COLUMN IF NOT EXISTS id bigserial;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_relation_pkey') THEN
    ALTER TABLE content_relation ADD CONSTRAINT content_relation_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_relation_from_to_kind_key') THEN
    ALTER TABLE content_relation ADD CONSTRAINT content_relation_from_to_kind_key UNIQUE (from_id, to_id, kind);
  END IF;
END $$;

ALTER TABLE content_tag DROP CONSTRAINT IF EXISTS content_tag_pkey;
ALTER TABLE content_tag ADD COLUMN IF NOT EXISTS id bigserial;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_tag_pkey') THEN
    ALTER TABLE content_tag ADD CONSTRAINT content_tag_pkey PRIMARY KEY (id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_tag_entry_tag_key') THEN
    ALTER TABLE content_tag ADD CONSTRAINT content_tag_entry_tag_key UNIQUE (entry_id, tag);
  END IF;
END $$;
