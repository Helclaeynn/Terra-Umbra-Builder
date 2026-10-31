// Génère infrastructure/content/garou.sql : le Garou en voies à paliers, d'après
// le lot 01 (docs/audit-game-design/lots/01-garou.md) et les décisions B1, A4 et 10.
//
//   node infrastructure/content/build-garou.mjs
//
// Cartes courtes : celles du lot. Textes de référence : ceux que l'API sert
// aujourd'hui (révisions comprises). Chaque identifiant de talent actuel reste
// un slug (ou un legacy_id en cas de fusion). Les Sangs vifs sont partagés avec
// les autres descendants de Khinae (décision 10) : le lot Khinae y rattachera
// ses propres identifiants.
import { truthCatalogGarou } from "../../apps/api/src/rules/truth/catalog-garou.ts";
import { applyKhinaeRevisions } from "../../apps/api/src/rules/truth/khinae-revision.ts";
import { truthRuntimeStructure } from "../../apps/api/src/rules/truth/runtime-structure.ts";
import { ContentSet, PALIER_COUT, norm, parseLotVoies, readLot } from "./lib.mjs";

const nature = truthRuntimeStructure.natures.garou;
const catalog = applyKhinaeRevisions(truthCatalogGarou);
const byName = new Map(catalog.map((t) => [norm(t.name), t]));
const option = (key, id) => nature.choices.find((c) => c.key === key).options.find((o) => o.id === id);
const lot = readLot("01-garou.md");
const voies = parseLotVoies(lot);
const set = new ContentSet("garou");
const seen = new Set();

const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const FUSIONS = { "chasseur patient": ["aura_effacee", "traque_infatigable"] };
const FORMES = { "1 porte": "une_porte", progression: "progression" };
const PELAGES = {
  "Pelage Gris": "pelages_gris",
  "Pelage Noir": "pelages_noirs",
  "Pelage Blanc": "pelages_blancs",
  "Pelage Roux": "pelages_roux",
  "Pelage Brun": "pelages_bruns",
  "Pelage Doré": "pelages_dores"
};
const SANGS = {
  Naturel: "sang_naturel",
  Alpha: "sang_alpha",
  "Révélateur": "sang_revelateur",
  "Écarlate": "sang_ecarlate",
  Sculpteur: "sang_sculpteur",
  Funeste: "sang_funeste",
  Primal: "sang_primal",
  Chasseur: "sang_chasseur",
  Sagesse: "sang_de_sagesse",
  "Enragé": "sang_enrage",
  "Enchaîné": "sang_enchaine",
  Vengeur: "sang_vengeur"
};

