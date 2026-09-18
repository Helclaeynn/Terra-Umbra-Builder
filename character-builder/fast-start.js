(()=> {
  const STORAGE='tuc-character-builder-v1';
  const mount=document.getElementById('builderFastIdentity');
  if(!mount)return;

  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch{return {}}};
  const identity={name:'',age:'',alias:'',sex:'',height:'',weight:'',concept:'',objective:'',notes:'',...(read().identity||{})};
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

  mount.innerHTML=`
    <div class="builder-fast-head">
      <div>
        <div class="eyebrow">ÉTAPE 1 / IDENTITÉ</div>
        <h2>Concept et identité</h2>
        <p>Vous pouvez commencer pendant que les règles, catalogues et données de Vérité se chargent en arrière-plan.</p>
      </div>
      <span class="builder-fast-loading">Chargement des autres étapes…</span>
    </div>
    <div class="builder-fast-short">${short.map(x=>field(...x)).join('')}</div>
    <div class="builder-fast-narrative">
      ${field('concept','Concept','Ex. ancienne enquêtrice devenue fixer pour l’Underlife')}
      ${field('objective','Objectif','Ex. retrouver son frère disparu')}
      ${field('notes','Notes / background','Caractère, apparence, personnes importantes, événement marquant…',false,true)}
    </div>
    <div class="builder-fast-note"><strong>Saisie conservée.</strong> Ces champs seront repris automatiquement dans le Builder complet dès qu’il est prêt. Le portrait sera disponible dans l’interface complète.</div>
  `;

  const write=()=>{
    const current=read();
    current.identity={...(current.identity||{}),...identity};
    try{localStorage.setItem(STORAGE,JSON.stringify(current))}catch(error){console.warn('Fast identity persistence',error)}
  };
  mount.querySelectorAll('[data-fast-identity]').forEach(input=>{
    input.addEventListener('input',event=>{
      identity[event.currentTarget.dataset.fastIdentity]=event.currentTarget.value;
      write();
    });
  });
  window.__TUC_FAST_IDENTITY_READY__=true;
  window.__TUC_FAST_IDENTITY__=identity;
})();