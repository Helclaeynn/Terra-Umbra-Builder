import fs from 'node:fs';
import zlib from 'node:zlib';

const readPackedJson = path => {
  const b64 = fs.readFileSync(path, 'utf8').replace(/\s+/g, '');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));
};
const asDataset = (data,file) => Array.isArray(data) ? data : Array.isArray(data?.[file]) ? data[file] : Array.isArray(data?.articles) ? data.articles : null;

const manifest = readPackedJson('compendium/data/manifest.json.gz.b64');
const referenced = [...new Set(Object.values(manifest.sets || {}).flat())];
const mapping = manifest.fileBundles || {};
const bundleCache = new Map();
const failures = [];
let directCount = 0, bundledCount = 0, articleRows = 0;

for (const file of referenced) {
  const n = mapping[file];
  try {
    let dataset;
    if (n) {
      bundledCount++;
      if (!bundleCache.has(n)) {
        const bundlePath = `compendium/data/bundle-${n}.json.gz.b64`;
        if (!fs.existsSync(bundlePath)) throw new Error(`bundle absent: ${bundlePath}`);
        bundleCache.set(n, readPackedJson(bundlePath));
      }
      dataset = bundleCache.get(n)?.[file];
    } else {
      directCount++;
      const path = `compendium/data/${file}`;
      if (!fs.existsSync(path)) throw new Error(`pack direct absent: ${path}`);
      dataset = asDataset(readPackedJson(path), file);
    }
    if (!Array.isArray(dataset)) throw new Error('dataset non tabulaire');
    articleRows += dataset.length;
  } catch (error) {
    failures.push(`${file}: ${error.message}`);
  }
}

console.log(`Compendium manifest: ${manifest.articles?.length || 0} métadonnées, ${referenced.length} datasets (${directCount} directs / ${bundledCount} bundlés), ${articleRows} lignes chargeables`);
if (failures.length) {
  console.error('Erreurs de structure du Compendium :');
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log('Compendium manifest/datasets structure OK');
