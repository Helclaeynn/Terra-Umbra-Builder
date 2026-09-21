import assert from "node:assert/strict";
import {
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_ID,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_SECTIONS,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_SOURCE,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_RELATIONS,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_SOURCE_PROFILE_COUNT,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_TEMPLE_COUNT
} from "../dist/compendium-verite-temples-daemoniaques.js";
import {
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_ARTICLES,
  COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_NAVIGATION
} from "../dist/compendium-verite-temples-daemoniaques-pnj.js";

assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_ID,"verite-v7-daemons-divinites-maisonnees-temples");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_SOURCE_PROFILE_COUNT,50,"50 fiches-source attendues");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_TEMPLE_COUNT,13,"13 Temples documentés attendus");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_SECTIONS.length,9,"9 enrichissements du hub Daemons attendus");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_SOURCE,"factions_Arbre de vie et angelus(2).pdf");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_RELATIONS.length,3,"3 liens PNJ Angelus ↔ Daemons explicites attendus");
assert.ok(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_RELATIONS.some(r=>r.daemonSourceId==="pnj-temples-daemoniaques-angelino-molina"&&r.angelusId==="personnages-verite-angelus-ragnil-sundstrom"),"Lien Arathim ↔ Apollyon absent");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_ANGELUS_RELATIONS.filter(r=>r.daemonSourceId==="pnj-temples-daemoniaques-jimmy-brazier").length,2,"Moloch doit avoir deux liens Angelus explicites");
const angelusLink=COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_HUB_SECTIONS.find(s=>s.id==="temples-daemoniaques-lien-angelus");
assert.ok(angelusLink,"Lien Angelus ↔ Daemons absent");
const angelusText=JSON.stringify(angelusLink);
for(const name of ["Belial","Mephisto","Astaroth","Belzébuth","Baal","Satan","Lilith","Lucifer","Diablo","Mammon"]) assert.ok(angelusText.includes(name),`Sacrifice Angelus absent: ${name}`);
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_ARTICLES.length,50,"50 PNJ source attendus");
assert.equal(new Set(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_ARTICLES.map(a=>a.id)).size,50,"IDs PNJ uniques");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_NAVIGATION.length,50,"Navigation PNJ source complète");

for(const article of COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_ARTICLES){
  const reality=article.sections?.find(s=>s.id==="temples-daemoniaques-realite");
  const mj=article.sections?.find(s=>s.id==="temples-daemoniaques-mj");
  const stats=article.sections?.find(s=>s.id==="profil-statistique");
  assert.ok(reality&&reality.audience!=="mj",article.id+" profil Réalité absent");
  assert.ok(mj&&mj.audience==="mj",article.id+" bloc MJ absent/non protégé");
  assert.ok(stats&&stats.audience==="mj",article.id+" statistiques absentes/non protégées");
  assert.deepEqual(stats.blocks,[],article.id+" statistiques inventées");
  assert.ok(!("image" in article)&&!("illustration" in article)&&!article.pnj?.portrait,article.id+" média ajouté");
  assert.ok(String(article.pnj?.source_extract??"").length>20,article.id+" source_extract absent");
  const pub=JSON.stringify((article.sections??[]).filter(s=>s.audience!=="mj"));
  for(const secret of ["Nom de la Vérité","Nature réelle","Divinité","Pouvoir principal","Titre infernal"]){
    assert.ok(!pub.includes(secret),article.id+" fuite publique: "+secret);
  }
}

const byReal=(name)=>COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_PNJ_ARTICLES.find(a=>a.pnj?.real_name===name);
const byleth=byReal("Nick Edison");
assert.ok(byleth,"Nick Edison absent");
assert.equal(byleth.pnj.nom_verite,"Byleth – Nikola Tesla","Nikola Tesla doit être Byleth");
assert.equal(byleth.pnj.nom_verite_source,"Balam – Nikola Tesla","Le champ brut Balam doit rester traçable");
assert.ok(!byleth.pnj.identity_keys.some(k=>String(k).trim().toLowerCase()==="balam"),"Balam ne doit pas servir de clé d'identité pour Nick Edison");

const abrasax=byReal("Miles Forest");
assert.ok(abrasax,"Miles Forest absent");
assert.ok(String(abrasax.pnj.nom_verite).includes("Abrasax"),"Abrasax doit rester l'identité canonique");
assert.ok(!abrasax.pnj.identity_keys.some(k=>["merlin","myrddin"].includes(String(k).trim().toLowerCase())),"Merlin/Myrddin seuls ne doivent jamais servir de clé de fusion");
assert.ok(abrasax.pnj.relations.includes("pnj-loges-mages-leslie-wright-34"),"Lien Abrasax -> Leslie Wright absent");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT.targetId,"pnj-loges-mages-leslie-wright-34");
assert.equal(COMPENDIUM_VERITE_TEMPLES_DAEMONIAQUES_LESLIE_ENRICHMENT.relationId,abrasax.id);

for(const [name,id] of [
  ["Naalnish","pnj-temples-daemoniaques-naalnish"],
  ["Jimmy Brazier","pnj-temples-daemoniaques-jimmy-brazier"],
  ["Angelino Molina","pnj-temples-daemoniaques-angelino-molina"],
  ["Max Sharp","pnj-temples-daemoniaques-max-sharp"],
  ["Kain Ferno","pnj-temples-daemoniaques-kain-ferno"]
]){
  const a=byReal(name);
  assert.ok(a&&a.id===id,`Source de fusion attendue absente: ${name}`);
}

console.log("TRUTH TEMPLES DAEMONIAQUES OK — 27 pages · 13 Temples · 50 fiches PNJ · lien Angelus croisé · Byleth/Tesla verrouillé · Abrasax/Leslie séparés · secrets MJ · stats vides · aucun média");
