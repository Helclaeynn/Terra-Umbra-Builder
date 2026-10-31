// Articles du compendium dans les tables de contenu (étape 7, Directus).
// Actif seulement avec CONTENT_SOURCE=db (site d'essai).
//
// Au premier démarrage, les articles tels que le compendium les compose
// aujourd'hui (corpus figé, corrections, éditions et articles créés) sont
// versés une fois dans content_entry (type « article », portée « compendium »).
// Ensuite, ce sont eux qui font foi : un article publié dans Directus apparaît,
// un brouillon, un article en relecture ou archivé disparaît du site.
import { pool } from "./db.js";
import { contentRulesEnabled } from "./rules/content-rules.js";

type Article = Record<string, any> & { id: string };

const SCOPE = "compendium";
const BATCH = 250;

async function seed(byId: Map<string, Article>, mjOnly: (article: Article) => boolean) {
  const articles = [...byId.values()];
  for (let i = 0; i < articles.length; i += BATCH) {
    const batch = articles.slice(i, i + BATCH);
    await pool.query(
      `INSERT INTO content_entry (type, scope, slug, title, body, fields, status, visibility, tags, tags_mj, published_at)
       SELECT 'article', $1, slug, title, body::jsonb, fields::jsonb, 'published', visibility,
              coalesce(body::jsonb->'tags', '[]'::jsonb), coalesce(body::jsonb->'secretTags', '[]'::jsonb), now()
         FROM unnest($2::text[], $3::text[], $4::text[], $5::text[], $6::text[]) AS a(slug, title, body, fields, visibility)
       ON CONFLICT (type, scope, slug) DO NOTHING`,
      [
        SCOPE,
        batch.map((a) => a.id),
        batch.map((a) => String(a.title ?? a.id)),
        batch.map((a) => JSON.stringify(a)),
        batch.map((a) => JSON.stringify({
          category: a.category ?? null,
          dataset: a.dataset ?? null,
          group: a.navigation?.group ?? null,
          subgroup: a.navigation?.subgroup ?? null,
          tags: a.tags ?? []
        })),
        batch.map((a) => (mjOnly(a) ? "gm" : "public"))
      ]
    );
  }
  return articles.length;
}

type ContentRow = {
  slug: string; title: string; status: string; visibility: string; body: Article | null; fields: Record<string, any>;
  tags: string[]; tags_verite: string[]; tags_mj: string[];
};
const COLUMNS = "slug, title, status, visibility, body, fields, tags, tags_verite, tags_mj";
type Queryable = { query: typeof pool.query };

// Les colonnes réglées dans Directus ou l'éditeur du site font foi : visibilité
// de l'article et étiquettes par niveau (public, Vérité, MJ). Les sections gardent la leur.
function rowToArticle(row: ContentRow): Article {
  const body = row.body && typeof row.body === "object" ? row.body : ({} as Article);
  const article: Article = {
    ...body,
    category: body.category ?? row.fields?.category ?? "Divers",
    sections: Array.isArray(body.sections) ? body.sections : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    truthTags: Array.isArray(row.tags_verite) ? row.tags_verite : [],
    secretTags: Array.isArray(row.tags_mj) ? row.tags_mj : [],
    id: row.slug,
    title: row.title
  };
  if (row.visibility === "gm") article.audience = "mj";
  else if (row.visibility === "verite") article.audience = "verite";
  else delete article.audience;
  return article;
}

function visibilityOf(article: Article): string {
  return article.audience === "mj" ? "gm" : article.audience === "verite" ? "verite" : "public";
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function storedBody(article: Article, previous: Article | null): Article {
  const body: Article = { ...article };
  for (const key of Object.keys(body)) if (key.startsWith("__")) delete body[key];
  // L'éditeur ne touche pas au classement du sommaire : on le garde.
  for (const key of ["navigation", "manufacturer"]) {
    if (previous?.[key] !== undefined) body[key] = previous[key];
  }
  return body;
}

/** Article de la base pour l'éditeur du site, publié ou non (sauf archivé). */
export async function contentArticle(slug: string): Promise<Article | null> {
  const { rows: [row] } = await pool.query<ContentRow>(
    `SELECT ${COLUMNS} FROM content_entry
      WHERE type = 'article' AND scope = $1 AND slug = $2 AND status <> 'archived'`,
    [SCOPE, slug]
  );
  return row ? rowToArticle(row) : null;
}

export async function contentArticleExists(slug: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    "SELECT 1 FROM content_entry WHERE type = 'article' AND scope = $1 AND slug = $2", [SCOPE, slug]
  );
  return Boolean(rowCount);
}

/** Nouvelle page créée dans l'éditeur du site : un brouillon, invisible jusqu'à publication. */
export async function createContentArticle(article: Article, userId: string) {
  await pool.query(
    `INSERT INTO content_entry (type, scope, slug, title, body, fields, status, visibility, tags, created_by, updated_by)
     VALUES ('article', $1, $2, $3, $4::jsonb, $5::jsonb, 'draft', $6, $7::jsonb, $8, $8)`,
    [SCOPE, article.id, String(article.title ?? article.id), JSON.stringify(storedBody(article, null)),
      JSON.stringify({ category: article.category ?? null, dataset: article.dataset ?? null }),
      visibilityOf(article), JSON.stringify(strings(article.tags)), userId]
  );
}

