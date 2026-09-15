import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const SOURCE='compendium/source/reality-lore-v3-augmentations.json';
const FRAGMENT_SIZE=8000;

try {
  await import('./enrich-compendium-reality-lore.mjs');
} catch (error) {
  const message=String(error?.message||error);
  if(!message.startsWith('Lore V3 insuffisant'))throw error;
  console.warn(`Lore Réalité V3 — passe générique incomplète acceptée avant surcouche source-driven: ${message}`);
}

const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const sourceBook=JSON.parse(fs.readFileSync(SOURCE,'utf8'));
const sourceEntries=sourceBook.entries||{};
const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(item=>item.id==='augmentations');
if(!spec)throw new Error('Dataset augmentations absent du manifeste');

let b64='';
for(let i=0;i<spec.parts;i++){
  const file=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
  if(!fs.existsSync(file))throw new Error(`augmentations: fragment absent ${file}`);
  b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
}
const pages=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const byTitle=new Map(pages.map(page=>[norm(page.title),page]));
let applied=0;
for(const [title,paragraphs] of Object.entries(sourceEntries)){
  const page=byTitle.get(norm(title));
  if(!page)throw new Error(`Lore augmentation source non relié: ${title}`);
  if(!Array.isArray(paragraphs)||paragraphs.length!==2||paragraphs.some(text=>clean(text).length<70))throw new Error(`Lore augmentation source insuffisant: ${title}`);
  const section=(page.sections||[]).find(item=>item.id==='contexte');
  if(!section)throw new Error(`${page.title}: section contexte absente`);
  section.title='Description et usage';
  section.blocks=paragraphs.map(text=>({type:'p',style:'lore reality-book-lore',text:clean(text)}));
  page.catalog={...(page.catalog||{}),loreVersion:3,loreMethod:'reality-book-semantic-lore',loreGrounding:'augmentation',loreSource:sourceBook.source||'TUC Réalité V8 / Augmentations terrestres V1'};
  applied++;
}
if(applied!==Object.keys(sourceEntries).length)throw new Error(`Surcouche augmentations incomplète: ${applied}/${Object.keys(sourceEntries).length}`);

for(const page of pages){
  const section=(page.sections||[]).find(item=>item.id==='contexte');
  const lore=(section?.blocks||[]).filter(block=>block.type==='p'&&clean(block.text));
  if(lore.length!==2||lore.some(block=>clean(block.text).length<70))throw new Error(`${page.title}: lore final encore insuffisant`);
}

for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
const outB64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');
const parts=Math.ceil(outB64.length/FRAGMENT_SIZE);
for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,outB64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
spec.parts=parts;
spec.count=pages.length;
spec.sha256=crypto.createHash('sha256').update(outB64).digest('hex');
spec.quality={...(spec.quality||{}),loreVersion:3,maxIdenticalTextRatio:0.6,method:'reality-book-semantic-lore'};
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Lore augmentations source-driven — ${applied} pages surchargées · ${pages.length} pages validées · SHA ${spec.sha256}.`);
