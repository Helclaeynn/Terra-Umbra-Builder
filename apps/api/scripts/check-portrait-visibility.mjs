import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
process.env.DATABASE_URL ??= 'postgres://fixture:fixture@127.0.0.1:1/fixture';
process.env.COMPENDIUM_DATA_DIR = resolve(root, 'compendium/data');
process.env.COMPENDIUM_MEDIA_DIR = resolve(root, 'compendium');
const uploadDir = await mkdtemp(join(tmpdir(), 'tuc-portrait-'));
process.env.COMPENDIUM_UPLOAD_DIR = uploadDir;
await writeFile(join(uploadDir, 'private.jpg'), Buffer.from([255,216,255,217]));
process.chdir(resolve(root, 'apps/api'));
const { pool } = await import(pathToFileURL(resolve(root, 'apps/api/dist/db.js')).href);
const manifest = JSON.parse(await readFile(resolve(root, 'compendium/images/portraits/manifest.json'), 'utf8'));
const entries = Object.values(manifest).flatMap(lot => lot.items ?? []);
const hidden = entries.find(item => item.visibility === 'mj' && item.src.includes('/mj/'));
const visible = entries.find(item => item.visibility === 'public' && item.src.includes('/public/'));
assert.ok(hidden && visible);
const overrides = [
  { articleId: hidden.id, src: hidden.src, visibility: 'public', uploaded: false },
  { articleId: visible.id, src: visible.src, visibility: 'mj', uploaded: false },
  { articleId: hidden.id, src: '/api/compendium/uploads/private.jpg', visibility: 'mj', uploaded: true }
];
pool.query = async (sql, values) => {
  const statement = String(sql);
  if (statement.includes('FROM compendium_portrait_visibility')) {
    return { rows: values?.length ? overrides.filter(row => row.src === values[0]) : overrides };
  }
  if (/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles|FROM compendium_deleted_articles/.test(statement)) return { rows: [] };
  throw Error('Unexpected DB query: ' + statement);
};
const { default: Fastify } = await import(pathToFileURL(resolve(root, 'apps/api/node_modules/fastify/fastify.js')).href);
const { registerCompendiumRoutes, getCompendiumQualityCorpus } = await import(pathToFileURL(resolve(root, 'apps/api/dist/compendium.js')).href);
const app = Fastify();
try {
  await registerCompendiumRoutes(app);
  const corpus = await getCompendiumQualityCorpus();
  const publicById = new Map(corpus.publicArticles.map(article => [article.id, article]));
  const publicImages = article => [article?.image?.src, article?.illustration?.src, ...(article?.gallery ?? []).map(media => media.src)].filter(Boolean);
  assert.ok(publicImages(publicById.get(hidden.id)).includes(hidden.src), 'Promoted portrait must appear publicly');
  assert.ok(!publicImages(publicById.get(hidden.id)).includes('/api/compendium/uploads/private.jpg'));
  assert.ok(!publicImages(publicById.get(visible.id)).includes(visible.src), 'Private override must disappear publicly');
  assert.notEqual(publicById.get(visible.id)?.pnj?.portrait, visible.src, 'PNJ portrait metadata must not leak');
  assert.equal((await app.inject({ method: 'GET', url: `/api/compendium/media/${hidden.src}` })).statusCode, 200);
  assert.equal((await app.inject({ method: 'GET', url: `/api/compendium/media/${visible.src}` })).statusCode, 403);
  assert.equal((await app.inject({ method: 'GET', url: '/api/compendium/uploads/private.jpg' })).statusCode, 403);
  const response = await app.inject({ method: 'GET', url: '/api/compendium/media/images/portraits/manifest.json' });
  assert.ok(!Object.values(response.json()).flatMap(lot => lot.items ?? []).some(item => item.src === visible.src));
  assert.ok(Object.values(response.json()).flatMap(lot => lot.items ?? []).some(item => item.src === hidden.src));
  console.log('Portrait visibility overrides: corpus, files, and public manifest verified.');
} finally { await app.close(); await pool.end(); await rm(uploadDir, { recursive: true, force: true }); }
