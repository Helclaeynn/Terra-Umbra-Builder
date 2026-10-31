-- Trois niveaux de visibilité (décision de l'auteur du 01/11) : public,
-- Vérité (joueurs qui connaissent la Vérité) et MJ. Le niveau « joueurs
-- connectés » du schéma d'origine n'est pas retenu.
ALTER TABLE content_entry DROP CONSTRAINT IF EXISTS content_entry_visibility_check;
UPDATE content_entry SET visibility = 'verite' WHERE visibility = 'players';
ALTER TABLE content_entry ADD CONSTRAINT content_entry_visibility_check
  CHECK (visibility IN ('public', 'verite', 'gm'));
ALTER TABLE content_media DROP CONSTRAINT IF EXISTS content_media_visibility_check;
UPDATE content_media SET visibility = 'verite' WHERE visibility = 'players';
ALTER TABLE content_media ADD CONSTRAINT content_media_visibility_check
  CHECK (visibility IN ('public', 'verite', 'gm'));

-- Étiquettes par niveau, éditables dans Directus (listes JSON de mots).
ALTER TABLE content_entry ADD COLUMN IF NOT EXISTS tags jsonb NOT NULL DEFAULT '[]';
ALTER TABLE content_entry ADD COLUMN IF NOT EXISTS tags_verite jsonb NOT NULL DEFAULT '[]';
ALTER TABLE content_entry ADD COLUMN IF NOT EXISTS tags_mj jsonb NOT NULL DEFAULT '[]';
-- Articles déjà versés : leurs étiquettes publiques et MJ viennent du corps.
UPDATE content_entry
   SET tags = coalesce(body->'tags', '[]'::jsonb),
       tags_mj = coalesce(body->'secretTags', '[]'::jsonb)
 WHERE type = 'article' AND tags = '[]'::jsonb AND tags_mj = '[]'::jsonb;

-- Qui connaît la Vérité. Vrai par défaut : rien ne change pour les comptes
-- existants ; l'auteur décoche les joueurs d'une campagne profane.
ALTER TABLE users ADD COLUMN IF NOT EXISTS truth_access boolean NOT NULL DEFAULT true;