/** Publication depuis l'éditeur du site : la base est mise à jour, avec une révision. */
export async function publishContentArticle(db: Queryable, article: Article, userId: string) {
  const { rows: [current] } = await db.query<ContentRow & { id: string; version: number }>(
    `SELECT id, version, ${COLUMNS} FROM content_entry
      WHERE type = 'article' AND scope = $1 AND slug = $2 FOR UPDATE`,
    [SCOPE, article.id]
  );
  if (!current) throw new Error(`Article ${article.id} absent de la base de contenu`);
  // Première modification : on garde la version d'origine pour pouvoir y revenir.
  await db.query(
    `INSERT INTO content_revision (entry_id, version, snapshot, comment)
     SELECT $1, $2, $3::jsonb, 'Version d''origine'
      WHERE NOT EXISTS (SELECT 1 FROM content_revision WHERE entry_id = $1)`,
    [current.id, current.version, JSON.stringify(storedBody(rowToArticle(current), current.body))]
  );
  const body = storedBody(article, current.body);
  const { rows: [saved] } = await db.query<{ version: number }>(
    `UPDATE content_entry
        SET title = $2, body = $3::jsonb, fields = fields || $4::jsonb, status = 'published',
            visibility = $5, tags = $6::jsonb, tags_verite = $7::jsonb, tags_mj = $8::jsonb,
            published_at = coalesce(published_at, now()), version = version + 1,
            updated_by = $9, updated_at = now()
      WHERE id = $1
      RETURNING version`,
    [current.id, String(article.title ?? article.id), JSON.stringify(body),
      JSON.stringify({ category: article.category ?? null }), visibilityOf(article),
      JSON.stringify(strings(article.tags)), JSON.stringify(strings(article.truthTags)),
      JSON.stringify(strings(article.secretTags)), userId]
  );
  await db.query(
    `INSERT INTO content_revision (entry_id, version, snapshot, author, comment)
     VALUES ($1, $2, $3::jsonb, $4, 'Publié depuis l''éditeur du site')`,
    [current.id, saved.version, JSON.stringify(body), userId]
  );
}

/** Suppression depuis l'éditeur du site : l'article est archivé, jamais effacé. */
export async function archiveContentArticle(slug: string, userId: string) {
  await pool.query(
    `UPDATE content_entry SET status = 'archived', updated_by = $3, updated_at = now()
      WHERE type = 'article' AND scope = $1 AND slug = $2`,
    [SCOPE, slug, userId]
  );
}

/** Remplace les articles composés par ceux de la base (ou les y verse la première fois). */
export async function syncArticlesWithContent(byId: Map<string, Article>, mjOnly: (article: Article) => boolean) {
  if (!contentRulesEnabled()) return null;
  const { rows: [count] } = await pool.query<{ n: number }>(
    "SELECT count(*)::int AS n FROM content_entry WHERE type = 'article' AND scope = $1",
    [SCOPE]
  );
  if (count.n === 0) return { seeded: await seed(byId, mjOnly), loaded: byId.size };

  const { rows } = await pool.query<ContentRow>(
    `SELECT ${COLUMNS} FROM content_entry WHERE type = 'article' AND scope = $1`,
    [SCOPE]
  );
  const published = new Map(rows.filter((row) => row.status === "published").map((row) => [row.slug, row]));
  for (const id of [...byId.keys()]) if (!published.has(id)) byId.delete(id);
  for (const [slug, row] of published) byId.set(slug, rowToArticle(row));
  return { seeded: 0, loaded: published.size };
}

/**
 * Surveille les tables de contenu (dernière modification et nombre d'entrées)
 * et prévient quand elles changent, pour reconstruire le compendium et les
 * règles sans redémarrer. Directus met à jour `updated_at` à chaque écriture.
 */
export function startContentWatch(onChange: () => void, everyMs = 30_000) {
  if (!contentRulesEnabled()) return;
  let last: string | null = null;
  const tick = async () => {
    try {
      const { rows: [row] } = await pool.query<{ sig: string }>(
        "SELECT coalesce(max(updated_at)::text, '') || ':' || count(*)::text AS sig FROM content_entry"
      );
      if (last !== null && row.sig !== last) onChange();
      last = row.sig;
    } catch {
      // Base momentanément indisponible : on retentera au prochain passage.
    }
  };
  void tick();
  setInterval(tick, everyMs).unref();
}

/** Versions publiées d'un article (les plus récentes d'abord), pour l'historique de l'éditeur. */
export async function contentArticleRevisions(slug: string) {
  const { rows } = await pool.query<{ version: number; createdAt: string; author: string | null; comment: string | null }>(
    `SELECT r.version, r.created_at::text AS "createdAt", u.display_name AS author, r.comment
       FROM content_revision r
       JOIN content_entry e ON e.id = r.entry_id
       LEFT JOIN users u ON u.id = r.author
      WHERE e.type = 'article' AND e.scope = $1 AND e.slug = $2
      ORDER BY r.version DESC
      LIMIT 100`,
    [SCOPE, slug]
  );
  return rows;
}

export async function contentArticleRevision(slug: string, version: number): Promise<Article | null> {
  const { rows: [row] } = await pool.query<{ snapshot: Article }>(
    `SELECT r.snapshot FROM content_revision r JOIN content_entry e ON e.id = r.entry_id
      WHERE e.type = 'article' AND e.scope = $1 AND e.slug = $2 AND r.version = $3`,
    [SCOPE, slug, version]
  );
  return row ? { ...row.snapshot, id: slug } : null;
}
