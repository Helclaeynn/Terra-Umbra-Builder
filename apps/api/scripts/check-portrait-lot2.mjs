import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const mediaDir = resolve(root, 'compendium');
process.env.DATABASE_URL ??= 'postgres://test:test@127.0.0.1:1/test';
process.env.COMPENDIUM_DATA_DIR = resolve(mediaDir, 'data');
process.env.COMPENDIUM_MEDIA_DIR = mediaDir;
process.chdir(resolve(root, 'apps/api'));
const {pool} = await import(pathToFileURL(resolve(root, 'apps/api/dist/db.js')).href);
pool.query = async sql => {
  if (/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql))) return {rows: []};
  throw Error('Unexpected DB query: ' + sql);
};
const {getCompendiumQualityCorpus} = await import(pathToFileURL(resolve(root, 'apps/api/dist/compendium.js')).href);
const manifest = JSON.parse(await readFile(resolve(mediaDir, 'images/portraits/manifest.json'), 'utf8'));
const newPages = JSON.parse(await readFile(resolve(mediaDir, 'source/portrait-only-lot2-v1.json'), 'utf8')).articles;
const items = manifest.lot2.items;
assert.equal(items.length, 326);
assert.equal(new Set(items.map(item => item.src)).size, items.length);
const corpus = await getCompendiumQualityCorpus();
const byId = new Map(corpus.articles.map(article => [article.id, article]));
const publicById = new Map(corpus.publicArticles.map(article => [article.id, article]));
const newIds = new Set(newPages.map(entry => entry.id));
assert.equal(newIds.size, newPages.length);
for (const item of items) {
  assert.ok(byId.has(item.id), `Missing active PNJ: ${item.id}`);
  const bytes = await readFile(resolve(mediaDir, item.src));
  assert.ok(bytes.length > 5000, item.src);
  assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF', item.src);
  assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', item.src);
  const article = byId.get(item.id);
  const images = [article.image?.src, article.illustration?.src, article.pnj?.portrait,
    ...(article.gallery ?? []).map(media => media.src)];
  assert.ok(images.includes(item.src), `Portrait not attached: ${item.id}`);
  const original = manifest.lot1.items.find(entry => entry.id === item.id);
  if (original && article.image?.src === original.src) {
    assert.fail(`Older portrait still selected as main image: ${item.id}`);
  }
  if (item.id === 'personnages-verite-angelus-shihoko-baisho') {
    assert.equal(article.image?.src, item.src, 'Shihoko must show the new portrait');
  }
  if (item.visibility === 'mj') {
    const exposed = publicById.get(item.id);
    if (exposed) assert.ok(!JSON.stringify(exposed).includes(item.src), `Private portrait leaked: ${item.id}`);
  }
}
for (const entry of newPages) {
  const article = byId.get(entry.id);
  assert.equal(article.pnj?.completeness, 'portrait_only', entry.id);
  assert.ok(article.sections?.find(section => section.id === 'profil-statistique'), entry.id);
  assert.ok(article.sections?.find(section => section.id === 'dossier-mj' && section.audience === 'mj'), entry.id);
  assert.deepEqual(article.sections?.find(section => section.id === 'lore')?.blocks, [], entry.id);
  assert.ok(corpus.navigationIds.includes(entry.id), entry.id);
  assert.equal(publicById.has(entry.id), entry.visibility !== 'mj', entry.id);
}
await pool.end();
console.log(`${items.length} lot 2 WebPs attached, ${newPages.length} portrait-only PNJs, navigation and MJ privacy verified.`);
