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
      `INSERT INTO content_entry (type, scope, slug, title, body, fields, status, visibility, published_at)
       SELECT 'article', $1, slug, title, body::jsonb, fields::jsonb, 'published', visibility, now()
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

/** Remplace les articles composés par ceux de la base (ou les y verse la première fois). */
export async function syncArticlesWithContent(byId: Map<string, Article>, mjOnly: (article: Article) => boolean) {
  if (!contentRulesEnabled()) return null;
  const { rows: [count] } = await pool.query<{ n: number }>(
    "SELECT count(*)::int AS n FROM content_entry WHERE type = 'article' AND scope = $1",
    [SCOPE]
  );
  if (count.n === 0) return { seeded: await seed(byId, mjOnly), loaded: byId.size };

  const { rows } = await pool.query<{ slug: string; title: string; status: string; body: Article | null; fields: Record<string, any> }>(
    "SELECT slug, title, status, body, fields FROM content_entry WHERE type = 'article' AND scope = $1",
    [SCOPE]
  );
  const published = new Map(rows.filter((row) => row.status === "published").map((row) => [row.slug, row]));
  for (const id of [...byId.keys()]) if (!published.has(id)) byId.delete(id);
  for (const [slug, row] of published) {
    const body = row.body && typeof row.body === "object" ? row.body : ({} as Article);
    byId.set(slug, {
      ...body,
      category: body.category ?? row.fields?.category ?? "Divers",
      sections: Array.isArray(body.sections) ? body.sections : [],
      id: slug,
      title: row.title
    });
  }
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
