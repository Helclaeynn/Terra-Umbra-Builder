import assert from "node:assert/strict";

import {
  BUILDER_ORIGIN_PAGE_IDS,
  BUILDER_SPHERE_PAGE_IDS,
  BUILDER_STYLE_PAGE_IDS,
  generatedBuilderReferenceCorpus
} from "../dist/compendium-builder-references.js";
import {
  COMPENDIUM_VERITE_LOGES_MAGES_LORE_SECTIONS,
  applyCompendiumVeriteLogesMagesLore
} from "../dist/compendium-verite-loges-mages-lore.js";
import {
  COMPENDIUM_VERITE_CLOSURE_TARGET_IDS,
  applyCompendiumVeriteClosureLore
} from "../dist/compendium-verite-closure-lore.js";
import {
  COMPENDIUM_REALITE_V9_CLOSURE_TARGET_IDS,
  applyCompendiumRealiteV9ClosureLore
} from "../dist/compendium-realite-v9-closure-lore.js";

const sectionIds = (article) => (article.sections ?? []).map((section) => String(section.id ?? ""));
const serialized = (article) => JSON.stringify(article);

function assertUniqueSections(article) {
  const ids = sectionIds(article);
  assert.equal(new Set(ids).size, ids.length, `${article.id}: identifiants de section uniques`);
  assert.ok(ids.every(Boolean), `${article.id}: toutes les sections ont un identifiant`);
  assert.doesNotMatch(serialized(article), /[�￾]/u, `${article.id}: aucun glyphe endommagé`);
}

function fixture(id, sections = []) {
  return {
    id,
    title: id,
    source: "source-initiale",
    status: "canon",
    tags: ["initial"],
    sections: structuredClone(sections)
  };
}

// Les 27 pages de référence du Builder restent éditoriales : le détail mécanique
// des Talents et choix de création demeure dans le Builder lui-même.
const builder = generatedBuilderReferenceCorpus();
const expectedBuilderIds = [
  ...Object.values(BUILDER_ORIGIN_PAGE_IDS),
  ...Object.values(BUILDER_SPHERE_PAGE_IDS),
  ...Object.values(BUILDER_STYLE_PAGE_IDS)
];

assert.equal(expectedBuilderIds.length, 27, "27 pages Builder attendues");
assert.equal(new Set(expectedBuilderIds).size, 27, "27 identifiants Builder uniques");
assert.equal(builder.articles.length, 27, "27 articles Builder générés");
assert.equal(builder.navigation.length, 27, "27 entrées de navigation Builder générées");
assert.deepEqual(
  new Set(builder.articles.map((article) => article.id)),
  new Set(expectedBuilderIds),
  "toutes les pages Builder attendues sont générées"
);
assert.deepEqual(
  builder.navigation.map((entry) => entry.id),
  builder.articles.map((article) => article.id),
  "navigation et articles Builder alignés"
);

