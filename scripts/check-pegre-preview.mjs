import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const dir = path.join(root, 'compendium');
const html = fs.readFileSync(path.join(dir, 'pegre-preview.html'), 'utf8');
const shardSources = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)]
  .map(match => match[1])
  .filter(src => /^pegre-preview-data-.*\.js(?:\?[^"']*)?$/.test(src));

if (!shardSources.length) throw new Error('No Pègre preview data shards declared in pegre-preview.html');

let b64 = '';
for (const declaredSrc of shardSources) {
  const file = declaredSrc.split('?')[0];
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) throw new Error(`Missing declared shard: ${file}`);
  const src = fs.readFileSync(fullPath, 'utf8');
  const chunks = [...src.matchAll(/\+\s*'([^']+)'/g)].map(match => match[1]);
  if (!chunks.length) throw new Error(`${file}: base64 payload not found`);
  b64 += chunks.join('');
}

const compressed = Buffer.from(b64, 'base64');
const json = zlib.gunzipSync(compressed).toString('utf8');
const data = JSON.parse(json);
if (!Array.isArray(data.pages)) throw new Error('Payload has no pages array');
if (data.pages.length !== 18) throw new Error(`Expected 18 pages, got ${data.pages.length}`);
const ids = data.pages.map(p => p.id);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate preview page IDs');

const embedded = data.embeddedAssets && typeof data.embeddedAssets === 'object' ? data.embeddedAssets : {};
const assets = data.assets && typeof data.assets === 'object' ? data.assets : {};
const assetKey = value => String(value || '').split('/').pop().replace(/\.[^.]+$/, '');
const unresolved = [];
for (const p of data.pages) {
  for (const v of p.visuals || []) {
    const value = String(v || '');
    if (!value.startsWith('data:') && !embedded[assetKey(value)] && !assets[value] && !/^https?:\/\//.test(value)) {
      unresolved.push(`${p.id}: ${value}`);
    }
  }
}
if (unresolved.length) throw new Error(`Unresolved visuals:\n${unresolved.join('\n')}`);

console.log(`Pègre preview OK: ${data.pages.length} pages, ${Object.keys(embedded).length || Object.keys(assets).length} embedded assets, ${compressed.length} compressed bytes, ${shardSources.length} declared shards.`);
console.log(data.pages.map((p, i) => `${i + 1}. ${p.title}`).join('\n'));
