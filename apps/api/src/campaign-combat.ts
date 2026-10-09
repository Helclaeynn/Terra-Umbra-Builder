import {recordLightningWounds,lightningAutomaticSurvivalAllowed,clearLightningWoundsByGrace} from './rules/lightning-wounds.js';
import {pruneOccultMaintenance} from './campaign-occult-resolutions.js';
import {recordSurvivalFuryDamage,consumeSurvivalFury,frenzyActionCheck,recordFrenzyAction} from './rules/live-frenzy.js';
import {spendRestrictedPA,restrictedActionCheck,betweenStatesDefenseDelta} from './rules/live-action-restrictions.js';
import {itemProtectionWithResources,ablativeModuleReduction,consumeAblativeImpact,consumeBrigandineGuard,consumeGuardToken,truthGuardItemProfile,truthGuardItems,prepareTruthWeaponUse} from './rules/live-item-resources.js';
import {canSpendPhysicalPA} from './rules/live-effects.js';
import {lightningAttacks,lightningAccess,lightningRange,lightningIds,paratonnerreTest,lightningPlan,consumeLightningUsage,lightningProtection,lightningArcPlan,lightningErosion} from './rules/lightning.js';
import {interpositionOptions,interpositionCheck,guardianBonus,ashornAvailable,consumeGuard} from './rules/targeted-powers.js';
import {liveRealityProfile,realityProtection,realityWeaponProfile,realityNaturalWeapons,permitsSurprisedDefense,neuroSacrifice,weaponMagazine,consumeWeaponCharge} from './rules/live-reality.js';
import {registeredTruthPowers} from './rules/live-power-registry.js';
import {registeredReaction,spendRegisteredUsage,consumeRegisteredTest} from './rules/registered-power-state.js';
import {applyVampirePredation,applyVampireLastSleep,vampireStatus,vampireDefenseBonus} from './rules/live-vampire.js';
import {natureResourceProfile,applyNatureResourceAction,normalizedNatureResources,consumeNatureTest} from './rules/live-nature-resources.js';
import {effectModifiers} from './rules/live-effects.js';
import {defenseOptions,consumeUsage} from './rules/live-mechanics.js';
import {edgeBalance,spendEdge,forcedDie,forcePastRoll} from './character-edge.js';
import {combatState,participates,lockCombat,recordAction,maybeAdvanceCombat} from './campaign-rounds.js';
import {repairedCombatantData} from './campaign-live-catalog.js';
import {damageCalculation,weaponMechanics} from './rules/combat-damage.js';
export {damageCalculation} from './rules/combat-damage.js';
import {combatantRolls} from './campaign-live.js';
import type {FastifyInstance} from 'fastify';
import {BESTIARY_WEAPONS} from './campaign-bestiary-weapons.js';
import {randomInt,randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {truthPowers} from './rules/play-truth.js';
import {blankPlayState,playProfile,rollD10} from './rules/play-state.js';
import {characterDerivedStats} from './rules/character-derived-stats.js';
import {getRealityRules} from './rules/reality.js';
import {normalizeAngelusBuild} from './rules/truth/angelus-build.js';
import {truthItemWeapons,truthItemProtections} from './rules/live-truth-items.js';
const uuid=(v:any)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const integer=(v:any,min=0,max=100)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
const kinds=['melee','balistique','antichoc','feu','froid','electricite','chimique','occulte','neuro'];
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function combatEffect(t:any,scope:any,skill?:string,zone?:string){const state=t.kind==='character'?t.state:t.data;return effectModifiers(state?.effects??state?.liveEffects??[],t.id,{scope,skill,zone,clock:{round:t.state?.round??t.round??1,targetActivation:state?.activation??0}}).amount;}
export function combatArmorModifier(t:any,hitZone?:unknown){return combatEffect(t,'armor',undefined,typeof hitZone==='string'&&hitZone.trim()&&hitZone.length<=100?hitZone:undefined);}
export function combatEquipment(data:any,npc=false){
 const rules=getRealityRules(),catalog=[...rules.equipment,...rules.augmentations];
 const owned=npc?(data.equipmentIds??[]).map((itemId:string)=>({itemId})): [...(data.reality?.equipment??[]),...(data.reality?.augmentations??[]).filter((p:any)=>p.loaded!==false)];
 return [...owned.filter((p:any)=>p.quantity!==0).flatMap((p:any)=>{const item=catalog.find(x=>x.id===p.itemId||(x as any).compendiumId?.replace(/^equipement-\d+-/,'')===p.itemId);if(!item)return [];const protection=realityProtection(item);return protection.body||protection.armor||Object.values(protection.reductions).some(Boolean)||Object.values(protection.additive).some(Boolean)||/armure/i.test(item.category)?[{id:p.uid??p.itemId,itemId:item.id,name:item.name,...protection}]:[];}),...(!npc?truthItemProtections(data):[])];
}
export async function member(db:any,campaign:string,user:any){
 const r=await db.query(`SELECT c.owner_id=$2 AND u.role IN ('gm','editor','admin') AS manager FROM campaigns c JOIN users u ON u.id=$2 AND u.is_active WHERE c.id=$1 AND c.archived_at IS NULL AND (c.owner_id=$2 OR EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2 AND m.status='accepted'))`,[campaign,user.id]);return r.rows[0];
}
export async function target(db:any,campaign:string,id:string,lock=false){
 const n=await db.query(`SELECT * FROM campaign_live_combatants WHERE campaign_id=$1 AND id=$2 AND NOT removed ${lock?'FOR UPDATE':''}`,[campaign,id]);
 if(n.rowCount){const c=n.rows[0];c.data=await repairedCombatantData(c);const d=c.source_kind==='npc'?characterDerivedStats(k=>c.data.attributes?.[k]??0,k=>c.data.skills?.[k]??0,[]):null;
  const actor={...c,kind:c.source_kind},physical=d?.passiveDefense??c.data.stats.physicalDefense??0,occult=d?.occultDefense??c.data.stats.occultDefense??0;
  return {...actor,owner_id:null,defense:physical+combatEffect(actor,'defense-physical'),activeDefense:physical+combatEffect(actor,'defense-physical')+combatEffect(actor,'physical')+(d?combatEffect(actor,'skill','esquive'):0),occultDefense:occult+combatEffect(actor,'defense-occult'),activeOccultDefense:occult+combatEffect(actor,'defense-occult')+combatEffect(actor,'mental')+(d?combatEffect(actor,'skill','force_mentale'):0),neuroDefense:(c.data.stats?.neuroDefense??occult)+combatEffect(actor,'defense-neuro'),activeNeuroDefense:(c.data.stats?.neuroDefense??occult)+combatEffect(actor,'defense-neuro')+combatEffect(actor,'mental')+(d?combatEffect(actor,'skill','force_mentale'):0),armor:c.source_kind==='npc'?c.data.armor??0:c.data.stats.armor??0,protections:c.source_kind==='creature'?[]:combatEquipment(c.data,true).map(p=>{const r:any=itemProtectionWithResources(c.data,p),e=c.data.lightningErosion?.[p.id];return e?{...r,armor:e.material?Math.max(0,(r.armor??0)-e.amount):r.armor,reductions:e.material?r.reductions:{...r.reductions,electricite:Math.max(0,(r.reductions.electricite??0)-e.amount)}}:r;}),reductions:c.data.reductions??{},stress:c.hp<=c.pv_max*.25?2:c.hp<=c.pv_max*.5?1:0};
 }
 const p=await db.query(`SELECT c.* FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' WHERE c.campaign_id=$1 AND c.id=$2 AND c.archived_at IS NULL ${lock?'FOR UPDATE OF c':''}`,[campaign,id]);if(!p.rowCount)return null;
 const c=p.rows[0],r=await db.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[id]),state={...blankPlayState(),...r.rows[0]?.state},profile=playProfile(c.data,state);
 const actor={...c,kind:'character',state},reality=liveRealityProfile(c.data,state,getRealityRules()),fortitude=profile.skills.find(s=>s.id==='force_mentale')!,defenseless=state.vampire?.stasis===true;
 return {...actor,defenseless,version:r.rows[0]?.version??0,hp:profile.hp,pv_max:profile.healthMaximum,basePvMax:profile.derived.pvMax,death:profile.derived.death,pa:profile.pa,initiative:state.initiative,defense:defenseless?0:profile.derived.passiveDefense,occultDefense:defenseless?0:profile.derived.occultDefense,activeOccultDefense:defenseless?0:fortitude.total+profile.freeTraits.occultDefense+combatEffect(actor,'defense-occult'),armor:0,bodyArmor:profile.bodyArmor,neuroDefense:defenseless?0:profile.neuroDefense,activeNeuroDefense:defenseless?0:fortitude.total+reality.neuroDefenseBonus+combatEffect(actor,'defense-neuro'),activeDefense:defenseless?0:profile.skills.find(s=>s.id==='esquive')!.total+combatEffect(actor,'defense-physical'),canSurprised:permitsSurprisedDefense(c.data),reality,aura:natureResourceProfile(c.data,state,fortitude.rank).angelus,protections:combatEquipment(c.data).map(p=>{const r:any=itemProtectionWithResources(state,p),e=state.lightningErosion?.[p.id];return e?{...r,armor:e.material?Math.max(0,(r.armor??0)-e.amount):r.armor,reductions:e.material?r.reductions:{...r.reductions,electricite:Math.max(0,(r.reductions.electricite??0)-e.amount)}}:r;}),guardItems:truthGuardItemProfile(c.data,state),stress:profile.stress,visible:state.share};
}
const rulesAttribute=(skill:string)=>['neurodive','maitrise_spirituelle'].includes(skill)?'Volonté':['melee','pugilat'].includes(skill)?'Vigueur':'Agilité';
export function characterAttacks(data:any,state:any,allWeapons=false){
 const profile=playProfile(data,state),catalog=getRealityRules(),equipment=catalog.equipment;
 const purchases=(data.reality?.equipment??[]).filter((p:any)=>p.quantity!==0);
 const bare=profile.skills.find(s=>s.id==='pugilat')!;
 const prepare=(weapon:any,skillId:string=weapon.skill)=>{
  const skill=profile.skills.find(s=>s.id===skillId)!;
  return {...weapon,skill:skillId,modifier:skill.total,components:{attributeName:rulesAttribute(skillId),attribute:skill.attributeValue,skillName:skill.name,rank:skill.rank,bonus:skill.bonus}};
 };
 const realWeapons=equipment.flatMap(e=>{
  const copies=purchases.filter((p:any)=>p.itemId===e.id||BESTIARY_WEAPONS.some(w=>w.id===p.itemId&&w.name===e.name));
  if(!allWeapons&&!copies.length)return [];
  const weapon=realityWeaponProfile(e,profile.attributes.find(a=>a.id==='vigueur')!.value);
  if(!weapon)return []; // A stale static table must never invent an X/variable DGT.
  return (copies.length?copies:[null]).map((copy:any,index:number)=>{
   const inventoryUID=copy?(copy.uid??copy.itemId):undefined,magazine=weaponMagazine(state,{inventoryUID,capacity:weapon.capacity});
   return prepare({...weapon,id:index===0?weapon.id:weapon.id+':'+inventoryUID,weaponName:e.name,...(inventoryUID?{inventoryUID}:{}),...(magazine??{})});
  });
 });
 // Keep documented legacy weapons only when no canonical catalog entry exists.
 const legacy=BESTIARY_WEAPONS.filter(w=>!equipment.some(e=>e.id===w.id||e.name===w.name)&&(allWeapons||purchases.some((p:any)=>p.itemId===w.id))).map(w=>{
  const mechanics=weaponMechanics(w);return prepare({id:w.id,label:w.name,group:w.group,damage:w.damage,weaponName:w.name,...mechanics},mechanics.attackMode==='melee'?'melee':'tir');
 });
 const resources=normalizedNatureResources(state.natureResources),revealed=data.truth?.consciousness!=='profane'&&state.revelation==='r';
 const readiness=new Set(['verite-25-pistolet-aidh-2e-generation','verite-25-fusil-aidh-1re-generation','verite-26-defensor','verite-26-praetor-c-14','verite-26-cerberus-hmg-3','verite-26-ward-m-6','verite-26-breacher-b-9','verite-26-fulgur-eb-7']);
 const truthWeapons:any[]=truthItemWeapons(data).map(w=>prepare({...w,weaponName:w.label,notes:w.notes,condition:readiness.has(w.sourceId)||w.requiresAdjudication||w.modeChangeCost?w.notes:undefined},w.attackSkill));
 for(const foudre of lightningAttacks(data,state))truthWeapons.push(prepare(foudre));
 if(data.truth?.nature==='daemon'&&revealed&&resources.daemon.formProperties.includes('weapon'))truthWeapons.push(prepare({id:'daemon-form-weapon',label:'Arme de Forme daemoniaque',group:'Vérité',damage:7,penetration:0,attackMode:'melee',damageType:'melee'},'melee'));
 if(data.truth?.nature==='angelus'&&revealed&&resources.angelus.bladeHp>0){
  const mode=normalizeAngelusBuild(data.truth?.choices?.angelusBuild).bladeForm;
  truthWeapons.push(prepare({id:'angelus-celestial-blade',label:'Lame céleste',group:'Vérité',damage:[0,7,9,11][resources.angelus.bladeHp],penetration:0,attackMode:mode,damageType:mode==='ranged'?'balistique':'melee'},mode==='ranged'?'tir':'melee'));
 }
 return [prepare({id:'unarmed',label:profile.body?'Armes naturelles · '+profile.body.form:'Mains nues',group:'Sans équipement',damage:profile.naturalDamage,penetration:0,attackMode:'melee',damageType:profile.body?'melee':'antichoc'},'pugilat'),...realWeapons,...legacy,...realityNaturalWeapons(data,state).map(w=>prepare(w)),...liveRealityProfile(data,state,catalog).neuroAttacks.map((w:any)=>prepare({...w,id:'neuro:'+w.id,group:'Neuroprogrammes chargés',penetration:0})),...(vampireStatus(data,state).available?[prepare({id:'vampire-predation',label:'Prédation vampirique',group:'Vérité',damage:1,penetration:0,attackMode:'melee',damageType:'melee',predation:true},'pugilat')]:[]),...truthWeapons].sort((a,b)=>a.group.localeCompare(b.group,'fr')||a.label.localeCompare(b.label,'fr'));
}
export function combatAttackOptions(t:any,manager=false){
 if(t.kind==='character')return characterAttacks(t.data,t.state,manager);
 const catalog=getRealityRules().equipment;
 return combatantRolls(t,manager).filter(r=>r.attack&&Number.isFinite(r.damage)).map(r=>{
  const profile=r.id.startsWith('truth:')?t.data.truth:t.data;
  const item=t.kind==='npc'&&r.weaponName?catalog.find(e=>e.name===r.weaponName):undefined,canonical=item?realityWeaponProfile(item,profile?.attributes?.vigueur??0):null;
  const skill=canonical?.skill??(r.id.endsWith(':pugilat')?'pugilat':r.components?.skillName==='Pugilat'?'pugilat':(canonical?.attackMode??r.attackMode)==='ranged'?'tir':r.weaponName?'melee':undefined);
  // NPC canonical weapon mode can differ from a stale table; rebuild its score.
  const attribute=skill==='tir'?profile?.attributes?.agilite:profile?.attributes?.vigueur,rank=skill?(profile?.skills?.[skill]??0):undefined;
  const modifier=canonical&&Number.isFinite(attribute)&&Number.isFinite(rank)?attribute+rank:r.modifier;
  const bonus=combatEffect(t,['neuro','occulte'].includes(canonical?.damageType??r.damageType)?'mental':'physical')+(skill?combatEffect(t,'skill',skill):0);
  return {...r,...(canonical??{}),id:r.id,label:r.label,group:r.group??r.profile??'Attaques du profil',skill,modifier:modifier+bonus,damage:canonical?.damage??r.damage,penetration:canonical?.penetration??r.penetration??0,damageType:canonical?.damageType??r.damageType??'melee',components:{...r.components,...(canonical&&Number.isFinite(attribute)&&Number.isFinite(rank)?{attributeName:rulesAttribute(skill!),attribute,rank,skillName:skill==='tir'?'Tir':'Mêlée'}:{}),bonus:(r.components?.bonus??0)+bonus}};
 }).sort((a,b)=>a.label.localeCompare(b.label,'fr'));
}
const attackOptions=combatAttackOptions;
export async function saveTarget(db:any,t:any){
 if(t.kind==='character'){t.state.hp=t.hp;t.state.pa=t.pa;await db.query(`INSERT INTO character_play_states(character_id,version,state) VALUES($1,$2,$3::jsonb) ON CONFLICT(character_id) DO UPDATE SET version=EXCLUDED.version,state=EXCLUDED.state,updated_at=now()`,[t.id,t.version+1,JSON.stringify(t.state)]);}
 else await db.query('UPDATE campaign_live_combatants SET hp=$2,pa=$3,data=$4::jsonb,version=version+1 WHERE id=$1',[t.id,t.hp,t.pa,JSON.stringify(t.data)]);
}
export async function registerCampaignCombatRoutes(app:FastifyInstance){
 app.get<{Params:{id:string}}>('/api/campaigns/:id/combat',async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;if(!uuid(req.params.id))return reply.code(404).send({error:'campaign_not_found'});const access=await member(pool,req.params.id,user);if(!access)return reply.code(404).send({error:'campaign_not_found'});
  const shared=await combatState(pool,req.params.id);
  const rows=await pool.query(`SELECT id,payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='attack' AND NOT EXISTS(SELECT 1 FROM campaign_live_events done WHERE done.campaign_id=$1 AND done.kind IN ('resolve','cancel') AND done.payload->>'attackId'=campaign_live_events.id::text) ORDER BY created_at`,[req.params.id]);
  const owned=await pool.query(`SELECT c.id FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' WHERE c.campaign_id=$1 AND c.archived_at IS NULL AND ($3::boolean OR c.owner_id=$2)`,[req.params.id,user.id,access.manager]);
  const electricReactors=[];const reactors=[];for(const {id} of owned.rows){const actor=await target(pool,req.params.id,id);if(actor&&participates(shared,id)){const options=interpositionOptions(actor.data,actor.state);if(options.length)reactors.push({...actor,reactionOptions:options});if(lightningAccess(actor.data,actor.state).paratonnerre)electricReactors.push(actor);}}
  const pending=[],reactable=[],counterAttacks=[],lightningReactions=[];for(const e of rows.rows){const t=await target(pool,req.params.id,e.payload.targetId);if(!t)continue;
   const reacted=(e.payload.reactions??[]).length>0,chosenDefense=await pool.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind='defend' AND payload->>'attackId'=$2",[req.params.id,e.id]);
   if(shared.active&&!reacted&&!e.payload.electricDiversion&&!chosenDefense.rowCount&&!e.payload.narrativeFailure&&!e.payload.surprise&&(access.manager||t.visible)){
    const choices=reactors.filter(a=>a.id!==t.id&&a.id!==e.payload.attackerId&&a.hp>0&&a.pa>0&&a.initiative!==null&&!a.state.unconscious&&!a.state.muePending).flatMap(a=>a.reactionOptions.filter((o:any)=>!o.used&&(o.kind==='defense'||!['neuro','occulte'].includes(e.payload.damageType))).map((o:any)=>({...o,actorId:a.id,actorName:a.name,version:a.version,movement:playProfile(a.data,a.state).derived.movement,frenzy:playProfile(a.data,a.state).frenzy})));
    if(choices.length)reactable.push({id:e.id,targetId:t.id,targetName:t.name,attacker:e.payload.public||access.manager?e.payload.attacker:'Attaquant non révélé',options:choices});
   }
   if(shared.active&&!reacted&&!chosenDefense.rowCount&&!e.payload.narrativeFailure&&!e.payload.surprise&&e.payload.damageType==='electricite'&&(access.manager||t.visible)){
    const choices=electricReactors.filter(a=>a.id!==t.id&&a.id!==e.payload.attackerId&&a.hp>0&&a.pa>0&&a.initiative!==null&&!a.state.unconscious&&!a.state.muePending&&!lightningAccess(a.data,a.state).paratonnerreUsed).map(a=>({actorId:a.id,actorName:a.name,version:a.version,edge:null,frenzy:playProfile(a.data,a.state).frenzy}));
    const diversion=e.payload.electricDiversion,own=diversion?electricReactors.find(a=>a.id===diversion.actorId):null;
    if(!diversion&&choices.length||diversion&&!diversion.success&&own)lightningReactions.push({id:e.id,targetId:t.id,targetName:t.name,total:e.payload.total,options:choices,...(own?{electricDiversion:diversion,actorVersion:own.version,edge:await edgeBalance(pool,own.id,own.data)}:{})});
   }
   if(!access.manager&&t.owner_id!==user.id)continue;
   const defense=await pool.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='defend' AND payload->>'attackId'=$2 ORDER BY created_at LIMIT 1",[req.params.id,e.id]);
   const canReact=shared.active&&participates(shared,t.id)&&t.hp>0&&!t.state?.unconscious&&t.initiative!==null&&!e.payload.narrativeFailure;
   const specialDefenses=t.kind==='character'&&e.payload.attackMode!=='foudre'?defenseOptions(t.data,t.state,e.payload,canReact):[];
   const lightning=t.kind==='character'?lightningAccess(t.data,t.state):null,paratonnerre=lightning?.paratonnerre?{available:canReact&&t.pa>0&&!e.payload.surprise&&e.payload.damageType==='electricite'&&!defense.rowCount&&!lightning.paratonnerreUsed&&!e.payload.electricDiversion&&!(e.payload.reactions??[]).length,used:lightning.paratonnerreUsed}:null;
   const defensePayload=defense.rows[0]?.payload??(e.payload.electricDiversion?.success?{label:'Décharge détournée par Paratonnerre',active:false,total:t.defense,modifier:t.defense,narrativeFailure:false}:null);
   if(canReact&&t.kind==='character'&&e.payload.attackerId&&ashornAvailable(t.data,t.state,e.payload,defensePayload)){const enemy=await target(pool,req.params.id,e.payload.attackerId);if(enemy&&(access.manager||enemy.visible))counterAttacks.push({attackId:e.id,actorId:t.id,actorName:t.name,targetId:enemy.id,targetName:enemy.name,options:attackOptions(t,false).filter((o:any)=>['melee','pugilat'].includes(o.skill)&&o.attackMode==='melee')});}
   pending.push({id:e.id,...e.payload,...(!access.manager&&!e.payload.public?{attacker:'Attaquant non révélé'}:{}),target:{id:t.id,name:t.name,version:t.version,paratonnerre,edge:t.kind==='character'?await edgeBalance(pool,t.id,t.data):null,guard:!!(t.state??t.data).targeted?.guard,defense:t.defense,occultDefense:t.occultDefense,armor:t.armor,bodyArmor:t.bodyArmor??0,reductions:t.reductions??{},protections:t.protections,guardItems:t.guardItems,pa:t.pa,hp:t.hp,death:t.death,frenzy:t.kind==='character'?playProfile(t.data,t.state).frenzy:null,canSurprised:t.canSurprised??false,neuroDefense:t.neuroDefense??t.occultDefense,neuroPrograms:t.reality?.neuroDefense??[],neuroSacrificePrograms:t.reality?.neuro.loaded.map((p:any)=>({id:p.uid??p.itemId,label:p.item.name}))??[],aura:t.kind==='character'&&t.data.truth?.nature==='angelus'?{aura:t.aura.aura,egidePerAura:t.aura.egidePerAura}:null,damagePowers:t.kind==='character'&&e.payload.attackMode!=='foudre'?registeredTruthPowers(t.data,t.state).filter(p=>p.route==='damage'):[],specialDefenses,canDefend:canReact&&t.pa>0},defense:defensePayload});
  }
  const characterIds=await pool.query(`SELECT c.id FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' WHERE c.campaign_id=$1 AND c.archived_at IS NULL AND ($3::boolean OR c.owner_id=$2)`,[req.params.id,user.id,access.manager]);
  const npcIds=access.manager?await pool.query('SELECT id FROM campaign_live_combatants WHERE campaign_id=$1 AND NOT removed',[req.params.id]):{rows:[]};
  const attackers=[];for(const row of [...characterIds.rows,...npcIds.rows]){const t=await target(pool,req.params.id,row.id);if(t&&participates(shared,t.id))attackers.push({id:t.id,name:t.name,ready:shared.active&&t.initiative!==null&&t.pa>0&&t.hp>0&&!t.state?.unconscious&&!t.state?.muePending,initiativePending:t.initiative===null,pa:t.pa,version:t.version,frenzy:t.kind==='character'?playProfile(t.data,t.state).frenzy:null,edge:t.kind==='character'?await edgeBalance(pool,t.id,t.data):null,powers:t.kind==='character'?registeredTruthPowers(t.data,t.state).filter(p=>p.route==='attack'):[],options:attackOptions(t,access.manager)});}
  const arcOffers=[];if(shared.active){const hits=(await pool.query("SELECT a.id,a.payload FROM campaign_live_events a JOIN campaign_live_events r ON r.campaign_id=a.campaign_id AND r.kind='resolve' AND r.payload->>'attackId'=a.id::text AND r.payload->>'hit'='true' WHERE a.campaign_id=$1 AND a.kind='attack' AND a.live_session_id IS NOT DISTINCT FROM (SELECT session_id FROM campaign_live_context WHERE campaign_id=$1) AND a.payload->>'attackMode'='foudre' AND NOT a.payload ? 'arcFrom' AND NOT a.payload ? 'arcId' AND NOT EXISTS(SELECT 1 FROM campaign_live_events boundary WHERE boundary.campaign_id=a.campaign_id AND boundary.kind IN ('combat-start','combat-stop','combat-scene','combat-scenario') AND boundary.created_at>a.created_at) ORDER BY a.created_at DESC LIMIT 30",[req.params.id])).rows;for(const hit of hits){const a=await target(pool,req.params.id,hit.payload.attackerId);if(a?.kind==='character'&&(access.manager||a.owner_id===user.id)&&participates(shared,a.id)&&lightningAttacks(a.data,a.state).length&&truthPowers(a.data).some(p=>p.id===lightningIds.arc)&&!(a.state.powerUses?.['scene:'+lightningIds.arc]>0))arcOffers.push({id:hit.id,actorId:a.id,actorName:a.name,version:a.version,firstTargetId:hit.payload.targetId,total:hit.payload.total});}}
  return {pending,reactable,counterAttacks,lightningReactions,arcOffers,attackers,canManage:access.manager,...(access.manager?{weapons:[...BESTIARY_WEAPONS].sort((a,b)=>a.group.localeCompare(b.group,'fr')||a.name.localeCompare(b.name,'fr'))}:{})};
 });
 app.post<{Params:{id:string};Body:any}>('/api/campaigns/:id/combat',async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;const b:any=req.body;if(!uuid(req.params.id)||!b||!uuid(b.requestId)||!['grace','spend','launch','attack','defend','resolve','cancel','react','paratonnerre','paratonnerre-force','lightning-arc'].includes(b.action))return reply.code(400).send({error:'invalid_combat_action'});
  const db=await pool.connect();try{await db.query('BEGIN');const fail=async(code:number,error:string)=>{await db.query('ROLLBACK');return reply.code(code).send({error});};
   const access=await member(db,req.params.id,user);if(!access)return await fail(404,'campaign_not_found');
   await lockCombat(db,req.params.id);
   await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[b.requestId]);const previous=await db.query('SELECT campaign_id,created_by,request_payload FROM campaign_live_events WHERE id=$1',[b.requestId]);if(previous.rowCount){if(previous.rows[0].campaign_id!==req.params.id||previous.rows[0].created_by!==user.id||!isDeepStrictEqual(previous.rows[0].request_payload,b))return await fail(409,'combat_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
   const shared=await combatState(db,req.params.id);
   if(['launch','attack','spend'].includes(b.action)&&!shared.active)return await fail(400,'combat_not_started');
   if(['launch','spend'].includes(b.action)&&!participates(shared,b.attackerId??b.actorId))return await fail(400,'participant_out');
   let payload:any,publicEvent=false;
   if(b.action==='grace'){
    if(!access.manager)return await fail(403,'mj_only');
    if(!uuid(b.actorId)||!integer(b.hp,1,10000)||!integer(b.beforeHp,-10000,10000)||typeof b.reason!=='string'||!b.reason.trim()||b.reason.length>500)return await fail(400,'invalid_grace');
    const actor=await target(db,req.params.id,b.actorId,true);if(!actor)return await fail(404,'target_not_found');
    if(actor.hp!==b.beforeHp)return await fail(409,'grace_state_changed');
    if(b.hp>actor.pv_max)return await fail(400,'invalid_grace');
    clearLightningWoundsByGrace(actor.kind==='character'?actor.state:actor.data,{manager:access.manager,confirmed:true});const before=actor.hp;actor.hp=b.hp;if(actor.kind==='character')actor.state.stabilized=false;
    await saveTarget(db,actor);
    payload={label:'Grâce du MJ · PV rétablis',characterName:actor.name,targetId:actor.id,before,after:actor.hp,text:b.reason.trim()};publicEvent=!!actor.visible;
   }else if(b.action==='spend'){
    if(!uuid(b.actorId))return await fail(400,'invalid_combat_action');
    const actor=await target(db,req.params.id,b.actorId,true);
    if(!actor||!access.manager&&actor.owner_id!==user.id)return await fail(404,'target_not_found');
    if(actor.state?.unconscious||actor.initiative===null||actor.pa<1||actor.hp<=actor.death)return await fail(400,'insufficient_pa');
    if(actor.kind==='character'){try{frenzyActionCheck(actor.state,1,b,{manager:access.manager});recordFrenzyAction(actor.state,1,b,{manager:access.manager});}catch(e){return await fail(400,(e as Error).message);}}
    if(actor.kind==='character'&&b.physical!==false){const physical=canSpendPhysicalPA(actor.state.effects??[],actor.id,actor.state,1);if(!physical.available)return await fail(400,'physical_pa_limited');actor.state.physicalPaSpent=physical.nextSpent;}
    if(actor.kind==='character'){try{spendRestrictedPA(actor.state,1,b.physical===false?'other':b.actionKind??'physical-effort');actor.pa=actor.state.pa;}catch(e){return await fail(400,(e as Error).message);}}else actor.pa--;await saveTarget(db,actor);await recordAction(db,req.params.id,actor.id,1);
    payload={label:'Action effectuée · 1 PA',characterName:actor.name};publicEvent=!!actor.visible;
   }else if(b.action==='react'){
    if(!shared.active||!uuid(b.attackId)||!uuid(b.actorId)||!Number.isSafeInteger(b.actorVersion)||!uuid(b.expectedTargetId)||typeof b.powerId!=='string')return await fail(400,'invalid_reaction');
    const r=await db.query("SELECT payload FROM campaign_live_events WHERE id=$1 AND campaign_id=$2 AND kind='attack' FOR UPDATE",[b.attackId,req.params.id]);if(!r.rowCount)return await fail(404,'attack_not_found');const a=r.rows[0].payload;
    if(a.targetId!==b.expectedTargetId||(a.reactions??[]).length||a.electricDiversion)return await fail(409,'reaction_window_changed');
    if((await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind IN ('defend','resolve','cancel') AND payload->>'attackId'=$2",[req.params.id,b.attackId])).rowCount)return await fail(409,'reaction_window_closed');
    const actor=await target(db,req.params.id,b.actorId,true),victim=await target(db,req.params.id,a.targetId);
    if(!actor||actor.kind!=='character'||!victim||actor.id===victim.id||actor.id===a.attackerId||!access.manager&&(actor.owner_id!==user.id||!victim.visible))return await fail(404,'target_not_found');
    if(actor.version!==b.actorVersion)return await fail(409,'reaction_state_changed');
    if(!participates(shared,actor.id))return await fail(400,'participant_out');
    const rule=interpositionOptions(actor.data,actor.state).find(p=>p.id===b.powerId);if(!rule)return await fail(400,'reaction_unavailable');
    const movement=playProfile(actor.data,actor.state).derived.movement;
    try{interpositionCheck(rule,{...actor,movement},a,b);}catch(e){return await fail(400,(e as Error).message);}
    const physical=canSpendPhysicalPA(actor.state.effects??[],actor.id,actor.state,1);if(!physical.available)return await fail(400,'physical_pa_limited');actor.state.physicalPaSpent=physical.nextSpent;
    try{frenzyActionCheck(actor.state,1,b,{manager:access.manager});recordFrenzyAction(actor.state,1,b,{manager:access.manager});spendRestrictedPA(actor.state,1,'physical-defense');actor.pa=actor.state.pa;}catch(e){return await fail(400,(e as Error).message);}if(rule.limit)consumeUsage(actor.state,rule.limit,rule.id);
    let die:any=null,total:number|null=null;
    if(rule.kind==='redirect'){
     a.originalTargetId??=a.targetId;a.targetId=actor.id;
     if(uuid(a.attackerId)&&rule.id==='trait:gardien-de-la-meute'&&guardianBonus(actor.data,{...actor.state,targeted:{guardian:{targetId:a.attackerId,until:shared.round+1}}},a.attackerId)>0)actor.state.targeted={...actor.state.targeted,guardian:{targetId:a.attackerId,until:shared.round+1}};
     a.public=!!a.public&&actor.visible;
    }else{
     if(b.edge!==undefined&&typeof b.edge!=='boolean')return await fail(400,'invalid_edge');
     if(b.edge){const error=await spendEdge(db,actor.id,actor.data,b.requestId,'force');if(error)return await fail(400,error);}
     die=b.edge?forcedDie():rollD10(actor.stress,()=>randomInt(1,11));total=actor.activeDefense+die.sum;
     if(!die.narrativeFailure)a.reactionDefense=total;
     consumeRegisteredTest(actor.data,actor.state,'esquive');consumeNatureTest(actor.data,actor.state,'esquive');
    }
    a.reactions=[{actorId:actor.id,powerId:rule.id,kind:rule.kind,...(total!==null?{total,narrativeFailure:die.narrativeFailure}:{})}];
    await db.query('UPDATE campaign_live_events SET payload=$2::jsonb,public=$3 WHERE id=$1',[b.attackId,JSON.stringify(a),!!a.public]);await saveTarget(db,actor);
    payload={label:rule.name,attackId:b.attackId,characterName:actor.name,actorId:actor.id,targetId:a.targetId,originalTargetId:victim.id,paCost:1,...(die?{...die,modifier:actor.activeDefense,total}:{})};
   }else if(b.action==='lightning-arc'){
    if(!shared.active||!uuid(b.attackId)||!uuid(b.targetId)||!Number.isSafeInteger(b.actorVersion))return await fail(400,'foudre_arc_unavailable');
    const original=(await db.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND id=$2 AND kind='attack' AND live_session_id IS NOT DISTINCT FROM (SELECT session_id FROM campaign_live_context WHERE campaign_id=$1) FOR UPDATE",[req.params.id,b.attackId])).rows[0]?.payload;
    const outcome=(await db.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='resolve' AND payload->>'attackId'=$2",[req.params.id,b.attackId])).rows[0]?.payload;
    const source=original?.attackerId?await target(db,req.params.id,original.attackerId,true):null,victim=await target(db,req.params.id,b.targetId);
    if(!source||source.kind!=='character'||!victim||source.version!==b.actorVersion||!access.manager&&source.owner_id!==user.id||!access.manager&&!victim.visible||original.attackMode!=='foudre'||original.arcFrom||original.arcId||!outcome)return await fail(409,'foudre_arc_unavailable');
    if((await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind IN ('combat-start','combat-stop','combat-scene','combat-scenario') AND created_at>(SELECT created_at FROM campaign_live_events WHERE id=$2) LIMIT 1",[req.params.id,b.attackId])).rowCount)return await fail(409,'foudre_arc_unavailable');
    try{const arc=lightningArcPlan(source.data,source.state,{attackId:b.attackId,firstTargetId:original.targetId,secondTargetId:b.targetId,total:original.total,narrativeFailure:original.narrativeFailure,firstHit:outcome.hit,distance:b.distance,contextConfirmed:b.contextConfirmed});consumeLightningUsage(source.state,lightningIds.arc);original.arcId=b.requestId;await db.query('UPDATE campaign_live_events SET payload=$2::jsonb WHERE id=$1',[b.attackId,JSON.stringify(original)]);await saveTarget(db,source);payload={...original,arcId:null,arcFrom:b.attackId,lightningId:lightningIds.arc,lightning:{},targetId:victim.id,damage:arc.damage,electricDiversion:undefined,reactions:[],reactionDefense:undefined,bonusDamage:0,penetration:0,label:'Arc en chaîne · attaque à résoudre',public:!!source.visible&&!!victim.visible};}catch(e){return await fail(400,(e as Error).message);}
   }else if(b.action==='launch'){
    if(!uuid(b.attackerId)||!uuid(b.targetId)||b.attackerId===b.targetId||typeof b.optionId!=='string'||!integer(b.bonus,-100)||!integer(b.bonusDamage,-100)||typeof b.surprise!=='boolean')return await fail(400,'invalid_attack');
    // Serialize launches per campaign before acquiring two participant locks.
    await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[req.params.id+':launch']);
    const source=await target(db,req.params.id,b.attackerId,true),victim=await target(db,req.params.id,b.targetId);
    if(!source||!victim||!access.manager&&(source.owner_id!==user.id||!victim.visible))return await fail(404,'attack_not_found');
    const selectedOption=attackOptions(source,access.manager).find((r:any)=>r.id===b.optionId);if(!selectedOption)return await fail(400,'weapon_not_owned');const option={...selectedOption};
    let foudrePlan:any=null;if(option.attackMode==='foudre'){try{foudrePlan=lightningPlan(source.data,source.state,option.id,b);if(foudrePlan.targets.length>100||foudrePlan.targets.some((x:any)=>x.kind==='effect'||!uuid(x.id)||x.id===source.id))return await fail(400,'foudre_targets_required');for(const t of foudrePlan.targets){const v=await target(db,req.params.id,t.id);if(!v||!access.manager&&!v.visible)return await fail(404,'target_not_found');}if(foudrePlan.targets[0].id!==victim.id)return await fail(400,'foudre_targets_required');}catch(e){return await fail(400,(e as Error).message);}}
    if(option.requiresAdjudication){if(!access.manager||b.contextConfirmed!==true||!kinds.includes(b.damageType))return await fail(400,'truth_weapon_ruling_required');option.damageType=b.damageType;}
    if(option.condition&&b.contextConfirmed!==true)return await fail(400,'power_context_required');
    let riposte=false;
    if(b.riposteAttackId!==undefined){
     if(!uuid(b.riposteAttackId)||source.kind!=='character'||b.inReach!==true||b.powerId||b.surprise||!['melee','pugilat'].includes(option.skill)||option.attackMode!=='melee')return await fail(400,'invalid_riposte');
     const original=(await db.query("SELECT payload FROM campaign_live_events WHERE id=$1 AND campaign_id=$2 AND kind='attack'",[b.riposteAttackId,req.params.id])).rows[0]?.payload;
     const defense=(await db.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='defend' AND payload->>'attackId'=$2",[req.params.id,b.riposteAttackId])).rows[0]?.payload;
     const closed=await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind IN ('resolve','cancel') AND payload->>'attackId'=$2",[req.params.id,b.riposteAttackId]);
     if(!original||original.targetId!==source.id||original.attackerId!==victim.id||closed.rowCount||!ashornAvailable(source.data,source.state,original,defense))return await fail(400,'riposte_unavailable');
     consumeUsage(source.state,'scene','exile-riposte-d-ashorn');riposte=true;
    }
    let itemUse:any=null;if(source.kind==='character'&&option.sourceId){try{itemUse=prepareTruthWeaponUse(source.data,source.state,option.id,{inCombat:shared.active,activationKey:shared.round+':'+(source.state.activation??0)+':'+(shared.turns?.[source.id]??0),authorizationConfirmed:b.contextConfirmed===true,intensiveUse:b.intensiveUse===true,matterSpent:b.matterSpent,ordinaryPaCost:riposte?0:1});}catch(e){return await fail(400,(e as Error).message);}}
    if(source.state?.unconscious||source.hp<=0||!riposte&&source.pa<1||source.initiative===null||source.state?.muePending)return await fail(400,'attack_unavailable');
    if(source.kind==='character'){const ammunition=consumeWeaponCharge(source.state,option);if(ammunition.error)return await fail(400,ammunition.error);}
    if(!riposte&&option.attackMode!=='foudre'&&option.damageType!=='neuro'&&option.damageType!=='occulte'){const state=source.kind==='character'?source.state:source.data,physical=canSpendPhysicalPA(state.effects??state.liveEffects??[],source.id,{...state,round:source.state?.round??source.round},1);if(!physical.available)return await fail(400,'physical_pa_limited');state.physicalPaSpent=physical.nextSpent;}
    const attackCost=riposte?0:(foudrePlan?.actionCost??1)+(itemUse?.additionalPaCost??0);if(source.kind==='character'){try{frenzyActionCheck(source.state,attackCost,b,{manager:access.manager});restrictedActionCheck(source.state,option.attackMode==='foudre'?'occult':option.damageType==='neuro'?'neuro':option.damageType==='occulte'?'occult':option.attackMode==='ranged'?'ranged-attack':option.skill==='pugilat'?'pugilat':'melee',attackCost);}catch(e){return await fail(400,(e as Error).message);}}
    const eventId=randomUUID();
    if(b.edge!==undefined&&typeof b.edge!=='boolean')return await fail(400,'invalid_edge');
    if(b.edge){if(source.kind!=='character')return await fail(400,'edge_players_only');const error=await spendEdge(db,source.id,source.data,eventId,'force');if(error)return await fail(400,error);}
    let powerEffects:any[]=[];if(b.powerId){if(source.kind!=='character')return await fail(400,'power_unavailable');try{const p=registeredReaction(source.data,source.state,b.powerId,'attack',b,option.skill??(option.attackMode==='ranged'?'tir':option.id==='unarmed'?'pugilat':'melee'));powerEffects=p.effects;spendRegisteredUsage(source.state,b.powerId);}catch(e){return await fail(400,(e as Error).message);}}
    const guardian=source.kind==='character'?guardianBonus(source.data,source.state,victim.id):0;
    const die=b.edge?forcedDie():rollD10(source.stress,()=>randomInt(1,11)),modifier=option.modifier+b.bonus+guardian;
    const roll={label:'Attaque · '+option.label,characterName:source.name,characterId:source.kind==='character'?source.id:null,...die,modifier,total:modifier+die.sum,damage:option.damage,weaponName:option.weaponName??option.label,attackMode:option.attackMode,components:option.components?{...option.components,bonus:(option.components.bonus??0)+b.bonus+guardian,guardian}:undefined,targetName:victim.visible?victim.name:'Cible non révélée',bonus:b.bonus};
    const visible=!!source.visible&&!!victim.visible;
    await db.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'roll',$4::jsonb,$5::jsonb,$6)",[eventId,req.params.id,user.id,JSON.stringify(roll),JSON.stringify(b),visible]);
    if(source.kind==='character')recordFrenzyAction(source.state,attackCost,b,{manager:access.manager});if(foudrePlan)consumeLightningUsage(source.state,option.id);if(!riposte){if(source.kind==='character'){spendRestrictedPA(source.state,attackCost,option.attackMode==='foudre'?'occult':option.damageType==='neuro'?'neuro':option.damageType==='occulte'?'occult':option.attackMode==='ranged'?'ranged-attack':option.skill==='pugilat'?'pugilat':'melee');source.pa=source.state.pa;}else source.pa-=attackCost;}if(guardian)delete source.state.targeted.guardian;
    if(source.kind==='character'){const skill=option.skill??(option.damageType==='neuro'?'neurodive':option.attackMode==='ranged'?'tir':option.id==='unarmed'||option.predation?'pugilat':'melee');consumeRegisteredTest(source.data,source.state,skill);consumeNatureTest(source.data,source.state,skill);consumeSurvivalFury(source.data,source.state,skill);}await saveTarget(db,source);if(!riposte)await recordAction(db,req.params.id,source.id,attackCost);
    payload={label:'Attaque à résoudre',eventId,riposteAttackId:b.riposteAttackId??null,guardianBonus:guardian,targetId:victim.id,attacker:source.name,characterId:source.kind==='character'?source.id:null,total:roll.total,narrativeFailure:die.narrativeFailure,attackerId:source.id,predation:!!option.predation,damage:option.damage,bonusDamage:b.bonusDamage+combatEffect(source,'damage')+powerEffects.filter(e=>e.kind==='damage').reduce((n,e)=>n+e.amount,0),penetration:option.penetration+Math.max(0,...powerEffects.filter(e=>e.kind==='piercing').map(e=>e.amount)),damageType:option.damageType,attackMode:option.attackMode,...(option.attackMode==='foudre'?{distance:b.distance,supernatural:true,lightningId:option.id,lightning:option,occultTarget:foudrePlan?.targets[0]?.defenseKind==='occult'}:{}),weaponRuling:option.requiresAdjudication?{vector:option.damageType,confirmedBy:user.id,notes:option.notes}:null,modeRuling:itemUse?{mode:itemUse.mode,changeCost:itemUse.additionalPaCost,modeChanged:itemUse.modeChanged,confirmedBy:user.id}:null,surprise:b.surprise,public:visible};
    if(foudrePlan?.targets.length>1){for(const targetPlan of foudrePlan.targets.slice(1)){const v=await target(db,req.params.id,targetPlan.id);await db.query('INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7)',[randomUUID(),req.params.id,user.id,'attack',JSON.stringify({...payload,targetId:v.id,groupAttackId:b.requestId,distance:targetPlan.distance,occultTarget:targetPlan.defenseKind==='occult',public:!!source.visible&&!!v.visible}),JSON.stringify({groupAttackId:b.requestId,targetId:v.id}),!!source.visible&&!!v.visible]);}payload.groupAttackId=b.requestId;payload.targetCount=foudrePlan.targets.length;}
   }else if(b.action==='attack'){
    if(!access.manager)return await fail(403,'mj_only');
    if(b.attackMode!==undefined&&!['melee','ranged','fixed','margin','foudre'].includes(b.attackMode))return await fail(400,'invalid_attack');
    if(b.attackMode==='foudre'&&b.damageType!=='electricite')return await fail(400,'invalid_foudre_vector');
    if(!uuid(b.eventId)||!uuid(b.targetId)||!integer(b.damage)||!integer(b.bonusDamage,-100)||!integer(b.penetration)||!kinds.includes(b.damageType)||typeof b.surprise!=='boolean')return await fail(400,'invalid_attack');
    const r=await db.query(`SELECT payload,public FROM campaign_live_events WHERE id=$1 AND campaign_id=$2 AND kind IN ('roll','gm-roll') UNION ALL SELECT e.payload||jsonb_build_object('characterName',c.name),true AS public FROM character_play_events e JOIN characters c ON c.id=e.character_id WHERE e.id=$1 AND e.campaign_id=$2 AND c.campaign_id=$2 AND e.kind='roll'`,[b.eventId,req.params.id]);
    if(!r.rowCount||!Number.isSafeInteger(r.rows[0].payload.total)||!await target(db,req.params.id,b.targetId))return await fail(404,'attack_not_found');
    await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[b.eventId+':'+b.targetId]);
    const duplicate=await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind='attack' AND payload->>'eventId'=$2 AND payload->>'targetId'=$3",[req.params.id,b.eventId,b.targetId]);if(duplicate.rowCount)return await fail(409,'attack_already_requested');
    payload={label:'Attaque à résoudre',eventId:b.eventId,targetId:b.targetId,attacker:r.rows[0].payload.characterName??'Attaquant',total:r.rows[0].payload.total,narrativeFailure:!!r.rows[0].payload.narrativeFailure,damage:b.damage,bonusDamage:b.bonusDamage,penetration:b.penetration,damageType:b.damageType,attackMode:b.attackMode??r.rows[0].payload.attackMode??(b.damageType==='balistique'?'ranged':'melee'),surprise:b.surprise,public:!!r.rows[0].public};
   }else{
    if(!uuid(b.attackId))return await fail(400,'invalid_attack');await db.query('SELECT pg_advisory_xact_lock(hashtext($1))',[b.attackId]);
    const r=await db.query("SELECT payload FROM campaign_live_events WHERE id=$1 AND campaign_id=$2 AND kind='attack'",[b.attackId,req.params.id]);if(!r.rowCount)return await fail(404,'attack_not_found');const a=r.rows[0].payload;
    const t=await target(db,req.params.id,a.targetId,true);if(!t||!access.manager&&t.owner_id!==user.id&&!['paratonnerre','paratonnerre-force'].includes(b.action))return await fail(404,'target_not_found');
    const finished=await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind IN ('resolve','cancel') AND payload->>'attackId'=$2",[req.params.id,b.attackId]);if(finished.rowCount)return await fail(409,'attack_already_resolved');
    const d=await db.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='defend' AND payload->>'attackId'=$2",[req.params.id,b.attackId]);
    payload={attackId:b.attackId,targetId:t.id,characterName:t.name};
    if(b.action==='cancel'){if(!access.manager)return await fail(403,'mj_only');payload.label='Attaque annulée';}
    else if(b.action==='paratonnerre'||b.action==='paratonnerre-force'){
     const actorId=b.actorId??t.id;if(!uuid(actorId))return await fail(400,'paratonnerre_unavailable');
     const actor=actorId===t.id?t:await target(db,req.params.id,actorId,true);if(!actor||actor.kind!=='character'||!access.manager&&(actor.owner_id!==user.id||actor.id!==t.id&&!t.visible))return await fail(404,'target_not_found');
     if(b.action==='paratonnerre'&&actor.id!==t.id&&(b.allyConfirmed!==true||typeof b.distance!=='number'||!Number.isFinite(b.distance)||b.distance<0||b.distance>5||actor.id===a.attackerId))return await fail(400,'paratonnerre_ally_range');
     if(!shared.active||!participates(shared,actor.id)||actor.kind!=='character'||!Number.isSafeInteger(b.actorVersion)||actor.version!==b.actorVersion)return await fail(409,'paratonnerre_state_changed');
     if(d.rowCount)return await fail(409,'reaction_window_closed');
     if(b.action==='paratonnerre-force'){
      if(a.electricDiversion?.actorId!==actor.id||!a.electricDiversion?.eventId)return await fail(400,'paratonnerre_unavailable');
      const result=await forcePastRoll(db,actor,actor.state,a.electricDiversion.eventId);if(result.error)return await fail(400,result.error);payload={...payload,...result.payload};await saveTarget(db,actor);
     }else{
      const electricAccess=lightningAccess(actor.data,actor.state);
      if(a.electricDiversion||(a.reactions??[]).length||a.damageType!=='electricite'||a.narrativeFailure||a.surprise||!electricAccess.paratonnerre||electricAccess.paratonnerreUsed||actor.hp<=0||actor.state.unconscious||actor.state.muePending||actor.initiative===null||actor.pa<1)return await fail(400,'paratonnerre_unavailable');
      if(b.contextConfirmed!==true||b.safeDestinationConfirmed!==true||typeof b.destination!=='string'||!b.destination.trim()||b.destination.length>200)return await fail(400,'paratonnerre_destination_required');
      if(b.edge!==undefined&&typeof b.edge!=='boolean')return await fail(400,'invalid_edge');
      if(b.edge){const error=await spendEdge(db,actor.id,actor.data,b.requestId,'force');if(error)return await fail(400,error);}
      const skill=playProfile(actor.data,actor.state).skills.find(s=>s.id==='maitrise_spirituelle')!,die=b.edge?forcedDie():rollD10(actor.stress,()=>randomInt(1,11)),total=skill.total+die.sum,success=paratonnerreTest(total,die.narrativeFailure,a.total);
      a.electricDiversion={eventId:b.requestId,actorId:actor.id,protectedId:t.id,allyDistance:b.distance??0,...die,modifier:skill.total,total,success,edgeForced:!!b.edge};
      await db.query('UPDATE campaign_live_events SET payload=$2::jsonb WHERE id=$1',[b.attackId,JSON.stringify(a)]);
      try{frenzyActionCheck(actor.state,1,b,{manager:access.manager});recordFrenzyAction(actor.state,1,b,{manager:access.manager});spendRestrictedPA(actor.state,1,'occult');actor.pa=actor.state.pa;}catch(e){return await fail(400,(e as Error).message);}consumeUsage(actor.state,'round',lightningIds.paratonnerre);consumeRegisteredTest(actor.data,actor.state,skill.id);consumeNatureTest(actor.data,actor.state,skill.id);await saveTarget(db,actor);
      payload={...payload,characterId:actor.id,characterName:actor.name,actorId:actor.id,label:'Paratonnerre',...die,modifier:skill.total,total,success,opposition:a.total,paCost:1,destination:b.destination.trim(),components:{attributeName:'Volonté',attribute:skill.attributeValue,skillName:skill.name,rank:skill.rank,bonus:skill.bonus}};
     }
    }else if(b.action==='defend'){
     if(d.rowCount||a.electricDiversion?.success)return await fail(409,'defense_already_chosen');if(typeof b.active!=='boolean'||!integer(b.bonus,-100))return await fail(400,'invalid_defense');
     if(b.defensePowerId!==undefined&&(typeof b.defensePowerId!=='string'||b.defensePowerId.length>150))return await fail(400,'invalid_defense');
     const canReact=shared.active&&participates(shared,t.id)&&t.hp>0&&!t.state?.unconscious&&t.initiative!==null&&!a.narrativeFailure;
     const special=b.defensePowerId&&t.kind==='character'&&a.attackMode!=='foudre'?defenseOptions(t.data,t.state,a,canReact).find(p=>p.id===b.defensePowerId):null;
     if(b.defensePowerId&&(!b.active||!special?.available))return await fail(400,'defense_power_unavailable');
     const paCost=b.active?(special?.cost??1):0;
     if(special?.context&&b.contextConfirmed!==true)return await fail(400,'power_context_required');
     const neuroProgram=a.damageType==='neuro'&&b.active?t.reality?.neuroDefense.find((p:any)=>p.id===b.neuroProgramId):null;if(a.damageType==='neuro'&&b.active&&!neuroProgram)return await fail(400,'neuro_defense_program_required');
     const offeredDefenseBonus=Math.max(b.active?(special?.bonus??0):0,b.active&&a.damageType==='neuro'?(neuroProgram?.bonus??0):0,t.kind==='character'&&!(a.attackMode==='foudre'&&b.defenseKind==='occult')?vampireDefenseBonus(t.data,t.state,a):0);
     const physicalDefense=a.attackMode==='foudre'?b.defenseKind==='physical':!['neuro','occulte'].includes(a.damageType);
     const defenseDelta=t.kind==='character'&&physicalDefense?betweenStatesDefenseDelta(t.data,t.state,a,b.active,playProfile(t.data,t.state),offeredDefenseBonus):{bonus:offeredDefenseBonus,betweenBonus:0,existingCircumstance:0};
     const specialBonus=defenseDelta.bonus;
     if(b.active&&(!canReact||a.surprise&&!special?.surprise&&!t.canSurprised||t.pa<paCost))return await fail(400,'active_defense_unavailable');
     if(b.edge!==undefined&&typeof b.edge!=='boolean')return await fail(400,'invalid_edge');
     if(b.edge){if(!b.active||t.kind!=='character')return await fail(400,'edge_players_only');const error=await spendEdge(db,t.id,t.data,b.requestId,'force');if(error)return await fail(400,error);}
     if(a.attackMode==='foudre'&&(!['physical','occult'].includes(b.defenseKind)||a.occultTarget&&b.defenseKind!=='occult'||b.contextConfirmed!==true))return await fail(400,'foudre_defense_required');
     const base=a.attackMode==='foudre'?(b.defenseKind==='occult'?(b.active?t.activeOccultDefense:t.occultDefense):(b.active?t.activeDefense:t.defense)):a.damageType==='neuro'?(b.active?t.activeNeuroDefense??t.neuroDefense??t.occultDefense:t.neuroDefense??t.occultDefense):a.damageType==='occulte'?(b.active?t.activeOccultDefense??t.occultDefense:t.occultDefense):(b.active?t.activeDefense??t.defense:t.defense),die=b.active?(b.edge?forcedDie():rollD10(t.stress,()=>randomInt(1,11))):null;
     const bonus=t.defenseless?0:b.bonus;
     payload={...payload,characterId:t.kind==='character'?t.id:null,label:b.active?'Défense active':'Défense passive',active:b.active,modifier:base+bonus+specialBonus,...die,total:base+bonus+specialBonus+(die?.sum??0),paCost,...(a.attackMode==='foudre'?{defenseKind:b.defenseKind}:{}),defensePowerId:special?.id??null,defensePowerName:special?.name??null,components:{defense:base,bonus,specialBonus}};
     if(b.active){if((a.attackMode==='foudre'?b.defenseKind==='physical':!['neuro','occulte'].includes(a.damageType))){const state=t.kind==='character'?t.state:t.data,physical=canSpendPhysicalPA(state.effects??state.liveEffects??[],t.id,{...state,round:t.state?.round??t.round},paCost);if(!physical.available)return await fail(400,'physical_pa_limited');state.physicalPaSpent=physical.nextSpent;}if(t.kind==='character'){try{frenzyActionCheck(t.state,paCost,b,{manager:access.manager});recordFrenzyAction(t.state,paCost,b,{manager:access.manager});spendRestrictedPA(t.state,paCost,(a.attackMode==='foudre'?b.defenseKind==='occult':['neuro','occulte'].includes(a.damageType))?'occult':'physical-defense');t.pa=t.state.pa;}catch(e){return await fail(400,(e as Error).message);}}else t.pa-=paCost;if(special?.limit)consumeUsage(t.state,special.limit,special.id);if(t.kind==='character'){const skill=(a.attackMode==='foudre'?b.defenseKind==='occult':['neuro','occulte'].includes(a.damageType))?'force_mentale':'esquive';consumeRegisteredTest(t.data,t.state,skill);consumeNatureTest(t.data,t.state,skill);consumeSurvivalFury(t.data,t.state,skill);}await saveTarget(db,t);}
    }else{
     if(!d.rowCount&&!a.electricDiversion?.success)return await fail(400,'choose_defense');const defense=d.rows[0]?.payload??{total:t.defense,active:false,narrativeFailure:false};
     if(typeof b.material!=='boolean'||!Array.isArray(b.protectionIds)||b.protectionIds.length>100||b.protectionIds.some((id:any)=>!t.protections.some((p:any)=>p.id===id))||!integer(b.extraArmor)||!integer(b.extraReduction)||!integer(b.armor,-0,100)||!integer(b.defenseOverride,0,1000))return await fail(400,'invalid_reduction');
     if(b.hitZone!==undefined&&(typeof b.hitZone!=='string'||!b.hitZone.trim()||b.hitZone.length>100))return await fail(400,'invalid_hit_zone');
     if(defense.narrativeFailure&&!access.manager)return await fail(400,'mj_defense_ruling_required');
     const selected=t.protections.filter((p:any)=>b.protectionIds.includes(p.id));
     const foudre=a.attackMode==='foudre';
     if(foudre&&b.extraReduction>0&&(!access.manager||b.electricProtectionConfirmed!==true||typeof b.electricProtectionNote!=='string'||!b.electricProtectionNote.trim()||b.electricProtectionNote.length>200))return await fail(403,'electric_protection_ruling_required');
     const material=foudre||a.damageType==='neuro'||!b.material?0:Math.max(0,b.armor+Math.max(0,...selected.map((p:any)=>p.armor))+Math.max(t.bodyArmor??0,...selected.map((p:any)=>p.body))+b.extraArmor+combatArmorModifier(t,b.hitZone));
     let powerReduction=0;if(b.damagePowerId){if(t.kind!=='character'||foudre||['neuro','occulte'].includes(a.damageType))return await fail(400,'power_unavailable');try{const p=registeredReaction(t.data,t.state,b.damagePowerId,'damage',b);powerReduction=Math.max(0,...p.effects.filter(e=>e.kind==='reduction').map(e=>e.amount));spendRegisteredUsage(t.state,b.damagePowerId);}catch(e){return await fail(400,(e as Error).message);}}
     let sacrificeReduction=0;if(b.sacrificePrograms?.length){if(t.kind!=='character'||a.damageType!=='neuro')return await fail(400,'invalid_neuro_sacrifice');const sacrificed=neuroSacrifice(t.data,t.state,getRealityRules(),b.sacrificePrograms);if(sacrificed.error)return await fail(400,sacrificed.error);sacrificeReduction=sacrificed.payload!.reduction;await db.query('UPDATE characters SET data=$2::jsonb,version=version+1 WHERE id=$1',[t.id,JSON.stringify(t.data)]);}
     let ablationModule:any={reduction:0,moduleId:null};try{ablationModule=ablativeModuleReduction(t.kind==='character'?t.state:t.data,selected,a.damageType,{hostId:b.ablativeHostId,mountedConfirmed:b.ablativeMountedConfirmed},b.material&&!foudre&&a.damageType!=='neuro');}catch(e){return await fail(400,(e as Error).message);}
     const protectionVector=a.occultTarget?'occulte':a.damageType;
     const rawReduction=Math.max(0,powerReduction+sacrificeReduction+ablationModule.reduction+b.extraReduction+(foudre?0:combatEffect(t,'reduction'))+(t.reductions?.[protectionVector]??0)+Math.max(0,...selected.map((p:any)=>p.reductions[protectionVector]??0))+[...new Map(selected.map((p:any)=>[p.itemId??p.id,p])).values()].reduce((n:number,p:any)=>n+(p.additive?.[protectionVector]??0),0));
     let reduction=rawReduction;if(foudre){try{if(b.magicalProtection!==undefined&&(!access.manager||!integer(b.magicalProtection,0,rawReduction)))return await fail(403,'foudre_protection_ruling_required');reduction=lightningProtection(a.lightning??{},{electric:rawReduction,occult:rawReduction,magicalElectric:b.magicalProtection??0,magicalOccult:b.magicalProtection??0},!!a.occultTarget);}catch(e){return await fail(400,(e as Error).message);}}
     if(b.supernaturalConfirmed!==undefined&&(typeof b.supernaturalConfirmed!=='boolean'||b.supernaturalConfirmed&&!access.manager))return await fail(403,'supernatural_ruling_mj_only');
     const defenseTotal=Math.max(defense.narrativeFailure?b.defenseOverride:defense.total,a.reactionDefense??0);
     if(b.finVeritable!==undefined&&(typeof b.finVeritable!=='boolean'||b.finVeritable===true&&(!access.manager||!a.lightning?.finVeritable)))return await fail(403,'foudre_fin_ruling_required');
     const damageAttack={...a},source=a.attackerId?await target(db,req.params.id,a.attackerId,true):null;let erosion:any=null;if(b.erodeProtection){if(!access.manager||!foudre||!a.lightning?.erodesProtection||source?.kind!=='character')return await fail(403,'foudre_erosion_ruling_required');const layer=selected.find((p:any)=>p.id===b.erosionLayerId),raw=damageCalculation(a,defenseTotal,0,0);if(!layer)return await fail(400,'foudre_erosion_unavailable');try{erosion=lightningErosion(source.data,source.state,{hit:raw.hit,rawDamage:raw.damage,layerId:layer.id,protection:b.erosionAmount,material:b.erosionMaterial===true,directlyHitConfirmed:b.erosionConfirmed===true,alreadyEroded:(t.state??t.data).lightningErosion?.[layer.id]!==undefined});damageAttack.bonusDamage-=2;const st=t.state??t.data;st.lightningErosion={...st.lightningErosion,[layer.id]:{amount:erosion.reduction,material:b.erosionMaterial===true}};}catch(e){return await fail(400,(e as Error).message);}}
     const calc=damageCalculation(damageAttack,defenseTotal,material,reduction),before=t.hp;
     if(a.electricDiversion?.success){calc.hit=false;calc.damage=0;calc.alteration=false;}
     const guardReduction=consumeGuard(t.kind==='character'?t.state:t.data,calc.hit,foudre||a.damageType==='occulte'||b.supernaturalConfirmed===true);calc.reduction+=guardReduction;calc.damage=Math.max(0,calc.damage-guardReduction);
     const supernatural=foudre||a.damageType==='occulte'||b.supernaturalConfirmed===true,resourceState=t.kind==='character'?t.state:t.data;
     const ablativeSpent=consumeAblativeImpact(resourceState,selected,{hit:calc.hit,material:b.material&&!foudre&&a.damageType!=='neuro',vector:a.damageType,moduleId:ablationModule.moduleId});
     const brigandineReduction=t.kind==='character'?consumeBrigandineGuard(t.data,t.state,{worn:selected.some((p:any)=>p.sourceId===truthGuardItems.brigandine),supernatural,hit:calc.hit,damage:calc.damage}):0;calc.damage-=brigandineReduction;calc.reduction+=brigandineReduction;
     let tokenReduction=0;if(b.guardToken===true){if(t.kind!=='character')return await fail(400,'guard_token_not_applicable');try{frenzyActionCheck(t.state,1,b,{manager:access.manager});recordFrenzyAction(t.state,1,b,{manager:access.manager});tokenReduction=consumeGuardToken(t.data,t.state,{supernatural,damage:calc.damage,reactionAllowed:shared.active&&participates(shared,t.id)&&t.hp>0&&!t.state.unconscious&&!t.state.muePending&&t.initiative!==null&&t.pa>0&&!a.surprise});spendRestrictedPA(t.state,1,'occult');t.pa=t.state.pa;calc.damage-=tokenReduction;calc.reduction+=tokenReduction;}catch(e){return await fail(400,(e as Error).message);}}
     let auraReduction=0;if(b.auraSpend){if(t.kind!=='character'||a.damageType!=='occulte')return await fail(400,'egide_not_applicable');try{const r=applyNatureResourceAction(t.data,t.state,{action:'nature-angelus-egide',amount:b.auraSpend},{inCombat:shared.active,hp:t.hp,death:t.death,spiritualDamage:true,damage:calc.damage,permanentFortitude:playProfile(t.data,t.state).skills.find(s=>s.id==='force_mentale')!.rank});t.state=r.state;auraReduction=r.payload.damageReduction as number;t.pa=t.state.pa;}catch(e){return await fail(400,(e as Error).message);}calc.damage-=auraReduction;}
     t.hp=Math.max(t.death,t.hp-calc.damage);try{payload.lightningWounds=recordLightningWounds(t.kind==='character'?t.state:t.data,a.lightning??{},{actualDamage:calc.damage,beforeHp:before,afterHp:t.hp,death:t.death,sourceId:a.attackerId??'',eventId:b.requestId,...(b.finVeritable===true?{finalRuling:{manager:access.manager,fleauConfirmed:b.fleauConfirmed===true,destructionConditionsConfirmed:b.destructionConditionsConfirmed===true,note:b.finNote}}:{})});}catch(e){return await fail(400,(e as Error).message);}if(t.kind==='character'&&calc.damage>0){t.state.stabilized=false;if(t.data.truth?.nature==='vampire'&&lightningAutomaticSurvivalAllowed(t.state)){const saved=applyVampireLastSleep(t.data,{...t.state,hp:before},t.hp,t.death,b.bodySurvivable!==false);if(!('error'in saved)){t.state=saved.state;t.hp=saved.state.hp??t.hp;if(saved.payload.saved===true)t.pa=saved.state.pa;payload.lastSleep=saved.payload.saved===true;}}}t.pa=t.hp<=t.death?0:t.hp<=0?Math.min(t.pa,1):t.pa;
     if(t.kind==='character'&&calc.damage>0)payload.survivalFury=recordSurvivalFuryDamage(t.data,t.state,{beforeHp:before,afterHp:t.hp,maximum:t.pv_max,realDamage:true});
     if(a.predation&&a.attackerId){const predator=await target(db,req.params.id,a.attackerId,true);if(predator?.kind==='character'){const r=applyVampirePredation(predator.data,predator.state,{actualLoss:Math.max(0,before-t.hp),dr:Math.min(5,Math.floor(calc.margin/3)),success:calc.hit},predator.basePvMax??predator.pv_max);if(!('error'in r)){predator.state=r.state;predator.hp=r.state.hp??predator.hp;await saveTarget(db,predator);await db.query('INSERT INTO character_play_events(id,character_id,campaign_id,created_by,kind,payload,request_payload) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb)',[randomUUID(),predator.id,req.params.id,user.id,'vampire-predation-heal',JSON.stringify(r.payload),'{}']);payload.predation=true;}}}
     await saveTarget(db,t);payload={...payload,...(foudre&&b.extraReduction>0?{electricProtectionNote:b.electricProtectionNote.trim()}:{}),diverted:!!a.electricDiversion?.success,erosion,ablativeSpent,brigandineReduction,tokenReduction,powerReduction,sacrificeReduction,auraReduction,guardReduction,hitZone:b.hitZone??null,label:'Résolution d’attaque',...calc,before,after:t.hp,attackTotal:a.total,defenseTotal,defenseDice:defense.dice??[],active:defense.active,defenseNarrativeFailure:!!defense.narrativeFailure};publicEvent=a.public&&t.visible;
    }
   }
   await db.query('INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7)',[b.requestId,req.params.id,user.id,['launch','lightning-arc'].includes(b.action)?'attack':b.action,JSON.stringify(payload),JSON.stringify(b),publicEvent]);await pruneOccultMaintenance(db,req.params.id);if(b.action!=='grace')await maybeAdvanceCombat(db,req.params.id,user.id);await db.query('COMMIT');return {ok:true,...(['react','paratonnerre','paratonnerre-force'].includes(b.action)?{result:payload}:{})};
  }catch(e){await db.query('ROLLBACK').catch(()=>{});throw e;}finally{db.release();}
 });
}
