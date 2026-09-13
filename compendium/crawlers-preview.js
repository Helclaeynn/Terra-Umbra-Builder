(()=>{
  const $=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let DB={pages:[]};
  const current=()=>decodeURIComponent(location.hash.replace(/^#\/?/,''))||DB.pages[0]?.id||'';
  function nav(){
    const n=$('#nav'); n.innerHTML=''; let g='';
    for(const p of DB.pages){
      if(p.group!==g){g=p.group;const h=document.createElement('div');h.className='nav-group';h.textContent=g;n.appendChild(h)}
      const a=document.createElement('a');a.href='#/'+encodeURIComponent(p.id);a.dataset.id=p.id;a.textContent=p.title;n.appendChild(a)
    }
  }
  function render(){
    const p=DB.pages.find(x=>x.id===current())||DB.pages[0]; if(!p)return;
    document.title=`${p.title} · Preview TUC`;
    document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('active',a.dataset.id===p.id));
    const notes=(p.notes||[]).map(n=>`<div class="flag-box"><strong>À statuer / croiser</strong><br>${esc(n)}</div>`).join('');
    const sections=(p.sections||[]).map(s=>`<section class="preview-section"><h2>${esc(s.title)}</h2>${(s.blocks||[]).map(t=>`<p class="body-p">${esc(t)}</p>`).join('')}</section>`).join('');
    $('#content').innerHTML=`<header class="page-head preview-hero"><div class="eyebrow">${esc(p.group)} · lore en recette</div><h1>${esc(p.title)}</h1><div class="preview-meta"><span class="badge source">${esc(p.source)}</span><span class="badge canon">Lore non-personnage</span></div></header>${notes}${sections}<div class="preview-foot">Source primaire : TUC_organisations_crawlers_V2.docx. Les profils individuels et les sections SCENARII sont exclus. Les documents récents servent uniquement au cross-audit canonique.</div>`;
    window.scrollTo({top:0,behavior:'auto'});
  }
  function filter(){
    const q=$('#filter').value.trim().toLowerCase();
    document.querySelectorAll('#nav a').forEach(a=>{const p=DB.pages.find(x=>x.id===a.dataset.id);a.classList.toggle('hidden-nav',!!q&&!`${p.title} ${p.group}`.toLowerCase().includes(q))})
  }
  async function decode(){
    const b=atob(window.CRAWLERS_PREVIEW_GZ||''),bytes=Uint8Array.from(b,c=>c.charCodeAt(0));
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return JSON.parse(await new Response(stream).text());
  }
  async function boot(){
    try{
      DB=await decode();
      if(!Array.isArray(DB.pages)||DB.pages.length!==16)throw new Error(`Preview invalide : ${DB.pages?.length??0} pages chargées au lieu de 16.`);
      nav();render();$('#filter').addEventListener('input',filter);window.addEventListener('hashchange',render);
    }catch(e){console.error(e);$('#content').innerHTML=`<div class="notice">Impossible de charger la preview Crawlers : ${esc(e.message||e)}</div>`}
  }
  boot();
})();