import {GUIDE_NAVIGATION} from './guide-articles.js';
const SUPPORTED=new Set(['Règles','Réalité','Vérité','Équipement & Objets','Personnages','Bestiaire']);
let indexPromise=null;

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return norm(value).replace(/\s+/g,'-')||'section'}
function categoryFromHash(){const match=location.hash.match(/^#\/category\/([^/?#]+)/);if(!match)return null;try{return decodeURIComponent(match[1])}catch{return match[1]}}
function pageIdFromCard(card){const href=card.getAttribute('href')||'';const match=href.match(/^#\/article\/(.+)$/);if(!match)return null;try{return decodeURIComponent(match[1])}catch{return match[1]}}

function adaptNavigationEntry(entry){
  if(!entry)return entry;
  if(entry.category==='Équipement & Objets'||SUPPORTED.has(entry.category))return entry;
  if(entry.category==='Équipement'||entry.category==='Augmentations'||entry.category==='Catalogue Vérité'){
    const spec=entry.category==='Équipement'
      ?['Équipement de Réalité',10]
      :entry.category==='Augmentations'
        ?['Augmentations',20]
        :['Objets de Vérité',30];
    const detail=[entry.group,entry.subgroup].filter(Boolean).join(' — ');
    return {...entry,category:'Équipement & Objets',group:spec[0],groupOrder:spec[1],subgroup:detail||'Références',subgroupOrder:(Number(entry.groupOrder)||0)*1000+(Number(entry.subgroupOrder)||0)};
  }
  if(entry.category==='Organisations'){
    const truth=/faction|vampir|garou|mage|daemon|angelus|aseryn|exile|extral|chasseur|fleau/i.test(norm(`${entry.group} ${entry.subgroup}`));
    return {...entry,category:truth?'Vérité':'Réalité'};
  }
  return entry;
}

function resultFrom(entry,category,group,groupOrder,subgroup,subgroupOrder){return{...entry,category,group,groupOrder,subgroup,subgroupOrder}}
function truthDomain(text){
  if(/vampir|krovni|alghul|ihuito|cour du sang|couronne de sang/.test(text))return['Vampires',10];
  if(/garou|pelage|loup|khinae/.test(text))return['Garous & descendants de Khinae',20];
  if(/mage|mageius|loge|thaum|sorcier/.test(text))return['Mages',30];
  if(/daemon|demon|belial|baal|abigor|astaroth|lilith|lucifer|mammon|mephisto|morrighan|satan/.test(text))return['Daemons',40];
  if(/angelus|sephir|cherubin|seraphin|arbre de vie/.test(text))return['Angelus',50];
  if(/aseryn|atlante|aerilien|lemurian|hyperboreen|seratheen|mulien|treize/.test(text))return['Aseryns',60];
  if(/exile|elye|whurten|ashyll|thulkar|azmen|silcenter/.test(text))return['Exilés',70];
  if(/extral|talass|mo sen|basean|rocreen|thalsios|ad rak|adrak|homo superior|aidh|galact/.test(text))return['Extrals & lignées associées',80];
  return null;
}
function canonicalizeReality(entry,card){
  const text=norm(`${entry.group||''} ${entry.subgroup||''} ${entry.displayTitle||''} ${card?.dataset?.filter||''}`);
  if(/laus|police|securite publique/.test(text))return resultFrom(entry,'Réalité','Institutions & sécurité',20,'Sécurité publique & LAUS',30);
  if(/gouvernement|institution|agence gouvernementale|cnad|cbii|cpp|inata|cbac|cchs|nrmd|eio|csco|stab|justice|senat|assemblee|cabinet|ministere/.test(text))return resultFrom(entry,'Réalité','Institutions & sécurité',20,/agence|cnad|cbii|cpp|inata|cbac|cchs|nrmd|eio|csco|stab/.test(text)?'Agences gouvernementales':'Institutions & gouvernement',/agence|cnad|cbii|cpp|inata|cbac|cchs|nrmd|eio|csco|stab/.test(text)?20:10);
  if(/corporation|corporatiste|entreprise|industrie|banque|finance|holding|groupe industriel|multinationale/.test(text))return resultFrom(entry,'Réalité','Corporations & économie',30,'Corporations & acteurs privés',10);
  if(/crawler|underlife|deathrunner|gundriver|neopunk|fixer|anti systeme|insurge/.test(text))return resultFrom(entry,'Réalité','Pègre, Crawlers & Underlife',40,'Crawlers & Underlife',30);
  if(/gang|bloods|crips|18th street|18st|ms 13|mara salvatrucha|sons of samoa|reapers/.test(text))return resultFrom(entry,'Réalité','Pègre, Crawlers & Underlife',40,'Gangs',20);
  if(/pegre|mafia|triade|yakuza|cartel|bratva|vladivost|menorah|oglaigh|milieu|sinaloa|vingt deux dragons|french connection/.test(text))return resultFrom(entry,'Réalité','Pègre, Crawlers & Underlife',40,'Mafias & cartels',10);
  if(/holonet|neurodive|technolog|infrastructure|transport|energie|communication|reseau|robot|intelligence artificielle|augment|implant/.test(text))return resultFrom(entry,'Réalité','Technologie & infrastructures',50,/holonet|neurodive/.test(text)?'Holonet & Neurodive':'Technologies & infrastructures',/holonet|neurodive/.test(text)?20:10);
  if(/religion|eglise|culte|neoreligion|spirituel|mosquee|temple|vatican/.test(text))return resultFrom(entry,'Réalité','Grande Californie & société',10,'Religions & néoreligions',30);
  if(/media|musique|cinema|jeu|sport|culture|art|presse|information/.test(text))return resultFrom(entry,'Réalité','Grande Californie & société',10,'Culture, médias & information',40);
  if(/los angeles|grande californie|geograph|ville|district|quartier|territoire/.test(text))return resultFrom(entry,'Réalité','Grande Californie & société',10,'Territoires & géographie',10);
  return resultFrom(entry,'Réalité','Grande Californie & société',10,'Société, réseaux & quotidien',20);
}
function canonicalizeTruth(entry,card){
  const current=norm(entry.group||''),text=norm(`${entry.group||''} ${entry.subgroup||''} ${entry.displayTitle||''} ${card?.dataset?.filter||''}`);
  if(/cosmologie|histoire cachee/.test(current))return resultFrom(entry,'Vérité','Cosmologie & histoire cachée',10,'Voile, mondes & histoire occulte',10);
  if(/entrer dans la verite/.test(current))return resultFrom(entry,'Vérité','Entrer dans la Vérité',20,entry.subgroup||'Repères & accès',Number(entry.subgroupOrder)||10);
  if(/corruption|fleau/.test(current)||/fleau|vhodhal|v aagor|ux sharith|c thath|gajh|corruption|rupture/.test(text))return resultFrom(entry,'Vérité','Corruption & Fléaux',60,/corruption/.test(text)?'Corruption & contamination':'Fléaux, Ruptures & serviteurs',/corruption/.test(text)?10:20);
  if(/chasseur/.test(current)||/chasseur|inquisition|ordre de chasse|hunter|clan shi|shimazu|famille gu/.test(text))return resultFrom(entry,'Vérité','Chasseurs & traditions',50,'Ordres, clans & doctrine de Chasse',10);
  if(/lieux|ombremonde/.test(current))return resultFrom(entry,'Vérité','Lieux & Ombremonde',40,'Lieux, plans & territoires occultes',10);
  if(/creatures|phenomenes/.test(current))return resultFrom(entry,'Vérité','Créatures & phénomènes',70,'Créatures & manifestations',10);
  const domain=truthDomain(text);
  if(domain)return resultFrom(entry,'Vérité','Natures, peuples & traditions',30,domain[0],domain[1]);
  if(/ombremonde|sanctuaire|lieu occulte|territoire occulte|cite|royaume|plan|monde cache|monde cach/.test(text))return resultFrom(entry,'Vérité','Lieux & Ombremonde',40,'Lieux, plans & territoires occultes',10);
  if(/revenant|spectre|zombie|squelette|liche|momie|abomination|creature|monstre|fee|esprit|metamorphe/.test(text))return resultFrom(entry,'Vérité','Créatures & phénomènes',70,'Créatures & manifestations',10);
  if(/cosmolog|histoire cachee|voile|hologramme|neant|elynea|guerre celeste|khinae/.test(text))return resultFrom(entry,'Vérité','Cosmologie & histoire cachée',10,'Voile, mondes & histoire occulte',10);
  return resultFrom(entry,'Vérité','Organisations occultes & cultes',40,'Sociétés, cultes & réseaux occultes',20);
}
function canonicalizeForRoute(entry,category,card){
  if(String(entry?.dataset||'')==='guide')return {...entry,category};
  if(category==='Réalité')return canonicalizeReality(entry,card);
  if(category==='Vérité')return canonicalizeTruth(entry,card);
  return {...entry,category};
}

async function loadNavigation(){
  if(!indexPromise){
    indexPromise=fetch('data/navigation-v1.json',{cache:'no-cache'}).then(response=>{
      if(!response.ok)throw new Error(`navigation-v1.json · HTTP ${response.status}`);
      return response.json();
    }).then(data=>{
      if(![1,2,3].includes(data?.version)||!Array.isArray(data.entries))throw new Error('navigation-v1.json invalide');
      const rows=[...data.entries,...GUIDE_NAVIGATION];return new Map(rows.map(entry=>{const adapted=adaptNavigationEntry(entry);return[adapted.id,adapted]}));
    });
  }
  return indexPromise;
}

function renderCategoryToc(groups){
  const toc=document.querySelector('#tocBox');if(!toc)return;
  let html='<div class="toc-title">Dans cette rubrique</div><div class="toc-links toc-topics">';
  for(const group of groups){
    const groupId=`nav-${slug(group.name)}`;
    const total=[...group.subgroups.values()].reduce((sum,sub)=>sum+sub.rows.length,0);
    html+=`<a href="#${groupId}" data-nav-anchor="${groupId}"><span>${group.name}</span><small>${total}</small></a>`;
    for(const subgroup of [...group.subgroups.values()].sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,'fr'))){
      const subgroupId=`${groupId}-${slug(subgroup.name)}`;
      html+=`<a class="toc-level-3" href="#${subgroupId}" data-nav-anchor="${subgroupId}"><span>${subgroup.name}</span><small>${subgroup.rows.length}</small></a>`;
    }
  }
  html+='</div>';toc.innerHTML=html;
  toc.querySelectorAll('[data-nav-anchor]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();document.getElementById(link.dataset.navAnchor)?.scrollIntoView({behavior:'smooth',block:'start'})}));
}

function buildGroups(classified){
  const groups=new Map();
  for(const row of classified){
    const gkey=`${row.meta.groupOrder}::${row.meta.group}`;
    if(!groups.has(gkey))groups.set(gkey,{name:row.meta.group,order:row.meta.groupOrder,subgroups:new Map()});
    const group=groups.get(gkey),skey=`${row.meta.subgroupOrder}::${row.meta.subgroup}`;
    if(!group.subgroups.has(skey))group.subgroups.set(skey,{name:row.meta.subgroup,order:row.meta.subgroupOrder,rows:[]});
    group.subgroups.get(skey).rows.push(row);
  }
  return [...groups.values()].sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,'fr'));
}

function applyFilter(wrap,input,manufacturerSelect){
  const q=norm(input?.value||''),manufacturer=norm(manufacturerSelect?.value||'');let visibleCount=0;
  for(const card of wrap.querySelectorAll('.article-card')){
    const textOk=!q||q.split(' ').every(token=>(card.dataset.filter||'').includes(token));
    const manufacturerOk=!manufacturer||norm(card.dataset.manufacturer)===manufacturer;
    const ok=textOk&&manufacturerOk;
    card.hidden=!ok;if(ok)visibleCount++;
  }
  for(const subgroup of wrap.querySelectorAll('.nav-subgroup'))subgroup.hidden=![...subgroup.querySelectorAll('.article-card')].some(card=>!card.hidden);
  for(const group of wrap.querySelectorAll('.nav-group'))group.hidden=![...group.querySelectorAll('.article-card')].some(card=>!card.hidden);
  const counter=document.querySelector('#categoryVisible');if(counter)counter.textContent=`${visibleCount} entrée${visibleCount>1?'s':''} affichée${visibleCount>1?'s':''}${manufacturerSelect?.value?` · ${manufacturerSelect.value}`:''}`;
}

async function enhanceCurrentCategory(){
  const category=categoryFromHash();if(!SUPPORTED.has(category))return;
  const main=document.querySelector('#main');
  const root=main?.querySelector(':scope > .article-list:not(.hierarchical-category-list)');
  if(!root)return;
  const originals=[...root.querySelectorAll(':scope > .article-card')];if(!originals.length)return;
  const navigation=await loadNavigation();if(categoryFromHash()!==category)return;

  const missing=[],classified=[];
  for(const original of originals){
    const id=pageIdFromCard(original),baseMeta=id?navigation.get(id):null;
    if(!id||!baseMeta){missing.push(id||original.textContent.trim());continue}
    const meta=canonicalizeForRoute(baseMeta,category,original);
    classified.push({original,meta});
  }
  if(missing.length){
    console.error(`Navigation hiérarchique incomplète pour ${category}:`,missing);
    const notice=document.createElement('div');notice.className='notice';notice.textContent=`Navigation incomplète : ${missing.length} page(s) non classée(s).`;
    root.before(notice);return;
  }

  const orderedGroups=buildGroups(classified),wrap=document.createElement('div');
  wrap.className='hierarchical-category-list';wrap.dataset.hierarchicalNavigation='1';
  for(const group of orderedGroups){
    const groupSection=document.createElement('section');groupSection.className='nav-group';groupSection.id=`nav-${slug(group.name)}`;
    const total=[...group.subgroups.values()].reduce((sum,sub)=>sum+sub.rows.length,0);
    const groupTitle=document.createElement('h2');groupTitle.className='nav-group-title';groupTitle.innerHTML=`<span>${group.name}</span><small>${total}</small>`;groupSection.append(groupTitle);
    for(const subgroup of [...group.subgroups.values()].sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,'fr'))){
      const subgroupSection=document.createElement('div');subgroupSection.className='nav-subgroup';subgroupSection.id=`${groupSection.id}-${slug(subgroup.name)}`;
      const subgroupTitle=document.createElement('h3');subgroupTitle.className='nav-subgroup-title';subgroupTitle.innerHTML=`<span>${subgroup.name}</span><small>${subgroup.rows.length}</small>`;subgroupSection.append(subgroupTitle);
      const grid=document.createElement('div');grid.className='nav-card-grid';
      subgroup.rows.sort((a,b)=>a.meta.pageOrder-b.meta.pageOrder||a.meta.displayTitle.localeCompare(b.meta.displayTitle,'fr',{numeric:true,sensitivity:'base'}));
      for(const {original,meta} of subgroup.rows){
        const card=original.cloneNode(true),heading=card.querySelector('h3');
        if(heading&&meta.displayTitle)heading.textContent=meta.displayTitle;
        card.dataset.navGroup=group.name;card.dataset.navSubgroup=subgroup.name;grid.append(card);
      }
      subgroupSection.append(grid);groupSection.append(subgroupSection);
    }
    wrap.append(groupSection);
  }

  root.replaceWith(wrap);renderCategoryToc(orderedGroups);
  const input=document.querySelector('#categoryFilter'),manufacturerSelect=document.querySelector('#categoryManufacturer');
  const apply=()=>applyFilter(wrap,input,manufacturerSelect);
  if(input&&!input.dataset.hierarchicalFilterBound){input.dataset.hierarchicalFilterBound='1';input.addEventListener('input',apply);}
  if(manufacturerSelect&&!manufacturerSelect.dataset.hierarchicalFilterBound){manufacturerSelect.dataset.hierarchicalFilterBound='1';manufacturerSelect.addEventListener('change',apply);}
  apply();
}

let scheduled=false;
function scheduleEnhance(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;enhanceCurrentCategory().catch(error=>console.error('Navigation hiérarchique indisponible',error))})}
const main=document.querySelector('#main');if(main)new MutationObserver(scheduleEnhance).observe(main,{childList:true,subtree:false});
window.addEventListener('hashchange',scheduleEnhance);window.addEventListener('DOMContentLoaded',scheduleEnhance);scheduleEnhance();
