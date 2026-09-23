import type {FastifyInstance} from 'fastify';
import {validScenes,cleanScenes} from './campaign-preparation.js';
import {pool} from './db.js';
import {requireUser} from './auth.js';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const gm=(role:string)=>['gm','editor','admin'].includes(role);
const eligible=`u.is_active AND u.role IN ('gm','editor','admin')`;
const missing={error:'campaign_not_found'};
type SessionBody={scenes?:unknown;title?:unknown;playedOn?:unknown;status?:unknown;preparation?:unknown;report?:unknown;published?:unknown;version?:unknown};
function valid(b:SessionBody){
  if(!b||typeof b.title!=='string'||!b.title.trim()||b.title.trim().length>120||!['planned','played'].includes(String(b.status))||typeof b.preparation!=='string'||b.preparation.length>20000||typeof b.report!=='string'||b.report.length>20000||typeof b.published!=='boolean')return false;
  if(b.scenes!==undefined&&!validScenes(b.scenes))return false;
  if(b.playedOn===null)return true;
  if(typeof b.playedOn!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(b.playedOn)||Number(b.playedOn.slice(0,4))<1)return false;
  const d=new Date(b.playedOn+'T00:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===b.playedOn;
}
export async function registerCampaignSessionRoutes(app:FastifyInstance){
  app.get<{Params:{id:string};Querystring:{offset?:string}}>('/api/campaigns/:id/sessions',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!uuid.test(req.params.id))return reply.code(404).send(missing);
    const offset=Number(req.query.offset??0);if(!Number.isSafeInteger(offset)||offset<0||offset>100000)return reply.code(400).send({error:'invalid_session_page'});
    const allowed=await pool.query(`SELECT c.owner_id=$2 AS manage FROM campaigns c JOIN users u ON u.id=c.owner_id WHERE c.id=$1 AND ${eligible}
      AND (c.owner_id=$2 OR (c.archived_at IS NULL AND EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2 AND m.status='accepted')))`,[req.params.id,user.id]);
    if(!allowed.rows.length)return reply.code(404).send(missing);
    const manage=allowed.rows[0].manage;
    const result=await pool.query(`SELECT s.id,s.title,s.played_on::text AS "playedOn",s.status,s.published,s.version,
      ${manage?'s.preparation,s.report,s.scenes':"CASE WHEN s.published THEN s.report ELSE '' END AS report"},
      COALESCE((SELECT jsonb_agg(jsonb_build_object('characterId',r.character_id,'characterName',r.character_name,'xp',r.xp,'ptv',r.ptv,'awardedAt',r.awarded_at) ORDER BY r.awarded_at,r.character_id)
        FROM campaign_session_rewards r JOIN characters ch ON ch.id=r.character_id WHERE r.session_id=s.id AND ($4 OR ch.owner_id=$3)),'[]') AS rewards,
      COALESCE((SELECT jsonb_agg(jsonb_build_object('id',e.id,'characterName',e.character_name,'money',e.money,'corruptionDelta',e.corruption_delta,'corruptionSource',e.corruption_source,'reason',e.reason,'before',e.before_state,'after',e.after_state,'appliedAt',e.applied_at) ORDER BY e.applied_at,e.id)
        FROM campaign_session_effects e JOIN characters ch ON ch.id=e.character_id WHERE e.session_id=s.id AND ($4 OR ch.owner_id=$3)),'[]') AS effects
      FROM campaign_sessions s WHERE s.campaign_id=$1 ORDER BY s.created_at DESC,s.id LIMIT 21 OFFSET $2`,[req.params.id,offset,user.id,manage]);
    return {sessions:result.rows.slice(0,20),hasMore:result.rows.length>20};
  });
  app.post<{Params:{id:string};Body:SessionBody}>('/api/campaigns/:id/sessions',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!gm(user.role)||!uuid.test(req.params.id))return reply.code(404).send(missing);
    if(!valid(req.body))return reply.code(400).send({error:'invalid_session'});
    const b=req.body;
    const r=await pool.query(`INSERT INTO campaign_sessions(campaign_id,title,played_on,status,preparation,report,published,scenes)
      SELECT id,$3,$4::date,$5,$6,$7,$8,$9::jsonb FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL RETURNING id`,[req.params.id,user.id,String(b.title).trim(),b.playedOn,b.status,b.preparation,b.report,b.published,JSON.stringify(validScenes(b.scenes)?cleanScenes(b.scenes):[])]);
    if(!r.rows.length)return reply.code(404).send(missing);
    return reply.code(201).send({session:r.rows[0]});
  });
  app.patch<{Params:{id:string;sessionId:string};Body:SessionBody}>('/api/campaigns/:id/sessions/:sessionId',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!gm(user.role)||!uuid.test(req.params.id)||!uuid.test(req.params.sessionId))return reply.code(404).send(missing);
    if(!valid(req.body)||!Number.isSafeInteger(req.body.version)||Number(req.body.version)<1)return reply.code(400).send({error:'invalid_session'});
    const b=req.body;
    const result=await pool.query(`UPDATE campaign_sessions s SET title=$4,played_on=$5::date,status=$6,preparation=$7,report=$8,published=$9,scenes=COALESCE($11::jsonb,s.scenes),version=s.version+1,updated_at=now()
      FROM campaigns c WHERE s.campaign_id=c.id AND c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND s.id=$3 AND s.version=$10 RETURNING s.id`,[req.params.id,user.id,req.params.sessionId,String(b.title).trim(),b.playedOn,b.status,b.preparation,b.report,b.published,b.version,validScenes(b.scenes)?JSON.stringify(cleanScenes(b.scenes)):null]);
    if(result.rows.length)return {ok:true};
    const owned=await pool.query('SELECT s.id FROM campaign_sessions s JOIN campaigns c ON c.id=s.campaign_id WHERE c.id=$1 AND c.owner_id=$2 AND s.id=$3 AND c.archived_at IS NULL',[req.params.id,user.id,req.params.sessionId]);
    return reply.code(owned.rows.length?409:404).send(owned.rows.length?{error:'session_version_conflict'}:missing);
  });
  app.post<{Params:{id:string;sessionId:string};Body:{characterIds?:unknown;xp?:unknown;ptv?:unknown}}>('/api/campaigns/:id/sessions/:sessionId/rewards',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!gm(user.role)||!uuid.test(req.params.id)||!uuid.test(req.params.sessionId))return reply.code(404).send(missing);
    const b=req.body,ids=b?.characterIds;
    if(!Array.isArray(ids)||!ids.length||ids.length>100||ids.some(id=>typeof id!=='string'||!uuid.test(id))||new Set(ids).size!==ids.length||![b.xp,b.ptv].every(n=>Number.isSafeInteger(n)&&Number(n)>=0&&Number(n)<=100000)||Number(b.xp)+Number(b.ptv)===0)return reply.code(400).send({error:'invalid_rewards'});
    const client=await pool.connect();
    try{
      await client.query('BEGIN');
      const denied=async(code:number,error:string)=>{await client.query('ROLLBACK');return reply.code(code).send({error});};
      const own=await client.query('SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL FOR SHARE',[req.params.id,user.id]);
      if(!own.rows.length)return await denied(404,'campaign_not_found');
      const session=await client.query('SELECT id,title,status FROM campaign_sessions WHERE id=$1 AND campaign_id=$2 FOR UPDATE',[req.params.sessionId,req.params.id]);
      if(!session.rows.length)return await denied(404,'session_not_found');
      if(session.rows[0].status!=='played')return await denied(400,'session_not_played');
      // Lock memberships against withdrawal and characters against concurrent saves.
      const members=await client.query(`SELECT m.user_id,m.character_id FROM campaign_members m WHERE m.campaign_id=$1 AND m.status='accepted' AND m.character_id=ANY($2::uuid[]) ORDER BY m.user_id FOR SHARE`,[req.params.id,ids]);
      if(members.rows.length!==ids.length)return await denied(409,'reward_recipient_unavailable');
      const chars=await client.query('SELECT id,owner_id,name,data,version FROM characters WHERE id=ANY($1::uuid[]) AND archived_at IS NULL ORDER BY id FOR UPDATE',[ids]);
      if(chars.rows.length!==ids.length||chars.rows.some(c=>!members.rows.some(m=>m.character_id===c.id&&m.user_id===c.owner_id)))return await denied(409,'reward_recipient_unavailable');
      const previous=await client.query('SELECT character_id FROM campaign_session_rewards WHERE session_id=$1 AND character_id=ANY($2::uuid[])',[req.params.sessionId,ids]);
      if(previous.rows.length)return await denied(409,'rewards_already_applied');
      for(const c of chars.rows){
        const data=c.data;
        if(!data||typeof data!=='object'||Array.isArray(data))return await denied(409,'invalid_character_progression');
        const progression=data.progression??{};
        if(typeof progression!=='object'||Array.isArray(progression))return await denied(409,'invalid_character_progression');
        const xp=Number(progression.xpEarned??0),ptv=Number(progression.ptvEarned??0);
        if(![xp,ptv,xp+Number(b.xp),ptv+Number(b.ptv)].every(n=>Number.isSafeInteger(n)&&n>=0))return await denied(409,'invalid_character_progression');
        data.progression={...progression,xpEarned:xp+Number(b.xp),ptvEarned:ptv+Number(b.ptv)};
        await client.query(`INSERT INTO campaign_session_rewards(session_id,character_id,character_name,xp,ptv,awarded_by) VALUES($1,$2,$3,$4,$5,$6)`,[req.params.sessionId,c.id,c.name,b.xp,b.ptv,user.id]);
        await client.query('UPDATE characters SET data=$2::jsonb,version=version+1,updated_at=now() WHERE id=$1',[c.id,JSON.stringify(data)]);
        await client.query(`INSERT INTO character_revisions(character_id,revision,name,data,reason,created_by) VALUES($1,$2,$3,$4::jsonb,$5,$6)`,[c.id,c.version+1,c.name,JSON.stringify(data),'campaign-reward:'+session.rows[0].title,user.id]);
      }
      await client.query('COMMIT');return {ok:true,awarded:chars.rows.length};
    }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  });
}
