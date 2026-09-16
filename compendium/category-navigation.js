const SUPPORTED=new Set(['Règles','Réalité','Vérité','Équipement','Augmentations','Bestiaire','Catalogue Vérité']);
let indexPromise=null;

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function slug(value){return norm(value).replace(/\s+/g,'-')||'section'}
function categoryFromHash(){const match=location.hash.match(/^#\/category\/([^/?#]+)/);if(!match)return null;try{return decodeURIComponent(match[1])}catch{return match[1]}}
function pageIdFromCard(card){const href=card.getAttribute('href')||'';const match=href.match(/^#\/article\/(.+)$/);if(!match)return null;try{return decodeURIComponent(match[1])}catch{return match[1]}}

async function loadNavigation(){
  if(!indexPromise){
    indexPromise=fetch('data/navigation-v1.json',{cache:'no-cache'}).then(response=>{
      if(!response.ok)throw new Error(`navigation-v1.json · HTTP ${response.status}`);
      return response.json();
    }).then(data=>{
      if(![1,2].includes(data?.version)||!Array.isArray(data.entries))throw new Error('navigation-v1.json invalide');
      return new Map(data.entries.map(entry=>[entry.id,entry]));
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

function applyFilter(wrap,input){
  const q=norm(input?.value||'');let visibleCount=0;
  for(const card of wrap.querySelectorAll('.article-card')){
    const ok=!q||q.split(' ').every(token=>(card.dataset.filter||'').includes(token));
    card.hidden=!ok;if(ok)visibleCount++;
  }
  for(const subgroup of wrap.querySelectorAll('.nav-subgroup'))subgroup.hidden=![...subgroup.querySelectorAll('.article-card')].some(card=>!card.hidden);
  for(const group of wrap.querySelectorAll('.nav-group'))group.hidden=![...group.querySelectorAll('.article-card')].some(card=>!card.hidden);
  const counter=document.querySelector('#categoryVisible');if(counter)counter.textContent=`${visibleCount} entrée${visibleCount>1?'s':''} affichée${visibleCount>1?'s':''}`;
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
    const id=pageIdFromCard(original),meta=id?navigation.get(id):null;
    if(!id||!meta||meta.category!==category){missing.push(id||original.textContent.trim());continue}
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
  const input=document.querySelector('#categoryFilter');
  if(input&&!input.dataset.hierarchicalFilterBound){input.dataset.hierarchicalFilterBound='1';input.addEventListener('input',()=>applyFilter(wrap,input));}
  applyFilter(wrap,input);
}

let scheduled=false;
function scheduleEnhance(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;enhanceCurrentCategory().catch(error=>console.error('Navigation hiérarchique indisponible',error))})}
const main=document.querySelector('#main');if(main)new MutationObserver(scheduleEnhance).observe(main,{childList:true,subtree:false});
window.addEventListener('hashchange',scheduleEnhance);window.addEventListener('DOMContentLoaded',scheduleEnhance);scheduleEnhance();
