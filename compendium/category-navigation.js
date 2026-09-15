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
  const match=href.match(/^#\/article\/(.+)$/);
  if(!match) return null;
  try{return decodeURIComponent(match[1])}catch{return match[1]}
}

function visibleCard(card){return !card.hidden&&card.style.display!=='none'}
function slug(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section'}

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

function renderCategoryToc(groups){
  const toc=document.querySelector('#tocBox');
  if(!toc) return;
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
  html+='</div>';
  toc.innerHTML=html;
  toc.querySelectorAll('[data-nav-anchor]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    document.getElementById(link.dataset.navAnchor)?.scrollIntoView({behavior:'smooth',block:'start'});
  }));
}

async function enhanceCurrentCategory(){
  const category=categoryFromHash();
  if(!SUPPORTED.has(category)) return;
  const main=document.querySelector('#main');
  const root=main?.querySelector(':scope > .article-list');
  if(!root||root.dataset.hierarchicalNavigation==='1') return;

  const cards=[...root.querySelectorAll(':scope > .article-card')];
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

  const orderedGroups=[...groups.values()].sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,'fr'));
  const wrap=document.createElement('div');
  wrap.className='article-list hierarchical-category-list';
  wrap.dataset.hierarchicalNavigation='1';

  for(const group of orderedGroups){
    const groupSection=document.createElement('section');
    groupSection.className='nav-group';
    groupSection.id=`nav-${slug(group.name)}`;
    const groupTitle=document.createElement('h2');
    groupTitle.className='nav-group-title';
    const total=[...group.subgroups.values()].reduce((sum,sub)=>sum+sub.rows.length,0);
    groupTitle.innerHTML=`<span>${group.name}</span><small>${total}</small>`;
    groupSection.append(groupTitle);

    for(const subgroup of [...group.subgroups.values()].sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,'fr'))){
      const subgroupSection=document.createElement('div');
      subgroupSection.className='nav-subgroup';
      subgroupSection.id=`${groupSection.id}-${slug(subgroup.name)}`;
      const subgroupTitle=document.createElement('h3');
      subgroupTitle.className='nav-subgroup-title';
      subgroupTitle.innerHTML=`<span>${subgroup.name}</span><small>${subgroup.rows.length}</small>`;
      subgroupSection.append(subgroupTitle);
      const grid=document.createElement('div');
      grid.className='article-list nav-card-grid';
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
    wrap.append(groupSection);
  }

  root.replaceWith(wrap);
  renderCategoryToc(orderedGroups);

  const filter=document.querySelector('#categoryFilter');
  if(filter&&!filter.dataset.navVisibilityBound){
    filter.dataset.navVisibilityBound='1';
    filter.addEventListener('input',()=>setTimeout(()=>refreshEmptyGroups(wrap),0));
  }
  refreshEmptyGroups(wrap);
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
