import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import Fastify from 'fastify';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only; mail transport is always fake');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {registerCampaignCalendarRoutes}=await import('../dist/campaign-calendar.js');
const {calendarMessage}=await import('../dist/campaign-calendar-message.js');
const ids=[],messages=[],app=Fastify();let failEmail='',available=true;
await registerCampaignCalendarRoutes(app,{available:()=>available,send:async(email,event)=>{if(email===failEmail)throw Error('Simulated SMTP failure');messages.push({email,event,ics:calendarMessage(event,email,'calendar@example.invalid','https://dev.terra-umbra.fr')});return true;}});
async function account(role){const email=`ci-calendar-${randomBytes(10).toString('hex')}@example.invalid`;const r=await pool.query('INSERT INTO users(email,display_name,role) VALUES($1,$2,$3) RETURNING id',[email,'CI calendrier',role]);const id=r.rows[0].id;ids.push(id);const token=randomBytes(32).toString('base64url');await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);return {id,email,cookie:`__Host-tuc_session=${token}`};}
async function call(who,path,version=1,status=200){const r=await app.inject({method:'POST',url:path,headers:who?{cookie:who.cookie}:{},payload:{version}});assert.equal(r.statusCode,status,r.body);return r.json();}
try{
 const gm=await account('gm'),player=await account('player'),other=await account('player'),invited=await account('player'),inactive=await account('player'),outsider=await account('gm');
 const cid=(await pool.query('INSERT INTO campaigns(owner_id,name) VALUES($1,$2) RETURNING id',[gm.id,'CI calendrier'])).rows[0].id;
 for(const u of [player,other,invited,inactive])await pool.query('INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,$3)',[cid,u.id,u===invited?'invited':'accepted']);
 await pool.query('UPDATE users SET is_active=false WHERE id=$1',[inactive.id]);
 const sid=(await pool.query("INSERT INTO campaign_sessions(campaign_id,title,played_on,starts_at,ends_at,location,preparation,report) VALUES($1,'Séance calendrier','2026-10-25','2026-10-25T18:00:00Z','2026-10-25T22:00:00Z','Salon','SECRET','SECRET') RETURNING id",[cid])).rows[0].id;
 const path=`/api/campaigns/${cid}/sessions/${sid}/calendar-invitations`;
 await call(null,path,1,401);await call(player,path,1,404);await call(outsider,path,1,404);await call(gm,path,99,409);
 available=false;await call(gm,path,1,503);available=true;assert.equal(messages.length,0);
 failEmail=other.email;let r=await call(gm,path);assert.equal(r.sent,1);assert.equal(r.failed,1);assert.equal(r.total,2);
 assert.equal(messages[0].email,player.email);assert.ok(!messages[0].ics.includes('SECRET'));
 failEmail='';r=await call(gm,path);assert.equal(r.sent,1);assert.equal(r.alreadySent,1);assert.equal(messages.length,2);
 r=await call(gm,path);assert.equal(r.sent,0);assert.equal(r.alreadySent,2);
 await pool.query("UPDATE campaign_sessions SET version=2,starts_at=starts_at+interval '1 day',ends_at=ends_at+interval '1 day',played_on=played_on+1 WHERE id=$1",[sid]);
 await call(gm,path,1,409);r=await call(gm,path,2);assert.equal(r.sent,2);assert.match(messages[2].ics,/SEQUENCE:2/);
 assert.equal(messages[0].ics.match(/UID:(.*)/)[1],messages[2].ics.match(/UID:(.*)/)[1]);
 await pool.query('UPDATE campaign_sessions SET version=3 WHERE id=$1',[sid]);
 await pool.query("INSERT INTO campaign_calendar_deliveries(session_id,user_id,version,status) VALUES($1,$2,3,'sending')",[sid,player.id]);
 r=await call(gm,path,3);assert.equal(r.uncertain,1);assert.equal(r.sent,1);
 await pool.query('UPDATE campaigns SET archived_at=now() WHERE id=$1',[cid]);await call(gm,path,3,404);
 assert.ok(messages.every(m=>[player.email,other.email].includes(m.email)));
 console.log('CALENDAR DELIVERY OK — authorized GM, accepted active members only, one private email each, no real SMTP, partial failure retry, duplicate prevention, stable updates, stale version and archive guards');
}finally{await app.close();if(ids.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-calendar-%@example.invalid'",[ids]);await pool.end();}
