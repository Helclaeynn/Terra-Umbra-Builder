import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const manifestPath='compendium/source/verite-catalog-v6.json';
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
if(!Array.isArray(manifest.chunks)||manifest.chunks.length!==7)throw new Error(`Source Vérité: ${manifest.chunks?.length||0} fragments, attendu 7`);
const dir=path.dirname(manifestPath);
const b64=manifest.chunks.map(file=>fs.readFileSync(path.join(dir,file),'utf8').replace(/\s+/g,'')).join('');
const sha=crypto.createHash('sha256').update(b64).digest('hex');
if(b64.length!==49944)throw new Error(`Source Vérité: longueur ${b64.length}, attendu 49944`);
if(sha!=='2c396dec92cbb5525f63d198655c438d8af3998c3ad1adb7d59df154a6738cf7')throw new Error(`Source Vérité: SHA inattendu ${sha}`);
const source=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
if(!Array.isArray(source.entries)||source.entries.length!==229)throw new Error(`Source Vérité: ${source.entries?.length||0} entrées, attendu 229`);
fs.writeFileSync(path.join(dir,manifest.file),b64+'\n');
console.log(`Source Vérité assemblée — ${source.entries.length} entrées · ${b64.length} caractères · SHA ${sha}`);
