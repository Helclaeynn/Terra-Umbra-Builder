import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';
import {randomUUID} from 'node:crypto';
import {blankCharacterData} from '../dist/character-data.js';
import {blankPlayState} from '../dist/rules/play-state.js';
import {itemProtectionWithResources,consumeAblativeImpact,ablativeModuleReduction,restoreAblativeItem,truthGuardItems,truthGuardItemProfile,consumeBrigandineGuard,consumeGuardToken,prepareTruthWeaponUse,truthWeaponResourceProfile,liveItemResourceProfile,configureTruthWeaponReserve} from '../dist/rules/live-item-resources.js';
import {realityProtection} from '../dist/rules/live-reality.js';
import {getRealityRules} from '../dist/rules/reality.js';
const catalog=getRealityRules();
const truthCatalog=JSON.parse(zlib.gunzipSync(Buffer.from(fs.readFileSync('../../compendium/source/verite-catalog-v6.json.gz.b64','utf8'),'base64'))).entries;
const entry=id=>truthCatalog.find(p=>p.id===id);
assert(entry(truthGuardItems.brigandine).rows.some(r=>r[1].includes('réduite de 3')));
assert(entry(truthGuardItems.token).rows.some(r=>r[1].includes('réduit ces dégâts de 2')));
const fresh=()=>({pa:3,initiative:20,hp:30,activation:1,powerUses:{}});
const protection=(id,uid=id)=>({id:uid,itemId:id,...realityProtection(catalog.equipment.find(p=>p.id===id))});
const punk=protection('armures-basiques-byron-punk-life','coat-a'),copy=protection('armures-basiques-byron-punk-life','coat-b');
let state=fresh();assert.equal(itemProtectionWithResources(state,punk).ablativeRemaining,4);
assert.deepEqual(consumeAblativeImpact(state,[punk],{hit:false,material:true,vector:'melee'}),[]);
assert.deepEqual(consumeAblativeImpact(state,[punk],{hit:true,material:false,vector:'melee'}),[]);
assert.deepEqual(consumeAblativeImpact(state,[punk],{hit:true,material:true,vector:'antichoc'}),[]);
for(let i=0;i<4;i++)assert.equal(consumeAblativeImpact(state,[punk,punk],{hit:true,material:true,vector:'melee'}).length,1);
assert.equal(itemProtectionWithResources(state,punk).reductions.melee,0);
assert.equal(itemProtectionWithResources(state,punk).reductions.antichoc,1,'Permanent Antichoc survives depletion');
assert.equal(itemProtectionWithResources(state,copy).reductions.melee,1,'Owned copies carry separate resources');
state.powerUses={};state.activation++;assert.equal(itemProtectionWithResources(state,punk).ablativeRemaining,0,'Scene, scenario and activation quotas never refill an armour');
const data={reality:{equipment:[{uid:'coat-a',itemId:punk.itemId,quantity:1}]},truth:{truthEquipment:[truthGuardItems.brigandine,truthGuardItems.token]}};
assert.throws(()=>restoreAblativeItem(data,state,{itemId:'coat-a',replacementAvailable:true},{inCombat:true,manager:false}),/ablative_requires_manager/);
assert.throws(()=>restoreAblativeItem(data,state,{itemId:'coat-b',replacementAvailable:true},{inCombat:false,manager:false}),/ablative_item_unavailable/);
assert.throws(()=>restoreAblativeItem(data,state,{itemId:'coat-a'},{inCombat:false,manager:false}),/ablative_replacement_required/);
assert.equal(restoreAblativeItem(data,state,{itemId:'coat-a',replacementAvailable:true},{inCombat:false,manager:false}).after,4);
assert.throws(()=>restoreAblativeItem(data,state,{itemId:'coat-a',replacementAvailable:true},{inCombat:false,manager:false}),/ablative_already_full/);
const plate=protection('modules-d-armure-plaques-ablatives','plate-a');
assert.throws(()=>ablativeModuleReduction(state,[plate,punk],'melee',{},true),/ablative_host_required/);
assert.equal(ablativeModuleReduction(state,[plate,punk],'occulte',{hostId:'coat-a',mountedConfirmed:true},true).reduction,0);
assert.equal(ablativeModuleReduction(state,[plate,punk],'electricite',{},false).reduction,0,'Physical plates never protect against Foudre automatically');
let module=ablativeModuleReduction(state,[plate,punk],'melee',{hostId:'coat-a',mountedConfirmed:true},true);
assert.equal(module.reduction,1);assert.equal(consumeAblativeImpact(state,[plate,punk],{hit:true,material:true,vector:'melee',moduleId:module.moduleId}).length,2);
module=ablativeModuleReduction(state,[plate,punk],'melee',{hostId:'coat-a',mountedConfirmed:true},true);consumeAblativeImpact(state,[plate,punk],{hit:true,material:true,vector:'melee',moduleId:module.moduleId});
assert.equal(ablativeModuleReduction(state,[plate,punk],'melee',{hostId:'coat-a',mountedConfirmed:true},true).reduction,0);
state=fresh();for(const ctx of [{worn:false,supernatural:true,hit:true,damage:9},{worn:true,supernatural:false,hit:true,damage:9},{worn:true,supernatural:true,hit:false,damage:9},{worn:true,supernatural:true,hit:true,damage:0}])assert.equal(consumeBrigandineGuard(data,state,ctx),0);
assert.equal(consumeBrigandineGuard(data,state,{worn:true,supernatural:true,hit:true,damage:2}),2);
assert.equal(truthGuardItemProfile(data,state).brigandine.available,false);
assert.equal(consumeBrigandineGuard(data,state,{worn:true,supernatural:true,hit:true,damage:9}),0);
state.powerUses={};assert.equal(truthGuardItemProfile(data,state).brigandine.available,true,'New scenario restores stabilised rune through scenario quota reset');
assert.throws(()=>consumeGuardToken(data,state,{supernatural:false,damage:9,reactionAllowed:true}),/guard_token_not_applicable/);
assert.throws(()=>consumeGuardToken(data,state,{supernatural:true,damage:9,reactionAllowed:false}),/guard_token_reaction_unavailable/);
assert.equal(consumeGuardToken(data,state,{supernatural:true,damage:9,reactionAllowed:true}),2);
assert.throws(()=>consumeGuardToken(data,state,{supernatural:true,damage:9,reactionAllowed:true}),/guard_token_empty/);
state.powerUses={};assert.equal(truthGuardItemProfile(data,state).token.remaining,0,'A scenario does not recreate a broken token');
assert.equal(truthGuardItemProfile({truth:{truthEquipment:[truthGuardItems.token,truthGuardItems.token]}},state).token.remaining,1,'Only an explicitly owned additional copy supplies another use');
const weaponData={truth:{truthEquipment:['verite-25-blaster-atomus','verite-26-custodian-ar-9','verite-26-duplex-ar-12','verite-26-helios-pr-8']}};
const use=(s,id,ctx={})=>prepareTruthWeaponUse(weaponData,s,'truth:'+id,{inCombat:true,activationKey:'combat-a:1',authorizationConfirmed:true,...ctx});
state=fresh();assert.equal(use(state,'verite-26-custodian-ar-9:perforant').additionalPaCost,1);assert.equal(use(state,'verite-26-custodian-ar-9:perforant').additionalPaCost,0,'Unchanged regime is not paid again');
assert.equal(truthWeaponResourceProfile(weaponData,state).find(p=>p.id==='verite-26-custodian-ar-9').current,'perforant');
assert.equal(use(state,'verite-26-custodian-ar-9:standard').additionalPaCost,1);
const before=structuredClone(state);assert.throws(()=>use(state,'verite-26-duplex-ar-12:dispersion',{authorizationConfirmed:false}),/truth_weapon_authorization_required/);assert.deepEqual(state,before);
state.pa=1;assert.throws(()=>use(state,'verite-26-duplex-ar-12:dispersion'),/insufficient_pa/);assert.equal(state.itemResources.weaponModes['verite-26-duplex-ar-12'],undefined);
state.pa=3;assert.equal(use(state,'verite-26-duplex-ar-12:dispersion').mattersSpent,3,'Dispersion consumes exactly three material units, not three hits');
assert.equal(use(state,'verite-25-blaster-atomus:concentre').additionalPaCost,0);
assert.throws(()=>use(state,'verite-25-blaster-atomus:rafale'),/truth_weapon_mode_quota/);
assert.equal(use(state,'verite-25-blaster-atomus:rafale',{activationKey:'combat-a:2'}).modeChanged,true);
use(state,'verite-26-helios-pr-8',{intensiveUse:true});assert.throws(()=>use(state,'verite-26-helios-pr-8',{intensiveUse:true}),/truth_weapon_cooling/);
assert.equal(use(state,'verite-26-helios-pr-8',{intensiveUse:false}).intensiveUse,false,'Cooling prevents only another intensive use');
assert.equal(use(state,'verite-26-helios-pr-8',{activationKey:'combat-a:2',intensiveUse:true}).intensiveUse,true);
assert.equal(liveItemResourceProfile(data,state,catalog).ablative[0].name,'Byron Punk Life');
assert.throws(()=>configureTruthWeaponReserve(weaponData,state,{sourceId:'verite-26-duplex-ar-12',remaining:5},{inCombat:true,manager:false}),/truth_reserve_requires_manager/);
configureTruthWeaponReserve(weaponData,state,{sourceId:'verite-26-duplex-ar-12',remaining:5},{inCombat:true,manager:true});
assert.equal(use(state,'verite-26-duplex-ar-12:dispersion').reserveAfter,2);
assert.throws(()=>use(state,'verite-26-duplex-ar-12:dispersion'),/insufficient_truth_reserve/);
assert.equal(state.ammoCount['verite-26-duplex-ar-12'],2,'Failed shot does not spend declared material');
configureTruthWeaponReserve(weaponData,state,{sourceId:'verite-26-custodian-ar-9',remaining:5},{inCombat:true,manager:true});
assert.throws(()=>use(state,'verite-26-custodian-ar-9:perforant'),/truth_matter_usage_required/);
assert.throws(()=>use(state,'verite-26-custodian-ar-9:perforant',{matterSpent:1}),/invalid_truth_matter_usage/);
assert.equal(use(state,'verite-26-custodian-ar-9:perforant',{matterSpent:2}).reserveAfter,3,'More material is explicit, never an invented multiplier');
assert.equal(liveItemResourceProfile(weaponData,state,catalog).weaponReserves.length,4);
assert.equal(liveItemResourceProfile(weaponData,state,catalog).weaponReserves.filter(p=>p.remaining!==null).length,2);
assert.throws(()=>prepareTruthWeaponUse({truth:{truthEquipment:[]}},fresh(),'truth:verite-26-helios-pr-8',{inCombat:true,activationKey:'x'}),/truth_weapon_unavailable/);
console.log('LIVE ITEM RESOURCES OK — finite ablative layers/UID copies, actual replacement, mounted plates, scenario Brigandine, destroyed guard tokens, persistent paid regimes, Atomus activation quota and Helios cooling');

