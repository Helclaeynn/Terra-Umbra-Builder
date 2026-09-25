import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');
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
const publicIds = new Set(publicArticles.map(article => article.id));
const ids = new Set(articles.map(article => article.id));
const entries = articles.map(article => ({
  id: article.id,
  title: article.title,
  category: article.category,
  dataset: article.dataset,
  audience: publicIds.has(article.id) ? 'public' : 'mj',
  tags: article.tags ?? [],
  sections: (article.sections ?? []).map((section, index) => ({
    id: String(section.id ?? `wiki-section-${index + 1}`),
    title: section.title ?? '',
    audience: section.audience ?? 'public',
    blocks: section.blocks?.length ?? 0
  })),
  outbound: [...new Set(JSON.stringify(article.sections ?? []).matchAll(/\/compendium\?article=([^&#"\s]+)(?:#([^"\s<>]+))?/g))]
    .map(match => ({ id: decodeURIComponent(match[1]), section: decodeURIComponent(match[2] ?? '') }))
}));
const broken = entries.flatMap(article => article.outbound.filter(link => !ids.has(link.id)).map(link => ({ source: article.id, ...link })));
const byId = new Map(entries.map(article => [article.id, article]));
const brokenSections = entries.flatMap(article => article.outbound.filter(link => link.section && byId.has(link.id) &&
  !byId.get(link.id).sections.some((section, index, sections) => {
    const name = section.id.replace(/[^a-zA-Z0-9_-]+/g, '-');
    const ordinal = sections.slice(0, index).filter(previous => previous.id.replace(/[^a-zA-Z0-9_-]+/g, '-') === name).length;
    return section.id === link.section || `wiki-section-${name}${ordinal ? `--${ordinal + 1}` : ''}` === link.section;
  }))
  .map(link => ({ source: article.id, ...link })));
const duplicateSections = entries.flatMap(article => {
  const seen = new Set();
  return article.sections.flatMap(section => {
    if (seen.has(section.id)) return [{ articleId: article.id, sectionId: section.id }];
    seen.add(section.id);
    return [];
  });
});
const summary = {
  total: entries.length, public: publicArticles.length,
  sections: entries.reduce((sum, article) => sum + article.sections.length, 0),
  untagged: entries.filter(article => !article.tags.length).length,
  brokenExistingTargets: broken.length, brokenExistingSections: brokenSections.length,
  duplicateSourceSectionIds: duplicateSections.length
};
const output = process.argv[2];
if (output) await writeFile(output, JSON.stringify({ summary, entries, broken, brokenSections, duplicateSections }, null, 2));
console.log(JSON.stringify(summary));
