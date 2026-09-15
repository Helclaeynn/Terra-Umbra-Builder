import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const expected={equipement:{count:261,category:'Équipement',image:'assets/equipment-placeholder.svg'},augmentations:{count:132,category:'Augmentations',image:'assets/augmentation-placeholder.svg'}};

function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++){
    const file=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
    if(!fs.existsSync(file))throw new Error(`${spec.id}: fragment absent ${file}`);
    b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
  }
  const sha=crypto.createHash('sha256').update(b64).digest('hex');
  if(sha!==spec.sha256)throw new Error(`${spec.id}: SHA ${sha} != ${spec.sha256}`);
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}

const allIds=new Set();
const forbidden=[/\bcorpus\b/i,/\bbuilder\b/i,/\bfiche\b/i,/\bMJ\b/i,/\bjoueur\b/i,/\bjeu\b/i,/\bsc[ée]nario\b/i,/catalogue\s+(?:source|du)/i,/propri[ée]t[ée]s?\s+m[ée]caniques?/i];
let total=0;
for(const [id,rule] of Object.entries(expected)){
  const spec=manifest.datasets.find(x=>x.id===id);
  if(!spec)throw new Error(`Dataset ${id} absent du manifeste`);
  if(spec.count!==rule.count)throw new Error(`${id}: ${spec.count} entrées, attendu ${rule.count}`);
  const rows=load(spec);
  if(rows.length!==rule.count)throw new Error(`${id}: ${rows.length} pages décodées, attendu ${rule.count}`);
  for(const row of rows){
    if(!row.id||allIds.has(row.id))throw new Error(`${id}: ID absent ou dupliqué (${row.id})`);
    allIds.add(row.id);
    if(row.category!==rule.category)throw new Error(`${row.title}: catégorie ${row.category}`);
    if(row.illustration?.src!==rule.image)throw new Error(`${row.title}: encart image absent ou incorrect`);
    const lore=(row.sections||[]).find(s=>s.id==='contexte');
    const paragraphs=(lore?.blocks||[]).filter(b=>b.type==='p'&&String(b.text||'').trim());
    if(paragraphs.length<2)throw new Error(`${row.title}: deux paragraphes de lore attendus`);
    for(const p of paragraphs)for(const re of forbidden)if(re.test(p.text))throw new Error(`${row.title}: formulation méta interdite (${re})`);
    const mechanics=(row.sections||[]).find(s=>s.id==='proprietes');
    const table=(mechanics?.blocks||[]).find(b=>b.type==='table');
    if(!Array.isArray(table?.rows)||!table.rows.length)throw new Error(`${row.title}: propriétés mécaniques absentes`);
    if(!row.catalog?.id||!row.catalog?.category)throw new Error(`${row.title}: métadonnées catalogue absentes`);
  }
  total+=rows.length;
  console.log(`OK ${rule.category}: ${rows.length} pages · SHA ${spec.sha256.slice(0,12)}…`);
}
if(total!==393)throw new Error(`Catalogues: ${total} pages, attendu 393`);
if(!fs.existsSync('compendium/assets/equipment-placeholder.svg')||!fs.existsSync('compendium/assets/augmentation-placeholder.svg'))throw new Error('Placeholders image absents');
console.log(`Catalogues Compendium OK — ${total} pages · lore + image + propriétés mécaniques validés.`);
