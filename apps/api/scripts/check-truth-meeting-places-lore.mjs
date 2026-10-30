import assert from "node:assert/strict";

import {
  COMPENDIUM_POINTS_RENCONTRE_SOURCE,
  COMPENDIUM_POINTS_RENCONTRE_ARTICLES,
  COMPENDIUM_POINTS_RENCONTRE_NAVIGATION
} from "../dist/compendium-points-rencontre.js";
import { COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES } from "../dist/compendium-points-rencontre-editorial.js";
import {
  COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES,
  COMPENDIUM_POINTS_RENCONTRE_PNJ_NAVIGATION
} from "../dist/compendium-points-rencontre-pnj.js";

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/gu, "")
    .trim();

const withoutSections = ({ sections: _sections, ...article }) => article;
const sectionSignature = (article) =>
  (article.sections ?? []).map(({ id, title, level }) => ({ id, title, level }));

assert.equal(COMPENDIUM_POINTS_RENCONTRE_SOURCE, "Points de rencontre(3).pdf", "source canonique");
assert.equal(COMPENDIUM_POINTS_RENCONTRE_ARTICLES.length, 25, "25 pages source");
assert.equal(COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES.length, 25, "25 pages éditoriales");
assert.deepEqual(
  COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES.map(withoutSections),
  COMPENDIUM_POINTS_RENCONTRE_ARTICLES.map(withoutSections),
  "identifiants, titres, source, accès, tags et illustrations préservés"
);
assert.deepEqual(
  COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES.map(sectionSignature),
  COMPENDIUM_POINTS_RENCONTRE_ARTICLES.map(sectionSignature),
  "identifiants et titres des sections préservés"
);
assert.equal(COMPENDIUM_POINTS_RENCONTRE_NAVIGATION.length, 25, "25 entrées de navigation");
assert.equal(
  new Set(COMPENDIUM_POINTS_RENCONTRE_NAVIGATION.map((entry) => entry.id)).size,
  25,
  "navigation unique"
);
assert.deepEqual(
  COMPENDIUM_POINTS_RENCONTRE_NAVIGATION.map((entry) => entry.id),
  COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES.map((article) => article.id),
  "ordre de navigation préservé"
);

const forbidden = /[�￾]|Nom de la Réalité|Nom de la Vérité|Dossier source|Gardiens\s*:/iu;
let paragraphCount = 0;
let tableCount = 0;
let guardianCount = 0;
let longest = 0;

for (const article of COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES) {
  assert.equal(article.source, COMPENDIUM_POINTS_RENCONTRE_SOURCE, `${article.id}: source canonique`);
  assert.equal(article.audience, "mj", `${article.id}: niveau d’accès préservé`);
  assert.equal(article.pnj, undefined, `${article.id}: aucun profil PNJ dans la page de lieu`);

  for (const section of article.sections ?? []) {
    assert.ok(section.id, `${article.id}: identifiant de section absent`);
    assert.ok(section.title, `${article.id}: titre de section absent`);
    for (const block of section.blocks ?? []) {
      if (block.type === "table") {
        tableCount += 1;
        for (const row of block.rows ?? []) {
          for (const cell of row ?? []) {
            const text = flatten(cell);
            assert.ok(text.length <= 300, `${article.id}: cellule de tableau trop longue`);
            assert.doesNotMatch(text, forbidden, `${article.id}: fragment d’import dans un tableau`);
          }
        }
        continue;
      }

      assert.equal(block.type, "p", `${article.id}: type de bloc inattendu`);
      const text = String(block.text ?? "");
      paragraphCount += 1;
      longest = Math.max(longest, text.length);
      assert.ok(text.length > 0, `${article.id}: paragraphe vide`);
      assert.ok(text.length <= 600, `${article.id}: mur de ${text.length} caractères`);
      assert.doesNotMatch(text, forbidden, `${article.id}: fragment d’import ou biographie`);
    }
  }

  if (article.id === "verite-points-rencontre") continue;
  const guardianSection = (article.sections ?? []).find((section) => section.id === "gardiens");
  assert.ok(guardianSection, `${article.id}: section des gardiens absente`);
  const rows = guardianSection.blocks?.[0]?.rows ?? [];
  assert.deepEqual(rows[0], ["Gardiens"], `${article.id}: en-tête des gardiens`);
  const guardians = rows.slice(1).map((row) => String(row[0] ?? ""));
  const pnj = COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES.filter(
    (entry) => entry.pnj?.source_group === article.id
  );
  assert.equal(guardians.length, pnj.length, `${article.id}: nombre de gardiens préservé`);
  guardianCount += guardians.length;

  for (const guardian of guardians) {
    const guardianKey = normalize(guardian);
    assert.ok(
      pnj.some((entry) => {
        const candidates = [entry.title, entry.pnj?.real_name, ...(entry.pnj?.identity_keys ?? [])]
          .map(normalize)
          .filter(Boolean);
        return candidates.some(
          (candidate) => guardianKey.includes(candidate) || candidate.includes(guardianKey)
        );
      }),
      `${article.id}: gardien sans fiche correspondante (${guardian})`
    );
  }
}

