-- Types de contenu des règles de création (infrastructure/content/build-creation.mjs).
INSERT INTO content_type (id, label) VALUES
  ('style', 'Style de Réalité'),
  ('desavantage', 'Désavantage')
ON CONFLICT (id) DO NOTHING;
