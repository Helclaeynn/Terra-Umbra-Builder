import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../../',import.meta.url)).replace(/\/$/,'');
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=root+'/compendium/data';
process.env.COMPENDIUM_MEDIA_DIR=root+'/compendium';
process.chdir(root+'/apps/api');
const {pool}=await import(root+'/apps/api/dist/db.js');
pool.query=async sql=>{
  if(/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles|FROM compendium_deleted_articles/.test(String(sql))) return {rows:[]};
  throw new Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(root+'/apps/api/dist/compendium.js');
const {default:Fastify}=await import(root+'/apps/api/node_modules/fastify/fastify.js');
const sourceDir=root+'/compendium/source';
const lots=(await readdir(sourceDir)).filter(name=>/^truth-catalog-illustrations-lot-\d{2}\.json$/.test(name)).sort();
assert.ok(lots.length>0,'No truth-catalog illustration lots');
const manifests=await Promise.all(lots.map(async name=>JSON.parse(await readFile(sourceDir+'/'+name,'utf8'))));
const items=manifests.flatMap((manifest,index)=>{
  assert.equal(manifest.lot,index+1);
  assert.ok(manifest.items.length>0 && manifest.items.length<=50,`Lot ${manifest.lot} exceeds 50 images`);
  return manifest.items;
});
assert.equal(new Set(items.map(x=>x.id)).size,items.length);
assert.equal(new Set(items.map(x=>x.src)).size,items.length);
const corpus=await getCompendiumQualityCorpus();
const byId=new Map(corpus.articles.map(article=>[article.id,article]));
const app=Fastify();await registerCompendiumRoutes(app);
for(const item of items){
  const article=byId.get(item.id);
  assert.ok(article,item.id);
  assert.equal(article.dataset,'verite-catalogue',item.id);
  assert.equal(article.illustration?.src,item.src,item.id);
  assert.ok(!/placeholder|illustration à venir/i.test(String(article.illustration?.caption??'')),item.id);
  const body=await readFile(root+'/compendium/'+item.src);
  assert.equal(createHash('sha256').update(body).digest('hex'),item.sha256,item.id);
  const response=await app.inject({method:'GET',url:'/api/compendium/media/'+item.src});
  assert.equal(response.statusCode,200,item.id);
  assert.match(response.headers['content-type'],/image\/webp/,item.id);
  assert.deepEqual(response.rawPayload,body,item.id);
}
await app.close();await pool.end();
console.log(`OK: ${items.length} truth-catalog illustrations across ${lots.length} lots.`);
