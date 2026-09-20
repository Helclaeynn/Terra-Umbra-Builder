import assert from "node:assert/strict";

import { terraUmbraTruthRules } from "../dist/rules/truth/rules.js";
import { getTalentRegistry, talentRegistryMeta } from "../dist/rules/talent-registry.js";

const expectedFleauIds = new Set([
  "fleau-vhodhal",
  "fleau-vaagor",
  "fleau-sharith",
  "fleau-vhadhi",
  "fleau-shaoggith",
  "fleau-thul"
]);

const equipment = terraUmbraTruthRules.equipment;
assert.equal(equipment.length, 229, "Truth equipment catalog must contain exactly 229 entries");
assert.equal(new Set(equipment.map((item) => item.id)).size, 229, "Truth equipment ids must be unique");
assert.ok(equipment.every((item) => item.compendiumId), "Every Truth equipment entry needs a Compendium target");

const corruption = terraUmbraTruthRules.corruption;
assert.equal(corruption.sources.length, 6, "Exactly six Fléau Sources are expected");
assert.equal(corruption.talents.length, 227, "Exactly 227 Fléau abilities are expected");
assert.equal(
  corruption.talents.reduce((sum, talent) => sum + Number(talent.cost || 0), 0),
  493,
  "Fléau catalog must total 493 PTV"
);
assert.equal(new Set(corruption.talents.map((talent) => talent.family)).size, 20, "Exactly 20 Fléau families are expected");
assert.ok(corruption.talents.every((talent) => talent.compendiumId), "Every Fléau ability needs a Compendium target");

const registry = getTalentRegistry();
const meta = talentRegistryMeta();
assert.equal(registry.length, 1412, "Truth Talent registry must contain 1185 native + 227 Fléau abilities");
assert.equal(meta.total, 1412, "Talent registry metadata total must be 1412");
assert.equal(new Set(registry.map((row) => row.talentId)).size, 1412, "Talent registry ids must be unique");

for (const natureId of expectedFleauIds) {
  assert.ok(meta.natures.includes(natureId), `Missing Fléau registry nature ${natureId}`);
  assert.ok(registry.some((row) => row.natureId === natureId), `No abilities registered for ${natureId}`);
}

const fleauRows = registry.filter((row) => row.natureId.startsWith("fleau-"));
assert.equal(fleauRows.length, 227, "Registry must expose all 227 Fléau abilities");
assert.ok(fleauRows.every((row) => row.compendiumId), "All Fléau registry rows need an editorial target");

const sourceByNature = new Map(corruption.sources.map((source) => [`fleau-${source.id}`, source]));
for (const row of fleauRows) {
  const source = sourceByNature.get(row.natureId);
  assert.ok(source, `Unknown registry source ${row.natureId}`);
  assert.equal(row.compendiumId, source.compendiumId, `${row.talentId}: wrong Compendium target`);
}

console.log(
  `TRUTH BUILDER INTEGRATION OK — ${equipment.length}/229 objets · ${corruption.talents.length}/227 capacités Fléaux · 493/493 PTV · 20/20 familles · ${registry.length}/1412 capacités au registre`
);
