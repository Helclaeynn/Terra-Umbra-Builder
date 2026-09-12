import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const dir = path.join(root, 'compendium');
let b64 = '';
for (let i = 1; i <= 17; i++) {
  const file = path.join(dir, `pegre-preview-data-${i}.js`);
  const src = fs.readFileSync(file, 'utf8');
  const match = src.match(/\+'([^']+)'\s*;?\s*$/s);
  if (!match) throw new Error(`Chunk ${i}: base64 payload not found`);
  b64 += match[1];
}
const compressed = Buffer.from(b64, 'base64');
const json = zlib.gunzipSync(compressed).toString('utf8');
const data = JSON.parse(json);
if (!Array.isArray(data.pages)) throw new Error('Payload has no pages array');
if (data.pages.length !== 18) throw new Error(`Expected 18 pages, got ${data.pages.length}`);
const ids = data.pages.map(p => p.id);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate preview page IDs');
const assets = data.assets && typeof data.assets === 'object' ? data.assets : {};
const unresolved = [];
for (const p of data.pages) {
  for (const v of p.visuals || []) {
    if (!String(v).startsWith('data:') && !assets[v] && !/^https?:\/\//.test(String(v))) unresolved.push(`${p.id}: ${v}`);
  }
}
if (unresolved.length) throw new Error(`Unresolved visuals:\n${unresolved.join('\n')}`);
console.log(`Pègre preview OK: ${data.pages.length} pages, ${Object.keys(assets).length} embedded assets, ${compressed.length} compressed bytes.`);
console.log(data.pages.map((p, i) => `${i + 1}. ${p.title}`).join('\n'));
