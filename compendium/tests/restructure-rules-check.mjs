import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));
function load(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);if(!spec)throw new Error(`Dataset absent: ${id}`);
  let b64='';for(let i=0;i<spec.parts;i++)b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function flat(page){
  const out=[page.title||'',...(page.tags||[])];
  for(const section of page.sections||[]){out.push(section.title||'');for(const block of section.blocks||[]){if(block.type==='p')out.push(block.text||'');if(block.type==='table')for(const row of block.rows||[])out.push(...row)}}
  return out.join(' ');
}
function tagged(page,tag){return (page.tags||[]).includes(tag)}
function tableDataRows(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table').flatMap(block=>(block.rows||[]).slice(1)))}
function builderTruthRows(page){return (page.sections||[]).flatMap(section=>(section.blocks||[]).filter(block=>block.type==='table'&&block.rows?.[0]?.[0]==='Talent / capacité').flatMap(block=>(block.rows||[]).slice(1)))}
function walkArrays(root){
  const rows=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.isFile()&&entry.name.endsWith('.json')){const parsed=JSON.parse(fs.readFileSync(full,'utf8'));if(Array.isArray(parsed))for(const item of parsed)if(item&&item.name)rows.push({...item,__file:full.replaceAll('\\','/')})}}}walk(root);return rows;
}
function tuple(row){return JSON.stringify([String(row.name||''),row.cost==null?'—':`${row.cost} PTV`,String(row.access||'—'),String(row.prerequisiteName||'—'),String(row.effect||'')])}

const rules=load('moteur'),reality=load('realite'),truth=load('verite');
if(rules.some(page=>page.category!=='Règles'))throw new Error('Le dataset moteur contient une page hors catégorie Règles');
if(reality.some(page=>page.category==='Règles'))throw new Error('Une page Règles reste dans Réalité');
if(truth.some(page=>page.category==='Règles'))throw new Error('Une page Règles reste dans Vérité');
if(rules.some(page=>/^regles-realite-talent-|^regles-realite-desavantage-/.test(page.id||'')))throw new Error('Des fiches atomiques Talent/Désavantage subsistent');

const commonTalents=rules.find(page=>page.title==='Talents communs de Réalité');
if(!commonTalents||tableDataRows(commonTalents).length!==12)throw new Error('Talents communs de Réalité: 12 entrées attendues');
const expertisePages=rules.filter(page=>page.id?.startsWith('regles-realite-talents-expertise-'));
const originPages=rules.filter(page=>page.id?.startsWith('regles-realite-talents-origine-'));
const spherePages=rules.filter(page=>page.id?.startsWith('regles-realite-talents-sphere-'));
if(expertisePages.length!==5||expertisePages.flatMap(tableDataRows).length!==25)throw new Error(`Expertise: ${expertisePages.length} pages / ${expertisePages.flatMap(tableDataRows).length} Talents, attendu 5 / 25`);
if(originPages.length!==5||originPages.flatMap(tableDataRows).length!==25)throw new Error(`Origine: ${originPages.length} pages / ${originPages.flatMap(tableDataRows).length} Talents, attendu 5 / 25`);
if(spherePages.length!==5||spherePages.flatMap(tableDataRows).length!==60)throw new Error(`Sphère: ${spherePages.length} pages / ${spherePages.flatMap(tableDataRows).length} Talents, attendu 5 / 60`);
for(const title of ['Désavantages communs de Réalité','Désavantages liés aux Attributs','Désavantages de Sphère'])if(!rules.some(page=>page.title===title))throw new Error(`Page Désavantages absente: ${title}`);
const disadvantageCount=['Désavantages communs de Réalité','Désavantages liés aux Attributs','Désavantages de Sphère'].flatMap(title=>tableDataRows(rules.find(page=>page.title===title))).length;
if(disadvantageCount!==55)throw new Error(`Désavantages: ${disadvantageCount}, attendu 55`);
const talentHub=rules.find(page=>page.title==='Talents de Réalité — règles générales');
const disadvantageHub=rules.find(page=>page.title==='Désavantages de Réalité — règles générales');
if(!talentHub||!disadvantageHub)throw new Error('Hubs Talents/Désavantages absents');
if(!/pages/i.test(flat(talentHub))||!/trois pages/i.test(flat(disadvantageHub)))throw new Error('Les hubs ne décrivent pas la structure regroupée');
if(!/minimum Confortable/i.test(flat(commonTalents))||!/Aisé à Luxe/i.test(flat(commonTalents)))throw new Error('Fier héritier ne porte pas l’arbitrage canonique récent');
if(!/Apprentissage fulgurant/i.test(flat(commonTalents))||!/2 XP/i.test(flat(commonTalents))||!/scénario/i.test(flat(commonTalents)))throw new Error('Apprentissage fulgurant n’est pas consolidé');

