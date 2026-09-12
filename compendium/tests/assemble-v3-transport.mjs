import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';

const ROOT = 'compendium/data';
const TRANSPORT = path.join(ROOT, '_v3transport');
const specs = [
  ['moteur', 9, 5, '76064dc233fba8565fc8faef2b2b78afd5c12a36cb99f7656e1d37a0e6e9e8e6'],
  ['realite', 26, 39, '1dfa17c463e08bcdf836c516685e712d2f26b419d240c98f5e9145afeae07489'],
  ['verite', 37, 63, 'ba9f95fff951607512f205682e91de64ce939656a9a95d20eeee80e7aceecd95'],
  ['bestiaire', 16, 20, '9643736a1666b7ad6402d464cbd5cb14e5cdbd36bd71623be875f28c1332af55'],
  ['lore', 118, 229, '6b20a3653056e5d355ddd9febcef3c7e86fe848c373a273267a6acb5768a9ab3'],
  ['pnj', 88, 163, 'd3f6006f971147d1af1c10dc025443a8db9761801f14336b42899e12d457c652'],
];

const manifest = {
  version: 3,
  generated: '2026-09-12',
  categories: ['Règles','Réalité','Vérité','Organisations','Personnages','Bestiaire'],
  statusLabels: {
    canon_recent: 'Canon récent',
    canon_enrichi: 'Canon enrichi',
    source_detaillee: 'Lore détaillé',
    obsolete: 'Obsolète'
  },
  datasets: [],
  expectedTotal: 519
};

let grandTotal = 0;
const globalIds = new Set();
for (const [id, chunks, expectedRows, expectedSha] of specs) {
  let b64 = '';
  for (let i = 0; i < chunks; i++) {
    const file = path.join(TRANSPORT, `${id}-${String(i).padStart(3, '0')}.part`);
    if (!fs.existsSync(file)) throw new Error(`${id}: fragment manquant ${file}`);
    b64 += fs.readFileSync(file, 'utf8');
  }
  const sha = crypto.createHash('sha256').update(b64).digest('hex');
  if (sha !== expectedSha) throw new Error(`${id}: SHA-256 invalide ${sha} != ${expectedSha}`);
  const rows = JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));
  if (!Array.isArray(rows) || rows.length !== expectedRows) throw new Error(`${id}: ${rows.length} entrées, attendu ${expectedRows}`);
  const localIds = new Set();
  for (const [index, row] of rows.entries()) {
    if (!row?.id || !row?.title || !row?.category) throw new Error(`${id}[${index}]: id/titre/catégorie absent`);
    if (localIds.has(row.id)) throw new Error(`${id}: id dupliqué ${row.id}`);
    if (globalIds.has(row.id)) throw new Error(`Corpus: id dupliqué entre datasets ${row.id}`);
    localIds.add(row.id); globalIds.add(row.id);
  }
  const out = path.join(ROOT, `v3-${id}-00.b64part`);
  fs.writeFileSync(out, b64);
  manifest.datasets.push({id, prefix:`v3-${id}`, parts:1, count:expectedRows, sha256:expectedSha});
  grandTotal += rows.length;
  console.log(`OK ${id}: ${rows.length} entrées, ${chunks} fragments → ${out}`);
}
if (grandTotal !== 519) throw new Error(`Corpus V3: ${grandTotal} entrées, attendu 519`);
fs.writeFileSync(path.join(ROOT, 'manifest-v3.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`OK corpus V3: ${grandTotal} entrées, ${globalIds.size} ids uniques.`);
