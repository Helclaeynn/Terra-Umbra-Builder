import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
// Pure entry points create no database connection. API harnesses supply their URL.
process.env.DATABASE_URL??='postgresql://test:test@127.0.0.1:1/unused';
const {characterAttacks,combatAttackOptions,combatArmorModifier}=await import('../dist/campaign-combat.js');
import {blankPlayState,playProfile} from '../dist/rules/play-state.js';
import {blankNatureResources} from '../dist/rules/live-nature-resources.js';
import {createLiveEffect} from '../dist/rules/live-effects.js';
const state=()=>({...blankPlayState(),revelation:'r',hp:12,pa:3,initiative:20});
const build=()=>({attributes:{vigueur:5,agilite:2,esprit:3,volonte:4,charisme:3},creation:{sphere:'crawler'},skills:{melee:{style:3},tir:{style:8},pugilat:{style:4}},truth:{nature:'humain',consciousness:'initie',choices:{},truthTalents:[]},reality:{equipment:[],augmentations:[]}});
let data=build(),s=state();
data.reality.equipment=[{uid:'spear',itemId:'armes-melee-raven-sp-016-raven-spear'},{uid:'bow',itemId:'armes-melee-nextar-championship'},{uid:'gun-a',itemId:'armes-poing-tasers-owl-lt-015-incapaciteur'},{uid:'gun-b',itemId:'armes-poing-tasers-owl-lt-015-incapaciteur'}];
s.magazines={'gun-a':{remaining:1,capacity:10},'gun-b':{remaining:7,capacity:10}};
let options=characterAttacks(data,s),spear=options.find(w=>w.inventoryUID==='spear'),bow=options.find(w=>w.inventoryUID==='bow');
assert.equal(spear.skill,'melee');assert.equal(spear.attackMode,'melee');assert.equal(spear.modifier,playProfile(data,s).skills.find(k=>k.id==='melee').total);
assert.equal(bow.skill,'tir');assert.equal(bow.damage,7,'V+2 uses current Vigueur, not a static DGT or Agilité');
assert.deepEqual(options.filter(w=>w.label==='Owl LT-015 Incapaciteur').map(w=>[w.inventoryUID,w.remaining]).sort(),[['gun-a',1],['gun-b',7]]);
data.reality.augmentations=[{itemId:'augmentation-v9-ergot-griffes-g1'}];assert.equal(characterAttacks(data,s).find(w=>w.id==='augmentation-v9-ergot-griffes-g1').skill,'pugilat');
data.truth.truthEquipment=['verite-23-raven-sp-016-raven-spear','verite-25-fusil-a-plasma','invented-weapon'];options=characterAttacks(data,s);
assert.equal(options.find(w=>w.id==='truth:verite-23-raven-sp-016-raven-spear').skill,'melee');assert.equal(options.find(w=>w.id==='truth:verite-25-fusil-a-plasma').damageType,null,'Unknown Plasma vector requires an explicit ruling, not ballistic armour by inference');assert.equal(options.find(w=>w.id==='truth:verite-25-fusil-a-plasma').requiresAdjudication,true);assert.equal(options.some(w=>w.id.includes('invented-weapon')),false);
data={...build(),truth:{nature:'angelus',consciousness:'initie',choices:{angelNature:'domination',sephirah:'tiphereth',angelusBuild:{bladeForm:'ranged'}},truthTalents:[]}};s.natureResources=blankNatureResources();s.natureResources.angelus.bladeHp=2;
let blade=characterAttacks(data,s).find(w=>w.id==='angelus-celestial-blade');assert.equal(blade.skill,'tir');assert.equal(blade.attackMode,'ranged');assert.equal(blade.damage,9);assert.equal(characterAttacks(data,{...s,revelation:'sr'}).some(w=>w.id===blade.id),false);
data={...build(),truth:{nature:'daemon',consciousness:'initie',choices:{divinity:'belzebuth'},truthTalents:[]}};s.natureResources.daemon.formProperties=['weapon'];assert(characterAttacks(data,s).some(w=>w.id==='daemon-form-weapon'));assert.equal(characterAttacks(data,{...s,revelation:'sr'}).some(w=>w.id==='daemon-form-weapon'),false);
const actorId='npc',fx=(id,scope,amount,extra={})=>createLiveEffect({name:id,sourceId:'source',targetId:actorId,kind:'modifier',scope,amount,stackKey:id,stackMode:'sum',duration:{unit:'scene'},...extra},{id,round:1,targetActivation:0});
const npc={id:actorId,kind:'npc',round:1,data:{attributes:{vigueur:5,agilite:2},skills:{tir:8,melee:3},equipmentIds:['armes-poing-tasers-owl-lt-015-incapaciteur'],liveEffects:[fx('poison','physical',-3),fx('training','skill',2,{skill:'tir'}),fx('breach','armor',-2,{zone:'torso'}),fx('plate','armor',1)]}};
const shot=combatAttackOptions(npc).find(w=>w.weaponName==='Owl LT-015 Incapaciteur');assert.equal(shot.modifier,9);assert.equal(shot.components.bonus,-1);assert.equal(combatArmorModifier(npc),1);assert.equal(combatArmorModifier(npc,'torso'),-1);assert.equal(combatArmorModifier(npc,'head'),1);
console.log('REALITY COMBAT PURE OK — canonical current weapons, duplicate UID charges, Pugilat consumption key, ranged celestial blade, revealed form weapon and contextual NPC effects');

