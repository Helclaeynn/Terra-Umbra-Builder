import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS,
  COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION
} from "../dist/compendium-verite-extraterrestres-lore.js";
import {
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION
} from "../dist/compendium-verite-extraterrestres-pnj.js";
import { COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES } from "../dist/compendium-verite-extrals-groups-pnj.js";
import { COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES } from "../dist/compendium-verite-fleaux-focus.js";
import { COMPENDIUM_REALITE_V9_PEGRE_PNJ_ARTICLES } from "../dist/compendium-realite-v9-pegre-pnj.js";
import { COMPENDIUM_REALITE_V9_POLICE_PNJ_ARTICLES } from "../dist/compendium-realite-v9-police-pnj.js";
import { COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ARTICLES } from "../dist/compendium-realite-v9-government-pnj.js";
import { COMPENDIUM_REALITE_V9_RELIGION_PNJ_ARTICLES } from "../dist/compendium-realite-v9-religion-pnj.js";
import { COMPENDIUM_REALITE_V9_CHRISTIANITY_ARTICLES } from "../dist/compendium-realite-v9-christianity.js";
import { COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES } from "../dist/compendium-verite-species-pnj.js";
import { COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES } from "../dist/compendium-verite-fantastiques-pnj.js";
import { truthCatalogExtral } from "../dist/rules/truth/catalog-extral.js";

process.env.DATABASE_URL ??= "postgresql://x:x@127.0.0.1:1/x";
const { mergeExtraterrestrialPnj, mergeFleauxPnj } = await import("../dist/compendium.js");

const norm = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9']+/g, " ")
    .trim();

const usable = (value) => {
  const key = norm(value);
  return key && key !== "?" && key !== "_" && key.length >= 4 ? key : null;
};

const identityKeys = (article) => {
  const keys = new Set();
  const add = (value) => {
    const key = usable(value);
    if (key) keys.add(key);
  };
  add(article.title);
  const pnj = article.pnj ?? {};
  for (const field of ["real_name", "nom_reel", "nom_realite", "nom_verite", "name", "alias"]) add(pnj[field]);
  for (const value of Array.isArray(pnj.identity_keys) ? pnj.identity_keys : []) add(value);
  for (const section of article.sections ?? []) {
    for (const block of section?.blocks ?? []) {
      if (block?.type !== "table" || !Array.isArray(block.rows)) continue;
      for (const row of block.rows) {
        if (!Array.isArray(row) || row.length < 2) continue;
        const label = norm(row[0]);
        if (label.includes("nom de la realite") || label.includes("nom de la verite") || label === "nom" || label.includes("identite")) add(row[1]);
      }
    }
  }
  return keys;
};

assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_ARTICLES.length, 7, "7 dedicated extraterrestrial lore pages expected");
assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_NAVIGATION.length, 7, "Every dedicated lore page needs navigation");
assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_ENRICHMENTS.length, 3, "Hub, Ad'rak and chronology enrichments expected");

assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.length, 62, "62 source PNJs expected");
assert.equal(new Set(COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.map((article) => article.id)).size, 62, "PNJ ids must be unique");
assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_NAVIGATION.length, 62, "Every source PNJ needs source navigation");

const expectedGroups = new Map([
  ["Talass", 10],
  ["Mo’sens", 10],
  ["Baséanhs", 10],
  ["Rocréens", 10],
  ["Thalsios", 10],
  ["Autres", 12]
]);
for (const [group, expected] of expectedGroups) {
  assert.equal(
    COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.filter((article) => article.pnj?.source_group === group).length,
    expected,
    `${group}: expected ${expected} PNJs`
  );
}

