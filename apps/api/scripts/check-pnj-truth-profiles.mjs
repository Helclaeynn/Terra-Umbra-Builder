import assert from 'node:assert/strict';
import pg from 'pg';
import {NPC_TRUTH_TIERS} from '../dist/npc-truth-tiers.js';
import {INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS} from '../dist/compendium-pnj-truth-profiles.js';
import {REVIEWED_TRUTH_BATCH_001_IDS} from '../dist/compendium-pnj-truth-batch-001.js';
import {REVIEWED_TRUTH_BATCH_002_IDS} from '../dist/compendium-pnj-truth-batch-002.js';
import {REVIEWED_TRUTH_BATCH_003_IDS} from '../dist/compendium-pnj-truth-batch-003.js';
import {REVIEWED_TRUTH_BATCH_004_IDS} from '../dist/compendium-pnj-truth-batch-004.js';
import {REVIEWED_TRUTH_BATCH_005_IDS} from '../dist/compendium-pnj-truth-batch-005.js';
import {REVIEWED_TRUTH_BATCH_006_IDS} from '../dist/compendium-pnj-truth-batch-006.js';
import {STANDALONE_TRUTH_SECONDARY_IDS} from '../dist/compendium-pnj-truth-standalone.js';
import {terraUmbraCreationRules} from '../dist/rules/terra-umbra-creation.js';
pg.Pool.prototype.query = async () => ({rows:[],rowCount:0});
const corpus=await(await import('../dist/compendium.js')).getCompendiumQualityCorpus();
const byId=new Map(corpus.articles.map(person=>[person.id,person]));
const publicById=new Map(corpus.publicArticles.map(person=>[person.id,person]));
assert.deepEqual(NPC_TRUTH_TIERS.map(t=>t.minPtv),[0,6,13,25,41]);
assert.equal(corpus.articles.filter(article=>article.category==='Personnages'&&article.pnj?.completeness!=='portrait_only').length,918);
assert.equal(new Set(INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS).size,610);
assert.equal(REVIEWED_TRUTH_BATCH_001_IDS.length,98);
assert.equal(REVIEWED_TRUTH_BATCH_002_IDS.length,100);
assert.equal(REVIEWED_TRUTH_BATCH_003_IDS.length,100);
assert.equal(REVIEWED_TRUTH_BATCH_004_IDS.length,100);
assert.equal(REVIEWED_TRUTH_BATCH_005_IDS.length,100);
assert.equal(REVIEWED_TRUTH_BATCH_006_IDS.length,104);
for(const id of INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS)assert.ok(byId.has(id),id);
for(const id of [...REVIEWED_TRUTH_BATCH_001_IDS,...REVIEWED_TRUTH_BATCH_002_IDS,...REVIEWED_TRUTH_BATCH_003_IDS,...REVIEWED_TRUTH_BATCH_004_IDS,...REVIEWED_TRUTH_BATCH_005_IDS,...REVIEWED_TRUTH_BATCH_006_IDS]){
  const person=byId.get(id),publicPerson=publicById.get(id);
  const section=person.sections.find(section=>section.id==='profil-statistique');
  assert.equal(section.audience,'mj',id);
  assert.equal(person.sections.at(-1),section,id);
  const truthSection=person.sections.find(section=>section.id===`profil-verite-${id}`)
    ?? (section.blocks.some(block=>block.type==='table'&&block.rows[0]?.[0]==='Attribut révélé')?section:null);
  assert.ok(truthSection,id);
  const truth=truthSection.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Attribut révélé');
  const skills=truthSection.blocks.find(block=>block.type==='table'&&['Compétence de Vérité saillante','Compétence de Vérité révélée'].includes(block.rows[0]?.[0]));
  assert.equal(truth.rows[1].slice(1).length,5,id);
  assert.ok(truth.rows[1].slice(1).every(value=>Number.isInteger(Number(value))&&Number(value)>0),id);
  assert.ok(skills.rows.length>=4,id);
  assert.equal(truthSection.audience,'mj',id);
  if(section.blocks.some(block=>block.type==='table'&&block.rows[0]?.[0]==='Attribut'))
    assert.ok(truthSection.blocks.some(block=>block.type==='table'&&block.rows[0]?.[0]==='Valeur dérivée'),id);
  assert.ok(!publicPerson?.sections?.some(section=>section.id==='profil-statistique'),id);
  assert.ok(!publicPerson?.sections?.some(section=>section.id===`profil-verite-${id}`),id);
}
const quetzal=byId.get('personnages-verite-especes-quetzalcoatl');
assert.ok(byId.get('personnages-verite-especes-tokala')?.sections.some(section=>section.id==='profil-verite-tokala'&&section.audience==='mj'));
assert.ok(byId.get('personnages-verite-chasseurs-isabella-mironescu')?.sections.some(section=>section.id==='verite-indeterminee-isabella'&&section.audience==='mj'));
assert.ok(!publicById.get('personnages-verite-especes-tokala')?.sections.some(section=>section.id==='profil-verite-tokala'));
assert.ok(!publicById.get('personnages-verite-chasseurs-isabella-mironescu')?.sections.some(section=>section.id==='verite-indeterminee-isabella'));
assert.ok(quetzal.sections.some(section=>section.id==='profil-statistique'&&section.audience==='mj'&&section.title.includes('Vérité')));
assert.equal(quetzal.sections.at(-1)?.id,'profil-statistique');
assert.ok(!publicById.get(quetzal.id)?.sections.some(section=>section.id==='profil-verite-quetzalcoatl'));
const truthOnlyProfiles=corpus.articles.filter(article=>article.category==='Personnages'
  &&article.sections?.find(section=>section.id==='profil-statistique')?.title?.startsWith('Profil statistique · Vérité'));
