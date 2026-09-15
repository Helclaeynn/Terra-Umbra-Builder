import {
  classifyNavigation as classifyBase,
  isHierarchicalCategory,
  navigationDisplayTitle,
} from './navigation-schema.js';

const REALITY_LEGACY_GROUPS={
  'Grande Californie & société':10,
  'Institutions & sécurité':20,
  'Corporations & économie':30,
  'Pègre, Crawlers & Underlife':40,
  'Technologie & infrastructures':50,
};
const TRUTH_LEGACY_GROUPS={
  'Cosmologie & histoire cachée':10,
  'Peuples & Natures':20,
  'Organisations & traditions':30,
  'Lieux & Ombremonde':40,
  'Chasseurs':50,
  'Corruption & Fléaux':60,
  'Créatures & phénomènes':70,
};

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function hay(page){return norm([page?.title,page?.source,...(page?.tags||[])].filter(Boolean).join(' '))}
function pageOrder(page,fallback=500){
  const match=String(page?.title||'').match(/^\s*(\d+)\s*[.)-]\s*/);
  return match?Number(match[1]):fallback;
}
function result(group,groupOrder,subgroup,subgroupOrder=10,order=500){return{group,groupOrder,subgroup,subgroupOrder,pageOrder:order}}

function classifyRealityLore(page){
  const t=hay(page),order=pageOrder(page);
  if(/laus|police|securite publique|gouvernement|agence|cnad|cbii|inata|cbac|cchs|nrmd|eio|csco|stab|justice|senat|assemblee|cabinet/.test(t)){
    const sub=/laus|police|securite publique/.test(t)?'Sécurité publique':'Institutions & agences';
    return result('Institutions & sécurité',REALITY_LEGACY_GROUPS['Institutions & sécurité'],sub,/laus|police|securite publique/.test(t)?20:10,order);
  }
  if(/pegre|crawler|underlife|mafia|triade|yakuza|cartel|gang|bratva|vladivost|deathrunner|gundriver|neopunk|fixer/.test(t)){
    const sub=/crawler|underlife|deathrunner|gundriver|neopunk|fixer/.test(t)?'Crawlers & Underlife':'Pègre & criminalité';
    return result('Pègre, Crawlers & Underlife',REALITY_LEGACY_GROUPS['Pègre, Crawlers & Underlife'],sub,/crawler|underlife|deathrunner|gundriver|neopunk|fixer/.test(t)?20:10,order);
  }
  if(/corporation|entreprise|economie|finance|banque|marche|commerce|industrie/.test(t)){
    return result('Corporations & économie',REALITY_LEGACY_GROUPS['Corporations & économie'],'Économie & acteurs privés',10,order);
  }
  if(/neuro|holonet|technolog|transport|metro|vehicule|energie|infrastructure|communication|augment|implant/.test(t)){
    const sub=/neuro|holonet/.test(t)?'Holonet & Neurodive':'Technologies & infrastructures';
    return result('Technologie & infrastructures',REALITY_LEGACY_GROUPS['Technologie & infrastructures'],sub,/neuro|holonet/.test(t)?20:10,order);
  }
  let sub='Société & quotidien';
  if(/los angeles|californ|geograph|ville|district|quartier|territoire/.test(t))sub='Territoires & géographie';
  else if(/religion|culture|loisir|media|education|sante|logement|travail|quotidien|societe/.test(t))sub='Société & quotidien';
  return result('Grande Californie & société',REALITY_LEGACY_GROUPS['Grande Californie & société'],sub,sub==='Territoires & géographie'?10:20,order);
}

function truthDomain(t){
  if(/vampir|krovni|alghul|ihuito|\boru\b|\bshi\b/.test(t))return['Vampires',10];
  if(/garou|pelage|loup|khinae/.test(t))return['Garous & descendants de Khinae',20];
  if(/mage|mageius|loge|thaum|sorcier/.test(t))return['Mages',30];
  if(/daemon|demon|belial|baal|abigor|astaroth|lilith|lucifer|mammon|mephisto|morrighan|satan/.test(t))return['Daemons',40];
  if(/angelus|sephir|cherubin|seraphin/.test(t))return['Angelus',50];
  if(/aseryn|aerilien|lemurian|hyperboreen|seratheen|mulien|treize/.test(t))return['Aseryns',60];
  if(/exile|elye|whurten|ashyll|thulkar|azmen/.test(t))return['Exilés',70];
  if(/extral|talass|mo sen|baseanh|rocreen|thalsios|ad rak|homo superior/.test(t))return['Extrals & lignées associées',80];
  return null;
}
function classifyTruthLore(page){
  const t=hay(page),order=pageOrder(page);
  if(/fleau|vhodhal|v aagor|ux sharith|c thath|gajh|\bthul\b|corruption|rupture/.test(t)){
    return result('Corruption & Fléaux',TRUTH_LEGACY_GROUPS['Corruption & Fléaux'],/corruption/.test(t)?'Corruption':'Les six Fléaux',/corruption/.test(t)?10:20,order);
  }
  if(/chasseur|inquisition|ordre de chasse|hunter/.test(t))return result('Chasseurs',TRUTH_LEGACY_GROUPS.Chasseurs,'Ordres, doctrine & réseaux',10,order);
  if(/ombremonde|sanctuaire|lieu|temple|territoire|cite|cité|royaume|plan|monde/.test(t))return result('Lieux & Ombremonde',TRUTH_LEGACY_GROUPS['Lieux & Ombremonde'],'Lieux & territoires occultes',10,order);
  if(/revenant|spectre|zombie|squelette|liche|momie|abomination|creature|monstre/.test(t))return result('Créatures & phénomènes',TRUTH_LEGACY_GROUPS['Créatures & phénomènes'],'Créatures & manifestations',10,order);
  const domain=truthDomain(t);
  if(domain)return result('Peuples & Natures',TRUTH_LEGACY_GROUPS['Peuples & Natures'],domain[0],domain[1],order);
  if(/cour|clan|ordre|organisation|culte|temple|tradition|loge|confrerie|maisonnee|syndicat|horde/.test(t))return result('Organisations & traditions',TRUTH_LEGACY_GROUPS['Organisations & traditions'],'Organisations, cultes & traditions',10,order);
  return result('Cosmologie & histoire cachée',TRUTH_LEGACY_GROUPS['Cosmologie & histoire cachée'],'Voile, histoire & cosmologie',10,order);
}

export function classifyNavigation(page){
  if(!page||!isHierarchicalCategory(page.category))return null;
  if(page.dataset==='lore'){
    if(page.category==='Réalité')return classifyRealityLore(page);
    if(page.category==='Vérité')return classifyTruthLore(page);
  }
  return classifyBase(page);
}

export {isHierarchicalCategory,navigationDisplayTitle};