export async function checkLiveItemResourcesHTTP({pool,call,player,other,manager}){
 const campaign=randomUUID(),attacker=randomUUID(),defender=randomUUID(),npc=randomUUID(),combatUrl=`/api/campaigns/${campaign}/combat`,armorA=randomUUID(),armorB=randomUUID();
 const characterData=name=>{const d=blankCharacterData(name);d.attributes.vigueur=20;d.attributes.agilite=4;d.attributes.volonte=4;d.skills.constitution={style:20,free:0,edge:0};d.skills.tir={style:6,free:0,edge:0};d.truth={nature:'humain',consciousness:'initie',choices:{},truthTalents:[],truthEquipment:[]};return d;};
 const initial=()=>({...blankPlayState(),hp:40,pa:3,paPerRound:3,initiative:20,revelation:'v'});
 const read=(id,u=id===attacker?player:other)=>call(u,'GET',`/api/characters/${id}/play`);
 const combat=(u,input,status=200)=>call(u,'POST',combatUrl,{requestId:randomUUID(),...input},status);
 const playAction=(id,u,input,status=200)=>call(u,'POST',`/api/characters/${id}/play`,{requestId:randomUUID(),...input},status);
 const put=async(id,d,s=initial())=>{await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[id,JSON.stringify(d)]);await pool.query('UPDATE character_play_states SET state=$2::jsonb,version=version+1 WHERE character_id=$1',[id,JSON.stringify(s)]);};
 const manualAttack=async(damage=2,vector='balistique',targetId=defender)=>{const eventId=randomUUID(),attackId=randomUUID();await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'roll',$4::jsonb,'{}',true)",[eventId,campaign,manager.id,JSON.stringify({total:100,narrativeFailure:false})]);await combat(manager,{requestId:attackId,action:'attack',eventId,targetId,damage,bonusDamage:0,penetration:0,damageType:vector,attackMode:'fixed',surprise:false});await combat(targetId===defender?other:manager,{action:'defend',attackId,active:false,bonus:0});return attackId;};
 const resolve=(attackId,input={},u=other,status=200)=>combat(u,{action:'resolve',attackId,protectionIds:[armorA],material:true,armor:0,extraArmor:0,extraReduction:0,defenseOverride:0,...input},status);
 const launch=(input={},u=player,status=200)=>combat(u,{action:'launch',attackerId:attacker,targetId:defender,optionId:'truth:verite-26-duplex-ar-12:dispersion',contextConfirmed:true,bonus:0,bonusDamage:0,surprise:false,...input},status);
 const attackData=characterData('Equipment shooter'),defenderData=characterData('Equipment defender');
 attackData.truth.truthEquipment=['verite-26-duplex-ar-12'];defenderData.truth.truthEquipment=[truthGuardItems.brigandine,truthGuardItems.token];defenderData.reality.equipment=[{uid:armorA,itemId:'armures-basiques-raven-black-feathers',quantity:1},{uid:armorB,itemId:'armures-basiques-raven-black-feathers',quantity:1}];
 try{
  await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'Isolated equipment resource test']);
  for(const [id,user,d] of [[attacker,player,attackData],[defender,other,defenderData]]){
   await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4::jsonb,$5)',[id,user.id,d.identity.name,JSON.stringify(d),campaign]);
   await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,user.id,id]);
   await pool.query('INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,1)',[id,JSON.stringify(initial())]);
  }
  await pool.query("INSERT INTO campaign_combat_states(campaign_id,active,mode,round,turns,version,participants) VALUES($1,true,'manual',1,'{}',1,'{}')",[campaign]);
  const npcArmor='armures-basiques-raven-black-feathers';
  await pool.query("INSERT INTO campaign_live_combatants(id,campaign_id,source_kind,source_id,name,data,hp,pv_max,death,initiative_bonus,initiative,pa,visible) VALUES($1,$2,'npc',$3,'Ablative NPC',$4::jsonb,40,40,-10,3,20,3,true)",[npc,campaign,randomUUID(),JSON.stringify({attributes:{vigueur:5,agilite:3,volonte:3},skills:{esquive:3},equipmentIds:[npcArmor]})]);
  let current=await read(defender),hp=current.profile.hp;
  assert.equal(current.profile.itemResources.ablative.find(p=>p.id===armorA).remaining,4);
  for(let i=0;i<5;i++){
   const attackId=await manualAttack(),requestId=randomUUID();const body={requestId};await resolve(attackId,body);await resolve(attackId,body);
   current=await read(defender);assert.equal(current.profile.hp,hp-(i<4?1:2));hp=current.profile.hp;
   assert.equal(current.profile.itemResources.ablative.find(p=>p.id===armorA).remaining,Math.max(0,3-i));assert.equal(current.profile.itemResources.ablative.find(p=>p.id===armorB).remaining,4);
  }
  let npcHp=40;for(let i=0;i<5;i++){
   const attackId=await manualAttack(2,'balistique',npc);await resolve(attackId,{protectionIds:[npcArmor]},manager);
   const row=(await pool.query('SELECT hp,data FROM campaign_live_combatants WHERE id=$1',[npc])).rows[0];assert.equal(row.hp,npcHp-(i<4?1:2));npcHp=row.hp;assert.equal(row.data.itemResources.ablative[npcArmor],Math.max(0,3-i));
  }
  await playAction(defender,player,{version:current.version,action:'reality-ablative-replace',itemId:armorA,replacementAvailable:true},404);
  await playAction(defender,other,{version:current.version,action:'reality-ablative-replace',itemId:armorA,replacementAvailable:true},400);
  const replacement={requestId:randomUUID(),version:current.version,action:'reality-ablative-replace',itemId:armorA,replacementAvailable:true};await playAction(defender,manager,replacement);await playAction(defender,manager,replacement);
  current=await read(defender);assert.equal(current.profile.itemResources.ablative.find(p=>p.id===armorA).remaining,4);
  await playAction(defender,other,{version:current.version,action:'save',state:{...current.state,itemResources:{ablative:{[armorA]:0},consumed:{[truthGuardItems.token]:0},weaponModes:{}}}});assert.equal((await read(defender)).profile.itemResources.ablative.find(p=>p.id===armorA).remaining,4,'Ordinary settings save cannot forge item counters');
  let attackId=await manualAttack(8,'occulte');hp=(await read(defender)).profile.hp;
  await resolve(attackId,{material:false,protectionIds:['truth:'+truthGuardItems.brigandine],guardToken:true});current=await read(defender);assert.equal(current.profile.hp,hp-3,'Brigandine 3 and token 2 reduce the actual supernatural source');assert.equal(current.state.pa,2);assert.equal(current.profile.itemResources.guards.brigandine.available,false);assert.equal(current.profile.itemResources.guards.token.remaining,0);
  attackId=await manualAttack(8,'occulte');await resolve(attackId,{material:false,protectionIds:['truth:'+truthGuardItems.brigandine],guardToken:true},other,400);assert.equal((await read(defender)).state.pa,2,'Empty token rejects without PA loss');await combat(manager,{action:'cancel',attackId});
  current=await read(attacker);await playAction(attacker,player,{version:current.version,action:'reality-truth-reserve',sourceId:'verite-26-duplex-ar-12',remaining:5},400);
  const declared={requestId:randomUUID(),version:current.version,action:'reality-truth-reserve',sourceId:'verite-26-duplex-ar-12',remaining:5};await playAction(attacker,manager,declared);await playAction(attacker,manager,declared);current=await read(attacker);assert.equal(current.state.ammoCount['verite-26-duplex-ar-12'],5);
  const shot={requestId:randomUUID()};await launch(shot,other,404);await launch(shot);await launch(shot);current=await read(attacker);assert.equal(current.state.pa,1,'Dispersion mode change plus attack costs 2PA');assert.equal(current.state.ammoCount['verite-26-duplex-ar-12'],2,'Exact retry spends three material units once');assert.equal(current.state.itemResources.weaponModes['verite-26-duplex-ar-12'],'dispersion');
  await launch({},player,400);assert.equal((await read(attacker)).state.pa,1);assert.equal((await read(attacker)).state.ammoCount['verite-26-duplex-ar-12'],2);
  await combat(manager,{action:'cancel',attackId:shot.requestId});
  current=await read(attacker);await playAction(attacker,player,{version:current.version,action:'save',state:{...current.state,ammoCount:{'verite-26-duplex-ar-12':100},itemResources:{weaponModes:{'verite-26-duplex-ar-12':'assaut'}}}});current=await read(attacker);assert.equal(current.state.ammoCount['verite-26-duplex-ar-12'],2);assert.equal(current.state.itemResources.weaponModes['verite-26-duplex-ar-12'],'dispersion');
  // A free Ashorn riposte must remain possible with an owned Truth weapon at
  // zero PA: resource preparation cannot reintroduce a one-PA attack guard.
  const ashorn=characterData('Truth weapon riposte');ashorn.attributes.agilite=40;ashorn.truth={nature:'exile',consciousness:'initie',choices:{network:'horde_divine'},truthTalents:['exile-riposte-d-ashorn'],truthEquipment:['verite-24-black-nail']};
  await put(attacker,ashorn,{...initial(),revelation:'r',pa:1});await pool.query('INSERT INTO character_edge_accounts(character_id,balance) VALUES($1,1) ON CONFLICT(character_id) DO UPDATE SET balance=1',[attacker]);
  const incoming=randomUUID();await pool.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'attack',$4::jsonb,'{}',true)",[incoming,campaign,manager.id,JSON.stringify({targetId:attacker,attackerId:npc,attacker:'Ablative NPC',total:10,damage:6,bonusDamage:0,penetration:0,attackMode:'melee',damageType:'melee',narrativeFailure:false,surprise:false})]);
  await combat(player,{action:'defend',attackId:incoming,active:true,bonus:0,edge:true});assert.equal((await read(attacker)).state.pa,0);
  const freeRiposte={requestId:randomUUID(),optionId:'truth:verite-24-black-nail',targetId:npc,riposteAttackId:incoming,inReach:true};await launch(freeRiposte);await launch(freeRiposte);assert.equal((await read(attacker)).state.pa,0);
  await combat(manager,{action:'cancel',attackId:incoming});await combat(manager,{action:'cancel',attackId:freeRiposte.requestId});
  console.log('LIVE ITEM RESOURCES API OK — actual damage/replay, independent owned armour UID charges, protected counters, GM replacement, personal runic guard/token costs, persisted mode/PA, actual reserve and empty launch rollback');
 }finally{await pool.query('DELETE FROM campaigns WHERE id=$1',[campaign]);await pool.query('DELETE FROM characters WHERE id=ANY($1::uuid[])',[[attacker,defender]]);}
}