assert.equal(truthOnlyProfiles.length,54);
assert.equal(STANDALONE_TRUTH_SECONDARY_IDS.length,52);
const canonicalSkills=new Set(terraUmbraCreationRules.skills.map(skill=>skill.name));
for(const person of truthOnlyProfiles){
  const stats=person.sections.find(section=>section.id==='profil-statistique');
  assert.ok(stats.blocks.length>=4||person.id===quetzal.id,person.id);
  assert.ok(!person.sections.some(section=>section.id===`profil-verite-${person.id}`),person.id);
}
for(const id of STANDALONE_TRUTH_SECONDARY_IDS){
  const stats=byId.get(id).sections.find(section=>section.id==='profil-statistique');
  const ranks=stats.blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Compétence de Vérité saillante').rows;
  assert.equal(ranks.length,13,id); // header, 11 individual ranks, other 14 at 0
  assert.equal(new Set(ranks.slice(1,-1).map(row=>row[0])).size,11,id);
  assert.ok(ranks.slice(1,-1).every(row=>canonicalSkills.has(row[0])&&Number.isInteger(Number(row[1]))&&Number(row[1])>=0),id);
  assert.deepEqual(ranks.at(-1),['Autres compétences canoniques (14)','0'],id);
  assert.ok(!stats.blocks.some(block=>block.type==='p'&&block.text.includes('ne sont pas encore chiffrées')),id);
}
const withoutCivilSkillTable=INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS.filter(id=>{
  const stats=byId.get(id).sections.find(section=>section.id==='profil-statistique');
  if(stats.title?.includes('Vérité'))return false;
  return !stats.blocks?.some(block=>block.type==='table'&&/^(Compétence|Compétences)$/.test(block.rows[0]?.[0]));
});
assert.deepEqual(withoutCivilSkillTable,[],'Truth profiles may inherit unlisted skills only when their Reality profile has actual ranks');
for(const id of INDIVIDUALLY_REVIEWED_TRUTH_PNJ_IDS){
  const article=byId.get(id);
  const ptv=article.sections.flatMap(section=>section.blocks||[])
    .filter(block=>block.type==='table'&&block.rows[0]?.[0]==='Talent de Vérité PNJ acheté');
  assert.equal(ptv.length,1,id);
  assert.ok([6,13,25,41,61].includes(Number(ptv[0].rows.at(-1)[1])),id);
  assert.equal(ptv[0].rows.slice(1,-1).reduce((sum,row)=>sum+Number(row[1]),0),Number(ptv[0].rows.at(-1)[1]),id);
  assert.ok(!publicById.get(id)?.sections?.some(section=>section.blocks?.some(block=>block.type==='table'&&block.rows[0]?.[0]==='Talent de Vérité PNJ acheté')),id);
}
const karina=byId.get('personnages-verite-humains-galactiques-karina-kelack');
assert.equal(karina.sections.find(section=>section.id==='profil-statistique').blocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Attribut révélé').rows[1].slice(1).join('/'),'10/10/12/13/11');
const karinaBlocks=karina.sections.find(section=>section.id==='profil-statistique').blocks;
const karinaSkills=karinaBlocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Compétence de Vérité révélée').rows.slice(1,-1);
assert.equal(karinaSkills.length,16);
assert.equal(karinaSkills.reduce((total,[,rank])=>total+Number(rank),0),170);
assert.deepEqual(karinaBlocks.find(block=>block.type==='table'&&block.rows[0]?.[0]==='Valeur dérivée').rows[1],['PV maximum / Seuil de Mort','28 / −18']);
assert.ok(!karinaBlocks.some(block=>block.type==='p'&&block.text.includes('ne sont pas encore chiffrées')));
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
