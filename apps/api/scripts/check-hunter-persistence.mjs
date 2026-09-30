import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI only');const db=new URL(process.env.DATABASE_URL||'');assert.ok(['127.0.0.1','localhost'].includes(db.hostname)&&db.pathname==='/tuc_sheet_test');
const {pool}=await import('../dist/db.js'),{hashSessionToken}=await import('../dist/auth.js'),{registerCharacterRoutes}=await import('../dist/characters.js'),{default:Fastify}=await import('fastify');const app=Fastify();await registerCharacterRoutes(app);let userId;
try{
 const suffix=randomBytes(10).toString('hex'),token=randomBytes(32).toString('base64url');userId=(await pool.query("INSERT INTO users(email,display_name,role) VALUES($1,$2,'player') RETURNING id",['ci-hunter-'+suffix+'@example.invalid','CI Hunter'])).rows[0].id;
 await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),userId]);
 const call=async(method,url,payload,status=200)=>{const r=await app.inject({method,url,headers:{cookie:'__Host-tuc_session='+token},...(payload?{payload}:{})});assert.equal(r.statusCode,status,r.body);return r.json();};
 const created=(await call('POST','/api/characters',{name:'CI Hunter'},201)).character,url='/api/characters/'+created.id,data=structuredClone(created.data);
 const {terraUmbraTruthRules:pkg}=await import('../dist/rules/truth/rules.js');const id=pkg.catalogs.humain.find(t=>t.name==='Pacte du Djinn').id;
 const build={doctrines:['nizarite','xenoshield'],records:{[id]:{reference:'Existing NPC',agreement:'Consent',profile:'Real property',limits:'Own PA'}}};
 data.truth={...data.truth,nature:'vampire',consciousness:'initie',choices:{blood:'sang_primal',court:'alghul_almalakiu',hunterTradition:'aucune',hunterBuild:build},truthTalents:[id]};
 const before=structuredClone(data.progression);await call('PATCH',url,{version:1,data});let saved=(await call('GET',url)).character;assert.deepEqual(saved.data.truth,data.truth);assert.deepEqual(saved.data.progression,before);
 const changed=structuredClone(saved.data);changed.truth.choices.hunterBuild.doctrines=[];changed.truth.consciousness='profane';changed.truth.choices.hunterBuild.ptvEarned=999;changed.truth.choices.hunterBuild.records[id].pa=999;await call('PATCH',url,{version:saved.version,data:changed});saved=(await call('GET',url)).character;assert.deepEqual(saved.data.truth.truthTalents,[id]);assert.deepEqual(saved.data.truth.choices.hunterBuild.records,build.records);assert.equal(saved.data.truth.choices.hunterBuild.ptvEarned,undefined);assert.deepEqual(saved.data.progression,before);
 await call('POST',url+'/revisions/2/restore',{});saved=(await call('GET',url)).character;assert.deepEqual(saved.data.truth,data.truth);assert.deepEqual(saved.data.progression,before);
 console.log('HUNTER PERSISTENCE OK — real private API/PostgreSQL, explicit doctrines and references round-trip, paid talents retained, restore and no forged rewards');
}finally{await app.close();if(userId)await pool.query('DELETE FROM users WHERE id=$1',[userId]);await pool.end();}
