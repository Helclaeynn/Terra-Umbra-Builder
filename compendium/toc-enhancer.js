const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'section';
const $=s=>document.querySelector(s);

const GROUP_ORDER={
  'Règles':['Résolution & profil','Combat','Santé & états','Progression & ressources','Création de personnage','Autres règles'],
  'Réalité':['Grande Californie & société','Gouvernement & institutions','Sécurité publique','Corporations & économie','Technologie & Neurodive','Équipement & véhicules','Autres éléments de Réalité'],
  'Vérité':['Voile & cosmologie','Peuples & Natures','Vampires & Garous','Mages & traditions','Exilés','Extrals','Chasseurs','Fléaux & Abominations','Ombremonde & lieux','Autres éléments de Vérité'],
  'Organisations':['Gouvernement','Agences gouvernementales','Sécurité publique & LAUS','Corporations','Pègre','Crawlers & Underlife','Cours vampiriques','Exilés','Extrals','Chasseurs','Autres organisations'],
  'Personnages':['Gouvernement & institutions','Sécurité publique','Corporations','Pègre','Crawlers & Underlife','Vampires & Cours','Exilés','Extrals','Chasseurs','Fléaux & secrets','Index PNJ historique','Autres personnages'],
  'Bestiaire':['Profils de Réalité','Revenants','Vampires & Garous','Mages & occultistes','Exilés & Extrals','Fléaux & Abominations','Figures uniques & scénarios','Autres profils']
};

function groupFor(category,card){
  const title=norm(card.querySelector('h3')?.textContent||'');
  const meta=norm(card.querySelector('p')?.textContent||'');
  const t=`${title} ${meta}`;
  if(category==='Règles'){
    if(/resolution|profil derive|statut/.test(t))return'Résolution & profil';
    if(/combat|tir|initiative|defense/.test(t))return'Combat';
    if(/sante|soins|stress|raison|corruption|etat/.test(t))return'Santé & états';
    if(/progression|experience|ptv|edge|ressource/.test(t))return'Progression & ressources';
    if(/creation/.test(t))return'Création de personnage';
    return'Autres règles';
  }
  if(category==='Réalité'){
    if(/gouvernement|agence|cnad|cbii|inata|cbac|cchs|nrmd|eio|csco|stab/.test(t))return'Gouvernement & institutions';
    if(/laus|police|securite/.test(t))return'Sécurité publique';
    if(/corporation|economie|train de vie|finance/.test(t))return'Corporations & économie';
    if(/neuro|technolog|augment|implant|holonet/.test(t))return'Technologie & Neurodive';
    if(/equipement|arme|vehicule/.test(t))return'Équipement & véhicules';
    if(/californ|societe|quotidien|geographie/.test(t))return'Grande Californie & société';
    return'Autres éléments de Réalité';
  }
  if(category==='Vérité'){
    if(/voile|hologramme|cosmolog|verite/.test(t))return'Voile & cosmologie';
    if(/vampir|garou/.test(t))return'Vampires & Garous';
    if(/mage|sorcier|thaum|loge/.test(t))return'Mages & traditions';
    if(/exile|azmen|ashyll|thulkar|whurten|silcenter/.test(t))return'Exilés';
    if(/extral|humain galact|slice|aidh/.test(t))return'Extrals';
    if(/chasseur|chasseurs/.test(t))return'Chasseurs';
    if(/fleau|abomination|predicateur|rupture/.test(t))return'Fléaux & Abominations';
    if(/ombre|lieu|sanctuaire|point de rencontre/.test(t))return'Ombremonde & lieux';
    if(/nature|peuple|espece|angelus|daemon|aseryn/.test(t))return'Peuples & Natures';
    return'Autres éléments de Vérité';
  }
  if(category==='Organisations'){
    if(/agence|cnad|cbii|cpp|inata|cbac|cchs|nrmd|eio|csco|stab/.test(t))return'Agences gouvernementales';
    if(/gouvernement|executif|legislatif|justice|senat|assemblee/.test(t))return'Gouvernement';
    if(/laus|police|securite publique/.test(t))return'Sécurité publique & LAUS';
    if(/corporation/.test(t))return'Corporations';
    if(/pegre|mafia|triade|yamaguchi|sinaloa|menorah|oglaigh|milieu|cartel|vladivost/.test(t))return'Pègre';
    if(/crawler|underlife|gang/.test(t))return'Crawlers & Underlife';
    if(/cour vamp|vampir/.test(t))return'Cours vampiriques';
    if(/exile|azmen|ashyll|thulkar|whurten|silcenter/.test(t))return'Exilés';
    if(/extral|aidh|galact/.test(t))return'Extrals';
    if(/chasseur/.test(t))return'Chasseurs';
    return'Autres organisations';
  }
  if(category==='Personnages'){
    if(/index pnj/.test(t))return'Index PNJ historique';
    if(/fleau|abomination|predicateur/.test(t))return'Fléaux & secrets';
    if(/vampir|cour/.test(t))return'Vampires & Cours';
    if(/exile|azmen|ashyll|thulkar|whurten/.test(t))return'Exilés';
    if(/extral|aidh|galact|slice/.test(t))return'Extrals';
    if(/chasseur/.test(t))return'Chasseurs';
    if(/crawler|underlife|gang/.test(t))return'Crawlers & Underlife';
    if(/pegre|mafia|triade|yamaguchi|sinaloa|menorah|oglaigh|cartel|vladivost/.test(t))return'Pègre';
    if(/corporation/.test(t))return'Corporations';
    if(/laus|police|securite/.test(t))return'Sécurité publique';
    if(/gouvernement|agence|cnad|cbii|inata|cbac|cchs|nrmd|eio|csco|stab/.test(t))return'Gouvernement & institutions';
    return'Autres personnages';
  }
  if(category==='Bestiaire'){
    if(/revenant|spectre|zombie|squelette|liche|momie|jiangshi|draugar/.test(t))return'Revenants';
    if(/vampir|garou/.test(t))return'Vampires & Garous';
    if(/mage|occult/.test(t))return'Mages & occultistes';
    if(/exile|extral/.test(t))return'Exilés & Extrals';
    if(/fleau|abomination|wendigo|rupture/.test(t))return'Fléaux & Abominations';
    if(/scenario|unique|figure|artefact/.test(t))return'Figures uniques & scénarios';
    if(/realite|humain|soldat|police|corporat/.test(t))return'Profils de Réalité';
    return'Autres profils';
  }
  return'Autres';
}

