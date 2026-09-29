import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI environment only');
const database=new URL(process.env.DATABASE_URL||'');
assert.ok(['127.0.0.1','localhost'].includes(database.hostname)&&database.pathname==='/tuc_sheet_test','Never run this test on production');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {normalizeExtralBuild,extralTalentIds:ids}=await import('../dist/rules/truth/extral-build.js');
const {registerCharacterRoutes}=await import('../dist/characters.js');
const {default:Fastify}=await import('fastify');
const app=Fastify();await registerCharacterRoutes(app);const users=[];
async function user(){const suffix=randomBytes(10).toString('hex'),row=(await pool.query("INSERT INTO users(email,display_name,role) VALUES ($1,$2,'player') RETURNING id",['ci-extral-'+suffix+'@example.invalid','CI Extral'])).rows[0];users.push(row.id);const token=randomBytes(32).toString('base64url');await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),row.id]);return {id:row.id,cookie:'__Host-tuc_session='+token};}
async function call(who,method,url,payload,status=200){const r=await app.inject({method,url,headers:who?{cookie:who.cookie}:{},...(payload===undefined?{}:{payload})});assert.equal(r.statusCode,status,method+' '+url+' '+r.body);return r.json();}
try{
 const owner=await user(),other=await user();
 const created=(await call(owner,'POST','/api/characters',{name:'CI Extral sauvegarde'},201)).character;
 const url='/api/characters/'+created.id,data=structuredClone(created.data);
 data.progression={...data.progression,xpEarned:90,ptvEarned:8,renownAdjustment:2,cashBase:4000,cashTransactions:[{uid:'historic',amount:-750,label:'Avant révision',type:'purchase',at:'2026-09-27'}]};
 data.reality={...data.reality,equipment:[{uid:'owned',itemId:'actual-equipment',kind:'equipment',selectedPrice:750,cataloguePrice:750,priceConfirmed:true}],augmentations:[]};
 const extralBuild=normalizeExtralBuild({training:'Apprentissage <script>test</script>',trainingNetwork:'ctu',reserveUsed:true,repairUsed:true,hydrated:true,preparations:[{uid:'prep',name:'Culture',kind:'medical',effect:'Coagulant',resistance:'Médecine',duration:'scène',remaining:0}],patches:[{uid:'owned',state:'phased'},{uid:'missing',state:'phased'}],recombination:{graftUid:'bio',talentId:'extral-thermovision',architecture:'À valider en jeu'},projects:[{uid:'project',name:'Kit <img src=x onerror=alert(1)>',talentId:'extral-prototype-de-transition',effect:'Une fonction',materials:'Matériel réel',limits:'Pas de création gratuite',duration:'scène',pa:1}]});
 data.truth={...data.truth,nature:'extral',consciousness:'initie',choices:{species:'homo_superior',network:'ctu',hunterTradition:'aucune',extralBuild},truthTalents:[ids.repair,ids.reserve,ids.phase,'extral-standard-terrestre']};
 await call(owner,'PATCH',url,{version:1,data});let saved=(await call(owner,'GET',url)).character;
 assert.deepEqual(saved.data.truth,data.truth);assert.deepEqual(saved.data.reality,data.reality);assert.deepEqual(saved.data.progression,data.progression);
 await call(other,'GET',url,undefined,404);await call(null,'GET',url,undefined,401);await call(owner,'PATCH',url,{version:1,data},409);
 const changed=structuredClone(saved.data);changed.truth.choices.network='aucune';changed.truth.choices.extralBuild.projects[0].name='Autre';
 await call(owner,'PATCH',url,{version:saved.version,data:changed});saved=(await call(owner,'GET',url)).character;
 assert.deepEqual(saved.data.truth.truthTalents,data.truth.truthTalents,'Network edit keeps paid purchases');assert.equal(saved.data.truth.choices.extralBuild.repairUsed,true);assert.equal(saved.data.truth.choices.extralBuild.reserveUsed,true);assert.equal(saved.data.truth.choices.extralBuild.preparations[0].remaining,0);
 await call(owner,'POST',url+'/revisions/2/restore',{});saved=(await call(owner,'GET',url)).character;
 assert.deepEqual(saved.data.truth,data.truth);assert.deepEqual(saved.data.reality,data.reality);assert.deepEqual(saved.data.progression,data.progression);
 const forged=structuredClone(saved.data);forged.truth.choices.extralBuild.approved=true;forged.truth.choices.extralBuild.xpEarned=999;forged.truth.choices.extralBuild.role='admin';forged.truth.choices.extralBuild.recombination.approved=true;forged.truth.choices.extralBuild.patches[0].itemId='free-weapon';
 await call(owner,'PATCH',url,{version:saved.version,data:forged});const verified=(await call(owner,'GET',url)).character;
 assert.deepEqual(verified.data.truth.choices.extralBuild,extralBuild,'Forged permissions and item claims are stripped');assert.deepEqual(verified.data.reality,data.reality);assert.deepEqual(verified.data.progression,data.progression);
 assert.equal((await pool.query('SELECT role FROM users WHERE id=$1',[owner.id])).rows[0].role,'player');
 console.log('EXTRAL PERSISTENCE OK — real API/PostgreSQL save, reload, scenario counters, zero stock, version restoration, privacy, paid acquisitions, actual inventory unchanged and no reward/role promotion');
}finally{await app.close();if(users.length)await pool.query('DELETE FROM users WHERE id=ANY($1::uuid[])',[users]);await pool.end();}
