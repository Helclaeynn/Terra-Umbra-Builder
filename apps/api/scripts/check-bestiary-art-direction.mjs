import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const root=fileURLToPath(new URL('../../../', import.meta.url));
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=resolve(root,'compendium/data');
process.env.COMPENDIUM_MEDIA_DIR=resolve(root,'compendium');
process.chdir(resolve(root,'apps/api'));
const {pool}=await import(pathToFileURL(resolve(root,'apps/api/dist/db.js')));
pool.query=async sql=>{
  if(/FROM compendium_custom_articles|FROM compendium_article_edits|FROM compendium_deleted_articles|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql)))return {rows:[]};
  throw new Error('Unexpected database query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(pathToFileURL(resolve(root,'apps/api/dist/compendium.js')));
const {default:Fastify}=await import('fastify');
const manifest=JSON.parse(await readFile(resolve(root,'compendium/source/bestiary-art-direction-v2.json'),'utf8'));
assert.equal(manifest.items.length,277);
assert.equal(new Set(manifest.items.map(x=>x.id)).size,manifest.items.length);
const app=Fastify();
try {
  await registerCompendiumRoutes(app);
  const {articles}=await getCompendiumQualityCorpus();
  const bestiary=articles.filter(a=>a.category==='Bestiaire');
  assert.equal(bestiary.length,281);
  for(const article of bestiary){
    const media=article.illustration??article.image;
    assert.ok(media?.src,article.id+' illustration manquante');
    const response=await app.inject({method:'GET',url:'/api/compendium/media/'+media.src});
    assert.equal(response.statusCode,200,article.id);
  }
  for(const item of manifest.items){
    const article=articles.find(a=>a.id===item.id);
    assert.equal(article?.category,'Bestiaire',item.id);
    const media=article.illustration??article.image;
    assert.equal(media?.src,item.src,item.id);
    assert.equal(media?.caption,item.caption,item.id);
    assert.equal(media?.alt,item.alt,item.id);
    const response=await app.inject({method:'GET',url:'/api/compendium/media/'+item.src});
    assert.equal(response.statusCode,200,item.id);
    assert.match(response.headers['content-type'],/image\/webp/);
    assert.equal(createHash('sha256').update(response.rawPayload).digest('hex'),item.sha256,item.id);
  }
  console.log(`OK: ${manifest.items.length} illustrations, légendes et fichiers WebP vérifiés via le corpus et HTTP.`);
}finally{await app.close();await pool.end();}
