-- Réglages Directus des liens des tables de contenu. Les clés étrangères
-- existent déjà dans la base ; l'API de Directus refuse de compléter un lien
-- existant, on écrit donc ses réglages directement (rejouable).
-- Lancé par deploy-recette.sh une fois Directus démarré, avant directus-setup.mjs.
WITH wanted (many_collection, many_field, one_collection, one_field) AS (VALUES
  ('content_entry',    'type',     'content_type',  NULL),
  ('content_relation', 'from_id',  'content_entry', 'liens_sortants'),
  ('content_relation', 'to_id',    'content_entry', 'liens_entrants'),
  ('content_revision', 'entry_id', 'content_entry', 'revisions'),
  ('content_media',    'entry_id', 'content_entry', NULL),
  ('content_tag',      'entry_id', 'content_entry', NULL)
),
updated AS (
  UPDATE directus_relations r
     SET one_collection = w.one_collection, one_field = w.one_field, one_deselect_action = 'nullify'
    FROM wanted w
   WHERE r.many_collection = w.many_collection AND r.many_field = w.many_field
  RETURNING r.many_collection, r.many_field
)
INSERT INTO directus_relations (many_collection, many_field, one_collection, one_field, one_deselect_action)
SELECT w.many_collection, w.many_field, w.one_collection, w.one_field, 'nullify'
  FROM wanted w
 WHERE NOT EXISTS (
   SELECT 1 FROM directus_relations r WHERE r.many_collection = w.many_collection AND r.many_field = w.many_field
 );
