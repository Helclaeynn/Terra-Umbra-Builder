import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SAFE='character-builder/rulesets/terra-umbra/reality/safe';
const SOURCE='compendium/source';
const OUT=`${SOURCE}/current-equipment-catalog-v1.json`;
const COMBAT_OUT=`${SOURCE}/current-combat-catalog-v1.json`;
const clean=s=>String(s).replace(/^\uFEFF/,'').replace(/\s+/g,'');
const slug=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const manifest=JSON.parse(fs.readFileSync(path.join(SAFE,'equipment.manifest.json'),'utf8'));
const b64=manifest.chunks.map(file=>clean(fs.readFileSync(path.join(SAFE,file),'utf8'))).join('');
const catalog=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
if(!catalog||!Array.isArray(catalog.entries)) throw new Error('Catalogue équipement actif invalide.');
fs.writeFileSync(OUT,JSON.stringify({version:1,manifest,catalog},null,2)+'\n');
const combat=catalog.entries.filter(entry=>/^Armes\s|^Armures\s/.test(String(entry.category||''))).map(entry=>({id:entry.id,name:entry.name,category:entry.category,priceMode:entry.priceMode,price:entry.price,priceLabel:entry.priceLabel,effect:entry.effect,data:entry.data}));
fs.writeFileSync(COMBAT_OUT,JSON.stringify({version:1,count:combat.length,entries:combat},null,2)+'\n');
for(const file of fs.readdirSync(SOURCE)) if(file.startsWith('current-combat-category-')&&file.endsWith('.json')) fs.unlinkSync(path.join(SOURCE,file));
const groups=new Map();for(const entry of combat){if(!groups.has(entry.category))groups.set(entry.category,[]);groups.get(entry.category).push(entry);}
for(const [category,entries] of groups) fs.writeFileSync(`${SOURCE}/current-combat-category-${slug(category)}.json`,JSON.stringify({version:1,category,count:entries.length,entries},null,2)+'\n');
const modes=new Map();for(const entry of catalog.entries){const mode=String(entry.priceMode??'').trim()||'(empty)';if(!modes.has(mode))modes.set(mode,[]);if(modes.get(mode).length<4)modes.get(mode).push({name:entry.name,price:entry.price,priceMin:entry.priceMin,priceMax:entry.priceMax,priceLabel:entry.priceLabel});}
fs.writeFileSync(`${SOURCE}/current-combat-categories-v1.json`,JSON.stringify({version:1,total:combat.length,categories:[...groups].map(([category,entries])=>({category,count:entries.length})),priceModes:[...modes].map(([mode,examples])=>({mode,examples}))},null,2)+'\n');
console.log(`Catalogue actif exporté: ${catalog.entries.length} entrées · combat ${combat.length} · ${groups.size} catégories · ${modes.size} modes de prix.`);
