import assert from 'node:assert/strict';
import {NPC_CATALOG as c,NPC_PRESETS,generateNpc,generateNpcBatch} from '../dist/campaign-npc-generator.js';
import {validNpcData,npcBudgetIssues,cleanNpcData} from '../dist/campaign-npc-model.js';
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

const {NPC_FIRST_NAMES,NPC_LAST_NAMES,NPC_APPEARANCE,NPC_PERSONALITY,NPC_MOTIVATIONS,NPC_HOOKS}=await import('../dist/npc-flavor.js');
const {canonicalNpcDraft}=await import('../dist/canonical-npc-draft.js');
assert.deepEqual(Object.values(NPC_FIRST_NAMES).map(a=>a.length),[64,64,32]);
assert.equal(new Set(Object.values(NPC_FIRST_NAMES).flat()).size,160);
assert.equal(NPC_LAST_NAMES.length,96);
for(const list of [...Object.values(NPC_FIRST_NAMES),NPC_LAST_NAMES,...Object.values(NPC_APPEARANCE),...Object.values(NPC_PERSONALITY),NPC_MOTIVATIONS,NPC_HOOKS])assert.equal(new Set(list).size,list.length);
assert.deepEqual(c.variety,{names:15360,appearances:13824,personalities:576,motivations:32,secrets:32});
const refNpc=generateNpc('elite','enqueteur','sex-independent');
for(const sex of ['male','female','other','unspecified']){
 const n=generateNpc('elite','enqueteur','sex-independent','',sex);
 assert.equal(n.sex,sex);assert.ok(validNpcData(n,c));
 for(const key of ['attributes','skills','talentIds','appearance','personality','motivation','secret'])assert.deepEqual(n[key],refNpc[key]);
 const pool=sex==='male'||sex==='female'?[...NPC_FIRST_NAMES[sex],...NPC_FIRST_NAMES.neutral]:sex==='other'?NPC_FIRST_NAMES.neutral:Object.values(NPC_FIRST_NAMES).flat();
 assert.ok(pool.includes(n.name.split(' ')[0]));
}
const legacy={...refNpc};delete legacy.sex;assert.ok(validNpcData(legacy,c));assert.equal(cleanNpcData(legacy).sex,'unspecified');assert.ok(!validNpcData({...legacy,sex:'bad'},c));
const request={tierId:'elite',presetId:'garde',seed:'batch',count:10,faction:''};
assert.equal(generateNpcBatch(request).length,10);assert.equal(generateNpcBatch({...request,sex:'bad'}),null);
assert.ok(generateNpcBatch({...request,sex:'female'}).every(n=>n.sex==='female'));
const sample=Array.from({length:200},(_,i)=>generateNpc('lambda','civil','variety'+i));
for(const key of ['name','appearance','personality'])assert.ok(new Set(sample.map(n=>n[key])).size>120,key);
const npc={...refNpc,faction:'PRIVATE FACTION',secret:'PRIVATE SECRET',truthNotes:'PRIVATE TRUTH',portrait:'data:image/png;base64,test'};
const draft=canonicalNpcDraft(npc),pub=JSON.stringify(draft.sections.filter(s=>s.audience!=='mj')),mj=JSON.stringify(draft.sections.filter(s=>s.audience==='mj'));
for(const value of ['PRIVATE FACTION','PRIVATE SECRET','PRIVATE TRUTH']){assert.ok(!pub.includes(value));assert.ok(mj.includes(value));}
assert.equal(draft.pnj.portrait,npc.portrait);assert.equal(draft.pnj.protect_truth_metadata,true);
const rows=draft.sections[2].blocks.filter(b=>b.type==='table').flatMap(b=>b.rows);
assert.deepEqual(rows.find(r=>r[0]==='PV'),['PV',String(2*npc.attributes.vigueur+npc.skills.constitution)]);
console.log('NPC VARIETY OK — unique name pools, counts, sex independent of mechanics, legacy profiles, batch validation, private canonical draft and shared derived statistics');