export async function checkRealityCombat({pool,call,player,manager,campaign,character}){
 const url=`/api/campaigns/${campaign}/combat`,send=(user,input,status=200)=>call(user,'POST',url,{requestId:randomUUID(),...input},status);
 const original=(await pool.query('SELECT data FROM characters WHERE id=$1',[character])).rows[0].data;
 const originalState=(await call(player,'GET',`/api/characters/${character}/play`)).state;
 const enhanced={...original,attributes:{...original.attributes,volonte:4},skills:{...original.skills,force_mentale:{style:4},neurodive:{style:4}},talents:{...original.talents,expertise:'mental_dacier'},truth:{nature:'humain',consciousness:'initie',choices:{},truthTalents:[]},reality:{equipment:[{uid:'defense-program',itemId:'castland',loaded:true},{uid:'gun',itemId:'armes-poing-tasers-owl-lt-015-incapaciteur'}],augmentations:[{itemId:'cablage_neuronal_g1'},{itemId:'defense_electronique_g1'}]}};
 const changed={...originalState,hp:12,pa:3,paPerRound:3,initiative:20,unconscious:false,revelation:'v',bonuses:[],contexts:[],disabled:[],effects:[],powers:[],registeredPowers:[],powerUses:{},neuroLoaded:['defense-program'],neuroBurned:[],magazines:{gun:{remaining:1,capacity:10}}};
 const npcId=randomUUID();
 try{
  await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[character,JSON.stringify(enhanced)]);
  await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[character,JSON.stringify(changed)]);
  const attack=async()=>{const eventId=randomUUID(),requestId=randomUUID();await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'roll',$4::jsonb,'{}',true)",[eventId,campaign,manager.id,JSON.stringify({total:20,narrativeFailure:false})]);await send(manager,{requestId,action:'attack',eventId,targetId:character,damage:1,bonusDamage:0,penetration:0,damageType:'neuro',attackMode:'margin',surprise:false});return requestId;};
  let attackId=await attack(),requestId=randomUUID();
  await send(player,{requestId,action:'defend',attackId,active:false,bonus:0,neuroProgramId:'defense-program'});
  let log=(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[requestId])).rows[0].payload;
  assert.equal(log.components.specialBonus,0,'A supplied Castland cannot boost passive Neuro defence for free');assert.equal(log.total,playProfile(enhanced,changed).neuroDefense);
  await send(manager,{action:'cancel',attackId});
  attackId=await attack();requestId=randomUUID();await send(player,{requestId,action:'defend',attackId,active:true,bonus:0,neuroProgramId:'defense-program'});
  log=(await pool.query('SELECT payload FROM campaign_live_events WHERE id=$1',[requestId])).rows[0].payload;
  assert.equal(log.components.defense,playProfile(enhanced,changed).skills.find(k=>k.id==='force_mentale').total+2,'Active Neuro defence retains the whole Force Mentale test and electronic defence');assert.equal(log.components.specialBonus,3);
  await send(manager,{action:'cancel',attackId});
  await pool.query("INSERT INTO campaign_live_combatants(id,campaign_id,source_kind,source_id,name,data,hp,pv_max,death,initiative_bonus,initiative,pa,visible) VALUES($1,$2,'npc',$3,'Target magazine',$4::jsonb,50,50,-10,3,20,3,true)",[npcId,campaign,randomUUID(),JSON.stringify({attributes:{vigueur:5,agilite:3,volonte:3},skills:{},equipmentIds:[]})]);
  const launch={requestId:randomUUID(),action:'launch',attackerId:character,targetId:npcId,optionId:'armes-poing-tasers-owl-lt-015-incapaciteur',bonus:0,bonusDamage:0,surprise:false};
  await send(player,launch);await send(player,launch);
  const after=(await call(player,'GET',`/api/characters/${character}/play`)).state;assert.equal(after.magazines.gun.remaining,0,'Launch retries charge ammunition exactly once');
  await send(player,{...launch,requestId:randomUUID()},400);
  const unchanged=(await call(player,'GET',`/api/characters/${character}/play`)).state;assert.equal(unchanged.pa,after.pa,'An empty magazine rejects before any PA payment');
  await send(manager,{action:'cancel',attackId:launch.requestId});
 }finally{
  await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[character,JSON.stringify(original)]);
  await pool.query('UPDATE character_play_states SET state=$2::jsonb WHERE character_id=$1',[character,JSON.stringify(originalState)]);
  await pool.query('DELETE FROM campaign_live_combatants WHERE id=$1',[npcId]);
 }
 console.log('REALITY COMBAT API OK — passive Neuro cannot borrow active program bonus, active Force Mentale includes talent bonus, ammunition launch replay and empty charge refusal');
}
