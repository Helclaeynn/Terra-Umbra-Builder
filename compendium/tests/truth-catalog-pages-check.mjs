import fs from 'node:fs';
import zlib from 'node:zlib';

const manifest=JSON.parse(fs.readFileSync('compendium/data/manifest-v3.json','utf8'));
const sourceManifest=JSON.parse(fs.readFileSync('compendium/source/verite-catalog-v6.json','utf8'));
const sourceB64=fs.readFileSync(`compendium/source/${sourceManifest.file}`,'utf8').replace(/\s+/g,'');
const source=JSON.parse(zlib.gunzipSync(Buffer.from(sourceB64,'base64')).toString('utf8'));
const dataset=manifest.datasets.find(x=>x.id==='verite-catalogue');if(!dataset)throw new Error('dataset absent');
const b64=Array.from({length:dataset.parts},(_,i)=>fs.readFileSync(`compendium/data/${dataset.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'')).join('');
const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
if(rows.length!==source.entryCount||rows.length!==sourceManifest.entryCount||rows.length!==229)throw new Error(`count ${rows.length}`);

function norm(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function words(value,title=''){
  const excluded=new Set(norm(title).split(/\s+/).filter(Boolean));
  return norm(value).split(/\s+/).filter(Boolean).filter(word=>!excluded.has(word));
}
function shingles(value,title='',size=4){
  const tokens=words(value,title),out=new Set();
  for(let i=0;i<=tokens.length-size;i++)out.add(tokens.slice(i,i+size).join(' '));
  return out;
}
function overlapRatio(a,titleA,b,titleB){
  const aa=shingles(a,titleA),bb=shingles(b,titleB);if(!aa.size||!bb.size)return 0;
  let common=0;for(const item of aa)if(bb.has(item))common++;
  return common/Math.min(aa.size,bb.size);
}
function loreBlocks(article){return article.sections.find(x=>x.id==='contexte')?.blocks?.filter(x=>x.type==='p'&&x.style==='lore')||[];}
function loreText(article){return loreBlocks(article).map(x=>x.text).join(' ');}

const forbidden=/\b(?:builder|corpus|fiche|mj|joueur|jeu|scenario)\b/i;
const fillerPatterns=[
  /appartient aux objets et dispositifs qui donnent une forme concrete/i,
  /la preparation reste essentielle/i,
  /refl[eè]te la philosophie aidh/i,
  /reste utile precisement parce que son effet est reel/i,
  /fonction .* reste volontairement fermee et precise/i,
  /proprietes explicitement decrites ici/i
];
const sourceByName=new Map(source.entries.map(entry=>[entry.name,entry]));
for(const article of rows){
  if(article.category!=='Catalogue Vérité')throw new Error(`${article.title}: catégorie`);
  if(!article.illustration?.src)throw new Error(`${article.title}: illustration`);
  const lore=loreBlocks(article);if(lore.length!==2)throw new Error(`${article.title}: lore ${lore.length}`);
  const totalWords=lore.reduce((sum,p)=>sum+words(p.text).length,0);
  if(totalWords<45)throw new Error(`${article.title}: lore trop pauvre (${totalWords} mots)`);
  for(const p of lore){
    const normalized=norm(p.text);
    if(words(p.text).length<14)throw new Error(`${article.title}: paragraphe trop court (${words(p.text).length} mots)`);
    if(forbidden.test(normalized))throw new Error(`${article.title}: terme meta`);
    if(fillerPatterns.some(pattern=>pattern.test(normalized)))throw new Error(`${article.title}: remplissage générique détecté`);
  }
  const internal=overlapRatio(lore[0].text,article.title,lore[1].text,article.title);
  if(internal>0.60)throw new Error(`${article.title}: paragraphes trop similaires (${(internal*100).toFixed(1)}%)`);
  const table=article.sections.find(x=>x.id==='proprietes')?.blocks?.find(x=>x.type==='table');if(!table?.rows?.length)throw new Error(`${article.title}: table`);
  const sourceEntry=sourceByName.get(article.title);if(!sourceEntry)throw new Error(`${article.title}: source introuvable`);
  const evidence=article.catalog?.loreEvidence;if(!Array.isArray(evidence)||!evidence.length)throw new Error(`${article.title}: traçabilité lore absente`);
  const sourceLabels=new Set((sourceEntry.rows||[]).map(row=>String(row?.[0]||'')));
  if(evidence.some(label=>!sourceLabels.has(label)))throw new Error(`${article.title}: traçabilité lore invalide`);
}

let maxRatio=0,maxPair=[];
for(let i=0;i<rows.length;i++){
  for(let j=i+1;j<rows.length;j++){
    const ratio=overlapRatio(loreText(rows[i]),rows[i].title,loreText(rows[j]),rows[j].title);
    if(ratio>maxRatio){maxRatio=ratio;maxPair=[rows[i].title,rows[j].title];}
    if(ratio>0.60)throw new Error(`Lore >60% identique: ${rows[i].title} / ${rows[j].title} (${(ratio*100).toFixed(1)}%)`);
  }
}

const titles=new Set(rows.map(x=>x.title));if(titles.size!==rows.length)throw new Error('titres dupliqués');
for(const n of ['Excalibur / Ymir','Grande Orbe','Nacres noires','Nahfr','Mue de Rulfam','Lance de Longinus']){
  const article=rows.find(x=>x.title===n);if(!article)throw new Error(`${n}: absent`);if(article.catalog.availabilityStatus!=='unique')throw new Error(`${n}: statut unique absent`);
}
const chapters=new Set(rows.map(x=>x.catalog.chapter));for(const c of ['22','23','24','25','26','27'])if(!chapters.has(c))throw new Error(`chapitre ${c} absent`);
const detailChecks={
  'Grande Orbe':['bellatheis','sharith','ascendances'],
  'Nacres noires':['yeux','abominations','metastasismancie'],
  'Raven Null Cage':['dizaine de minutes','un mode','mauvais diagnostic'],
  'Defensor':['generateur de projectiles','cartouche source','1 000 tirs'],
  'GO-02':['reliquat rocreen','m3','anciens'],
  'Lance de Longinus':['ordre','nature exacte','v aagor']
};
for(const [title,needles] of Object.entries(detailChecks)){
  const article=rows.find(x=>x.title===title);const text=norm(loreText(article));
  for(const needle of needles)if(!text.includes(norm(needle)))throw new Error(`${title}: détail source absent (${needle})`);
}
console.log(`Catalogue Vérité OK — ${rows.length} pages · max similarité ${(maxRatio*100).toFixed(1)}% (${maxPair.join(' / ')}) · 6 artefacts uniques · chapitres 22–27.`);