// Texte de la carte de Nature, tel que le lot l'écrit (section 2).
const carte = lot.slice(lot.indexOf("## 2. Carte de Nature"), lot.indexOf("## 3. Les voies de Pelage")).replace(/^## .*\n/, "").trim();

set.entry("nature", "garou", "Garou", {
  description: nature.description,
  carte,
  traits_gratuits: [
    ...nature.baseFreeTraits,
    { name: "Aura prédatrice", access: "R", effect: "Quand tu traques ou approches une proie, tu peux tenter de masquer ta présence, même contre des sens animaux. Le test est permis, sans bonus.", source: "lot 01 (absent des Traits)" }
  ],
  choix_creation: ["pelage", "sang_vif"],
  maitrise: "Un Sang est maîtrisé quand ses deux portes sont au palier II (6 PTV en général, 7 pour l'Enragé) ; il faut le maîtriser avant d'en éveiller un autre.",
  cout_eveil: 3,
  droits_acquis: "Les talents achetés avant les voies restent acquis ; les règles de voie valent pour les achats suivants (décision 20)."
}, { summary: "Le corps qui change : un Pelage, un Sang vif, des voies communes." });

set.entry("couche", "garou_pelage", "Pelage", { gratuit: "Tradition", choix: "unique_a_la_creation" });
set.entry("couche", "garou_sang_vif", "Sang vif", { gratuit: null, choix: "unique_a_la_creation", eveil: "3 PTV une fois le Sang maîtrisé", partage: "descendants de Khinae (décision 10)" });
set.entry("couche", "garou_voies_communes", "Voies communes", { gratuit: null, choix: "cumulable" });
for (const c of ["garou_pelage", "garou_sang_vif", "garou_voies_communes"]) set.relation(["couche", c], ["nature", "garou"], "appartient_a");

function addTalent(t, voie, position, voieChangements) {
  const fusion = FUSIONS[norm(t.nom)];
  let id;
  let legacy = [];
  let source;
  if (fusion) {
    [id, ...legacy] = fusion;
    source = catalog.find((c) => c.id === id);
  } else if (t.gratuit) {
    id = slugify(t.nom);
  } else {
    source = byName.get(norm(t.nom));
    if (!source) throw new Error(`Talent du lot introuvable au catalogue : ${t.nom}`);
    id = source.id;
  }
  [id, ...legacy].forEach((x) => seen.add(x));

  const full = (x) => x.effectDetails ?? x.effect;
  const reference = source
    ? [source, ...legacy.map((l) => catalog.find((c) => c.id === l))].map(full).join("\n")
    : t.texte;
  const coutActuel = source?.cost ?? 0;
  const cout = t.gratuit ? 0 : t.cout;
  const notes = [];
  if (!t.gratuit && cout !== coutActuel) notes.push(`Coût ${coutActuel} → ${cout}.`);
  if (fusion) notes.push(`Fusion de ${[source, ...legacy.map((l) => catalog.find((c) => c.id === l))].map((x) => x.name).join(" et ")}.`);
  if (voieChangements && norm(voieChangements).includes(norm(t.nom))) notes.push(voieChangements);
  const statut = notes.length ? "correction" : "origine";

  set.entry("talent", id, t.nom, {
    cout,
    cout_actuel: coutActuel,
    palier: t.gratuit ? (t.label.startsWith("Don") ? "don" : "tradition") : t.palier,
    porte: t.porte,
    palier_double: t.palierDouble,
    acces: t.acces ?? source?.access ?? null,
    activation: source?.activation ?? null,
    texte_court: t.texte,
    texte_reference: reference,
    lore: source?.runtimeLore ?? null,
    statut_regle: statut,
    changements: notes.join(" ") || null
  }, { legacy_ids: legacy });
  set.relation(["talent", id], ["voie", voie], "appartient_a", position);
  if (source?.prerequisite && !legacy.includes(source.prerequisite) && source.prerequisite !== id) {
    const target = Object.values(FUSIONS).find((f) => f.includes(source.prerequisite))?.[0] ?? source.prerequisite;
    set.relation(["talent", id], ["talent", target], "prerequis");
  }
}

for (const v of voies) {
  let voie;
  let couche;
  let fields;
  const pelage = Object.entries(PELAGES).find(([k]) => v.titre.startsWith(k));
  const sang = v.titre.startsWith("Sang ") && Object.entries(SANGS).find(([k]) => v.titre.includes(` ${k} `) || v.titre.includes(` ${k}·`) || v.titre.startsWith(`Sang ${k}`) || v.titre.startsWith(`Sang de ${k}`));
  if (pelage) {
    voie = `garou_${pelage[1]}`;
    couche = "garou_pelage";
    fields = { forme: FORMES[norm(v.forme).startsWith("progression") ? "progression" : v.forme], verrou: "ordre_paliers", pelage: pelage[1], description: option("pelage", pelage[1]).description };
  } else if (sang) {
    voie = `garou_${sang[1]}`;
    couche = "garou_sang_vif";
    fields = { forme: "deux_portes", verrou: "ordre_paliers", sang: sang[1], portes: v.portes, identite: v.titre.split(" — ")[1] ?? null, description: option("blood", sang[1]).description };
  } else if (["Traque", "Instinct", "Survie", "Corps de Khinae"].includes(v.titre)) {
    voie = `garou_${slugify(v.titre)}`;
    couche = "garou_voies_communes";
    fields = { forme: norm(v.forme).startsWith("progression") ? "progression" : "une_porte", verrou: "ordre_paliers" };
  } else {
    continue; // tables de correspondance, questions
  }
  if (v.titre === "Instinct") fields.socle = "Hiérarchie instinctive (carte de Nature)";
  set.entry("voie", voie, v.titre.split(" — ")[0], { ...fields, changements: v.changements });
  set.relation(["voie", voie], ["couche", couche], "appartient_a");
  v.talents
    .filter((t) => !t.label.startsWith("Socle"))
    .forEach((t, i) => addTalent(t, voie, t.gratuit ? 0 : i + 1, v.changements));
}

const missing = catalog.map((t) => t.id).filter((id) => !seen.has(id));
if (missing.length) throw new Error(`Talents non repris : ${missing.join(", ")}`);
for (const t of set.entries.filter((e) => e.type === "talent" && e.fields.palier in PALIER_COUT)) {
  if (t.fields.cout !== PALIER_COUT[t.fields.palier] && t.fields.cout !== 3) throw new Error(`Coût inattendu : ${t.slug}`);
}

console.log(`${set.write("build-garou.mjs", "./garou.sql")} ; ${catalog.length} talents actuels tous repris.`);
