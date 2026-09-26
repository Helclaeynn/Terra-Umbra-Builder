import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
const spec=manifest.datasets.find(x=>x.id==='bestiaire');
if(!spec) throw new Error('Dataset bestiaire absent');
if(spec.count!==281) throw new Error(`Bestiaire: ${spec.count} entrées, attendu 281`);

let b64='';
for(let i=0;i<spec.parts;i++){
  const path=`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`;
  if(!fs.existsSync(path)) throw new Error(`Fragment absent: ${path}`);
  b64+=fs.readFileSync(path,'utf8').replace(/\s+/g,'');
}
const sha=crypto.createHash('sha256').update(b64).digest('hex');
if(sha!==spec.sha256) throw new Error(`SHA bestiaire invalide ${sha} != ${spec.sha256}`);

const rows=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
if(rows.length!==281) throw new Error(`Bestiaire décodé: ${rows.length}, attendu 281`);
if(new Set(rows.map(x=>x.id)).size!==281) throw new Error('IDs Bestiaire non uniques');

const chapter1=rows.filter(x=>x.bestiary?.chapter?.startsWith('1.'));
const chapter2=rows.filter(x=>x.bestiary?.chapter?.startsWith('2.'));
if(chapter1.length!==131||chapter2.length!==150){
  throw new Error(`Répartition Bestiaire invalide: chapitre 1=${chapter1.length}, chapitre 2=${chapter2.length}`);
}

for(const row of rows){
  if(row.category!=='Bestiaire') throw new Error(`${row.title}: catégorie ${row.category}`);
  const description=(row.sections||[]).find(s=>s.id==='description');
  const mj=(row.sections||[]).find(s=>s.id==='dossier-mj');
  if(!description?.blocks?.some(b=>String(b.text||'').trim())) throw new Error(`${row.title}: description publique absente`);
  if(description.audience==='mj') throw new Error(`${row.title}: description marquée MJ`);
  if(mj?.audience!=='mj'||!mj.blocks?.length) throw new Error(`${row.title}: dossier MJ absent`);
  if(!row.bestiary?.hook) throw new Error(`${row.title}: hook MJ absent`);
  if(!row.illustration?.src) throw new Error(`${row.title}: emplacement illustration absent`);
  if(!Array.isArray(row.tags)||!row.tags.includes(row.bestiary.chapter)) throw new Error(`${row.title}: chapitre absent des tags`);
  if(row.bestiary.family&&!row.tags.includes(row.bestiary.family)) throw new Error(`${row.title}: famille absente des tags`);
  if(row.bestiary.subfamily&&!row.tags.includes(row.bestiary.subfamily)) throw new Error(`${row.title}: sous-famille absente des tags`);
}

const forbidden=[
  /\bTUC\b/i,/classification/i,/\bcorpus\b/i,/\bfiche\b/i,/\bMJ\b/i,/\bsc[ée]nario\b/i,
  /bloc g[ée]n[ée]rique/i,/jouable/i,/catalogue d['’]?[ée]quipement/i,/source de corruption/i,
  /\btradition\s*:/i,/\borigine\s*:/i,/les archives/i,/les dossiers/i
];
const exact=new Map();
let publicParagraphs=0;
for(const row of chapter2){
  const description=(row.sections||[]).find(s=>s.id==='description');
  if(!description||description.blocks.length<2) throw new Error(`${row.title}: lore de Vérité insuffisamment développé`);
  for(const block of description.blocks){
    const text=String(block.text||'').trim();
    if(!text) throw new Error(`${row.title}: paragraphe public vide`);
    for(const re of forbidden) if(re.test(text)) throw new Error(`${row.title}: formulation non diégétique (${re})`);
    const key=text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
    if(exact.has(key)) throw new Error(`Paragraphe public dupliqué: ${row.title} / ${exact.get(key)}`);
    exact.set(key,row.title);
    publicParagraphs++;
  }
}
if(publicParagraphs<300) throw new Error(`Enrichissement insuffisant: ${publicParagraphs} paragraphes publics`);

const dive=rows.find(x=>x.id==='bestiaire-v16-dive');
if(!dive) throw new Error('Dive absent');
if(dive.bestiary.chapter!=='2.2 Ombres et entités de l’Ombremonde'||dive.bestiary.family!=='Voyageurs') throw new Error('Dive mal classé');
const diveMj=dive.sections.find(s=>s.id==='dossier-mj');
if(!diveMj?.blocks?.some(b=>String(b.text).includes('DÉF. PHYSIQUE 12 (+1d10e active)'))) throw new Error('Dive: défense physique active absente');
if(!diveMj?.blocks?.some(b=>String(b.text).includes('DÉF. OCCULTE 15 (+1d10e active)'))) throw new Error('Dive: défense occulte active absente');

const wendigo=rows.find(x=>x.title==='Wendigo');
if(!wendigo) throw new Error('Wendigo absent');
if(wendigo.bestiary.chapter!=='2.10 Fléaux, Ruptures et Abominations') throw new Error('Wendigo: mauvais chapitre');
if(wendigo.bestiary.family!=='Vhodhal — la Famine Blanche') throw new Error('Wendigo: mauvaise famille');
if(wendigo.tags.some(t=>/revenant/i.test(t))) throw new Error('Wendigo classé à tort parmi les Revenants');

console.log(`Bestiaire V17 OK — ${rows.length} fiches · ${chapter1.length} Réalité · ${chapter2.length} Vérité · ${publicParagraphs} paragraphes publics Vérité · Dive présent · SHA ${sha.slice(0,12)}…`);
