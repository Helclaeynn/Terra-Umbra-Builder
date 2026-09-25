import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

const root=fileURLToPath(new URL('../../../',import.meta.url));
const mediaDir=resolve(root,'compendium');
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=resolve(mediaDir,'data');
process.env.COMPENDIUM_MEDIA_DIR=mediaDir;
process.chdir(resolve(root,'apps/api'));
const {pool}=await import(pathToFileURL(resolve(root,'apps/api/dist/db.js')).href);
pool.query=async sql=>{
  if(/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql)))return {rows:[]};
  throw new Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(pathToFileURL(resolve(root,'apps/api/dist/compendium.js')).href);
const {default:Fastify}=await import(pathToFileURL(resolve(root,'apps/api/node_modules/fastify/fastify.js')).href);
const branding=JSON.parse(await readFile(resolve(mediaDir,'source/corporation-branding-v1.json'),'utf8')).articles;
const brands=JSON.parse(await readFile(resolve(mediaDir,'source/weapon-brand-links-v1.json'),'utf8')).equipmentById;
const restorations=JSON.parse(await readFile(resolve(mediaDir,'source/weapon-restoration-v1.json'),'utf8')).restored;
const byId=new Map((await getCompendiumQualityCorpus()).articles.map(article=>[article.id,article]));
const app=Fastify();await registerCompendiumRoutes(app);
let logos=0,charts=0;
for(const [id,entry] of Object.entries(branding)){
  const article=byId.get(id);assert.ok(article,id);
  if(entry.logo){assert.equal(article.brandLogo?.src,entry.logo,id);logos++}
  for(const chart of entry.charts??[]){
    const section=article.sections?.find(item=>item.id==='branches');
    assert.equal(section?.blocks.filter(block=>block.src===chart.src).length,1,id);
    const response=await app.inject({method:'GET',url:'/api/compendium/media/'+chart.src});
    assert.equal(response.statusCode,200,chart.src);assert.match(response.headers['content-type'],/svg/);charts++;
  }
}
for(const [id,slug] of Object.entries(brands)){
  const article=byId.get(id);assert.ok(article,id);
  assert.equal(article.brandCorporationId,slug==='space-force-union'?'realite-v9-corporation-space-force-union':`realite-v9-corporation-${slug}-corporation`,id);
  const corporation=branding[article.brandCorporationId];
  assert.equal(article.brandLogo?.src,corporation.logo,id);
  const response=await app.inject({method:'GET',url:'/api/compendium/media/'+corporation.logo});
  assert.equal(response.statusCode,200,`Logo missing from equipment page: ${id}`);
}
for(const item of restorations){
  const bytes=await readFile(resolve(mediaDir,'images/manual',item.asset));
  assert.ok(bytes.length>10000,item.asset);
  assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF',item.asset);
  assert.equal(bytes.subarray(8,12).toString('ascii'),'WEBP',item.asset);
}
await app.close();await pool.end();
console.log(`${restorations.length} quality WebPs, ${logos} logos, ${charts} organization charts, ${Object.keys(brands).length} linked equipment items verified.`);
