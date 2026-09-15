import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const SOURCE='compendium/source/verite-catalog-v6.json';
const DATA='compendium/data';
const ASSETS='compendium/assets';
const MANIFEST=`${DATA}/manifest-v3.json`;
const PREFIX='v3-verite-catalogue-v6';
const DATASET_ID='verite-catalogue';
const CATEGORY='Catalogue Vérité';
const FRAGMENT_SIZE=8000;

function normText(value){
  return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}
function slug(value){return normText(value).replace(/\s+/g,'-').replace(/^-+|-+$/g,'')||'item';}
function displayValue(v){
  if(v===null||v===undefined)return '';
  if(Array.isArray(v))return v.map(displayValue).filter(Boolean).join(' · ');
  if(typeof v==='object')return JSON.stringify(v);
  return String(v).trim();
}
function sanitizeLore(text){
  return String(text||'')
    .replace(/\bBuilder\b/gi,'')
    .replace(/\bcorpus\b/gi,'ensemble de connaissances')
    .replace(/\bfiche\b/gi,'description')
    .replace(/\bsc[eé]nario\b/gi,'circonstance exceptionnelle')
    .replace(/\bjoueurs?\b/gi,'personnes')
    .replace(/\bMJ\b/g,'')
    .replace(/\bjeu\b/gi,'usage')
    .replace(/\bPTV\b/g,'')
    .replace(/\s+/g,' ')
    .trim();
}
function rowValue(entry,labelPattern){
  const row=(entry.rows||[]).find(([label])=>labelPattern.test(normText(label)));
  return row?displayValue(row[1]):'';
}
function usableHint(entry){
  const candidates=[
    entry.loreHint,
    rowValue(entry,/^description$/),
    rowValue(entry,/^statut$/),
    rowValue(entry,/^role$/),
    rowValue(entry,/^nature$/)
  ].map(sanitizeLore).filter(Boolean);
  for(const text of candidates){
    if(text.length<35)continue;
    if(/\b(?:dgt|pa|difficulte|portee|armure|perforant|prix|reserve|marche)\b/i.test(normText(text)))continue;
    return text.replace(/[.;]\s*$/,'')+'.';
  }
  return '';
}
function contextParagraph(entry){
  const name=entry.name;
  if(entry.sourceKind==='artifact' || entry.status==='unique'){
    return `Parmi les pièces que les occultistes, services secrets et collectionneurs avertis ne traitent jamais comme de simples marchandises, ${name} occupe une place à part. Sa valeur tient d’abord à son histoire, à sa provenance et aux forces qui s’y attachent.`;
  }
  switch(String(entry.chapter)){
    case '22':
      return `Dans les réseaux qui travaillent avec la Vérité, ${name} sert de langage commun pour décrire des effets que le matériel profane ne suffit pas à résumer. Ces distinctions permettent de savoir ce qu’un dispositif peut réellement accomplir face à la matière, au sacré, à l’invisible ou à la technologie.`;
    case '23':
      return `Dans les cellules de Chasse de la Grande Californie, ${name} appartient à l’arsenal des professionnels qui préparent leurs interventions contre des menaces dont la nature n’est pas toujours visible au premier regard. Son intérêt dépend autant du bon diagnostic que de l’objet lui-même.`;
    case '24':
      return `Dans les Jadecenters, les ateliers whurtens et les réseaux azménoriens, ${name} circule avec la réputation de son fabricant autant qu’avec sa fonction. Ces objets restent des outils spécialisés : ils transmettent une capacité précise sans offrir à leur porteur le savoir de celui qui les a conçus.`;
    case '25':
      return `Sur les marchés Shaediri et dans les diasporas xénos de Los Demonos, ${name} se négocie autant par relations que par monnaie. Son origine, son ergonomie et la possibilité de l’entretenir sur Terre comptent souvent davantage que sa simple puissance.`;
    case '26':
      return `Dans la logistique AIDH, ${name} s’inscrit dans une doctrine où le matériel, l’autorisation et le réseau forment un tout. Même lorsqu’un appareil paraît autonome, sa véritable efficacité dépend de la maintenance, des habilitations et des infrastructures capables de le soutenir.`;
    case '27':
      return `Dans les caches de cultes, laboratoires noirs et dépôts de quarantaine, ${name} n’est jamais considéré comme un objet neutre. Sa fonction est inséparable de la Source ou du principe de Fléau qui le rend possible, ce qui transforme chaque manipulation en décision à risque.`;
    default:
      return `${name} appartient aux objets et dispositifs qui donnent une forme concrète à la Vérité cachée de Terra Umbra. Sa présence suffit souvent à révéler le niveau de connaissance, de ressources ou de danger du réseau qui le possède.`;
  }
}
function fallbackSecond(entry){
  const name=entry.name;
  if(entry.sourceKind==='artifact' || entry.status==='unique'){
    return `${name} ne possède pas de prix normal : son accès dépend d’un héritage, d’une prise, d’une dette ou d’un événement exceptionnel. Ceux qui le recherchent s’intéressent moins à sa valeur marchande qu’aux conséquences de sa possession.`;
  }
  if(String(entry.chapter)==='23')return `Pour ${name}, la préparation reste essentielle : les chasseurs expérimentés savent qu’un outil spécialisé ne remplace ni l’identification de la menace ni la compréhension de ses véritables vulnérabilités.`;
  if(String(entry.chapter)==='24')return `La fonction de ${name} reste volontairement fermée et précise. Sa diffusion dépend donc des artisans, intermédiaires ou ateliers capables de le préparer, de le recharger ou de le réparer sans altérer ce qui le rend utile.`;
  if(String(entry.chapter)==='25')return `Employer ${name} sur Terre suppose souvent adaptation, alimentation et pièces de rechange. Un exemplaire obtenu sans filière peut devenir rapidement plus difficile à maintenir qu’à acquérir.`;
  if(String(entry.chapter)==='26')return `${name} reflète la philosophie AIDH : donner à l’agent une fonction claire, fiable et contrôlée, sans confondre sophistication technique et connaissance surnaturelle universelle.`;
  if(String(entry.chapter)==='27')return `${name} reste utile précisément parce que son effet est réel, mais cette efficacité s’accompagne d’une proximité dangereuse avec une Source. Les organisations prudentes privilégient donc confinement, traçabilité et usage limité.`;
  return `${name} sert avant tout de repère technique commun aux différents réseaux qui opèrent au contact de la Vérité.`;
}
function loreParagraphs(entry){
  const first=contextParagraph(entry);
  const hint=usableHint(entry);
  const second=hint?`${hint} ${fallbackSecond(entry)}`:fallbackSecond(entry);
  return [sanitizeLore(first),sanitizeLore(second)];
}
function mechanicsRows(entry){
  const rows=[];
  rows.push(['Livre','V — Équipement de Vérité et catalogues']);
  rows.push(['Chapitre',String(entry.chapter)]);
  if(entry.section)rows.push(['Section',entry.section]);
  if(entry.status==='unique')rows.push(['Statut','Unique / hors acquisition normale']);
  else if(entry.status==='hors_catalogue')rows.push(['Statut','Hors acquisition standard']);
  else if(entry.status==='reference')rows.push(['Statut','Référence de catalogue']);
  for(const row of entry.rows||[]){
    const label=displayValue(row?.[0]),value=displayValue(row?.[1]);
    if(label&&value)rows.push([label,value]);
  }
  return rows;
}
function articleFor(entry,index){
  const [p1,p2]=loreParagraphs(entry);
  const artifact=entry.sourceKind==='artifact'||entry.status==='unique';
  const tags=['Vérité','Livre V',`Chapitre ${entry.chapter}`,entry.section,...(entry.tags||[])].filter(Boolean);
  if(entry.status==='unique')tags.push('Artefact unique');
  return {
    id:`verite-catalogue-${String(index+1).padStart(3,'0')}-${slug(entry.name)}`,
    title:entry.name,
    category:CATEGORY,
    status:'canon_recent',
    source:'TUC Vérité V6 — Livre V',
    tags:[...new Set(tags)],
    illustration:{
      src:artifact?'assets/truth-artifact-placeholder.svg':'assets/truth-catalog-placeholder.svg',
      alt:`Illustration de ${entry.name}`,
      caption:artifact?'Illustration d’artefact à venir':'Illustration à venir'
    },
    catalog:{kind:'truth-catalog',id:entry.id,chapter:String(entry.chapter),section:entry.section,sourceKind:entry.sourceKind,availabilityStatus:entry.status},
    sections:[
      {id:'contexte',title:'Dans la Vérité',level:2,blocks:[{type:'p',style:'lore',text:p1},{type:'p',style:'lore',text:p2}]},
      {id:'proprietes',title:'Propriétés et statut',level:2,blocks:[{type:'table',rows:mechanicsRows(entry)}]}
    ]
  };
}
function writeDataset(rows){
  for(const file of fs.readdirSync(DATA))if(file.startsWith(`${PREFIX}-`)&&file.endsWith('.b64part'))fs.unlinkSync(path.join(DATA,file));
  const payload=JSON.stringify(rows),b64=zlib.gzipSync(Buffer.from(payload,'utf8'),{level:9}).toString('base64'),parts=Math.ceil(b64.length/FRAGMENT_SIZE);
  for(let i=0;i<parts;i++)fs.writeFileSync(path.join(DATA,`${PREFIX}-${String(i).padStart(2,'0')}.b64part`),b64.slice(i*FRAGMENT_SIZE,(i+1)*FRAGMENT_SIZE));
  return {id:DATASET_ID,prefix:PREFIX,parts,count:rows.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')};
}
function placeholder(title,subtitle,accent='#8d9aa3'){
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#101820"/><rect x="36" y="36" width="1128" height="603" rx="24" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="14 12"/><text x="600" y="315" text-anchor="middle" fill="#d6dde2" font-family="Arial,sans-serif" font-size="48">${title}</text><text x="600" y="370" text-anchor="middle" fill="${accent}" font-family="Arial,sans-serif" font-size="24">${subtitle}</text></svg>`;
}

fs.mkdirSync(DATA,{recursive:true});fs.mkdirSync(ASSETS,{recursive:true});
const sourceManifest=JSON.parse(fs.readFileSync(SOURCE,'utf8'));
if(sourceManifest.encoding!=='gzip+base64'||!sourceManifest.file)throw new Error('Source Vérité: manifeste compressé invalide');
const sourceB64=fs.readFileSync(path.join(path.dirname(SOURCE),sourceManifest.file),'utf8').replace(/\s+/g,'');
const source=JSON.parse(zlib.gunzipSync(Buffer.from(sourceB64,'base64')).toString('utf8'));
if(!Array.isArray(source.entries)||source.entries.length!==Number(source.entryCount)||source.entries.length!==Number(sourceManifest.entryCount))throw new Error('Source Vérité: nombre d’entrées incohérent');
const ids=new Set(),names=new Set();
for(const entry of source.entries){
  if(!entry.id||!entry.name||!entry.chapter||!Array.isArray(entry.rows)||!entry.rows.length)throw new Error(`Source Vérité invalide: ${entry.name||entry.id||'entrée sans nom'}`);
  if(ids.has(entry.id))throw new Error(`ID source Vérité dupliqué: ${entry.id}`);ids.add(entry.id);
  const n=normText(entry.name);if(names.has(n))throw new Error(`Titre source Vérité dupliqué: ${entry.name}`);names.add(n);
}
const rows=source.entries.map(articleFor);
const forbidden=/\b(?:builder|corpus|fiche|mj|joueur|jeu|scenario)\b/i;
for(const article of rows){
  const lore=article.sections.find(s=>s.id==='contexte')?.blocks?.filter(b=>b.type==='p'&&b.style==='lore')||[];
  if(lore.length!==2)throw new Error(`${article.title}: deux paragraphes de lore requis`);
  for(const p of lore)if(forbidden.test(normText(p.text)))throw new Error(`${article.title}: terme méta interdit dans le lore`);
  const table=article.sections.find(s=>s.id==='proprietes')?.blocks?.find(b=>b.type==='table');
  if(!table||!Array.isArray(table.rows)||!table.rows.length)throw new Error(`${article.title}: tableau requis`);
  if(!article.illustration?.src)throw new Error(`${article.title}: illustration requise`);
}
const spec=writeDataset(rows);
fs.writeFileSync(`${ASSETS}/truth-catalog-placeholder.svg`,placeholder('Illustration à venir','Catalogue Vérité · Terra Umbra California','#8aa5b8'));
fs.writeFileSync(`${ASSETS}/truth-artifact-placeholder.svg`,placeholder('Artefact unique','Vérité · illustration à venir','#b89d8a'));

const manifest=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));manifest.generated=new Date().toISOString().slice(0,10);
if(!manifest.categories.includes(CATEGORY))manifest.categories.push(CATEGORY);
manifest.datasets=manifest.datasets.filter(x=>x.id!==DATASET_ID);
const truthIndex=manifest.datasets.findIndex(x=>x.id==='verite');manifest.datasets.splice(truthIndex>=0?truthIndex+1:manifest.datasets.length,0,spec);
manifest.expectedTotal=manifest.datasets.reduce((sum,x)=>sum+Number(x.count||0),0);fs.writeFileSync(MANIFEST,JSON.stringify(manifest,null,2)+'\n');
const unique=rows.filter(x=>x.catalog.availabilityStatus==='unique');
console.log(`Catalogue Vérité généré — ${rows.length} pages · ${unique.length} artefacts uniques · total V3 ${manifest.expectedTotal}`);
console.log(`Dataset ${PREFIX} — ${spec.parts} fragments · SHA ${spec.sha256}`);
