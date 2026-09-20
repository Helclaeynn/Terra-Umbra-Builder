import assert from "node:assert/strict";

import { COMPENDIUM_VERITE_V7_LORE_ARTICLES } from "../dist/compendium-verite-v7-lore.js";
import { COMPENDIUM_VERITE_V7_KHINAE_LORE_ARTICLES } from "../dist/compendium-verite-v7-khinae.js";
import { COMPENDIUM_VERITE_V7_MAGE_ARTICLES } from "../dist/compendium-verite-v7-mages.js";
import { COMPENDIUM_VERITE_V7_DAEMON_ARTICLES } from "../dist/compendium-verite-v7-daemons.js";
import { COMPENDIUM_VERITE_V7_ANGELUS_ARTICLES } from "../dist/compendium-verite-v7-angelus.js";
import { COMPENDIUM_VERITE_V7_ASERYN_ARTICLES } from "../dist/compendium-verite-v7-aseryns.js";
import { COMPENDIUM_VERITE_V7_PASS_B_ARTICLES } from "../dist/compendium-verite-v7-pass-b.js";

const all = [
  ...COMPENDIUM_VERITE_V7_LORE_ARTICLES,
  ...COMPENDIUM_VERITE_V7_KHINAE_LORE_ARTICLES,
  ...COMPENDIUM_VERITE_V7_MAGE_ARTICLES,
  ...COMPENDIUM_VERITE_V7_DAEMON_ARTICLES,
  ...COMPENDIUM_VERITE_V7_ANGELUS_ARTICLES,
  ...COMPENDIUM_VERITE_V7_ASERYN_ARTICLES,
  ...COMPENDIUM_VERITE_V7_PASS_B_ARTICLES
];

const lore = all.filter((article) => article.category === "Vérité");
assert.equal(lore.length, 17, `expected 17 Truth lore pages, found ${lore.length}`);
assert.equal(new Set(lore.map((article) => article.id)).size, 17, "duplicate Truth lore article ids");

const flatten = (value) => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flatten).join(" ");
  return "";
};

const forbidden = [
  ["dynamic Talent directive", /\{\{Talents\|/u],
  ["canonical catalogue heading", /catalogue canonique/iu],
  ["Builder mechanics mention", /\bBuilder\b/u],
  ["PTV mechanics", /\bPTV\b/u],
  ["mechanical profile", /\bProfil\s*:/u],
  ["uppercase DON marker", /\bDON\b/u],
  ["uppercase RITE marker", /\bRITE\b/u],
  ["uppercase FAVEUR marker", /\bFAVEUR\b/u],
  ["damaged extraction glyph", /[�￾]/u]
];

for (const article of lore) {
  const text = flatten(article);
  for (const [label, pattern] of forbidden) {
    assert.doesNotMatch(text, pattern, `${article.id}: ${label} leaked into lore`);
  }
  for (const section of article.sections ?? []) {
    for (const block of section.blocks ?? []) {
      if (block?.type !== "p") continue;
      assert.ok(
        String(block.text ?? "").length <= 600,
        `${article.id} / ${section.title}: ${String(block.text ?? "").length}-character lore wall`
      );
    }
  }
}

const byId = new Map(lore.map((article) => [article.id, flatten(article)]));
const required = {
  "verite-v7-exiles-peuples-silcenters-traditions": [
    "Silcenters",
    "Croix d’Emphyrra",
    "Ymirin",
    "Green Union",
    "Syndicat de Jade",
    "Horde Fantôme",
    "Servants de Pluton",
    "Lueurs d’Azménor",
    "Une société exilée, pas cinq musées"
  ],
  "verite-v7-extrals-gaac-aidh-diasporas": [
    "Talass",
    "Mo’sen",
    "Baséanhs",
    "Rocréens",
    "Thalsios",
    "GAAC",
    "CTU",
    "Croix Verte",
    "REPTILE",
    "Mafia Shaediri",
    "Hydroguard",
    "SMRC",
    "Shadow Research Agency",
    "Émeraude Sanglante"
  ],
  "verite-v7-homo-superior-adrak-profils-rares": [
    "Ichéi Prime",
    "Hologramme",
    "Homo Superior",
    "Seigneur-Généraux",
    "Ad’rak",
    "Armée noire",
    "Nel’Akna",
    "Tejana"
  ],
  "verite-v7-chasseurs-doctrine-association-traditions": [
    "Association des Chasseurs",
    "Confrérie du Bestiaire",
    "Xenoshield",
    "Chasseurs indépendants",
    "Grand Traqueur",
    "La Californie comme territoire de Chasse"
  ],
  "verite-v7-six-fleaux-sources-rupture": [
    "Vhodhal",
    "Loge d’Écume",
    "V’Aagor",
    "Longinus",
    "Ux’Sharith",
    "Archilogomancie",
    "C’Thath Vhadhi",
    "Éden Gris",
    "Gajh’Shaoggith",
    "Mère Primordiale",
    "Thul",
    "Mû",
    "Dagon",
    "Telipinu"
  ],
  "verite-v7-delanial-pere-ombre": [
    "Légionnaire des Puissances",
    "Père de l’Ombre",
    "Ombre-Monde",
    "Anahita",
    "Morrighan",
    "V’Aagor"
  ]
};

for (const [id, sentinels] of Object.entries(required)) {
  const text = byId.get(id);
  assert.ok(text, `missing lore article ${id}`);
  for (const sentinel of sentinels) {
    assert.ok(text.includes(sentinel), `${id}: lost lore sentinel ${sentinel}`);
  }
}

console.log("TRUTH V7 LORE INTEGRITY — 17/17 lore pages · no mechanics leakage · Pass B lore sentinels preserved");
