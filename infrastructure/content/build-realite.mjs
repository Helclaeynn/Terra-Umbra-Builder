// Génère infrastructure/content/realite.sql : les talents de Réalité, d'après le
// lot 14 (docs/audit-game-design/lots/14-realite.md).
//
//   node --import ./infrastructure/content/ts-register.mjs infrastructure/content/build-realite.mjs
//
// Pas de voies : la Réalité s'achète en XP (10 XP par talent) et la décision 5
// ne vaut que pour la Vérité. Chaque talent garde son identifiant ; carte courte
// du lot (tableaux « | # | Talent | Carte courte | »), texte de référence servi
// par l'API, révisions comprises. L'équipement et les augmentations ne changent
// pas (lot 14, section 8) et restent dans leurs catalogues pour l'instant.
import { terraUmbraCreationRules } from "../../apps/api/src/rules/terra-umbra-creation.ts";
import { REALITY_TALENT_XP_COST } from "../../apps/api/src/rules/reality-talents-revision.ts";
import { ContentSet, norm, readLot } from "./lib.mjs";

const lot = readLot("14-realite.md");
const set = new ContentSet("realite");
const { talents } = terraUmbraCreationRules;
const section = (titre) => {
  const start = lot.indexOf(titre);
  const end = lot.indexOf("\n## ", start + titre.length);
  return lot.slice(start, end > 0 ? end : undefined).replace(/^## .*\n/, "").trim();
};

// Cartes courtes du lot, par catégorie et milieu.
const CATEGORIES = { "Talents d'Origine": "origin", "Talents de Sphère": "sphere", "Talents communs": "common", "Talents d'expertise": "expertise" };
const MILIEUX = { corporatiste: "corporatiste", gouvernementale: "gouvernementale", mafieuse: "mafieuse", religieuse: "religieuse", crawler: "crawler" };
const key = (s) => norm(s).replace(/\s*\/\s*/g, "/");
const cartes = new Map();
let categorie = null;
let milieu = null;
for (const line of lot.split("\n")) {
  const h2 = line.match(/^## \d+\. (.+?)( \(\d+\))?$/);
  if (h2) {
    categorie = Object.entries(CATEGORIES).find(([k]) => h2[1].startsWith(k))?.[1] ?? null;
    milieu = null;
    continue;
  }
  const h3 = line.match(/^### \d+\.\d+ \S+ (\S+)/);
  if (h3) milieu = MILIEUX[norm(h3[1])] ?? null;
  const row = line.match(/^\|\s*\d+\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/);
  if (row && categorie) cartes.set(`${categorie}|${milieu ?? ""}|${key(row[1])}`, row[2]);
}

set.entry("regle", "realite", "Talents de Réalité", {
  lecture: section("## 3. Lecture des talents"),
  equipement: section("## 8. Équipement"),
  corrections: section("## 9. Talents : corrections appliquées"),
  cout_xp: REALITY_TALENT_XP_COST
}, { summary: "122 talents achetés en XP : Origine, Sphère, communs, expertises (lot 14)." });

let n = 0;
let sansCarte = [];
const add = (t, categorieId, milieuId) => {
  const carte = cartes.get(`${categorieId}|${milieuId ?? ""}|${key(t.name)}`) ?? null;
  if (!carte) sansCarte.push(t.name);
  set.entry("talent_realite", t.id, t.name, {
    categorie: categorieId,
    milieu: milieuId ?? null,
    cout_xp: REALITY_TALENT_XP_COST,
    texte_court: carte,
    texte_reference: t.effect,
    lore: t.lore ?? null,
    statut_regle: "origine"
  });
  set.relation(["talent_realite", t.id], ["regle", "realite"], "appartient_a", ++n);
};
for (const [m, list] of Object.entries(talents.origin)) list.forEach((t) => add(t, "origin", m));
for (const [m, list] of Object.entries(talents.sphere)) list.forEach((t) => add(t, "sphere", m));
talents.common.forEach((t) => add(t, "common"));
talents.expertise.forEach((t) => add(t, "expertise"));

if (sansCarte.length) throw new Error(`Talents de Réalité sans carte dans le lot 14 : ${sansCarte.join(", ")}`);
console.log(`${set.write("build-realite.mjs", "./realite.sql")} ; ${n} talents de Réalité, tous avec leur carte du lot 14.`);
