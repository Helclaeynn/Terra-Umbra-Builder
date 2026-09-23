// Real SQL and session authorization, on disposable accounts only.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const mode=process.env.TUC_SHEET_SMOKE;
assert.ok(['ci','dev'].includes(mode),'Explicit test environment required');
const {pool}=await import(pathToFileURL(resolve('dist/db.js')).href);
const {hashSessionToken}=await import(pathToFileURL(resolve('dist/auth.js')).href);
let app;
let base=`http://127.0.0.1:${Number(process.env.PORT||3000)}`;
if(mode==='ci'){
  const {default:Fastify}=await import('fastify');
  const {registerCharacterRoutes}=await import(pathToFileURL(resolve('dist/characters.js')).href);
  app=Fastify();
  app.addHook('onSend',async(_request,reply)=>{reply.header('Cache-Control','no-store');});
  await registerCharacterRoutes(app);
  base=await app.listen({host:'127.0.0.1',port:0});
}
const ids = [];
let checks = 0;
async function account(role) {
  const suffix = randomBytes(12).toString('hex');
  const email = `ci-sheet-${suffix}@example.invalid`;
  const result = await pool.query('INSERT INTO users (email, display_name, role) VALUES ($1, $2, $3) RETURNING id', [email, 'CI accès MJ', role]);
  const id = result.rows[0].id;
  ids.push(id);
  const token = randomBytes(32).toString('base64url');
  await pool.query("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + interval '5 minutes')", [hashSessionToken(token), id]);
  return { id, email, cookie: `__Host-tuc_session=${token}` };
}
async function call(who, method, endpoint, payload, expected = 200) {
  const r = await fetch(base + endpoint, { method,
    headers: { ...(who ? { Cookie: who.cookie } : {}), ...(payload !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }), signal: AbortSignal.timeout(15000) });
  assert.equal(r.status, expected, `${method} ${endpoint}: unexpected HTTP status`);
  if (endpoint.startsWith('/api/characters')) assert.match(r.headers.get('cache-control') || '', /no-store/);
  checks++; return r.json();
}
try {
  const player=await account('player'), other=await account('player'), gm=await account('gm'), stranger=await account('gm'), admin=await account('admin');
  const {character}=await call(player,'POST','/api/characters',{name:'CI fiche autonome'},201);
  const path=`/api/characters/${character.id}`;
  await call(null,'GET',`${path}/sheet`,undefined,401);
  for(const who of [other,gm,stranger,admin])await call(who,'GET',`${path}/sheet`,undefined,404);
  assert.equal((await call(player,'GET',`${path}/sheet`)).canEdit,true);
  const full=await call(player,'GET','/api/characters');
  const compact=await call(player,'GET','/api/characters?summary=1');
  assert.ok(full.characters[0].data);
  assert.equal('data' in compact.characters[0],false,'List must not transfer character data or portraits');
  assert.equal(compact.characters[0].id,character.id);
  await call(null,'GET',`${path}/reader-search?q=CI`,undefined,401);
  await call(other,'GET',`${path}/reader-search?q=CI`,undefined,404);
  assert.equal((await call(player,'GET',`${path}/reader-search?q=C`)).accounts.length,0);
  assert.equal((await call(player,'GET',`${path}/reader-search?q=%25`)).accounts.length,0,'Wildcards are literal');
  const search=await call(player,'GET',`${path}/reader-search?q=ci%20acc%C3%A8s`);
  assert.ok(search.accounts.some(a=>a.id===gm.id));
  assert.ok(search.accounts.some(a=>a.id===stranger.id),'Homonyms remain separate accounts');
  assert.ok(!search.accounts.some(a=>[player.id,other.id].includes(a.id)));
  assert.ok(search.accounts.every(a=>!('email' in a)&&!('password_hash' in a)),'Search discloses no emails or secrets');
  await pool.query('UPDATE users SET is_active=false WHERE id=$1',[stranger.id]);
  assert.ok(!(await call(player,'GET',`${path}/reader-search?q=CI`)).accounts.some(a=>a.id===stranger.id));
  await call(player,'POST',`${path}/readers`,{readerId:stranger.id},400);
  await pool.query('UPDATE users SET is_active=true WHERE id=$1',[stranger.id]);
  await call(other,'POST',`${path}/readers`,{readerId:gm.id},400);
  await call(player,'POST',`${path}/readers`,{readerId:other.id},400);
  await call(player,'POST',`${path}/readers`,{readerId:player.id},400);
  await call(player,'POST',`${path}/readers`,{readerId:'bad-id'},400);
  assert.equal((await call(gm,'GET','/api/characters/shared')).characters.length,0);
  await call(player,'POST',`${path}/readers`,{readerId:gm.id});
  await call(player,'POST',`${path}/readers`,{readerId:gm.id});
  const readers=(await call(player,'GET',`${path}/readers`)).readers;
  assert.equal(readers.length,1,'Duplicate grant is idempotent');
  assert.equal('email' in readers[0],false);
  assert.equal((await call(player,'GET',`${path}/reader-search?q=CI`)).accounts.find(a=>a.id===gm.id).shared,true);
  assert.equal((await call(gm,'GET','/api/characters/shared')).characters[0].id,character.id);
  const shared=await call(gm,'GET',`${path}/sheet`);
  assert.equal(shared.canEdit,false);assert.equal(shared.character.name,character.name);
  for(const method of ['GET','PATCH','DELETE'])await call(gm,method,path,method==='GET'?undefined:{name:'Forbidden',version:1},404);
  await call(gm,'GET',`${path}/readers`,undefined,404);
  await call(gm,'GET',`${path}/revisions`,undefined,404);
  await call(gm,'POST',`${path}/revisions/1/restore`,{},404);
  await call(gm,'POST',`${path}/readers`,{readerId:stranger.id},400);
  await call(gm,'DELETE',`${path}/readers/${gm.id}`,undefined,404);
  await call(stranger,'GET',`${path}/sheet`,undefined,404);
  await call(player,'PATCH',path,{name:'CI mise à jour visible',version:1});
  assert.equal((await call(gm,'GET',`${path}/sheet`)).character.name,'CI mise à jour visible');
  await pool.query("UPDATE users SET role='player' WHERE id=$1",[gm.id]);
  await call(gm,'GET',`${path}/sheet`,undefined,404);
  assert.equal((await call(gm,'GET','/api/characters/shared')).characters.length,0);
  await pool.query("UPDATE users SET role='gm',is_active=false WHERE id=$1",[gm.id]);
  await call(gm,'GET',`${path}/sheet`,undefined,401);
  await pool.query('UPDATE users SET is_active=true WHERE id=$1',[gm.id]);
  await call(player,'DELETE',`${path}/readers/${gm.id}`);
  await call(gm,'GET',`${path}/sheet`,undefined,404);
  assert.equal((await call(gm,'GET','/api/characters/shared')).characters.length,0);
  await call(player,'POST',`${path}/readers`,{readerId:gm.id});
  await call(player,'DELETE',path,{version:2});
  await call(gm,'GET',`${path}/sheet`,undefined,404);
  await call(player,'GET',`${path}/sheet`,undefined,404);
  assert.equal((await call(gm,'GET','/api/characters/shared')).characters.length,0);
  console.log(`CHARACTER SHEET ACCESS OK — ${checks} HTTP checks, real SQL, compact list, owner isolation, explicit grant, no write access, live update, revocation, role downgrade, disabled account and archive`);
} finally {
  if(ids.length)await pool.query("DELETE FROM users WHERE id=ANY($1::uuid[]) AND email LIKE 'ci-sheet-%@example.invalid'",[ids]);
  if(app)await app.close();
  await pool.end();
  console.log('CHARACTER SHEET CLEANUP OK');
}
