import type {FastifyInstance} from 'fastify';
import {pool} from './db.js';
import {requireUser} from './auth.js';
import {NPC_CATALOG,generateNpcBatch} from './campaign-npc-generator.js';
import {cleanNpcData,validNpcData} from './campaign-npc-model.js';
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const owned=`SELECT c.id FROM campaigns c JOIN users u ON u.id=c.owner_id WHERE c.id=$1 AND c.owner_id=$2 AND u.is_active AND u.role IN ('gm','editor','admin')`;
const summaries=`id,data->>'name' AS name,data->>'tierId' AS "tierId",data->>'role' AS role,data->>'faction' AS faction,data->'tags' AS tags,COALESCE(data->>'portrait','')<>'' AS "hasPortrait",version,archived_at IS NOT NULL AS archived`;
export function npcPortrait(value:string):{mime:string;buffer:Buffer}|null{
 const match=/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);if(!match||value.length>700000)return null;
 const buffer=Buffer.from(match[2],'base64');if(buffer.toString('base64')!==match[2])return null;
 const valid=match[1]==='png'?buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):match[1]==='jpeg'?buffer.length>4&&buffer[0]===255&&buffer[1]===216&&buffer[2]===255:buffer.length>12&&buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP';
 return valid?{mime:'image/'+match[1],buffer}:null;
}
export async function registerCampaignNpcRoutes(app:FastifyInstance){
 // Every operation, including image reads, requires this campaign's active MJ.
 app.addHook('onSend',async(req,reply,payload)=>{if(/^\/api\/campaigns\/[^/]+\/npcs(?:\/|\?|$)/.test(req.url)){reply.header('Cache-Control','no-store, private');reply.header('Pragma','no-cache');}return payload;});
 app.get<{Params:{id:string}}>('/api/campaigns/:id/npcs/catalog',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;if(!uuid.test(req.params.id)||!(await pool.query(owned,[req.params.id,user.id])).rows.length)return reply.code(404).send({error:'campaign_not_found'});return NPC_CATALOG;
 });
 app.post<{Params:{id:string};Body:{tierId?:unknown;presetId?:unknown;seed?:unknown;count?:unknown;faction?:unknown}}>('/api/campaigns/:id/npcs/generate',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;if(!uuid.test(req.params.id)||!(await pool.query(owned+' AND c.archived_at IS NULL',[req.params.id,user.id])).rows.length)return reply.code(404).send({error:'campaign_not_found'});
  const npcs=generateNpcBatch(req.body);if(!npcs)return reply.code(400).send({error:'invalid_npc_generator'});return {npcs};
 });
 app.get<{Params:{id:string};Querystring:{q?:string;offset?:string;archived?:string}}>('/api/campaigns/:id/npcs',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;if(!uuid.test(req.params.id)||!(await pool.query(owned,[req.params.id,user.id])).rows.length)return reply.code(404).send({error:'campaign_not_found'});
  const q=String(req.query.q??'').trim(),offset=Number(req.query.offset??0);if(q.length>100||!Number.isSafeInteger(offset)||offset<0||offset>100000)return reply.code(400).send({error:'invalid_npc_page'});
  const r=await pool.query(`SELECT ${summaries} FROM campaign_npcs WHERE campaign_id=$1 AND (archived_at IS NOT NULL)=$2 AND strpos(lower(concat_ws(' ',data->>'name',data->>'role',data->>'faction',(data->'tags')::text)),lower($3))>0 ORDER BY updated_at DESC,id LIMIT 21 OFFSET $4`,[req.params.id,req.query.archived==='true',q,offset]);return {npcs:r.rows.slice(0,20),hasMore:r.rows.length>20};
 });
 app.get<{Params:{id:string;npcId:string}}>('/api/campaigns/:id/npcs/:npcId',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;if(!uuid.test(req.params.id)||!uuid.test(req.params.npcId)||!(await pool.query(owned,[req.params.id,user.id])).rows.length)return reply.code(404).send({error:'campaign_not_found'});
  const r=await pool.query(`SELECT ${summaries},data FROM campaign_npcs WHERE id=$1 AND campaign_id=$2`,[req.params.npcId,req.params.id]);if(!r.rows.length)return reply.code(404).send({error:'npc_not_found'});return {npc:r.rows[0]};
 });
 app.get<{Params:{id:string;npcId:string}}>('/api/campaigns/:id/npcs/:npcId/portrait',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;if(!uuid.test(req.params.id)||!uuid.test(req.params.npcId)||!(await pool.query(owned,[req.params.id,user.id])).rows.length)return reply.code(404).send({error:'campaign_not_found'});
  const r=await pool.query(`SELECT data->>'portrait' AS portrait FROM campaign_npcs WHERE id=$1 AND campaign_id=$2`,[req.params.npcId,req.params.id]);const portrait=npcPortrait(r.rows[0]?.portrait||'');if(!portrait)return reply.code(404).send({error:'npc_portrait_not_found'});reply.type(portrait.mime).header('X-Content-Type-Options','nosniff');return reply.send(portrait.buffer);
 });
 app.post<{Params:{id:string};Body:{npcs?:unknown}}>('/api/campaigns/:id/npcs',{bodyLimit:8*1024*1024},async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;if(!uuid.test(req.params.id))return reply.code(404).send({error:'campaign_not_found'});
  const rows=req.body?.npcs;if(!Array.isArray(rows)||!rows.length||rows.length>10||rows.some(r=>!r||!uuid.test(r.id)||!validNpcData(r.data,NPC_CATALOG)||(r.data.portrait&&!npcPortrait(r.data.portrait)))||new Set(rows.map(r=>r.id)).size!==rows.length)return reply.code(400).send({error:'invalid_npc'});
  const client=await pool.connect();try{await client.query('BEGIN');const access=await client.query(owned+' AND c.archived_at IS NULL FOR SHARE OF c,u',[req.params.id,user.id]);if(!access.rows.length){await client.query('ROLLBACK');return reply.code(404).send({error:'campaign_not_found'});}
   for(const row of rows){const data=cleanNpcData(row.data);await client.query('INSERT INTO campaign_npcs(id,campaign_id,data) VALUES($1,$2,$3::jsonb) ON CONFLICT(id) DO NOTHING',[row.id,req.params.id,JSON.stringify(data)]);
    const same=await client.query('SELECT id FROM campaign_npcs WHERE id=$1 AND campaign_id=$2 AND data=$3::jsonb',[row.id,req.params.id,JSON.stringify(data)]);if(!same.rows.length){await client.query('ROLLBACK');return reply.code(409).send({error:'npc_creation_conflict'});}}
   await client.query('COMMIT');return reply.code(201).send({ok:true,ids:rows.map(r=>r.id)});
  }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 });
 app.patch<{Params:{id:string;npcId:string};Body:{data?:unknown;version?:unknown;archived?:unknown}}>('/api/campaigns/:id/npcs/:npcId',async(req,reply)=>{
  const user=await requireUser(req,reply);if(!user)return;if(!uuid.test(req.params.id)||!uuid.test(req.params.npcId)||!(await pool.query(owned+' AND c.archived_at IS NULL',[req.params.id,user.id])).rows.length)return reply.code(404).send({error:'campaign_not_found'});
  const b=req.body;if(!b||!validNpcData(b.data,NPC_CATALOG)||(b.data.portrait&&!npcPortrait(b.data.portrait))||!Number.isSafeInteger(b.version)||typeof b.archived!=='boolean')return reply.code(400).send({error:'invalid_npc'});
  const r=await pool.query(`UPDATE campaign_npcs SET data=$4::jsonb,version=version+1,updated_at=now(),archived_at=CASE WHEN $5 THEN COALESCE(archived_at,now()) ELSE NULL END WHERE id=$1 AND campaign_id=$2 AND version=$3 AND EXISTS(SELECT 1 FROM campaigns c JOIN users u ON u.id=c.owner_id WHERE c.id=$2 AND c.owner_id=$6 AND c.archived_at IS NULL AND u.is_active AND u.role IN ('gm','editor','admin')) RETURNING version`,[req.params.npcId,req.params.id,b.version,JSON.stringify(cleanNpcData(b.data)),b.archived,user.id]);if(r.rows.length)return {ok:true,version:r.rows[0].version};const exists=await pool.query('SELECT id FROM campaign_npcs WHERE id=$1 AND campaign_id=$2',[req.params.npcId,req.params.id]);return reply.code(exists.rows.length?409:404).send({error:exists.rows.length?'npc_version_conflict':'npc_not_found'});
 });
}
export async function campaignNpcReferencesAvailable(campaignId:string,userId:string,scenes:unknown){
 if(!Array.isArray(scenes))return true;
 const ids=[...new Set(scenes.flatMap(s=>s.references||[]).map(r=>r.npcId).filter(Boolean))];if(!ids.length)return true;
 const r=await pool.query(`SELECT n.id FROM campaign_npcs n JOIN campaigns c ON c.id=n.campaign_id JOIN users u ON u.id=c.owner_id WHERE n.campaign_id=$1 AND c.owner_id=$2 AND c.archived_at IS NULL AND u.is_active AND u.role IN ('gm','editor','admin') AND n.id=ANY($3::uuid[])`,[campaignId,userId,ids]);return r.rows.length===ids.length;
}
