import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const SOURCE='compendium/source/reality-lore-v3-firearms.json';
const FRAGMENT_SIZE=8000;
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const norm=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

const sourceBook=JSON.parse(fs.readFileSync(SOURCE,'utf8'));
const entries=sourceBook.entries||{};
const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(item=>item.id==='equipement');
if(!spec)throw new Error('Dataset equipement absent du manifeste');

let b64='';
for(let i=0;i<spec.parts;i++){
  const file=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
  if(!fs.existsSync(file))throw new Error(`equipement: fragment absent ${file}`);
  b64+=fs.readFileSync(file,'utf8').replace(/\s+/g,'');
}
const pages=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const byTitle=new Map(pages.map(page=>[norm(page.title),page]));
let applied=0;
for(const [title,paragraphs] of Object.entries(entries)){
  const page=byTitle.get(norm(title));
  if(!page)throw new Error(`Lore arme source non relié: ${title}`);
  if(!Array.isArray(paragraphs)||paragraphs.length!==2||paragraphs.some(text=>clean(text).length<70))throw new Error(`Lore arme source insuffisant: ${title}`);
  const section=(page.sections||[]).find(item=>item.id==='contexte');
  if(!section)throw new Error(`${page.title}: section contexte absente`);
  section.title='Description et usage';
  section.blocks=paragraphs.map(text=>({type:'p',style:'lore reality-book-lore',text:clean(text)}));
  page.catalog={...(page.catalog||{}),loreVersion:3,loreMethod:'reality-book-semantic-lore',loreGrounding:'book',loreSource:sourceBook.source||'TUC Réalité V8 — Livre IV'};
  applied++;
}
if(applied!==Object.keys(entries).length)throw new Error(`Surcouche armes incomplète: ${applied}/${Object.keys(entries).length}`);

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
console.log(`Lore armes V8 — ${applied} pages 4.3–4.4 surchargées · SHA ${spec.sha256}.`);
