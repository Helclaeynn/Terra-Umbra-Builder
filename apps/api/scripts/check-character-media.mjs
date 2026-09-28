import assert from 'node:assert/strict';
import {randomBytes,randomUUID} from 'node:crypto';
import Fastify from 'fastify';
import {pool} from '../dist/db.js';
import {hashSessionToken} from '../dist/auth.js';
import {registerCharacterRoutes} from '../dist/characters.js';
import {decodeCharacterImage} from '../dist/character-media.js';
assert.equal(process.env.TUC_SHEET_SMOKE,'ci','Disposable CI database only');
const dbUrl=new URL(process.env.DATABASE_URL);assert.ok(['127.0.0.1','localhost','postgres'].includes(dbUrl.hostname));assert.ok(dbUrl.pathname.endsWith('_test'));
const app=Fastify();await registerCharacterRoutes(app);const users=[];
async function account(role){const id=randomUUID(),token=randomBytes(32).toString('base64url');users.push(id);await pool.query('INSERT INTO users(id,email,display_name,role) VALUES($1,$2,$3,$4)',[id,`ci-media-${id}@example.invalid`,'CI Galerie',role]);await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '5 minutes')",[hashSessionToken(token),id]);return {id,cookie:'__Host-tuc_session='+token};}
async function call(user,method,url,payload,status=200){const r=await app.inject({method,url,headers:{...(user?{cookie:user.cookie}:{}),...(payload?{'content-type':'application/json'}:{})},...(payload?{payload}:{})});assert.equal(r.statusCode,status,`${method} ${url}: ${r.body}`);return r;}
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';
assert.ok(decodeCharacterImage(png));assert.equal(decodeCharacterImage('data:image/svg+xml;base64,PHN2Zz4='),null);assert.equal(decodeCharacterImage('data:image/png;base64,'+'A'.repeat(270000)),null);
try{
 const player=await account('player'),other=await account('player'),gm=await account('gm'),outsider=await account('admin');
 let char=(await call(player,'POST','/api/characters',{name:'Galerie CI'},201)).json().character;
 const path=`/api/characters/${char.id}`;
 await call(null,'POST',path+'/images',{dataUrl:png},401);await call(gm,'POST',path+'/images',{dataUrl:png},404);await call(player,'POST',path+'/images',{dataUrl:'data:image/svg+xml;base64,PHN2Zz4='},400);
 const upload=(await call(player,'POST',path+'/images',{dataUrl:png},201)).json();
 assert.equal((await call(player,'POST',path+'/images',{dataUrl:png},201)).json().mediaId,upload.mediaId,'Duplicate bytes stored once');
 const imagePath='/api/character-media/'+upload.mediaId;
 await call(null,'GET',imagePath,null,401);await call(other,'GET',imagePath,null,404);await call(gm,'GET',imagePath,null,404);await call(outsider,'GET',imagePath,null,404);
 const pic=await call(player,'GET',imagePath);assert.match(pic.headers['cache-control'],/private.*no-store/);assert.equal(pic.headers['content-type'],'image/png');
 char.data.appearances={reality:[],truth:[{mediaId:upload.mediaId,label:'Vampire réel'}],primaryReality:'',primaryTruth:upload.mediaId};
 char=(await call(player,'PATCH',path,{data:char.data,version:char.version})).json().character;
 assert.equal(char.data.appearances.truth[0].label,'Vampire réel');assert.ok(!JSON.stringify(char.data).includes('iVBOR'));
 await call(player,'POST',path+'/readers',{readerId:gm.id});await call(gm,'GET',imagePath);
 assert.equal((await call(gm,'GET',path+'/sheet')).json().character.data.appearances.truth[0].mediaId,upload.mediaId);
 await call(player,'DELETE',path+'/readers/'+gm.id);await call(gm,'GET',imagePath,null,404);
 const campaign=randomUUID(),copy=randomUUID();
 await pool.query('INSERT INTO campaigns(id,owner_id,name) VALUES($1,$2,$3)',[campaign,gm.id,'CI images']);
 await pool.query('INSERT INTO characters(id,owner_id,name,data,campaign_id) VALUES($1,$2,$3,$4,$5)',[copy,player.id,'Copie',JSON.stringify(char.data),campaign]);
 await pool.query("INSERT INTO campaign_members(campaign_id,user_id,status,character_id) VALUES($1,$2,'accepted',$3)",[campaign,player.id,copy]);
 await call(gm,'GET',imagePath);await call(outsider,'GET',imagePath,null,404);
 await pool.query('UPDATE users SET role=$1 WHERE id=$2',['player',gm.id]);await call(gm,'GET',imagePath,null,404);
 await pool.query('UPDATE users SET role=$1 WHERE id=$2',['gm',gm.id]);await call(gm,'GET',imagePath);
 await pool.query('UPDATE campaigns SET archived_at=now() WHERE id=$1',[campaign]);await call(gm,'GET',imagePath,null,404);
 // Removing a gallery reference does not erase an image from its saved history.
 char.data.appearances.truth=[];char.data.appearances.primaryTruth='';
 char=(await call(player,'PATCH',path,{data:char.data,version:char.version})).json().character;
 await call(player,'GET',imagePath);assert.equal(Number((await pool.query('SELECT count(*) n FROM character_media WHERE owner_id=$1',[player.id])).rows[0].n),1);
 console.log('CHARACTER MEDIA DB OK — owned upload, raster limits, deduplication, saved metadata, private reads, explicit sharing/revocation, accepted campaign copy, role downgrade, archive, history retention and no unrelated admin access');
}finally{await app.close();for(const id of users.reverse())await pool.query('DELETE FROM users WHERE id=$1',[id]);await pool.end();}
