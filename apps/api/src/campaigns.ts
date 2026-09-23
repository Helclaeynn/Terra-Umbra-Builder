import {registerCampaignAdmissionRoutes} from './campaign-admissions.js';
import {registerCampaignEffectRoutes} from './campaign-effects.js';
import {registerCampaignSessionRoutes} from "./campaign-sessions.js";
import type { FastifyInstance } from 'fastify';
import { pool } from './db.js';
import { requireUser } from './auth.js';

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const gm=(role:string)=>['gm','editor','admin'].includes(role);
const missing={error:'campaign_not_found'};
const fields=`c.id,c.name,c.description,c.admission_rules AS "admissionRules",c.version,c.archived_at::text AS "archivedAt",c.owner_id AS "ownerId",u.display_name AS "gmName",c.updated_at::text AS "updatedAt"`;
const validText=(v:unknown,max:number,min=0)=>typeof v==='string'&&v.trim().length>=min&&v.trim().length<=max;
// Every campaign query rechecks the owner's current eligibility, including after demotion.
const eligible=`u.is_active AND u.role IN ('gm','editor','admin')`;
export async function registerCampaignRoutes(app:FastifyInstance){
  await registerCampaignAdmissionRoutes(app);
  await registerCampaignSessionRoutes(app);
  await registerCampaignEffectRoutes(app);
  app.get('/api/campaigns',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    const result=await pool.query(`SELECT ${fields},c.owner_id=$1 AS "canManage",m.status AS "membershipStatus",
      (SELECT count(*)::int FROM campaign_members x WHERE x.campaign_id=c.id AND x.status='accepted') AS "memberCount"
      FROM campaigns c JOIN users u ON u.id=c.owner_id LEFT JOIN campaign_members m ON m.campaign_id=c.id AND m.user_id=$1
      WHERE ${eligible} AND (c.owner_id=$1 OR (m.user_id=$1 AND c.archived_at IS NULL)) ORDER BY c.archived_at NULLS FIRST,c.updated_at DESC,c.id`,[user.id]);
    return {campaigns:result.rows,canCreate:gm(user.role),userId:user.id};
  });
  app.post<{Body:{name?:unknown;description?:unknown}}>('/api/campaigns',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!gm(user.role))return reply.code(403).send({error:'gm_required'});
    if(!validText(req.body?.name,120,1)||!validText(req.body?.description??'',2000))return reply.code(400).send({error:'invalid_campaign'});
    const result=await pool.query(`INSERT INTO campaigns(owner_id,name,description) VALUES($1,$2,$3) RETURNING id`,[user.id,String(req.body.name).trim(),String(req.body.description??'').trim()]);
    return reply.code(201).send({campaign:result.rows[0]});
  });
  app.get<{Params:{id:string}}>('/api/campaigns/:id',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!uuid.test(req.params.id))return reply.code(404).send(missing);
    const result=await pool.query(`SELECT ${fields},c.owner_id=$2 AS "canManage",m.status AS "membershipStatus",
      CASE WHEN c.owner_id=$2 THEN c.gm_notes ELSE NULL END AS "gmNotes"
      FROM campaigns c JOIN users u ON u.id=c.owner_id LEFT JOIN campaign_members m ON m.campaign_id=c.id AND m.user_id=$2
      WHERE c.id=$1 AND ${eligible} AND (c.owner_id=$2 OR (m.user_id=$2 AND c.archived_at IS NULL))`,[req.params.id,user.id]);
    const campaign=result.rows[0];if(!campaign)return reply.code(404).send(missing);
    if(!campaign.canManage)delete campaign.gmNotes;
    // Invitees only receive the campaign invitation, not the roster.
    const members=campaign.canManage||campaign.membershipStatus==='accepted'?await pool.query(`SELECT m.user_id AS "userId",u.display_name AS "displayName",m.status,
      CASE WHEN m.admission_status='approved' AND m.approved_basis IS DISTINCT FROM campaign_character_basis(c.data) THEN 'pending' ELSE m.admission_status END AS "admissionStatus",c.id AS "characterId",c.name AS "characterName",c.updated_at::text AS "updatedAt",
      (m.user_id=$2 OR $3) AND c.id IS NOT NULL AS "canReadSheet"
      FROM campaign_members m JOIN users u ON u.id=m.user_id
      LEFT JOIN characters c ON c.id=m.character_id AND c.owner_id=m.user_id AND c.archived_at IS NULL
      WHERE m.campaign_id=$1 ORDER BY m.status,lower(u.display_name),m.user_id`,[req.params.id,user.id,campaign.canManage&&!campaign.archivedAt]):{rows:[]};
    return {campaign,members:members.rows,userId:user.id};
  });
  app.patch<{Params:{id:string};Body:{name?:unknown;description?:unknown;gmNotes?:unknown;admissionRules?:unknown;archived?:unknown;version?:unknown}}>('/api/campaigns/:id',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!gm(user.role)||!uuid.test(req.params.id))return reply.code(404).send(missing);
    const b=req.body;
    if(!b||!validText(b.name,120,1)||!validText(b.description,2000)||!validText(b.gmNotes,20000)||!validText(b.admissionRules??'',4000)||typeof b.archived!=='boolean'||!Number.isSafeInteger(b.version))return reply.code(400).send({error:'invalid_campaign'});
    const result=await pool.query(`UPDATE campaigns SET name=$3,description=$4,gm_notes=$5,admission_rules=COALESCE($8,admission_rules),archived_at=CASE WHEN $6 THEN COALESCE(archived_at,now()) ELSE NULL END,version=version+1,updated_at=now()
      WHERE id=$1 AND owner_id=$2 AND version=$7 RETURNING id`,[req.params.id,user.id,String(b.name).trim(),String(b.description).trim(),String(b.gmNotes).trim(),b.archived,b.version,b.admissionRules===undefined?null:String(b.admissionRules).trim()]);
    if(result.rows.length)return {ok:true};
    const own=await pool.query('SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2',[req.params.id,user.id]);
    return reply.code(own.rows.length?409:404).send(own.rows.length?{error:'campaign_version_conflict'}:missing);
  });
  app.get<{Params:{id:string};Querystring:{q?:string}}>('/api/campaigns/:id/accounts',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!gm(user.role)||!uuid.test(req.params.id))return reply.code(404).send(missing);
    const own=await pool.query('SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL',[req.params.id,user.id]);
    if(!own.rows.length)return reply.code(404).send(missing);
    const q=typeof req.query.q==='string'?req.query.q.trim():'';
    if(q.length<2||q.length>80)return {accounts:[]};
    const result=await pool.query(`SELECT u.id,u.display_name AS "displayName" FROM users u WHERE u.is_active AND u.id<>$2
      AND strpos(lower(u.display_name),lower($3))>0 AND NOT EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=$1 AND m.user_id=u.id)
      ORDER BY (lower(u.display_name)=lower($3)) DESC,lower(u.display_name),u.id LIMIT 12`,[req.params.id,user.id,q]);
    return {accounts:result.rows};
  });
  app.post<{Params:{id:string};Body:{userId?:unknown}}>('/api/campaigns/:id/invitations',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!gm(user.role)||!uuid.test(req.params.id))return reply.code(404).send(missing);
    const target=typeof req.body?.userId==='string'?req.body.userId:'';
    if(!uuid.test(target)||target===user.id)return reply.code(400).send({error:'invalid_member'});
    const result=await pool.query(`INSERT INTO campaign_members(campaign_id,user_id)
      SELECT c.id,u.id FROM campaigns c CROSS JOIN users u WHERE c.id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND u.id=$3 AND u.is_active
      ON CONFLICT DO NOTHING RETURNING user_id`,[req.params.id,user.id,target]);
    if(!result.rows.length)return reply.code(409).send({error:'invitation_unavailable'});
    return reply.code(201).send({ok:true});
  });
  app.delete<{Params:{id:string;userId:string}}>('/api/campaigns/:id/members/:userId',async(req,reply)=>{
    const user=await requireUser(req,reply);if(!user)return;
    if(!uuid.test(req.params.id)||!uuid.test(req.params.userId))return reply.code(404).send(missing);
    const result=await pool.query(`DELETE FROM campaign_members m USING campaigns c WHERE m.campaign_id=c.id AND c.id=$1 AND m.user_id=$3
      AND (m.user_id=$2 OR (c.owner_id=$2 AND $4)) RETURNING m.user_id`,[req.params.id,user.id,req.params.userId,gm(user.role)]);
    if(!result.rows.length)return reply.code(404).send(missing);
    return {ok:true};
  });
}
