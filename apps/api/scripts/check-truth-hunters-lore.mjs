import assert from "node:assert/strict";

import {
  COMPENDIUM_VERITE_HUNTERS_ARTICLES,
  COMPENDIUM_VERITE_HUNTERS_NAVIGATION
} from "../dist/compendium-verite-hunters-source.js";
import {
  COMPENDIUM_VERITE_HUNTERS_LORE_ARTICLES,
  COMPENDIUM_VERITE_HUNTERS_LORE_ENRICHMENTS,
  COMPENDIUM_VERITE_HUNTERS_CHASSE_FANTASTIQUE_HUB_ENRICHMENT
} from "../dist/compendium-verite-hunters-lore.js";

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};

assert.equal(COMPENDIUM_VERITE_HUNTERS_LORE_ARTICLES.length, 8, "8 pages institutionnelles attendues");
assert.deepEqual(
  COMPENDIUM_VERITE_HUNTERS_LORE_ARTICLES.map((article) => article.id),
  COMPENDIUM_VERITE_HUNTERS_ARTICLES.map((article) => article.id),
  "les identifiants source doivent être préservés"
);
assert.deepEqual(
  COMPENDIUM_VERITE_HUNTERS_LORE_ARTICLES.map((article) => article.title),
  COMPENDIUM_VERITE_HUNTERS_ARTICLES.map((article) => article.title),
  "les titres et la navigation ne doivent pas dériver"
);
assert.equal(
  new Set(COMPENDIUM_VERITE_HUNTERS_NAVIGATION.map((entry) => entry.id)).size,
  8,
  "navigation complète et unique"
);

const forbidden = /[�￾]|Nom de la Réalité|Nom de la Vérité|Personnages liés|Informations Vérité|en plus de la\s*$/iu;
let paragraphCount = 0;
let tableCount = 0;
let longest = 0;

for (const article of COMPENDIUM_VERITE_HUNTERS_LORE_ARTICLES) {
  assert.equal(article.source, "TUC_Vérité_ les chasseurs(1).docx", `${article.id}: source canonique`);
  assert.equal(article.pnj, undefined, `${article.id}: aucun profil PNJ dans le lore institutionnel`);
  assert.equal(
    article.sections.length,
    COMPENDIUM_VERITE_HUNTERS_ARTICLES.find((source) => source.id === article.id)?.sections.length,
    `${article.id}: frontières de sections préservées`
  );
  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block.type === "table") {
        tableCount += 1;
        continue;
      }
      paragraphCount += 1;
      const text = String(block.text ?? "");
      longest = Math.max(longest, text.length);
      assert.ok(text.length <= 600, `${article.id} / ${section.title}: mur de ${text.length} caractères`);
      assert.doesNotMatch(text, forbidden, `${article.id} / ${section.title}: fragment d’import ou biographie`);
    }
  }
}

const sentinels = {
  "lore-hunters-association": ["Mary Morgan", "Armée du Clan", "Atreesha", "Observateurs"],
  "lore-hunters-association-gate-hunt": ["GT-00", "Hunt 1000", "Hunt 100", "Hunt 15", "Secret"],
  "lore-hunters-xenoshield": ["Thegos", "Hyperblood", "AIDH", "CTU"],
  "lore-hunters-chretiens": ["Ephraïm", "Arianwen", "Magdalena", "Bannissement"],
  "lore-hunters-musulmans": ["Roqya", "Envoûteurs", "Dualistes", "Assassins"],
  "lore-hunters-hindouistes": ["Brahman", "Trimurti", "Moksha", "Aum"],
  "lore-hunters-shientaoistes": ["Livre de Jade", "Confucianistes", "Shintoïstes", "Taoïstes", "Bouddhistes"],
  "lore-hunters-confreries": ["Nüwa", "Kali de Gaur", "table ronde", "Chasseurs de Fenrir"]
};

for (const article of COMPENDIUM_VERITE_HUNTERS_LORE_ARTICLES) {
  const text = flatten(article);
  for (const sentinel of sentinels[article.id] ?? []) {
    assert.ok(text.includes(sentinel), `${article.id}: repère canonique perdu (${sentinel})`);
  }
}

const doctrine = COMPENDIUM_VERITE_HUNTERS_LORE_ENRICHMENTS.find(
  (entry) => entry.id === "verite-055-19-formation-et-doctrine-de-chasseur"
);
assert.ok(doctrine, "enrichissement de doctrine générale absent");
for (const section of doctrine.sections ?? []) {
  for (const block of section.blocks ?? []) {
    if (block.type === "p") assert.ok(String(block.text ?? "").length <= 600, "mur dans la doctrine générale");
  }
}

const fantasticArticle = COMPENDIUM_VERITE_HUNTERS_LORE_ENRICHMENTS.find(
  (entry) => entry.id === "lore-grands-exiles-chasse-fantastique"
);
assert.ok(fantasticArticle, "dossier Chasse Fantastique absent");
const fantasticText = `${flatten(fantasticArticle)} ${flatten(
  COMPENDIUM_VERITE_HUNTERS_CHASSE_FANTASTIQUE_HUB_ENRICHMENT
)}`;
for (const sentinel of [
  "Oberon Vadel",
  "Mirrissi",
  "Titania Sellin’Yn",
  "Mère des tempêtes",
  "grands veneurs",
  "Conseil des Anciens",
  "Anyra",
  "Exandrena"
]) {
  assert.ok(fantasticText.includes(sentinel), `Chasse Fantastique: repère perdu (${sentinel})`);
}
assert.equal(
  COMPENDIUM_VERITE_HUNTERS_CHASSE_FANTASTIQUE_HUB_ENRICHMENT.targetId,
  "verite-v7-chasseurs-doctrine-association-traditions",
  "cible du hub Chasseurs"
);

console.log(
  `TRUTH HUNTERS LORE OK — 8 pages · ${paragraphCount} paragraphes · ${tableCount + 2} tableaux · plus long paragraphe ${longest} caractères · Chasse Fantastique multi-source`
);
