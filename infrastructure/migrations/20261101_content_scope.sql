-- Les identifiants de talent sont uniques par Nature, pas globalement : le
-- Garou et le Vampire partagent sept identifiants homonymes (décision Q2 du
-- lot 01). Une entrée est donc unique par (type, scope, slug), où scope est la
-- Nature ou le catalogue d'origine ('' pour les contenus sans portée).
ALTER TABLE content_entry ADD COLUMN IF NOT EXISTS scope text NOT NULL DEFAULT '';
UPDATE content_entry SET scope = fields->>'nature' WHERE scope = '' AND fields ? 'nature';
ALTER TABLE content_entry DROP CONSTRAINT IF EXISTS content_entry_type_slug_key;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_entry_type_scope_slug_key') THEN
    ALTER TABLE content_entry ADD CONSTRAINT content_entry_type_scope_slug_key UNIQUE (type, scope, slug);
  END IF;
END $$;
