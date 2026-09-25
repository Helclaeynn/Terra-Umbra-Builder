import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../../..');
const catalogue = JSON.parse(readFileSync(resolve(root, 'compendium/source/wiki-taxonomy-catalogue-v1.json'), 'utf8'));
const journal = readFileSync(resolve(root, 'compendium/source/manual-review-batch-03.md'), 'utf8');
const lines = [...journal.matchAll(/^\| (\d+) \| `([^`]+)` \|/gm)];
assert.equal(lines.length, 400, 'Journal must contain 400 rows');
for (let i = 0; i < lines.length; i++) {
  assert.equal(Number(lines[i][1]), i + 801, `Incorrect journal index at row ${i + 801}`);
  assert.equal(lines[i][2], catalogue.pages[i + 800].id, `Incorrect article at row ${i + 801}`);
}
process.env.DATABASE_URL ??= 'postgres://audit:audit@127.0.0.1:1/audit';
process.env.COMPENDIUM_DATA_DIR = resolve(root, 'compendium/data');
process.chdir(resolve(root, 'apps/api'));
const { pool } = await import('../dist/db.js');
pool.query = async sql => {
  if (/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles/.test(String(sql))) return { rows: [] };
  throw new Error(`Unexpected database query: ${sql}`);
};
const { getCompendiumQualityCorpus } = await import('../dist/compendium.js');
const { articles, publicArticles } = await getCompendiumQualityCorpus();
const { REVIEWED_CATALOGUE_BATCH_03_LINKS: links, REVIEWED_CATALOGUE_BATCH_03_TAGS: tags } = await import('../dist/compendium-reviewed-catalogue-batch-03.js');
const byId = new Map(articles.map(article => [article.id, article]));
const publicById = new Map(publicArticles.map(article => [article.id, article]));
const checked = new Set(lines.map(match => match[2]));
for (const entry of links) {
  assert.ok(checked.has(entry.articleId), `Link outside batch: ${entry.articleId}`);
  const source = byId.get(entry.articleId), target = byId.get(entry.targetId);
  assert.ok(source && target, `Missing source or target: ${entry.articleId} → ${entry.targetId}`);
  const targetSection = target.sections.filter(section => section.id === entry.targetSection);
  assert.equal(targetSection.length, 1, `Invalid anchor: ${entry.targetId}#${entry.targetSection}`);
  assert.ok(targetSection[0].blocks.length, `Empty target: ${entry.targetId}#${entry.targetSection}`);
  const expected = `[${entry.label}](/compendium?article=${entry.targetId}#wiki-section-${entry.targetSection})`;
  const sourceSections = source.sections.filter(section => section.id === entry.sectionId);
  const matches = sourceSections.flatMap(section => section.blocks).filter(block => block.type === 'p' && block.text?.includes(expected));
  assert.equal(matches.length, 1, `Missing or duplicate link: ${entry.articleId}#${entry.sectionId} → ${expected}`);
  if (source.audience !== 'mj' && sourceSections.some(section => section.audience !== 'mj')) {
    assert.notEqual(target.audience, 'mj', `Public link to MJ article: ${entry.targetId}`);
    assert.notEqual(targetSection[0].audience, 'mj', `Public link to MJ section: ${entry.targetId}#${entry.targetSection}`);
    assert.ok(publicById.get(entry.targetId)?.sections.some(section => section.id === entry.targetSection), `Anchor missing in public article: ${entry.targetId}#${entry.targetSection}`);
    assert.ok(publicById.get(entry.articleId)?.sections.some(section => section.id === entry.sectionId && section.blocks.some(block => block.type === 'p' && block.text?.includes(expected))), `Link missing in public article: ${entry.articleId}#${entry.sectionId}`);
  }
}
for (const entry of tags) {
  assert.ok(checked.has(entry.articleId), `Tag outside batch: ${entry.articleId}`);
  assert.deepEqual(byId.get(entry.articleId)?.tags, entry.tags, `Tag correction not applied: ${entry.articleId}`);
  assert.ok(publicById.has(entry.articleId), `Reviewed page missing publicly: ${entry.articleId}`);
  assert.ok(publicById.get(entry.articleId).tags.every(tag => entry.tags.includes(tag)), `Unexpected public tag: ${entry.articleId}`);
  assert.ok(!entry.tags.includes('Vérité') && !entry.tags.includes('Multi-source'), `Private provenance in public tags: ${entry.articleId}`);
}
console.log(`400 reviews, ${links.length} contextual links and ${tags.length} privacy tag corrections verified.`);
