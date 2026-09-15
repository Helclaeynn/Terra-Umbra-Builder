import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function normalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function load(id){const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'))}
function flat(page){const out=[page.title||''];for(const section of page.sections||[]){out.push(section.title||'');for(const block of section.blocks||[]){if(block.type==='p')out.push(block.text||'');if(block.type==='table')for(const row of block.rows||[])out.push(...row)}}return out.join(' ')}
function findPage(pages,title){const page=pages.find(item=>normalize(item.title)===normalize(title));if(!page)throw new Error(`Page absente: ${title}`);return page}
function sectionTitles(page){return new Set((page.sections||[]).map(section=>normalize(section.title)))}

const truth=load('verite'),rules=load('moteur');
if(truth.length!==54)throw new Error(`Vérité: ${truth.length} pages, attendu 54`);

const forbidden=new Map([
  ['12. Autres descendants de Khinae',['Relais de chasse — 1 PTV','Piste sous les pistes — 2 PTV','Approche d’angle mort — 2 PTV','Arme ophidienne perfectionnée — 2 PTV']],
  ['13. Mages',['Construire et lancer un sort']],
  ['16. Aseryns',['Perception électromagnétique']],
  ['17. Exilés — peuples, fonctions et traditions',['Traits gratuits','Grace elfique — 6 PTV','Grâce elfique — 6 PTV']],
  ['18. Extrals, Homo Superior et Ad’rak',['Rebond d’appui — 1 PTV','Détachement réflexe — 2 PTV']],
  ['20. Corruption',['Stress augmentique','Variations permanentes d’Intégrité']],
  ['21. Les six Fléaux et le faux Septième',['Dons de Famine Blanche']],
]);
for(const [pageTitle,titles] of forbidden){const page=findPage(truth,pageTitle),sections=sectionTitles(page);for(const title of titles)if(sections.has(normalize(title)))throw new Error(`${pageTitle}: section mécanique résiduelle ${title}`)}

const preserved=[
  ['12. Autres descendants de Khinae','Une famille beaucoup plus vaste'],
  ['13. Mages','Le Mageius'],
  ['13. Mages','Affinité dominante'],
  ['16. Aseryns','Les Treize'],
  ['17. Exilés — peuples, fonctions et traditions','Des peuples d’autres mondes devenus terrestres'],
  ['18. Extrals, Homo Superior et Ad’rak','Des peuples de l’Histoire galactique'],
  ['20. Corruption','Humanité et Intégrité'],
  ['21. Les six Fléaux et le faux Septième','Cadre commun des Fléaux'],
];
for(const [pageTitle,sectionTitle] of preserved){const page=findPage(truth,pageTitle);if(!sectionTitles(page).has(normalize(sectionTitle)))throw new Error(`${pageTitle}: contexte perdu ${sectionTitle}`)}

const truth20=findPage(truth,'20. Corruption');
const corruptionBlocks=(truth20.sections||[]).flatMap(section=>section.blocks||[]);
if(corruptionBlocks.length!==1||corruptionBlocks[0].type!=='p'||!/L.Intégrité mesure jusqu.où/i.test(String(corruptionBlocks[0].text||'')))throw new Error('20. Corruption: le seul bloc conceptuel attendu n’est pas conservé');
if(corruptionBlocks.some(block=>block.type==='table'))throw new Error('20. Corruption: table mécanique encore présente');

const targetTruth=truth.filter(page=>/^(10\.|11\.|12\.|13\.|14\.|15\.|16\.|17\.|18\.|19\.|20\.|21\.)/.test(page.title||''));
for(const page of targetTruth){for(const section of page.sections||[]){if(/\bPTV\b/i.test(section.title||''))throw new Error(`${page.title}: titre PTV encore présent`);for(const block of section.blocks||[])if(/TUC Talent/i.test(String(block.style||'')))throw new Error(`${page.title}: style TUC Talent encore présent`)}}
if(/1d10e/i.test(flat(findPage(truth,'13. Mages'))))throw new Error('13. Mages: formule de jet encore présente dans Vérité');

const requiredRules=[
  ['Corruption — règles et progression','Humanité'],
  ['Fléaux — cadre commun','Fléaux'],
  ['Mage — lancement, Tension et Revers','Mécanique V6'],
  ['Aseryn — Perception électromagnétique','Lecture de champ'],
  ['Canidés errants — Coyote, Chacal, Lycaon, Dhole et Dingo','Relais de chasse'],
  ['Talass','Rebond d’appui'],
];
for(const [title,needle] of requiredRules){const page=findPage(rules,title);if(!flat(page).includes(needle))throw new Error(`${title}: mécanique attendue absente (${needle})`)}

console.log('VÉRITÉ LORE CLEAN OK — chapitres 10–21 sans stubs mécaniques ciblés, contexte narratif conservé.');
