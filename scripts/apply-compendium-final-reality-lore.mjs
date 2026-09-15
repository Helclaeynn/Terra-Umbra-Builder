import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const MANIFEST=`${DATA}/manifest-v3.json`;
const SOURCE='compendium/source/reality-lore-v3-final-eight.json';
const FRAGMENT_SIZE=8000;
const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const norm=value=>clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

function load(spec){let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));}
function write(spec,pages){for(const file of fs.readdirSync(DATA))if(file.startsWith(`${spec.prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`);const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9}).toString('base64');const parts=Math.ceil(b64.length/FRAGMENT_SIZE);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');}

const source=JSON.parse(fs.readFileSync(SOURCE,'utf8'));
const entries=source.entries||{};
const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
const spec=manifest.datasets.find(x=>x.id==='equipement');if(!spec)throw new Error('Dataset equipement absent');
const pages=load(spec),byTitle=new Map(pages.map(p=>[norm(p.title),p]));let applied=0;
for(const [title,entry] of Object.entries(entries)){
  const page=byTitle.get(norm(title));if(!page)throw new Error(`Page équipement absente pour source finale: ${title}`);
  const paragraphs=(entry.paragraphs||[]).map(clean);
  if(paragraphs.length!==2||paragraphs.some(p=>p.length<70))throw new Error(`${title}: deux paragraphes source-driven >=70 caractères requis`);
  if(paragraphs.some(p=>/\$|\bprice ?(?:mode|label|min|max)\b/i.test(p)))throw new Error(`${title}: prix ou métadonnée tarifaire interdite dans le lore`);
  const section=(page.sections||[]).find(s=>s.id==='contexte');if(!section)throw new Error(`${title}: section contexte absente`);
  section.title='Description et usage';
  section.blocks=paragraphs.map(text=>({type:'p',style:'lore reality-book-lore',text}));
  page.catalog={...(page.catalog||{}),loreVersion:3,loreMethod:'reality-book-semantic-lore',loreGrounding:'book-context',loreSource:clean(entry.source||source.source)};
  applied++;
}
if(applied!==Object.keys(entries).length)throw new Error(`Surcouche finale incomplète: ${applied}/${Object.keys(entries).length}`);
write(spec,pages);manifest.expectedTotal=manifest.datasets.reduce((sum,item)=>sum+Number(item.count||0),0);fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
console.log(`Lore Réalité final source-driven — ${applied} pages surchargées · SHA ${spec.sha256}.`);
