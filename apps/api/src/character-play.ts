import {currentLiveSession,registerLiveSessionRoutes} from './campaign-live-sessions.js';
import {edgeBalance,spendEdge,forcedDie,forcePastRoll,lethalEvent} from './character-edge.js';
import {lockCombat,combatState,combatQueue,advanceCharacterRound,recordAction,maybeAdvanceCombat} from './campaign-rounds.js';
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
// Same full-sheet read grant; campaign MJ may read but only owner writes live state.
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
  app.get<{Params:{id:string}}>('/api/characters/:id/play',async(req,reply)=>{
    reply.header('Cache-Control','private, no-store');
    const user=await requireUser(req,reply);if(!user)return;
    const c=await characterAccess(pool,req.params.id,user);if(!c)return reply.code(404).send({error:'character_not_found'});
    const r=await pool.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[c.id]);
    const state:PlayState={...blankPlayState(),...r.rows[0]?.state};
    const events=await pool.query('SELECT id,kind,payload,created_at AS "createdAt" FROM character_play_events WHERE character_id=$1 ORDER BY created_at DESC LIMIT 30',[c.id]);
    const shared=await combatState(pool,c.campaign_id),profile=playProfile(c.data,state);
    return {edge:await edgeBalance(pool,c.id,c.data),escapeEvent:profile.hp<=profile.derived.death?await lethalEvent(pool,c.id,profile.derived.death):null,combat:{active:shared.active,mode:shared.mode,round:shared.round,version:shared.version},campaignId:c.campaign_id,state,version:r.rows[0]?.version??0,profile,canEdit:c.owner_id===user.id,events:events.rows};
  });
  app.post<{Params:{id:string};Body:any}>('/api/characters/:id/play',async(req,reply)=>{
    reply.header('Cache-Control','private, no-store');
    const user=await requireUser(req,reply);if(!user)return;
    const b:any=req.body;
    if(!b||!uuid.test(b.requestId??'')||!Number.isInteger(b.version)||b.version<0||!['edge-force','edge-escape','save','damage','heal','rest','roll','initiative','round','stabilize','form','power','scene','end-combat','regenerate'].includes(b.action))return reply.code(400).send({error:'invalid_play_action'});
    const db=await pool.connect();
    try{
      await db.query('BEGIN');
      const fail=async(status:number,error:string)=>{await db.query('ROLLBACK');return reply.code(status).send({error});};
      const initial=await characterAccess(db,req.params.id,user);if(!initial||initial.owner_id!==user.id)return await fail(404,'character_not_found');
      await lockCombat(db,initial.campaign_id);
      const c=await characterAccess(db,req.params.id,user,true);if(!c||c.owner_id!==user.id)return await fail(404,'character_not_found');
      if(c.campaign_id!==initial.campaign_id)return await fail(409,'play_version_conflict');
      const previous=await db.query('SELECT character_id,created_by,request_payload FROM character_play_events WHERE id=$1',[b.requestId]);
      if(previous.rows.length){if(previous.rows[0].character_id!==c.id||previous.rows[0].created_by!==user.id||!isDeepStrictEqual(previous.rows[0].request_payload,b))return await fail(409,'play_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
      const r=await db.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[c.id]);
      let state:PlayState=structuredClone({...blankPlayState(),...r.rows[0]?.state});
      const version=r.rows[0]?.version??0;
      if(version!==b.version)return await fail(409,'play_version_conflict');
      const shared=await combatState(db,c.campaign_id);
      if(c.campaign_id&&['initiative','round','end-combat'].includes(b.action))return await fail(403,'campaign_combat_mj_only');
      const paBefore=state.pa;
      let profile=playProfile(c.data,state);
      let payload:Record<string,unknown>={};
      if(b.action==='edge-force'){
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
        state={...b.state,...(c.campaign_id?{round:state.round}:{}),initiative:state.initiative,paPerRound:state.paPerRound,form:state.form,inWater:b.state.inWater===true,muePending:state.muePending,mueCount:state.mueCount,mueBlocked:state.mueBlocked,formPaRound:state.formPaRound,powers:state.powers,powerUses:state.powerUses};
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
        if(!['human','animal','hybrid'].includes(b.form)||!formAvailable(c.data,b.form)||state.muePending!==null&&state.muePending!==undefined||profile.hp<=0)return await fail(400,'form_unavailable');
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
        const rule=truthPowers(c.data).find(p=>p.id===b.powerId);if(!rule)return await fail(400,'power_unavailable');
        state.powers??=[];state.powerUses??={};
        if(b.enabled===false){state.powers=state.powers.filter(p=>p.id!==rule.id);payload={label:'Fin de capacité · '+rule.name};}
        else{
          if(!powerAllowed(rule,state.revelation)||profile.hp<=0||state.powers.some(p=>p.id===rule.id))return await fail(400,'power_unavailable');
          if(!Number.isInteger(b.paCost)||b.paCost<0||b.paCost>20||!Number.isInteger(b.duration)||b.duration<0||b.duration>1000||!Number.isInteger(b.amount)||Math.abs(b.amount)>100||typeof b.note!=='string'||b.note.length>500||typeof b.skill!=='string'||b.skill!==''&&!rules.skills.some(s=>s.id===b.skill))return await fail(400,'invalid_power');
          const cost=rule.cost??b.paCost,key=rule.limit+':'+rule.id;
          if(rule.limit&&(state.powerUses[key]??0)>0)return await fail(400,'power_already_used');
          if(state.initiative!==null&&profile.pa<cost)return await fail(400,'insufficient_pa');
          if(state.initiative!==null)state.pa-=cost;
          state.powerUses[key]=(state.powerUses[key]??0)+1;
          state.powers.push({id:rule.id,until:b.duration?state.round+b.duration-1:null,skill:b.skill,amount:b.amount,note:b.note});
          payload={label:'Activation · '+rule.name,paCost:cost,duration:b.duration,skill:b.skill,bonus:b.amount,note:b.note};
        }
      }else if(b.action==='scene'||b.action==='end-combat'){
        state.powers=[];state.mueBlocked=false;state.powerUses=Object.fromEntries(Object.entries(state.powerUses??{}).filter(([k])=>!k.startsWith('scene:')&&!k.startsWith('round:')));
        if(b.action==='end-combat'){state.initiative=null;state.pa=0;state.paPerRound=0;}
        payload={label:b.action==='scene'?'Nouvelle scène · effets terminés':'Combat terminé'};
      }else if(b.action==='regenerate'){
        const body=liveBody(c.data,state);if(!body?.regeneration||profile.hp<=profile.derived.death)return await fail(400,'regeneration_unavailable');
        state.powerUses??={};if(state.powerUses['round:regeneration'])return await fail(400,'power_already_used');
        state.powerUses['round:regeneration']=1;state.hp=Math.min(profile.derived.pvMax,profile.hp+body.regeneration);
        payload={label:'Régénération hybride · blessures régénérables',recovered:state.hp-profile.hp};
      }else if(b.action==='damage'||b.action==='heal'){
        if(!Number.isInteger(b.amount)||b.amount<1||b.amount>10000)return await fail(400,'invalid_play_amount');
        if(profile.hp<=profile.derived.death&&b.action==='heal')return await fail(400,'character_dead');
        state.hp=Math.max(profile.derived.death,Math.min(profile.derived.pvMax,profile.hp+(b.action==='heal'?b.amount:-b.amount)));
        if(b.action==='damage'||state.hp>0)state.stabilized=false;
        payload={label:b.action==='heal'?'Soin':'Dégâts',before:profile.hp,after:state.hp};
      }else if(b.action==='rest'){
        if(!Number.isInteger(b.days)||b.days<1||b.days>365||typeof b.prolonged!=='boolean')return await fail(400,'invalid_play_rest');
        if(profile.hp<=0)return await fail(400,'rest_requires_positive_hp');
        const recovered=b.days*(b.prolonged?profile.recovery.prolonged:profile.recovery.normal);
        state.hp=Math.min(profile.derived.pvMax,profile.hp+recovered);
        state.mueCount=0;state.mueBlocked=false;state.powerUses=Object.fromEntries(Object.entries(state.powerUses??{}).filter(([k])=>k.startsWith('scenario:')));
        payload={label:'Repos',days:b.days,prolonged:b.prolonged,recovered:state.hp-profile.hp};
      }else if(b.action==='stabilize'){
        if(profile.hp>0||profile.hp<=profile.derived.death)return await fail(400,'cannot_stabilize');
        state.hp=0;state.stabilized=true;payload={label:'Stabilisé après un soin réussi'};
      }else if(b.action==='round'){
        if(state.initiative===null&&!state.muePending)return await fail(400,'combat_not_started');
        advanceCharacterRound(c.data,state);payload={label:'Nouveau round — PA restaurés',round:state.round,initiative:state.initiative,pa:state.pa};
      }else{
        const skill=profile.skills.find(s=>s.id===b.skill);
        if(b.action==='roll'&&!skill)return await fail(400,'unknown_skill');
        if(profile.hp<=profile.derived.death)return await fail(400,'character_dead');
        if(b.edge!==undefined&&typeof b.edge!=='boolean')return await fail(400,'invalid_edge');
        if(b.edge){const error=await spendEdge(db,c.id,c.data,b.requestId,'force');if(error)return await fail(400,error);}
        const die=b.edge?forcedDie():rollD10(profile.stress,()=>randomInt(1,11));
        const modifier=b.action==='initiative'?profile.derived.initiative:skill!.total;
        payload={label:b.action==='initiative'?'Nouveau combat · Initiative':skill!.name,modifier,...die,total:modifier+die.sum,stress:profile.stress,revelation:state.revelation,
          components:b.action==='initiative'?null:{attribute:skill!.attributeValue,attributeName:rules.attributes.find(a=>a.id===skill!.attribute)?.name,rank:skill!.rank,skillName:skill!.name,bonus:skill!.bonus},
          bonuses:b.action==='initiative'?[]:[...skill!.automatic.filter(x=>x.enabled),...skill!.contexts.filter(x=>x.enabled),...skill!.prepared.filter(x=>x.active),...skill!.extras]};
        if(b.action==='initiative'){
          const total=modifier+die.sum;
          state.initiative=total;state.round=1;
          state.paPerRound=die.dice[0]===1?1:total>=16?3:total>=11?2:1;
          state.pa=state.paPerRound+(liveBody(c.data,state)?.pace??0);state.formPaRound=0;
          if(profile.hp<=0)state.pa=Math.min(state.pa,1);
          payload.pa=state.pa;
        }
      }
      profile=playProfile(c.data,state);
      state.pa=profile.pa;
      await db.query(`INSERT INTO character_play_states(character_id,version,state) VALUES($1,$2,$3::jsonb)
        ON CONFLICT(character_id) DO UPDATE SET state=EXCLUDED.state,version=EXCLUDED.version,updated_at=now()`,[c.id,version+1,JSON.stringify(state)]);
      await db.query('INSERT INTO character_play_events(id,character_id,campaign_id,created_by,kind,payload,request_payload) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb)',[b.requestId,c.id,c.campaign_id,user.id,b.action,JSON.stringify(payload),JSON.stringify(b)]);
      if(['save','form','power'].includes(b.action))await recordAction(db,c.campaign_id,c.id,Math.max(0,paBefore-state.pa));
      await maybeAdvanceCombat(db,c.campaign_id,user.id);
      const updated=await db.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[c.id]);
      state=updated.rows[0].state;profile=playProfile(c.data,state);
      await db.query('COMMIT');
      return {ok:true,state,version:updated.rows[0].version,profile,event:{id:b.requestId,kind:b.action,payload,createdAt:new Date().toISOString()}};
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
    const orderActors:any[]=[];
    const characters=rows.rows.flatMap(c=>{
      const state:PlayState={...blankPlayState(),...c.state};
      if(!manager&&c.owner_id!==user.id&&!state.share)return [];
      const profile=playProfile(c.data,state),identity=c.data.identity??{};
      orderActors.push({id:c.id,pa:profile.pa,initiative:state.initiative});
      const portrait=playPortrait(c.data,state);
      const publicFields={kind:'character',id:c.id,name:c.name,portrait,occupation:String(identity.occupation??''),sphere:rules.spheres[c.data.creation?.sphere as keyof typeof rules.spheres]?.name??'',health:profile.health};
      return [{...publicFields,...(manager||c.owner_id===user.id?{sheetVersion:c.version,hp:profile.hp,pvMax:profile.derived.pvMax,pa:profile.pa,paPerRound:state.paPerRound,initiative:state.initiative,round:state.round,stress:profile.stress,revelation:state.revelation,canReadSheet:true}:{})}];
    });
    const events=await pool.query(`SELECT e.id,e.kind,e.payload,e.created_by,e.character_id AS "characterId",e.created_at::text AS "createdAt",c.name AS "characterName",u.display_name AS "playerName" FROM character_play_events e JOIN users u ON u.id=e.created_by
      JOIN characters c ON c.id=e.character_id JOIN campaign_members m ON m.character_id=c.id AND m.campaign_id=e.campaign_id AND m.user_id=c.owner_id
      WHERE e.campaign_id=$1 AND e.live_session_id IS NOT DISTINCT FROM $4::uuid AND ($5::timestamptz IS NULL OR (e.created_at,e.id)<($5::timestamptz,$6::uuid)) AND c.campaign_id=$1 AND m.status='accepted' AND c.archived_at IS NULL AND ($2::boolean OR c.owner_id=$3 OR e.kind IN ('roll','initiative','edge-force','edge-escape'))
      ORDER BY e.created_at DESC,e.id DESC LIMIT 101`,[req.params.id,manager,user.id,selectedSession,cursor?.[0]??null,cursor?.[1]??null]);
    const live=await liveSnapshot(req.params.id,manager,selectedSession,cursor?{at:cursor[0],id:cursor[1]}:null);
    const shared=await combatState(pool,req.params.id);
    const queue=combatQueue([...orderActors,...live.order],shared);
    const order=queue.map(c=>c.id);
    const projected=events.rows.map(e=>({id:e.id,kind:e.kind,characterId:e.characterId,createdAt:e.createdAt,characterName:e.characterName,playerName:e.playerName,payload:manager||e.created_by===user.id?e.payload:{label:e.payload.label,dice:e.payload.dice,modifier:e.payload.modifier,total:e.payload.total,exploded:e.payload.exploded,narrativeFailure:e.payload.narrativeFailure,edgeForced:e.payload.edgeForced}}));
    const combined=[...projected,...live.messages].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()||String(b.createdAt).localeCompare(String(a.createdAt))||b.id.localeCompare(a.id));
    const tail=combined[99],nextBefore=combined.length>100?`${tail.createdAt}|${tail.id}`:null;
    return {nextBefore,session,viewingSession:selectedSession,combat:{active:shared.active,mode:shared.mode,round:shared.round,version:shared.version},passes:queue.map(({id,pass})=>({id,pass})),campaignName:access.rows[0].name,canManage:manager,ownCharacterId:rows.rows.find(c=>c.owner_id===user.id)?.id??null,characters,combatants:live.combatants,order,events:combined.slice(0,100)};
  });
}
