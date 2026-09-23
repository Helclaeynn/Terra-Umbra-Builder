import type {FastifyInstance} from 'fastify';
import {pool} from './db.js';
import {requireUser} from './auth.js';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const gm=(role:string)=>['gm','editor','admin'].includes(role);
export async function registerCampaignAdmissionRoutes(app:FastifyInstance){
 app.put<{Params:{id:string};Body:{characterId?:unknown;message?:unknown}}>('/api/campaigns/:id/membership',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  const id=req.params.id,source=req.body?.characterId,message=req.body?.message??'';
  if(!uuid.test(id))return reply.code(404).send({error:'campaign_not_found'});
  if((source!==null&&(typeof source!=='string'||!uuid.test(source)))||typeof message!=='string'||message.length>4000)return reply.code(400).send({error:'invalid_character'});
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   const deny=async()=>{await client.query('ROLLBACK');return reply.code(404).send({error:'membership_unavailable'});};
   const camp=await client.query(`SELECT c.id FROM campaigns c JOIN users u ON u.id=c.owner_id WHERE c.id=$1 AND c.archived_at IS NULL AND u.is_active AND u.role IN ('gm','editor','admin') FOR SHARE OF c`,[id]);
   if(!camp.rows.length)return await deny();
   const m=await client.query('SELECT * FROM campaign_members WHERE campaign_id=$1 AND user_id=$2 FOR UPDATE',[id,user.id]);if(!m.rows.length)return await deny();
   let character:any=null;
   if(source!==null){
    const ch=await client.query('SELECT * FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL FOR SHARE',[source,user.id]);if(!ch.rows.length)return await deny();
    const c=ch.rows[0];
    if(c.campaign_id===id)character={id:c.id,version:c.version};
    else{
     const created=await client.query(`INSERT INTO characters(owner_id,name,data,version,campaign_id,source_character_id,source_version,source_snapshot) VALUES($1,$2,$3::jsonb,1,$4,$5,$6,$3::jsonb) RETURNING id,version`,[user.id,c.name,JSON.stringify(c.data),id,c.id,c.version]);character=created.rows[0];
     await client.query("INSERT INTO character_revisions(character_id,revision,name,data,reason,created_by) VALUES($1,1,$2,$3::jsonb,'campaign-fork',$4)",[character.id,c.name,JSON.stringify(c.data),user.id]);
    }
   }
   await client.query(`UPDATE campaign_members SET status='accepted',character_id=$3,admission_status=CASE WHEN $3::uuid IS NULL THEN 'none' ELSE 'pending' END,admission_version=admission_version+1,approved_basis=NULL,approved_snapshot=NULL,approved_at=NULL WHERE campaign_id=$1 AND user_id=$2`,[id,user.id,character?.id??null]);
   await client.query('INSERT INTO campaign_admission_messages(campaign_id,user_id,author_id,character_id,kind,message) VALUES($1,$2,$2,$3,$4,$5)',[id,user.id,character?.id??null,character?'submitted':'detached',message.trim()]);
   await client.query('COMMIT');return {ok:true,character};
  }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 });
 app.get<{Params:{id:string}}>('/api/campaigns/:id/admissions',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  if(!uuid.test(req.params.id))return reply.code(404).send({error:'campaign_not_found'});
  const own=await pool.query(`SELECT c.owner_id=$2 AND $3 AS manage,c.admission_rules AS rules FROM campaigns c JOIN users u ON u.id=c.owner_id WHERE c.id=$1 AND c.archived_at IS NULL AND u.is_active AND u.role IN ('gm','editor','admin') AND (c.owner_id=$2 OR EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2))`,[req.params.id,user.id,gm(user.role)]);
  if(!own.rows.length)return reply.code(404).send({error:'campaign_not_found'});
  const r=await pool.query(`SELECT m.user_id AS "userId",u.display_name AS "displayName",m.admission_version AS version,
   CASE WHEN m.admission_status='approved' AND m.approved_basis IS DISTINCT FROM campaign_character_basis(ch.data) THEN 'pending' ELSE m.admission_status END AS status,
   m.approved_at AS "approvedAt",ch.id AS "characterId",ch.name,ch.version AS "characterVersion",ch.data #- '{identity,portraitDataUrl}' #- '{identity,notes}' AS data,ch.source_version AS "sourceVersion",src.name AS "sourceName",origin.name AS "sourceCampaign",ch.source_snapshot #- '{identity,portraitDataUrl}' #- '{identity,notes}' AS baseline,
   (SELECT COALESCE(jsonb_agg(jsonb_build_object('kind',a.kind,'message',a.message,'at',a.created_at,'author',au.display_name) ORDER BY a.created_at,a.id),'[]') FROM campaign_admission_messages a LEFT JOIN users au ON au.id=a.author_id WHERE a.campaign_id=m.campaign_id AND a.user_id=m.user_id) AS messages
   FROM campaign_members m JOIN users u ON u.id=m.user_id LEFT JOIN characters ch ON ch.id=m.character_id AND ch.owner_id=m.user_id AND ch.archived_at IS NULL LEFT JOIN characters src ON src.id=ch.source_character_id LEFT JOIN campaigns origin ON origin.id=src.campaign_id WHERE m.campaign_id=$1 AND ($3 OR m.user_id=$2) ORDER BY u.display_name,m.user_id`,[req.params.id,user.id,own.rows[0].manage]);
  return {admissions:r.rows,canManage:own.rows[0].manage,rules:own.rows[0].rules};
 });
 app.patch<{Params:{id:string;userId:string};Body:{status:string;message:string;version:number;characterId:string;characterVersion:number}}>('/api/campaigns/:id/admissions/:userId',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  if(!gm(user.role)||![req.params.id,req.params.userId].every(id=>uuid.test(id)))return reply.code(404).send({error:'campaign_not_found'});
  const b=req.body;
  if(!b||!['approved','changes_requested','rejected'].includes(b.status)||typeof b.message!=='string'||b.message.length>4000||(b.status!=='approved'&&!b.message.trim())||!uuid.test(b.characterId)||!Number.isSafeInteger(b.version)||!Number.isSafeInteger(b.characterVersion))return reply.code(400).send({error:'invalid_admission'});
  const client=await pool.connect();
  try{
   await client.query('BEGIN');const deny=async(code:number,error:string)=>{await client.query('ROLLBACK');return reply.code(code).send({error});};
   const camp=await client.query('SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL FOR SHARE',[req.params.id,user.id]);if(!camp.rows.length)return await deny(404,'campaign_not_found');
   const m=await client.query("SELECT * FROM campaign_members WHERE campaign_id=$1 AND user_id=$2 AND status='accepted' FOR UPDATE",[req.params.id,req.params.userId]);
   if(!m.rows.length||m.rows[0].character_id!==b.characterId||m.rows[0].admission_version!==b.version)return await deny(409,'admission_version_conflict');
   const ch=await client.query('SELECT data,version FROM characters WHERE id=$1 AND owner_id=$2 AND campaign_id=$3 AND archived_at IS NULL FOR UPDATE',[b.characterId,req.params.userId,req.params.id]);
   if(!ch.rows.length||ch.rows[0].version!==b.characterVersion)return await deny(409,'admission_version_conflict');
   await client.query(`UPDATE campaign_members SET admission_status=$3,admission_version=admission_version+1,approved_basis=CASE WHEN $3='approved' THEN campaign_character_basis($4::jsonb) ELSE NULL END,approved_snapshot=CASE WHEN $3='approved' THEN $4::jsonb ELSE NULL END,approved_at=CASE WHEN $3='approved' THEN now() ELSE NULL END WHERE campaign_id=$1 AND user_id=$2`,[req.params.id,req.params.userId,b.status,JSON.stringify(ch.rows[0].data)]);
   await client.query('INSERT INTO campaign_admission_messages(campaign_id,user_id,author_id,character_id,kind,message) VALUES($1,$2,$3,$4,$5,$6)',[req.params.id,req.params.userId,user.id,b.characterId,b.status,b.message.trim()]);
   await client.query('COMMIT');return {ok:true};
  }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 });
}
