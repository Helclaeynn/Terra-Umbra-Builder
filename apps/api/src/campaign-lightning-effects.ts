import type {FastifyInstance} from 'fastify';
import {randomInt} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {member,target,saveTarget} from './campaign-combat.js';
import {lockCombat,combatState,participates,recordAction,maybeAdvanceCombat} from './campaign-rounds.js';
import {playProfile,rollD10} from './rules/play-state.js';
import {validateLiveEffect,formatLiveEffect} from './rules/live-effects.js';
import {lightningIds as I,lightningAvailable,lightningEffectPlan,lightningEffectResult,consumeLightningUsage,type LightningEffect} from './rules/lightning.js';
import {applyLightningEffectChange} from './rules/lightning-effects-state.js';
import {consumeNatureTest} from './rules/live-nature-resources.js';
import {consumeRegisteredTest} from './rules/registered-power-state.js';
import {restrictedActionCheck,spendRestrictedPA} from './rules/live-action-restrictions.js';
import {edgeBalance,spendEdge,forcedDie} from './character-edge.js';
import {pruneOccultMaintenance} from './campaign-occult-resolutions.js';
const uuid=(v:any)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const text=(v:any,max=400)=>typeof v==='string'&&!!v.trim()&&v.length<=max&&!/[\u0000-\u001f\u007f]/.test(v);
const powers=[I.briseMagie,I.affliction,I.eclipse,I.poussiere];
const names:Record<string,string>={[I.briseMagie]:'Brise-magie',[I.affliction]:'Éroder l’affliction',[I.eclipse]:'Éclipse noire',[I.poussiere]:'Réduire en poussière'};
const actorEffects=(a:any)=>a.kind==='character'?a.state.effects??[]:a.data.liveEffects??[];
const effectState=(a:any)=>a.kind==='character'?a.state:a.data;
async function currentEvent(db:any,campaign:string,id:string){return (await db.query(`SELECT e.* FROM campaign_live_events e WHERE e.id=$1 AND e.campaign_id=$2 AND e.kind='lightning-effect-roll' AND e.live_session_id IS NOT DISTINCT FROM (SELECT session_id FROM campaign_live_context WHERE campaign_id=$2) AND NOT EXISTS(SELECT 1 FROM campaign_live_events b WHERE b.campaign_id=$2 AND b.kind IN ('combat-scene','combat-scenario','combat-stop','combat-start') AND b.created_at>e.created_at)`,[id,campaign])).rows[0];}
export async function registerCampaignLightningEffectRoutes(app:FastifyInstance){
 const endpoint='/api/campaigns/:id/lightning-effects';
 app.get<{Params:{id:string}}>(endpoint,async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;
  const access=uuid(req.params.id)?await member(pool,req.params.id,user):null;if(!access?.manager)return reply.code(404).send({error:'campaign_not_found'});
  const rows=(await pool.query(`SELECT c.id FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' WHERE c.campaign_id=$1 AND c.archived_at IS NULL UNION ALL SELECT id FROM campaign_live_combatants WHERE campaign_id=$1 AND NOT removed`,[req.params.id])).rows;
  const sources=[],targets=[];
  for(const row of rows){const a=await target(pool,req.params.id,row.id);if(!a)continue;if(a.kind==='character'){const p=powers.filter(id=>id!==I.poussiere&&lightningAvailable(a.data,a.state,id));if(p.length||lightningAvailable(a.data,a.state,I.poussiere))sources.push({id:a.id,name:a.name,version:a.version,edge:await edgeBalance(pool,a.id,a.data),dust:lightningAvailable(a.data,a.state,I.poussiere),powers:p.map(id=>({id,name:names[id],cost:id===I.eclipse?2:1}))});}
   const list=actorEffects(a).filter(validateLiveEffect).map((e:any)=>({id:e.id,name:e.name,description:formatLiveEffect(e),temporary:e.expires.unit!=='manual',numericMalus:e.kind==='modifier'&&e.amount<0}));if(list.length)targets.push({id:a.id,name:a.name,version:a.version,effects:list});
  }
  const recent=(await pool.query(`SELECT e.id,e.payload FROM campaign_live_events e WHERE e.campaign_id=$1 AND e.kind='lightning-effect-roll' AND e.live_session_id IS NOT DISTINCT FROM (SELECT session_id FROM campaign_live_context WHERE campaign_id=$1) AND NOT EXISTS(SELECT 1 FROM campaign_live_events b WHERE b.campaign_id=$1 AND b.kind IN ('combat-scene','combat-scenario','combat-stop','combat-start') AND b.created_at>e.created_at) ORDER BY e.created_at DESC LIMIT 12`,[req.params.id])).rows;
  return {canManage:true,sources,targets,recent};
 });
 app.post<{Params:{id:string};Body:any}>(endpoint,async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;const b=req.body as any,campaign=req.params.id;
  if(!uuid(campaign)||!b||!uuid(b.requestId)||!['resolve','dust','force'].includes(b.action))return reply.code(400).send({error:'invalid_lightning_effect_action'});
  const db=await pool.connect();try{
   await db.query('BEGIN');const fail=async(status:number,error:string)=>{await db.query('ROLLBACK');return reply.code(status).send({error});};
   const access=await member(db,campaign,user);if(!access?.manager)return await fail(404,'campaign_not_found');await lockCombat(db,campaign);
   const prior=(await db.query('SELECT campaign_id,created_by,request_payload,payload FROM campaign_live_events WHERE id=$1',[b.requestId])).rows[0];if(prior){if(prior.campaign_id!==campaign||prior.created_by!==user.id||!isDeepStrictEqual(prior.request_payload,b))return await fail(409,'lightning_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true,result:prior.payload};}
   if((await db.query('SELECT id FROM character_play_events WHERE id=$1',[b.requestId])).rowCount)return await fail(409,'lightning_request_conflict');
   let original:any=null,input:any=b,powerId=b.powerId;
   if(b.action!=='resolve'){
    if(!uuid(b.sourceRollId))return await fail(400,'foudre_effect_source_roll_required');original=await currentEvent(db,campaign,b.sourceRollId);if(!original)return await fail(409,'foudre_effect_closed');
    input={...original.payload.input,sourceVersion:b.sourceVersion,targets:(original.payload.input.targets??[]).map((t:any)=>({...t,version:(b.targetVersions??{})[t.actorId]}))};powerId=b.action==='dust'?I.poussiere:original.payload.powerId;
    if(b.action==='dust'&&(original.payload.narrativeFailure||!original.payload.outcomes.some((o:any)=>o.success)||(await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind='lightning-effect-dust' AND payload->>'sourceRollId'=$2",[campaign,original.id])).rowCount))return await fail(400,'foudre_effect_source_roll_required');
    if(b.action==='force'&&(original.payload.edgeForced||original.payload.edgeBefore||original.payload.outcomes.some((o:any)=>o.success)||(await db.query("SELECT id FROM campaign_live_events WHERE campaign_id=$1 AND kind='lightning-effect-force' AND payload->>'sourceRollId'=$2",[campaign,original.id])).rowCount))return await fail(400,'edge_roll_resolved');
   }
   if(!uuid(input.sourceId)||!Number.isSafeInteger(input.sourceVersion)||!powers.includes(powerId)||!Array.isArray(input.targets)||input.targets.length<1||input.targets.length>(powerId===I.eclipse?3:1)||input.targets.some((t:any)=>!t||typeof t!=='object'||!t.ruling||typeof t.ruling!=='object')||new Set(input.targets.map((t:any)=>t.actorId+':'+t.effectId)).size!==input.targets.length)return await fail(400,'invalid_lightning_effect_target');
   const source=await target(db,campaign,input.sourceId,true);if(!source||source.kind!=='character')return await fail(404,'target_not_found');if(source.version!==input.sourceVersion)return await fail(409,'lightning_version_conflict');
   if(!lightningAvailable(source.data,source.state,powerId)&&b.action!=='force')return await fail(400,'foudre_effect_unavailable');
   const shared=await combatState(db,campaign),cost=b.action==='resolve'?(powerId===I.eclipse?2:1):0;
   if(source.hp<=0||source.state.unconscious||source.state.muePending||source.state.revelation!=='r'||shared.active&&(!participates(shared,source.id)||source.initiative===null||source.pa<cost))return await fail(400,'foudre_source_unavailable');
   if(shared.active&&cost){try{restrictedActionCheck(source.state,'occult',cost);}catch(e){return await fail(400,(e as Error).message);}}
   if(b.action==='force'&&!lightningAvailable(source.data,source.state,powerId)&&powerId!==I.eclipse)return await fail(400,'foudre_effect_unavailable');
   const plans:any[]=[],actors=new Map<string,any>([[source.id,source]]);
   for(const t of input.targets){
    if(!uuid(t.actorId)||!text(t.effectId,150)||!Number.isSafeInteger(t.version)||!text(t.ruling?.note))return await fail(400,'invalid_lightning_effect_target');
    const actor=actors.get(t.actorId)??await target(db,campaign,t.actorId,true);if(!actor)return await fail(404,'target_not_found');actors.set(t.actorId,actor);if(actor.version!==t.version)return await fail(409,'lightning_version_conflict');
    const existing=actorEffects(actor).find((e:any)=>e.id===t.effectId);if(!existing||!validateLiveEffect(existing))return await fail(409,'foudre_effect_closed');
    if(powerId===I.affliction&&(existing.kind!=='modifier'||existing.amount>=0))return await fail(400,'foudre_affliction_not_numeric');
    // The persisted live effect defines whether the effect is temporary; clients cannot promote it.
    const effect:LightningEffect={id:existing.id,kind:existing.expires.unit==='manual'?'permanent':'temporary',threshold:t.ruling.threshold,originalTotal:t.ruling.originalTotal,interruptible:t.ruling.interruptible===true,primordial:t.ruling.primordial===true,indestructible:t.ruling.indestructible===true,metaphysical:t.ruling.metaphysical===true,perceived:t.ruling.perceived===true};
    if(t.ruling.magical!==true)return await fail(400,'foudre_effect_ruling_required');
    // For a known resolved spell, the recorded launch result is authoritative.
    const resolved=(await db.query("SELECT payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='occult-resolve' AND payload->'targets' @> $2::jsonb ORDER BY created_at DESC LIMIT 1",[campaign,JSON.stringify([{actorId:actor.id,effectIds:[existing.id]}])])).rows[0];if(Number.isFinite(resolved?.payload.counterDifficulty))effect.originalTotal=resolved.payload.counterDifficulty;
    const oldOutcome=original?.payload.outcomes.find((o:any)=>o.actorId===actor.id&&o.effectId===existing.id);
    if(b.action==='dust'&&!oldOutcome?.success)return await fail(400,'foudre_effect_source_roll_required');
    let plan;try{plan=lightningEffectPlan(source.data,b.action==='force'?{...source.state,powerUses:{...source.state.powerUses,['scene:'+powerId]:0}}:source.state,powerId,effect,{distance:t.distance,contextConfirmed:input.contextConfirmed,targetNatureConfirmed:true,...(b.action==='dust'?{sourceRoll:{id:original.id,total:original.payload.total,narrativeFailure:original.payload.narrativeFailure,success:oldOutcome.success}}:{})});}catch(e){return await fail(400,(e as Error).message);}
    plans.push({actor,plan,effectId:existing.id,effectName:existing.name});
   }
   if(b.action==='resolve'&&b.edge!==undefined&&typeof b.edge!=='boolean')return await fail(400,'invalid_edge');
   if(b.action==='force'||b.edge===true){const error=await spendEdge(db,source.id,source.data,b.action==='force'?original.id:b.requestId,'force');if(error)return await fail(400,error);}
   const skill=playProfile(source.data,source.state).skills.find(s=>s.id==='maitrise_spirituelle')!;
   const die=b.action==='dust'?{dice:original.payload.dice,sum:original.payload.sum,narrativeFailure:original.payload.narrativeFailure}:b.action==='force'||b.edge?forcedDie():rollD10(source.stress,()=>randomInt(1,11));
   const modifier=b.action==='resolve'?skill.total:original.payload.modifier,total=b.action==='dust'?original.payload.total:modifier+die.sum;
   const outcomes=[];let destroyed=false;
   for(const p of plans){const outcome=lightningEffectResult(p.plan,total,die.narrativeFailure);let change:any={changed:false};if(outcome.success){try{change=applyLightningEffectChange(effectState(p.actor),p.effectId,outcome.result,p.actor.kind!=='character');}catch(e){return await fail(400,(e as Error).message);}destroyed||=outcome.result==='destroy';}outcomes.push({actorId:p.actor.id,targetName:p.actor.name,effectId:p.effectId,effectName:p.effectName,difficulty:p.plan.difficulty,...outcome,...change});}
   if(b.action==='resolve'){if(shared.active){spendRestrictedPA(source.state,cost,'occult');source.pa=source.state.pa;}consumeLightningUsage(source.state,powerId);consumeRegisteredTest(source.data,source.state,skill.id);consumeNatureTest(source.data,source.state,skill.id);}
   const saved=new Set<string>();for(const actor of [source,...plans.map(p=>p.actor)])if(!saved.has(actor.id)){await saveTarget(db,actor);saved.add(actor.id);}
   if(shared.active&&cost)await recordAction(db,campaign,source.id,cost);
   const payload={label:names[powerId],sourceId:source.id,characterName:source.name,powerId,sourceRollId:original?.id??null,modifier,components:b.action==='resolve'?{attributeName:'Volonté',attribute:skill.attributeValue,rank:skill.rank,bonus:skill.bonus,skillName:skill.name}:original.payload.components,...die,total,edgeBefore:b.edge===true,edgeForced:b.action==='force',paCost:shared.active?cost:0,input:b.action==='resolve'?{sourceId:source.id,contextConfirmed:input.contextConfirmed,targets:input.targets}:original.payload.input,outcomes};
   const kind=b.action==='resolve'?'lightning-effect-roll':b.action==='dust'?'lightning-effect-dust':'lightning-effect-force';
   await db.query('INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,false)',[b.requestId,campaign,user.id,kind,JSON.stringify(payload),JSON.stringify(b)]);
   if(b.action==='force')await db.query('UPDATE campaign_live_events SET payload=payload||$2::jsonb WHERE id=$1',[original.id,JSON.stringify({dice:die.dice,sum:die.sum,narrativeFailure:die.narrativeFailure,total,edgeForced:true,outcomes})]);
   if(destroyed)await pruneOccultMaintenance(db,campaign);if(shared.active&&cost)await maybeAdvanceCombat(db,campaign,user.id);await db.query('COMMIT');return {ok:true,result:payload};
  }catch(e){await db.query('ROLLBACK').catch(()=>{});throw e;}finally{db.release();}
 });
}
