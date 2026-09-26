import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../../..');
process.env.DATABASE_URL ??= 'postgres://audit:audit@127.0.0.1:1/audit';
process.env.COMPENDIUM_DATA_DIR = resolve(root, 'compendium/data');
process.chdir(resolve(root, 'apps/api'));
const { pool } = await import('../dist/db.js');
pool.query = async sql => {
  if (/FROM compendium_custom_articles|FROM compendium_article_edits|(?:FROM|INTO) compendium_legacy_articles|FROM compendium_deleted_articles/.test(String(sql))) return { rows: [] };
  throw new Error(`Unexpected database query: ${sql}`);
};
const { getCompendiumQualityCorpus } = await import('../dist/compendium.js');
const { articles, publicArticles } = await getCompendiumQualityCorpus();
const { REVIEWED_RULE_LINKS, REVIEWED_RULE_TAGS } = await import('../dist/compendium-reviewed-rule-taxonomy.js');
const { default: assert } = await import('node:assert/strict');
const { REVIEWED_LORE_LINKS, REVIEWED_LORE_TAGS } = await import('../dist/compendium-reviewed-lore-taxonomy.js');
const byId = new Map(articles.map(article => [article.id, article]));
for (const entry of [...REVIEWED_RULE_LINKS, ...REVIEWED_LORE_LINKS]) {
  const sections = byId.get(entry.articleId).sections.filter(section => section.id === entry.sectionId);
  const expected = `[${entry.label}](/compendium?article=${entry.targetId}#wiki-section-${entry.targetSection})`;
  assert.equal(sections.flatMap(section => section.blocks).filter(block => block.text?.includes(expected)).length, 1, `${entry.articleId}: ${entry.label}`);
  const target = byId.get(entry.targetId).sections.filter(section => section.id === entry.targetSection);
  assert.equal(target.length, 1);
  assert.ok(target[0].blocks.length);
  assert.notEqual(target[0].audience, 'mj', 'No public link into a private target');
}
for (const entry of [...REVIEWED_RULE_TAGS, ...REVIEWED_LORE_TAGS]) assert.deepEqual(byId.get(entry.articleId).tags, entry.tags);
const publicNpc = publicArticles.find(article => article.id === 'regles-pnj-talents-statistiques');
if (publicNpc) assert.ok(!publicNpc.sections.some(section => section.audience === 'mj'));
console.log(`${REVIEWED_RULE_LINKS.length} contextual section links and ${REVIEWED_RULE_TAGS.length} tag decisions verified in loaded corpus; private NPC sections remain excluded.`);

const aseryn = byId.get('regles-verite-v7-aseryn-nature-accelyr-origines');
const originRows = aseryn.sections.find(section => section.id === 'origines-jouables').blocks.find(block => block.type === 'table').rows;
assert.deepEqual(originRows, [["Origine", "SR", "R", "Orientation"], ["Aérilien / Néo-Atlante", "+1 Agi, +1 Vol", "+2 Agi, +1 Vol", "Affinité magique, lecture des flux"], ["Mûlien", "+1 Agi, +1 Esp", "+2 Agi, +1 Esp", "Psychisme, télépathie"], ["Hyperboréen", "+1 Agi, +1 Vig", "+2 Agi, +1 Vig", "Physique, endurance, explosivité"], ["Lémurian", "+1 Agi, +1 Vol", "+2 Agi, +1 Vol", "Héritage nymphal et élémentaire"], ["Serathèen", "+1 Agi", "+2 Agi", "Ascendance composite, Traces multiples"]]);
assert.ok(aseryn.sections.some(section => section.id === 'aerilien-neo-atlante'));

for (const id of ['verite-v7-delanial-pere-ombre', 'bestiaire-v15-delanial-pere-de-l-ombre']) {
  const article = publicArticles.find(article => article.id === id);
  assert.ok(article, `public alias is present: ${id}`);
  assert.doesNotMatch(JSON.stringify(article), /Légionnaire des Puissances|n’est pas un Fléau|faux.septi[eè]me|aucune Source de Corruption Delanial/i);
}
for (const id of ['verite-v7-delanial-pere-ombre', 'bestiaire-v15-delanial-le-faux-septieme-fleau']) {
  const article = byId.get(id);
  assert.match(JSON.stringify(article.sections.filter(section => section.audience === 'mj')), /Légionnaire des Puissances/i);
}
console.log(`${REVIEWED_LORE_LINKS.length} lore links and ${REVIEWED_LORE_TAGS.length} taxonomy decisions verified; Delanial classification preserved for MJ and excluded from public article/search payloads.`);
