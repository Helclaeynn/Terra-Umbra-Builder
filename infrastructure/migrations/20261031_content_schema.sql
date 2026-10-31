-- Contenu en base (docs/audit-game-design/schema-contenu.md).
-- Une entrée typée par article, Nature, voie, talent… ; champs propres au type
-- dans fields (JSONB) ; relations en lignes. Les identifiants actuels des
-- talents deviennent les slugs : les fiches existantes se lisent sans conversion.
-- Rien dans l'API ne lit encore ces tables.

CREATE TABLE IF NOT EXISTS content_type (
  id          text PRIMARY KEY,
  label       text NOT NULL,
  json_schema jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS content_entry (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type          text NOT NULL REFERENCES content_type(id),
  slug          text NOT NULL,
  title         text NOT NULL,
  summary       text,
  body          jsonb,
  fields        jsonb NOT NULL DEFAULT '{}',
  status        text NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','review','published','archived')),
  visibility    text NOT NULL DEFAULT 'public'
                CHECK (visibility IN ('public','players','gm')),
  legacy_ids    text[] NOT NULL DEFAULT '{}',
  version       integer NOT NULL DEFAULT 1,
  created_by    uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_by    uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  published_at  timestamptz,
  UNIQUE (type, slug)
);
CREATE INDEX IF NOT EXISTS content_entry_legacy_ids_idx ON content_entry USING gin (legacy_ids);

CREATE TABLE IF NOT EXISTS content_relation (
  from_id   uuid NOT NULL REFERENCES content_entry(id) ON DELETE CASCADE,
  to_id     uuid NOT NULL REFERENCES content_entry(id) ON DELETE RESTRICT,
  kind      text NOT NULL,
  position  integer,
  meta      jsonb NOT NULL DEFAULT '{}',
  PRIMARY KEY (from_id, to_id, kind)
);
CREATE INDEX IF NOT EXISTS content_relation_to_idx ON content_relation (to_id, kind);

CREATE TABLE IF NOT EXISTS content_revision (
  id         bigserial PRIMARY KEY,
  entry_id   uuid NOT NULL REFERENCES content_entry(id) ON DELETE CASCADE,
  version    integer NOT NULL,
  snapshot   jsonb NOT NULL,
  author     uuid REFERENCES users(id) ON DELETE SET NULL,
  comment    text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entry_id, version)
);

CREATE TABLE IF NOT EXISTS content_media (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id   uuid REFERENCES content_entry(id) ON DELETE SET NULL,
  file_path  text NOT NULL,
  alt        text,
  credit     text,
  visibility text NOT NULL DEFAULT 'public'
             CHECK (visibility IN ('public','players','gm'))
);

CREATE TABLE IF NOT EXISTS content_tag (
  entry_id uuid NOT NULL REFERENCES content_entry(id) ON DELETE CASCADE,
  tag      text NOT NULL,
  PRIMARY KEY (entry_id, tag)
);

INSERT INTO content_type (id, label) VALUES
  ('nature', 'Nature'),
  ('couche', 'Couche de Nature'),
  ('voie', 'Voie'),
  ('talent', 'Talent de Vérité'),
  ('rupture', 'Rupture'),
  ('source_corruption', 'Source de Corruption'),
  ('faveur_maisonnee', 'Faveur de maisonnée'),
  ('talent_realite', 'Talent de Réalité'),
  ('objet', 'Objet de Vérité'),
  ('equipement', 'Équipement'),
  ('augmentation', 'Augmentation'),
  ('glossaire', 'Glossaire'),
  ('article', 'Article'),
  ('regle', 'Règle'),
  ('pnj', 'PNJ'),
  ('creature', 'Créature'),
  ('lieu', 'Lieu'),
  ('organisation', 'Organisation')
ON CONFLICT (id) DO NOTHING;
