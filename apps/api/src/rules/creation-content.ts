// Règles de création lues dans les tables de contenu (portée « creation »,
// infrastructure/content/build-creation.mjs ; noms et textes des talents dans
// la portée « realite »). Actif seulement si CONTENT_SOURCE=db.
//
// Les règles de création sont importées telles quelles par une dizaine de
// modules du serveur : on remplace donc le contenu des objets exportés, en
// gardant une copie des catalogues du code pour y revenir si la base est vide.
import { pool } from "../db.js";
import { contentRulesEnabled } from "./content-rules.js";
import { terraUmbraCreationRules } from "./terra-umbra-creation.js";
import { terraUmbraCreationLore, terraUmbraRealitySkillTalentMap, terraUmbraTalentChoiceSpecs } from "./terra-umbra-creation-lore.js";
import { terraUmbraDisadvantageLore, terraUmbraDisadvantages, terraUmbraEdgeRules } from "./terra-umbra-disadvantages-edge.js";

type Obj = Record<string, any>;
const targets: Record<string, Obj> = {
  rules: terraUmbraCreationRules,
  lore: terraUmbraCreationLore,
  choices: terraUmbraTalentChoiceSpecs,
  skillMap: terraUmbraRealitySkillTalentMap,
  disadvantages: terraUmbraDisadvantages,
  disadvantageLore: terraUmbraDisadvantageLore,
  edge: terraUmbraEdgeRules
};
const pristine = structuredClone(targets);

function replace(target: Obj, next: Obj) {
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, next);
}

type Row = { type: string; scope: string; slug: string; title: string; fields: Obj };

export async function loadCreationContent() {
  if (!contentRulesEnabled()) return;
  const { rows } = await pool.query<Row>(`
    SELECT e.type, e.scope, e.slug, e.title, e.fields
      FROM content_entry e
      LEFT JOIN content_relation r ON r.from_id = e.id AND r.kind = 'appartient_a'
     WHERE e.status = 'published'
       AND (e.scope = 'creation' OR (e.scope = 'realite' AND e.type = 'talent_realite'))
     ORDER BY r.position NULLS FIRST, e.slug`);
  const strip = ({ nature: _scope, ...fields }: Obj) => fields;
  const rule = (slug: string) => rows.find((row) => row.scope === "creation" && row.type === "regle" && row.slug === slug)?.fields;
  const cadre = rule("cadre");
  const talents = rule("talents");
  if (!cadre || !talents) {
    for (const [key, target] of Object.entries(targets)) replace(target, structuredClone(pristine[key]));
    return;
  }

  const texts = new Map(rows.filter((row) => row.type === "talent_realite").map((row) => [row.slug, row]));
  const talent = (mechanics: Obj) => {
    const text = texts.get(mechanics.id);
    const fallback = talents.textes?.[mechanics.id] ?? {};
    return {
      id: mechanics.id,
      name: text?.title ?? fallback.name ?? mechanics.id,
      effect: text?.fields.texte_reference ?? fallback.effect ?? "",
      ...mechanics
    };
  };
  const groups = (byKey: Obj) => Object.fromEntries(Object.entries(byKey).map(([key, list]) => [key, (list as Obj[]).map(talent)]));

  const { nature: _scope, ...frame } = cadre;
  replace(targets.rules, {
    ...frame,
    styles: rows.filter((row) => row.type === "style").map((row) => ({ id: row.slug, name: row.title, ...strip(row.fields) })),
    talents: {
      origin: groups(talents.origin),
      sphere: groups(talents.sphere),
      common: talents.common.map(talent),
      expertise: talents.expertise.map(talent)
    }
  });

  const disadvantages: Obj = { common: [], attribute: [], sphere: {} };
  for (const row of rows.filter((entry) => entry.type === "desavantage")) {
    const { groupe, ...fields } = strip(row.fields);
    const item = { name: row.title, ...fields };
    const [group, sphere] = String(groupe).split(".");
    if (group === "sphere") (disadvantages.sphere[sphere] ??= []).push(item);
    else disadvantages[group]?.push(item);
  }
  replace(targets.disadvantages, disadvantages);

  const aides = rule("aides") ?? {};
  if (aides.lore) replace(targets.lore, aides.lore);
  if (aides.choices) replace(targets.choices, aides.choices);
  if (aides.skillMap) replace(targets.skillMap, aides.skillMap);
  const edge = rule("edge")?.edge;
  if (edge) replace(targets.edge, edge);
  const disadvantageLore = rule("desavantages_aides")?.lore;
  if (disadvantageLore) replace(targets.disadvantageLore, disadvantageLore);
}
