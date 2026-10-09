import {frenzyActionCheck,recordFrenzyAction} from './rules/live-frenzy.js';
import {resetRestrictedActivationWindow,spendRestrictedPA} from './rules/live-action-restrictions.js';
import type {FastifyInstance} from 'fastify';
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {blankPlayState,playProfile} from './rules/play-state.js';
import {liveBody} from './rules/play-truth.js';
import {usableLiveTalent} from './rules/live-mechanics.js';
import {lockCombat,combatState,pendingAttacks,participates,recordAction,maybeAdvanceCombat} from './campaign-rounds.js';
import {validateEffectDraft,createLiveEffect,addLiveEffect,removeLiveEffect,canonicalEffectDraft,canonicalEffectPresets,canSpendPhysicalPA,type CanonicalEffectId,type CanonicalEffectProof} from './rules/live-effects.js';
import {applyCharacterEffectTick,applyNpcEffectTick} from './live-effect-application.js';
const uuid=(v:any)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
async function actorInCampaign(db:any,campaign:string,id:string){
 const pc=await db.query(`SELECT c.*,s.state,s.version AS play_version FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' LEFT JOIN character_play_states s ON s.character_id=c.id WHERE c.id=$1 AND c.campaign_id=$2 AND c.archived_at IS NULL FOR UPDATE OF c`,[id,campaign]);
 if(pc.rowCount){const row=pc.rows[0];return {row,isPc:true,state:{...blankPlayState(),...row.state},version:row.play_version??0};}
 const npc=(await db.query('SELECT * FROM campaign_live_combatants WHERE id=$1 AND campaign_id=$2 AND NOT removed FOR UPDATE',[id,campaign])).rows[0];return npc?{row:npc,isPc:false,state:npc.data,version:npc.version}:null;
}
async function saveActor(db:any,actor:any){
 if(actor.isPc){actor.state.pa=playProfile(actor.row.data,actor.state).pa;await db.query(`INSERT INTO character_play_states(character_id,state,version) VALUES($1,$2::jsonb,$3) ON CONFLICT(character_id) DO UPDATE SET state=EXCLUDED.state,version=EXCLUDED.version,updated_at=now()`,[actor.row.id,JSON.stringify(actor.state),actor.version+1]);}
 else await db.query('UPDATE campaign_live_combatants SET data=$2::jsonb,hp=$3,pa=$4,version=version+1 WHERE id=$1',[actor.row.id,JSON.stringify(actor.state),actor.row.hp,actor.row.pa]);
}
function presetSourceAvailable(source:any,id:CanonicalEffectId){
 const d=source.row.data,s=source.state;
 if(id==='maitre_des_lames')return [d.talents?.origin,d.talents?.sphere,d.talents?.expertise,d.talents?.common,...(d.talents?.edge??[]),...(d.progression?.realityTalents??[]),...(d.talentIds??[])].includes(id);
 if(id.startsWith('munitions-'))return source.isPc?(d.reality?.equipment??[]).some((e:any)=>e.itemId===id&&e.quantity!==0):(d.equipmentIds??[]).includes(id);
 if(id.startsWith('khinae-serpent-')){const body=liveBody(d,s);return d.truth?.nature==='khinae'&&d.truth?.choices?.lineage==='serpents'&&body&&body.form!=='human'&&(id==='khinae-serpent-cobra'?d.truth?.choices?.variant==='cobra':d.truth?.choices?.variant==='vipere');}
 return usableLiveTalent(d,s,id);
}
async function verifiedPaidAttack(db:any,campaign:string,id:string,source:string,target:string){
 if(!uuid(id))return false;
 const r=await db.query(`SELECT request_payload FROM campaign_live_events e WHERE e.id=$1 AND e.campaign_id=$2 AND e.kind='attack' AND e.request_payload->>'action'='launch' AND e.request_payload->>'attackerId'=$3 AND e.request_payload->>'targetId'=$4 AND NOT EXISTS (SELECT 1 FROM campaign_live_events reset WHERE reset.campaign_id=e.campaign_id AND reset.kind IN ('combat-scene','combat-scenario') AND reset.created_at>e.created_at)`,[id,campaign,source,target]);
 return !!r.rowCount;
}
export async function registerCampaignMechanicsRoutes(app:FastifyInstance){
 app.post<{Params:{id:string};Body:any}>('/api/campaigns/:id/mechanics',async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;
  const b:any=req.body;if(!uuid(req.params.id)||!b||!uuid(b.requestId)||!uuid(b.actorId)||!Number.isInteger(b.version)||!['effect-add','effect-remove','activation-start','activation-end','effect-armor'].includes(b.action))return reply.code(400).send({error:'invalid_mechanics_action'});
  const db=await pool.connect();try{
   await db.query('BEGIN');const fail=async(status:number,error:string)=>{await db.query('ROLLBACK');return reply.code(status).send({error});};
   const access=await db.query("SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL AND $3::boolean",[req.params.id,user.id,['gm','editor','admin'].includes(user.role)]);if(!access.rowCount)return await fail(404,'campaign_not_found');
   await lockCombat(db,req.params.id);
   const prior=await db.query('SELECT campaign_id,created_by,request_payload FROM campaign_live_events WHERE id=$1',[b.requestId]);if(prior.rowCount){if(prior.rows[0].campaign_id!==req.params.id||prior.rows[0].created_by!==user.id||!isDeepStrictEqual(prior.rows[0].request_payload,b))return await fail(409,'mechanics_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
   const collision=await db.query('SELECT id FROM character_play_events WHERE id=$1',[b.requestId]);if(collision.rowCount)return await fail(409,'mechanics_request_conflict');
   if(await pendingAttacks(db,req.params.id))return await fail(400,'pending_attacks');
   const actor=await actorInCampaign(db,req.params.id,b.actorId);if(!actor)return await fail(404,'actor_not_found');
   const {row,isPc,state,version}=actor;if(version!==b.version)return await fail(409,'mechanics_version_conflict');
   const shared=await combatState(db,req.params.id),round=shared.active?shared.round:isPc?state.round:row.round,effects=isPc?state.effects??[]:state.liveEffects??[];
   let payload:any={label:'Effets en jeu · '+row.name,targetId:row.id,characterId:isPc?row.id:null,characterName:row.name},sourceToSave:any=null,actionCost=0;
   if(b.action==='effect-add'){
    let draft=b.effect,preset:any=null,source:any=null;
    if(b.preset){
     if(!(canonicalEffectPresets as readonly unknown[]).includes(b.preset)||!uuid(b.sourceId)||!b.proof||typeof b.proof!=='object'||Array.isArray(b.proof))return await fail(400,'invalid_effect_preset');
     const proofKeys=['owned','access','hit','alteration','damage','bleeds','exposed','resistanceFailed','connected','margin','physicalWeapon','affectedZone'];const numericKeys=['damage','margin'];
     if(Object.keys(b.proof).some(key=>!proofKeys.includes(key))||Object.entries(b.proof).some(([key,value])=>numericKeys.includes(key)?!Number.isSafeInteger(value)||Number(value)<0||Number(value)>10000:key==='affectedZone'?typeof value!=='string'||value.length===0||value.length>100:typeof value!=='boolean'))return await fail(400,'invalid_effect_proof');
     source=b.sourceId===row.id?actor:await actorInCampaign(db,req.params.id,b.sourceId);if(!source)return await fail(404,'effect_source_not_found');
     try{preset=canonicalEffectDraft(b.preset as CanonicalEffectId,{...b.proof,sourceId:source.row.id,targetId:row.id,owned:!!presetSourceAvailable(source,b.preset),access:true} as CanonicalEffectProof);draft=preset.draft;}catch(e){return await fail(400,(e as Error).message);}
    }
    if(!validateEffectDraft(draft)||draft.targetId!==row.id||!uuid(draft.sourceId))return await fail(400,'invalid_effect');
    source??=draft.sourceId===row.id?actor:await actorInCampaign(db,req.params.id,draft.sourceId);if(!source)return await fail(404,'effect_source_not_found');
    let usageKey:string|null=null,paidAttack=false;
    if(preset?.limit){usageKey=`${preset.limit}:${b.preset}${String(b.preset).startsWith('khinae-serpent-')?':'+row.id:''}`;if((source.state.powerUses?.[usageKey]??0)>0)return await fail(400,'power_already_used');}
    if(preset?.paCost){
     const profile=source.isPc?playProfile(source.row.data,source.state):null,hp=profile?.hp??source.row.hp;
     if(hp<=0||source.state.unconscious)return await fail(400,'effect_source_cannot_act');
     if(b.sourceActionId!==undefined){paidAttack=await verifiedPaidAttack(db,req.params.id,b.sourceActionId,source.row.id,row.id);if(!paidAttack)return await fail(400,'invalid_paid_effect_attack');}
     if(shared.active&&!paidAttack){
      const pa=source.isPc?profile!.pa:source.row.pa,initiative=source.isPc?source.state.initiative:source.row.initiative;
      if(initiative===null||!participates(shared,source.row.id)||pa<preset.paCost)return await fail(400,'insufficient_pa');
      const physical=canSpendPhysicalPA(source.isPc?source.state.effects??[]:source.state.liveEffects??[],source.row.id,{...source.state,round},preset.paCost);if(!physical.available)return await fail(400,'physical_pa_limit');source.state.physicalPaSpent=physical.nextSpent;
      if(!source.isPc)source.state.pa=source.row.pa;try{frenzyActionCheck(source.state,preset.paCost,b,{manager:true});spendRestrictedPA(source.state,preset.paCost,'other');recordFrenzyAction(source.state,preset.paCost,b,{manager:true});}catch(e){return await fail(400,(e as Error).message);}if(!source.isPc)source.row.pa=source.state.pa;actionCost=preset.paCost;
     }
    }
    try{const next=addLiveEffect(effects,createLiveEffect(draft,{id:randomUUID(),round,targetActivation:state.activation??0}));if(isPc)state.effects=next;else state.liveEffects=next;}catch(e){return await fail(400,(e as Error).message);}
    if(usageKey){source.state.powerUses??={};source.state.powerUses[usageKey]=(source.state.powerUses[usageKey]??0)+1;}
    if((usageKey||actionCost)&&source!==actor)sourceToSave=source;
    payload={...payload,label:'Effet attribué · '+draft.name,effect:draft,preset:b.preset??null,sourceId:source.row.id,paCost:preset?.paCost??0,paSpent:actionCost,paidAttack,sourceActionId:b.sourceActionId??null,usageKey};
   }else if(b.action==='effect-remove'){
    if(typeof b.effectId!=='string'||!effects.some((e:any)=>e.id===b.effectId))return await fail(400,'effect_not_found');
    const effect=effects.find((e:any)=>e.id===b.effectId),treatment=b.treatment===true;
    if(b.treatment!==undefined&&typeof b.treatment!=='boolean')return await fail(400,'invalid_effect_treatment');
    if(treatment){
     if(!['maitre_des_lames','extral-jet-d-encre'].includes(effect.ruleId))return await fail(400,'effect_requires_manager_ruling');
     if(shared.active){const hp=isPc?playProfile(row.data,state).hp:row.hp,pa=isPc?state.pa:row.pa,initiative=isPc?state.initiative:row.initiative;if(hp<=0||state.unconscious||initiative===null||pa<1||!participates(shared,row.id))return await fail(400,'insufficient_pa');const physical=canSpendPhysicalPA(effects,row.id,{...state,round},1);if(!physical.available)return await fail(400,'physical_pa_limit');state.physicalPaSpent=physical.nextSpent;if(!isPc)state.pa=row.pa;try{frenzyActionCheck(state,1,b,{manager:true});spendRestrictedPA(state,1,'physical-effort');recordFrenzyAction(state,1,b,{manager:true});}catch(e){return await fail(400,(e as Error).message);}if(!isPc)row.pa=state.pa;actionCost=1;}
    }
    if(isPc)state.effects=removeLiveEffect(effects,b.effectId);else state.liveEffects=removeLiveEffect(effects,b.effectId);payload={...payload,effectId:b.effectId,treatment,paSpent:actionCost,ruling:!treatment?'Retrait arbitré par le MJ':null};
   }else if(b.action==='effect-armor'){
    if(!Number.isInteger(b.armor)||b.armor<0||b.armor>100)return await fail(400,'invalid_effect_armor');state.effectArmor=b.armor;payload.armor=b.armor;
   }else{
    if(!shared.active)return await fail(400,'combat_not_started');
    const start=b.action==='activation-start';if(start===!!state.activationOpen)return await fail(400,'activation_phase_conflict');
    if(start){resetRestrictedActivationWindow(state);state.activation=(state.activation??0)+1;state.physicalPaSpent=0;}state.activationOpen=start;
    const event={phase:b.action as 'activation-start'|'activation-end',round,actorId:row.id,activation:state.activation??0};
    const result=isPc?applyCharacterEffectTick(row.data,state,event):applyNpcEffectTick(row,event);payload={...payload,label:start?'Début d’activation':'Fin d’activation',...result,activation:state.activation};
   }
   await saveActor(db,actor);if(sourceToSave)await saveActor(db,sourceToSave);
   if(actionCost>0)await recordAction(db,req.params.id,sourceToSave?.row.id??(b.action==='effect-add'?payload.sourceId:row.id),actionCost);
   const safePayload={...payload};delete safePayload.effect;if(payload.effect)safePayload.effect={...payload.effect,sourceId:undefined};
   if(isPc)await db.query('INSERT INTO character_play_events(id,character_id,campaign_id,created_by,kind,payload,request_payload) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb)',[b.requestId,row.id,req.params.id,user.id,b.action,JSON.stringify(safePayload),JSON.stringify({requestId:b.requestId,action:b.action,actorId:row.id})]);
   await db.query('INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,false)',[b.requestId,req.params.id,user.id,b.action,JSON.stringify(payload),JSON.stringify(b)]);
   if(actionCost>0)await maybeAdvanceCombat(db,req.params.id,user.id);
   await db.query('COMMIT');return {ok:true,version:version+1};
  }catch(e){await db.query('ROLLBACK').catch(()=>{});throw e;}finally{db.release();}
 });
}
