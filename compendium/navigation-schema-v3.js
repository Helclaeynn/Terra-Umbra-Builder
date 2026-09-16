import {
  classifyNavigation as classifyV2,
  navigationDisplayTitle,
} from './navigation-schema-v2.js';

const SUPPORTED_CATEGORIES=new Set(['Règles','Réalité','Vérité','Équipement','Augmentations','Bestiaire','Catalogue Vérité']);

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function result(group,groupOrder,subgroup,subgroupOrder=10,pageOrder=500){return{group,groupOrder,subgroup,subgroupOrder,pageOrder}}
function numericIdOrder(page){const match=String(page?.id||'').match(/-(\d{3})(?:-|$)/);return match?Number(match[1]):500}

const TRUTH_PRESENTATION_ORDER=new Map([
  ['Cosmologie & histoire cachée',10],
  ['Entrer dans la Vérité',20],
  ['Natures, peuples & traditions',30],
  ['Peuples & Natures',40],
  ['Chasseurs & traditions',50],
  ['Chasseurs',60],
  ['Corruption & Fléaux',70],
  ['Créatures & phénomènes',80],
]);
function normalizeExistingNavigation(page,nav){
  if(!nav)return null;
  if(page.category==='Vérité'&&TRUTH_PRESENTATION_ORDER.has(nav.group))return {...nav,groupOrder:TRUTH_PRESENTATION_ORDER.get(nav.group)};
  return nav;
}

function classifyEquipment(page){
  const category=String(page?.catalog?.category||(page?.tags||[])[2]||'').trim();
  const n=norm(category),order=numericIdOrder(page);
  if(n.startsWith('armes '))return result('Armement',10,category.replace(/^Armes\s*[—–-]\s*/i,'')||'Armes',10,order);
  if(n==="accessoires d armes")return result('Armement',10,"Accessoires d'armes",20,order);
  if(n==='munitions standard')return result('Munitions & consommables',20,'Munitions standard',10,order);
  if(n==='munitions speciales')return result('Munitions & consommables',20,'Munitions spéciales',20,order);
  if(n==='munitions lourdes consommables')return result('Munitions & consommables',20,'Munitions lourdes & consommables',30,order);
  if(n.startsWith('armures '))return result('Armures & protections',30,category.replace(/^Armures\s*[—–-]\s*/i,'')||'Armures',10,order);
  if(n==="modules d armure")return result('Armures & protections',30,"Modules d'armure",20,order);
  if(n==='applications holonet')return result('Holonet & Neurodive',40,'Applications Holonet',10,order);
  if(n==='objets usuels neurodive')return result('Holonet & Neurodive',40,'Matériel de Neurodive',20,order);
  if(n.startsWith('neuroprogramme '))return result('Holonet & Neurodive',40,category.replace(/^Neuroprogramme\s*[—–-]\s*/i,'Neuroprogrammes — '),30,order);
  if(n==='logements')return result('Habitat & mobilité',50,'Logements',10,order);
  if(n==='planques')return result('Habitat & mobilité',50,'Planques',20,order);
  if(n==='vehicules')return result('Habitat & mobilité',50,'Véhicules',30,order);
  if(n==='transports')return result('Habitat & mobilité',50,'Transports',40,order);
  const daily=new Map([
    ['vetements',['Vêtements',10]],['equipement civique',['Équipement civique',20]],['nourriture',['Nourriture',30]],['boissons',['Boissons',40]],['drogues',['Drogues',50]],['services medicaux',['Services médicaux',60]],['services professionnels',['Services professionnels',70]],['loisirs',['Loisirs',80]],
  ]);
  if(daily.has(n)){const [sub,subOrder]=daily.get(n);return result('Vie quotidienne & services',60,sub,subOrder,order)}
  return null;
}

