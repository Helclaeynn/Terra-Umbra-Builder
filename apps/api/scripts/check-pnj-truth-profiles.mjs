import assert from 'node:assert/strict';
import pg from 'pg';
import {NPC_TRUTH_TIERS} from '../dist/npc-truth-tiers.js';
pg.Pool.prototype.query = async () => ({rows:[],rowCount:0});
const corpus=await(await import('../dist/compendium.js')).getCompendiumQualityCorpus();
const byId=new Map(corpus.articles.map(person=>[person.id,person]));
const publicById=new Map(corpus.publicArticles.map(person=>[person.id,person]));
assert.deepEqual(NPC_TRUTH_TIERS.map(t=>t.minPtv),[0,6,13,25,41]);
assert.equal(corpus.articles.filter(article=>article.category==='Personnages').length,918);
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
