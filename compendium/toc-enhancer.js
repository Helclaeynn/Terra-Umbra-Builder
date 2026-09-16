const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';
const $=s=>document.querySelector(s);

// Ces catégories sont pilotées exclusivement par data/navigation-v1.json via
// category-navigation.js. Ne jamais les faire retomber dans les anciens
// regroupements heuristiques de ce fichier.
const MANIFEST_NAV_CATEGORIES=new Set(['Règles','Réalité','Vérité','Équipement','Augmentations','Organisations','Personnages','Bestiaire','Catalogue Vérité']);

const TOP_ORDER={
  'Organisations':['Gouvernement','Corporations','Pègre','Crawlers & Underlife','Vampires','Exilés','Extrals','Chasseurs','Autres organisations'],
  'Personnages':['Gouvernement & institutions','Sécurité publique','Corporations','Pègre','Crawlers & Underlife','Vampires & Cours','Exilés','Extrals','Chasseurs','Fléaux & secrets','Index PNJ historique','Autres personnages'],
};
const SUB_ORDER={
  'Organisations|Gouvernement':['Institutions','Agences gouvernementales','Sécurité publique & LAUS'],
  'Organisations|Pègre':['Vue d’ensemble','Mafias & cartels','Gangs'],
  'Organisations|Vampires':['Cours vampiriques','Autres organisations vampiriques'],
  'Personnages|Pègre':['Mafias & cartels','Gangs','Autres figures de la Pègre']
};

function textFor(card){return norm(`${card.querySelector('h3')?.textContent||''} ${card.querySelector('p')?.textContent||''} ${card.dataset.filter||''}`)}
function pathFor(category,card){
  const t=textFor(card);
  if(category==='Organisations'){
    if(/laus|police|securite publique/.test(t))return['Gouvernement','Sécurité publique & LAUS'];
    if(/agence|cnad|cbii|cpp|inata|cbac|cchs|nrmd|eio|csco|stab/.test(t))return['Gouvernement','Agences gouvernementales'];
    if(/gouvernement|executif|legislatif|justice|senat|assemblee|cabinet/.test(t))return['Gouvernement','Institutions'];
    if(/corporation/.test(t))return['Corporations'];
    if(/sous page gangs|\bgangs?\b|bloods|crips|18th street|18st|ms-13|mara salvatrucha|sons of samoa|reapers incorporated/.test(t))return['Pègre','Gangs'];
    if(/pegre|mafia|triade|yamaguchi|sinaloa|menorah|oglaigh|milieu|cartel|vladivost|bratva|famille italo|vingt-deux dragons|french connection/.test(t))return['Pègre','Mafias & cartels'];
    if(/crawler|underlife|deathrunner|gundriver|neopunk|fixer/.test(t))return['Crawlers & Underlife'];
    if(/cour vamp|vampir/.test(t))return['Vampires','Cours vampiriques'];
    if(/exile|azmen|ashyll|thulkar|whurten|silcenter/.test(t))return['Exilés'];
    if(/extral|aidh|galact/.test(t))return['Extrals'];
    if(/chasseur/.test(t))return['Chasseurs'];
    return['Autres organisations'];
  }
  if(category==='Personnages'){
    if(/index pnj/.test(t))return['Index PNJ historique'];
    if(/fleau|abomination|predicateur/.test(t))return['Fléaux & secrets'];
    if(/vampir|cour/.test(t))return['Vampires & Cours'];
    if(/exile|azmen|ashyll|thulkar|whurten/.test(t))return['Exilés'];
    if(/extral|aidh|galact|slice/.test(t))return['Extrals'];
    if(/chasseur/.test(t))return['Chasseurs'];
    if(/sous page gangs|\bgangs?\b|bloods|crips|18th street|18st|ms-13|sons of samoa|reapers/.test(t))return['Pègre','Gangs'];
    if(/pegre|mafia|triade|yamaguchi|sinaloa|menorah|oglaigh|cartel|vladivost/.test(t))return['Pègre','Mafias & cartels'];
    if(/crawler|underlife/.test(t))return['Crawlers & Underlife'];
    if(/corporation/.test(t))return['Corporations'];
    if(/laus|police|securite/.test(t))return['Sécurité publique'];
    if(/gouvernement|agence|cnad|cbii|inata|cbac|cchs|nrmd|eio|csco|stab/.test(t))return['Gouvernement & institutions'];
    return['Autres personnages'];
  }
  return['Autres'];
}

