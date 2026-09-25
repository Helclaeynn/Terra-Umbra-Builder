import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const root=fileURLToPath(new URL('../../../',import.meta.url));
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=resolve(root,'compendium/data');
process.env.COMPENDIUM_MEDIA_DIR=resolve(root,'compendium');
process.chdir(resolve(root,'apps/api'));
const {pool}=await import(pathToFileURL(resolve(root,'apps/api/dist/db.js')).href);
pool.query=async(sql)=>{
  if (/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql))) return {rows:[]};
  throw new Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(pathToFileURL(resolve(root,'apps/api/dist/compendium.js')).href);
const {default:Fastify}=await import(pathToFileURL(resolve(root,'apps/api/node_modules/fastify/fastify.js')).href);
const manifest=JSON.parse(await readFile(resolve(root,'compendium/source/equipment-illustrations-20260923.json'),'utf8'));
assert.ok(manifest.items.length>0 && manifest.items.length<=241);
assert.equal(new Set(manifest.items.map(item=>item.id)).size,manifest.items.length);
const corpus=await getCompendiumQualityCorpus();
const app=Fastify();await registerCompendiumRoutes(app);
for(const item of manifest.items){
  const article=corpus.articles.find(a=>a.id===item.id);
  assert.ok(article,item.id);
  const media=article.illustration??article.image;
  assert.equal(media?.src,item.src,item.id);
  assert.ok(!/placeholder|illustration à venir/i.test(media.alt+' '+media.caption),item.id);
  const res=await app.inject({method:'GET',url:'/api/compendium/media/'+item.src});
  assert.equal(res.statusCode,200,item.id);
  assert.match(res.headers['content-type'],/image\/webp/,item.id);
  assert.equal(createHash('sha256').update(res.rawPayload).digest('hex'),item.sha256,item.id);
}
await app.close();await pool.end();
console.log('OK: '+manifest.items.length+' equipment illustrations resolved and served with exact hashes.');
