(()=>{
  const DOCS=[
    {id:'pegre',group:'Société & institutions',title:'Pègre de Los Angeles',count:18,href:'pegre-preview.html',description:'Crime organisé californien, CCGC, grandes mafias, cartels et gangs.'},
    {id:'agences',group:'Société & institutions',title:'Agences gouvernementales',count:18,href:'agences-preview.html',description:'CNAD, CBII, agences spécialisées californiennes et services de renseignement étrangers.'},
    {id:'gouvernement',group:'Société & institutions',title:'Gouvernement',count:18,href:'gouvernement-preview.html',description:'Exécutif, législatif, justice, services publics, défense et Grande Réserve.'},
    {id:'vie-quotidienne',group:'Société & institutions',title:'Vie quotidienne',count:18,href:'vie-quotidienne-preview.html',description:'Urbanisme, énergie, alimentation, transports, matériaux, augmentations, Holonet, santé, loisirs, médias, logement et robotique.'},
    {id:'police',group:'Société & institutions',title:'Police de Los Angeles',count:20,href:'police-preview.html',description:'LAUS, réforme Caza, formation, Surveillance, Enquêtes, Interventions et polices de Grande Californie.'},
    {id:'religions',group:'Société & institutions',title:'Religions et néoreligions',count:24,href:'religions-preview.html',description:'Chrétienté, Islam, Hindouisme, Shientaoïsme, Église cybernétique, Néopaganisme, Holonetisme/Elyséisme, Judaïsme et sectes.'},
    {id:'corporations',group:'Société & institutions',title:'Corporations',count:68,href:'corporations-preview.html',description:'Généralités, droits, guerres corporatistes, territoires et 60 corporations.'},
    {id:'crawlers',group:'Société & institutions',title:'Crawlers',count:16,href:'crawlers-preview.html',description:'Chronologie, Underlife et six grandes familles : Fixers, DeathRunners, Neurodivers, Meditechs, Gundrivers et Neopunks.'},
    {id:'anti-systemes',group:'Société & institutions',title:'Crawlers — Anti-systèmes',count:34,href:'anti-systemes-preview.html',description:'Neopunks, factions insurgées, grands Motorcycle Clubs et communautés Enders.'},
    {id:'angelus',group:'Surnaturel',title:'Arbre de Vie & Angelus',count:21,href:'angelus-preview.html',description:'Architecture de l’Arbre de Vie, Elynea, dix Sephiroth, hiérarchie angélique et Archanges renégats.'},
    {id:'vampire-courts',group:'Surnaturel',title:'Cours vampiriques',count:12,href:'vampire-courts-preview.html',description:'Origines des Cours et grandes traditions vampiriques.'},
    {id:'pelages',group:'Surnaturel',title:'Pelages / Loups-garous',count:6,href:'pelages-preview.html',description:'Appel de la Meute, six Pelages, hiérarchie, migrations, territoires et lignées périphériques.'},
    {id:'therianthropes',group:'Surnaturel',title:'Autres Thérianthropes',count:7,href:'therianthropes-preview.html',description:'Canidés, Félidés, Oiseaux, Requins, Serpents, Hyènes, Ours et autres descendants rares de Khinae.'},
    {id:'mage-lodges',group:'Surnaturel',title:'Loges des Mages',count:8,href:'mage-lodges-preview.html',description:'Organisation générale et Loges de New-York, Los Angeles, San Diejuana, Las Vegas, Phoenix et Grande Réserve.'},
    {id:'daemon-temples',group:'Surnaturel',title:'Temples Daemoniaques',count:15,href:'daemon-temples-preview.html',description:'Fonctionnement des Temples, portail infernal, trônes sacrés, purification et treize Temples nommés.'},
    {id:'aseryn-temples',group:'Surnaturel',title:'Temples Aseryns',count:8,href:'aseryn-temples-preview.html',description:'Origines aserynes, cosmologie du Tout, Serathè, Fondateurs, Ordre Sépulcral et grands Temples.'},
    {id:'aseryn-continents',group:'Surnaturel',title:'Continents Aseryns',count:6,href:'aseryn-continents-preview.html',description:'Socle des terres aserynes, Atlantide, Mû, Lémurie, Hyperborée et diaspora serathèenne.'},
    {id:'supernatural-species',group:'Surnaturel',title:'Espèces surnaturelles',count:8,href:'supernatural-species-preview.html',description:'Contexte général, Khinae, Vampires, Loups-garous, Mages, Atlantes/Aseryns, Daemons, Angelus et autres créatures.'},
    {id:'plagues',group:'Surnaturel',title:'Fléaux',count:8,href:'plagues-preview.html',description:"Nature des Fléaux, entités majeures et leurs cultes."},
    {id:'grands-exiles',group:'Galactique & Exilés',title:'Grands Exilés',count:10,href:'grands-exiles-preview.html',description:'Conseil des Anciens, Syndicat de Jade, Chasse Fantastique, Fédération Elfique, hordes orques, factions naines et autres exilés.'},
    {id:'extrals-groups',group:'Galactique & Exilés',title:"Groupes d’Extrals",count:9,href:'extrals-groups-preview.html',description:'Histoire galactique des Extrals, GAAC, CTU, Émeraude sanglante, R.E.P.T.I.L.E., mafia Shaediri, SMRC et Hydroguard.'},
    {id:'humans-galaxy',group:'Galactique & Exilés',title:'Humains galactiques',count:5,href:'humans-galaxy-preview.html',description:'Histoire galactique humaine, enjeux de Terra Umbra, AIDH, G-corporations et Inquisition galactique.'},
    {id:'extraterrestrial-species',group:'Galactique & Exilés',title:'Espèces extraterrestres',count:7,href:'extraterrestrial-species-preview.html',description:'Contexte galactique, Talass, Mo’sens, Baseanhs, Rocreens, Thalsios et autres espèces présentes sur Terre.'}
  ];
  const $=s=>document.querySelector(s);
  const frame=$('#previewFrame');
  const loader=$('#frameLoading');
  const auditStatus=$('#auditStatus');
  let activeId='';

  function pageTotal(){return DOCS.reduce((n,d)=>n+d.count,0)}
  function idFromHash(){return decodeURIComponent(location.hash.replace(/^#\/?/,''))}
  function docById(id){return DOCS.find(d=>d.id===id)||DOCS[0]}
  function indexOf(id){const n=DOCS.findIndex(d=>d.id===id);return n<0?0:n}

  function buildNav(){
    const nav=$('#docNav');nav.innerHTML='';let currentGroup='';
    DOCS.forEach(doc=>{
      if(doc.group!==currentGroup){currentGroup=doc.group;const group=document.createElement('div');group.className='nav-group';group.textContent=currentGroup;nav.appendChild(group)}
      const button=document.createElement('button');button.className='doc-link';button.type='button';button.dataset.id=doc.id;button.dataset.search=`${doc.title} ${doc.group} ${doc.description}`.toLowerCase();
      button.innerHTML=`<span class="doc-name"></span><span class="doc-count">${doc.count}</span>`;button.querySelector('.doc-name').textContent=doc.title;
      button.addEventListener('click',()=>navigate(doc.id));nav.appendChild(button);
    });
  }

  function navigate(id){
    const doc=docById(id);const next=`#/${encodeURIComponent(doc.id)}`;
    if(location.hash!==next) location.hash=next; else select(doc);
    document.body.classList.remove('sidebar-open');
  }

  function select(doc){
    if(!doc)return;if(activeId===doc.id)return;activeId=doc.id;
    document.querySelectorAll('.doc-link').forEach(b=>b.classList.toggle('active',b.dataset.id===doc.id));
    $('#docGroup').textContent=doc.group;$('#docTitle').textContent=doc.title;$('#docCount').textContent=`${doc.count} pages candidates`;$('#docDescription').textContent=doc.description;
    $('#openStandalone').href=doc.href;$('#openStandalone').title=`Ouvrir ${doc.title} seule`;
    const idx=indexOf(doc.id),prev=DOCS[(idx-1+DOCS.length)%DOCS.length],next=DOCS[(idx+1)%DOCS.length];
    $('#prevDoc').title=`Précédent : ${prev.title}`;$('#nextDoc').title=`Suivant : ${next.title}`;
    loader.classList.remove('hidden');loader.textContent=`Chargement · ${doc.title}`;
    frame.src=doc.href;
  }

  function tuneFrame(){
    loader.classList.add('hidden');
    try{
      const d=frame.contentDocument;if(!d)return;
      const st=d.createElement('style');
      st.textContent=`.topbar,.preview-topbar,.preview-banner{display:none!important}body{min-height:100vh!important}.app-shell{min-height:100vh!important}.preview-layout{min-height:100vh!important}`;
      d.head.appendChild(st);
    }catch(_e){}
  }

  function filterNav(){
    const q=$('#docSearch').value.trim().toLowerCase();
    document.querySelectorAll('.doc-link').forEach(b=>b.classList.toggle('hidden',!!q&&!b.dataset.search.includes(q)));
    document.querySelectorAll('.nav-group').forEach(group=>{
      let node=group.nextElementSibling,visible=false;
      while(node&&!node.classList.contains('nav-group')){if(node.classList.contains('doc-link')&&!node.classList.contains('hidden'))visible=true;node=node.nextElementSibling}
      group.style.display=visible?'':'none';
    });
  }

  async function fetchText(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${url}`);return r.text()}
  function isLocal(ref){return ref&&!/^(?:[a-z]+:|\/\/|#|data:)/i.test(ref)}
  async function audit(){
    const failures=[];let checked=0;const assetUrls=new Set();
    if(DOCS.length!==23)failures.push(`manifest: ${DOCS.length} documents au lieu de 23`);
    if(pageTotal()!==364)failures.push(`manifest: ${pageTotal()} pages au lieu de 364`);
    auditStatus.textContent='Audit 0/23';auditStatus.className='audit-pill';
    for(const doc of DOCS){
      try{
        const html=await fetchText(doc.href);checked++;auditStatus.textContent=`Audit ${checked}/23`;
        const parsed=new DOMParser().parseFromString(html,'text/html');
        parsed.querySelectorAll('link[rel~="stylesheet"][href],script[src]').forEach(el=>{
          const ref=el.getAttribute('href')||el.getAttribute('src');if(isLocal(ref))assetUrls.add(new URL(ref,new URL(doc.href,location.href)).href);
        });
      }catch(e){failures.push(`${doc.href}: ${e.message||e}`)}
    }
    const assets=[...assetUrls];let assetChecked=0;
    await Promise.all(assets.map(async url=>{try{const r=await fetch(url,{cache:'no-store'});assetChecked++;if(!r.ok)failures.push(`${new URL(url).pathname}: HTTP ${r.status}`)}catch(e){failures.push(`${new URL(url).pathname}: ${e.message||e}`)}}));
    auditStatus.className=`audit-pill ${failures.length?'error':'ok'}`;
    auditStatus.textContent=failures.length?`${failures.length} erreur${failures.length>1?'s':''}`:'Audit OK';
    auditStatus.title=failures.length?failures.join('\n'):`23/23 previews · ${assets.length}/${assets.length} assets locaux accessibles · 364 pages déclarées`;
  }

  function boot(){
    buildNav();
    $('#docSearch').addEventListener('input',filterNav);
    $('#menuToggle').addEventListener('click',()=>document.body.classList.toggle('sidebar-open'));
    $('#mobileScrim').addEventListener('click',()=>document.body.classList.remove('sidebar-open'));
    $('#prevDoc').addEventListener('click',()=>navigate(DOCS[(indexOf(activeId)-1+DOCS.length)%DOCS.length].id));
    $('#nextDoc').addEventListener('click',()=>navigate(DOCS[(indexOf(activeId)+1)%DOCS.length].id));
    frame.addEventListener('load',tuneFrame);
    window.addEventListener('hashchange',()=>select(docById(idFromHash())));
    $('#corpusCount').textContent=`${DOCS.length} documents`;
    $('#pageCount').textContent=`${pageTotal()} pages`;
    const first=docById(idFromHash());
    if(!location.hash)history.replaceState(null,'',`#/${first.id}`);
    select(first);
    audit();
  }
  boot();
})();
