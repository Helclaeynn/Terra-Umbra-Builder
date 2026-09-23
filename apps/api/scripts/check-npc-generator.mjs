import assert from 'node:assert/strict';
import {NPC_CATALOG as c,NPC_PRESETS,generateNpc} from '../dist/campaign-npc-generator.js';
import {validNpcData,npcBudgetIssues} from '../dist/campaign-npc-model.js';
import {COMPENDIUM_PNJ_TALENTS_ARTICLE as article} from '../dist/compendium-pnj-stat-profiles.js';
import {validScenes,cleanScenes} from '../dist/campaign-preparation.js';
for(const p of NPC_PRESETS){
 assert.ok(p.skills.every(id=>c.skills.some(s=>s.id===id)));
 assert.ok(p.attributes.every(id=>c.attributes.some(s=>s.id===id)));
 for(const t of c.tiers)for(let seed=0;seed<30;seed++){
  const n=generateNpc(t.id,p.id,String(seed));
  assert.ok(validNpcData(n,c),JSON.stringify({t,p,issues:npcBudgetIssues(n)}));
  assert.equal(Object.values(n.attributes).reduce((a,b)=>a+b,0),t.attributes);
  assert.equal(Object.values(n.skills).reduce((a,b)=>a+b,0),t.skills);
  assert.ok(Object.values(n.skills).every(v=>v<=t.cap));
  assert.equal(n.apexSkill,'');assert.equal(n.truthNotes,'');assert.equal(n.armor,0);
  assert.ok(n.talentIds.every(id=>c.talents.some(t=>t.id===id)));
  assert.deepEqual(n,generateNpc(t.id,p.id,String(seed)));
 }
}
const table=article.sections.find(s=>s.id==='echelle').blocks[0].rows;
for(const t of c.tiers)assert.ok(table.some(row=>row[0]===t.name&&row[1]===String(t.attributes)&&row[2]===String(t.skills)&&row[3]===String(t.cap)));
let n=generateNpc('heroique','garde','apex');
n.skills=Object.fromEntries(c.skills.map(s=>[s.id,0]));n.talentIds=[];n.skills.tir=15;n.apexSkill='tir';n.apexReason='Tir de précision';
assert.ok(validNpcData(n,c));assert.ok(!validNpcData({...n,apexReason:''},c));assert.ok(!validNpcData({...n,tierId:'elite'},c));
assert.ok(!validNpcData({...n,skills:{...n.skills,melee:15}},c));
assert.ok(!validNpcData({...n,armor:NaN},c));assert.ok(!validNpcData({...n,attributes:{...n.attributes,vigueur:-1}},c));
for(const id of ['Enveloppe vide','toString','__proto__',null,{}])assert.ok(!validNpcData({...n,talentIds:[id]},c));
const id='11111111-1111-4111-8111-111111111111',ref={npcId:id,articleId:'campaign-npc:'+id,title:'Contact',category:'PNJ de campagne',quantity:2,notes:''};
const scenes=[{id:'scene',title:'Rencontre',notes:'',done:false,references:[ref]}];
assert.ok(validScenes(scenes));assert.equal(cleanScenes(scenes)[0].references[0].npcId,id);
assert.ok(!validScenes([{...scenes[0],references:[{...ref,npcId:undefined}]}]));
assert.ok(!validScenes([{...scenes[0],references:[{...ref,articleId:'other'}]}]));
console.log('NPC GENERATOR OK — 1920 profiles, canonical budgets/caps, defined expertise, explicit Apex, no unique powers, valid scene references');
