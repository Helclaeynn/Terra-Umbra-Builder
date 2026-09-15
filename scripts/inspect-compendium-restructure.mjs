import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA = 'compendium/data';
const manifest = JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`, 'utf8'));

function loadDataset(id) {
  const spec = manifest.datasets.find(dataset => dataset.id === id);
  if (!spec) throw new Error(`Missing dataset: ${id}`);
  let b64 = '';
  for (let i = 0; i < spec.parts; i += 1) {
    b64 += fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2, '0')}.b64part`, 'utf8').replace(/\s+/g, '');
  }
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));
}

const picks = [
  ['moteur', page => /Résolution générale/i.test(page.title || '')],
  ['realite', page => /Talents de Réalité/i.test(page.title || '')],
  ['realite', page => /Principes du Neurodive/i.test(page.title || '')],
  ['verite', page => /Points de Vérité/i.test(page.title || '')],
  ['verite', page => /^14\. Daemons/i.test(page.title || '')],
  ['verite', page => /^13\. Mages/i.test(page.title || '')],
];

for (const [id, predicate] of picks) {
  const pages = loadDataset(id);
  const page = pages.find(predicate);
  console.log(`SCHEMA_SAMPLE_BEGIN ${id}`);
  console.log(JSON.stringify(page, null, 2));
  console.log(`SCHEMA_SAMPLE_END ${id}`);
}
