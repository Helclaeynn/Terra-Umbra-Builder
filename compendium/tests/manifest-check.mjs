import fs from 'node:fs';
import zlib from 'node:zlib';

const readPackedJson = path => {
  const b64 = fs.readFileSync(path, 'utf8').replace(/\s+/g, '');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf8'));
};

const manifest = readPackedJson('compendium/data/manifest.json.gz.b64');
const referenced = [...new Set(Object.values(manifest.sets || {}).flat())];
const mapping = manifest.fileBundles || {};
const unmapped = referenced.filter(file => !mapping[file]);

console.log(`Compendium manifest: ${manifest.articles?.length || 0} articles, ${referenced.length} datasets, ${Object.keys(mapping).length} mappings`);
if (unmapped.length) {
  console.error('Datasets referenced by manifest.sets but missing from manifest.fileBundles:');
  for (const file of unmapped) console.error(` - ${file}`);
}

const bundleCache = new Map();
const missingInBundle = [];
for (const file of referenced) {
  const n = mapping[file];
  if (!n) continue;
  if (!bundleCache.has(n)) {
    const bundlePath = `compendium/data/bundle-${n}.json.gz.b64`;
    if (!fs.existsSync(bundlePath)) throw new Error(`Missing bundle file: ${bundlePath}`);
    bundleCache.set(n, readPackedJson(bundlePath));
  }
  if (!Array.isArray(bundleCache.get(n)[file])) missingInBundle.push([file, n]);
}
if (missingInBundle.length) {
  console.error('Datasets mapped to a bundle but absent from that bundle:');
  for (const [file,n] of missingInBundle) console.error(` - ${file} -> bundle-${n}`);
}

if (unmapped.length || missingInBundle.length) process.exit(1);
console.log('Compendium manifest/bundle structure OK');
