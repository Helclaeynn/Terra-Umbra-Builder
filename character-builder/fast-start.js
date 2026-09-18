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
  const identity={name:'',age:'',alias:'',sex:'',height:'',weight:'',concept:'',objective:'',notes:'',...(read().identity||{})};
  let targetStep=0;

  const write=()=>{
    const current=read();
    current.identity={...(current.identity||{}),...identity};
    try{localStorage.setItem(STORAGE,JSON.stringify(current))}catch(error){console.warn('Fast identity persistence',error)}
    renderSummary();
  };

  const short=[
    ['name','Nom','Nom du personnage',true],
    ['age','Âge','Ex. 34 ans',true],
    ['alias','Alias','Ex. Ghost, Dr. Vale…',false],
    ['sex','Sexe / genre','Ex. femme, homme, non-binaire…',false],
    ['height','Taille','Ex. 1,78 m',false],
    ['weight','Poids','Ex. 72 kg',false]
  ];
  const field=(key,label,placeholder,required=false,textarea=false)=>`
    <label class="builder-fast-field">
      <span>${esc(label)} <small>${required?'obligatoire':'optionnel'}</small></span>
      ${textarea
        ?`<textarea data-fast-identity="${esc(key)}" rows="3" placeholder="${esc(placeholder)}">${esc(identity[key])}</textarea>`
        :`<input data-fast-identity="${esc(key)}" value="${esc(identity[key])}" placeholder="${esc(placeholder)}">`}
    </label>`;

  function bindIdentity(){
    stepContent.querySelectorAll('[data-fast-identity]').forEach(input=>{
      input.addEventListener('input',event=>{
        identity[event.currentTarget.dataset.fastIdentity]=event.currentTarget.value;
        write();
      });
    });
  }
  function renderIdentity(){
    targetStep=0;window.__TUC_FAST_TARGET_STEP__=0;
    stepContent.innerHTML=`
      <div class="builder-fast-head">
        <div><div class="eyebrow">ÉTAPE 1 / IDENTITÉ</div><h2>Concept et identité</h2><p>Commencez normalement : le reste du Builder se charge en arrière-plan sans bloquer cette page.</p></div>
        <span class="builder-fast-loading">Chargement des autres étapes…</span>
      </div>
      <div class="builder-fast-short">${short.map(x=>field(...x)).join('')}</div>
      <div class="builder-fast-narrative">
        ${field('concept','Concept','Ex. ancienne enquêtrice devenue fixer pour l’Underlife')}
        ${field('objective','Objectif','Ex. retrouver son frère disparu')}
        ${field('notes','Notes / background','Caractère, apparence, personnes importantes, événement marquant…',false,true)}
      </div>
      <div class="builder-fast-note"><strong>Saisie conservée.</strong> Le portrait et les contrôles complets apparaîtront dès que le moteur sera prêt.</div>`;
    bindIdentity();renderNav();renderActions();
  }
  function renderWaiting(index){
    targetStep=index;window.__TUC_FAST_TARGET_STEP__=index;
    const label=STEPS[index]?.[1]||'Étape';
    stepContent.innerHTML=`<div class="builder-fast-step-loading"><div><div class="eyebrow">ÉTAPE ${index+1}</div><h2>${esc(label)}</h2><p>Cette étape utilise encore des règles ou catalogues en cours de chargement. Elle s’ouvrira automatiquement dès que le Builder sera prêt.</p><div class="builder-fast-wait"><strong>L’interface reste disponible.</strong> Vous pouvez revenir à Identité pendant le chargement sans perdre vos saisies.</div></div></div>`;
    renderNav();renderActions();
  }
  function renderNav(){
    stepNav.innerHTML='';
    STEPS.forEach(([id,label],index)=>{
      const b=document.createElement('button');
      b.className=`step-link ${index===targetStep?'active':''}`;
      b.type='button';b.dataset.fastStep=id;
      b.innerHTML=`<span class="dot"></span><span class="step-label">${index+1}. ${esc(label)}</span>`;
      b.onclick=()=>index===0?renderIdentity():renderWaiting(index);
      stepNav.appendChild(b);
    });
    const progress=document.getElementById('progressText');if(progress)progress.textContent=`0 / ${STEPS.length-1} étapes de création valides`;
    const bar=document.getElementById('progressBar');if(bar)bar.style.width='0%';
  }
  function renderSummary(){
    const summary=document.getElementById('summaryContent'),badge=document.getElementById('validBadge');
    if(badge){badge.className='badge bad';badge.textContent='Chargement'}
    if(!summary)return;
    summary.className='builder-fast-summary';
    summary.innerHTML=`
      <div class="summary-section"><h4>Personnage</h4><div class="summary-line"><span>Nom</span><span>${esc(identity.name||'—')}</span></div><div class="summary-line"><span>Concept</span><span>${esc(identity.concept||'—')}</span></div></div>
      <div class="summary-section"><h4>Création</h4><div class="summary-line"><span>Étape active</span><span>${esc(STEPS[targetStep]?.[1]||'Identité')}</span></div><div class="summary-line"><span>Moteur</span><span>chargement…</span></div></div>
      <div class="summary-section"><h4>À venir</h4><div class="muted small">Origine, Sphère, Attributs, Vérité, Équipement et ressources apparaîtront ici dès leur chargement.</div></div>`;
  }
  function renderActions(){
    const prev=document.getElementById('prevBtn'),next=document.getElementById('nextBtn');
    if(prev){prev.disabled=targetStep===0;prev.onclick=()=>targetStep<=1?renderIdentity():renderWaiting(targetStep-1)}
    if(next){next.disabled=false;next.textContent=targetStep===STEPS.length-1?'Chargement…':'Suivant →';next.onclick=()=>{if(targetStep<STEPS.length-1)renderWaiting(targetStep+1)}}
    renderSummary();
  }

  const save=document.getElementById('saveBtn'),load=document.getElementById('loadBtn'),exportBtn=document.getElementById('exportBtn');
  if(save)save.onclick=()=>{write();save.textContent='Sauvegardé ✓';setTimeout(()=>{if(!window.__TUC_APP_READY__)save.textContent='Sauvegarder'},900)};
  for(const button of [load,exportBtn])if(button){button.disabled=true;button.title='Disponible dès la fin du chargement du Builder';}

  renderIdentity();
  window.__TUC_FAST_IDENTITY_READY__=true;
  window.__TUC_FAST_IDENTITY__=identity;

  window.addEventListener('tuc-builder-ready',()=>{
    for(const button of [load,exportBtn])if(button){button.disabled=false;button.removeAttribute('title')}
    const target=Number(window.__TUC_FAST_TARGET_STEP__||0);
    if(target>0)requestAnimationFrame(()=>document.querySelectorAll('#stepNav .step-link')[target]?.click());
  },{once:true});
})();