import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../../',import.meta.url)).replace(/\/$/,'');
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=root+'/compendium/data';
process.env.COMPENDIUM_MEDIA_DIR=root+'/compendium';
process.chdir(root+'/apps/api');
const {pool}=await import(root+'/apps/api/dist/db.js');
pool.query=async sql=>{
  if(/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql)))return {rows:[]};
  throw new Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(root+'/apps/api/dist/compendium.js');
const {default:Fastify}=await import(root+'/apps/api/node_modules/fastify/fastify.js');
const manifest=JSON.parse(await readFile(root+'/compendium/source/rules-diagrams-v1.json','utf8'));
assert.equal(manifest.diagrams.length,25);
const corpus=await getCompendiumQualityCorpus();
const byId=new Map(corpus.articles.map(article=>[article.id,article]));
assert.equal(corpus.articles.filter(article=>article.category==='Règles').length,65);
const app=Fastify();await registerCompendiumRoutes(app);
for(const diagram of manifest.diagrams){
  const article=byId.get(diagram.articleId);assert.ok(article,diagram.articleId);
  const section=article.sections?.find(item=>item.id===diagram.sectionId);assert.ok(section,diagram.sectionId);
  const blocks=section.blocks.filter(item=>item.type==='image'&&item.src===diagram.src);
  assert.equal(blocks.length,1,diagram.articleId);
  assert.equal(blocks[0].mobileSrc,diagram.mobileSrc);
  assert.ok(section.blocks.indexOf(blocks[0])<=1,diagram.articleId);
  const res=await app.inject({method:'GET',url:'/api/compendium/media/'+diagram.src});
  assert.equal(res.statusCode,200,diagram.src);
  assert.match(res.headers['content-type'],/image\/svg\+xml/);
  assert.match(res.body,/<svg/);
  const mobile=await app.inject({method:'GET',url:'/api/compendium/media/'+diagram.mobileSrc});
  assert.equal(mobile.statusCode,200,diagram.mobileSrc);
  assert.match(mobile.headers['content-type'],/image\/svg\+xml/);
}
await app.close();await pool.end();
console.log(`${manifest.diagrams.length} rule diagrams appear once in the intended section and all SVGs are served.`);
