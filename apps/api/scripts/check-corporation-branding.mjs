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
  if(/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles|FROM compendium_deleted_articles/.test(String(sql)))return {rows:[]};
  throw new Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(pathToFileURL(resolve(root,'apps/api/dist/compendium.js')).href);
const {default:Fastify}=await import(pathToFileURL(resolve(root,'apps/api/node_modules/fastify/fastify.js')).href);
const branding=JSON.parse(await readFile(resolve(mediaDir,'source/corporation-branding-v1.json'),'utf8')).articles;
const brands=JSON.parse(await readFile(resolve(mediaDir,'source/weapon-brand-links-v1.json'),'utf8')).equipmentById;
const restorations=JSON.parse(await readFile(resolve(mediaDir,'source/weapon-restoration-v1.json'),'utf8')).restored;
const byId=new Map((await getCompendiumQualityCorpus()).articles.map(article=>[article.id,article]));
const app=Fastify();await registerCompendiumRoutes(app);
const equipment=[...byId.values()].filter(article=>article.dataset==='equipement'||article.dataset==='verite-catalogue');
const owl=equipment.filter(article=>article.manufacturer==='Owl');
assert.ok(owl.length>=32,'OWL equipment must retain its source manufacturer');
for(const article of owl)assert.equal(article.brandLogo?.src,'images/corporations/owl-logo.webp',article.id);
const sehdia=equipment.filter(article=>article.manufacturer==='Raven-Sehdia');
assert.equal(sehdia.length,3);
for(const article of sehdia){assert.deepEqual(article.brandMarks?.map(mark=>mark.src),['images/corporations/raven-industries-logo.webp','images/corporations/sehdia-logo.webp'],article.id)}
const ravenSunways=equipment.filter(article=>article.manufacturer==='Raven-Sunways');
assert.equal(ravenSunways.length,1);
assert.deepEqual(ravenSunways[0].brandMarks?.map(mark=>mark.src),['images/corporations/raven-industries-logo.webp','images/corporations/sunways-logo.webp']);
for(const article of [...sehdia,...ravenSunways])for(const mark of article.brandMarks){
  assert.equal((await app.inject({method:'GET',url:'/api/compendium/media/'+mark.src})).statusCode,200,article.id);
  if(mark.corporationId)assert.ok(byId.has(mark.corporationId),mark.corporationId);
}
const uncovered=equipment.filter(article=>article.manufacturer&&!article.brandLogo);
assert.ok(!uncovered.some(article=>article.manufacturer==='Owl'));
const korean=['equipement-313-eolgul-e','equipement-311-jotkka','equipement-304-bi','equipement-307-bibal','equipement-288-sal-in','equipement-292-song-gos','equipement-278-jagi','equipement-319-soldier-armure-legere-nord-coreenne','equipement-320-heavy-soldier-armure-lourde-nord-coreenne'];
for(const id of korean){
  const src=byId.get(id)?.brandLogo?.src;
  assert.equal(src,'images/corporations/north-korean-armaments-logo.webp',id);
  assert.equal((await app.inject({method:'GET',url:'/api/compendium/media/'+src})).statusCode,200,id);
}
for(const article of equipment.filter(article=>article.manufacturer&&article.brandLogo)){
  const response=await app.inject({method:'GET',url:'/api/compendium/media/'+article.brandLogo.src});
  assert.equal(response.statusCode,200,article.id);
}
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
console.log(`${restorations.length} quality WebPs, ${logos} corporation logos, ${charts} organization charts, ${Object.keys(brands).length} linked equipment items; ${owl.length} OWL pages and ${korean.length} North Korean pages covered, ${uncovered.length} identified manufacturers still awaiting a supplied logo.`);
