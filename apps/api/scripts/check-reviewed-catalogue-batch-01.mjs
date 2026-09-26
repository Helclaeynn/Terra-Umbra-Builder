import assert from 'node:assert/strict';
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
const { REVIEWED_CATALOGUE_BATCH_01_LINKS, REVIEWED_CATALOGUE_BATCH_01_TAGS } =
  await import('../dist/compendium-reviewed-catalogue-batch-01.js');
const byId = new Map(articles.map(article => [article.id, article]));
const publicById = new Map(publicArticles.map(article => [article.id, article]));
const unapplied = [];
for (const entry of REVIEWED_CATALOGUE_BATCH_01_LINKS) {
  const source = byId.get(entry.articleId);
  const target = byId.get(entry.targetId);
  assert.ok(source && target, `Missing source or target: ${entry.articleId} → ${entry.targetId}`);
  const sourceSections = source.sections.filter(section => section.id === entry.sectionId);
  const targetSections = target.sections.filter(section => section.id === entry.targetSection);
  assert.equal(targetSections.length, 1, `Invalid target anchor: ${entry.targetId}#${entry.targetSection}`);
  assert.ok(targetSections[0].blocks.length, `Empty target section: ${entry.targetId}#${entry.targetSection}`);
  const expected = `[${entry.label}](/compendium?article=${entry.targetId}#wiki-section-${entry.targetSection})`;
  const matches = sourceSections.flatMap(section => section.blocks).filter(block => block.type === 'p' && block.text?.includes(expected));
  if (matches.length !== 1) unapplied.push(`${entry.articleId}#${entry.sectionId} → ${expected}: ${matches.length}`);
  if (sourceSections.some(section => section.audience !== 'mj') && source.audience !== 'mj') {
    assert.notEqual(target.audience, 'mj', `Public link to MJ page: ${entry.targetId}`);
    assert.notEqual(targetSections[0].audience, 'mj', `Public link to MJ section: ${entry.targetId}#${entry.targetSection}`);
  }
}
assert.deepEqual(unapplied, [], 'Missing or duplicated contextual links');
for (const entry of REVIEWED_CATALOGUE_BATCH_01_TAGS) {
  assert.deepEqual(byId.get(entry.articleId)?.tags, entry.tags, `Tag decision not applied: ${entry.articleId}`);
}
assert.ok(byId.get('realite-v9-cnad').sections.some(section => section.id === 'quatre-cercles' && section.audience === 'mj'));
assert.ok(!publicById.get('realite-v9-cnad').sections.some(section => section.id === 'quatre-cercles'));
assert.doesNotMatch(publicById.get('realite-v9-cnad').__searchText ?? '', /falsification.*logifate|vingt.cinq profils/i);
assert.ok(!publicById.get('realite-v9-laus-surveillance').tags.includes('Ghost Bureau'));
assert.ok(!publicById.get('pnj-crawlers-docx-hailey-powell').sections.some(section => section.id === 'chasseurs-informations-realite'));
const maskedAssassin = publicById.get('pnj-crawlers-docx-daft-vador-kaine-reid');
assert.equal(maskedAssassin?.title, 'Daft Vador');
assert.doesNotMatch(`${maskedAssassin?.title} ${maskedAssassin?.realityName} ${JSON.stringify(maskedAssassin?.pnj)} ${JSON.stringify(maskedAssassin?.sections)}`, /Kaine REID/i);
for (const [id, forbidden] of [
  ['pnj-police-arthur-bartram', /berserk d.Aèr|opérations ultra secrètes du PCRC/i],
  ['pnj-police-asgall-macartain', /sang de profond|par un profond/i],
  ['pnj-police-casey-vaughn', /Celaesa|Elfes|Elyë/i],
  ['pnj-gouvernement-diego-alejandro-lasa', /Pelages roux|Loups-garous/i],
  ['pnj-gouvernement-farah-el-arshad', /Éveils des Ten|Ancre de Vérité|Akva.Farah/i],
  ['pnj-crawlers-docx-jacob-delisle', /Loups-garous|Autres Pelages|sang primal/i],
  ['pnj-crawlers-docx-josefin-drescher', /Loups-garous|Pelages gris|sang révélateur/i],
  ['pnj-crawlers-docx-hailey-powell', /Chasseurs|Association|Lore Chasseurs/i],
  ['pnj-crawlers-docx-tia-reynolds', /Association|Lore Chasseurs|sorcière-traqueuse/i],
  ['pnj-crawlers-docx-dragoslav-memic', /Association|Hunt-15|Lore Chasseurs/i],
  ['pnj-crawlers-docx-aisha-white', /Homoncule|Association|Lore Chasseurs|Aisha FAUST/i],
  ['pnj-crawlers-docx-leslie-wright', /Éveils des Ten|Ancre de Vérité|Mageius de Merlin|Loges des Mages/i],
  ['pnj-crawlers-docx-ogshaata-otto', /Association|Lore Chasseurs|Hunt-15|pactes avec les esprits/i],
  ['pnj-crawlers-antisysteme-p6-max-sharp', /Focalor|Robespierre|Daemon/i],
  ['pnj-crawlers-antisysteme-p9-chon-hyun-sook', /colonel nord-coréen|n’étaient pas humains/i],
  ['pnj-crawlers-antisysteme-p13-mildred-copeland', /chargée par Hailey Powell|faire savoir qu’elle était en vie/i],
  ['pnj-crawlers-antisysteme-p15-jane-costa', /Loups-garous|Pelages gris|Ascanius/i],
  ['pnj-crawlers-antisysteme-p18-sahamena-lannis', /Conseil des Anciens|Grands Exilés|Sahamena Lanyth/i],
  ['pnj-crawlers-antisysteme-p22-miwatani-raichoko', /semi-esprit|Ao Guang|Zagan/i],
  ['pnj-crawlers-antisysteme-p31-leona-ambersmith', /galactique|Corp\+/i],
  ['pnj-crawlers-antisysteme-p33-yegpor-karamov', /aberration|Hailey Powell/i],
  ['pnj-crawlers-antisysteme-p35-ameena-al-gad', /Daemons|Morrighan|Ghurab/i],
  ['pnj-crawlers-antisysteme-p43-solomon-blackburn', /AIDH|homo superior|Hunt100/i],
  ['pnj-crawlers-antisysteme-p46-raghnaid-peutan', /Amazone, c’est|Angrboda|vénérant Katja/i],
  ['pnj-crawlers-antisysteme-p46-eamonn-mac-cearain', /humaine-kelta|Sharfeidd/i],
  ['pnj-crawlers-antisysteme-p48-annushka-lyninka-maxinovna', /traquée par les hommes de mains de Shuji|hérite de Tomas/i],
  ['pnj-crawlers-antisysteme-p56-mary-shanasti', /Maarashana|Aseryns|Lémurie/i],
  ['pnj-crawlers-antisysteme-p58-kassidy-haynes', /Meneuse de clan|pelages dorés/i],
  ['pnj-crawlers-antisysteme-p58-diana-buck', /Loups-garous|Pelages dorés|sang Enragé/i],
  ['pnj-crawlers-antisysteme-p60-nana-nandoa', /Skenandoa|Ihuito Meztzi|Cours vampiriques/i],
  ['pnj-crawlers-antisysteme-p62-shaynida-kean', /Le hasard \? Aucun|Méliade|\bIda\b/i],
  ['pnj-crawlers-antisysteme-p64-jane-moreno', /Gadyndra|dragonne|Croix d.Emphyrra/i],
  ['pnj-crawlers-antisysteme-p64-jayceon-osborn', /Jacyr Oceriol|V.aagor|Croix d.Emphyrra/i],
  ['pnj-crawlers-antisysteme-p70-ulfric-tamer', /Rulfam|Fléau supérieur|Shaoggith/i],
]) {
  const article = publicById.get(id);
  assert.ok(article, `Missing public article: ${id}`);
  const visible = `${article.tags.join(' ')} ${article.sections.flatMap(section => section.blocks).map(block => block.text ?? JSON.stringify(block.rows ?? '')).join(' ')}`;
  assert.doesNotMatch(visible, forbidden, `MJ secret leaked in ${id}`);
}
console.log(`${REVIEWED_CATALOGUE_BATCH_01_LINKS.length} contextual links and ${REVIEWED_CATALOGUE_BATCH_01_TAGS.length} tag decisions verified; CNAD and Ghost Bureau protection verified.`);
