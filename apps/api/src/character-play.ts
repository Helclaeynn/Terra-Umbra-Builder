import {vampirePowerRules,prepareVampireBlood,vampireBloodTalent,resetVampirePeriod,applyVampireLastSleep} from './rules/live-vampire.js';
import {resetNaturePeriod,normalizedNatureResources} from './rules/live-nature-resources.js';
import {finishEffectsScene,rebaseLiveEffects} from './rules/live-effects.js';
import {finishAdrenaline} from './rules/live-reality.js';
import {consumeNatureTest} from './rules/live-nature-resources.js';
import {liveRealityProfile} from './rules/live-reality.js';
import {getRealityRules} from './rules/reality.js';
import {registerCampaignMechanicsRoutes} from './campaign-mechanics.js';
import {isExtendedPlayAction,extendedPlayActions} from './rules/extended-actions.js';
import {applyExtendedPlayAction,liveHealingMaximum} from './character-live-mechanics.js';
import {registeredPowerIds,explicitPower} from './rules/live-power-registry.js';
import {consumeRegisteredTest} from './rules/registered-power-state.js';
import {hourlyRecovery,naniteStatus,cycleId,consumeUsage,reserveHealing,dedicatedPowerIds,resetLivePeriod} from './rules/live-mechanics.js';
import {currentLiveSession,registerLiveSessionRoutes} from './campaign-live-sessions.js';
import {edgeBalance,spendEdge,forcedDie,forcePastRoll,lethalEvent} from './character-edge.js';
import {lockCombat,combatState,participates,participantInfo,combatQueue,advanceCharacterRound,recordAction,maybeAdvanceCombat} from './campaign-rounds.js';
import {truthPowers,powerAllowed,formAvailable,usableKhinaeTalent,liveBody} from './rules/play-truth.js';
import {registerCampaignCombatRoutes} from './campaign-combat.js';
import {liveSnapshot,registerCampaignLiveRoutes} from './campaign-live.js';
import { isDeepStrictEqual } from 'node:util';
import { randomInt } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';
import { pool } from './db.js';
import { requireUser } from './auth.js';
import { blankPlayState, validatePlayState, playProfile, rollD10, type PlayState } from './rules/play-state.js';
import { terraUmbraCreationRules as rules } from './rules/terra-umbra-creation.js';
import { appearanceGallery,playPortrait } from './character-appearances.js';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const gm=(role:string)=>['gm','editor','admin'].includes(role);
// Full-sheet read grant; owner controls the sheet, campaign MJ may run dedicated mechanics.
async function characterAccess(db:Pick<PoolClient,'query'>,id:string,user:{id:string;role:string},lock=false){
  if(!uuid.test(id))return null;
  const r=await db.query(`SELECT c.* FROM characters c WHERE c.id=$1 AND c.archived_at IS NULL AND
    (c.owner_id=$2 OR ($3::boolean AND (EXISTS(SELECT 1 FROM character_sheet_readers r WHERE r.character_id=c.id AND r.reader_id=$2)
      OR EXISTS(SELECT 1 FROM campaign_members m JOIN campaigns camp ON camp.id=m.campaign_id WHERE m.character_id=c.id
      AND m.user_id=c.owner_id AND m.status='accepted' AND camp.owner_id=$2 AND camp.archived_at IS NULL)))) ${lock?'FOR UPDATE OF c':''}`,[id,user.id,gm(user.role)]);
  return r.rows[0]??null;
}
export async function registerCharacterPlayRoutes(app:FastifyInstance){
  await registerCampaignLiveRoutes(app);
  await registerLiveSessionRoutes(app);
  await registerCampaignCombatRoutes(app);
  await registerCampaignMechanicsRoutes(app);
  app.get<{Params:{id:string}}>('/api/characters/:id/play',async(req,reply)=>{
    reply.header('Cache-Control','private, no-store');
    const user=await requireUser(req,reply);if(!user)return;
    const c=await characterAccess(pool,req.params.id,user);if(!c)return reply.code(404).send({error:'character_not_found'});
    const r=await pool.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[c.id]);
    const state:PlayState={...blankPlayState(),...r.rows[0]?.state};
    const events=await pool.query('SELECT id,kind,payload,created_at AS "createdAt" FROM character_play_events WHERE character_id=$1 ORDER BY created_at DESC LIMIT 30',[c.id]);
    const shared=await combatState(pool,c.campaign_id),profile=playProfile(c.data,state);
    const canManageMechanics=!!c.campaign_id&&gm(user.role)&&!!(await pool.query('SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL',[c.campaign_id,user.id])).rowCount;
    return {canManageMechanics,edge:await edgeBalance(pool,c.id,c.data),escapeEvent:profile.hp<=profile.derived.death?await lethalEvent(pool,c.id,profile.derived.death):null,combat:{active:shared.active,participating:participates(shared,c.id),mode:shared.mode,round:shared.round,version:shared.version},campaignId:c.campaign_id,state,version:r.rows[0]?.version??0,profile:{...profile,reality:liveRealityProfile(c.data,state,getRealityRules())},canEdit:c.owner_id===user.id,events:events.rows};
  });
  app.post<{Params:{id:string};Body:any}>('/api/characters/:id/play',async(req,reply)=>{
    reply.header('Cache-Control','private, no-store');
    const user=await requireUser(req,reply);if(!user)return;
    const b:any=req.body;
    if(!b||!uuid.test(b.requestId??'')||!Number.isInteger(b.version)||b.version<0||![...extendedPlayActions,'recover-hours','nanite-cycle','scenario','edge-force','edge-escape','save','damage','heal','rest','roll','initiative','round','stabilize','form','power','scene','end-combat','regenerate'].includes(b.action))return reply.code(400).send({error:'invalid_play_action'});
    const db=await pool.connect();
    try{
      await db.query('BEGIN');
      const fail=async(status:number,error:string)=>{await db.query('ROLLBACK');return reply.code(status).send({error});};
      const initial=await characterAccess(db,req.params.id,user);if(!initial)return await fail(404,'character_not_found');
      const manages=!!initial.campaign_id&&gm(user.role)&&!!(await db.query('SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL',[initial.campaign_id,user.id])).rowCount;
      if(initial.owner_id!==user.id&&(!manages||!isExtendedPlayAction(b.action)))return await fail(404,'character_not_found');
      await lockCombat(db,initial.campaign_id);
      const c=await characterAccess(db,req.params.id,user,true);if(!c)return await fail(404,'character_not_found');
      if(c.campaign_id!==initial.campaign_id)return await fail(409,'play_version_conflict');
      const previous=await db.query('SELECT character_id,created_by,request_payload FROM character_play_events WHERE id=$1',[b.requestId]);
      if(previous.rows.length){if(previous.rows[0].character_id!==c.id||previous.rows[0].created_by!==user.id||!isDeepStrictEqual(previous.rows[0].request_payload,b))return await fail(409,'play_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
      const r=await db.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[c.id]);
      let state:PlayState=structuredClone({...blankPlayState(),...r.rows[0]?.state});
      const version=r.rows[0]?.version??0;
      if(version!==b.version)return await fail(409,'play_version_conflict');
      const shared=await combatState(db,c.campaign_id);
      if(c.campaign_id&&['round','end-combat','scene','scenario'].includes(b.action))return await fail(403,'campaign_combat_mj_only');
      if(c.campaign_id&&b.action==='initiative'){
        if(!shared.active)return await fail(400,'combat_not_started');
        if(!participates(shared,c.id))return await fail(400,'participant_out');
        if(state.initiative!==null)return await fail(400,'initiative_already_rolled');
      }
      if(state.vampire?.stasis&&!['save','scene','scenario','end-combat','round','damage','heal','edge-escape'].includes(b.action)&&!b.action.startsWith('vampire-'))return await fail(400,'stasis_required_to_end');
      const paBefore=state.pa;
      let profile=playProfile(c.data,state);
      let payload:Record<string,unknown>={};
      if(isExtendedPlayAction(b.action)){
        try{const result=applyExtendedPlayAction(c.data,state,b,{fighting:shared.active||!c.campaign_id&&state.initiative!==null,participating:participates(shared,c.id),manager:manages,actorId:c.id});state=result.state;payload=result.payload;}catch(e){return await fail(400,(e as Error).message);}
      }else if(b.action==='edge-force'){
        if(!uuid.test(b.eventId??''))return await fail(400,'edge_roll_unavailable');
        const result=await forcePastRoll(db,c,state,b.eventId);if(result.error)return await fail(400,result.error);payload=result.payload!;
      }else if(b.action==='edge-escape'){
        const reference=await lethalEvent(db,c.id,profile.derived.death);
        if(profile.hp>profile.derived.death||!reference||reference!==b.eventId)return await fail(400,'edge_consequence_unavailable');
        const error=await spendEdge(db,c.id,c.data,reference,'escape');if(error)return await fail(400,error);
        state.hp=profile.derived.death+1;state.stabilized=false;
        payload={label:'Échapper au Destin · survit à la conséquence mortelle',referenceId:reference,before:profile.hp,after:state.hp};
      }else if(b.action==='save'){
        if(!validatePlayState(b.state))return await fail(400,'invalid_play_state');
        state={...b.state,effects:state.effects,effectArmor:state.effectArmor,activation:state.activation,activationOpen:state.activationOpen,physicalPaSpent:state.physicalPaSpent,registeredPowers:state.registeredPowers,vampire:state.vampire,natureResources:state.natureResources,realityLive:state.realityLive,neuroLoaded:state.neuroLoaded,neuroBurned:state.neuroBurned,magazines:state.magazines,ammoCount:state.ammoCount,adrenaline:state.adrenaline,augmentTemporaryStress:state.augmentTemporaryStress,unconscious:b.state.unconscious??state.unconscious??false,swarmFunctional:b.state.swarmFunctional??state.swarmFunctional??true,...(c.campaign_id?{round:state.round}:{}),initiative:state.initiative,paPerRound:state.paPerRound,form:state.form,inWater:b.state.inWater===true,muePending:state.muePending,mueCount:state.mueCount,mueBlocked:state.mueBlocked,formPaRound:state.formPaRound,powers:state.powers,powerUses:state.powerUses};
        if(state.vampire?.stasis)state.unconscious=true;
        if(state.revelation!=='r'){state.form='human';state.muePending=null;}
        state.powers=(state.powers??[]).filter(p=>{const rule=truthPowers(c.data).find(r=>r.id===p.id);return rule&&powerAllowed(rule,state.revelation);});
        // HP changes use explicit logged actions; settings cannot silently heal.
        state.hp=r.rows[0]?.state.hp??null;
        state.stabilized=r.rows[0]?.state.stabilized??false;
        const previousProfile=profile;
        profile=playProfile(c.data,state);
        if(state.hp!==null&&previousProfile.hp>0)state.hp=Math.max(profile.derived.death,previousProfile.hp+profile.derived.pvMax-previousProfile.derived.pvMax);
        payload={label:'État en jeu mis à jour'};
      }else if(b.action==='form'){
        if(state.unconscious||!['human','animal','hybrid'].includes(b.form)||!formAvailable(c.data,b.form)||state.muePending!==null&&state.muePending!==undefined||profile.hp<=0)return await fail(400,'form_unavailable');
        if(b.form===(state.form??'human')&&state.revelation==='r')return await fail(400,'form_already_active');
        const before=profile;
        if(b.form==='hybrid'){
          if(state.mueBlocked)return await fail(400,'mue_blocked');
          state.mueCount=(state.mueCount??0)+1;
          // Exhaustion is resolved explicitly from the table; the result is logged.
          if(state.mueCount>1&&!['success','force','narrative-failure'].includes(b.exhaustion))return await fail(400,'mue_exhaustion_required');
          if(b.exhaustion==='narrative-failure'){state.mueBlocked=true;state.pa=0;payload={label:'Mue : échec narratif, bloquée pour la scène',mueCount:state.mueCount};}
          else{
            if(state.mueCount>1&&b.exhaustion==='force')state.hp=Math.max(before.derived.death,before.hp-3);
            if((state.hp??before.hp)<=0)return await fail(400,'form_unavailable');
            state.muePending=state.round+1;state.pa=0;
            payload={label:'Mue hybride commencée · un round complet',mueCount:state.mueCount,exhaustion:b.exhaustion??'Première Mue automatique',completionRound:state.muePending};
          }
        }else{
          if(b.form==='animal'&&state.initiative!==null&&state.pa<1)return await fail(400,'insufficient_pa');
          if(b.form==='animal'&&state.initiative!==null)state.pa--;
          state.form=b.form;state.revelation='r';state.formPaRound=state.round+1;
          const after=playProfile(c.data,state);state.hp=before.hp+after.derived.pvMax-before.derived.pvMax;
          payload={label:b.form==='animal'?'Transformation animale':'Retour à la forme humaine révélée'};
        }
      }else if(b.action==='power'){
        if(b.enabled!==false&&(dedicatedPowerIds.has(b.powerId)||explicitPower(b.powerId)?.nature===c.data.truth?.nature))return await fail(400,'use_dedicated_action');
        const rule=truthPowers(c.data).find(p=>p.id===b.powerId);if(!rule)return await fail(400,'power_unavailable');if(b.enabled!==false&&rule.execution!=='assisted')return await fail(400,'use_dedicated_action');
        state.powers??=[];state.powerUses??={};
        if(b.enabled===false){state.powers=state.powers.filter(p=>p.id!==rule.id);payload={label:'Fin de capacité · '+rule.name};}
        else{
          if(state.unconscious||!powerAllowed(rule,state.revelation)||profile.hp<=0||state.powers.some(p=>p.id===rule.id))return await fail(400,'power_unavailable');
          if(!Number.isInteger(b.paCost)||b.paCost<0||b.paCost>20||!Number.isInteger(b.duration)||b.duration<0||b.duration>1000||!Number.isInteger(b.amount)||Math.abs(b.amount)>100||typeof b.note!=='string'||b.note.length>500||typeof b.skill!=='string'||b.skill!==''&&!rules.skills.some(s=>s.id===b.skill))return await fail(400,'invalid_power');
          const cost=rule.cost??b.paCost,key=rule.limit+':'+rule.id;
          if(rule.limit&&(state.powerUses[key]??0)>0)return await fail(400,'power_already_used');
          if(state.initiative!==null&&profile.pa<cost)return await fail(400,'insufficient_pa');
          let bloodPayload:any={};
          if(vampireBloodTalent(rule.id)){const prepared=prepareVampireBlood(c.data,state,{id:rule.id,cost,offering:b.offering===true,test:!!b.skill},{maximum:profile.derived.pvMax,death:profile.derived.death,inCombat:shared.active||state.initiative!==null,participating:participates(shared,c.id)});if('error' in prepared)return await fail(400,prepared.error);state=prepared.state;bloodPayload=prepared.payload;}else if(state.initiative!==null)state.pa-=cost;
          state.powerUses??={};state.powers??=[];state.powerUses[key]=(state.powerUses[key]??0)+1;
          state.powers.push({id:rule.id,until:b.duration?state.round+b.duration-1:null,skill:b.skill,amount:b.amount+(bloodPayload.exaltedBonus??0),note:b.note});
          payload={...bloodPayload,label:'Activation · '+rule.name,paCost:bloodPayload.paCost??cost,duration:b.duration,skill:b.skill,bonus:b.amount,note:b.note};
        }
      }else if(b.action==='scene'||b.action==='scenario'||b.action==='end-combat'){
        if(b.action!=='end-combat'&&state.initiative!==null)return await fail(400,'finish_combat_first');
        if(b.action==='end-combat'){
          const resources=normalizedNatureResources(state.natureResources);resources.mage.preparation=null;resources.mage.maintained=[];resources.mage.blockedUntilRound=null;resources.powerPreparation=null;state.natureResources=resources;if(state.vampire)state.vampire.cycleUntilRound=null;
          finishAdrenaline(state);state.registeredPowers=(state.registeredPowers??[]).filter(p=>['scene','scenario'].includes(p.period));state.powers=[];state.initiative=null;state.pa=0;state.paPerRound=0;
          state.powerUses=Object.fromEntries(Object.entries(state.powerUses??{}).filter(([k])=>!k.startsWith('round:')));
        }else{resetLivePeriod(state,b.action);Object.assign(state,resetVampirePeriod(state));resetNaturePeriod(state,b.action);state.effects=finishEffectsScene(state.effects??[]);state.registeredPowers=(state.registeredPowers??[]).filter(p=>b.action==='scene'&&p.period==='scenario');}
        payload={label:b.action==='scene'?'Nouvelle scène · usages de scène renouvelés':b.action==='scenario'?'Nouveau scénario · usages renouvelés':'Combat terminé'};
      }else if(b.action==='recover-hours'){
        const rate=hourlyRecovery(c.data,state);
        if(shared.active||state.initiative!==null||!rate||state.muePending||profile.hp<=profile.derived.death)return await fail(400,'hourly_recovery_unavailable');
        if(!Number.isInteger(b.hours)||b.hours<1||b.hours>8760||b.regenerable!==true)return await fail(400,'invalid_hourly_recovery');
        state.hp=Math.min(liveHealingMaximum(c.data,state,profile.derived.pvMax),profile.hp+rate*b.hours);
        if(state.hp>0)state.stabilized=false;
        payload={label:'Récupération surnaturelle hors combat',hours:b.hours,rate,recovered:state.hp-profile.hp,before:profile.hp,after:state.hp};
      }else if(b.action==='nanite-cycle'){
        const nanites=naniteStatus(c.data,state);
        if(!nanites.cycle||!nanites.functional||state.unconscious||profile.hp<=0||state.muePending)return await fail(400,'nanite_cycle_unavailable');
        if(nanites.cycleUsed)return await fail(400,'power_already_used');
        if(profile.hp>=profile.derived.pvMax)return await fail(400,'no_wounds');
        const fighting=shared.active||!c.campaign_id&&state.initiative!==null;
        if(fighting&&(state.initiative===null||!participates(shared,c.id)||profile.pa<1))return await fail(400,'insufficient_pa');
        if(fighting)state.pa--;
        consumeUsage(state,'scenario',cycleId);state.hp=Math.min(profile.derived.pvMax,profile.hp+6);
        payload={label:'Cycle de réparation · 1/scénario',recovered:state.hp-profile.hp,before:profile.hp,after:state.hp,paCost:fighting?1:0,powerId:cycleId};
      }else if(b.action==='regenerate'){
        const body=liveBody(c.data,state);if(!body?.regeneration||profile.hp<=profile.derived.death)return await fail(400,'regeneration_unavailable');
        state.powerUses??={};if(state.powerUses['round:regeneration'])return await fail(400,'power_already_used');
        state.powerUses['round:regeneration']=1;state.hp=Math.min(liveHealingMaximum(c.data,state,profile.derived.pvMax),profile.hp+body.regeneration);
        payload={label:'Régénération hybride · blessures régénérables',recovered:state.hp-profile.hp};
      }else if(b.action==='damage'||b.action==='heal'){
        if(!Number.isInteger(b.amount)||b.amount<1||b.amount>10000)return await fail(400,'invalid_play_amount');
        if(profile.hp<=profile.derived.death&&b.action==='heal')return await fail(400,'character_dead');
        const baseHeal=b.action==='heal'?Math.min(b.amount,Math.max(0,liveHealingMaximum(c.data,state,profile.derived.pvMax)-profile.hp)):0;
        const reserve=reserveHealing(c.data,state,profile.hp,profile.derived.pvMax,baseHeal);
        state.hp=Math.max(profile.derived.death,Math.min(liveHealingMaximum(c.data,state,profile.derived.pvMax),profile.hp+(b.action==='heal'?baseHeal+reserve:-b.amount)));
        payload={reserveBonus:reserve};if(b.action==='damage'&&c.data.truth?.nature==='vampire'){const saved=applyVampireLastSleep(c.data,{...state,hp:profile.hp},state.hp,profile.derived.death,b.bodySurvivable!==false);if(!('error'in saved)){state=saved.state;payload.lastSleep=saved.payload;}}
        if(b.action==='damage'||(state.hp??profile.hp)>0)state.stabilized=false;
        payload={...payload,label:b.action==='heal'?'Soin':'Dégâts',before:profile.hp,after:state.hp};
      }else if(b.action==='rest'){
        if(!Number.isInteger(b.days)||b.days<1||b.days>365||typeof b.prolonged!=='boolean')return await fail(400,'invalid_play_rest');
        if(profile.hp<=0)return await fail(400,'rest_requires_positive_hp');
        const recovered=b.days*(b.prolonged?profile.recovery.prolonged:profile.recovery.normal);
        state.hp=Math.min(liveHealingMaximum(c.data,state,profile.derived.pvMax),profile.hp+recovered);
        state.mueCount=0;state.mueBlocked=false;state.powerUses=Object.fromEntries(Object.entries(state.powerUses??{}).filter(([k])=>!k.startsWith('day:')));
        payload={label:'Repos',days:b.days,prolonged:b.prolonged,recovered:state.hp-profile.hp};
      }else if(b.action==='stabilize'){
        if(profile.hp>0||profile.hp<=profile.derived.death)return await fail(400,'cannot_stabilize');
        state.hp=0;state.stabilized=true;payload={label:'Stabilisé après un soin réussi'};
      }else if(b.action==='round'){
        if(state.initiative===null&&!state.muePending)return await fail(400,'combat_not_started');
        const ticks=advanceCharacterRound(c.data,state);payload={...ticks,label:'Nouveau round — PA restaurés',round:state.round,initiative:state.initiative,pa:state.pa};
      }else{
        if(state.unconscious)return await fail(400,'actor_unavailable');
        const skill=profile.skills.find(s=>s.id===b.skill);
        if(b.action==='roll'&&!skill)return await fail(400,'unknown_skill');
        if(profile.hp<=profile.derived.death)return await fail(400,'character_dead');
        if(b.edge!==undefined&&typeof b.edge!=='boolean')return await fail(400,'invalid_edge');
        if(b.edge){const error=await spendEdge(db,c.id,c.data,b.requestId,'force');if(error)return await fail(400,error);}
        const die=b.edge?forcedDie():rollD10(profile.stress,()=>randomInt(1,11));
        const modifier=b.action==='initiative'?profile.derived.initiative:skill!.total;
        payload={label:b.action==='initiative'?'Initiative du combat':skill!.name,modifier,...die,total:modifier+die.sum,stress:profile.stress,revelation:state.revelation,
          components:b.action==='initiative'?null:{attribute:skill!.attributeValue,attributeName:rules.attributes.find(a=>a.id===skill!.attribute)?.name,rank:skill!.rank,skillName:skill!.name,bonus:skill!.bonus},
          bonuses:b.action==='initiative'?[]:[...skill!.automatic.filter(x=>x.enabled),...skill!.contexts.filter(x=>x.enabled),...skill!.prepared.filter(x=>x.active),...skill!.extras]};
        if(b.action==='roll'){consumeRegisteredTest(c.data,state,skill!.id);consumeNatureTest(c.data,state,skill!.id);}
        if(b.action==='initiative'){
          const total=modifier+die.sum;state.effects=rebaseLiveEffects(state.effects??[],{round:state.round,targetActivation:state.activation??0},{round:1,targetActivation:state.activation??0});
          state.initiative=total;if(!c.campaign_id){const resources=normalizedNatureResources(state.natureResources);resources.mage.usedRound=null;resources.mage.blockedUntilRound=null;state.natureResources=resources;}state.round=c.campaign_id?shared.round:1;
          state.paPerRound=die.dice[0]===1?1:total>=16?3:total>=11?2:1;
          state.pa=state.paPerRound+(liveBody(c.data,state)?.pace??0);state.formPaRound=0;
          if(profile.hp<=0)state.pa=Math.min(state.pa,1);
          payload.pa=state.pa;
        }
      }
      profile=playProfile(c.data,state);
      state.pa=profile.pa;
      if(state.hp!==null)state.hp=Math.max(profile.derived.death,Math.min(liveHealingMaximum(c.data,state,profile.derived.pvMax),state.hp));
      await db.query(`INSERT INTO character_play_states(character_id,version,state) VALUES($1,$2,$3::jsonb)
        ON CONFLICT(character_id) DO UPDATE SET state=EXCLUDED.state,version=EXCLUDED.version,updated_at=now()`,[c.id,version+1,JSON.stringify(state)]);
      await db.query('INSERT INTO character_play_events(id,character_id,campaign_id,created_by,kind,payload,request_payload) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb)',[b.requestId,c.id,c.campaign_id,user.id,b.action,JSON.stringify(payload),JSON.stringify(b)]);
      if(isExtendedPlayAction(b.action)||['save','form','power','nanite-cycle'].includes(b.action))await recordAction(db,c.campaign_id,c.id,Math.max(0,paBefore-state.pa));
      await maybeAdvanceCombat(db,c.campaign_id,user.id);
      const updated=await db.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[c.id]);
      state=updated.rows[0].state;profile=playProfile(c.data,state);
      await db.query('COMMIT');
      return {ok:true,state,version:updated.rows[0].version,profile:{...profile,reality:liveRealityProfile(c.data,state,getRealityRules())},event:{id:b.requestId,kind:b.action,payload,createdAt:new Date().toISOString()}};
    }catch(error){await db.query('ROLLBACK').catch(()=>{});throw error;}finally{db.release();}
  });
  app.get<{Params:{id:string};Querystring:{session?:string;before?:string}}>('/api/campaigns/:id/play',async(req,reply)=>{
    reply.header('Cache-Control','private, no-store');
    const user=await requireUser(req,reply);if(!user)return;
    if(!uuid.test(req.params.id))return reply.code(404).send({error:'campaign_not_found'});
    const access=await pool.query(`SELECT c.owner_id,c.name FROM campaigns c WHERE c.id=$1 AND c.archived_at IS NULL AND
      ((c.owner_id=$2 AND $3::boolean) OR EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2 AND m.status='accepted'))`,[req.params.id,user.id,gm(user.role)]);
    if(!access.rowCount)return reply.code(404).send({error:'campaign_not_found'});
    const session=await currentLiveSession(pool,req.params.id);
    const cursor=req.query.before?.split('|');
    if(cursor&&(cursor.length!==2||!Number.isFinite(Date.parse(cursor[0]))||!uuid.test(cursor[1])))return reply.code(400).send({error:'invalid_live_cursor'});
    const selectedSession=req.query.session??session?.id??null;
    if(selectedSession&&(!uuid.test(selectedSession)||!(await pool.query('SELECT id FROM campaign_sessions WHERE id=$1 AND campaign_id=$2',[selectedSession,req.params.id])).rowCount))return reply.code(404).send({error:'session_not_found'});
    const manager=access.rows[0].owner_id===user.id&&gm(user.role);
    const rows=await pool.query(`SELECT c.id,c.name,c.owner_id,c.data,c.version,s.state FROM campaign_members m JOIN characters c ON c.id=m.character_id AND c.owner_id=m.user_id AND c.campaign_id=m.campaign_id
      LEFT JOIN character_play_states s ON s.character_id=c.id WHERE m.campaign_id=$1 AND m.status='accepted' AND c.archived_at IS NULL`,[req.params.id]);
    const shared=await combatState(pool,req.params.id);
    const orderActors:any[]=[];
    const characters=rows.rows.flatMap(c=>{
      const state:PlayState={...blankPlayState(),...c.state};
      if(!manager&&c.owner_id!==user.id&&!state.share)return [];
      const profile=playProfile(c.data,state),identity=c.data.identity??{};
      orderActors.push({id:c.id,pa:profile.pa,initiative:state.initiative});
      const portrait=playPortrait(c.data,state);
      const publicFields={...participantInfo(shared,{id:c.id,kind:'character'}),initiativePending:shared.active&&profile.hp>profile.derived.death&&state.initiative===null,kind:'character',id:c.id,name:c.name,portrait,occupation:String(identity.occupation??''),sphere:rules.spheres[c.data.creation?.sphere as keyof typeof rules.spheres]?.name??'',health:profile.health};
      return [{...publicFields,...(manager||c.owner_id===user.id?{sheetVersion:c.version,hp:profile.hp,pvMax:profile.healthMaximum,pa:profile.pa,paPerRound:state.paPerRound,initiative:state.initiative,round:state.round,stress:profile.stress,revelation:state.revelation,canReadSheet:true}:{})}];
    });
    const events=await pool.query(`SELECT e.id,e.kind,e.payload,e.created_by,e.character_id AS "characterId",c.owner_id AS "ownerId",e.created_at::text AS "createdAt",c.name AS "characterName",u.display_name AS "playerName" FROM character_play_events e JOIN users u ON u.id=e.created_by
      JOIN characters c ON c.id=e.character_id JOIN campaign_members m ON m.character_id=c.id AND m.campaign_id=e.campaign_id AND m.user_id=c.owner_id
      WHERE e.campaign_id=$1 AND e.live_session_id IS NOT DISTINCT FROM $4::uuid AND ($5::timestamptz IS NULL OR (e.created_at,e.id)<($5::timestamptz,$6::uuid)) AND c.campaign_id=$1 AND m.status='accepted' AND c.archived_at IS NULL AND ($2::boolean OR c.owner_id=$3 OR e.kind IN ('roll','initiative','edge-force','edge-escape'))
      ORDER BY e.created_at DESC,e.id DESC LIMIT 101`,[req.params.id,manager,user.id,selectedSession,cursor?.[0]??null,cursor?.[1]??null]);
    const live=await liveSnapshot(req.params.id,manager,selectedSession,cursor?{at:cursor[0],id:cursor[1]}:null);
    live.combatants=live.combatants.map(c=>({...c,...participantInfo(shared,c),initiativePending:shared.active&&c.health!=='Mort'&&live.order.find(o=>o.id===c.id)?.initiative===null}));
    const queue=combatQueue([...orderActors,...live.order],shared);
    const order=queue.map(c=>c.id);
    const projected=events.rows.map(e=>({id:e.id,kind:e.kind,characterId:e.characterId,createdAt:e.createdAt,characterName:e.characterName,playerName:e.playerName,payload:manager||e.ownerId===user.id?e.payload:{label:e.payload.label,dice:e.payload.dice,modifier:e.payload.modifier,total:e.payload.total,exploded:e.payload.exploded,narrativeFailure:e.payload.narrativeFailure,edgeForced:e.payload.edgeForced}}));
    const combined=[...new Map([...live.messages,...projected].map(e=>[e.id,e])).values()].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()||String(b.createdAt).localeCompare(String(a.createdAt))||b.id.localeCompare(a.id));
    const tail=combined[99],nextBefore=combined.length>100?`${tail.createdAt}|${tail.id}`:null;
    return {nextBefore,session,viewingSession:selectedSession,combat:{active:shared.active,mode:shared.mode,round:shared.round,version:shared.version},passes:queue.map(({id,pass})=>({id,pass})),campaignName:access.rows[0].name,canManage:manager,ownCharacterId:rows.rows.find(c=>c.owner_id===user.id)?.id??null,characters,combatants:live.combatants,order,events:combined.slice(0,100)};
  });
}
