import type {FastifyInstance} from 'fastify';
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {lockCombat,combatState,pendingAttacks,combatActors} from './campaign-rounds.js';
import {edgeBalance} from './character-edge.js';
type Db={query:(...args:any[])=>Promise<any>};
const uuid=(id:any)=>typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
export async function currentLiveSession(db:Db,id:string){return (await db.query('SELECT s.id,s.title FROM campaign_live_context x JOIN campaign_sessions s ON s.id=x.session_id WHERE x.campaign_id=$1',[id])).rows[0]??null;}
async function access(db:Db,id:string,user:any){if(!uuid(id))return null;return (await db.query(`SELECT c.owner_id=$2 AND $3::boolean AS manager FROM campaigns c WHERE c.id=$1 AND c.archived_at IS NULL AND (c.owner_id=$2 AND $3::boolean OR EXISTS(SELECT 1 FROM campaign_members m WHERE m.campaign_id=c.id AND m.user_id=$2 AND m.status='accepted'))`,[id,user.id,['gm','admin','editor'].includes(user.role)])).rows[0];}
async function snapshot(db:Db,campaign:string,session:string,label:string){
 // Character locks also serialize snapshots with Builder/progression/reward saves.
 await db.query('SELECT id FROM characters WHERE campaign_id=$1 ORDER BY id FOR UPDATE',[campaign]);
 const actors=await combatActors(db,campaign),characters=[];
 for(const c of actors.filter(c=>c.kind==='character')){const row=(await db.query('SELECT version FROM characters WHERE id=$1',[c.id])).rows[0];characters.push({id:c.id,name:c.name,ownerId:c.owner_id,version:row.version,data:c.data,state:c.state,profile:c.profile,edge:await edgeBalance(db,c.id,c.data)});}
 const data={characters,combatants:actors.filter(c=>c.kind!=='character'),combat:await combatState(db,campaign)};
 await db.query('INSERT INTO campaign_live_versions(campaign_id,session_id,label,snapshot) VALUES($1,$2,$3,$4::jsonb)',[campaign,session,label,JSON.stringify(data)]);
}
export async function registerLiveSessionRoutes(app:FastifyInstance){
 app.get<{Params:{id:string}}>('/api/campaigns/:id/play/sessions',async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;
  if(!await access(pool,req.params.id,user))return reply.code(404).send({error:'campaign_not_found'});
  const r=await pool.query(`SELECT s.id,s.title,s.played_on::text AS "playedOn",r.started_at AS "startedAt",r.ended_at AS "endedAt" FROM campaign_sessions s LEFT JOIN campaign_live_session_runs r ON r.session_id=s.id WHERE s.campaign_id=$1 ORDER BY s.created_at DESC,s.id LIMIT 200`,[req.params.id]);
  return {current:await currentLiveSession(pool,req.params.id),sessions:r.rows};
 });
 app.get<{Params:{id:string;session:string}}>('/api/campaigns/:id/play/sessions/:session/versions',async(req,reply)=>{
  reply.header('Cache-Control','private, no-store');const user=await requireUser(req,reply);if(!user)return;const allowed=await access(pool,req.params.id,user);
  if(!allowed||!uuid(req.params.session))return reply.code(404).send({error:'session_not_found'});
  const rows=await pool.query('SELECT id,label,created_at AS "createdAt",snapshot FROM campaign_live_versions WHERE campaign_id=$1 AND session_id=$2 ORDER BY created_at DESC,id DESC',[req.params.id,req.params.session]);
  return {versions:rows.rows.map((r:any)=>({...r,snapshot:allowed.manager?r.snapshot:{characters:r.snapshot.characters.filter((c:any)=>c.ownerId===user.id)}}))};
 });
 app.post<{Params:{id:string};Body:any}>('/api/campaigns/:id/play/sessions',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;const b:any=req.body;
  if(!b||!uuid(b.requestId)||!['start','checkpoint'].includes(b.action)||typeof b.title!=='string'||!b.title.trim()||b.title.length>120||b.sessionId!==undefined&&!uuid(b.sessionId))return reply.code(400).send({error:'invalid_live_session'});
  const db=await pool.connect();try{await db.query('BEGIN');const fail=async(code:number,error:string)=>{await db.query('ROLLBACK');return reply.code(code).send({error});};
   if(!(await access(db,req.params.id,user))?.manager)return await fail(404,'campaign_not_found');
   await lockCombat(db,req.params.id);
   const previous=(await db.query('SELECT campaign_id,created_by,request_payload FROM campaign_live_events WHERE id=$1',[b.requestId])).rows[0];
   if(previous){if(previous.campaign_id!==req.params.id||previous.created_by!==user.id||!isDeepStrictEqual(previous.request_payload,b))return await fail(409,'session_request_conflict');await db.query('COMMIT');return {ok:true,alreadyApplied:true};}
   let current=await currentLiveSession(db,req.params.id);
   if((b.expectedSession??null)!==(current?.id??null))return await fail(409,'session_version_conflict');
   if(b.action==='checkpoint'){
    if(!current)return await fail(400,'no_live_session');await snapshot(db,req.params.id,current.id,b.title.trim());
   }else{
    if(await pendingAttacks(db,req.params.id))return await fail(400,'finish_combat_first');
    if(!current){
     // Keep all pre-session history and its final sheets in a named archive.
     const legacy=randomUUID();await db.query("INSERT INTO campaign_sessions(id,campaign_id,title,status) VALUES($1,$2,'Avant les séances','played')",[legacy,req.params.id]);
     await db.query('INSERT INTO campaign_live_session_runs(session_id,campaign_id,ended_at) VALUES($1,$2,now())',[legacy,req.params.id]);
     for(const table of ['character_play_events','campaign_live_events'])await db.query(`UPDATE ${table} SET live_session_id=$2 WHERE campaign_id=$1 AND live_session_id IS NULL`,[req.params.id,legacy]);
     await snapshot(db,req.params.id,legacy,'État avant la première séance suivie');
    }else{
     await snapshot(db,req.params.id,current.id,'Fin de séance');await db.query('UPDATE campaign_live_session_runs SET ended_at=now() WHERE session_id=$1',[current.id]);
    }
    const next=b.sessionId??randomUUID();
    if(b.sessionId){if(!(await db.query('SELECT id FROM campaign_sessions WHERE id=$1 AND campaign_id=$2',[next,req.params.id])).rowCount)return await fail(404,'session_not_found');if((await db.query('SELECT session_id FROM campaign_live_session_runs WHERE session_id=$1',[next])).rowCount)return await fail(409,'session_already_started');}
    else await db.query("INSERT INTO campaign_sessions(id,campaign_id,title,status,played_on) VALUES($1,$2,$3,'played',CURRENT_DATE)",[next,req.params.id,b.title.trim()]);
    await db.query("UPDATE campaign_sessions SET status='played',version=version+1 WHERE id=$1",[next]);
    await db.query('INSERT INTO campaign_live_session_runs(session_id,campaign_id) VALUES($1,$2)',[next,req.params.id]);
    await db.query('INSERT INTO campaign_live_context(campaign_id,session_id) VALUES($1,$2) ON CONFLICT(campaign_id) DO UPDATE SET session_id=EXCLUDED.session_id',[req.params.id,next]);
    current=await currentLiveSession(db,req.params.id);await snapshot(db,req.params.id,next,'Début de séance');
   }
   await db.query("INSERT INTO campaign_live_events(id,campaign_id,created_by,kind,payload,request_payload,public) VALUES($1,$2,$3,'session',$4::jsonb,$5::jsonb,true)",[b.requestId,req.params.id,user.id,JSON.stringify({label:b.action==='start'?'Nouvelle séance · '+current.title:'Version enregistrée · '+b.title}),JSON.stringify(b)]);
   await db.query('COMMIT');return {ok:true};
  }catch(e){await db.query('ROLLBACK').catch(()=>{});throw e;}finally{db.release();}
 });
}
