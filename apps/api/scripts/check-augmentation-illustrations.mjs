import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readdir,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../../../',import.meta.url)).replace(/\/$/,'');
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR=root+'/compendium/data';
process.env.COMPENDIUM_MEDIA_DIR=root+'/compendium';
process.chdir(root+'/apps/api');
const {pool}=await import(root+'/apps/api/dist/db.js');
pool.query=async(sql)=>{
  if (/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql))) return {rows:[]};
  throw new Error('Unexpected DB query: '+sql);
};
const {getCompendiumQualityCorpus,registerCompendiumRoutes}=await import(root+'/apps/api/dist/compendium.js');
const {default:Fastify}=await import(root+'/apps/api/node_modules/fastify/fastify.js');
const filenames=(await readdir(root+'/compendium/images/manual')).filter(name=>/^augmentation-\d{3}-[a-z0-9-]+(?:--g[12])?\.webp$/.test(name));
const known=new Set(filenames);
const manifest=JSON.parse(await readFile(root+'/compendium/source/augmentation-illustrations-20260924.json','utf8'));
assert.equal(manifest.items.length,146);
assert.equal(new Set(manifest.items.map(item=>item.src)).size,146);
assert.deepEqual(new Set(manifest.items.map(item=>item.src.slice('images/manual/'.length))),new Set(filenames));
const expected=new Map(manifest.items.map(item=>[item.src,item]));
const corpus=await getCompendiumQualityCorpus();
const articles=corpus.articles.filter(article=>article.id.startsWith('augmentation-'));
assert.equal(articles.length,111);
const app=Fastify();await registerCompendiumRoutes(app);
let checked=0;
for (const article of articles) {
  const variants=article.catalog.variants;
  const sections=article.sections.filter(section=>section.id!=='contexte');
  assert.equal(variants.length,sections.length,article.id);
  for (const [index,variant] of variants.entries()) {
    const filename=article.id+(variant.generation?`--g${variant.generation}`:'')+'.webp';
    assert.ok(known.has(filename),'Missing illustration: '+filename);
    known.delete(filename);
    const src='images/manual/'+filename;
    const item=expected.get(src);
    assert.ok(item,filename);
    assert.equal(item.id,article.id,filename);
    assert.equal(item.generation,variant.generation??null,filename);
    assert.equal(variant.illustration?.src,src,filename);
    assert.ok(sections[index].blocks.some(block=>block.type==='image'&&block.src===src),filename);
    assert.ok(!sections[index].blocks.some(block=>String(block.style||'').includes('illustration-placeholder')&&block.type==='p'),filename);
    const res=await app.inject({method:'GET',url:'/api/compendium/media/'+src});
    assert.equal(res.statusCode,200,filename);
    assert.match(res.headers['content-type'],/image\/webp/,filename);
    assert.deepEqual(res.rawPayload,await readFile(root+'/compendium/'+src),filename);
    assert.equal(createHash('sha256').update(res.rawPayload).digest('hex'),item.sha256,filename);
    checked++;
  }
  const preferred=variants.find(variant=>variant.generation===2&&variant.illustration?.src?.endsWith('.webp'))
    ??variants.find(variant=>variant.illustration?.src?.endsWith('.webp'));
  assert.ok(preferred,article.id);
  assert.equal(article.illustration?.src,preferred.illustration.src,article.id);
}
assert.equal(checked,146);
assert.equal(known.size,0,'Unmatched files: '+[...known].join(', '));
await app.close();await pool.end();
console.log(`OK: ${checked} augmentation variants resolved in their sections and served as exact WebP bytes.`);
