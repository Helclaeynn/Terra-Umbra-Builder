import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import Fastify from 'fastify';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only');
const {pool}=await import('../dist/db.js');
const {hashSessionToken}=await import('../dist/auth.js');
const {registerCampaignRoutes}=await import('../dist/campaigns.js');
const {generateBestiary}=await import('../dist/campaign-bestiary-generator.js');
const app=Fastify(),ids=[];await registerCampaignRoutes(app);
async function account(role){const id=randomUUID(),token=randomBytes(32).toString('base64url');ids.push(id);await pool.query('INSERT INTO users(id,email,display_name,role) VALUES($1,$2,$3,$4)',[id,`ci-bestiary-${id}@example.invalid`,'Bestiary CI '+role,role]);await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);return {id,cookie:`__Host-tuc_session=${token}`};}
async function call(who,method,url,payload,status=200){const r=await app.inject({method,url,headers:who?{cookie:who.cookie}:{},...(payload===undefined?{}:{payload})});assert.equal(r.statusCode,status,`${method} ${url}: ${r.body}`);return r.json();}
try{
 const gm=await account('gm'),other=await account('gm'),player=await account('player');const cid=(await call(gm,'POST','/api/campaigns',{name:'Bestiary CI'},201)).campaign.id,base=`/api/campaigns/${cid}`,url=base+'/bestiary';
 for(const who of [other,player,null])for(const suffix of ['/catalog','',`/${randomUUID()}`])await call(who,'GET',url+suffix,undefined,who?404:401);
 const catalog=await call(gm,'GET',url+'/catalog');assert.equal(catalog.weapons.length,54);
 await call(player,'POST',url+'/generate',{seed:'a',count:1,difficultyId:'standard',archetypeId:'tireur',weaponGroup:'Pistolet léger'},404);
 const generated=(await call(gm,'POST',url+'/generate',{seed:'a',count:2,difficultyId:'standard',archetypeId:'tireur',weaponGroup:'Fusil d’assaut'})).creatures;assert.equal(generated.length,2);assert.notEqual(generated[0].name,generated[1].name);assert.equal((await call(gm,'GET',url)).creatures.length,0);
 const id=randomUUID(),row={id,data:{...generated[0],name:'Contact MJ',hook:'SECRET MJ'}};await call(gm,'POST',url,{creatures:[row]},201);await call(gm,'POST',url,{creatures:[row]},201);const list=await call(gm,'GET',url);assert.equal(list.creatures.length,1);assert.ok(!JSON.stringify(list).includes('SECRET MJ'));assert.equal((await call(gm,'GET',url+'/'+id)).creature.data.hook,'SECRET MJ');
 await call(gm,'POST',url,{creatures:[{id,data:{...row.data,name:'Conflit'}}]},409);await call(gm,'PATCH',url+'/'+id,{data:{...row.data,name:'Mise à jour'},version:1,archived:false});await call(gm,'PATCH',url+'/'+id,{data:row.data,version:1,archived:false},409);
 const reference={creatureId:id,articleId:'campaign-creature:'+id,title:row.data.name,category:'Bestiaire de campagne',quantity:1,notes:''};const session={title:'Rencontre',preparation:'',scenes:[{id:'scene',title:'Face à face',notes:'',done:false,references:[reference]}],playedOn:null,status:'planned',report:'',published:false,requestId:randomUUID()};await call(gm,'POST',base+'/sessions',session,201);const unknown=randomUUID();await call(gm,'POST',base+'/sessions',{...session,requestId:randomUUID(),scenes:[{...session.scenes[0],references:[{...reference,creatureId:unknown,articleId:'campaign-creature:'+unknown}]}]},400);
 await call(gm,'PATCH',url+'/'+id,{data:row.data,version:2,archived:true});assert.equal((await call(gm,'GET',url+'?archived=true')).creatures.length,1);await pool.query('UPDATE campaigns SET archived_at=now() WHERE id=$1',[cid]);await call(gm,'POST',url,{creatures:[{id:randomUUID(),data:row.data}]},404);
 console.log('CAMPAIGN BESTIARY DB OK — MJ privacy, exact weapons, atomic persistence, versions, scene validation and archives');
}finally{await app.close();if(ids.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-bestiary-%@example.invalid'",[ids]);await pool.end();}
