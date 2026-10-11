import assert from 'node:assert/strict';
import pg from 'pg';
import fastify from 'fastify';

let published = [];
pg.Pool.prototype.query = async function (sql) {
  if (String(sql).includes('FROM sessions s')) return { rows: [{ id: 'audit', email: 'audit@example.invalid', display_name: 'Audit', role: 'admin', is_active: true }], rowCount: 1 };
  if (String(sql).includes('WHERE published IS NOT NULL')) return { rows: published, rowCount: published.length };
  return { rows: [], rowCount: 0 };
};
const { registerCompendiumRoutes, getCompendiumQualityCorpus, invalidateCompendiumCorpus } = await import('../dist/compendium.js');
const app = fastify();
await registerCompendiumRoutes(app);
const id = 'pnj-crawlers-docx-dragoslav-memic';
const original = await getCompendiumQualityCorpus();
const editor = await app.inject({ method: 'GET', url: `/api/compendium/editor/articles/${id}`, headers: { cookie: '__Host-tuc_session=audit' } });
assert.equal(editor.statusCode, 200, editor.body);
const { article, baseHash } = editor.json();
article.sections = [{ id: 'edited-biography', title: 'Biographie', blocks: [{ type: 'p', text: 'Biographie publiée et conservée.' }] }, ...article.sections.filter(section => section.audience === 'mj')];
published = [{ articleId: id, baseHash, published: article }];
invalidateCompendiumCorpus();
const edited = await getCompendiumQualityCorpus();
assert.equal(edited.databaseEditSummary.applied, 1);
assert.equal(edited.articles.length, original.articles.length);
assert.ok(edited.articles.find(item => item.id === id).sections.some(section => section.id === 'edited-biography'));
for (const url of ['/api/compendium/meta', '/api/compendium/wiki-index?compact=1', '/api/compendium/search?q=Dragoslav', `/api/compendium/articles/${id}`]) {
  const response = await app.inject({ method: 'GET', url });
  assert.equal(response.statusCode, 200, `${url}: ${response.body}`);
}
const publicArticle = edited.publicArticles.find(item => item.id === id);
assert.ok(publicArticle.sections.some(section => section.id === 'edited-biography'));
assert.ok(publicArticle.sections.every(section => section.audience !== 'mj'));
await app.close();
console.log('Published PNJ biography changes preserve the corpus, public endpoints and private sections.');
