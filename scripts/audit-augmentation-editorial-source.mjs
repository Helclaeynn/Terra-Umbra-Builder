import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
function load(spec){let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));}
function tableRows(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>block.rows||[]));}
function context(page){const section=(page.sections||[]).find(section=>section.id==='contexte');return (section?.blocks||[]).filter(block=>block.type==='p').map(block=>clean(block.text)).filter(Boolean);}
const spec=manifest.datasets.find(dataset=>dataset.id==='augmentations');if(!spec)throw new Error('Dataset augmentations absent');
const pages=load(spec).filter(page=>clean(page.catalog?.loreSource)==='Réalité V8 — Augmentations terrestres').sort((a,b)=>clean(a.title).localeCompare(clean(b.title),'fr'));
console.log(`AUGMENTATIONS A REPRENDRE — ${pages.length}`);
for(const page of pages){
  console.log(`AUGMENTATION | ${clean(page.title)}`);
  console.log(`FAITS | ${tableRows(page).map(row=>`${clean(row?.[0])}=${clean(row?.[1])}`).filter(Boolean).join(' | ')}`);
  console.log(`CONTEXTE ACTUEL | ${context(page).join(' || ')}`);
}
