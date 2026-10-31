// Génère infrastructure/content/objets.sql : les Objets de Vérité, d'après le
// lot 13 (docs/audit-game-design/lots/13-objets-verite.md).
//
//   TUC_TRUTH_EQUIPMENT_SOURCE=compendium/source/verite-catalog-v6.json.gz.b64 \
//     node --import ./infrastructure/content/ts-register.mjs infrastructure/content/build-objets.mjs
//
// Les objets ne sont pas des talents : pas de voies. Chaque fiche du catalogue
// servi par l'API devient une entrée (objet, ou règle pour les entrées de
// référence), avec son identifiant, son profil et ses propriétés inchangés
// (« aucune arme n'est affaiblie »). Le lot ajoute un chapitre d'accès, un
// glossaire des propriétés et l'ordre des six catalogues.
import { truthEquipmentCatalog } from "../../apps/api/src/rules/truth/equipment.ts";
import { ContentSet, norm, readLot } from "./lib.mjs";

const lot = readLot("13-objets-verite.md");
const set = new ContentSet("objets");
const section = (titre) => {
  const start = lot.indexOf(titre);
  if (start < 0) throw new Error(`Section absente du lot 13 : ${titre}`);
  const end = lot.indexOf("\n## ", start + titre.length);
  return lot.slice(start, end > 0 ? end : undefined).replace(/^## .*\n/, "").trim();
};
const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

set.entry("regle", "objets", "Objets de Vérité", {
  acces: section("## 3. Chapitre d'accès"),
  garde_fous: section("## 2. Garde-fous appliqués")
}, { summary: "Accès par réseau, glossaire des propriétés et six catalogues (lot 13)." });

// Glossaire : une ligne « | **Mot** | Règle | » par propriété (section 4).
const glossaire = section("## 4. Glossaire des propriétés");
let mots = 0;
for (const line of glossaire.split("\n")) {
  const m = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|$/);
  if (!m) continue;
  set.entry("glossaire", `glossaire_${slugify(m[1])}`, m[1], { mot: m[1], regle: m[2] });
  set.relation(["glossaire", `glossaire_${slugify(m[1])}`], ["regle", "objets"], "appartient_a");
  mots++;
}

// Catalogues : les sous-sections 5.x du lot, dans leur ordre.
const catalogues = section("## 5. Les catalogues");
const CHAPITRES = { 22: null, 23: "5.1", 24: "5.2", 25: "5.3", 26: "5.4", 27: "5.5" };
const titres = {};
for (const m of catalogues.matchAll(/^### (5\.\d) (.+)$/gm)) {
  titres[m[1]] = m[2].trim();
  set.entry("regle", `catalogue_${m[1].replace(".", "_")}`, m[2].trim(), {
    numero: m[1],
    texte: catalogues.slice(m.index).split(/\n### /)[0].replace(/^### .*\n/, "").trim()
  });
  set.relation(["regle", `catalogue_${m[1].replace(".", "_")}`], ["regle", "objets"], "appartient_a", Number(m[1].split(".")[1]));
}

let position = 0;
for (const item of truthEquipmentCatalog) {
  const type = item.referenceOnly ? "regle" : "objet";
  set.entry(type, item.id, item.name, {
    chapitre: item.chapter,
    section: item.section,
    statut_catalogue: item.status,
    origine: item.sourceKind,
    tags: item.tags,
    proprietes: item.properties,
    lore: item.lore || null,
    compendium: item.compendiumId,
    mj: item.requiresMj
  });
  const cat = CHAPITRES[item.chapter];
  set.relation([type, item.id], cat ? ["regle", `catalogue_${cat.replace(".", "_")}`] : ["regle", "objets"], "appartient_a", ++position);
}

const objets = set.entries.filter((e) => e.type === "objet").length;
console.log(`${set.write("build-objets.mjs", "./objets.sql")} ; ${objets} objets, ${truthEquipmentCatalog.length - objets} entrées-règles, ${mots} mots de glossaire, ${Object.keys(titres).length} catalogues.`);