function rebuildArticleToc(){
  const toc=$('#tocBox'),main=$('#main');if(!toc||!main)return;
  const headings=[...main.querySelectorAll('.section h2,.section h3,.section h4,.section h5')];
  if(!headings.length)return;
  toc.innerHTML='<div class="toc-title">Sur cette page</div><div class="toc-links">'+headings.slice(0,120).map(h=>{
    const section=h.closest('.section');if(!section?.id)return'';
    const level=Number(h.tagName.slice(1));
    return `<a class="toc-level-${level}" href="#${section.id}" data-local-anchor="${section.id}">${h.textContent}</a>`;
  }).join('')+'</div>';
  toc.querySelectorAll('[data-local-anchor]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.dataset.localAnchor)?.scrollIntoView({behavior:'smooth',block:'start'})}));
}

function groupCategory(){
  const main=$('#main'),toc=$('#tocBox');if(!main||!toc)return false;
  const eyebrow=main.querySelector('.page-head .eyebrow')?.textContent||'';
  if(!eyebrow.startsWith('COMPENDIUM ·'))return false;
  const category=main.querySelector('.page-head h1')?.textContent?.trim();
  const list=main.querySelector('.article-list:not([data-topic-source])');
  if(!category||!list)return false;
  const cards=[...list.querySelectorAll(':scope > .article-card')];if(!cards.length)return false;
  const grouped=new Map();for(const card of cards){const g=groupFor(category,card);if(!grouped.has(g))grouped.set(g,[]);grouped.get(g).push(card)}
  const order=GROUP_ORDER[category]||[];
  const names=[...grouped.keys()].sort((a,b)=>{const ia=order.indexOf(a),ib=order.indexOf(b);if(ia<0&&ib<0)return a.localeCompare(b,'fr');if(ia<0)return 1;if(ib<0)return-1;return ia-ib});
  const wrap=document.createElement('div');wrap.className='topic-groups';
  for(const name of names){const section=document.createElement('section');section.className='topic-group';section.id=`topic-${slug(name)}`;const h=document.createElement('h2');h.innerHTML=`<span>${name}</span><small>${grouped.get(name).length}</small>`;const inner=document.createElement('div');inner.className='article-list';for(const card of grouped.get(name))inner.appendChild(card);section.append(h,inner);wrap.appendChild(section)}
  list.dataset.topicSource='1';list.replaceWith(wrap);
  toc.innerHTML=`<div class="toc-title">Dans cette rubrique</div><div class="toc-links toc-topics">${names.map(name=>`<a href="#topic-${slug(name)}" data-local-anchor="topic-${slug(name)}"><span>${name}</span><small>${grouped.get(name).length}</small></a>`).join('')}</div>`;
  toc.querySelectorAll('[data-local-anchor]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.dataset.localAnchor)?.scrollIntoView({behavior:'smooth',block:'start'})}));
  return true;
}

function enhance(){if(groupCategory())return;rebuildArticleToc()}
let scheduled=false;const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})};
new MutationObserver(schedule).observe(document.getElementById('main'),{childList:true,subtree:true});
window.addEventListener('hashchange',()=>setTimeout(schedule,30));
setTimeout(schedule,50);
