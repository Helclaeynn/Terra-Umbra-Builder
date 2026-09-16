import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

function specFor(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec) throw new Error(`Dataset absent: ${id}`);
  return spec;
}
function loadDataset(id){
  const spec=specFor(id);let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return normalize(value).replace(/\s+/g,'-')||'item'}
function clone(value){return JSON.parse(JSON.stringify(value))}

let rules=loadDataset('moteur');

function splitGroupedPage({title,prefix,pageTitle}){
  const source=rules.find(page=>page.title===title);
  if(!source) throw new Error(`Page source absente: ${title}`);
  const pages=[];
  for(const section of source.sections||[]){
    const family=section.title;
    const copy=clone(source);
    copy.id=`${prefix}-${slug(family)}`;
    copy.title=pageTitle(family);
    copy.sections=[clone(section)];
    copy.tags=[...new Set([...(copy.tags||[]),family])];
    pages.push(copy);
  }
  rules=rules.filter(page=>page.id!==source.id);
  return pages;
}

const expertisePages=splitGroupedPage({
  title:'Talents d’expertise',
  prefix:'regles-realite-talents-expertise',
  pageTitle:family=>`Talents d’expertise — ${family}`,
});
const originPages=splitGroupedPage({
  title:'Talents d’Origine',
  prefix:'regles-realite-talents-origine',
  pageTitle:family=>`Talents d’Origine — ${family.replace(/^Origine\s+/i,'')}`,
});
const spherePages=splitGroupedPage({
  title:'Talents de Sphère',
  prefix:'regles-realite-talents-sphere',
  pageTitle:family=>`Talents de Sphère — ${family}`,
});

rules.push(...expertisePages,...originPages,...spherePages);

const talentHub=rules.find(page=>page.title==='Talents de Réalité — règles générales');
if(talentHub){
  const sentence='Les Talents sont regroupés en seize pages de catalogue : une page de Talents communs, une page par type d’Expertise (cinq pages), une page par Origine (cinq pages) et une page par Sphère (cinq pages).';
  const paragraphs=(talentHub.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='p'));
  const existing=paragraphs.find(block=>/Les Talents sont regroupés/i.test(String(block.text||'')));
  if(existing) existing.text=sentence;
  else {
    if(!(talentHub.sections||[]).length) talentHub.sections=[{id:'catalogue',title:'Catalogue',level:3,blocks:[]}];
    talentHub.sections[0].blocks=talentHub.sections[0].blocks||[];
    talentHub.sections[0].blocks.push({type:'p',text:sentence,style:'RPG Body'});
  }
}

const expected={expertise:5,origin:5,sphere:5};
if(expertisePages.length!==expected.expertise) throw new Error(`Expertise: ${expertisePages.length} pages, attendu 5`);
if(originPages.length!==expected.origin) throw new Error(`Origine: ${originPages.length} pages, attendu 5`);
if(spherePages.length!==expected.sphere) throw new Error(`Sphère: ${spherePages.length} pages, attendu 5`);

const ids=new Set();
for(const page of rules){if(ids.has(page.id)) throw new Error(`ID dupliqué: ${page.id}`);ids.add(page.id)}

function writeDataset(id,pages,prefix){
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages)),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++) fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  const spec=specFor(id);spec.prefix=prefix;spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');
  return spec;
}
const spec=writeDataset('moteur',rules,'v3-regles-v4');
manifest.expectedTotal=manifest.datasets.reduce((sum,dataset)=>sum+Number(dataset.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`GRANULARITÉ TALENTS — Expertise ${expertisePages.length} · Origine ${originPages.length} · Sphère ${spherePages.length}.`);
console.log(`RÈGLES — ${spec.count} pages · total V3 ${manifest.expectedTotal}.`);
