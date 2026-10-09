import type {FastifyInstance} from 'fastify';
import {randomUUID,randomInt} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {member,target,saveTarget} from './campaign-combat.js';
import {combatState,lockCombat,participates,recordAction,maybeAdvanceCombat} from './campaign-rounds.js';
import {playProfile,rollD10} from './rules/play-state.js';
import {targetedOptions,targetUsageKey,healingTest} from './rules/targeted-powers.js';
import {reserveHealing} from './rules/live-mechanics.js';
import {consumeRegisteredTest} from './rules/registered-power-state.js';
import {consumeNatureTest} from './rules/live-nature-resources.js';
import {edgeBalance,spendEdge,forcedDie} from './character-edge.js';
const uuid=(v:any)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const pendingSql=`SELECT e.* FROM campaign_live_events e WHERE e.campaign_id=$1 AND e.kind='targeted-offer' AND NOT EXISTS(SELECT 1 FROM campaign_live_events done WHERE done.campaign_id=e.campaign_id AND done.kind IN ('targeted-resolve','targeted-cancel') AND done.payload->>'offerId'=e.id::text) AND NOT EXISTS(SELECT 1 FROM campaign_live_events boundary WHERE boundary.campaign_id=e.campaign_id AND boundary.kind IN ('combat-start','combat-stop','combat-round','combat-scene','combat-scenario') AND boundary.created_at>e.created_at) ORDER BY e.created_at`;
export async function registerCampaignTargetedPowerRoutes(app:FastifyInstance){
 const endpoint='/api/campaigns/:id/targeted-powers';
 app.get<{Params:{id:string}}>(endpoint,async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;
  if(!uuid(req.params.id))return reply.code(404).send({error:'campaign_not_found'});
  const access=await member(pool,req.params.id,user);if(!access)return reply.code(404).send({error:'campaign_not_found'});
  const ids=await pool.query(`SELECT c.id FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' WHERE c.campaign_id=$1 AND c.archived_at IS NULL AND ($3::boolean OR c.owner_id=$2)`,[req.params.id,user.id,access.manager]);
  const sources=[];for(const {id} of ids.rows){const actor=await target(pool,req.params.id,id);if(actor)sources.push({id,name:actor.name,version:actor.version,edge:await edgeBalance(pool,id,actor.data),powers:targetedOptions(actor.data,actor.state)});}
  const offers=[];for(const e of (await pool.query(pendingSql,[req.params.id])).rows){
   const s=await target(pool,req.params.id,e.payload.sourceId),t=await target(pool,req.params.id,e.payload.targetId);if(!s||!t||!access.manager&&s.owner_id!==user.id&&t.owner_id!==user.id)continue;
   offers.push({id:e.id,sourceName:s.name,targetName:t.name,powerName:e.payload.powerName,canAccept:!!access.manager||t.owner_id===user.id,canCancel:!!access.manager||s.owner_id===user.id||t.owner_id===user.id});
  }
  const all=await pool.query(`SELECT c.id FROM characters c JOIN campaign_members m ON m.character_id=c.id AND m.user_id=c.owner_id AND m.campaign_id=c.campaign_id AND m.status='accepted' WHERE c.campaign_id=$1 AND c.archived_at IS NULL UNION ALL SELECT id FROM campaign_live_combatants WHERE campaign_id=$1 AND NOT removed`,[req.params.id]);
  const targets=[],authorized=new Set<string>();
  for(const {id} of all.rows){const actor=await target(pool,req.params.id,id);if(!actor)continue;if(access.manager||actor.owner_id===user.id)authorized.add(id);if(access.manager||actor.owner_id===user.id||actor.visible)targets.push({id,name:actor.name,version:actor.version});}
  const results=[];for(const e of (await pool.query("SELECT id,payload FROM campaign_live_events WHERE campaign_id=$1 AND kind='targeted-resolve' ORDER BY created_at DESC LIMIT 30",[req.params.id])).rows){if(!access.manager&&!authorized.has(e.payload.sourceId)&&!authorized.has(e.payload.targetId))continue;const payload={...e.payload};if(!access.manager&&!authorized.has(e.payload.targetId)){delete payload.before;delete payload.after;}results.push({id:e.id,...payload});}
  return {sources,targets,offers,results,canManage:!!access.manager};
 });
 app.post<{Params:{id:string};Body:any}>(endpoint,async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;
  const b:any=req.body;if(!uuid(req.params.id)||!b||!uuid(b.requestId)||!['request','accept','cancel'].includes(b.action))return reply.code(400).send({error:'invalid_targeted_action'});
  const db=await pool.connect();try{
   await db.query('BEGIN');const fail=async(status:number,error:string)=>{await db.query('ROLLBACK');return reply.code(status).send({error});};
   const access=await member(db,req.params.id,user);if(!access)return await fail(404,'campaign_not_found');
   await lockCombat(db,req.params.id);
   const prior=await db.query('SELECT campaign_id,created_by,request_payload FROM campaign_live_events WHERE id=$1',[b.requestId]);
   if(prior.rowCount){if(prior.rows[0].campaign_id!==req.params.id||prior.rows[0].created_by!==user.id||!isDeepStrictEqual(prior.rows[0].request_payload,b))return await fail(409,'targeted_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
   if((await db.query('SELECT id FROM character_play_events WHERE id=$1',[b.requestId])).rowCount)return await fail(409,'targeted_request_conflict');
   let input:any=b,offer:any=null;
   if(b.action!=='request'){
    if(!uuid(b.offerId))return await fail(400,'invalid_targeted_offer');
    offer=(await db.query(pendingSql,[req.params.id])).rows.find((e:any)=>e.id===b.offerId);if(!offer)return await fail(409,'targeted_offer_closed');input=offer.payload;
   }
   if(!uuid(input.sourceId)||!uuid(input.targetId)||typeof input.powerId!=='string'||!Number.isSafeInteger(input.sourceVersion)||!Number.isSafeInteger(input.targetVersion))return await fail(400,'invalid_targeted_power');
   const source=await target(db,req.params.id,input.sourceId,true),beneficiary=input.sourceId===input.targetId?source:await target(db,req.params.id,input.targetId,true);
   if(!source||!beneficiary)return await fail(404,'target_not_found');
   if(b.action==='cancel'){
    if(!access.manager&&source.owner_id!==user.id&&beneficiary.owner_id!==user.id)return await fail(404,'target_not_found');
    await db.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'targeted-cancel',$4::jsonb,$5::jsonb,false)",[b.requestId,req.params.id,user.id,JSON.stringify({offerId:b.offerId,label:'Pouvoir ciblé refusé ou annulé'}),JSON.stringify(b)]);await db.query('COMMIT');return {ok:true};
   }
   if(source.kind!=='character'||b.action==='request'&&!access.manager&&(source.owner_id!==user.id||source.id!==beneficiary.id&&!beneficiary.visible)||b.action==='accept'&&!access.manager&&beneficiary.owner_id!==user.id)return await fail(404,'target_not_found');
   const rule=targetedOptions(source.data,source.state).find(r=>r.id===input.powerId);if(!rule)return await fail(400,'targeted_power_unavailable');
   if(input.edge!==undefined&&typeof input.edge!=='boolean'||input.edge&&rule.id!=='exile-refection-vitale')return await fail(400,'invalid_edge');
   const shared=await combatState(db,req.params.id);
   if(source.version!==input.sourceVersion||beneficiary.version!==input.targetVersion)return await fail(409,'targeted_state_changed');
   if(input.contextConfirmed!==true||input.powerId==='exile-rune-de-garde'&&input.inscriptionConfirmed!==true)return await fail(400,'targeted_context_required');
   if(source.hp<=0||source.state.unconscious||source.state.muePending||shared.active&&(!participates(shared,source.id)||source.initiative===null||source.pa<rule.cost))return await fail(400,'targeted_source_unavailable');
   if(beneficiary.hp<=beneficiary.death)return await fail(400,'targeted_beneficiary_dead');
   const targetState=beneficiary.kind==='character'?beneficiary.state:beneficiary.data;
   if(input.powerId!=='exile-suture'&&(targetState.powerUses?.[targetUsageKey(input.powerId)]??0)>0)return await fail(400,'targeted_beneficiary_used');
   if(input.powerId==='exile-refection-vitale'&&beneficiary.hp>=(beneficiary.kind==='character'?playProfile(beneficiary.data,targetState).healingMaximum:beneficiary.pv_max))return await fail(400,'targeted_no_healable_wound');
   if(input.powerId==='exile-rune-de-garde'){
    if(shared.active)return await fail(400,'targeted_inscription_outside_combat');
    const active=await db.query(`SELECT c.id FROM characters c JOIN character_play_states s ON s.character_id=c.id WHERE c.campaign_id=$1 AND c.archived_at IS NULL AND s.state->'targeted'->'guard'->>'sourceId'=$2 UNION ALL SELECT id FROM campaign_live_combatants WHERE campaign_id=$1 AND NOT removed AND data->'targeted'->'guard'->>'sourceId'=$2`,[req.params.id,source.id]);
    if(active.rowCount)return await fail(400,'targeted_rune_already_active');
   }
   // A player cannot mutate another owner's fiche: the owner accepts, or the MJ applies it.
   if(b.action==='request'&&!access.manager&&beneficiary.owner_id!==user.id){
    const payload={sourceId:source.id,targetId:beneficiary.id,sourceVersion:source.version,targetVersion:beneficiary.version,powerId:rule.id,powerName:rule.name,contextConfirmed:true,inscriptionConfirmed:input.inscriptionConfirmed===true,edge:input.edge===true};
    await db.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'targeted-offer',$4::jsonb,$5::jsonb,false)",[b.requestId,req.params.id,user.id,JSON.stringify(payload),JSON.stringify(b)]);await db.query('COMMIT');return {ok:true,pendingAcceptance:true};
   }
   if(shared.active)source.pa-=rule.cost;
   const before=beneficiary.hp;let result:any={};
   if(rule.id==='exile-suture'){
    if(beneficiary.hp<=0)targetState.stabilized=true;
    const effects=beneficiary.kind==='character'?'effects':'liveEffects';targetState[effects]=(targetState[effects]??[]).filter((e:any)=>e.ruleId!=='maitre_des_lames');result={stabilized:targetState.stabilized===true};
   }else if(rule.id==='exile-refection-vitale'){
    if(input.edge){const error=await spendEdge(db,source.id,source.data,b.requestId,'force');if(error)return await fail(400,error);}
    const profile=playProfile(source.data,source.state),skill=profile.skills.find(s=>s.id==='maitrise_spirituelle')!,die=input.edge?forcedDie():rollD10(profile.stress,()=>randomInt(1,11)),test=healingTest(skill.total+die.sum,die.narrativeFailure);
    result={...die,total:skill.total+die.sum,modifier:skill.total,components:{attribute:skill.attributeValue,rank:skill.rank,bonus:skill.bonus,skillName:skill.name},...test};
    consumeRegisteredTest(source.data,source.state,skill.id);consumeNatureTest(source.data,source.state,skill.id);
    if(test.success){const maximum=beneficiary.kind==='character'?playProfile(beneficiary.data,targetState).healingMaximum:beneficiary.pv_max,extra=beneficiary.kind==='character'?reserveHealing(beneficiary.data,targetState,before,maximum,test.healing):0;beneficiary.hp=Math.min(maximum,before+test.healing+extra);targetState.powerUses??={};targetState.powerUses[targetUsageKey(rule.id)]=1;result.reserveBonus=extra;result.recovered=beneficiary.hp-before;}
   }else{
    targetState.targeted={...targetState.targeted,guard:{sourceId:source.id}};targetState.powerUses??={};targetState.powerUses[targetUsageKey(rule.id)]=1;result={reduction:6};
   }
   if(source===beneficiary)source.hp=beneficiary.hp;
   await saveTarget(db,source);if(source!==beneficiary)await saveTarget(db,beneficiary);
   if(shared.active&&rule.cost>0)await recordAction(db,req.params.id,source.id,rule.cost);
   const payload={label:rule.name,characterName:source.name,sourceId:source.id,targetId:beneficiary.id,targetName:beneficiary.name,offerId:offer?.id??null,powerId:rule.id,paCost:shared.active?rule.cost:0,before,after:beneficiary.hp,...result};
   await db.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'targeted-resolve',$4::jsonb,$5::jsonb,false)",[b.requestId,req.params.id,user.id,JSON.stringify(payload),JSON.stringify(b)]);
   if(shared.active&&rule.cost>0)await maybeAdvanceCombat(db,req.params.id,user.id);
   await db.query('COMMIT');return {ok:true,result:payload};
  }catch(e){await db.query('ROLLBACK').catch(()=>{});throw e;}finally{db.release();}
 });
}
