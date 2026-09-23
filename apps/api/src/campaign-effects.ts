import type {FastifyInstance} from 'fastify';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {campaignCharacterState} from './campaign-character.js';
import {corruptionSources} from './rules/truth/corruption.js';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const gm=(role:string)=>['gm','editor','admin'].includes(role);
export async function registerCampaignEffectRoutes(app:FastifyInstance){
 app.get<{Params:{id:string}}>('/api/campaigns/:id/effect-targets',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  if(!gm(user.role)||!uuid.test(req.params.id))return reply.code(404).send({error:'campaign_not_found'});
  const own=await pool.query('SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL',[req.params.id,user.id]);
  if(!own.rows.length)return reply.code(404).send({error:'campaign_not_found'});
  const r=await pool.query(`SELECT ch.id,ch.name,ch.version,ch.data FROM campaign_members m JOIN characters ch ON ch.id=m.character_id AND ch.owner_id=m.user_id WHERE m.campaign_id=$1 AND m.status='accepted' AND ch.campaign_id=m.campaign_id AND m.admission_status='approved' AND m.approved_basis=campaign_character_basis(ch.data) AND ch.archived_at IS NULL ORDER BY ch.name,ch.id`,[req.params.id]);
  return {characters:r.rows.map(c=>{try{return {id:c.id,name:c.name,version:c.version,...campaignCharacterState(c.data)};}catch{return {id:c.id,name:c.name,unavailable:true};}}),sources:corruptionSources};
 });
 app.post<{Params:{id:string;sessionId:string};Body:{requestId:string;characterId:string;version:number;money:number;corruptionDelta:number;corruptionSource:string;reason:string}}>('/api/campaigns/:id/sessions/:sessionId/effects',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  if(!gm(user.role)||![req.params.id,req.params.sessionId].every(id=>uuid.test(id)))return reply.code(404).send({error:'campaign_not_found'});
  const b=req.body;
  if(!b||![b.requestId,b.characterId].every(id=>typeof id==='string'&&uuid.test(id))||!Number.isSafeInteger(b.version)||b.version<1||!Number.isSafeInteger(b.money)||b.money<0||b.money>1e9||!Number.isInteger(b.corruptionDelta)||b.corruptionDelta<0||b.corruptionDelta>100||b.money+b.corruptionDelta===0||typeof b.reason!=='string'||!b.reason.trim()||b.reason.length>500||typeof b.corruptionSource!=='string'||(b.corruptionDelta>0&&!corruptionSources.some(s=>s.id===b.corruptionSource))||(b.corruptionDelta===0&&b.corruptionSource!==''))return reply.code(400).send({error:'invalid_effect'});
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   const deny=async(code:number,error:string)=>{await client.query('ROLLBACK');return reply.code(code).send({error});};
   const own=await client.query('SELECT id FROM campaigns WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL FOR SHARE',[req.params.id,user.id]);
   if(!own.rows.length)return await deny(404,'campaign_not_found');
   const session=await client.query('SELECT id,title,status FROM campaign_sessions WHERE id=$1 AND campaign_id=$2 FOR UPDATE',[req.params.sessionId,req.params.id]);
   if(!session.rows.length)return await deny(404,'session_not_found');
   if(session.rows[0].status!=='played')return await deny(400,'session_not_played');
   const member=await client.query("SELECT m.user_id FROM campaign_members m JOIN characters ch ON ch.id=m.character_id AND ch.campaign_id=m.campaign_id WHERE m.campaign_id=$1 AND m.character_id=$2 AND m.status='accepted' AND m.admission_status='approved' AND m.approved_basis=campaign_character_basis(ch.data) FOR SHARE OF m",[req.params.id,b.characterId]);
   if(!member.rows.length)return await deny(409,'reward_recipient_unavailable');
   const chars=await client.query('SELECT id,name,data,version FROM characters WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL FOR UPDATE',[b.characterId,member.rows[0].user_id]);
   if(!chars.rows.length)return await deny(409,'reward_recipient_unavailable');
   const existing=await client.query('SELECT * FROM campaign_session_effects WHERE id=$1',[b.requestId]);
   if(existing.rows.length){
    const e=existing.rows[0];
    if(e.session_id!==req.params.sessionId||e.character_id!==b.characterId||Number(e.money)!==b.money||e.corruption_delta!==b.corruptionDelta||e.corruption_source!==b.corruptionSource||e.reason!==b.reason.trim())return await deny(409,'effect_request_conflict');
    await client.query('COMMIT');return {ok:true,alreadyApplied:true};
   }
   const approval=await client.query(`SELECT 1 FROM campaign_members m JOIN characters ch ON ch.id=m.character_id WHERE m.campaign_id=$1 AND ch.id=$2 AND m.admission_status='approved' AND m.approved_basis=campaign_character_basis(ch.data)`,[req.params.id,b.characterId]);
   if(!approval.rows.length)return await deny(409,'reward_recipient_unavailable');
   const c=chars.rows[0];if(c.version!==b.version)return await deny(409,'effect_version_conflict');
   const before=campaignCharacterState(c.data);
   if(b.corruptionDelta>0&&before.corruption+b.corruptionDelta>before.integrity)return await deny(400,'corruption_limit');
   if(!Number.isSafeInteger(Math.ceil(before.money+b.money)))return await deny(400,'invalid_effect');
   const progress=c.data.progression??{};
   if(b.money){
    if(progress.cashBase==null)progress.cashBase=before.base;
    progress.cashTransactions??=[];
    if(!Array.isArray(progress.cashTransactions))return await deny(409,'invalid_character_progression');
    progress.cashTransactions.push({uid:b.requestId,amount:b.money,label:`Séance · ${session.rows[0].title} — ${b.reason.trim()}`,type:'campaign-gm',at:new Date().toISOString()});
   }
   c.data.progression=progress;
   if(b.corruptionDelta){c.data.truth={...c.data.truth,corruption:before.corruption+b.corruptionDelta,corruptionSource:b.corruptionSource,corruptionMjAuthorized:true};}
   const after=campaignCharacterState(c.data);
   await client.query(`INSERT INTO campaign_session_effects(id,session_id,character_id,character_name,money,corruption_delta,corruption_source,reason,before_state,after_state,applied_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11)`,[b.requestId,req.params.sessionId,c.id,c.name,b.money,b.corruptionDelta,b.corruptionSource,b.reason.trim(),JSON.stringify(before),JSON.stringify(after),user.id]);
   await client.query('UPDATE characters SET data=$2::jsonb,version=version+1,updated_at=now() WHERE id=$1',[c.id,JSON.stringify(c.data)]);
   await client.query('INSERT INTO character_revisions(character_id,revision,name,data,reason,created_by) VALUES($1,$2,$3,$4::jsonb,$5,$6)',[c.id,c.version+1,c.name,JSON.stringify(c.data),'campaign-effect:'+session.rows[0].title,user.id]);
   await client.query('COMMIT');return {ok:true};
  }catch(e){await client.query('ROLLBACK');if(e instanceof Error&&e.message==='invalid_character_progression')return reply.code(409).send({error:e.message});throw e;}finally{client.release();}
 });
}
