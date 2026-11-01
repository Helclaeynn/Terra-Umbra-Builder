// Paquet de règles de Vérité lu dans les tables de contenu : portée « verite »
// (infrastructure/content/build-verite.mjs) et objets de la portée « objets »
// (build-objets.mjs). Actif seulement si CONTENT_SOURCE=db.
//
// Comme pour la création (creation-content.ts), on remplace le contenu de
// l'objet exporté, en gardant les catalogues du code pour y revenir si la base
// est vide. Les voies, cartes, coûts et textes des lots s'y ajoutent
// (applyContentRules, content-rules.ts).
import { pool } from "../db.js";
import { applyContentRules, contentRulesEnabled } from "./content-rules.js";
import { invalidateTalentRegistry } from "./talent-registry.js";
import { useTruthRules } from "./truth/active.js";
import { terraUmbraTruthRules } from "./truth/rules.js";

type Obj = Record<string, any>;
const target = terraUmbraTruthRules as Obj;
const KEYS = ["structure", "catalogs", "visibility", "revelation", "equipment", "corruption"] as const;
const pristine: Obj = structuredClone(Object.fromEntries(KEYS.map((key) => [key, target[key]])));

type Row = { type: string; scope: string; slug: string; title: string; fields: Obj; position: number | null };

export async function loadTruthContent() {
  if (!contentRulesEnabled()) return;
  const { rows } = await pool.query<Row>(`
    SELECT e.type, e.scope, e.slug, e.title, e.fields, r.position
      FROM content_entry e
      LEFT JOIN content_relation r ON r.from_id = e.id AND r.kind = 'appartient_a'
     WHERE e.status = 'published' AND e.scope IN ('verite', 'objets') AND e.type IN ('regle', 'objet')
     ORDER BY r.position NULLS FIRST, e.slug`);
  const next: Obj = structuredClone(pristine);
  const verite = rows.filter((row) => row.scope === "verite");
  const cadre = verite.find((row) => row.slug === "cadre")?.fields;
  if (cadre) {
    const natures: Obj = {};
    for (const row of verite.filter((entry) => entry.slug.startsWith("nature_"))) natures[row.fields.nature_id] = row.fields.structure;
    const catalogs: Obj = {};
    for (const row of verite.filter((entry) => entry.slug.startsWith("catalogue_"))) catalogs[row.fields.nature_id] = row.fields.talents;
    next.structure = { ptvInitial: cadre.ptvInitial, consciousness: cadre.consciousness, natures };
    next.catalogs = catalogs;
    next.visibility = cadre.visibility;
    next.revelation = cadre.revelation;
    const corruption = verite.find((row) => row.slug === "corruption")?.fields;
    if (corruption) next.corruption = { sources: corruption.sources, precedence: corruption.precedence, talents: corruption.talents };
  }
  // Objets : une entrée « objet », ou « regle » pour une fiche de référence
  // (celles qui portent un chapitre de catalogue).
  const items = rows.filter((row) => row.scope === "objets" && row.fields.chapitre !== undefined);
  if (items.length) {
    next.equipment = items.map((row) => ({
      id: row.slug,
      name: row.title,
      chapter: row.fields.chapitre,
      section: row.fields.section,
      status: row.fields.statut_catalogue,
      sourceKind: row.fields.origine,
      tags: row.fields.tags,
      lore: row.fields.lore ?? "",
      properties: row.fields.proprietes,
      compendiumId: row.fields.compendium,
      referenceOnly: row.type === "regle",
      requiresMj: row.fields.mj
    }));
  }
  // Voies, coûts des paliers, textes des entrées « talent » et talents rétablis :
  // le Builder et la fiche en partie lisent ainsi les mêmes talents.
  await applyContentRules(next);
  for (const key of KEYS) target[key] = next[key];
  target.contentSource = next.contentSource;
  useTruthRules(next);
  invalidateTalentRegistry();
}
