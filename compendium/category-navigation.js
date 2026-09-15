const SUPPORTED=new Set(['Règles','Réalité','Vérité']);
let indexPromise=null;

function loadNavigation(){
  if(!indexPromise){
    indexPromise=fetch('data/navigation-v1.json',{cache:'no-cache'}).then(response=>{
      if(!response.ok) throw new Error(`navigation-v1.json · HTTP ${response.status}`);
      return response.json();
    }).then(data=>{
      if(data?.version!==1||!Array.isArray(data.entries)) throw new Error('navigation-v1.json invalide');
      return new Map(data.entries.map(entry=>[entry.id,entry]));
    });
  }
  return indexPromise;
}

function categoryFromHash(){
  const match=location.hash.match(/^#\/category\/([^/?#]+)/);
  if(!match) return null;
  try{return decodeURIComponent(match[1])}catch{return match[1]}
}

function pageIdFromCard(card){
  const href=card.getAttribute('href')||'';
  const match=href.match(/^#\/page\/(.+)$/);
  if(!match) return null;
  try{return decodeURIComponent(match[1])}catch{return match[1]}
}

function visibleCard(card){return !card.hidden&&card.style.display!=='none'}

function refreshEmptyGroups(root){
  if(!root) return;
  for(const subgroup of root.querySelectorAll('.nav-subgroup')){
    const any=[...subgroup.querySelectorAll('.article-card')].some(visibleCard);
    subgroup.hidden=!any;
  }
  for(const group of root.querySelectorAll('.nav-group')){
    const any=[...group.querySelectorAll('.article-card')].some(visibleCard);
    group.hidden=!any;
  }
}

async function enhanceCurrentCategory(){
  const category=categoryFromHash();
  if(!SUPPORTED.has(category)) return;
  const root=document.querySelector('#category-list');
  if(!root||root.dataset.hierarchicalNavigation==='1') return;

  const cards=[...root.querySelectorAll('.article-card')];
  if(!cards.length) return;
  const navigation=await loadNavigation();
  if(categoryFromHash()!==category) return;

  const missing=[];
  const classified=[];
  for(const card of cards){
    const id=pageIdFromCard(card);
    const meta=id?navigation.get(id):null;
    if(!id||!meta||meta.category!==category){missing.push(id||card.textContent.trim());continue}
    classified.push({card,meta});
  }
  if(missing.length){
    console.error(`Navigation hiérarchique incomplète pour ${category}:`,missing);
    return;
  }

  const groups=new Map();
  for(const row of classified){
    const gkey=`${row.meta.groupOrder}::${row.meta.group}`;
    if(!groups.has(gkey)) groups.set(gkey,{name:row.meta.group,order:row.meta.groupOrder,subgroups:new Map()});
    const group=groups.get(gkey);
    const skey=`${row.meta.subgroupOrder}::${row.meta.subgroup}`;
    if(!group.subgroups.has(skey)) group.subgroups.set(skey,{name:row.meta.subgroup,order:row.meta.subgroupOrder,rows:[]});
    group.subgroups.get(skey).rows.push(row);
  }

  root.innerHTML='';
  root.classList.add('hierarchical-category-list');
  for(const group of [...groups.values()].sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,'fr'))){
    const groupSection=document.createElement('section');
    groupSection.className='nav-group';
    const groupTitle=document.createElement('h2');
    groupTitle.className='nav-group-title';
    groupTitle.textContent=group.name;
    groupSection.append(groupTitle);

    for(const subgroup of [...group.subgroups.values()].sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,'fr'))){
      const subgroupSection=document.createElement('div');
      subgroupSection.className='nav-subgroup';
      const subgroupTitle=document.createElement('h3');
      subgroupTitle.className='nav-subgroup-title';
      subgroupTitle.textContent=subgroup.name;
      subgroupSection.append(subgroupTitle);
      const grid=document.createElement('div');
      grid.className='section-grid nav-card-grid';
      subgroup.rows.sort((a,b)=>a.meta.pageOrder-b.meta.pageOrder||a.meta.displayTitle.localeCompare(b.meta.displayTitle,'fr',{numeric:true,sensitivity:'base'}));
      for(const {card,meta} of subgroup.rows){
        const heading=card.querySelector('h3');
        if(heading&&meta.displayTitle) heading.textContent=meta.displayTitle;
        card.dataset.navGroup=group.name;
        card.dataset.navSubgroup=subgroup.name;
        grid.append(card);
      }
      subgroupSection.append(grid);
      groupSection.append(subgroupSection);
    }
    root.append(groupSection);
  }
  root.dataset.hierarchicalNavigation='1';

  const filter=document.querySelector('#categoryFilter');
  if(filter&&!filter.dataset.navVisibilityBound){
    filter.dataset.navVisibilityBound='1';
    filter.addEventListener('input',()=>setTimeout(()=>refreshEmptyGroups(root),0));
  }
  refreshEmptyGroups(root);
}

let scheduled=false;
function scheduleEnhance(){
  if(scheduled) return;
  scheduled=true;
  queueMicrotask(()=>{
    scheduled=false;
    enhanceCurrentCategory().catch(error=>console.error('Navigation hiérarchique indisponible',error));
  });
}

const main=document.querySelector('#main');
if(main){
  const observer=new MutationObserver(scheduleEnhance);
  observer.observe(main,{childList:true,subtree:true});
}
window.addEventListener('hashchange',scheduleEnhance);
window.addEventListener('DOMContentLoaded',scheduleEnhance);
scheduleEnhance();
