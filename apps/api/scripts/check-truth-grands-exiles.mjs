import assert from "node:assert/strict";
import { COMPENDIUM_VERITE_GRANDS_EXILES_HUB_SECTIONS, COMPENDIUM_VERITE_GRANDS_EXILES_ARTICLES, COMPENDIUM_VERITE_GRANDS_EXILES_HUNTER_ENRICHMENT, COMPENDIUM_VERITE_GRANDS_EXILES_SOURCE_PROFILE_COUNT, COMPENDIUM_VERITE_GRANDS_EXILES_UNIQUE_PNJ_COUNT } from "../dist/compendium-verite-grands-exiles.js";
import { COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES, COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_NAVIGATION } from "../dist/compendium-verite-grands-exiles-pnj.js";
assert.equal(COMPENDIUM_VERITE_GRANDS_EXILES_SOURCE_PROFILE_COUNT,56);
assert.equal(COMPENDIUM_VERITE_GRANDS_EXILES_UNIQUE_PNJ_COUNT,55);
assert.equal(COMPENDIUM_VERITE_GRANDS_EXILES_HUB_SECTIONS.length,5);
assert.equal(COMPENDIUM_VERITE_GRANDS_EXILES_ARTICLES.length,7);
assert.equal(COMPENDIUM_VERITE_GRANDS_EXILES_HUNTER_ENRICHMENT.targetId,"verite-v7-chasseurs-doctrine-association-traditions");
assert.equal(COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES.length,55);
assert.equal(new Set(COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES.map(a=>a.id)).size,55);
assert.equal(COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_NAVIGATION.length,55);
for(const a of COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES){
  const mj=a.sections?.find(s=>s.id==="grands-exiles-informations-mj");
  const stats=a.sections?.find(s=>s.id==="profil-statistique");
  assert.ok(mj&&mj.audience==="mj",a.id+" bloc MJ");
  assert.ok(stats&&stats.audience==="mj",a.id+" stats");
  assert.deepEqual(stats.blocks,[],a.id+" stats inventées");
  assert.ok(!("image" in a)&&!("illustration" in a)&&!a.pnj?.portrait,a.id+" média");
  assert.ok(String(a.pnj?.source_extract??"").length>20,a.id+" source");
  assert.ok(Array.isArray(a.pnj?.identity_keys)&&a.pnj.identity_keys.length>0,a.id+" identité");
  const pub=JSON.stringify((a.sections??[]).filter(s=>s.audience!=="mj"));
  assert.ok(!pub.includes("Nom de la Vérité"),a.id+" fuite nom Vérité");
  assert.ok(!pub.includes("Nature réelle"),a.id+" fuite nature");
}
const gaar=COMPENDIUM_VERITE_GRANDS_EXILES_PNJ_ARTICLES.find(a=>String(a.pnj?.nom_verite??"").toLowerCase().includes("gaar"));
assert.ok(gaar);
assert.equal(gaar.pnj.source_occurrences,2);
assert.ok(gaar.pnj.source_groups.includes("Syndicat de Jade")&&gaar.pnj.source_groups.includes("Hordes orques"));
for(const title of [
 "Conseil des Anciens — Silcenters & gouvernement des Exilés",
 "Syndicat de Jade — peuples dits nuisibles & Underlife exilée",
 "Croix d’Emphyrra — Fédération elfique",
 "Hordes orques — politique, foi & héritage thulkar",
 "Enfants de Nidavellir — Nibelungen, Duergars & factions whurtennes",
 "Ligue des Quatre Empereurs — puissance gobeline & influence",
 "Cercle Écarlate — Astharès, Gaerras & projet du Nor"
])assert.ok(COMPENDIUM_VERITE_GRANDS_EXILES_ARTICLES.some(a=>a.title===title),"Page absente: "+title);
console.log("TRUTH GRANDS EXILES OK — 43 pages source · 7 pages lore · 56 fiches-source / 55 PNJ uniques · secrets MJ · stats vides · aucun média");
