import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import Fastify from 'fastify';

assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {registerCharacterRoutes}=await import('../dist/characters.js');
const app=Fastify();
await registerCharacterRoutes(app);
const users=[];
async function account(role){
 const email=`ci-source-revision-${randomBytes(10).toString('hex')}@example.invalid`;
 const id=(await pool.query('INSERT INTO users(email,display_name,role) VALUES($1,$2,$3) RETURNING id',[email,role,role])).rows[0].id;
 users.push(id);
 const token=randomBytes(32).toString('base64url');
 await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);
 return {id,cookie:`__Host-tuc_session=${token}`};
}
async function call(who,method,url,payload,status=200){
 const response=await app.inject({method,url,headers:{cookie:who.cookie},...(payload===undefined?{}:{payload})});
 assert.equal(response.statusCode,status,`${method} ${url}: ${response.body}`);
 return response.json();
}
try{
 const owner=await account('gm'),player=await account('player');
 const campaign=(await call(owner,'POST','/api/campaigns',{name:'Révisions CI'},201)).campaign.id;
 const base=`/api/campaigns/${campaign}`;
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'invited')",[campaign,player.id]);
 const before={identity:{name:'Version originale'},progression:{xpEarned:0,ptvEarned:0}};
 const after={identity:{name:'Version originale'},progression:{xpEarned:14,ptvEarned:3}};
 const source=(await pool.query('INSERT INTO characters(owner_id,name,data,version) VALUES($1,$2,$3,2) RETURNING id',[player.id,'Version originale',after])).rows[0].id;
 for(const [revision,data] of [[1,before],[2,after]])await pool.query('INSERT INTO character_revisions(character_id,revision,name,data,reason,created_by) VALUES($1,$2,$3,$4,$5,$6)',[source,revision,'Version originale',data,'saved',player.id]);
 const revisions=(await call(player,'GET',`/api/characters/${source}/revisions`)).revisions;
 assert.deepEqual(revisions.map(r=>[r.revision,r.xpEarned,r.ptvEarned]),[[2,14,3],[1,0,0]]);
 await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:1,sourceVersion:2});
 let admission=(await call(owner,'GET',base+'/admissions')).admissions[0];
 const fork=admission.characterId;
 assert.notEqual(fork,source);
 assert.equal(admission.sourceVersion,1);
 assert.equal(admission.data.progression.xpEarned,0);
 assert.equal((await pool.query('SELECT data FROM characters WHERE id=$1',[source])).rows[0].data.progression.xpEarned,14);
 await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:2,sourceVersion:1},409);
 await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:2,sourceVersion:2});
 admission=(await call(owner,'GET',base+'/admissions')).admissions[0];
 assert.equal(admission.characterId,fork,'Reproposing preserves the campaign sheet identity');
 assert.equal(admission.sourceVersion,2);
 assert.equal(admission.data.progression.xpEarned,14);
 const saved=(await pool.query('SELECT version FROM characters WHERE id=$1',[fork])).rows[0];
 assert.equal(saved.version,2);
 const session=(await pool.query('INSERT INTO campaign_sessions(campaign_id,title) VALUES($1,$2) RETURNING id',[campaign,'Récompense'])).rows[0].id;
 await pool.query('INSERT INTO campaign_session_rewards(session_id,character_id,character_name,xp,ptv) VALUES($1,$2,$3,2,0)',[session,fork,'Version originale']);
 const blocked=await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:1,sourceVersion:2},409);
 assert.equal(blocked.error,'campaign_progression_already_awarded');
 assert.equal((await pool.query('SELECT version FROM characters WHERE id=$1',[fork])).rows[0].version,2);
 assert.equal((await pool.query('SELECT data FROM characters WHERE id=$1',[source])).rows[0].data.progression.xpEarned,14);
 console.log('CAMPAIGN SOURCE REVISION OK — older XP-free source, independent editable fork, stale source conflict, preserved awards');
}finally{
 await app.close();
 if(users.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-source-revision-%@example.invalid'",[users]);
 await pool.end();
}
