import {liveSnapshot,registerCampaignLiveRoutes} from './campaign-live.js';
import { isDeepStrictEqual } from 'node:util';
import { randomInt } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';
import { pool } from './db.js';
import { requireUser } from './auth.js';
import { blankPlayState, validatePlayState, playProfile, rollD10, type PlayState } from './rules/play-state.js';
import { terraUmbraCreationRules as rules } from './rules/terra-umbra-creation.js';
import { appearanceGallery } from './character-appearances.js';
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
  app.get<{Params:{id:string}}>('/api/characters/:id/play',async(req,reply)=>{
    reply.header('Cache-Control','private, no-store');
    const user=await requireUser(req,reply);if(!user)return;
    const c=await characterAccess(pool,req.params.id,user);if(!c)return reply.code(404).send({error:'character_not_found'});
    const r=await pool.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[c.id]);
    const state:PlayState={...blankPlayState(),...r.rows[0]?.state};
    const events=await pool.query('SELECT id,kind,payload,created_at AS "createdAt" FROM character_play_events WHERE character_id=$1 ORDER BY created_at DESC LIMIT 30',[c.id]);
    return {state,version:r.rows[0]?.version??0,profile:playProfile(c.data,state),canEdit:c.owner_id===user.id,events:events.rows};
  });
  app.post<{Params:{id:string};Body:any}>('/api/characters/:id/play',async(req,reply)=>{
    reply.header('Cache-Control','private, no-store');
    const user=await requireUser(req,reply);if(!user)return;
    const b:any=req.body;
    if(!b||!uuid.test(b.requestId??'')||!Number.isInteger(b.version)||b.version<0||!['save','damage','heal','rest','roll','initiative','round','stabilize'].includes(b.action))return reply.code(400).send({error:'invalid_play_action'});
    const db=await pool.connect();
    try{
      await db.query('BEGIN');
      const fail=async(status:number,error:string)=>{await db.query('ROLLBACK');return reply.code(status).send({error});};
      const c=await characterAccess(db,req.params.id,user,true);if(!c||c.owner_id!==user.id)return await fail(404,'character_not_found');
      const previous=await db.query('SELECT character_id,created_by,request_payload FROM character_play_events WHERE id=$1',[b.requestId]);
      if(previous.rows.length){if(previous.rows[0].character_id!==c.id||previous.rows[0].created_by!==user.id||!isDeepStrictEqual(previous.rows[0].request_payload,b))return await fail(409,'play_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
      const r=await db.query('SELECT state,version FROM character_play_states WHERE character_id=$1',[c.id]);
      let state:PlayState=structuredClone({...blankPlayState(),...r.rows[0]?.state});
      const version=r.rows[0]?.version??0;
      if(version!==b.version)return await fail(409,'play_version_conflict');
      let profile=playProfile(c.data,state);
      let payload:Record<string,unknown>={};
      if(b.action==='save'){
        if(!validatePlayState(b.state))return await fail(400,'invalid_play_state');
        state={...b.state,initiative:state.initiative,paPerRound:state.paPerRound};
        // HP changes use explicit logged actions; settings cannot silently heal.
        state.hp=r.rows[0]?.state.hp??null;
        state.stabilized=r.rows[0]?.state.stabilized??false;
        const previousProfile=profile;
        profile=playProfile(c.data,state);
        if(state.hp!==null&&previousProfile.hp>0)state.hp=Math.max(profile.derived.death,previousProfile.hp+profile.derived.pvMax-previousProfile.derived.pvMax);
        payload={label:'État en jeu mis à jour'};
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
        payload={label:'Repos',days:b.days,prolonged:b.prolonged,recovered:state.hp-profile.hp};
      }else if(b.action==='stabilize'){
        if(profile.hp>0||profile.hp<=profile.derived.death)return await fail(400,'cannot_stabilize');
        state.hp=0;state.stabilized=true;payload={label:'Stabilisé après un soin réussi'};
      }else if(b.action==='round'){
        if(state.initiative===null)return await fail(400,'combat_not_started');
        state.round++;state.pa=state.paPerRound;payload={label:'Nouveau round — PA restaurés',round:state.round,initiative:state.initiative,pa:playProfile(c.data,state).pa};
      }else{
        const skill=profile.skills.find(s=>s.id===b.skill);
        if(b.action==='roll'&&!skill)return await fail(400,'unknown_skill');
        if(profile.hp<=profile.derived.death)return await fail(400,'character_dead');
        const die=rollD10(profile.stress,()=>randomInt(1,11));
        const modifier=b.action==='initiative'?profile.derived.initiative:skill!.total;
        payload={label:b.action==='initiative'?'Nouveau combat · Initiative':skill!.name,modifier,...die,total:modifier+die.sum,stress:profile.stress,revelation:state.revelation,
          components:b.action==='initiative'?null:{attribute:skill!.attributeValue,attributeName:rules.attributes.find(a=>a.id===skill!.attribute)?.name,rank:skill!.rank,skillName:skill!.name,bonus:skill!.bonus},
          bonuses:b.action==='initiative'?[]:[...skill!.automatic.filter(x=>x.enabled),...skill!.contexts.filter(x=>x.enabled),...skill!.prepared.filter(x=>x.active),...skill!.extras]};
        if(b.action==='initiative'){
          const total=modifier+die.sum;
          state.initiative=total;state.round=1;
          state.paPerRound=die.dice[0]===1?1:total>=16?3:total>=11?2:1;
          state.pa=state.paPerRound;
          if(profile.hp<=0)state.pa=Math.min(state.pa,1);
          payload.pa=state.pa;
        }
      }
      profile=playProfile(c.data,state);
      state.pa=profile.pa;
      await db.query(`INSERT INTO character_play_states(character_id,version,state) VALUES($1,$2,$3::jsonb)
        ON CONFLICT(character_id) DO UPDATE SET state=EXCLUDED.state,version=EXCLUDED.version,updated_at=now()`,[c.id,version+1,JSON.stringify(state)]);
      await db.query('INSERT INTO character_play_events(id,character_id,campaign_id,created_by,kind,payload,request_payload) VALUES($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb)',[b.requestId,c.id,c.campaign_id,user.id,b.action,JSON.stringify(payload),JSON.stringify(b)]);
      await db.query('COMMIT');
      return {ok:true,state,version:version+1,profile,event:{id:b.requestId,kind:b.action,payload,createdAt:new Date().toISOString()}};
    }catch(error){await db.query('ROLLBACK').catch(()=>{});throw error;}finally{db.release();}
  });
  app.get<{Params:{id:string}}>('/api/campaigns/:id/play',async(req,reply)=>{
    reply.header('Cache-Control','private, no-store');
    const user=await requireUser(req,reply);if(!user)return;
    if(!uuid.test(req.params.id))return reply.code(404).send({error:'campaign_not_found'});
    const access=await pool.query(`SELECT c.owner_id,c.name FROM campaigns c WHERE c.id=$1 AND c.archived_at IS NULL AND
      ((c.owner_id=$2 AND $3::boolean) OR EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2 AND m.status='accepted'))`,[req.params.id,user.id,gm(user.role)]);
    if(!access.rowCount)return reply.code(404).send({error:'campaign_not_found'});
    const manager=access.rows[0].owner_id===user.id&&gm(user.role);
    const rows=await pool.query(`SELECT c.id,c.name,c.owner_id,c.data,s.state FROM campaign_members m JOIN characters c ON c.id=m.character_id AND c.owner_id=m.user_id AND c.campaign_id=m.campaign_id
      LEFT JOIN character_play_states s ON s.character_id=c.id WHERE m.campaign_id=$1 AND m.status='accepted' AND c.archived_at IS NULL`,[req.params.id]);
    const characters=rows.rows.flatMap(c=>{
      const state:PlayState={...blankPlayState(),...c.state};
      if(!manager&&c.owner_id!==user.id&&!state.share)return [];
      const profile=playProfile(c.data,state),identity=c.data.identity??{};
      const portrait=appearanceGallery(c.data.appearances,'reality',identity).primary?.src??'';
      const publicFields={kind:'character',id:c.id,name:c.name,portrait,occupation:String(identity.occupation??''),sphere:rules.spheres[c.data.creation?.sphere as keyof typeof rules.spheres]?.name??'',health:profile.health};
      return [{...publicFields,...(manager||c.owner_id===user.id?{hp:profile.hp,pvMax:profile.derived.pvMax,pa:profile.pa,paPerRound:state.paPerRound,initiative:state.initiative,round:state.round,stress:profile.stress,revelation:state.revelation,canReadSheet:true}:{})}];
    });
    const events=await pool.query(`SELECT e.id,e.kind,e.payload,e.created_by,e.created_at AS "createdAt",c.name AS "characterName",u.display_name AS "playerName" FROM character_play_events e JOIN users u ON u.id=e.created_by
      JOIN characters c ON c.id=e.character_id JOIN campaign_members m ON m.character_id=c.id AND m.campaign_id=e.campaign_id AND m.user_id=c.owner_id
      WHERE e.campaign_id=$1 AND c.campaign_id=$1 AND m.status='accepted' AND c.archived_at IS NULL AND ($2::boolean OR c.owner_id=$3 OR e.kind IN ('roll','initiative'))
      ORDER BY e.created_at DESC LIMIT 40`,[req.params.id,manager,user.id]);
    const live=await liveSnapshot(req.params.id,manager);
    const order=[...rows.rows.filter(c=>characters.some(p=>p.id===c.id)).map(c=>({id:c.id,initiative:c.state?.initiative??null})),...live.order]
      .sort((a,b)=>(b.initiative??-Infinity)-(a.initiative??-Infinity)||a.id.localeCompare(b.id)).map(c=>c.id);
    const projected=events.rows.map(e=>({id:e.id,kind:e.kind,createdAt:e.createdAt,characterName:e.characterName,playerName:e.playerName,payload:manager||e.created_by===user.id?e.payload:{label:e.payload.label,dice:e.payload.dice,modifier:e.payload.modifier,total:e.payload.total,exploded:e.payload.exploded,narrativeFailure:e.payload.narrativeFailure}}));
    return {campaignName:access.rows[0].name,canManage:manager,ownCharacterId:rows.rows.find(c=>c.owner_id===user.id)?.id??null,characters,combatants:live.combatants,order,events:[...projected,...live.messages].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,100)};
  });
}