function ordered(values,order=[]){return [...values].sort((a,b)=>{const ia=order.indexOf(a),ib=order.indexOf(b);if(ia<0&&ib<0)return a.localeCompare(b,'fr');if(ia<0)return 1;if(ib<0)return-1;return ia-ib})}
function rebuildArticleToc(){
  const toc=$('#tocBox'),main=$('#main');if(!toc||!main)return;
  const headings=[...main.querySelectorAll('.section h2,.section h3,.section h4,.section h5')];if(!headings.length)return;
  toc.innerHTML='<div class="toc-title">Sur cette page</div><div class="toc-links">'+headings.slice(0,160).map(h=>{const section=h.closest('.section');if(!section?.id)return'';const level=Number(h.tagName.slice(1));return `<a class="toc-level-${level}" href="#${section.id}" data-local-anchor="${section.id}">${h.textContent}</a>`}).join('')+'</div>';
  bindLocalToc(toc);
}
function bindLocalToc(root){root.querySelectorAll('[data-local-anchor]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.dataset.localAnchor)?.scrollIntoView({behavior:'smooth',block:'start'})}))}

function groupCategory(){
  const main=$('#main'),toc=$('#tocBox');if(!main||!toc)return false;
  const eyebrow=main.querySelector('.page-head .eyebrow')?.textContent||'';if(!eyebrow.startsWith('COMPENDIUM ·'))return false;
  const category=main.querySelector('.page-head h1')?.textContent?.trim();
  if(MANIFEST_NAV_CATEGORIES.has(category)) return true;
  const list=main.querySelector(':scope > .article-list:not([data-topic-source])');
  if(!category||!list||!TOP_ORDER[category])return false;
  const cards=[...list.querySelectorAll(':scope > .article-card')];if(!cards.length)return false;
  const tree=new Map();
  for(const card of cards){const [top,sub]=pathFor(category,card);if(!tree.has(top))tree.set(top,new Map());const subkey=sub||'';if(!tree.get(top).has(subkey))tree.get(top).set(subkey,[]);tree.get(top).get(subkey).push(card)}
  const tops=ordered(tree.keys(),TOP_ORDER[category]||[]),wrap=document.createElement('div');wrap.className='topic-groups';
  let tocHtml='<div class="toc-title">Dans cette rubrique</div><div class="toc-links toc-topics">';
  for(const top of tops){const topId=`topic-${slug(top)}`,section=document.createElement('section');section.className='topic-group';section.id=topId;const submap=tree.get(top),total=[...submap.values()].reduce((n,a)=>n+a.length,0);const h=document.createElement('h2');h.innerHTML=`<span>${top}</span><small>${total}</small>`;section.appendChild(h);tocHtml+=`<a href="#${topId}" data-local-anchor="${topId}"><span>${top}</span><small>${total}</small></a>`;
    const subs=ordered([...submap.keys()],SUB_ORDER[`${category}|${top}`]||[]);
    for(const sub of subs){const items=submap.get(sub);items.sort((a,b)=>{const ap=/page mere/.test(a.dataset.filter||'')?-1:0,bp=/page mere/.test(b.dataset.filter||'')?-1:0;return ap-bp||(a.querySelector('h3')?.textContent||'').localeCompare(b.querySelector('h3')?.textContent||'','fr',{numeric:true,sensitivity:'base'})});if(!sub){const inner=document.createElement('div');inner.className='article-list';items.forEach(c=>inner.appendChild(c));section.appendChild(inner);continue}const subId=`${topId}-${slug(sub)}`,subSection=document.createElement('div');subSection.className='topic-subgroup';subSection.id=subId;const sh=document.createElement('h3');sh.innerHTML=`<span>${sub}</span><small>${items.length}</small>`;const inner=document.createElement('div');inner.className='article-list';items.forEach(c=>inner.appendChild(c));subSection.append(sh,inner);section.appendChild(subSection);tocHtml+=`<a class="toc-level-3" href="#${subId}" data-local-anchor="${subId}"><span>${sub}</span><small>${items.length}</small></a>`}
    wrap.appendChild(section);
  }
  tocHtml+='</div>';list.dataset.topicSource='1';list.replaceWith(wrap);toc.innerHTML=tocHtml;bindLocalToc(toc);return true;
}

function enhance(){if(groupCategory())return;rebuildArticleToc()}
let scheduled=false;const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})};
new MutationObserver(schedule).observe(document.getElementById('main'),{childList:true,subtree:false});
window.addEventListener('hashchange',()=>setTimeout(schedule,30));setTimeout(schedule,50);
