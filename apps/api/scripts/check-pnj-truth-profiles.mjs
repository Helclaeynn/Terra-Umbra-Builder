import assert from 'node:assert/strict';
import pg from 'pg';
import {NPC_TRUTH_TIERS} from '../dist/npc-truth-tiers.js';
import {INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS} from '../dist/compendium-pnj-truth-profiles.js';
import {REVIEWED_TRUTH_BATCH_001_IDS} from '../dist/compendium-pnj-truth-batch-001.js';
import {REVIEWED_TRUTH_BATCH_002_IDS} from '../dist/compendium-pnj-truth-batch-002.js';
import {REVIEWED_TRUTH_BATCH_003_IDS} from '../dist/compendium-pnj-truth-batch-003.js';
import {REVIEWED_TRUTH_BATCH_004_IDS} from '../dist/compendium-pnj-truth-batch-004.js';
import {REVIEWED_TRUTH_BATCH_005_IDS} from '../dist/compendium-pnj-truth-batch-005.js';
pg.Pool.prototype.query = async () => ({rows:[],rowCount:0});
const corpus=await(await import('../dist/compendium.js')).getCompendiumQualityCorpus();
const byId=new Map(corpus.articles.map(person=>[person.id,person]));
const publicById=new Map(corpus.publicArticles.map(person=>[person.id,person]));
assert.deepEqual(NPC_TRUTH_TIERS.map(t=>t.minPtv),[0,6,13,25,41]);
assert.equal(corpus.articles.filter(article=>article.category==='Personnages').length,918);
assert.equal(new Set(INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS).size,505);
assert.equal(REVIEWED_TRUTH_BATCH_001_IDS.length,98);
assert.equal(REVIEWED_TRUTH_BATCH_002_IDS.length,100);
assert.equal(REVIEWED_TRUTH_BATCH_003_IDS.length,100);
assert.equal(REVIEWED_TRUTH_BATCH_004_IDS.length,100);
assert.equal(REVIEWED_TRUTH_BATCH_005_IDS.length,100);
for(const id of INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS)assert.ok(byId.has(id),id);
for(const id of [...REVIEWED_TRUTH_BATCH_001_IDS,...REVIEWED_TRUTH_BATCH_002_IDS,...REVIEWED_TRUTH_BATCH_003_IDS,...REVIEWED_TRUTH_BATCH_004_IDS,...REVIEWED_TRUTH_BATCH_005_IDS]){
  const person=byId.get(id),publicPerson=publicById.get(id);
  const section=person.sections.find(section=>section.id==='profil-statistique');
  assert.equal(section.audience,'mj',id);
  assert.equal(person.sections.at(-1),section,id);
  const truthSection=person.sections.find(section=>section.id===`profil-verite-${id}`);
  assert.ok(truthSection,id);
  const truth=truthSection.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Attribut révélé');
  const skills=truthSection.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Compétence de Vérité saillante');
  assert.equal(truth.rows[1].slice(1).length,5,id);
  assert.ok(truth.rows[1].slice(1).every(value=>Number.isInteger(Number(value))&&Number(value)>0),id);
  assert.ok(skills.rows.length>=4,id);
  assert.equal(truthSection.audience,'mj',id);
  assert.ok(!publicPerson?.sections?.some(section=>section.id==='profil-statistique'),id);
  assert.ok(!publicPerson?.sections?.some(section=>section.id===`profil-verite-${id}`),id);
}
const quetzal=byId.get('personnages-verite-especes-quetzalcoatl');
assert.ok(quetzal.sections.some(section=>section.id==='profil-verite-quetzalcoatl'&&section.audience==='mj'));
assert.equal(quetzal.sections.at(-1)?.id,'profil-statistique');
assert.ok(!publicById.get(quetzal.id)?.sections.some(section=>section.id==='profil-verite-quetzalcoatl'));
for(const id of ['personnages-verite-especes-neeba-ngubenani','pnj-142-dan-harrington']){
  const person=byId.get(id),publicPerson=publicById.get(id);
  const stats=person?.sections.find(section=>section.id==='profil-statistique');
  assert.equal(stats?.audience,'mj',id);
  assert.ok(stats.blocks.length>=10,id);
  assert.ok(!publicPerson?.sections.some(section=>section.id==='profil-statistique'),id);
  assert.ok(!JSON.stringify(publicPerson).includes(id.includes('neeba')?'Oba Okunkun':'Dragoy Skotia'),id);
}
for(const id of ['personnages-verite-especes-elody-katherine-skotia','personnages-verite-especes-ming-xinya']){
  const person=byId.get(id),publicPerson=publicById.get(id);
  const stats=person?.sections.find(section=>section.id==='profil-statistique');
  const stage=stats.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='État');
  const skillRows=stats.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Compétence de Vérité révélée').rows.slice(1);
  assert.equal(stats.audience,'mj',id);
  assert.ok(!publicPerson?.sections.some(section=>section.id==='profil-statistique'),id);
  for(const row of stage.rows.slice(1))assert.equal(row.slice(4).reduce((sum,v)=>sum+Number(v),0),Number(row[2]),id);
  assert.equal(skillRows.reduce((sum,row)=>sum+Number(row[1]),0),185,id);
}
for(const id of ['pnj-fleaux-focus-olayinka-najja-8-olayinka-najja','personnages-verite-especes-megda-ayshin']){
  const stats=byId.get(id)?.sections.find(section=>section.id==='profil-statistique');
  const stage=stats.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='État');
  const skills=stats.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Compétence de Vérité révélée').rows.slice(1);
  assert.equal(stats.audience,'mj',id);
  assert.ok(!publicById.get(id)?.sections.some(section=>section.id==='profil-statistique'),id);
  for(const row of stage.rows.slice(1))assert.equal(row.slice(4).reduce((sum,v)=>sum+Number(v),0),Number(row[2]),id);
  assert.equal(skills.reduce((sum,row)=>sum+Number(row[1]),0),170,id);
}
for(const id of ['personnages-verite-especes-neeba-ngubenani','pnj-142-dan-harrington']){
  const profile=byId.get(id).sections.find(section=>section.id==='profil-statistique');
  const skills=profile.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Compétence de Vérité révélée').rows.slice(1);
  assert.equal(skills.find(row=>row[0]==='Pugilat')?.[1],id.includes('neeba')?'15':'17',id);
  assert.equal(skills.reduce((sum,row)=>sum+Number(row[1]),0),170,id);
}
for(const id of ['personnages-verite-especes-neeba-ngubenani','pnj-142-dan-harrington']){
  const stage=byId.get(id).sections.find(section=>section.id==='profil-statistique').blocks
    .find(block=>block.type==='table'&&block.rows[0]?.[0]==='État');
  assert.deepEqual(stage.rows.slice(1).map(row=>Number(row[3])),id.includes('neeba')?[110,140,170]:[75,140,170]);
  for(const row of stage.rows.slice(1))assert.equal(row.slice(4).reduce((sum,v)=>sum+Number(v),0),Number(row[2]));
}
console.log('PNJ Truth profiles: staged budgets, Dragoy Pugilat, and MJ privacy pass.');
