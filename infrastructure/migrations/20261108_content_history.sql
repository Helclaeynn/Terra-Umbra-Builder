-- Historique commun du contenu (06/11) : une modification faite hors de
-- l'éditeur du site (Directus, requête à la main) prend un numéro de version
-- et une ligne dans content_revision, comme une publication depuis le site.
-- L'éditeur du site et les imports augmentent eux-mêmes la version : la règle
-- ne fait alors rien.
-- Même forme que les versions de l'éditeur du site (un article complet).
CREATE OR REPLACE FUNCTION content_snapshot(e content_entry) RETURNS jsonb AS $$
  SELECT CASE WHEN e.type = 'article' THEN
    coalesce(e.body, '{}'::jsonb) || jsonb_build_object(
      'title', e.title, 'tags', e.tags, 'truthTags', e.tags_verite, 'secretTags', e.tags_mj,
      'audience', CASE e.visibility WHEN 'gm' THEN 'mj' WHEN 'verite' THEN 'verite' ELSE '' END)
  ELSE to_jsonb(e) - 'id' END
$$ LANGUAGE sql IMMUTABLE;

CREATE OR REPLACE FUNCTION content_entry_history() RETURNS trigger AS $$
BEGIN
  IF NEW.version <> OLD.version
     OR (NEW.title, NEW.summary, NEW.body, NEW.fields, NEW.status, NEW.visibility, NEW.tags, NEW.tags_verite, NEW.tags_mj)
        IS NOT DISTINCT FROM
        (OLD.title, OLD.summary, OLD.body, OLD.fields, OLD.status, OLD.visibility, OLD.tags, OLD.tags_verite, OLD.tags_mj) THEN
    RETURN NEW;
  END IF;
  -- Première modification : la version d'origine est gardée pour pouvoir y revenir.
  INSERT INTO content_revision (entry_id, version, snapshot, comment)
  SELECT OLD.id, OLD.version, content_snapshot(OLD), 'Version d''origine'
   WHERE NOT EXISTS (SELECT 1 FROM content_revision WHERE entry_id = OLD.id);
  NEW.version := OLD.version + 1;
  NEW.updated_at := now();
  INSERT INTO content_revision (entry_id, version, snapshot, author, comment)
  VALUES (NEW.id, NEW.version, content_snapshot(NEW),
          CASE WHEN NEW.updated_by IS DISTINCT FROM OLD.updated_by THEN NEW.updated_by END,
          CASE
            WHEN NEW.status = 'archived' AND OLD.status <> 'archived' THEN 'Archivé'
            WHEN NEW.status = 'published' AND OLD.status <> 'published' THEN 'Publié'
            WHEN NEW.status <> OLD.status THEN 'Passé en « ' || NEW.status || ' »'
            ELSE 'Modifié hors de l''éditeur du site (Directus)'
          END)
  ON CONFLICT (entry_id, version) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_entry_history ON content_entry;
CREATE TRIGGER content_entry_history BEFORE UPDATE ON content_entry
  FOR EACH ROW EXECUTE FUNCTION content_entry_history();
