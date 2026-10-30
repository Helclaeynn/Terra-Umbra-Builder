import assert from 'node:assert/strict';
process.env.DATABASE_URL ||= 'postgres://fixture:fixture@127.0.0.1:1/fixture';
const {pool} = await import('../dist/db.js');
// Read-only corpus fixture. Never connect to or alter user data.
pool.query = async () => ({rows:[],rowCount:0});
const {getCompendiumQualityCorpus} = await import('../dist/compendium.js');
const {applyBestiaryBalance,bestiaryProgressionTiers,BESTIARY_ENCOUNTER_GUIDE_ID} = await import('../dist/compendium-bestiary-balance.js');
const corpus=await getCompendiumQualityCorpus();
const {bestiaryBalanceData}=await import('../dist/compendium-bestiary-balance-data.js');
const byId=new Map(corpus.articles.map(a=>[a.id,a]));
const entryIds=new Set(bestiaryBalanceData.map(a=>a.id));
const entries=corpus.articles.filter(a=>entryIds.has(a.id));
assert.equal(entries.length,281,'Entire existing bestiary retained');
assert.equal(corpus.articles.filter(a=>a.category==='Bestiaire').length,281,'Guide is not an additional creature');
for(const a of entries){
 const s=a.sections.find(s=>s.id==='rencontres-recommandees');
 assert.ok(s,a.id+' has encounter advice');assert.equal(s.audience,'mj');
 assert.equal(new Set(a.sections.map(s=>s.id)).size,a.sections.length,a.id+' unique sections');
 const rows=s.blocks.filter(b=>b.type==='table').flatMap(b=>b.rows);
 for(const row of rows)assert.ok(row.every(v=>typeof v==='string'&&v.length),'No missing recommendation cells '+a.id);
 const publicId=a.id==='bestiaire-v15-delanial-le-faux-septieme-fleau'?'bestiaire-v15-delanial-pere-de-l-ombre':a.id;
 const publicArticle=corpus.publicArticles.find(p=>p.id===publicId);
 if(a.audience==='mj'){assert.equal(publicArticle,undefined);continue;}
 assert.ok(publicArticle);assert.ok(publicArticle.sections.every(s=>s.audience!=='mj'));
 assert.doesNotMatch(JSON.stringify(publicArticle),/rencontres-recommandees|variante-balance|G5_35XP|MENACE INDIVIDUELLE/,'No player leak '+a.id);
}
const text=(id,section='dossier-mj')=>byId.get(id).sections.find(s=>s.id===section).blocks.map(b=>b.text||'').join('\n');
assert.match(text('bestiaire-v15-soldato'),/DÉF\. PHYSIQUE 8 .*PV 16/);
assert.match(text('bestiaire-v15-soldato'),/INITIATIVE 1d10e \+ 8/);
assert.match(text('bestiaire-v15-soldato'),/DGT 11/);
assert.match(text('bestiaire-v15-soldato'),/Pour 1 PA.*Assistance normale/);
assert.match(text('bestiaire-v15-leviathan-de-bassin'),/marge de 6 ou plus/);
assert.doesNotMatch(text('bestiaire-v15-leviathan-de-bassin'),/DR 6\+/);
assert.match(text('bestiaire-v15-momie'),/PV 24/,'Original small-party specimen retained');
assert.match(text('bestiaire-v15-momie','variante-balance-endurcie'),/PV 30/);
assert.match(text('bestiaire-v15-momie','variante-balance-superieure'),/DÉF\. PHYSIQUE 10 .*PV 40 .*ARMURE 5/);
assert.match(text('bestiaire-v15-momie','variante-balance-superieure'),/ACTIONS 3 PA/);
assert.match(text('bestiaire-v15-traqueur-de-soute'),/PV 11/);
assert.match(text('bestiaire-v15-traqueur-de-soute','variante-balance-endurcie'),/PV 15/);
assert.equal(entries.filter(a=>a.sections.some(s=>s.id==='variante-balance-endurcie')).length,13);
assert.equal(entries.filter(a=>a.sections.some(s=>s.id==='variante-balance-superieure')).length,4);
assert.equal(bestiaryProgressionTiers.length,7);
assert.equal(byId.get(BESTIARY_ENCOUNTER_GUIDE_ID).audience,'mj');
assert.equal(byId.get(BESTIARY_ENCOUNTER_GUIDE_ID).category,'Règles');
assert.equal(corpus.publicArticles.some(a=>a.id===BESTIARY_ENCOUNTER_GUIDE_ID),false);
const guide=JSON.stringify(byId.get(BESTIARY_ENCOUNTER_GUIDE_ID));
assert.match(guide,/Les colonnes XP et PTV sont indépendantes/);
assert.match(guide,/encore sans effectifs chiffrés validés/,'Unmeasured tiers not misrepresented');
// Repeated pass must not duplicate variants or increase their stats.
const cloned=new Map(entries.map(a=>[a.id,structuredClone(a)]));
applyBestiaryBalance(cloned);const once=JSON.stringify([...cloned]);applyBestiaryBalance(cloned);
assert.equal(JSON.stringify([...cloned]),once);
console.log('BESTIARY OK — 281 preserved entries, 281 private encounter cards, 7 independent XP/PTV tiers, 13 endurance variants, 4 superior profiles, revised Soldato/traction, no public leak or stacked variants');