for (const article of COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES) {
  const mj = article.sections?.find((section) => section.id === "informations-mj");
  const stats = article.sections?.find((section) => section.id === "statistiques");
  assert.ok(mj && mj.audience === "mj", `${article.id}: MJ block missing/restricted incorrectly`);
  assert.ok((mj.blocks ?? []).length > 0, `${article.id}: source Truth information must fill MJ block`);
  const expectedTruth = (article.pnj?.source_verite ?? [])
    .map((entry) => String(entry?.text ?? ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const renderedTruth = (mj.blocks ?? [])
    .map((block) => String(block?.text ?? ""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  assert.equal(renderedTruth, expectedTruth, `${article.id}: MJ block must reproduce the complete source Truth text`);
  assert.ok(stats && stats.audience === "mj", `${article.id}: statistics block missing/restricted incorrectly`);
  assert.deepEqual(stats.blocks, [], `${article.id}: statistics stay empty until consolidation`);
  assert.ok(Array.isArray(article.pnj?.identity_keys) && article.pnj.identity_keys.length >= 1, `${article.id}: identity keys missing`);
  assert.ok(String(article.pnj?.source_extract ?? "").length > 0, `${article.id}: full source extract missing`);
  assert.equal(article.pnj?.protect_truth_metadata, true, `${article.id}: Truth metadata protection missing`);
  assert.equal(
    article.sections?.find((section) => section.id === "profil")?.audience,
    "mj",
    `${article.id}: occult profile must be MJ-only`
  );
  for (const section of article.sections ?? []) {
    if (/seuil/i.test(String(section.title ?? ""))) {
      assert.equal(section.audience, "mj", `${article.id}: threshold information must be MJ-only`);
    }
  }
}

assert.deepEqual(
  COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.filter((article) => article.audience === "mj").map((article) => article.title),
  ["Peste des vases"],
  "Only the profile without any Reality identity must remain entirely MJ-only"
);

for (const id of [
  "personnages-verite-extraterrestres-maximilian-marshall",
  "personnages-verite-extraterrestres-dhanuka-samara"
]) {
  const article = COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.find((item) => item.id === id);
  assert.ok(
    article?.sections?.some((section) => section.id === "informations-seuil-restaurees" && section.audience === "mj"),
    `${id}: malformed Reality/Threshold source block must be restored as MJ material`
  );
}

const publicTitles = new Map([
  ["personnages-verite-extraterrestres-arkinas", "Apollo Gaines"],
  ["personnages-verite-extraterrestres-shykrerath", "Honoka"],
  ["personnages-verite-extraterrestres-rsheraag", "Aberration Z-45"],
  ["personnages-verite-extraterrestres-dsherraneth", "Aberration Z-47"],
  ["personnages-verite-extraterrestres-zeelthan", "Jack Tang"],
  ["personnages-verite-extraterrestres-assymedira-fel", "Asheylinn Medira"],
  ["personnages-verite-extraterrestres-beltor-rixil", "Bryan Rixil"]
]);
for (const [id, title] of publicTitles) {
  assert.equal(COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.find((article) => article.id === id)?.title, title, `${id}: wrong public title`);
}

assert.equal(COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES.length, 58, "58 group source PNJs expected");
assert.ok(
  COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES.every((article) => article.pnj?.protect_truth_metadata === true),
  "All group profiles must protect Truth metadata"
);
assert.deepEqual(
  COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES.filter((article) => article.audience === "mj").map((article) => article.title),
  ["Elleth-Dyx", "Zirine fa’Meonn", "Otrax-01"],
  "Group profiles without a Reality cover must stay MJ-only"
);
for (const article of COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES) {
  const profile = article.sections?.find((section) => section.id === "profil");
  if (profile) assert.equal(profile.audience, "mj", `${article.id}: occult group profile must be MJ-only`);
  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (typeof block?.text !== "string" || !block.text.trim()) continue;
      assert.match(block.text.trim(), /[.!?…»)]$/, `${article.id}/${section.id}: truncated active paragraph`);
    }
  }
}
assert.equal(
  COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES.find((article) => article.id === "personnages-verite-extrals-groupes-elsa-rys")?.pnj?.nom_verite,
  "",
  "Elsa Rys must not inherit Nehemiah Hooley's Truth identity"
);

const honokaExtral = COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES.find(
  (article) => article.id === "personnages-verite-extraterrestres-shykrerath"
);
const honokaGroup = COMPENDIUM_VERITE_EXTRALS_GROUPS_PNJ_ARTICLES.find(
  (article) => article.id === "personnages-verite-extrals-groupes-honoka"
);
const honokaFleaux = COMPENDIUM_VERITE_FLEAUX_EXISTING_PNJ_SOURCES.find(
  (article) => norm(article.pnj?.nom_verite) === norm("Shy’Krerath")
);
assert.ok(honokaExtral && honokaGroup && honokaFleaux, "Honoka's three canonical source profiles must exist");
const mergedHonoka = mergeFleauxPnj(mergeExtraterrestrialPnj(honokaExtral, honokaGroup), honokaFleaux);
assert.equal(mergedHonoka.title, "Honoka", "Honoka must remain the active public identity");
assert.ok(
  !(mergedHonoka.sections ?? []).some((section) => section.id === "source-extraterrestres-identite" && section.audience !== "mj"),
  "Honoka's extraterrestrial identity complement must not be public"
);
for (const id of ["fleaux-focus-dossier", "fleaux-focus-realite", "fleaux-focus-verite"]) {
  assert.equal(
    mergedHonoka.sections?.find((section) => section.id === id)?.audience,
    "mj",
    `Honoka/${id}: the former Z-87 dossier must be MJ-only`
  );
}

const activeOtherPnjs = [
  ...COMPENDIUM_REALITE_V9_PEGRE_PNJ_ARTICLES,
  ...COMPENDIUM_REALITE_V9_POLICE_PNJ_ARTICLES,
  ...COMPENDIUM_REALITE_V9_GOVERNMENT_PNJ_ARTICLES,
  ...COMPENDIUM_REALITE_V9_RELIGION_PNJ_ARTICLES,
  ...COMPENDIUM_REALITE_V9_CHRISTIANITY_ARTICLES.filter((article) => article.category === "Personnages"),
  ...COMPENDIUM_VERITE_SPECIES_PNJ_ARTICLES,
  ...COMPENDIUM_VERITE_FANTASTIQUES_PNJ_ARTICLES
];

const mergeMatches = [];
for (const source of COMPENDIUM_VERITE_EXTRATERRESTRES_PNJ_ARTICLES) {
  const real = usable(source.pnj?.real_name);
  const truth = usable(source.pnj?.nom_verite);
  const matches = activeOtherPnjs.filter((candidate) => {
    const keys = identityKeys(candidate);
    return (truth && keys.has(truth)) || (real && keys.has(real));
  });
  assert.ok(matches.length <= 1, `${source.title}: ambiguous cross-document identity: ${matches.map((item) => item.id).join(", ")}`);
  if (matches.length === 1) mergeMatches.push([source.title, matches[0].id]);
}

for (const species of ["Talass", "Mo’sen", "Baséanh", "Rocréen", "Thalsios"]) {
  assert.ok(
    truthCatalogExtral.some((talent) => String(talent.group ?? "").startsWith(species)),
    `${species}: Builder Extral mechanical catalog missing`
  );
}

console.log(
  `TRUTH EXTRATERRESTRIALS OK — 7 pages lore · 62/62 PNJ · 10/10/10/10/10/12 · 62 MJ alimentés · 62 stats vides · ${mergeMatches.length} fusion(s) inter-doc détectée(s)`
);
for (const [source, target] of mergeMatches) console.log(`MERGE PNJ — ${source} -> ${target}`);
