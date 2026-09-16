import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
const BATCH='reality-dataset-v1';
const BOOK_BATCH='reality-setting-v1';
const SOURCE='TUC_Realite_V9_CROSSAUDIT_2026-09-10.docx';

function specFor(id){const spec=manifest.datasets.find(d=>d.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function load(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function removePrefix(prefix){if(!prefix)return;for(const file of fs.readdirSync(DATA))if(file.startsWith(`${prefix}-`)&&file.endsWith('.b64part'))fs.unlinkSync(`${DATA}/${file}`)}
function writeDataset(id,pages,prefix){
  const spec=specFor(id),old=spec.prefix;removePrefix(old);if(prefix!==old)removePrefix(prefix);
  const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages),'utf8'),{level:9,mtime:0}).toString('base64');
  const size=8000,parts=Math.ceil(b64.length/size);
  for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');
  Object.assign(spec,{prefix,parts,count:pages.length,sha256:crypto.createHash('sha256').update(b64).digest('hex')});
}
function byId(pages,id){const page=pages.find(p=>p.id===id);if(!page)throw new Error(`Page absente: ${id}`);return page}
function paragraph(text){return {type:'p',style:'lore reality-book-lore dataset-consolidation',text:String(text).trim()}}
function upsertSection(page,id,title,paragraphs){
  page.sections=Array.isArray(page.sections)?page.sections:[];
  const section={id,title,level:3,blocks:paragraphs.map(paragraph)};
  const indexes=page.sections.map((item,index)=>item.id===id?index:-1).filter(index=>index>=0);
  if(indexes.length>1)throw new Error(`${page.id}: section dupliquée ${id}`);
  if(indexes.length===1)page.sections[indexes[0]]=section;else page.sections.push(section);
  return section;
}
function sectionText(section){return [section.title||'',...(section.blocks||[]).map(block=>block.text||'')].join(' ')}

const retiredIds=[
  'realite-002-1-reperes-sociaux-de-realite',
  'realite-007-i-augmentations-esthetiques',
  'realite-008-ii-neuroware',
  'realite-009-iii-cyberoptique',
  'realite-010-iv-cyberaudio',
  'realite-011-v-augmentations-internes',
  'realite-012-vi-augmentations-dermiques-et-externes',
  'realite-013-vii-membres-cybernetiques',
  'realite-014-viii-cyborg-lourd',
  'realite-015-ix-biogenetique-terrestre',
  'realite-023-8-applications-holonet',
  'realite-024-9-catalogue-des-neuroprogrammes',
  'realite-031-4-armement-terrestre',
  'realite-032-5-munitions-et-accessoires',
  'realite-033-6-armures-et-protections',
  'realite-034-7-objets-usuels-et-materiel-technique',
  'realite-035-8-nourriture-boissons-et-drogues',
  'realite-036-9-services-soins-et-divertissements',
  'realite-037-10-logements-planques-et-securite',
  'realite-038-11-vehicules-et-transports',
];
const retiredSet=new Set(retiredIds);
if(retiredSet.size!==20)throw new Error('20 pages Réalité résiduelles attendues');

let reality=load('realite');
const before=reality.length;
const present=retiredIds.filter(id=>reality.some(page=>page.id===id));
if(present.length!==0&&present.length!==retiredIds.length)throw new Error(`État Réalité résiduel partiel: ${present.length}/20 pages présentes`);

const hub=byId(reality,'realite-001-chapitre-vivre-en-grande-californie');
const identity=byId(reality,'realite-lore-identite-culture-information');
for(const page of [hub,identity])if(page.realityBook?.batch!==BOOK_BATCH)throw new Error(`${page.id}: cible book-first V8 attendue`);

const spheres=upsertSection(hub,'reality-dataset-social-spheres','Les cinq Sphères du monde visible',[
  'La Grande Californie se lit aussi à travers cinq grandes Sphères sociales : Corporatiste, Gouvernementale, Mafieuse, Religieuse et Crawler. Elles désignent les principaux milieux d’appartenance, d’encadrement et de relations du monde visible plutôt que cinq espèces de personnages. Une corporation, une administration, une famille criminelle, une communauté de foi ou les réseaux indépendants des Crawlers proposent chacun leurs protections, leurs obligations, leurs codes et leurs portes d’entrée.',
  'La Sphère Corporatiste structure la vie autour de l’emploi, des services et des territoires privés. La Gouvernementale rassemble les administrations, agences, forces publiques et institutions civiques. La Mafieuse s’appuie sur les familles, les réseaux criminels et les économies grises. La Religieuse fait des communautés de foi de véritables structures sociales. La Sphère Crawler regroupe enfin les indépendants, contractuels et habitants des réseaux de l’Underlife qui cherchent à vivre hors des grandes appartenances institutionnelles.'
]);

