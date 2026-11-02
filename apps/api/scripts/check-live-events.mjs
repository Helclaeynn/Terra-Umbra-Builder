// Temps réel (src/live-events.ts) : un membre reçoit l'annonce d'un changement,
// un compte étranger à la campagne est refusé, le flux ne contient aucune donnée privée.
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import http from 'node:http';
import Fastify from 'fastify';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {registerLiveEventRoutes,liveSubscriberCount}=await import('../dist/live-events.js');
const app=Fastify(),ids=[];
await registerLiveEventRoutes(app);
// Écriture factice sur la campagne (les vraies routes passent par le même crochet).
app.post('/api/campaigns/:id/scene',async()=>({ok:true}));
app.post('/api/campaigns/:id/refused',async(req,reply)=>reply.code(409).send({error:'conflict'}));
await app.listen({port:0,host:'127.0.0.1'});
const port=app.server.address().port;
async function account(role){const id=randomUUID(),token=randomBytes(32).toString('base64url');ids.push(id);await pool.query('INSERT INTO users(id,email,display_name,role) VALUES($1,$2,$3,$4)',[id,`ci-live-${id}@example.invalid`,'Live CI '+role,role]);await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);return {id,cookie:`__Host-tuc_session=${token}`};}
function open(who,path){return new Promise((resolve)=>{const events=[];const req=http.get({host:'127.0.0.1',port,path,headers:who?{cookie:who.cookie}:{}},res=>{res.setEncoding('utf8');let buffer='';res.on('data',chunk=>{buffer+=chunk;const parts=buffer.split('\n\n');buffer=parts.pop();for(const part of parts){const ev=/^event: (.*)$/m.exec(part)?.[1];if(ev)events.push({event:ev,data:/^data: (.*)$/m.exec(part)?.[1]});}});resolve({status:res.statusCode,type:res.headers['content-type'],events,close:()=>req.destroy()});});});}
const until=async(test,ms=3000)=>{const end=Date.now()+ms;while(Date.now()<end){if(test())return true;await new Promise(r=>setTimeout(r,20));}return false;};
try{
 const gm=await account('gm'),player=await account('player'),stranger=await account('player');
 const cid=(await pool.query("INSERT INTO campaigns(owner_id,name) VALUES($1,'Live CI') RETURNING id",[gm.id])).rows[0].id;
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'accepted')",[cid,player.id]);
 const path=`/api/campaigns/${cid}/events`;
 const anonymous=await open(null,path);assert.equal(anonymous.status,401);anonymous.close();
 const outsider=await open(stranger,path);assert.equal(outsider.status,404);outsider.close();
 const table=await open(player,path),master=await open(gm,path);
 assert.equal(table.status,200);assert.match(table.type,/text\/event-stream/);
 assert.ok(await until(()=>table.events.some(e=>e.event==='ready')&&master.events.some(e=>e.event==='ready')),'Flux ouvert');
 assert.equal(liveSubscriberCount(),2);
 assert.equal((await app.inject({method:'POST',url:`/api/campaigns/${cid}/refused`})).statusCode,409);
 assert.equal((await app.inject({method:'POST',url:`/api/campaigns/${cid}/scene`})).statusCode,200);
 assert.ok(await until(()=>table.events.some(e=>e.event==='change')&&master.events.some(e=>e.event==='change')),'Changement annoncé à tous');
 const changes=table.events.filter(e=>e.event==='change');
 assert.equal(changes.length,1,'Une écriture refusée n’annonce rien');
 assert.deepEqual(Object.keys(JSON.parse(changes[0].data)).sort(),['at','topic']);assert.equal(JSON.parse(changes[0].data).topic,'scene');
 table.close();master.close();
 assert.ok(await until(()=>liveSubscriberCount()===0),'Abonnements libérés à la fermeture');
 console.log('LIVE EVENTS OK — membre et MJ prévenus, intrus et anonyme refusés, écritures refusées muettes, aucune donnée privée, abonnements libérés');
}finally{await app.close();if(ids.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-live-%@example.invalid'",[ids]);await pool.end();}
