// Génère infrastructure/content/equipement.sql : l'équipement et les
// augmentations de Réalité, tels que l'API les sert aujourd'hui
// (apps/api/src/rules/reality.ts), sans rien changer à une fiche.
//
//   node --import ./infrastructure/content/ts-register.mjs infrastructure/content/build-equipement.mjs
//
// Portée « equipement » : une entrée par objet (type equipement, augmentation),
// tous les champs servis au Builder dans `fields`, plus une entrée de règle
// pour l'économie (seuils, styles de vie). L'identifiant reste celui des fiches.
import { cpSync, mkdtempSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ContentSet } from "./lib.mjs";

// Mêmes fichiers que l'image de l'API (apps/api/Dockerfile, rules-data).
const repo = fileURLToPath(new URL("../../", import.meta.url));
const root = mkdtempSync(path.join(tmpdir(), "tuc-rules-data-"));
const copy = (from, to) => cpSync(path.join(repo, from), path.join(root, to));
copy("compendium/source/current-equipment-catalog-v1.json", "current-equipment-catalog-v1.json");
mkdirSync(path.join(root, "lore"));
for (const name of readdirSync(path.join(repo, "compendium/source"))) {
  if (/^reality-lore-v3-.*\.json$/.test(name)) copy(`compendium/source/${name}`, `lore/${name}`);
}
copy("character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64", "augmentations.json.gz.b64");
copy("character-builder/rulesets/terra-umbra/reality/safe/neuroprograms.part01.b64", "neuroprograms.part01.b64");
copy("character-builder/rulesets/terra-umbra/reality/safe/vehicles.part01.b64", "vehicles.part01.b64");
process.env.TUC_REALITY_RULES_ROOT = root;

const { getRealityRules } = await import("../../apps/api/src/rules/reality.ts");
const reality = getRealityRules();
rmSync(root, { recursive: true, force: true });

const set = new ContentSet("equipement");
set.entry("regle", "economie", "Économie de Réalité", { economy: reality.economy, source: reality.source },
  { summary: "Seuil d'achat avancé, remboursement de l'enveloppe, styles de vie." });

let position = 0;
for (const [type, list] of [["equipement", reality.equipment], ["augmentation", reality.augmentations]]) {
  for (const item of list) {
    const { id, name, ...fields } = item;
    set.entry(type, id, name ?? id, fields);
    set.relation([type, id], ["regle", "economie"], "appartient_a", ++position);
  }
}

const count = (type) => set.entries.filter((e) => e.type === type).length;
set.write("build-equipement.mjs", "./equipement.sql");
console.log(`equipement.sql : ${count("equipement")} équipements, ${count("augmentation")} augmentations (API : ${reality.counts.equipment} et ${reality.counts.augmentations}).`);
