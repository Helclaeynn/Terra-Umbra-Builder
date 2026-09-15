import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

const DATA='compendium/data';
const manifestPath=`${DATA}/manifest-v3.json`;
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));

function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function specFor(id){const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);return spec}
function loadDataset(id){const spec=specFor(id);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function blockText(block){return block?.type==='table'?(block.rows||[]).flat().join(' '):String(block?.text||'')}
function findPage(pages,title){const page=pages.find(item=>normalize(item.title)===normalize(title));if(!page)throw new Error(`Page Vérité absente: ${title}`);return page}
function removeSections(page,titles){const forbidden=new Set(titles.map(normalize)),before=(page.sections||[]).length;page.sections=(page.sections||[]).filter(section=>!forbidden.has(normalize(section.title)));return before-page.sections.length}
function writeDataset(id,pages,prefix){const b64=zlib.gzipSync(Buffer.from(JSON.stringify(pages)),{level:9,mtime:0}).toString('base64'),size=8000,parts=Math.ceil(b64.length/size);for(let i=0;i<parts;i++)fs.writeFileSync(`${DATA}/${prefix}-${String(i).padStart(2,'0')}.b64part`,`${b64.slice(i*size,(i+1)*size)}\n`,'utf8');const spec=specFor(id);spec.prefix=prefix;spec.parts=parts;spec.count=pages.length;spec.sha256=crypto.createHash('sha256').update(b64).digest('hex');return spec}

const truth=loadDataset('verite');
let removedSections=0,removedBlocks=0;

removedSections+=removeSections(findPage(truth,'12. Autres descendants de Khinae'),[
  'Relais de chasse — 1 PTV',
  'Piste sous les pistes — 2 PTV',
  'Approche d’angle mort — 2 PTV',
  'Arme ophidienne perfectionnée — 2 PTV',
]);
removedSections+=removeSections(findPage(truth,'13. Mages'),['Construire et lancer un sort']);
removedSections+=removeSections(findPage(truth,'16. Aseryns'),['Perception électromagnétique']);
removedSections+=removeSections(findPage(truth,'17. Exilés — peuples, fonctions et traditions'),['Traits gratuits','Grace elfique — 6 PTV','Grâce elfique — 6 PTV']);
removedSections+=removeSections(findPage(truth,'18. Extrals, Homo Superior et Ad’rak'),['Rebond d’appui — 1 PTV','Détachement réflexe — 2 PTV']);

const corruption=findPage(truth,'20. Corruption');
const integrity=(corruption.sections||[]).find(section=>normalize(section.title)===normalize('Humanité et Intégrité'));
if(!integrity)throw new Error('Section Humanité et Intégrité absente de Vérité / Corruption');
const beforeIntegrity=(integrity.blocks||[]).length;
integrity.blocks=(integrity.blocks||[]).filter(block=>/L.Intégrité mesure jusqu.où un individu peut être transformé/i.test(blockText(block)));
removedBlocks+=beforeIntegrity-integrity.blocks.length;
if(integrity.blocks.length!==1)throw new Error(`Corruption: ${integrity.blocks.length} bloc conceptuel conservé, attendu 1`);
removedSections+=removeSections(corruption,['Stress augmentique','Variations permanentes d’Intégrité']);

removedSections+=removeSections(findPage(truth,'21. Les six Fléaux et le faux Septième'),['Dons de Famine Blanche']);

const expectedClean=[
  ['12. Autres descendants de Khinae',['Une famille beaucoup plus vaste','Canidés errants : vivre sans une civilisation de Pelages']],
  ['13. Mages',['Le Mageius','Avant les sociétés humaines']],
  ['16. Aseryns',['Les enfants de Serathè','Les Treize']],
  ['17. Exilés — peuples, fonctions et traditions',['Des peuples d’autres mondes devenus terrestres']],
  ['18. Extrals, Homo Superior et Ad’rak',['Des peuples de l’Histoire galactique','Profils rares']],
  ['20. Corruption',['Humanité et Intégrité']],
  ['21. Les six Fléaux et le faux Septième',['Cadre commun des Fléaux']],
];
for(const [pageTitle,sections] of expectedClean){const page=findPage(truth,pageTitle);for(const title of sections)if(!(page.sections||[]).some(section=>normalize(section.title)===normalize(title)))throw new Error(`${pageTitle}: section de contexte perdue: ${title}`)}

const targetPages=truth.filter(page=>/^(10\.|11\.|12\.|13\.|14\.|15\.|16\.|17\.|18\.|19\.|20\.|21\.)/.test(page.title||''));
for(const page of targetPages){
  for(const section of page.sections||[]){
    if(/\bPTV\b/i.test(section.title||''))throw new Error(`${page.title}: titre mécanique PTV encore présent: ${section.title}`);
    for(const block of section.blocks||[])if(/TUC Talent/i.test(String(block.style||'')))throw new Error(`${page.title}: bloc TUC Talent encore présent dans Vérité`);
  }
}
if((findPage(truth,'13. Mages').sections||[]).some(section=>(section.blocks||[]).some(block=>/1d10e/i.test(blockText(block)))))throw new Error('13. Mages: jet mécanique 1d10e encore présent');
if((corruption.sections||[]).some(section=>(section.blocks||[]).some(block=>block.type==='table')))throw new Error('20. Corruption: table mécanique encore présente dans Vérité');

const output=writeDataset('verite',truth,'v3-verite-lore-clean-v1');
manifest.expectedTotal=manifest.datasets.reduce((sum,dataset)=>sum+Number(dataset.count||0),0);
fs.writeFileSync(manifestPath,`${JSON.stringify(manifest,null,2)}\n`,'utf8');
console.log(`NETTOYAGE VÉRITÉ — ${removedSections} sections mécaniques + ${removedBlocks} blocs retirés · ${truth.length} pages lore conservées.`);
console.log(`VÉRITÉ CLEAN — ${output.parts} fragments · total V3 ${manifest.expectedTotal}.`);
