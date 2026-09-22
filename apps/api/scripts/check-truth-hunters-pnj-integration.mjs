import assert from "node:assert/strict";
import { COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES, COMPENDIUM_VERITE_HUNTERS_PNJ_NAVIGATION } from "../dist/compendium-verite-hunters-pnj.js";
const expected = new Map([["Association",18],["Xenoshield",5],["Chasseurs chrétiens",6],["Chasseurs musulmans",4],["Chasseurs hindouistes",4],["Chasseurs shientaoïstes",4],["Chasseurs kabbalistes",4],["Confréries",4],["Chasseurs extraterrestres",4],["Chasseurs fantastiques",4],["Chasseurs surnaturels",4]]);
assert.equal(COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES.length,61,"61 profils Chasseurs uniques attendus");
assert.equal(new Set(COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES.map(a=>a.id)).size,61,"IDs PNJ Chasseurs uniques");
assert.equal(COMPENDIUM_VERITE_HUNTERS_PNJ_NAVIGATION.length,61,"Navigation PNJ Chasseurs complète");
for(const [group,count] of expected)assert.equal(COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES.filter(a=>a.pnj?.source_group===group).length,count,`${group}: ${count} attendus`);
for(const article of COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES){
 assert.equal(article.category,"Personnages",`${article.id}: catégorie`);
 assert.equal(article.dataset,"verite-hunters-pnj",`${article.id}: dataset`);
 assert.notEqual(article.title,"?",`${article.id}: duplicata anonyme`);
 assert.ok(String(article.pnj?.source_extract??"").length>20,`${article.id}: source_extract absent`);
 assert.ok(Array.isArray(article.pnj?.identity_keys)&&article.pnj.identity_keys.length>0,`${article.id}: identité absente`);
 const mj=article.sections?.find(s=>s.id==="chasseurs-informations-mj");
 const stats=article.sections?.find(s=>s.id==="profil-statistique");
 assert.ok(mj&&mj.audience==="mj",`${article.id}: bloc MJ absent/non protégé`);
 assert.ok(stats&&stats.audience==="mj",`${article.id}: statistiques absentes/non protégées`);
 assert.deepEqual(stats.blocks,[],`${article.id}: statistiques inventées`);
 assert.ok(!("image" in article)&&!("illustration" in article),`${article.id}: portrait ajouté malgré passe lore-only`);
}
const identities=new Set();
for(const a of COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES){
 const real=String(a.pnj?.real_name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
 const truth=String(a.pnj?.nom_verite||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
 const key=`${real}|${truth}`;assert.ok(!identities.has(key),`Identité source dupliquée ${key}`);identities.add(key);
}
for(const title of ["Az","Hailey POWELL","Tia REYNOLDS","Neera Athren","sœur Maria","Verawati Yenny PRANOTO","Aymn SALIB","Zarey LYSENKO"])assert.ok(COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES.some(a=>a.title===title),`Profil attendu absent: ${title}`);
const truthCount=COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES.filter(a=>a.pnj?.source_verite?.length).length;
const realityCount=COMPENDIUM_VERITE_HUNTERS_PNJ_ARTICLES.filter(a=>a.sections?.some(s=>s.id==="chasseurs-informations-realite")).length;
console.log(`TRUTH HUNTERS PNJ OK — 61 profils uniques · ${truthCount} avec bloc MJ source · ${realityCount} avec Informations Réalité · stats vides · aucun portrait`);