const sentinels = {
  "verite-points-rencontre": ["codes", "réseaux de Vérité"],
  "points-rencontre-tour-or": ["centaine de kilomètres", "nœud magique"],
  "points-rencontre-decharge-san-diejuana": ["Paul", "Mithridate"],
  "points-rencontre-magic-casino": ["Talatuwa", "Gundrivers"],
  "points-rencontre-grand-theatre-milo": ["Mageius", "Faust"],
  "points-rencontre-sugar-eden": ["grâce de Dieu", "Jcube"],
  "points-rencontre-dancing-rabbit": ["Angel’s Table", "Svetlana"],
  "points-rencontre-angels-never-cry": ["Jesus Kenobi", "JJN"],
  "points-rencontre-garage-ashford": ["saint Arsenal", "Sachielle"],
  "points-rencontre-purple-embers": ["Channel 666", "Aessa"],
  "points-rencontre-first-flame": ["Moloch", "Belial"],
  "points-rencontre-cabinet-faith": ["Demona Prince", "prophètes"],
  "points-rencontre-night-feathers": ["Mary Gaine", "Hunt15"],
  "points-rencontre-raven-corporation-hq": ["Raysh’kan Feeshri", "Daghain"],
  "points-rencontre-runyon-canyon": ["anti-Wendigo", "Logifates"],
  "points-rencontre-ivory-fangs": ["Fenrir", "Andrea Shield"],
  "points-rencontre-wild-angel-wolf": ["Ulfhednars", "Arthur Bartram"],
  "points-rencontre-jadecenter-palameta": ["deux cents Gobelins", "Syndicat de Jade"],
  "points-rencontre-green-health": ["Siobhain Nic Siridean", "Fall Avenue"],
  "points-rencontre-fuckalifornia": ["Greenvoids", "The Void"],
  "points-rencontre-dream-vladic-tower": ["Turuhoken", "Grim"],
  "points-rencontre-military-next-academy": ["Horde divine", "Rick Scott"],
  "points-rencontre-space-union-aidh": ["Lisa Erédhès", "GAAC"],
  "points-rencontre-shaediri": ["points de crédit", "Los Demonos"],
  "points-rencontre-feeshri": ["G-corporations", "ordre Scytheri"]
};

for (const article of COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES) {
  const text = flatten(article);
  for (const sentinel of sentinels[article.id] ?? []) {
    assert.ok(text.includes(sentinel), `${article.id}: repère canonique perdu (${sentinel})`);
  }
}

const magicCasino = COMPENDIUM_POINTS_RENCONTRE_EDITORIAL_ARTICLES.find(
  (article) => article.id === "points-rencontre-magic-casino"
);
assert.deepEqual(
  magicCasino.sections.map((section) => section.blocks.length),
  [5, 2, 1],
  "doublon du M(agic) Casino remplacé par deux rôles complémentaires"
);

assert.equal(COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES.length, 52, "52 fiches de gardiens préservées");
assert.equal(COMPENDIUM_POINTS_RENCONTRE_PNJ_NAVIGATION.length, 52, "52 entrées PNJ préservées");
assert.equal(
  new Set(COMPENDIUM_POINTS_RENCONTRE_PNJ_ARTICLES.map((article) => article.id)).size,
  52,
  "identifiants PNJ uniques"
);
assert.equal(guardianCount, 52, "52 gardiens reliés aux pages institutionnelles");

console.log(
  `TRUTH MEETING PLACES LORE OK — 25 pages · ${paragraphCount} paragraphes contrôlés · ${tableCount} tableaux · plus long paragraphe ${longest} caractères · ${guardianCount} gardiens et 52 fiches PNJ préservés`
);
