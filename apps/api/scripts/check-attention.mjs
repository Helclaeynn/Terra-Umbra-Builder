// « Ce qui t'attend » (src/attention.ts) : chaque compte ne voit que ce qui le concerne,
// et les compteurs d'administration ne sont donnés qu'aux administrateurs.
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import Fastify from 'fastify';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {registerAttentionRoutes}=await import('../dist/attention.js');
const app=Fastify(),ids=[];await registerAttentionRoutes(app);
async function account(role){const id=randomUUID(),token=randomBytes(32).toString('base64url');ids.push(id);await pool.query('INSERT INTO users(id,email,display_name,role) VALUES($1,$2,$3,$4)',[id,`ci-attention-${id}@example.invalid`,'Attention CI '+role,role]);await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);return {id,cookie:`__Host-tuc_session=${token}`};}
async function get(who,status=200){const r=await app.inject({method:'GET',url:'/api/attention',headers:who?{cookie:who.cookie}:{}});assert.equal(r.statusCode,status,r.body);return r.json();}
const counts=r=>Object.fromEntries(r.items.map(i=>[i.key,i.count]));
try{
 await get(null,401);
 const gm=await account('gm'),player=await account('player'),admin=await account('admin');
 const cid=(await pool.query("INSERT INTO campaigns(owner_id,name) VALUES($1,'Attention CI') RETURNING id",[gm.id])).rows[0].id;
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'invited')",[cid,player.id]);
 let p=counts(await get(player));
 assert.equal(p.invitations,1);assert.equal(p['gm-requests'],undefined,'Pas de compteur admin pour un joueur');assert.equal(p.admissions,undefined);
 await pool.query("UPDATE campaign_members SET status='accepted',admission_status='pending' WHERE campaign_id=$1 AND user_id=$2",[cid,player.id]);
 assert.equal(counts(await get(gm)).admissions,1,'Le MJ voit le personnage à accepter');
 assert.equal(counts(await get(player)).invitations,0);
 await pool.query("UPDATE campaign_members SET admission_status='changes_requested' WHERE campaign_id=$1",[cid]);
 assert.equal(counts(await get(player))['admission-changes'],1,'Le joueur voit le personnage à corriger');
 const a=await get(admin);assert.ok(['gm-requests','npc-proposals','content-review'].every(k=>k in counts(a)),'Compteurs admin');
 assert.equal(a.total,a.items.reduce((n,i)=>n+i.count,0));
 console.log('ATTENTION OK — invitations, personnages à corriger ou à accepter, compteurs admin réservés aux administrateurs');
}finally{await app.close();if(ids.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-attention-%@example.invalid'",[ids]);await pool.end();}
