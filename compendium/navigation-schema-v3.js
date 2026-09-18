import {
  classifyNavigation as classifyV2,
  navigationDisplayTitle,
} from './navigation-schema-v2.js';

const SUPPORTED_CATEGORIES=new Set(['Règles','Réalité','Vérité','Équipement','Augmentations','Organisations','Personnages','Bestiaire','Catalogue Vérité']);

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘`]/g,"'").replace(/[^a-z0-9]+/g,' ').trim()}
function result(group,groupOrder,subgroup,subgroupOrder=10,pageOrder=500){return{group,groupOrder,subgroup,subgroupOrder,pageOrder}}
function numericIdOrder(page){const match=String(page?.id||'').match(/-(\d{3})(?:-|$)/);return match?Number(match[1]):500}
function pageText(page){
  const bits=[page?.title,page?.source,...(page?.tags||[])];
  if(page?.pnj)bits.push(page.pnj.nom_verite,page.pnj.race,page.pnj.age,page.pnj.origine,page.pnj.statut,page.pnj.statut_verite,...(page.pnj.relations||[]));
  for(const section of page?.sections||[]){
    bits.push(section?.title);
    for(const block of section?.blocks||[]){
      if(block?.type==='p')bits.push(block.text);
      else if(block?.type==='table')for(const row of block.rows||[])bits.push(...row);
    }
  }
  return norm(bits.filter(Boolean).join(' '));
}

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
  const n=norm(category),order=numericIdOrder(page),weaponClass=norm(page?.catalog?.weaponClass||''),weaponRole=norm(page?.catalog?.weaponRole||''),title=norm(page?.title||'');
  if(n==='armes melee'){
    if(/trait|jet/.test(weaponClass))return result('Armement',10,'Armes de jet & trait',20,order);
    return result('Armement',10,'Armes de mêlée',10,order);
  }
  if(n==='armes poing tasers'){
    if(/taser/.test(weaponClass)||/\b(?:lt|ht) \d/.test(title))return result('Armement',10,'Tasers',30,order);
    if(weaponClass==='poche'||/\bpp \d/.test(title))return result('Armement',10,'Pistolets de poche',40,order);
    if(/pistolet leger/.test(weaponClass)||/\blp \d/.test(title))return result('Armement',10,'Pistolets légers',50,order);
    if(/pistolet lourd/.test(weaponClass)||/\bhp \d/.test(title))return result('Armement',10,'Pistolets lourds',60,order);
  }
  if(n==='armes automatiques'){
    if(weaponClass==='pm'||/\bmgp \d/.test(title))return result('Armement',10,'Pistolets-mitrailleurs (PM)',70,order);
    if(weaponClass==='smg'||/\blmg \d/.test(title))return result('Armement',10,'SMG',80,order);
    if(/assaut/.test(weaponClass)||/\bar \d/.test(title))return result('Armement',10,'Fusils d’assaut',90,order);
  }
  if(n==='armes precision'){
    if(/shotgun/.test(weaponClass)||/\bsg \d/.test(title))return result('Armement',10,'Shotguns',110,order);
    return result('Armement',10,'Fusils de précision',100,order);
  }
  if(n==='armes lourdes'){
    if(/mitrailleuse|gatling/.test(weaponRole)||/bastion|hellstorm/.test(title))return result('Armement',10,'Mitrailleuses lourdes & Gatlings',120,order);
    if(/neutralisation/.test(weaponRole)||/manticore/.test(title))return result('Armement',10,'Neutralisation lourde',130,order);
    if(/lance grenades|lance roquette|missile/.test(weaponRole)||/doorbell|breacher|wasp/.test(title))return result('Armement',10,'Lanceurs & missiles',140,order);
    if(/anti materiel|fortification/.test(weaponRole)||/wallbreaker/.test(title))return result('Armement',10,'Anti-matériel & fortifications',150,order);
    if(/projecteur/.test(weaponRole)||/salamander|purifier/.test(title))return result('Armement',10,'Projecteurs lourds',160,order);
    return result('Armement',10,'Armes lourdes',170,order);
  }
  if(n.startsWith('armes '))return result('Armement',10,category.replace(/^Armes\s*[—–-]\s*/i,'')||'Armes',180,order);
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

const ORGANISATION_FAMILIES=new Map([
  ['gouvernement',['Institutions & sécurité',10,'Gouvernement',10]],
  ['agences gouvernementales',['Institutions & sécurité',10,'Agences gouvernementales',20]],
  ['police de los angeles',['Institutions & sécurité',10,'Police de Los Angeles',30]],
  ['corporations',['Corporations & économie',20,'Corporations',10]],
  ['pegre de los angeles',['Pègre, Crawlers & anti-systèmes',30,'Pègre de Los Angeles',10]],
  ['crawlers',['Pègre, Crawlers & anti-systèmes',30,'Crawlers',20]],
  ['crawlers anti systemes',['Pègre, Crawlers & anti-systèmes',30,'Anti-systèmes',30]],
  ['religions et neoreligions',['Religions & néoreligions',40,'Religions & néoreligions',10]],
  ['cours vampiriques',['Factions de Vérité',50,'Cours vampiriques',10]],
  ['pelages loups garous',['Factions de Vérité',50,'Pelages / Loups-garous',20]],
  ['loges des mages',['Factions de Vérité',50,'Loges des Mages',30]],
  ['temples daemoniaques',['Factions de Vérité',50,'Temples Daemoniaques',40]],
  ['arbre de vie angelus',['Factions de Vérité',50,'Arbre de Vie & Angelus',50]],
  ['temples aseryns',['Factions de Vérité',50,'Temples Aseryns',60]],
  ['grands exiles',['Factions de Vérité',50,'Grands Exilés',70]],
  ['groupes d extrals',['Factions de Vérité',50,'Groupes d’Extrals',80]],
]);
function classifyOrganisation(page){
  const order=numericIdOrder(page);
  for(const tag of page?.tags||[]){
    const spec=ORGANISATION_FAMILIES.get(norm(tag));
    if(spec)return result(spec[0],spec[1],spec[2],spec[3],order);
  }
  return null;
}

function classifyPersonnage(page){
  const text=pageText(page),order=numericIdOrder(page);
  const tags=(page?.tags||[]).map(norm);
  const has=pattern=>pattern.test(text);
  const tagged=pattern=>tags.some(tag=>pattern.test(tag));

  // Les 60 fiches issues du vieux lore Vérité n'ont pas d'affiliation structurée :
  // on les garde ensemble plutôt que d'inventer une appartenance à partir d'un nom.
  if(tagged(/lore legacy migre/))return result('Figures de Vérité',70,'Dossiers migrés du lore Vérité',90,order);

  // Priorité à l'affiliation sociale explicite des dossiers PNJ détaillés.
  if(tagged(/police|laus/))return result('Institutions & sécurité',10,'Police & sécurité publique',20,order);
  if(tagged(/gouvernement|agence gouvernementale|armee/))return result('Institutions & sécurité',10,'Gouvernement & agences',10,order);
  if(tagged(/corporat/))return result('Corporations',20,'Corporatistes & acteurs privés',10,order);
  if(tagged(/pegre|mafia|cartel|yakuza|triade|bratva|oglaigh|menorah|milieu|sinaloa|vingt deux dragons/))return result('Pègre & réseaux criminels',30,'Pègre, mafias & cartels',10,order);
  if(tagged(/crawler|neurokiller|venomer|gunwatcher|mandealer|voidrunner|ender|gundriver|neopunk|fixer|insurge/))return result('Crawlers & Underlife',40,'Crawlers & réseaux Underlife',10,order);
  if(tagged(/religieu|religion/)&&!tagged(/chasseur/))return result('Religions & cultes',50,'Religions & réseaux spirituels',10,order);
  if(tagged(/chasseur/))return result('Chasseurs',60,'Chasseurs & réseaux de Chasse',10,order);

  // Menaces explicites avant la Nature d'origine : une Abomination reste classée avec les menaces.
  if(tagged(/fleau/))return result('Corruption & menaces',80,'Fléaux & figures de Rupture',10,order);
  if(tagged(/abomination/))return result('Corruption & menaces',80,'Abominations',20,order);
  if(tagged(/creature/)&&!tagged(/vampire|mage|daemon|angelus|loup|garou|atlante|aseryn|elfe|nain|orque|gobelin|mosen|thal|rocreen|basean|adrak/))return result('Corruption & menaces',80,'Créatures & anomalies nommées',30,order);

  const peoples=[
    [/vampire/,'Vampires',10],
    [/loup|garou/,'Garous',20],
    [/mage/,'Mages',30],
    [/daemon/,'Daemons',40],
    [/angelus/,'Angelus',50],
    [/atlante|aseryn/,'Aseryns',60],
    [/elfe|nain|orque|gobelin|azmenor|exile/,'Exilés',70],
    [/mo senn?|talass|thalsios|rocreen|basean|ad rak|adrak|greys|serys|eons/,'Extrals & lignées associées',80],
  ];
  for(const [pattern,subgroup,subgroupOrder] of peoples)if(tagged(pattern))return result('Figures de Vérité',70,subgroup,subgroupOrder,order);

  // Quelques fiches très anciennes ont des tags vides. Le texte peut révéler une fonction sans
  // qu'elle soit canonisée comme affiliation ; on ne l'utilise que pour des catégories très larges.
  if(has(/\bchasseur(?:s)?\b/))return result('Chasseurs',60,'Chasseurs & réseaux de Chasse',10,order);
  if(has(/\babomination(?:s)?\b|\bfleau(?:x)?\b/))return result('Corruption & menaces',80,'Figures occultes dangereuses',40,order);
  return result('Figures indépendantes',90,'Dossiers sans affiliation explicite',10,order);
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
  if(page.category==='Organisations')return classifyOrganisation(page);
  if(page.category==='Personnages')return classifyPersonnage(page);
  if(page.category==='Bestiaire')return classifyBestiary(page);
  if(page.category==='Catalogue Vérité')return classifyTruthCatalog(page);
  // Le mot « Corruption » existe aussi dans le vocabulaire Neurodive : ne jamais l’envoyer chez les Fléaux.
  if(page.category==='Règles'&&page.id==='realite-022-7-corruption-de-programmes-et-materiel')return result('Réalité — Neurodive',50,'Règles de Neurodive',10,7);
  return normalizeExistingNavigation(page,classifyV2(page));
}

export function isHierarchicalCategory(category){return SUPPORTED_CATEGORIES.has(category)}
export {navigationDisplayTitle};
