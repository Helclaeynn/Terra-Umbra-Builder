import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import Fastify from 'fastify';
import {blankPlayState,playProfile,rollD10} from '../dist/rules/play-state.js';
assert.ok(process.env.TUC_PGLITE||process.env.TUC_SHEET_SMOKE==='ci','Isolated CI database required');
process.env.DATABASE_URL ||= 'postgres://test:test@localhost/tuc_play_test';
const {pool}=await import('../dist/db.js');
let embedded;
if(process.env.TUC_PGLITE){
 const {PGlite}=await import(process.env.TUC_PGLITE);embedded=new PGlite();
 pool.query=async(text,values)=>{const r=await embedded.query(text,values);return {...r,rowCount:r.rows.length||r.affectedRows||0};};
 pool.connect=async()=>({query:pool.query,release(){}});
 for(const name of (await readdir('../../infrastructure/migrations')).filter(n=>n.endsWith('.sql')).sort())await embedded.exec((await readFile('../../infrastructure/migrations/'+name,'utf8')).replace(/CREATE EXTENSION IF NOT EXISTS pgcrypto;/g,''));
 await embedded.exec(await readFile('../../infrastructure/migrations/20261003_character_play.sql','utf8'));
}
const {hashSessionToken}=await import('../dist/auth.js');
const {registerCharacterPlayRoutes}=await import('../dist/character-play.js');
const {registerCampaignRewardRoutes}=await import('../dist/campaign-rewards.js');
const {registerCharacterMediaRoutes}=await import('../dist/character-media.js');
const {blankCharacterData}=await import('../dist/character-data.js');
const {getRealityRules}=await import('../dist/rules/reality.js');
const {builderPurchaseAllowed}=await import('../dist/rules/builder-equipment-policy.js');
const app=Fastify();await registerCharacterPlayRoutes(app);await registerCampaignRewardRoutes(app);await registerCharacterMediaRoutes(app);
const users=[];
async function account(role){const id=randomUUID(),token=randomBytes(32).toString('base64url');await pool.query('INSERT INTO users(id,email,display_name,role) VALUES($1,$2,$3,$4)',[id,`${id}@example.invalid`,'CI Play',role]);users.push(id);await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '1 hour')",[hashSessionToken(token),id]);return {id,cookie:`__Host-tuc_session=${token}`};}
async function call(user,method,url,payload,status=200){const r=await app.inject({method,url,headers:user?{cookie:user.cookie}:{},...(payload===undefined?{}:{payload})});assert.equal(r.statusCode,status,r.body);return r.json();}
try{
 const player=await account('player'),other=await account('player'),manager=await account('gm'),stranger=await account('gm');
 const data=blankCharacterData('CI Play');data.attributes.vigueur=4;data.skills.athletisme={style:6,free:0,edge:0};data.skills.constitution={style:4,free:0,edge:0};data.creation.sphere='';
 const state=blankPlayState();assert.equal(playProfile(data,state).skills.find(s=>s.id==='athletisme').total,10);
 state.bonuses=[{id:'power',label:'Pouvoir',skill:'athletisme',amount:3,truth:true,enabled:true}];
 for(const revelation of ['v','sr','r']){state.revelation=revelation;assert.equal(playProfile(data,state).skills.find(s=>s.id==='athletisme').total,revelation==='r'?13:10);}
 state.hp=12;assert.equal(playProfile(data,state).health,'Indemne');state.hp=11;assert.equal(playProfile(data,state).health,'Légèrement blessé');state.hp=3;assert.equal(playProfile(data,state).health,'Gravement blessé');state.hp=0;assert.equal(playProfile(data,state).health,'Agonisant');state.stabilized=true;assert.equal(playProfile(data,state).health,'Stabilisé');state.stabilized=false;
 state.hp=6;assert.equal(playProfile(data,state).stress,1);state.hp=3;assert.equal(playProfile(data,state).stress,2);state.hp=12;state.stress=2;assert.equal(playProfile(data,state).stress,2);
 for(const stress of [0,1,2])for(let first=1;first<=10;first++){let count=0;const r=rollD10(stress,()=>++count===1?first:10);assert.equal(r.narrativeFailure,first<=stress+1);assert.equal(count,(first===10||stress===1&&first===9)?2:1);assert.ok(r.dice.length<=2);}
 const campaign=randomUUID(),character=randomUUID();await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,manager.id,'CI Play']);await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4,$5)',[character,player.id,'CI Play',JSON.stringify(data),campaign]);
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id,admission_status,approved_basis) SELECT $1,$2,'accepted',id,'approved',campaign_character_basis(data) FROM characters WHERE id=$3",[campaign,player.id,character]);await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status) VALUES($1,$2,'accepted')",[campaign,other.id]);
 const path=`/api/characters/${character}/play`;
 await call(null,'GET',path,undefined,401);await call(other,'GET',path,undefined,404);await call(stranger,'GET',path,undefined,404);assert.equal((await call(manager,'GET',path)).canEdit,false);
 let live=await call(player,'GET',path);const saved=await call(player,'POST',path,{requestId:randomUUID(),version:0,action:'save',state:{...live.state,share:true}});assert.equal(saved.version,1);
 await call(manager,'POST',path,{requestId:randomUUID(),version:1,action:'damage',amount:1},404);
 const damage={requestId:randomUUID(),version:1,action:'damage',amount:6};const damaged=await call(player,'POST',path,damage);assert.equal(damaged.profile.hp,6);assert.equal(damaged.profile.stress,1);assert.equal((await call(player,'POST',path,damage)).alreadyApplied,true);await call(player,'POST',path,{...damage,requestId:randomUUID()},409);
 const peer=await call(other,'GET',`/api/campaigns/${campaign}/play`);assert.equal(peer.characters[0].health,'Blessé');for(const key of ['hp','pvMax','pa','paPerRound','initiative','round','stress','revelation','data'])assert.equal(key in peer.characters[0],false);assert.equal(peer.events.length,0);
 const publicMedia=randomUUID(),privateMedia=randomUUID();
 for(const id of [publicMedia,privateMedia])await pool.query('INSERT INTO character_media(id,owner_id,sha256,mime_type,content) VALUES($1,$2,$3,$4,$5)',[id,player.id,id.padEnd(64,'0'),'image/png',Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0])]);
 data.appearances={reality:[{mediaId:publicMedia,label:'Public'}],truth:[{mediaId:privateMedia,label:'Secret'}],primaryReality:publicMedia,primaryTruth:privateMedia};
 await pool.query('UPDATE characters SET data=$2::jsonb WHERE id=$1',[character,JSON.stringify(data)]);
 assert.equal((await app.inject({url:`/api/character-media/${publicMedia}`,headers:{cookie:other.cookie}})).statusCode,200);
 assert.equal((await app.inject({url:`/api/character-media/${privateMedia}`,headers:{cookie:other.cookie}})).statusCode,404);
 const mj=await call(manager,'GET',`/api/campaigns/${campaign}/play`);assert.equal(mj.characters[0].hp,6);assert.equal(mj.events.length,2);
 const rested=await call(player,'POST',path,{requestId:randomUUID(),version:2,action:'rest',days:3,prolonged:false});assert.equal(rested.profile.hp,12);assert.equal(rested.event.payload.recovered,6);
 const roll=await call(player,'POST',path,{requestId:randomUUID(),version:3,action:'roll',skill:'athletisme'});assert.equal(roll.event.payload.modifier,10);assert.equal(roll.event.payload.total,10+roll.event.payload.sum);
 // Initiative and the PA budget persist throughout a combat, including reloads and injury.
 await call(player,'POST',path,{requestId:randomUUID(),version:4,action:'round'},400);
 let combat=await call(player,'POST',path,{requestId:randomUUID(),version:4,action:'initiative'});
 const initiative=combat.state.initiative,paPerRound=combat.state.paPerRound;
 assert.equal(initiative,combat.event.payload.total);assert.equal(combat.state.round,1);assert.ok(paPerRound>=1&&paPerRound<=3);
 combat=await call(player,'POST',path,{requestId:randomUUID(),version:combat.version,action:'save',state:{...combat.state,pa:0,stress:2,initiative:999,paPerRound:5}});
 assert.equal(combat.state.initiative,initiative);assert.equal(combat.state.paPerRound,paPerRound);
 const next={requestId:randomUUID(),version:combat.version,action:'round'};
 combat=await call(player,'POST',path,next);assert.equal(combat.state.round,2);assert.equal(combat.state.pa,paPerRound);assert.equal(combat.state.initiative,initiative);assert.equal(combat.event.payload.dice,undefined);
 assert.equal((await call(player,'POST',path,next)).alreadyApplied,true);
 const reloaded=await call(manager,'GET',path);assert.equal(reloaded.state.initiative,initiative);assert.equal(reloaded.state.paPerRound,paPerRound);
 const group=await call(manager,'GET',`/api/campaigns/${campaign}/play`);assert.equal(group.characters[0].initiative,initiative);
 combat=await call(player,'POST',path,{requestId:randomUUID(),version:combat.version,action:'damage',amount:12});
 combat=await call(player,'POST',path,{requestId:randomUUID(),version:combat.version,action:'round'});assert.equal(combat.state.pa,1);assert.equal(combat.state.paPerRound,paPerRound);
 combat=await call(player,'POST',path,{requestId:randomUUID(),version:combat.version,action:'heal',amount:12});
 combat=await call(player,'POST',path,{requestId:randomUUID(),version:combat.version,action:'round'});assert.equal(combat.state.pa,paPerRound);
 combat=await call(player,'POST',path,{requestId:randomUUID(),version:combat.version,action:'initiative'});assert.equal(combat.state.round,1);assert.equal(combat.state.initiative,combat.event.payload.total);
 const item=getRealityRules().equipment.find(i=>builderPurchaseAllowed(i)&&i.price>0&&!['monthly','annual','per_use'].includes(i.recurring));assert.ok(item);
 const gift={requestId:randomUUID(),reason:'Trouvaille',rewards:[{characterId:character,version:1,xp:0,ptv:0,money:0,renownDelta:0,corruptionDelta:0,corruptionSource:'',equipment:[{itemId:item.id,quantity:2}]}]};
 await call(other,'POST',`/api/campaigns/${campaign}/rewards`,gift,404);await call(manager,'POST',`/api/campaigns/${campaign}/rewards`,gift);assert.equal((await call(manager,'POST',`/api/campaigns/${campaign}/rewards`,gift)).alreadyApplied,true);
 const inventory=(await pool.query('SELECT data,version FROM characters WHERE id=$1',[character])).rows[0];assert.equal(inventory.version,2);assert.equal(inventory.data.reality.equipment.length,2);assert.ok(inventory.data.reality.equipment.every(i=>i.selectedPrice===0&&i.acquiredInCampaign));assert.equal((await call(manager,'GET',`/api/campaigns/${campaign}/rewards`)).rewards[0].equipment[0].quantity,2);
 await pool.query('DELETE FROM campaign_members WHERE campaign_id=$1 AND user_id=$2',[campaign,other.id]);await call(other,'GET',`/api/campaigns/${campaign}/play`,undefined,404);
 console.log('PLAY OK — dice, truth gating, injuries, recovery, server rolls, conflicts, replay safety, private projections, revoked access, migration replay and equipment-only rewards.');
}finally{await app.close();await pool.query('DELETE FROM users WHERE id=ANY($1::uuid[])',[users]);if(embedded)await embedded.close();else await pool.end();}
