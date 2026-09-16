import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const SOURCES=[
  'compendium/source/truth-lore-v3-curated-aidh-field.json',
  'compendium/source/truth-lore-v3-curated-aidh-tuc.json'
];
const FRAGMENT_SIZE=8000;
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const norm=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function load(spec){
  let b64='';
  for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function write(spec,pages){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');
  const parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
}
function mechanicalSnapshot(page){
  const clone=structuredClone(page);
  clone.sections=(clone.sections||[]).filter(section=>section.id!=='contexte');
  if(clone.catalog){
    delete clone.catalog.loreVersion;
    delete clone.catalog.loreMethod;
    delete clone.catalog.loreGrounding;
    delete clone.catalog.loreSource;
  }
  return JSON.stringify(clone);
}

const curated=[],seen=new Set();
for(const sourcePath of SOURCES){
  const source=JSON.parse(fs.readFileSync(sourcePath,'utf8'));
  for(const [title,entry] of Object.entries(source.entries||{})){
    const key=norm(title);
    if(seen.has(key))throw new Error(`Titre Vérité curaté dupliqué: ${title}`);
    seen.add(key);
    curated.push({title,entry,source:clean(entry.source||source.source||sourcePath)});
  }
}

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(item=>item.id==='verite-catalogue');if(!spec)throw new Error('Dataset verite-catalogue absent');
const pages=load(spec),byTitle=new Map(pages.map(page=>[norm(page.title),page]));
const before=new Map(pages.map(page=>[norm(page.title),mechanicalSnapshot(page)]));
let applied=0;
for(const {title,entry,source} of curated){
  const page=byTitle.get(norm(title));if(!page)throw new Error(`Page Vérité absente pour lore manuel: ${title}`);
  const paragraphs=(entry.paragraphs||[]).map(clean);
  if(paragraphs.length!==2||paragraphs.some(text=>text.split(/\s+/).length<14))throw new Error(`${title}: deux paragraphes substantiels requis`);
  const section=(page.sections||[]).find(item=>item.id==='contexte');if(!section)throw new Error(`${title}: section contexte absente`);
  section.title='Dans la Vérité';
  section.blocks=paragraphs.map(text=>({type:'p',style:'lore',text}));
  page.catalog={...(page.catalog||{}),loreVersion:3,loreMethod:'truth-book-manual-lore',loreGrounding:'book-context',loreSource:source};
  applied++;
}
if(applied!==curated.length)throw new Error(`Surcouche Vérité manuelle incomplète: ${applied}/${curated.length}`);

for(const page of pages){
  if(before.get(norm(page.title))!==mechanicalSnapshot(page))throw new Error(`${page.title}: bloc mécanique modifié pendant la passe lore Vérité`);
}
write(spec,pages);
spec.quality={...(spec.quality||{}),loreVersion:3,method:'truth-book-manual-lore'};
manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);
fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Lore Vérité V3 manuel — ${applied} pages surchargées depuis ${SOURCES.length} corpus · propriétés inchangées · SHA ${spec.sha256}.`);
