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
async function snapshot(id){
 return (await pool.query('SELECT name,data,version,source_version,source_snapshot FROM characters WHERE id=$1',[id])).rows[0];
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
 const original=await snapshot(source);
 const revisions=(await call(player,'GET',`/api/characters/${source}/revisions`)).revisions;
 assert.deepEqual(revisions.map(r=>[r.revision,r.xpEarned,r.ptvEarned]),[[2,14,3],[1,0,0]]);
 // The player still chooses the starting source revision before a campaign copy exists.
 await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:1,sourceVersion:2});
 let admission=(await call(owner,'GET',base+'/admissions')).admissions[0];
 const fork=admission.characterId;
 assert.notEqual(fork,source);
 assert.equal(admission.status,'pending','The initial proposal still requires GM approval');
 assert.equal(admission.sourceVersion,1);
 assert.equal(admission.data.progression.xpEarned,0);
 assert.equal(admission.data.progression.ptvEarned,0);
 assert.deepEqual(await snapshot(source),original,'Selecting an older revision never rewrites the original');
 const firstCopy=await snapshot(fork);
 await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:2,sourceVersion:1},409);
 // Since rewards became GM-only, replacing an existing copy must NOT import
 // higher awards from the freely editable original (the old test expected 200).
 const increase=await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:2,sourceVersion:2},403);
 assert.equal(increase.error,'campaign_rewards_managed_by_gm');
 assert.equal(increase.field,'xp');
 assert.deepEqual(await snapshot(fork),firstCopy,'Denied replacement leaves data, version and baseline unchanged');
 assert.deepEqual((await call(owner,'GET',base+'/admissions')).admissions[0],admission,'Denied replacement leaves admission and messages unchanged');
 assert.equal((await pool.query('SELECT count(*)::int AS count FROM character_revisions WHERE character_id=$1',[fork])).rows[0].count,1);
 // A re-proposal with unchanged protected values is still permitted.
 await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:1,sourceVersion:2});
 admission=(await call(owner,'GET',base+'/admissions')).admissions[0];
 assert.equal(admission.characterId,fork,'Reproposing preserves the campaign sheet identity');
 assert.equal(admission.sourceVersion,1);
 assert.equal(admission.data.progression.xpEarned,0);
 assert.equal(admission.data.progression.ptvEarned,0);
 assert.equal((await snapshot(fork)).version,2);
 const session=(await pool.query('INSERT INTO campaign_sessions(campaign_id,title) VALUES($1,$2) RETURNING id',[campaign,'Récompense'])).rows[0].id;
 await pool.query('INSERT INTO campaign_session_rewards(session_id,character_id,character_name,xp,ptv) VALUES($1,$2,$3,2,0)',[session,fork,'Version originale']);
 const rewardedCopy=await snapshot(fork);
 const blocked=await call(player,'PUT',base+'/membership',{characterId:source,sourceRevision:1,sourceVersion:2},409);
 assert.equal(blocked.error,'campaign_progression_already_awarded');
 assert.deepEqual(await snapshot(fork),rewardedCopy);
 // A different campaign can start with the newer source version; protection
 // applies to that independent copy thereafter, including downward resets.
 const second=(await call(owner,'POST','/api/campaigns',{name:'Révision initiale avancée CI'},201)).campaign.id;
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'invited')",[second,player.id]);
 const otherBase=`/api/campaigns/${second}`;
 const advanced=(await call(player,'PUT',otherBase+'/membership',{characterId:source,sourceRevision:2,sourceVersion:2})).character;
 assert.notEqual(advanced.id,source);assert.notEqual(advanced.id,fork);
 const advancedCopy=await snapshot(advanced.id);
 assert.equal(advancedCopy.data.progression.xpEarned,14);
 assert.equal(advancedCopy.data.progression.ptvEarned,3);
 const decrease=await call(player,'PUT',otherBase+'/membership',{characterId:source,sourceRevision:1,sourceVersion:2},403);
 assert.equal(decrease.error,'campaign_rewards_managed_by_gm');assert.equal(decrease.field,'xp');
 assert.deepEqual(await snapshot(advanced.id),advancedCopy,'An old version cannot reset campaign rewards');
 assert.deepEqual(await snapshot(source),original,'Neither campaign modifies the original');
 console.log('CAMPAIGN SOURCE REVISION OK — initial version choice preserved; campaign reward increases and resets rejected atomically; unchanged re-proposal, stale conflicts, GM awards and original isolation verified');
}finally{
 await app.close();
 if(users.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-source-revision-%@example.invalid'",[users]);
 await pool.end();
}
