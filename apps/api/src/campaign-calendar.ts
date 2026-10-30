import type {FastifyInstance} from 'fastify';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {passwordResetMailAvailable,sendCampaignCalendarEmail} from './mail.js';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
import type {CalendarEvent} from './campaign-calendar-message.js';
type Delivery={available:()=>boolean;send:(email:string,event:CalendarEvent)=>Promise<boolean>};
export async function registerCampaignCalendarRoutes(app:FastifyInstance,delivery:Delivery={available:passwordResetMailAvailable,send:sendCampaignCalendarEmail}){
 app.post<{Params:{id:string;sessionId:string};Body:{version?:unknown}}>('/api/campaigns/:id/sessions/:sessionId/calendar-invitations',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;
  if(!['gm','editor','admin'].includes(user.role)||![req.params.id,req.params.sessionId].every(v=>uuid.test(v)))return reply.code(404).send({error:'campaign_not_found'});
  if(!Number.isSafeInteger(req.body?.version)||Number(req.body.version)<1)return reply.code(400).send({error:'invalid_session'});
  const client=await pool.connect();let locked=false;
  try{
   // A durable claim per recipient survives a lost HTTP response. In-flight claims
   // are never automatically resent: a crash after SMTP acceptance is ambiguous.
   const lock=await client.query("SELECT pg_try_advisory_lock(hashtextextended($1,0)) AS locked",['calendar:'+req.params.sessionId]);locked=lock.rows[0].locked;
   if(!locked)return reply.code(409).send({error:'calendar_send_in_progress'});
   const s=await client.query(`SELECT s.id,s.campaign_id AS "campaignId",c.name AS "campaignName",s.title,s.played_on::text AS "playedOn",s.starts_at AS "startsAt",s.ends_at AS "endsAt",s.location,s.version,s.status FROM campaign_sessions s JOIN campaigns c ON c.id=s.campaign_id WHERE s.id=$1 AND c.id=$2 AND c.owner_id=$3 AND c.archived_at IS NULL`,[req.params.sessionId,req.params.id,user.id]);
   if(!s.rows.length)return reply.code(404).send({error:'session_not_found'});
   const event=s.rows[0];
   if(event.version!==req.body.version)return reply.code(409).send({error:'session_version_conflict'});
   if(!event.playedOn||event.status!=='planned')return reply.code(400).send({error:'calendar_date_required'});
   if(!delivery.available())return reply.code(503).send({error:'calendar_mail_unavailable'});
   const members=await client.query(`SELECT u.id,u.email FROM campaign_members m JOIN users u ON u.id=m.user_id WHERE m.campaign_id=$1 AND m.status='accepted' AND u.is_active ORDER BY u.id`,[req.params.id]);
   let sent=0,failed=0,alreadySent=0,uncertain=0;
   for(const member of members.rows){
    // Recheck eligibility before each individual external delivery.
    const current=await client.query(`SELECT s.id FROM campaign_sessions s JOIN campaigns c ON c.id=s.campaign_id JOIN users gm ON gm.id=c.owner_id JOIN campaign_members m ON m.campaign_id=c.id JOIN users u ON u.id=m.user_id WHERE s.id=$1 AND s.version=$2 AND s.status='planned' AND c.archived_at IS NULL AND c.owner_id=$3 AND gm.is_active AND gm.role IN ('gm','editor','admin') AND m.user_id=$4 AND m.status='accepted' AND u.is_active`,[event.id,event.version,user.id,member.id]);
    if(!current.rows.length)continue;
    const claim=await client.query(`INSERT INTO campaign_calendar_deliveries(session_id,user_id,version,status) VALUES($1,$2,$3,'sending') ON CONFLICT(session_id,user_id,version) DO UPDATE SET status='sending',updated_at=now() WHERE campaign_calendar_deliveries.status='failed' RETURNING user_id`,[event.id,member.id,event.version]);
    if(!claim.rows.length){const previous=await client.query('SELECT status FROM campaign_calendar_deliveries WHERE session_id=$1 AND user_id=$2 AND version=$3',[event.id,member.id,event.version]);if(previous.rows[0]?.status==='sent')alreadySent++;else uncertain++;continue;}
    let ok=false;try{ok=await delivery.send(member.email,event);}catch{ok=false;}
    await client.query('UPDATE campaign_calendar_deliveries SET status=$4,updated_at=now() WHERE session_id=$1 AND user_id=$2 AND version=$3',[event.id,member.id,event.version,ok?'sent':'failed']);
    if(ok)sent++;else failed++;
   }
   return {sent,failed,alreadySent,uncertain,total:members.rows.length};
  }finally{try{if(locked)await client.query('SELECT pg_advisory_unlock(hashtextextended($1,0))',['calendar:'+req.params.sessionId]);}finally{client.release();}}
 });
}