const truthSource=walkArrays('character-builder/rulesets/terra-umbra/truth/talents');
const truthPages=rules.filter(page=>tagged(page,'Talent de Vérité'));
const actualRows=truthPages.flatMap(builderTruthRows);
if(truthSource.length!==347)throw new Error(`Source Builder Vérité inattendue: ${truthSource.length} entrées, 347 attendues`);
if(actualRows.length!==truthSource.length)throw new Error(`Couverture Vérité Builder: ${actualRows.length} lignes pour ${truthSource.length} capacités Builder`);
const expectedMultiset=new Map(),actualMultiset=new Map();
for(const item of truthSource){const key=tuple(item);expectedMultiset.set(key,(expectedMultiset.get(key)||0)+1)}
for(const row of actualRows){const key=JSON.stringify(row.slice(0,5).map(value=>String(value)));actualMultiset.set(key,(actualMultiset.get(key)||0)+1)}
for(const [key,count] of expectedMultiset){if(actualMultiset.get(key)!==count)throw new Error(`Capacité Vérité absente ou dupliquée: ${key} · attendu ${count}, trouvé ${actualMultiset.get(key)||0}`)}
if(actualMultiset.size!==expectedMultiset.size)throw new Error('Des lignes Builder Vérité non canoniques ont été générées');

const representative=[
  ['Sang Écarlate — Anya',['Vision du Sang','Traque hématique','Déferlement écarlate','Surrégime']],
  ['Krovni Rytsari',['Présence du Conquérant','Ordre impérieux','Maître de guerre']],
  ['Oracle / Tentateur',['Lecture superficielle','Lecture profonde']],
  ['Sang Écarlate — Keyna',['Vision du Sang','Surrégime']],
  ['Angelus — Trône',['Lecture superficielle','Lecture profonde']],
  ['Mage — Talents communs',['Équilibrage du Flux','Héritage familial']],
];
for(const [title,names] of representative){const page=truthPages.find(p=>p.title===title);if(!page)throw new Error(`Sous-ensemble mécanique absent: ${title}`);const text=flat(page);for(const name of names)if(!text.includes(name))throw new Error(`${title}: capacité absente ${name}`)}

const core=JSON.parse(fs.readFileSync('character-builder/rulesets/terra-umbra/truth/core.json','utf8'));
const naturePages=rules.filter(page=>tagged(page,'Nature')&&tagged(page,'Vérité'));
if(naturePages.length!==(core.natures||[]).length)throw new Error(`Pages de Nature: ${naturePages.length}, attendu ${(core.natures||[]).length}`);
for(const nature of core.natures||[]){const page=rules.find(p=>p.id===`regles-verite-nature-${String(nature.id).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-')}`);if(!page)throw new Error(`Page de Nature absente: ${nature.name}`);const text=flat(page);for(const trait of nature.freeTraits||[])if(!text.includes(trait.name)||!text.includes(trait.effect))throw new Error(`${nature.name}: trait gratuit absent ${trait.name}`);for(const choice of nature.choices||[])for(const option of choice.options||[])if(!text.includes(option.name))throw new Error(`${nature.name}: option absente ${option.name}`)}

const truthCommonRules=['1. Architecture de la Vérité','2. Points de Vérité, accès et conception des Talents','3. PA, Réactions, durées et non-cumul','4. Défense occulte et Puissance des effets','5. Hologramme, Voile, Semi-Révélation et Révélation','6. Continuité corporelle, objets et Mobilité ailée','7. Humains, Chasseurs reconnus, Humanité et Intégrité','8. Compagnons liés et réseaux de Vérité','9. Équipement de Vérité — principe commun'];
for(const title of truthCommonRules){if(!rules.some(page=>page.title===title&&tagged(page,'Vérité')))throw new Error(`Règle commune Vérité non migrée: ${title}`);if(truth.some(page=>page.title===title))throw new Error(`Règle commune Vérité dupliquée dans Vérité: ${title}`)}

const ids=new Set();for(const page of [...rules,...reality,...truth]){if(ids.has(page.id))throw new Error(`ID dupliqué: ${page.id}`);ids.add(page.id)}
console.log(`RESTRUCTURE MÉCANIQUE OK — Règles ${rules.length} · Réalité ${reality.length} · Vérité ${truth.length}.`);
console.log('Réalité — 1 page commune · 5 Expertise · 5 Origine · 5 Sphère · 55 Désavantages couverts.');
console.log(`Vérité Builder — ${truthPages.length} sous-ensembles · ${actualRows.length}/347 capacités · ${naturePages.length} Natures.`);
