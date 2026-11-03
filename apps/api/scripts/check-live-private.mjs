// Messages privés à la table (campaign-live.ts) : une révélation du MJ à un joueur et la
// note d'un joueur au MJ ne sont lues que par le MJ, le destinataire et l'auteur.
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import Fastify from 'fastify';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {registerCampaignLiveRoutes,liveSnapshot}=await import('../dist/campaign-live.js');
const app=Fastify(),ids=[];await registerCampaignLiveRoutes(app);
async function account(role){const id=randomUUID(),token=randomBytes(32).toString('base64url');ids.push(id);await pool.query('INSERT INTO users(id,email,display_name,role) VALUES($1,$2,$3,$4)',[id,`ci-private-${id}@example.invalid`,'Private CI '+role,role]);await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);return {id,cookie:`__Host-tuc_session=${token}`};}
async function post(who,url,payload,status=200){const r=await app.inject({method:'POST',url,headers:{cookie:who.cookie},payload});assert.equal(r.statusCode,status,`${url} ${r.body}`);return r.json();}
const labels=async(cid,who,manager=false)=>(await liveSnapshot(cid,manager,null,null,who.id)).messages.map(m=>m.payload.label);
try{
 const gm=await account('gm'),alice=await account('player'),bob=await account('player');
 const cid=(await pool.query("INSERT INTO campaigns(owner_id,name) VALUES($1,'Private CI') RETURNING id",[gm.id])).rows[0].id;
 const charOf=async(who,name)=>{const c=(await pool.query("INSERT INTO characters(owner_id,name,data,campaign_id) VALUES($1,$2,'{}',$3) RETURNING id",[who.id,name,cid])).rows[0].id;await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id) VALUES($1,$2,'accepted',$3)",[cid,who.id,c]);return c;};
 const aliceChar=await charOf(alice,'Alice CI');await charOf(bob,'Bob CI');
 const base=`/api/campaigns/${cid}/play`;
 await post(gm,base+'/actions',{requestId:randomUUID(),action:'message',text:'Pour toute la table'});
 await post(gm,base+'/actions',{requestId:randomUUID(),action:'message',text:'Secret pour Alice',recipientCharacterId:aliceChar});
 await post(gm,base+'/actions',{requestId:randomUUID(),action:'message',text:'x',recipientCharacterId:randomUUID()},400);
 const note=randomUUID();
 await post(alice,base+'/notes',{requestId:note,text:'Je trahis le groupe'});
 await post(alice,base+'/notes',{requestId:note,text:'Je trahis le groupe'});
 await post(gm,base+'/notes',{requestId:randomUUID(),text:'Le MJ ne s’écrit pas'},404);
 await post(bob,base+'/notes',{requestId:randomUUID(),text:''},400);
 const forAlice=await labels(cid,alice),forBob=await labels(cid,bob),forGm=await labels(cid,gm,true);
 assert.ok(forAlice.includes('Révélation privée du MJ · pour Alice CI')&&forAlice.includes('Note privée au MJ'),'Alice lit son secret et sa note');
 assert.ok(!forBob.some(l=>/privée/i.test(l)),'Bob ne voit aucun message privé');
 assert.ok(forBob.includes('Révélation du MJ'),'Bob voit la révélation publique');
 assert.equal(forGm.filter(l=>l==='Note privée au MJ').length,1,'Le MJ lit la note, sans doublon');
 console.log('MESSAGES PRIVÉS OK — révélation à un joueur et note au MJ lues par eux seuls, aucun doublon, destinataire hors campagne refusé');
}finally{await app.close();if(ids.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-private-%@example.invalid'",[ids]);await pool.end();}
