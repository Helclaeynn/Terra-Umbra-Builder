import fs from 'node:fs';
import zlib from 'node:zlib';

const DATA='compendium/data';
const manifest=JSON.parse(fs.readFileSync(`${DATA}/manifest-v3.json`,'utf8'));

function load(id){
  const spec=manifest.datasets.find(dataset=>dataset.id===id);
  if(!spec) throw new Error(`Dataset absent: ${id}`);
  let b64='';
  for(let i=0;i<spec.parts;i++) b64+=fs.readFileSync(`${DATA}/${spec.prefix}-${String(i).padStart(2,'0')}.b64part`,'utf8').replace(/\s+/g,'');
  return JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
}
function flat(page){
  const out=[page.title||'',...(page.tags||[])];
  for(const section of page.sections||[]){
    out.push(section.title||'');
    for(const block of section.blocks||[]){
      if(block.type==='p') out.push(block.text||'');
      if(block.type==='table') for(const row of block.rows||[]) out.push(...row);
    }
  }
  return out.join(' ');
}
function tagged(page, tag){return (page.tags||[]).includes(tag)}

const rules=load('moteur');
const reality=load('realite');
const truth=load('verite');

if(rules.some(page=>page.category!=='Règles')) throw new Error('Le dataset moteur contient encore une page hors catégorie Règles');
if(reality.some(page=>page.category==='Règles')) throw new Error('Une page Règles reste physiquement dans le dataset Réalité');
if(truth.some(page=>page.category==='Règles')) throw new Error('Une page Règles reste physiquement dans le dataset Vérité');

const talents=rules.filter(page=>tagged(page,'Talent')&&tagged(page,'Réalité'));
const disadvantages=rules.filter(page=>tagged(page,'Désavantage')&&tagged(page,'Réalité'));
if(talents.length!==122) throw new Error(`122 Talents Réalité attendus, ${talents.length}`);
if(disadvantages.length!==55) throw new Error(`55 Désavantages Réalité attendus, ${disadvantages.length}`);

const talentGroups={Commun:12,Expertise:25,Origine:25,Sphère:60};
for(const [tag,count] of Object.entries(talentGroups)){
  const actual=talents.filter(page=>tagged(page,tag)).length;
  if(actual!==count) throw new Error(`Talents ${tag}: ${actual}, attendu ${count}`);
}
const disadvantageGroups={Commun:15,Attribut:15,Sphère:25};
for(const [tag,count] of Object.entries(disadvantageGroups)){
  const actual=disadvantages.filter(page=>tagged(page,tag)).length;
  if(actual!==count) throw new Error(`Désavantages ${tag}: ${actual}, attendu ${count}`);
}

const talentOverview=rules.find(page=>page.title==='Talents de Réalité — règles générales');
const disadvantageOverview=rules.find(page=>page.title==='Désavantages de Réalité — règles générales');
if(!talentOverview||!disadvantageOverview) throw new Error('Pages générales Talents/Désavantages absentes de Règles');
if(reality.some(page=>/Talents de Réalité|Désavantages de Réalité/.test(page.title))) throw new Error('Ancienne page agrégée Talents/Désavantages encore visible dans Réalité');

const heir=talents.find(page=>page.title==='Fier héritier');
if(!heir||!/minimum Confortable/i.test(flat(heir))||!/Aisé à Luxe/i.test(flat(heir))) throw new Error('Fier héritier ne porte pas l’arbitrage canonique récent');
const fast=talents.find(page=>page.title==='Apprentissage fulgurant');
if(!fast||!/2 XP/i.test(flat(fast))||!/scénario/i.test(flat(fast))||/provisoire/i.test(fast.title)) throw new Error('Apprentissage fulgurant n’est pas consolidé depuis le Builder');

const truthCommonRules=[
  '1. Architecture de la Vérité',
  '2. Points de Vérité, accès et conception des Talents',
  '3. PA, Réactions, durées et non-cumul',
  '4. Défense occulte et Puissance des effets',
  '5. Hologramme, Voile, Semi-Révélation et Révélation',
  '6. Continuité corporelle, objets et Mobilité ailée',
  '7. Humains, Chasseurs reconnus, Humanité et Intégrité',
  '8. Compagnons liés et réseaux de Vérité',
  '9. Équipement de Vérité — principe commun',
];
for(const title of truthCommonRules){
  if(!rules.some(page=>page.title===title&&tagged(page,'Vérité'))) throw new Error(`Règle commune Vérité non migrée: ${title}`);
  if(truth.some(page=>page.title===title)) throw new Error(`Règle commune Vérité encore dupliquée dans Vérité: ${title}`);
}

const movedRealityMustExist=[
  '4. Création et progression',
  '1. Intégration augmentique : Charge, Stress et Frénésie',
  '1. Principes du Neurodive',
  '6. Neurocombat',
  '3. Règles communes d’équipement',
];
for(const title of movedRealityMustExist){
  if(!rules.some(page=>page.title===title&&tagged(page,'Réalité'))) throw new Error(`Règle Réalité non migrée: ${title}`);
}

const all=[...rules,...reality,...truth];
const ids=new Set();
for(const page of all){
  if(ids.has(page.id)) throw new Error(`ID dupliqué dans les datasets restructurés: ${page.id}`);
  ids.add(page.id);
}

console.log(`RESTRUCTURE OK — Règles ${rules.length} · Réalité ${reality.length} · Vérité ${truth.length}.`);
console.log(`Talents Réalité ${talents.length} (12/25/25/60) · Désavantages ${disadvantages.length} (15/15/25).`);
console.log('Règles communes Vérité migrées: 9/9.');
