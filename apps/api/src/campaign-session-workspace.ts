import {campaignNpcReferencesAvailable} from './campaign-npcs.js';
import type {FastifyInstance} from 'fastify';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {validScenes,cleanScenes} from './campaign-preparation.js';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const eligible=`u.is_active AND u.role IN ('gm','editor','admin')`;
export async function registerCampaignWorkspaceRoutes(app:FastifyInstance){
 app.patch<{Params:{id:string;sessionId:string};Body:{title?:unknown;preparation?:unknown;scenes?:unknown;version?:unknown}}>('/api/campaigns/:id/sessions/:sessionId/preparation',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  if(!uuid.test(req.params.id)||!uuid.test(req.params.sessionId))return reply.code(404).send({error:'campaign_not_found'});
  const b=req.body;
  if(!b||typeof b.title!=='string'||!b.title.trim()||b.title.length>120||typeof b.preparation!=='string'||b.preparation.length>20000||!validScenes(b.scenes)||!Number.isSafeInteger(b.version)||Number(b.version)<1)return reply.code(400).send({error:'invalid_session'});
  if(!await campaignNpcReferencesAvailable(req.params.id,user.id,b.scenes))return reply.code(400).send({error:'invalid_npc_reference'});
  const r=await pool.query(`UPDATE campaign_sessions s SET title=$4,preparation=$5,scenes=$6::jsonb,version=s.version+1,updated_at=now()
   FROM campaigns c JOIN users u ON u.id=c.owner_id WHERE s.campaign_id=c.id AND c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND ${eligible} AND s.id=$3 AND s.version=$7 RETURNING s.id,s.version`,[req.params.id,user.id,req.params.sessionId,b.title.trim(),b.preparation,JSON.stringify(cleanScenes(b.scenes)),b.version]);
  if(r.rows.length)return {session:r.rows[0]};
  const own=await pool.query(`SELECT s.id FROM campaign_sessions s JOIN campaigns c ON c.id=s.campaign_id JOIN users u ON u.id=c.owner_id WHERE c.id=$1 AND c.owner_id=$2 AND s.id=$3 AND c.archived_at IS NULL AND ${eligible}`,[req.params.id,user.id,req.params.sessionId]);
  return reply.code(own.rows.length?409:404).send({error:own.rows.length?'session_version_conflict':'campaign_not_found'});
 });
 app.get<{Params:{id:string}}>('/api/campaigns/:id/preparation-library',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  if(!uuid.test(req.params.id))return reply.code(404).send({error:'campaign_not_found'});
  const own=await pool.query(`SELECT c.id FROM campaigns c JOIN users u ON u.id=c.owner_id WHERE c.id=$1 AND c.owner_id=$2 AND ${eligible}`,[req.params.id,user.id]);
  if(!own.rows.length)return reply.code(404).send({error:'campaign_not_found'});
  const references=await pool.query(`SELECT DISTINCT ON (r->>'articleId') r->>'articleId' AS id,r->>'title' AS title,r->>'category' AS category,r->>'npcId' AS "npcId",r->>'creatureId' AS "creatureId",'' AS snippet FROM campaign_sessions s CROSS JOIN LATERAL jsonb_array_elements(s.scenes) scene CROSS JOIN LATERAL jsonb_array_elements(scene->'references') r WHERE s.campaign_id=$1 ORDER BY r->>'articleId',s.created_at DESC LIMIT 1000`,[req.params.id]);
  const previous=await pool.query(`SELECT id,title,scenes FROM campaign_sessions WHERE campaign_id=$1 AND EXISTS(SELECT 1 FROM jsonb_array_elements(scenes) scene WHERE scene->>'done'='false') ORDER BY created_at DESC,id LIMIT 30`,[req.params.id]);
  return {references:references.rows,previous:previous.rows};
 });
 app.put<{Params:{id:string;sessionId:string;userId:string};Body:{response?:unknown}}>('/api/campaigns/:id/sessions/:sessionId/attendance/:userId',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  if(![req.params.id,req.params.sessionId,req.params.userId].every(v=>uuid.test(v)))return reply.code(404).send({error:'campaign_not_found'});
  if(!['present','uncertain','absent'].includes(String(req.body?.response)))return reply.code(400).send({error:'invalid_attendance'});
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   const access=await client.query(`SELECT s.status,c.owner_id FROM campaign_sessions s JOIN campaigns c ON c.id=s.campaign_id JOIN users u ON u.id=c.owner_id JOIN campaign_members m ON m.campaign_id=c.id AND m.user_id=$3 JOIN users p ON p.id=m.user_id WHERE c.id=$1 AND s.id=$4 AND c.archived_at IS NULL AND ${eligible} AND p.is_active AND m.status='accepted' AND (c.owner_id=$2 OR (m.user_id=$2 AND s.status='planned')) FOR SHARE OF c,s,m,u,p`,[req.params.id,user.id,req.params.userId,req.params.sessionId]);
   if(!access.rows.length){await client.query('ROLLBACK');return reply.code(404).send({error:'campaign_not_found'});}
   await client.query(`INSERT INTO campaign_session_attendance(session_id,campaign_id,user_id,response,updated_by) VALUES($1,$2,$3,$4,$5) ON CONFLICT(session_id,user_id) DO UPDATE SET response=EXCLUDED.response,updated_by=EXCLUDED.updated_by,updated_at=now()`,[req.params.sessionId,req.params.id,req.params.userId,req.body.response,user.id]);
   await client.query('COMMIT');return {ok:true};
  }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 });
}
