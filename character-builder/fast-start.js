(()=> {
  const STORAGE='tuc-character-builder-v1';
  const STEPS=[
    ['identity','Identité'],['origin','Origine'],['sphere','Sphère & Style'],['attributes','Attributs'],
    ['skills','Compétences'],['talents','Talents'],['truth','Vérité'],['disadvantages','Désavantages'],
    ['edge','Edge'],['equipment','Équipement'],['finish','Finalisation'],['progression','Dépense XP & PTV']
  ];
  const stepContent=document.getElementById('stepContent'),stepNav=document.getElementById('stepNav');
  if(!stepContent||!stepNav)return;

  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch{return {}}};
  const stored=read();
  const identity={
    name:'',alias:'',age:'',sex:'',height:'',weight:'',concept:'',objective:'',notes:'',portraitDataUrl:'',portraitName:'',
    ...(stored.identity||{})
  };
  let targetStep=0;

  const write=()=>{
    const current=read();
    current.identity={...(current.identity||{}),...identity};
    try{localStorage.setItem(STORAGE,JSON.stringify(current))}catch(error){console.warn('Fast identity persistence',error)}
    renderSummary();
  };

  const field=(key,label,help,{required=false,placeholder='',textarea=false}={})=>{
    const requiredHtml=required?'<span class="p25-required">obligatoire</span>':'<span class="p25-optional">optionnel</span>';
    return `<div class="field p25-field"><label>${esc(label)} ${requiredHtml}</label>${textarea
      ?`<textarea rows="4" data-fast-identity="${esc(key)}" placeholder="${esc(placeholder)}">${esc(identity[key])}</textarea>`
      :`<input type="text" data-fast-identity="${esc(key)}" value="${esc(identity[key])}" placeholder="${esc(placeholder)}">`}<div class="p25-help">${esc(help)}</div></div>`;
  };

  async function resizePortrait(file){
    if(!file?.type?.startsWith('image/'))throw new Error('Le fichier choisi n’est pas une image.');
    if(file.size>12*1024*1024)throw new Error('Image trop lourde (12 Mo maximum avant redimensionnement).');
    const src=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('Lecture de l’image impossible.'));reader.onload=()=>resolve(String(reader.result||''));reader.readAsDataURL(file)});
    const img=await new Promise((resolve,reject)=>{const node=new Image();node.onerror=()=>reject(new Error('Format d’image illisible.'));node.onload=()=>resolve(node);node.src=src});
    const max=640,ratio=Math.min(1,max/Math.max(img.naturalWidth||1,img.naturalHeight||1)),canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));
    canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
    let data=canvas.toDataURL('image/webp',.82);if(!data.startsWith('data:image/webp'))data=canvas.toDataURL('image/jpeg',.84);return data;
  }

  function bindIdentity(){
    stepContent.querySelectorAll('[data-fast-identity]').forEach(input=>input.addEventListener('input',event=>{
      identity[event.currentTarget.dataset.fastIdentity]=event.currentTarget.value;write();
    }));
    const upload=stepContent.querySelector('[data-fast-portrait]');
    if(upload)upload.addEventListener('change',async event=>{
      const file=event.currentTarget.files?.[0];if(!file)return;
      try{identity.portraitDataUrl=await resizePortrait(file);identity.portraitName=file.name||'';write();renderIdentity()}catch(error){alert(error.message||String(error))}
    });
    stepContent.querySelector('[data-remove-portrait]')?.addEventListener('click',()=>{identity.portraitDataUrl='';identity.portraitName='';write();renderIdentity()});
  }

  function renderIdentity(){
    targetStep=0;window.__TUC_FAST_TARGET_STEP__=0;
    const portrait=identity.portraitDataUrl
      ?`<div class="p25-portrait-frame has-image"><img alt="Portrait de ${esc(identity.name||'personnage')}" src="${esc(identity.portraitDataUrl)}"></div>`
      :'<div class="p25-portrait-frame"><div class="p25-portrait-empty"><strong>Portrait</strong><span>Ajoutez une image pour incarner visuellement le personnage.</span></div></div>';
    const remove=identity.portraitDataUrl?'<button type="button" class="danger-btn mini" data-remove-portrait>Retirer le portrait</button>':'';
    stepContent.innerHTML=`
      <div class="section-title"><div><h2>Concept et identité</h2><p>Commencez par la personne, avant les chiffres. Ici, seuls le nom et l’âge sont nécessaires pour valider l’étape ; les autres champs servent à donner une apparence, une voix et des motivations au personnage.</p></div></div>
      <div class="p25-identity-layout">
        <aside class="p25-portrait-card">
          ${portrait}
          <label class="ghost p25-upload">${identity.portraitDataUrl?'Changer le portrait':'Choisir une image'}<input data-fast-portrait type="file" accept="image/*" hidden></label>
          ${remove}
          <div class="p25-help">Le portrait est redimensionné avant sauvegarde. Il sera repris dans la Finalisation puis dans la fiche exportée.</div>
        </aside>
        <div class="p25-identity-fields">
          <div class="p32-identity-short">
            <div class="p32-id-pair">
              ${field('name','Nom','Le nom principal sous lequel le personnage est identifié.',{required:true,placeholder:'Nom du personnage'})}
              ${field('age','Âge','Âge réel, légal ou apparent si cela a du sens pour le concept.',{required:true,placeholder:'Ex. 34 ans'})}
            </div>
            <div class="p32-id-pair">
              ${field('alias','Alias','Surnom, indicatif, nom de scène ou pseudonyme utilisé dans certains milieux.',{placeholder:'Ex. Ghost, Dr. Vale…'})}
              ${field('sex','Sexe / genre','Information descriptive sans conséquence mécanique.',{placeholder:'Ex. femme, homme, non-binaire…'})}
            </div>
            <div class="p32-id-pair">
              ${field('height','Taille','Information descriptive sans conséquence mécanique.',{placeholder:'Ex. 1,78 m'})}
              ${field('weight','Poids','Information descriptive sans conséquence mécanique.',{placeholder:'Ex. 72 kg'})}
            </div>
          </div>
          <div class="p25-narrative-grid">
            ${field('concept','Concept','Une phrase qui résume l’idée du personnage : rôle, tempérament, contradiction ou image forte.',{placeholder:'Ex. ancienne enquêtrice devenue fixer pour l’Underlife'})}
            ${field('objective','Objectif','Ce que le personnage veut concrètement aujourd’hui : retrouver quelqu’un, gagner une place, payer une dette, comprendre un secret…',{placeholder:'Ex. retrouver son frère disparu'})}
            ${field('notes','Notes / background','Quelques éléments de caractère, d’apparence, de relations ou d’histoire. Inutile d’écrire une biographie complète avant la première scène.',{textarea:true,placeholder:'Caractère, apparence, personnes importantes, événement marquant…'})}
          </div>
        </div>
      </div>
      <div class="rulebox"><strong>Repère de jeu :</strong> une identité claire et quelques prises sur le monde suffisent pour commencer ; les détails peuvent émerger en campagne.</div>`;
    bindIdentity();renderNav();renderActions();renderSummary();
  }

  function renderWaiting(index){
    targetStep=index;window.__TUC_FAST_TARGET_STEP__=index;
    const label=STEPS[index]?.[1]||'Étape';
    stepContent.innerHTML=`<div class="section-title"><div><h2>${esc(label)}</h2><p>Les données nécessaires à cette étape terminent leur chargement.</p></div><span class="badge">Chargement…</span></div><div class="empty" style="min-height:420px;display:grid;place-items:center"><div><strong>Cette page sera disponible dans quelques instants.</strong><br><span class="muted">Vous pouvez revenir à Identité sans perdre vos saisies.</span></div></div>`;
    renderNav();renderActions();renderSummary();
  }

  function renderNav(){
    stepNav.innerHTML='';
    STEPS.forEach(([id,label],index)=>{
      const b=document.createElement('button');b.className=`step-link ${index===targetStep?'active':''}`;b.type='button';b.dataset.fastStep=id;
      b.innerHTML=`<span class="dot"></span><span class="step-label">${index+1}. ${esc(label)}</span>`;
      b.onclick=()=>index===0?renderIdentity():renderWaiting(index);stepNav.appendChild(b);
    });
    const progress=document.getElementById('progressText');if(progress)progress.textContent=`0 / 11 étapes valides · chargement en cours`;
    const bar=document.getElementById('progressBar');if(bar)bar.style.width='0%';
  }

  function renderSummary(){
    const summary=document.getElementById('summaryContent'),badge=document.getElementById('validBadge');if(!summary)return;
    if(badge){badge.className='badge bad';badge.textContent='À compléter'}
    summary.innerHTML=`
      <div class="summary-section"><h4>Personnage</h4><div class="summary-line"><span>Nom</span><span>${esc(identity.name||'—')}</span></div><div class="summary-line"><span>Concept</span><span>${esc(identity.concept||'—')}</span></div></div>
      <div class="summary-section"><h4>Cadre social</h4><div class="summary-line"><span>Origine</span><span>—</span></div><div class="summary-line"><span>Sphère</span><span>—</span></div><div class="summary-line"><span>Style</span><span>—</span></div><div class="summary-line"><span>Train de vie</span><span>—</span></div></div>
      <div class="summary-section"><h4>Ressources</h4><div class="summary-line"><span>Edge</span><span>—</span></div><div class="summary-line"><span>Compte</span><span>—</span></div><div class="summary-line"><span>PTV réserve</span><span>—</span></div><div class="summary-line"><span>Renommée</span><span>—</span></div></div>
      <div class="summary-section"><h4>Dérivés</h4><div class="summary-line"><span>PV</span><span>—</span></div><div class="summary-line"><span>Init.</span><span>—</span></div><div class="summary-line"><span>Déf.</span><span>—</span></div><div class="summary-line"><span>Déf. occ.</span><span>—</span></div><div class="summary-line"><span>Intégrité</span><span>—</span></div></div>
      <div class="summary-section"><h4>Vérité</h4><div class="summary-line"><span>Nature</span><span>—</span></div><div class="summary-line"><span>Conscience</span><span>—</span></div><div class="summary-line"><span>PTV</span><span>—</span></div></div>`;
  }

  function renderActions(){
    const prev=document.getElementById('prevBtn'),next=document.getElementById('nextBtn');
    if(prev){prev.disabled=targetStep===0;prev.onclick=()=>targetStep<=1?renderIdentity():renderWaiting(targetStep-1)}
    if(next){next.disabled=false;next.textContent=targetStep===STEPS.length-1?'Chargement…':'Suivant →';next.onclick=()=>{if(targetStep<STEPS.length-1)renderWaiting(targetStep+1)}}
  }

  const save=document.getElementById('saveBtn'),load=document.getElementById('loadBtn'),exportBtn=document.getElementById('exportBtn');
  if(save)save.onclick=()=>{write();save.textContent='Sauvegardé ✓';setTimeout(()=>{if(!window.__TUC_APP_READY__)save.textContent='Sauvegarder'},900)};
  for(const button of [load,exportBtn])if(button){button.disabled=true;button.title='Disponible dès la fin du chargement du Builder';}

  renderIdentity();
  window.__TUC_FAST_IDENTITY_READY__=true;
  window.__TUC_FAST_IDENTITY__=identity;
  window.addEventListener('tuc-builder-ready',()=>{
    for(const button of [load,exportBtn])if(button){button.disabled=false;button.removeAttribute('title')}
    const target=Number(window.__TUC_FAST_TARGET_STEP__||0);if(target>0)requestAnimationFrame(()=>document.querySelectorAll('#stepNav .step-link')[target]?.click());
  },{once:true});
})();