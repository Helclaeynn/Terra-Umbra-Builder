// PNJ proposés par les joueurs (src/npc-proposals.ts) : création avec les règles
// des PNJ, plafond de palier, accès, refus avec raison, liaison à la page.
import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import Fastify from 'fastify';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {generateNpc}=await import('../dist/campaign-npc-generator.js');
const {registerNpcProposalRoutes}=await import('../dist/npc-proposals.js');
const published=new Set();
const app=Fastify(),ids=[];await registerNpcProposalRoutes(app,async id=>published.has(id));
async function account(role){const id=randomUUID(),token=randomBytes(32).toString('base64url');ids.push(id);await pool.query('INSERT INTO users(id,email,display_name,role) VALUES($1,$2,$3,$4)',[id,`ci-proposals-${id}@example.invalid`,'Proposals CI '+role,role]);await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);return {id,cookie:`__Host-tuc_session=${token}`};}
async function call(who,method,url,payload,status=200){const r=await app.inject({method,url,headers:who?{cookie:who.cookie}:{},...(payload===undefined?{}:{payload})});assert.equal(r.statusCode,status,`${method} ${url} ${r.body}`);return r.json();}
try{
 const player=await account('player'),other=await account('player'),admin=await account('admin');
 const character=(await pool.query("INSERT INTO characters(owner_id,name,data) VALUES($1,'Fiche CI','{}') RETURNING id",[player.id])).rows[0].id;
 await call(null,'GET','/api/npc-proposals/catalog',undefined,401);
 assert.equal((await call(player,'GET','/api/npc-proposals/catalog')).tiers.length,8);

 // Règles des PNJ et plafond de palier, vérifiés par le serveur.
 const elite={...generateNpc('elite','garde','ci'),name:'Contact CI'};
 await call(player,'POST','/api/npc-proposals',{npc:{...generateNpc('haute-elite','garde','ci'),name:'Trop fort'},maxTier:'elite'},400);
 await call(player,'POST','/api/npc-proposals',{npc:elite,maxTier:'legendaire'},400);
 await call(player,'POST','/api/npc-proposals',{npc:{...elite,attributes:{...elite.attributes,vigueur:99}},maxTier:'elite'},400);
 await call(player,'POST','/api/npc-proposals/generate',{tierId:'heroique',presetId:'garde',seed:'x',faction:'',maxTier:'elite'},400);
 assert.equal((await call(player,'POST','/api/npc-proposals/generate',{tierId:'elite',presetId:'garde',seed:'x',faction:'',maxTier:'elite'})).npcs.length,1);
 await call(other,'POST','/api/npc-proposals',{npc:elite,maxTier:'elite',characterId:character},404);

 const {proposal}=await call(player,'POST','/api/npc-proposals',{npc:elite,maxTier:'elite',characterId:character},201);
 assert.equal(proposal.status,'pending');assert.equal(proposal.title,'Contact CI');assert.equal(proposal.published,false);
 await call(other,'GET',`/api/npc-proposals/${proposal.proposalId}`,undefined,404);
 const mine=await call(player,'GET',`/api/npc-proposals/${proposal.proposalId}`);
 assert.equal(mine.npc,undefined,'Le joueur ne relit pas le JSON complet par cette route');
 assert.equal((await call(player,'GET','/api/npc-proposals/mine')).proposals.length,1);

 // Administrateurs seulement.
 for(const who of [player,other])await call(who,'GET','/api/admin/npc-proposals',undefined,403);
 const pending=await call(admin,'GET','/api/admin/npc-proposals');
 assert.ok(pending.proposals.some(p=>p.proposalId===proposal.proposalId&&p.characterName==='Fiche CI'));
 const preview=await call(admin,'POST',`/api/admin/npc-proposals/${proposal.proposalId}/preview`);
 assert.equal(preview.article.title,'Contact CI');assert.equal(preview.article.category,'Personnages');
 await call(player,'POST',`/api/admin/npc-proposals/${proposal.proposalId}/link`,{articleId:'wiki-contact-ci'},403);
 await call(admin,'POST',`/api/admin/npc-proposals/${proposal.proposalId}/link`,{articleId:'wiki-contact-ci'});
 let state=(await call(player,'GET',`/api/npc-proposals/${proposal.proposalId}`)).proposal;
 assert.equal(state.status,'approved');assert.equal(state.published,false);
 published.add('wiki-contact-ci');
 state=(await call(player,'GET',`/api/npc-proposals/${proposal.proposalId}`)).proposal;
 assert.equal(state.published,true);assert.equal(state.articleId,'wiki-contact-ci');
 await call(admin,'POST',`/api/admin/npc-proposals/${proposal.proposalId}/reject`,{note:'Trop tard'},409);

 // Refus : une raison est obligatoire, le joueur la voit.
 const second=(await call(player,'POST','/api/npc-proposals',{npc:{...elite,name:'Second CI'},maxTier:'elite'},201)).proposal;
 await call(admin,'POST',`/api/admin/npc-proposals/${second.proposalId}/reject`,{note:''},400);
 await call(admin,'POST',`/api/admin/npc-proposals/${second.proposalId}/reject`,{note:'Nom déjà pris'});
 state=(await call(player,'GET',`/api/npc-proposals/${second.proposalId}`)).proposal;
 assert.equal(state.status,'rejected');assert.equal(state.reviewNote,'Nom déjà pris');
 await call(admin,'POST',`/api/admin/npc-proposals/${second.proposalId}/link`,{articleId:'wiki-second-ci'},409);
 console.log('NPC PROPOSALS OK — règles et palier contrôlés, accès joueur/admin, validation liée à la page, refus motivé visible du joueur');
}finally{await app.close();if(ids.length){await pool.query('DELETE FROM npc_proposals WHERE proposed_by=ANY($1::uuid[])',[ids]);await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-proposals-%@example.invalid'",[ids]);}await pool.end();}
