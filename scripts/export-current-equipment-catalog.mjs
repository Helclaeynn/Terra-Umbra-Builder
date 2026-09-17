import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SAFE='character-builder/rulesets/terra-umbra/reality/safe';
const OUT='compendium/source/current-equipment-catalog-v1.json';
const COMBAT_OUT='compendium/source/current-combat-catalog-v1.json';
const clean=s=>String(s).replace(/^\uFEFF/,'').replace(/\s+/g,'');
const manifest=JSON.parse(fs.readFileSync(path.join(SAFE,'equipment.manifest.json'),'utf8'));
const b64=manifest.chunks.map(file=>clean(fs.readFileSync(path.join(SAFE,file),'utf8'))).join('');
const catalog=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
if(!catalog||!Array.isArray(catalog.entries)) throw new Error('Catalogue équipement actif invalide.');
fs.writeFileSync(OUT,JSON.stringify({version:1,manifest,catalog},null,2)+'\n');
const combat=catalog.entries.filter(entry=>/^Armes\s|^Armures\s/.test(String(entry.category||''))).map(entry=>({id:entry.id,name:entry.name,category:entry.category,priceMode:entry.priceMode,price:entry.price,priceLabel:entry.priceLabel,effect:entry.effect,data:entry.data}));
fs.writeFileSync(COMBAT_OUT,JSON.stringify({version:1,count:combat.length,entries:combat},null,2)+'\n');
console.log(`Catalogue actif exporté: ${catalog.entries.length} entrées · combat ${combat.length}.`);
