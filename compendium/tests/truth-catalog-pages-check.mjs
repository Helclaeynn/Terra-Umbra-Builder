import fs from 'node:fs';import zlib from 'node:zlib';
const m=JSON.parse(fs.readFileSync('compendium/data/manifest-v3.json','utf8'));
const sm=JSON.parse(fs.readFileSync('compendium/source/verite-catalog-v6.json','utf8'));
const sourceB64=fs.readFileSync(`compendium/source/${sm.file}`,'utf8').replace(/\s+/g,'');
const source=JSON.parse(zlib.gunzipSync(Buffer.from(sourceB64,'base64')).toString('utf8'));
const d=m.datasets.find(x=>x.id==='verite-catalogue');if(!d)throw new Error('dataset absent');
const b64=Array.from({length:d.parts},(_,i)=>fs.readFileSync(`compendium/data/${d.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'')).join('');
const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
if(rows.length!==source.entryCount||rows.length!==sm.entryCount||rows.length!==229)throw new Error(`count ${rows.length}`);
const forbidden=/\b(?:builder|corpus|fiche|mj|joueur|jeu|scenario)\b/i;
for(const a of rows){
 if(a.category!=='Catalogue Vérité')throw new Error(`${a.title}: catégorie`);
 if(!a.illustration?.src)throw new Error(`${a.title}: illustration`);
 const lore=a.sections.find(x=>x.id==='contexte')?.blocks?.filter(x=>x.type==='p'&&x.style==='lore')||[];
 if(lore.length!==2)throw new Error(`${a.title}: lore ${lore.length}`);
 if(lore.some(x=>forbidden.test(x.text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())))throw new Error(`${a.title}: meta`);
 const table=a.sections.find(x=>x.id==='proprietes')?.blocks?.find(x=>x.type==='table');
 if(!table?.rows?.length)throw new Error(`${a.title}: table`);
}
const titles=new Set(rows.map(x=>x.title));if(titles.size!==rows.length)throw new Error('titres dupliqués');
for(const n of ['Excalibur / Ymir','Grande Orbe','Nacres noires','Nahfr','Mue de Rulfam','Lance de Longinus']){
 const a=rows.find(x=>x.title===n);if(!a)throw new Error(`${n}: absent`);if(a.catalog.availabilityStatus!=='unique')throw new Error(`${n}: statut unique absent`);
}
const chapters=new Set(rows.map(x=>x.catalog.chapter));for(const c of ['22','23','24','25','26','27'])if(!chapters.has(c))throw new Error(`chapitre ${c} absent`);
console.log(`Catalogue Vérité OK — ${rows.length} pages · 6 artefacts uniques · chapitres 22–27.`);