const apps=upsertSection(identity,'reality-dataset-holonet-applications','Applications structurantes de l’Holonet',[
  'L’Holonet n’est pas un réseau abstrait : quelques applications servent de portes d’entrée quotidiennes à des pans entiers de la société. NavIA, éditée par ArcaNetwork, centralise navigation, avatar, synchronisation, achats et profil banco-identitaire. Call’infornia relie les citoyens aux services de l’État californien, au vote, aux consultations et au suivi législatif. LadyDolla, liée à Laguna Bank, agrège comptes, mouvements et alertes bancaires.',
  'La communication et les médias sont tout aussi concentrés. CeltX, de Tuatha, fournit une communication mondiale textuelle, vocale et neurale ; Securio, de Byron, vise les échanges sécurisés. Shelov organise l’écosystème musical commercial de Tuatha, tandis que BlackFlag diffuse musique, reprises et actualité des Mappeurs et des scènes Neopunks. Vatican+ et Islamaster donnent aux grandes institutions chrétiennes et musulmanes leurs propres espaces d’information et de sociabilité.',
  'Commerce, représentation et relations personnelles possèdent leurs plateformes. Boudicca, de Tuatha, est une grande place de marché grand public et un réseau de livraison. Redwish, de RedWheels, mêle réseau social, rencontres, services Pinklub/Pinkwish et économie de la popularité. AllBrains, d’ArcaNetwork, transforme des scans en modèles holographiques utilisables pour la modélisation, l’impression et les dispositifs de Deep Fake Live.',
  'Les Crawlers disposent eux aussi de leur infrastructure culturelle : Rampage X, lié à Abyss, rassemble contrats, informations de l’Underlife, accès au Big Black Market et salons communautaires. Son existence rappelle que l’Holonet officiel et les réseaux parallèles ne sont pas deux mondes séparés : ils se croisent en permanence, mais ne donnent ni les mêmes garanties ni les mêmes appartenances.'
]);

for(const page of [hub,identity])page.realityDatasetConsolidation={batch:BATCH,sourceDocument:SOURCE,retiredIds:[...retiredIds]};

const forbidden=/\bPTV\b|\bDGT\b|\b1d10e\b|\b\d+\s*PA\b|\bPRIX\b|\+\d|\bslot(?:s)?\b/i;
for(const section of [spheres,apps]){
  const text=sectionText(section);
  if(forbidden.test(text))throw new Error(`${section.id}: mécanique chiffrée détectée`);
  if((section.blocks||[]).some(block=>block.type==='table'))throw new Error(`${section.id}: table interdite`);
}

if(present.length===retiredIds.length)reality=reality.filter(page=>!retiredSet.has(page.id));
for(const id of retiredIds)if(reality.some(page=>page.id===id))throw new Error(`Page Réalité résiduelle encore présente: ${id}`);

const bookFirst=reality.filter(page=>page.realityBook?.batch===BOOK_BATCH);
if(reality.length!==9||bookFirst.length!==9)throw new Error(`Réalité finale incohérente: ${reality.length} pages, ${bookFirst.length} book-first, attendu 9/9`);
const ids=new Set();for(const page of reality){if(ids.has(page.id))throw new Error(`ID Réalité dupliqué: ${page.id}`);ids.add(page.id)}

writeDataset('realite',reality,'v3-realite-v5');
manifest.expectedTotal=manifest.datasets.reduce((sum,d)=>sum+Number(d.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');

console.log(`CONSOLIDATION DATASET RÉALITÉ — ${present.length} pages mécaniques/catalogues retirées · Sphères + Holonet préservés dans le lore.`);
console.log(`RÉALITÉ ${before} -> ${reality.length} · total V3 ${manifest.expectedTotal}.`);