function classifyAugmentation(page){
  const category=String(page?.catalog?.category||(page?.tags||[])[2]||'').trim();
  const n=norm(category),order=numericIdOrder(page);
  if(n==='biogenetique')return result('Biogénétique',20,'Biogénétique',10,order);
  if(n==='esthetique fonctionnel')return result('Esthétique & fonctionnel',30,'Esthétique & fonctionnel',10,order);
  const subOrder=new Map([['audio',10],['neural',20],['optique',30],['interne',40],['interne dermique',50],['membres cybernetiques',60],['cyborg lourd',70]]);
  if(subOrder.has(n))return result('Cybernétique',10,category.replace(' / ',' & '),subOrder.get(n),order);
  return null;
}

const BESTIARY_CHAPTERS=new Map([
  ['1.1 PNJ Réalité',['PNJ de Réalité',10]],
  ['1.2 PNJ Vérité',['PNJ de Vérité',20]],
  ['2.1 Revenants',['Revenants',30]],
  ['2.2 Ombres et entités de l’Ombremonde',["Ombres & entités de l’Ombremonde",40]],
  ['2.3 Fées et esprits naturels',['Fées & esprits naturels',50]],
  ['2.4 Métamorphes',['Métamorphes',60]],
  ['2.5 Prédateurs monstrueux',['Prédateurs monstrueux',70]],
  ['2.6 Familiers et serviteurs occultes',['Familiers & serviteurs occultes',80]],
  ['2.7 Constructs et objets éveillés',['Constructs & objets éveillés',90]],
  ['2.8 Malédictions',['Malédictions',100]],
  ['2.9 Faune de Vérité',['Faune de Vérité',110]],
  ['2.10 Fléaux, Ruptures et Abominations',['Fléaux, Ruptures & Abominations',120]],
  ['2.11 Figures uniques et manifestations de scénario',['Figures uniques & manifestations',130]],
  ['2.12 Dossiers majeurs de scénario',['Dossiers majeurs de scénario',140]],
]);
function classifyBestiary(page){
  const chapter=String(page?.bestiary?.chapter||'').trim();
  const chapterSpec=BESTIARY_CHAPTERS.get(chapter);if(!chapterSpec)return null;
  const family=String(page?.bestiary?.family||'').trim();
  const subfamily=String(page?.bestiary?.subfamily||'').trim();
  const subgroup=subfamily||family||'Profils généraux';
  return result(chapterSpec[0],chapterSpec[1],subgroup,10,500);
}

const TRUTH_CATALOG_CHAPTERS=new Map([
  ['22',['Références communes',10]],
  ['23',['Équipement de Chasse',20]],
  ['24',['Marché des Exilés',30]],
  ['25',['Marché xéno',40]],
  ['26',['Arsenal AIDH',50]],
  ['27',['Corruption & Calamitechnologie',60]],
]);
function classifyTruthCatalog(page){
  const chapter=String(page?.catalog?.chapter||'').trim();
  const chapterSpec=TRUTH_CATALOG_CHAPTERS.get(chapter);if(!chapterSpec)return null;
  const section=String(page?.catalog?.section||'Référence').trim()||'Référence';
  return result(chapterSpec[0],chapterSpec[1],section,10,numericIdOrder(page));
}

export function classifyNavigation(page){
  if(!page||!SUPPORTED_CATEGORIES.has(page.category))return null;
  if(page.category==='Équipement')return classifyEquipment(page);
  if(page.category==='Augmentations')return classifyAugmentation(page);
  if(page.category==='Bestiaire')return classifyBestiary(page);
  if(page.category==='Catalogue Vérité')return classifyTruthCatalog(page);
  // Le mot « Corruption » existe aussi dans le vocabulaire Neurodive : ne jamais l’envoyer chez les Fléaux.
  if(page.category==='Règles'&&page.id==='realite-022-7-corruption-de-programmes-et-materiel')return result('Réalité — Neurodive',50,'Règles de Neurodive',10,7);
  return normalizeExistingNavigation(page,classifyV2(page));
}

export function isHierarchicalCategory(category){return SUPPORTED_CATEGORIES.has(category)}
export {navigationDisplayTitle};
