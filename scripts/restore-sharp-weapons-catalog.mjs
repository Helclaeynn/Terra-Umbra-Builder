import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

// This targeted pass preserves existing IDs and editorial content. Rebuilding the
// whole equipment catalogue would overwrite its subsequent manual review.
const DATA = 'compendium/data';
const SAFE = 'character-builder/rulesets/terra-umbra/reality/safe';
const restoration = JSON.parse(fs.readFileSync('compendium/source/sharp-weapons-restoration-v1.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`, 'utf8'));
const spec = manifest.datasets.find((entry) => entry.id === 'equipement');
const clean = (value) => String(value ?? '').replace(/\s+/g, '');
const packed = Array.from({ length: spec.parts }, (_, index) =>
  clean(fs.readFileSync(`${DATA}/${spec.prefix}-${String(index).padStart(2, '0')}.b64part`, 'utf8'))).join('');
const pages = JSON.parse(zlib.gunzipSync(Buffer.from(packed, 'base64')).toString('utf8'));
const safeManifest = JSON.parse(fs.readFileSync(`${SAFE}/equipment.manifest.json`, 'utf8'));
const safePacked = safeManifest.chunks.map((file) => clean(fs.readFileSync(path.join(SAFE, file), 'utf8'))).join('');
const safe = JSON.parse(zlib.gunzipSync(Buffer.from(safePacked, 'base64')).toString('utf8')).entries;
const current = JSON.parse(fs.readFileSync('compendium/source/current-equipment-catalog-v1.json', 'utf8')).catalog.entries;
// Published API values have priority over the older Safe export.
const equipment = new Map([...safe, ...current].map((entry) => [entry.id, entry]));
const byId = new Map(pages.map((page) => [page.id, page]));
const labels = new Map([
  ['Type', 'Type'], ['Classe', 'Classe'], ['Role', 'Rôle'], ['DGT', 'Dégâts'],
  ['Portee', 'Portée'], ['Cap.', 'Capacité'], ['Proprietes', 'Propriétés']
]);
const ruleTarget = '/compendium?article=regles-realite-v9-equipement-proprietes-protections#proprietes-armes';

function properties(item) {
  const rows = [['Catégorie', item.category], ['Prix', item.priceLabel || (item.price == null ? 'Mission' : `${item.price} $`)]];
  for (const [key, value] of Object.entries(item.data ?? {})) {
    if (value === undefined || value === null || value === '') continue;
    rows.push([labels.get(key) ?? key, Array.isArray(value) ? value.join(' · ') : String(value)]);
  }
  if (item.effect) rows.push(['Effet / usage', item.effect]);
  return rows;
}

for (const entry of restoration.entries) {
  const existing = byId.get(entry.articleId);
  if (entry.disposition === 'preserve') {
    if (!existing || existing.catalog?.id !== entry.catalogId) throw new Error(`Existing weapon missing: ${entry.articleId}`);
    const active = equipment.get(entry.catalogId);
    for (const key of ['name', 'priceMode', 'price', 'priceLabel', 'effect', 'data']) {
      if (JSON.stringify(active?.[key]) !== JSON.stringify(entry.builder[key])) throw new Error(`Preserved weapon changed: ${entry.catalogId}/${key}`);
    }
    continue;
  }
  if (existing) {
    if (existing.catalog?.id !== entry.catalogId) throw new Error(`ID collision: ${entry.articleId}`);
    continue;
  }
  if (pages.some((page) => page.catalog?.id === entry.catalogId)) throw new Error(`Duplicate weapon: ${entry.catalogId}`);
  const page = {
    id: entry.articleId, title: entry.name, category: 'Équipement', status: 'canon_source',
    source: restoration.sourceFile,
    tags: ['Réalité', 'Équipement', 'Armes — Mêlée', entry.source.family],
    illustration: { src: 'assets/equipment-placeholder.svg', alt: entry.name, caption: entry.name },
    catalog: {
      kind: 'equipment', id: entry.catalogId, category: entry.builder.category,
      generation: null, price: entry.builder.price, sourceType: null,
      weaponClass: entry.builder.data.Type, loreVersion: 3,
      loreMethod: 'source-document-extract', loreGrounding: 'book',
      loreSource: restoration.sourceFile, sourcePage: entry.source.sourcePage,
      sourceTitle: entry.source.sourceTitle
    },
    sections: [
      { id: 'contexte', title: 'Description et usage', level: 2,
        blocks: entry.paragraphs.map((text) => ({ type: 'p', style: 'lore reality-book-lore', text })) },
      { id: 'proprietes', title: 'Propriétés', level: 2,
        blocks: [{ type: 'table', rows: properties(entry.builder) }] },
      { id: 'regles', title: 'Règles d’utilisation', level: 2,
        blocks: [{ type: 'p', text: `Les dégâts et propriétés ci-dessus décrivent cette arme. Les effets communs déjà définis suivent les [propriétés des armes terrestres](${ruleTarget}). Une propriété descriptive sans valeur chiffrée n’ajoute pas de bonus numérique.` }] }
    ]
  };
  pages.push(page);
  byId.set(page.id, page);
}

for (const entry of restoration.entries.filter((item) => item.disposition === 'add')) equipment.set(entry.catalogId, entry.builder);
let weapons = 0;
for (const page of pages) {
  if (!/^Armes\s/.test(page.catalog?.category ?? '')) continue;
  const item = equipment.get(page.catalog.id);
  if (!item) throw new Error(`Missing mechanics: ${page.id}/${page.catalog.id}`);
  const section = page.sections.find((value) => value.id === 'proprietes');
  if (!section) throw new Error(`Missing properties section: ${page.id}`);
  const table = section.blocks.find((block) => block.type === 'table');
  if (!table) throw new Error(`Missing properties table: ${page.id}`);
  table.rows = properties(item);
  weapons++;
}
if (weapons !== 124 || pages.length !== 368) throw new Error(`Unexpected catalogue size: ${weapons} weapons/${pages.length} pages`);

const result = zlib.gzipSync(Buffer.from(JSON.stringify(pages), 'utf8'), { level: 9 }).toString('base64');
const partSize = 8000;
const partCount = Math.ceil(result.length / partSize);
for (let index = 0; index < partCount; index++) {
  fs.writeFileSync(`${DATA}/${spec.prefix}-${String(index).padStart(2, '0')}.b64part`, result.slice(index * partSize, (index + 1) * partSize));
}
for (let index = partCount; index < spec.parts; index++) fs.unlinkSync(`${DATA}/${spec.prefix}-${String(index).padStart(2, '0')}.b64part`);
spec.parts = partCount;
spec.count = pages.length;
spec.sha256 = crypto.createHash('sha256').update(result).digest('hex');
manifest.expectedTotal = manifest.datasets.reduce((total, entry) => total + entry.count, 0);
fs.writeFileSync(`${DATA}/manifest-v3.json`, `${JSON.stringify(manifest, null, 2)}\n`);
execFileSync(process.execPath, ['scripts/build-compendium-navigation.mjs'], { stdio: 'pipe' });
console.log(`Arsenal restored: ${restoration.addedCount} new pages, ${weapons} complete weapon tables, ${pages.length} equipment pages, ${manifest.expectedTotal} total entries.`);
