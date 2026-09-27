import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
process.env.DATABASE_URL = 'postgres://fixture:fixture@127.0.0.1:1/fixture';
process.env.COMPENDIUM_DATA_DIR = resolve(root, 'compendium/data');
process.env.COMPENDIUM_MEDIA_DIR = resolve(root, 'compendium');
process.chdir(resolve(root, 'apps/api'));
const { pool } = await import(pathToFileURL(resolve(root, 'apps/api/dist/db.js')).href);
const manifest = JSON.parse(await readFile(resolve(root, 'compendium/images/portraits/manifest.json'), 'utf8'));
const oldSources = new Set(Object.values(manifest).flatMap(lot => lot.items ?? []).map(item => item.src));
const ids = ['pnj-portraits-chasseurs-autres-la-reine', 'pnj-portraits-chasseurs-autres-agatha-langley'];
const rows = [];
pool.query = async (sql, values) => {
  const statement = String(sql);
  if (statement.includes('FROM sessions s')) return { rows: [{ id: '00000000-0000-4000-8000-000000000001', email: 'fixture@example.invalid', display_name: 'Admin', role: 'admin', is_active: true, created_at: new Date().toISOString(), last_login_at: null }] };
  if (statement.includes('FROM compendium_portrait_visibility')) return { rows };
  if (statement.includes('INSERT INTO compendium_portrait_visibility')) {
    const [articleId, src, visibility, uploaded] = values;
    const existing = rows.find(row => row.articleId === articleId && row.src === src);
    if (existing) existing.visibility = visibility;
    else rows.push({ articleId, src, visibility, uploaded });
    return { rows: [] };
  }
  if (/UPDATE sessions|FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles|FROM compendium_deleted_articles/.test(statement)) return { rows: [] };
  throw Error('Unexpected DB query: ' + statement);
};

const { default: Fastify } = await import(pathToFileURL(resolve(root, 'apps/api/node_modules/fastify/fastify.js')).href);
const { registerCompendiumRoutes, getCompendiumQualityCorpus } = await import(pathToFileURL(resolve(root, 'apps/api/dist/compendium.js')).href);
const { registerQualityRoutes } = await import(pathToFileURL(resolve(root, 'apps/api/dist/quality.js')).href);
const app = Fastify();
try {
  await registerCompendiumRoutes(app);
  await registerQualityRoutes(app);
  const auth = { cookie: '__Host-tuc_session=fixture-session' };
  const corpus = await getCompendiumQualityCorpus();
  const mediaSources = corpus.articles.filter(article => article.category === 'Personnages')
    .flatMap(article => [article.image?.src, article.illustration?.src, article.pnj?.portrait,
      ...(article.gallery ?? []).map(media => media.src)]).filter(Boolean);
  const unsupported = mediaSources.filter(src => /^(?:https?:|data:|blob:)/i.test(src));
  assert.equal(unsupported.length, 0, 'Externally hosted portraits cannot be made private by our media route');
  const mirrors = JSON.parse(await readFile(resolve(root, 'compendium/source/portrait-legacy-mirrors-v1.json'), 'utf8'));
  assert.equal(mirrors.items.length, 13);
  for (const item of mirrors.items) {
    const bytes = await readFile(resolve(root, 'compendium', item.src));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, item.src);
  }
  const mirroredArticle = corpus.articles.find(article => article.category === 'Personnages' &&
    [article.image?.src, article.illustration?.src, article.pnj?.portrait, ...(article.gallery ?? []).map(media => media.src)]
      .includes(mirrors.items[0].src));
  assert.ok(mirroredArticle, 'The legacy image was not attached to its article');
  ids.push(mirroredArticle.id);
  const otherPath = corpus.articles.find(article => article.category === 'Personnages' &&
    article.image?.src?.startsWith('images/') && !article.image.src.startsWith('images/portraits/'));
  if (otherPath) ids.push(otherPath.id);
  console.log(`${mediaSources.length} attached portrait references use locally controlled media.`);
  for (const id of ids) {
    const untouched = (await getCompendiumQualityCorpus()).articles.find(item => item.id !== id);
    const article = (await getCompendiumQualityCorpus()).articles.find(item => item.id === id);
    const src = id === mirroredArticle.id ? mirrors.items[0].src : article?.image?.src;
    assert.ok(src, id);
    assert.ok(!oldSources.has(src), `${id} is in the original manifest, not the reported gap`);
    const url = `/api/admin/compendium-quality/${id}/portraits`;
    assert.equal((await app.inject({ url })).statusCode, 401);
    const before = await app.inject({ url, headers: auth });
    assert.equal(before.statusCode, 200, before.body);
    assert.ok(before.json().portraits.some(portrait => portrait.media === src), `${id} lacks its current image`);
    const switched = await app.inject({ method: 'PATCH', url, headers: auth, payload: { src, visibility: 'mj' } });
    assert.equal(switched.statusCode, 200, switched.body);
    assert.ok(switched.json().portraits.some(portrait => portrait.media === src && portrait.visibility === 'mj'));
    const publicArticle = (await getCompendiumQualityCorpus()).publicArticles.find(item => item.id === id);
    assert.ok(!JSON.stringify(publicArticle).includes(src), `${id} leaked through the public article`);
    assert.equal((await getCompendiumQualityCorpus()).articles.find(item => item.id === untouched.id), untouched,
      'Switching one portrait must keep the rest of the loaded Compendium intact');
    assert.equal((await app.inject({ url: `/api/compendium/media/${src}` })).statusCode, 403, src);
    assert.equal((await app.inject({ url: `/api/compendium/media/${src}`, headers: auth })).statusCode, 200, src);
    const restored = await app.inject({ method: 'PATCH', url, headers: auth, payload: { src, visibility: 'public' } });
    assert.equal(restored.statusCode, 200, restored.body);
    assert.equal((await app.inject({ url: `/api/compendium/media/${src}` })).statusCode, 200, src);
  }
  console.log('Legacy portraits: admin listing, both visibility choices, public article and direct media protection verified.');
} finally {
  await app.close(); await pool.end();
}
