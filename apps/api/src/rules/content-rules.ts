// Règles de Vérité lues dans les tables de contenu (étape 7 du plan,
// docs/audit-game-design/schema-contenu.md). Actif seulement si
// CONTENT_SOURCE=db (site d'essai) ; sinon le paquet de règles reste celui des
// catalogues TypeScript.
//
// Chaque talent garde son identifiant, son groupe et ses contrôles d'achat
// propres à sa Nature. On y ajoute :
//   - `voie` : la voie à paliers, son palier, sa porte et sa place ;
//   - `card` : la carte courte du lot ;
//   - `cost` : le coût du palier (décision 5) ;
//   - `aliasOf` : pour un ancien talent fondu dans un autre de la même Nature
//     (droits acquis, décision 20 : il reste connu et payé, plus achetable).
// Les talents rétablis par les lots (sans identifiant au catalogue) sont
// ajoutés, avec le groupe d'un talent de la même voie pour garder leur visibilité.
import { pool } from "../db.js";

type Row = {
  scope: string;
  slug: string;
  title: string;
  legacy_ids: string[];
  fields: Record<string, any>;
  voie_slug: string | null;
  voie_title: string | null;
  voie_fields: Record<string, any> | null;
  position: number | null;
  couche_title: string | null;
};

// Même forme que TruthTalentVoie (truth/types.ts), partagée avec le front.
export type TalentVoie = {
  id: string;
  title: string;
  couche: string | null;
  forme: string | null;
  palier: string | null;
  porte: string | null;
  position: number | null;
};

const PAID = new Set(["entree", "I", "II", "III"]);

export function contentRulesEnabled() {
  return process.env.CONTENT_SOURCE === "db";
}

async function loadTalents(): Promise<Row[]> {
  const { rows } = await pool.query<Row>(`
    SELECT DISTINCT ON (t.scope, t.slug)
           t.scope, t.slug, t.title, t.legacy_ids, t.fields,
           v.slug AS voie_slug, v.title AS voie_title, v.fields AS voie_fields,
           r.position, c.title AS couche_title
      FROM content_entry t
      LEFT JOIN content_relation r ON r.from_id = t.id AND r.kind = 'appartient_a'
      LEFT JOIN content_entry v ON v.id = r.to_id AND v.type = 'voie'
      LEFT JOIN content_relation rc ON rc.from_id = v.id AND rc.kind = 'appartient_a'
      LEFT JOIN content_entry c ON c.id = rc.to_id AND c.type = 'couche'
     WHERE t.type = 'talent' AND t.status <> 'archived'
     ORDER BY t.scope, t.slug, v.slug NULLS LAST`);
  return rows;
}

function voieOf(row: Row): TalentVoie | undefined {
  if (!row.voie_slug) return undefined;
  return {
    id: `${row.scope}:${row.voie_slug}`,
    title: row.voie_title ?? row.voie_slug,
    couche: row.couche_title,
    forme: row.voie_fields?.forme ?? null,
    palier: row.fields.palier ?? null,
    porte: row.fields.porte ?? null,
    position: row.position
  };
}

/** Les Sangs vifs sont communs au Garou et au Khinae (décision 10). */
const SHARED_SCOPES: Record<string, string[]> = { garou: ["sangs_vifs"], khinae: ["sangs_vifs"] };

export async function applyContentRules(truth: any) {
  if (!contentRulesEnabled()) return truth;
  const rows = await loadTalents();
  const byScope = new Map<string, Map<string, Row>>();
  const legacy = new Map<string, Row>();
  for (const row of rows) {
    if (!byScope.has(row.scope)) byScope.set(row.scope, new Map());
    byScope.get(row.scope)!.set(row.slug, row);
    for (const id of row.legacy_ids ?? []) legacy.set(`${row.scope}:${id}`, row);
  }

  const overlay = (scope: string, talents: any[]) => {
    const scopes = [scope, ...(SHARED_SCOPES[scope] ?? [])];
    const seen = new Set<string>();
    const out = talents.map((talent) => {
      let row: Row | undefined;
      for (const s of scopes) row ??= byScope.get(s)?.get(talent.id) ?? legacy.get(`${s}:${talent.id}`);
      if (!row) return talent;
      seen.add(`${row.scope}:${row.slug}`);
      const voie = voieOf(row);
      const next = { ...talent, voie, card: row.fields.texte_court ?? undefined };
      // Fusion dans la même Nature : l'ancien identifiant reste connu, au coût payé.
      if (row.scope === scope && row.slug !== talent.id) return { ...next, aliasOf: row.slug };
      if (PAID.has(String(row.fields.palier)) && Number.isFinite(row.fields.cout)) next.cost = row.fields.cout;
      return next;
    });
    // Talents rétablis par les lots, absents du catalogue.
    for (const row of byScope.get(scope)?.values() ?? []) {
      if (seen.has(`${row.scope}:${row.slug}`) || !PAID.has(String(row.fields.palier)) || row.fields.hors_voie) continue;
      if (out.some((t) => t.id === row.slug)) continue;
      const sibling = out.find((t) => t.voie?.id === `${row.scope}:${row.voie_slug}` && !t.aliasOf);
      out.push({
        id: row.slug,
        name: row.title,
        group: sibling?.group ?? row.voie_title ?? "Talents",
        cost: row.fields.cout,
        access: row.fields.acces ?? "",
        effect: row.fields.texte_court ?? "",
        effectDetails: row.fields.texte_reference ?? undefined,
        compendiumId: sibling?.compendiumId,
        voie: voieOf(row),
        card: row.fields.texte_court ?? undefined,
        restored: true
      });
    }
    return out;
  };

  for (const key of Object.keys(truth.catalogs ?? {})) truth.catalogs[key] = overlay(key, truth.catalogs[key]);
  if (truth.corruption?.talents) truth.corruption.talents = overlay("corruption", truth.corruption.talents);
  truth.contentSource = "db";
  return truth;
}
