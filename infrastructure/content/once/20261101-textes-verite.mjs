// Passage unique (01/11) : les textes des talents de Vérité n'ont plus qu'une
// source, l'entrée « talent » de leur Nature (apps/api/src/rules/content-rules.ts,
// talentTexts). Ce script lit la base et écrit le SQL qui :
//   - ajoute à l'entrée « talent » le champ `resume` quand le catalogue
//     affichait un texte court différent de la règle de référence ;
//   - retire des catalogues (verite:catalogue_<nature>, verite:corruption) le
//     nom, les textes, l'ambiance et l'activation que l'entrée porte déjà ;
//   - réécrit les prérequis désignés par un nom qui a changé.
// Les talents fondus dans un autre (aliasOf) gardent leurs textes au catalogue.
//
//   psql -Atqc "$(sed -n 's/^-- REQ //p' infrastructure/content/once/20261101-textes-verite.mjs)" > dump.json
//   node infrastructure/content/once/20261101-textes-verite.mjs dump.json > textes-verite.sql
//
// -- REQ select json_build_object('talents', (select json_agg(json_build_object('scope',scope,'slug',slug,'title',title,'legacy',legacy_ids,'f',fields)) from content_entry where type='talent' and status='published'), 'catalogues', (select json_object_agg(coalesce(fields->>'nature_id', slug), fields->'talents') from content_entry where type='regle' and scope='verite' and (slug like 'catalogue_%' or slug='corruption')))
import fs from "node:fs";

const { talents, catalogues } = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const SHARED = { garou: ["sangs_vifs"], khinae: ["sangs_vifs"] };
const byKey = new Map();
const legacy = new Map();
for (const t of talents) {
  byKey.set(`${t.scope}:${t.slug}`, t);
  for (const id of t.legacy ?? []) legacy.set(`${t.scope}:${id}`, t);
}
const literal = (value) => `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
const sql = ["BEGIN;"];
const resumes = new Map();
let stripped = 0;

for (const [nature, list] of Object.entries(catalogues)) {
  const renamed = new Map();
  const out = list.map((talent) => {
    let row;
    for (const scope of [nature, ...(SHARED[nature] ?? [])]) row ??= byKey.get(`${scope}:${talent.id}`) ?? legacy.get(`${scope}:${talent.id}`);
    if (!row || (row.scope === nature && row.slug !== talent.id) || row.f.texte_reference == null) return talent;
    const { name, effect, effectDetails, runtimeLore, activation, ...rest } = talent;
    if (name && name !== row.title) renamed.set(name, row.title);
    if (effect && effect !== row.f.texte_reference && row.f.resume == null) resumes.set(`${row.scope}:${row.slug}`, effect);
    if (row.f.lore == null && runtimeLore !== undefined) rest.runtimeLore = runtimeLore;
    if (row.f.activation == null && activation !== undefined) rest.activation = activation;
    stripped++;
    return rest;
  });
  for (const talent of out) if (renamed.has(talent.prerequisiteName)) talent.prerequisiteName = renamed.get(talent.prerequisiteName);
  const slug = nature === "corruption" ? "corruption" : `catalogue_${nature}`;
  sql.push(`UPDATE content_entry SET fields = jsonb_set(fields, '{talents}', ${literal(out)}), updated_at = now() WHERE type = 'regle' AND scope = 'verite' AND slug = '${slug}';`);
}
for (const [key, resume] of resumes) {
  const [scope, slug] = key.split(":");
  sql.push(`UPDATE content_entry SET fields = fields || ${literal({ resume })}, updated_at = now() WHERE type = 'talent' AND scope = '${scope}' AND slug = '${slug}';`);
}
sql.push("COMMIT;");
process.stdout.write(sql.join("\n") + "\n");
console.error(`${stripped} talents allégés au catalogue, ${resumes.size} résumés versés dans les entrées.`);
