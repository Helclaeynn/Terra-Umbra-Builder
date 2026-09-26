import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=fileURLToPath(new URL('../../../',import.meta.url));
process.env.DATABASE_URL??='postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=resolve(root,'compendium/data');
process.env.COMPENDIUM_MEDIA_DIR=resolve(root,'compendium');
process.chdir(resolve(root,'apps/api'));
const {pool}=await import(pathToFileURL(resolve(root,'apps/api/dist/db.js')).href);
const visibility=process.env.PORTRAIT_TEST_VISIBILITY;
assert.ok(!visibility || ['mj','public'].includes(visibility));
let visibilityTarget;
pool.query=async sql=>{
  if (/FROM compendium_portrait_visibility/.test(String(sql)) && visibility) return {rows:[{...visibilityTarget,visibility,uploaded:false}]};
  if(/FROM sessions s/.test(String(sql)))return {rows:[{id:'00000000-0000-4000-8000-000000000001',email:'portrait-test@example.invalid',display_name:'Portrait test',role:'admin',is_active:true,created_at:new Date().toISOString(),last_login_at:null}]};
  if(/UPDATE sessions|FROM compendium_portrait_visibility|FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles|FROM compendium_deleted_articles/.test(String(sql)))return {rows:[]};
  throw Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(pathToFileURL(resolve(root,'apps/api/dist/compendium.js')).href);
const {default:Fastify}=await import(pathToFileURL(resolve(root,'apps/api/node_modules/fastify/fastify.js')).href);
const manifest=JSON.parse(await readFile(resolve(root,'compendium/source/portrait-refresh-chasseurs-20260926.json'),'utf8'));
assert.equal(manifest.articles.length,14);
assert.equal(manifest.items.length,35);
assert.equal(new Set(manifest.items.map(x=>x.id)).size,35);
assert.equal(new Set(manifest.items.map(x=>x.src)).size,35);
const target=manifest.items.find(x=>x.id==='personnages-verite-especes-tokala');
visibilityTarget={articleId:target.id,src:target.src};
if(visibility)target.visibility=visibility;
const corpus=await getCompendiumQualityCorpus();
if(visibility)assert.equal(JSON.stringify(corpus.publicArticles).includes(target.src),visibility==='public','Admin visibility override ignored');
const byId=new Map(corpus.articles.map(a=>[a.id,a]));
const app=Fastify();await registerCompendiumRoutes(app);
const publicText=JSON.stringify(corpus.publicArticles);
for(const item of manifest.items){
 const a=byId.get(item.id);assert.ok(a,item.id);
 assert.equal(a.image?.src,item.src,item.id);
 assert.equal(a.pnj?.portrait,item.src,item.id);
 if(a.illustration)assert.equal(a.illustration.src,item.src,item.id);
 assert.ok(!(a.gallery??[]).some(media=>/^images\/portraits\/lot-[1234]\//.test(media.src)),
   'Superseded portrait still visible in gallery: '+item.id);
 const bytes=await readFile(resolve(root,'compendium',item.src));
 assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');
 if(item.visibility==='mj')assert.ok(!publicText.includes(item.src),'MJ image leaked: '+item.id);
}
for(const item of new Map(manifest.items.map(x=>[x.src,x])).values()){
 const res=await app.inject({url:'/api/compendium/media/'+item.src});
 assert.equal(res.statusCode,item.visibility==='mj'?403:200,item.src);
 if(item.visibility==='public')assert.equal(res.headers['content-type'],'image/webp');
}
for(const entry of manifest.articles){
 const a=byId.get(entry.id);assert.equal(a.title,entry.name);
 assert.equal(a.pnj.completeness,'portrait_only');
 for(const k of ['nature','organisation','statut','age','origine'])assert.equal(a.pnj[k],'',entry.id+' '+k);
 assert.deepEqual(a.sections.find(s=>s.id==='biographie').blocks,[]);
 assert.deepEqual(a.sections.find(s=>s.id==='dossier-mj').blocks,[]);
 const profile=a.sections.find(s=>s.id==='profil-statistique');assert.equal(profile.audience,'mj');
 assert.ok(profile.blocks[0].rows.slice(1).every(row=>row[1]===''));
 assert.ok(corpus.navigationIds.includes(entry.id));
 const page=corpus.publicArticles.find(p=>p.id===entry.id);assert.ok(page);
 assert.ok(!page.sections.some(s=>s.audience==='mj'));
 const edit=await app.inject({url:'/api/compendium/editor/articles/'+entry.id,headers:{cookie:'__Host-tuc_session=portrait-test'}});
 assert.equal(edit.statusCode,200,entry.id+' editor '+edit.body);
 assert.ok(edit.json().baseHash,entry.id+' editable base missing');
}
await app.close();await pool.end();
console.log('35 WebP portraits, 35 main-image assignments, 14 editable empty NPCs and public/MJ media access verified.');
