import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../../../', import.meta.url)).replace(/\/$/, '');
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=root+'/compendium/data';
process.env.COMPENDIUM_MEDIA_DIR=root+'/compendium';
// Isolate the committed corpus: this check never connects to or writes a database.
process.chdir(root+'/apps/api');
const {pool}=await import(root+'/apps/api/dist/db.js');
pool.query=async(sql)=>{
 if (/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql))) return {rows:[]};
 throw new Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(root+'/apps/api/dist/compendium.js');
const {default:Fastify}=await import(root+'/apps/api/node_modules/fastify/fastify.js');
const manifest=JSON.parse(await readFile(root+'/compendium/source/bestiary-illustrations-20260923.json','utf8'));
assert.equal(manifest.items.length,110,'Le lot doit contenir les 110 illustrations validées');
assert.equal(new Set(manifest.items.map(item=>item.id)).size,110,'Les fiches doivent être uniques');
assert.equal(new Set(manifest.items.map(item=>item.src)).size,110,'Les images doivent être uniques');
const corpus=await getCompendiumQualityCorpus();
const app=Fastify();await registerCompendiumRoutes(app);
const results=[];
for(const item of manifest.items){
 const article=corpus.articles.find(x=>x.id===item.id);assert.ok(article,item.id);
 const media=article.illustration??article.image;assert.equal(media?.src,item.src,item.id);
 assert.ok(!/venir|placeholder/i.test(media.alt+' '+media.caption),item.id);
 const res=await app.inject({method:'GET',url:'/api/compendium/media/'+item.src});
 assert.equal(res.statusCode,200,item.id);assert.match(res.headers['content-type'],/image\/webp/);
 assert.equal(createHash('sha256').update(res.rawPayload).digest('hex'),item.sha256,item.id);
 results.push({id:item.id,src:media.src,status:res.statusCode,bytes:res.rawPayload.length});
}
assert.equal(corpus.articles.find(x=>x.id==='bestiaire-v15-afanc').illustration.src,'images/manual/bestiaire-v15-afanc.webp');
await app.close();await pool.end();
console.log('OK: 110 fiches résolues, 110 WebP servis en HTTP avec hashes exacts, légendes et Afanc préservés. Vérification sans éditions wiki en base.');
