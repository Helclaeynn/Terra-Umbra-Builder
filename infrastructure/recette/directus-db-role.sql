-- Accès de Directus à la base du site d'essai (audit du 06/11) : son propre
-- compte, limité aux tables de contenu et à quatre colonnes des comptes (pour
-- la case « Connaît la Vérité »). Il ne voit ni les empreintes de mots de passe,
-- ni les sessions, ni les fiches, ni les campagnes.
-- Lancé à chaque mise à l'essai par deploy-recette.sh, en superutilisateur,
-- avec -v pw=<mot de passe> et -v db=<base>. Rejouable.
SELECT format('CREATE ROLE directus_cms LOGIN PASSWORD %L', :'pw')
 WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'directus_cms') \gexec
SELECT format('ALTER ROLE directus_cms PASSWORD %L', :'pw') \gexec
SELECT format('GRANT CONNECT ON DATABASE %I TO directus_cms', :'db') \gexec
GRANT USAGE, CREATE ON SCHEMA public TO directus_cms;

DO $$
DECLARE t text;
BEGIN
  -- Ses propres tables (créées au premier démarrage sous le compte du site).
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'directus\_%' LOOP
    EXECUTE format('ALTER TABLE %I OWNER TO directus_cms', t);
  END LOOP;
  -- Le contenu : lecture et écriture, jamais la structure.
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'content\_%' LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO directus_cms', t);
  END LOOP;
  FOR t IN SELECT sequencename FROM pg_sequences WHERE schemaname = 'public' AND sequencename LIKE 'content\_%' LOOP
    EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %I TO directus_cms', t);
  END LOOP;
END $$;

-- Comptes : nom, adresse et rôle en lecture, la case Vérité en écriture.
REVOKE ALL ON users FROM directus_cms;
GRANT SELECT (id, display_name, email, role, truth_access), UPDATE (truth_access) ON users TO directus_cms;
