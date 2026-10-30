// Real TCP responses: inject() alone does not detect headers written twice.
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import {setImmediate} from 'node:timers/promises';
process.env.DATABASE_URL ||= 'postgres://unused:unused@127.0.0.1:1/unused';
const {pool}=await import('../dist/db.js');
const {registerCampaignRoutes}=await import('../dist/campaigns.js');
const {registerCanonicalNpcGenerator}=await import('../dist/canonical-npc-generator.js');
const app=Fastify();
// A delayed response hook exposes an early-return authentication race reliably.
app.addHook('onSend',async(req,reply,payload)=>{await setImmediate();reply.header('Cache-Control','no-store, private');return payload;});
await registerCampaignRoutes(app);await registerCanonicalNpcGenerator(app);
app.get('/health',async()=>({ok:true}));
try{
 const base=await app.listen({port:0,host:'127.0.0.1'});
 const endpoints=['/api/campaigns','/api/campaigns/11111111-1111-4111-8111-111111111111/npcs','/api/compendium/editor/npc-generator/catalog'];
 for(let round=0;round<4;round++)for(const endpoint of endpoints){
  const response=await fetch(base+endpoint);assert.equal(response.status,401);assert.deepEqual(await response.json(),{error:'authentication_required'});assert.match(response.headers.get('cache-control'),/no-store/);
  assert.deepEqual(await (await fetch(base+'/health')).json(),{ok:true});
 }
 console.log('AUTH RESPONSE LIFECYCLE OK — unauthenticated campaign and canonical requests send one response through asynchronous hooks; API stays alive over TCP');
}finally{await app.close();await pool.end();}