for (const article of builder.articles) {
  assert.equal(article.sections.length, 3, `${article.id}: trois sections éditoriales`);
  assert.ok(article.sections.every((section) => section.level === 2), `${article.id}: niveaux de section`);
  assert.ok(
    article.sections.every((section) => section.blocks.every((block) => block.type === "p")),
    `${article.id}: prose éditoriale uniquement`
  );
  assert.doesNotMatch(serialized(article), /Cette page documente/iu, `${article.id}: ancien texte générique absent`);
  assert.doesNotMatch(serialized(article), /catalogue canonique du Builder/iu, `${article.id}: ancien texte générique absent`);
  assert.doesNotMatch(serialized(article), /peut être enrichi/iu, `${article.id}: note de chantier absente`);
  assert.doesNotMatch(serialized(article), /\{\{Talents\|/u, `${article.id}: aucune fiche de Talent recopiée`);
  assertUniqueSections(article);
}

// Loges : le cadre institutionnel précède les listes de membres déjà présentes.
const loges = fixture("verite-v7-mages-mageius-roue-loges", [
  { id: "introduction", title: "Introduction", level: 2, blocks: [] },
  { id: "loges-mages-loge-new-york", title: "Loge de New York", level: 2, blocks: [] },
  { id: "loges-mages-autres-loges", title: "Autres Loges", level: 2, blocks: [] }
]);
const logesMap = new Map([[loges.id, loges]]);
applyCompendiumVeriteLogesMagesLore(logesMap);
applyCompendiumVeriteLogesMagesLore(logesMap);
assert.equal(COMPENDIUM_VERITE_LOGES_MAGES_LORE_SECTIONS.length, 12, "12 sections institutionnelles Loges");
assert.equal(
  loges.sections.filter((section) => section.id === "loges-mages-institution-2035").length,
  1,
  "enrichissement Loges idempotent"
);
assert.ok(
  sectionIds(loges).indexOf("loges-mages-institution-2035") < sectionIds(loges).indexOf("loges-mages-loge-new-york"),
  "cadre institutionnel placé avant les listes de membres"
);
assert.doesNotMatch(serialized(loges), /"pnj"\s*:/u, "Loges: aucune fiche PNJ ajoutée");
assertUniqueSections(loges);

// Vérité : Temples, Angelus, Garous et doctrine matérielle AIDH.
const truthFixtures = [
  fixture("verite-v7-daemons-divinites-maisonnees-temples", [
    { id: "temples-daemoniaques-inventaire", title: "Ancien inventaire", level: 2, blocks: [] },
    { id: "temples-daemoniaques-definition-complete", title: "Définition", level: 2, blocks: [] },
    { id: "temples-daemoniaques-lien-angelus", title: "Angelus", level: 2, blocks: [] }
  ]),
  fixture("verite-v7-angelus-elynea-arbre-vie", [
    { id: "introduction", title: "Introduction", level: 2, blocks: [] },
    { id: "renvoi-regles", title: "Règles", level: 2, blocks: [] }
  ]),
  fixture("verite-v7-garous-khinae-meutes-pelages", [
    { id: "introduction", title: "Introduction", level: 2, blocks: [] }
  ]),
  fixture("verite-humanite-galactique-aidh", [
    { id: "introduction", title: "Introduction", level: 2, blocks: [] }
  ])
];
const truthMap = new Map(truthFixtures.map((article) => [article.id, article]));
applyCompendiumVeriteClosureLore(truthMap);
applyCompendiumVeriteClosureLore(truthMap);

assert.deepEqual(
  new Set(truthMap.keys()),
  new Set(COMPENDIUM_VERITE_CLOSURE_TARGET_IDS),
  "quatre cibles Vérité contrôlées"
);
const daemons = truthMap.get("verite-v7-daemons-divinites-maisonnees-temples");
const daemonIds = sectionIds(daemons);
assert.equal(
  daemonIds.filter((id) => id.startsWith("temples-daemoniaques-dossier-")).length,
  13,
  "13 dossiers de Temple"
);
assert.equal(daemonIds.filter((id) => id === "temples-daemoniaques-inventaire").length, 1, "index des Temples remplacé");
assert.match(serialized(daemons), /Cabinet Faith/u, "façade documentée de Belial");
assert.match(serialized(daemons), /Studios Redwheels/u, "façade documentée de Lilith");
assert.equal((serialized(daemons).match(/Temple fantôme/gu) ?? []).length >= 4, true, "quatre Temples fantômes documentés");
assert.doesNotMatch(serialized(daemons), /"pnj"\s*:/u, "Temples: aucune fiche PNJ ajoutée");

const angelus = truthMap.get("verite-v7-angelus-elynea-arbre-vie");
assert.ok(sectionIds(angelus).includes("angelus-nephilim-restriction-manifestations"), "complément Nephilim présent");
const garous = truthMap.get("verite-v7-garous-khinae-meutes-pelages");
assert.ok(sectionIds(garous).includes("khinae-chasse-activite-meute"), "Chasse de Meute présente");
assert.ok(sectionIds(garous).includes("khinae-latents-partenaires-parente"), "Latents et parenté présents");
const aidh = truthMap.get("verite-humanite-galactique-aidh");
assert.ok(sectionIds(aidh).includes("aidh-trois-couches-technologiques"), "trois couches AIDH présentes");
assert.ok(sectionIds(aidh).includes("aidh-dotation-verrouillage-recuperation"), "doctrine de dotation AIDH présente");
assert.match(serialized(aidh), /n’utilise plus les anciens points de réquisition/u, "ancien système AIDH explicitement retiré");
for (const article of truthMap.values()) assertUniqueSections(article);

// Réalité : vie quotidienne, STAB et retrait de l'arbitrage éditorial non résolu
// sur les trois surfaces où il apparaissait.
const realityFixtures = [
  fixture("realite-v9-technologies-infrastructures-mobilite"),
  fixture("realite-v9-holonet-medias-culture-identite"),
  fixture("realite-v9-augmentations-corps-sante"),
  fixture("realite-v9-stab", [{ id: "ancien", title: "Ancien contenu", level: 2, blocks: [] }]),
  fixture("realite-v9-agences-securite-enquete", [
    {
      id: "agences",
      title: "Agences",
      level: 2,
      blocks: [{ type: "p", text: "STAB technologies Nehemiah Sellers Directeur" }]
    }
  ]),
  fixture("realite-v9-cabinet-secretariats", [
    {
      id: "cabinet",
      title: "Cabinet",
      level: 2,
      blocks: [{ type: "table", rows: [["STAB", "Nehemiah Sellers"]] }]
    }
  ]),
  fixture("realite-v9-los-angeles-laus-securites", [
    {
      id: "laus",
      title: "LAUS",
      level: 2,
      blocks: [{ type: "p", text: "Direction: Nehemiah Sellers (Ou Lisa Eredhès ?)" }]
    }
  ])
];
const realityMap = new Map(realityFixtures.map((article) => [article.id, article]));
applyCompendiumRealiteV9ClosureLore(realityMap);
applyCompendiumRealiteV9ClosureLore(realityMap);

assert.deepEqual(
  new Set(realityMap.keys()),
  new Set(COMPENDIUM_REALITE_V9_CLOSURE_TARGET_IDS),
  "sept surfaces Réalité contrôlées"
);
assert.ok(
  sectionIds(realityMap.get("realite-v9-technologies-infrastructures-mobilite")).includes("ville-verticale-trois-strates"),
  "strates urbaines présentes"
);
const holonet = realityMap.get("realite-v9-holonet-medias-culture-identite");
for (const id of ["dossier-citoyen-holophone", "zones-holonet-ancrage-physique", "culture-partagee-talkshow-lys"]) {
  assert.ok(sectionIds(holonet).includes(id), `Holonet: section ${id} présente`);
}
assert.ok(
  sectionIds(realityMap.get("realite-v9-augmentations-corps-sante")).includes("cyber-rue-bio-richesse-stereotype"),
  "nuance cyber/bio présente"
);
const stab = realityMap.get("realite-v9-stab");
assert.deepEqual(
  sectionIds(stab),
  ["organisation", "poles-sections", "brevets-juridiction", "unites-intervention", "coordination", "statut-mondial"],
  "page STAB reconstruite en six sections institutionnelles"
);
for (const id of [
  "realite-v9-stab",
  "realite-v9-agences-securite-enquete",
  "realite-v9-cabinet-secretariats",
  "realite-v9-los-angeles-laus-securites"
]) {
  assert.doesNotMatch(serialized(realityMap.get(id)), /Nehemiah Sellers|Lisa Eredh[eè]s/iu, `${id}: arbitrage STAB non résolu absent`);
}
for (const article of realityMap.values()) assertUniqueSections(article);

console.log(
  "EDITORIAL CLOSURE OK — 37 pages principales · 2 surfaces de cohérence · 27 pages Builder · 13 Temples · 0 fiche PNJ ajoutée"
);
