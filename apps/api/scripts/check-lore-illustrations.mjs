import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=fileURLToPath(new URL('../../../',import.meta.url)).replace(/\/$/,'');
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=root+'/compendium/data';
process.env.COMPENDIUM_MEDIA_DIR=root+'/compendium';
process.chdir(root+'/apps/api');
const {pool}=await import(pathToFileURL(root+'/apps/api/dist/db.js').href);
pool.query=async sql=>{
  if(/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql)))return {rows:[]};
  throw new Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(pathToFileURL(root+'/apps/api/dist/compendium.js').href);
const {default:Fastify}=await import(pathToFileURL(root+'/apps/api/node_modules/fastify/fastify.js').href);
const manifest=JSON.parse(await readFile(root+'/compendium/source/lore-illustrations-v1.json','utf8'));
const corpus=await getCompendiumQualityCorpus();
const byId=new Map(corpus.articles.map(article=>[article.id,article]));
const app=Fastify();await registerCompendiumRoutes(app);
for(const illustration of manifest.illustrations){
  const article=byId.get(illustration.articleId);assert.ok(article,illustration.articleId);
  assert.ok(['Réalité','Vérité'].includes(article.category),illustration.articleId);
  const section=article.sections?.find(item=>item.id===illustration.sectionId);assert.ok(section,illustration.sectionId);
  const blocks=section.blocks.filter(item=>item.type==='image'&&item.src===illustration.src);
  assert.equal(blocks.length,1,illustration.src);
  // The Insurgés introduction receives two leading context paragraphs during corpus assembly.
  const latestAllowedIndex = illustration.articleId === 'realite-v9-crawlers-insurges' && illustration.sectionId === 'insurrection-mondiale' ? 2 : 1;
  assert.ok(section.blocks.indexOf(blocks[0])<=latestAllowedIndex,illustration.src);
  const res=await app.inject({method:'GET',url:'/api/compendium/media/'+illustration.src});
  assert.equal(res.statusCode,200,illustration.src);
  assert.match(res.headers['content-type'],/image\/webp/);
  assert.ok(res.rawPayload.length>10000);
}
await app.close();await pool.end();
console.log(`${manifest.illustrations.length} lore illustrations appear once in their section and all WebPs are served.`);
