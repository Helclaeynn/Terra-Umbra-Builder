CREATE TABLE IF NOT EXISTS compendium_favorites (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, article_id)
);

CREATE INDEX IF NOT EXISTS compendium_favorites_user_created_idx
  ON compendium_favorites(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS compendium_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS compendium_collections_owner_idx
  ON compendium_collections(owner_id, updated_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS compendium_collections_owner_name_uq
  ON compendium_collections(owner_id, lower(name));

CREATE TABLE IF NOT EXISTS compendium_collection_items (
  collection_id uuid NOT NULL REFERENCES compendium_collections(id) ON DELETE CASCADE,
  article_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (collection_id, article_id)
);

CREATE INDEX IF NOT EXISTS compendium_collection_items_collection_created_idx
  ON compendium_collection_items(collection_id, created_at DESC);
