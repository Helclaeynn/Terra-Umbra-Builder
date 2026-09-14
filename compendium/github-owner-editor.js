import {GITHUB_EDITOR_CONFIG as CONFIG} from './github-editor-config.js';
import {applyOperations,articleHash} from './editor/override-engine.js';
import {loadEditorArticles} from './editor/corpus-loader.js';
import {getMediaDraft,listMediaDrafts} from './editor/media-draft-store.js';

const API='https://api.github.com';
const AUTH_DB='tuc-compendium-auth';
const AUTH_STORE='github';
const AUTH_KEY='owner-session';
const DRAFT_KEY='tuc-compendium-drafts-v1';
const PUBLICATION_KEY='tuc-compendium-main-publications-v1';
const INLINE_MEDIA_TOKEN='@@TUC_INLINE_MEDIA_V1@@';
let authState={status:'loading',login:'',token:''};
let authDbPromise=null;

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeId=value=>String(value||'page').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'page';
function fnv64(value){let hash=0xcbf29ce484222325n;for(const byte of new TextEncoder().encode(String(value||''))){hash^=BigInt(byte);hash=BigInt.asUintN(64,hash*0x100000001b3n);}return hash.toString(16).padStart(16,'0');}
function overrideFilename(articleId){return `${safeId(articleId).slice(0,72)}--${fnv64(articleId)}.json`;}
function overrideRepoPath(articleId){return `compendium/data/page-overrides/${overrideFilename(articleId)}`;}
function readJsonStorage(key){try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{return {};}}
function readDrafts(){return readJsonStorage(DRAFT_KEY);}
function writeDrafts(value){localStorage.setItem(DRAFT_KEY,JSON.stringify(value));window.dispatchEvent(new CustomEvent('tuc:drafts-changed'));window.dispatchEvent(new CustomEvent('tuc:editor-refresh'));}
function readPublications(){return readJsonStorage(PUBLICATION_KEY);}
function writePublications(value){localStorage.setItem(PUBLICATION_KEY,JSON.stringify(value));window.dispatchEvent(new CustomEvent('tuc:main-publications-changed'));}
function configured(){return Boolean(CONFIG.clientId&&CONFIG.oauthProxy);}
function proxyUrl(path){return `${String(CONFIG.oauthProxy||'').replace(/\/$/,'')}${path}`;}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}

function openAuthDb(){
  if(!('indexedDB' in globalThis))return Promise.reject(new Error('IndexedDB indisponible.'));
  if(!authDbPromise)authDbPromise=new Promise((resolve,reject)=>{
    const request=indexedDB.open(AUTH_DB,1);
    request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(AUTH_STORE))db.createObjectStore(AUTH_STORE);};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('Impossible d’ouvrir le stockage d’authentification.'));
  });
  return authDbPromise;
}
async function authStore(mode,callback){
  const db=await openAuthDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(AUTH_STORE,mode),store=tx.objectStore(AUTH_STORE);let request;
    try{request=callback(store);}catch(error){reject(error);return;}
    tx.oncomplete=()=>resolve(request?.result);
    tx.onerror=()=>reject(tx.error||request?.error||new Error('Erreur de stockage GitHub.'));
  });
}
async function readStoredAuth(){return authStore('readonly',store=>store.get(AUTH_KEY)).catch(()=>null);}
async function writeStoredAuth(value){return authStore('readwrite',store=>store.put(value,AUTH_KEY));}
async function clearStoredAuth(){return authStore('readwrite',store=>store.delete(AUTH_KEY)).catch(()=>{});}

async function githubApi(path,{method='GET',body,token=authState.token,allow404=false}={}){
  if(!token)throw new Error('Connexion GitHub requise.');
  const response=await fetch(`${API}${path}`,{
    method,
    headers:{
      'Accept':'application/vnd.github+json',
      'X-GitHub-Api-Version':'2026-03-10',
      'Authorization':`Bearer ${token}`,
      ...(body!==undefined?{'Content-Type':'application/json'}:{})
    },
    body:body===undefined?undefined:JSON.stringify(body)
  });
  if(allow404&&response.status===404)return null;
  const text=await response.text();let data=null;
  try{data=text?JSON.parse(text):null;}catch{data=text;}
  if(!response.ok){const error=new Error(data?.message||text||`GitHub · HTTP ${response.status}`);error.status=response.status;throw error;}
  return data;
}
async function proxyPost(path,params){
  const response=await fetch(proxyUrl(path),{
    method:'POST',
    headers:{'Accept':'application/json','Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams(params).toString()
  });
  const data=await response.json().catch(()=>({error:'invalid_proxy_response'}));
  if(!response.ok||data.error){const error=new Error(data.error_description||data.error||`Proxy GitHub · HTTP ${response.status}`);error.code=data.error;throw error;}
  return data;
}
function tokenRecord(data,previous={}){
  const now=Date.now();
  return {
    accessToken:data.access_token,
    refreshToken:data.refresh_token||previous.refreshToken||'',
    expiresAt:data.expires_in?now+Number(data.expires_in)*1000:0,
    refreshExpiresAt:data.refresh_token_expires_in?now+Number(data.refresh_token_expires_in)*1000:(previous.refreshExpiresAt||0),
    tokenType:data.token_type||'bearer',
    savedAt:new Date().toISOString()
  };
}
async function refreshAuth(record){
  if(!record?.refreshToken)throw new Error('La session GitHub doit être renouvelée.');
  if(record.refreshExpiresAt&&record.refreshExpiresAt<Date.now())throw new Error('La connexion GitHub a expiré.');
  const data=await proxyPost('/oauth/access_token',{
    client_id:CONFIG.clientId,
    grant_type:'refresh_token',
    refresh_token:record.refreshToken
  });
  const next=tokenRecord(data,record);await writeStoredAuth(next);return next;
}
async function validateOwner(accessToken){
  const user=await githubApi('/user',{token:accessToken});
  if(String(user?.login||'').toLowerCase()!==String(CONFIG.allowedLogin||'').toLowerCase())throw new Error(`Compte refusé : ${user?.login||'inconnu'}.`);
  const repo=await githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}`,{token:accessToken});
  if(repo?.permissions&&!repo.permissions.push)throw new Error('Ce compte ne possède pas le droit d’écriture sur le dépôt.');
  return user;
}
function setAuthState(status,login='',token=''){
  authState={status,login,token};
  document.body.classList.toggle('tuc-editor-authorized',status==='authorized');
  window.__TUC_EDITOR_AUTHORIZED__=status==='authorized';
  refreshAuthButton();
  window.dispatchEvent(new CustomEvent('tuc:github-auth-changed',{detail:{status,login}}));
}
async function restoreAuth(){
  if(!configured()){setAuthState('unconfigured');return;}
  let record=await readStoredAuth();
  if(!record?.accessToken){setAuthState('anonymous');return;}
  try{
    if(record.expiresAt&&record.expiresAt<Date.now()+5*60*1000)record=await refreshAuth(record);
    const user=await validateOwner(record.accessToken);
    setAuthState('authorized',user.login,record.accessToken);
  }catch(error){console.warn('Session GitHub non restaurée',error);await clearStoredAuth();setAuthState('anonymous');}
}
async function ensureFreshAuth(){
  let record=await readStoredAuth();
  if(!record?.accessToken)throw new Error('Connecte-toi avec GitHub avant de publier.');
  if(record.expiresAt&&record.expiresAt<Date.now()+5*60*1000)record=await refreshAuth(record);
  const user=await validateOwner(record.accessToken);
  setAuthState('authorized',user.login,record.accessToken);return record.accessToken;
}
async function signOut(){await clearStoredAuth();setAuthState(configured()?'anonymous':'unconfigured');}

function authDialog(){
  const dialog=document.createElement('dialog');dialog.className='editor-dialog tuc-github-dialog';
  if(!configured()){
    dialog.innerHTML=`<div class="editor-form"><header><div><div class="eyebrow">ÉDITION PROPRIÉTAIRE</div><h2>Connexion GitHub à configurer</h2></div><button type="button" class="editor-close" data-close>×</button></header><p>La couche d’authentification est prête, mais il manque encore le <strong>Client ID</strong> de la GitHub App et l’adresse du petit proxy OAuth.</p><p class="tuc-auth-status">Aucun secret GitHub ne sera placé dans le Compendium.</p><footer><span class="editor-spacer"></span><button type="button" data-close>Fermer</button></footer></div>`;
    dialog.addEventListener('click',e=>{if(e.target.closest('[data-close]'))dialog.close();});
    document.body.appendChild(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});return dialog;
  }
  dialog.innerHTML=`<div class="editor-form"><header><div><div class="eyebrow">ÉDITION PROPRIÉTAIRE</div><h2>Se connecter avec GitHub</h2></div><button type="button" class="editor-close" data-close>×</button></header><p>GitHub vérifiera ton compte. L’édition ne sera activée que pour <strong>${esc(CONFIG.allowedLogin)}</strong>.</p><div class="tuc-device-start"><button type="button" class="editor-primary" data-start>Commencer la connexion GitHub</button></div><div class="tuc-device-flow" hidden><p>Entre ce code sur GitHub :</p><div class="tuc-device-code"><code data-code>—</code><button type="button" data-copy>Copier</button></div><a class="editor-primary" data-open target="_blank" rel="noopener">Ouvrir GitHub et autoriser</a><p class="tuc-auth-status" data-status>En attente…</p></div><div class="tuc-auth-error" data-error hidden></div><footer><span class="editor-spacer"></span><button type="button" data-close>Annuler</button></footer></div>`;
  document.body.appendChild(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  dialog.addEventListener('click',async event=>{
    if(event.target.closest('[data-close]')){dialog.close();return;}
    if(event.target.closest('[data-copy]')){const code=dialog.querySelector('[data-code]').textContent;await navigator.clipboard.writeText(code).catch(()=>{});event.target.textContent='Copié ✓';return;}
    if(!event.target.closest('[data-start]'))return;
    const start=dialog.querySelector('[data-start]'),errorBox=dialog.querySelector('[data-error]');start.disabled=true;start.textContent='Préparation…';errorBox.hidden=true;
    try{
      const device=await proxyPost('/device/code',{client_id:CONFIG.clientId});
      const flow=dialog.querySelector('.tuc-device-flow'),code=dialog.querySelector('[data-code]'),link=dialog.querySelector('[data-open]'),status=dialog.querySelector('[data-status]');
      flow.hidden=false;dialog.querySelector('.tuc-device-start').hidden=true;code.textContent=device.user_code;link.href=device.verification_uri||'https://github.com/login/device';
      await navigator.clipboard.writeText(device.user_code).catch(()=>{});
      const deadline=Date.now()+Number(device.expires_in||900)*1000;let interval=Math.max(5,Number(device.interval||5));
      while(Date.now()<deadline){
        await sleep(interval*1000);status.textContent='Vérification de l’autorisation GitHub…';
        try{
          const data=await proxyPost('/oauth/access_token',{
            client_id:CONFIG.clientId,
            device_code:device.device_code,
            grant_type:'urn:ietf:params:oauth:grant-type:device_code',
            repository_id:CONFIG.repositoryId
          });
          const record=tokenRecord(data),user=await validateOwner(record.accessToken);
          await writeStoredAuth(record);setAuthState('authorized',user.login,record.accessToken);dialog.close();return;
        }catch(error){
          if(error.code==='authorization_pending'){status.textContent='En attente de ta validation sur GitHub…';continue;}
          if(error.code==='slow_down'){interval+=5;continue;}
          throw error;
        }
      }
      throw new Error('Le code GitHub a expiré. Recommence la connexion.');
    }catch(error){errorBox.textContent=error.message;errorBox.hidden=false;start.disabled=false;start.textContent='Recommencer la connexion';}
  });
  return dialog;
}
async function showAuth(){if(authState.status==='authorized'){if(confirm(`Déconnecter ${authState.login} de l’éditeur ?`))await signOut();return;}const dialog=authDialog();dialog.showModal();}
function ensureAuthButton(){
  let button=document.querySelector('#tucGithubOwnerAuth');if(button)return button;
  button=document.createElement('button');button.id='tucGithubOwnerAuth';button.className='tuc-github-auth-button';button.type='button';button.addEventListener('click',()=>showAuth().catch(error=>alert(error.message)));document.body.appendChild(button);refreshAuthButton();return button;
}
function refreshAuthButton(){
  const button=document.querySelector('#tucGithubOwnerAuth');if(!button)return;
  button.classList.toggle('is-connected',authState.status==='authorized');button.classList.toggle('is-error',authState.status==='unconfigured');
  button.textContent=authState.status==='authorized'?`GitHub · ${authState.login} ✓`:authState.status==='loading'?'GitHub · vérification…':authState.status==='unconfigured'?'GitHub · configuration requise':'Se connecter avec GitHub';
}

function collectMediaPaths(value,refs=new Set()){
  if(typeof value==='string'){
    const text=value.trim();
    if(text.startsWith(INLINE_MEDIA_TOKEN)){
      try{const meta=JSON.parse(text.slice(INLINE_MEDIA_TOKEN.length));if(String(meta?.src||'').startsWith('images/'))refs.add(String(meta.src));}catch{}
    }else if(text.startsWith('images/'))refs.add(text);
    return refs;
  }
  if(Array.isArray(value)){for(const item of value)collectMediaPaths(item,refs);return refs;}
  if(value&&typeof value==='object')for(const item of Object.values(value))collectMediaPaths(item,refs);
  return refs;
}
async function repoPathExists(path,token){
  const clean=String(path).replace(/^compendium\//,'');
  return Boolean(await githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/compendium/${clean.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(CONFIG.baseBranch)}`,{token,allow404:true}));
}
async function inspectDraft(articleId,token){
  const draft=readDrafts()[articleId];if(!draft)throw new Error('Brouillon local introuvable.');
  const articles=await loadEditorArticles(),raw=articles.get(articleId);if(!raw)throw new Error('Page introuvable dans le corpus.');
  const currentHash=await articleHash(raw);if(currentHash!==draft.baseHash)throw new Error('Le corpus source a changé depuis cette édition. Recharge la page avant de publier.');
  const effective=applyOperations(raw,draft.operations||[]),before=collectMediaPaths(raw),after=collectMediaPaths(effective);
  const localRows=await listMediaDrafts().catch(()=>[]),local=new Map(localRows.map(row=>[row.path,row]));const media=[];
  for(const path of [...after].filter(path=>!before.has(path))){
    const row=local.get(path)||await getMediaDraft(path).catch(()=>null);
    if(row?.blob){media.push({path,item:row});continue;}
    if(await repoPathExists(path,token))continue;
    throw new Error(`Média local manquant : ${path}`);
  }
  return {draft,raw,effective,media};
}
function base64FromBytes(bytes){let out='';const step=0x8000;for(let i=0;i<bytes.length;i+=step)out+=String.fromCharCode(...bytes.subarray(i,i+step));return btoa(out);}
async function createBlob(content,encoding,token){return githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}/git/blobs`,{method:'POST',token,body:{content,encoding}});}
async function commitFiles(files,message,token,attempt=0){
  const ref=await githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}/git/ref/heads/${encodeURIComponent(CONFIG.baseBranch)}`,{token});
  const baseSha=ref.object.sha,commit=await githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}/git/commits/${baseSha}`,{token});
  const tree=[];
  for(const file of files){
    let blob;
    if(file.blob){blob=await createBlob(base64FromBytes(new Uint8Array(await file.blob.arrayBuffer())),'base64',token);}
    else blob=await createBlob(file.text,'utf-8',token);
    tree.push({path:file.path,mode:'100644',type:'blob',sha:blob.sha});
  }
  const nextTree=await githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}/git/trees`,{method:'POST',token,body:{base_tree:commit.tree.sha,tree}});
  const nextCommit=await githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}/git/commits`,{method:'POST',token,body:{message,tree:nextTree.sha,parents:[baseSha]}});
  try{
    await githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}/git/refs/heads/${encodeURIComponent(CONFIG.baseBranch)}`,{method:'PATCH',token,body:{sha:nextCommit.sha,force:false}});
    return nextCommit;
  }catch(error){if(error.status===422&&attempt<2)return commitFiles(files,message,token,attempt+1);throw error;}
}
async function publishDraft(articleId){
  const token=await ensureFreshAuth(),item=await inspectDraft(articleId,token),title=item.effective.title||item.raw.title||articleId;
  const mediaCount=item.media.length;
  if(!confirm(`Publier directement sur main ?\n\nPage : ${title}\nOpérations : ${item.draft.operations.length}\nMédias : ${mediaCount}\n\nCette action créera un commit sur main.`))return null;
  const payload={version:1,updated:new Date().toISOString().slice(0,10),entries:[item.draft]};
  const files=[{path:overrideRepoPath(articleId),text:JSON.stringify(payload,null,2)+'\n'}];
  for(const media of item.media)files.push({path:`compendium/${String(media.path).replace(/^compendium\//,'')}`,blob:media.item.blob});
  const result=await commitFiles(files,`edit(compendium): ${title}`,token);
  const publications=readPublications();publications[articleId]={commitSha:result.sha,title,publishedAt:new Date().toISOString(),entryUpdatedAt:item.draft.updatedAt};writePublications(publications);
  waitForAggregate(articleId,item.draft,token).catch(error=>console.warn('Synchronisation éditoriale encore en attente',error));
  return result;
}
function decodeBase64Utf8(value){const bin=atob(String(value||'').replace(/\s+/g,'')),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes);}
async function waitForAggregate(articleId,draft,token){
  for(let attempt=0;attempt<36;attempt++){
    await sleep(attempt?5000:2500);
    const file=await githubApi(`/repos/${CONFIG.owner}/${CONFIG.repo}/contents/compendium/data/manual-overrides.json?ref=${encodeURIComponent(CONFIG.baseBranch)}`,{token});
    if(!file?.content)continue;
    try{
      const payload=JSON.parse(decodeBase64Utf8(file.content)),entry=(payload.entries||[]).find(row=>row.articleId===articleId);
      if(entry&&entry.baseHash===draft.baseHash&&JSON.stringify(entry.operations)===JSON.stringify(draft.operations)){
        const drafts=readDrafts();delete drafts[articleId];writeDrafts(drafts);
        const pubs=readPublications();if(pubs[articleId])pubs[articleId].synchronizedAt=new Date().toISOString();writePublications(pubs);return true;
      }
    }catch{}
  }
  return false;
}

function enhanceDraftCards(root=document){
  if(authState.status!=='authorized')return;
  for(const card of root.querySelectorAll?.('.editor-draft-card')||[]){
    if(card.querySelector('[data-tuc-publish-main]'))continue;
    const articleId=card.dataset.id;if(!articleId)continue;
    const deleteButton=card.querySelector('[data-action="delete-draft"]');
    const button=document.createElement('button');button.type='button';button.className='tuc-publish-main';button.dataset.tucPublishMain='1';button.textContent='Publier sur main';
    button.addEventListener('click',async()=>{
      const original=button.textContent;button.disabled=true;button.textContent='Publication…';
      try{const result=await publishDraft(articleId);if(result){button.textContent='Publié ✓';const note=document.createElement('div');note.className='tuc-publish-state';note.textContent=`Commit ${result.sha.slice(0,8)} · synchronisation automatique en cours`;card.querySelector('.editor-draft-main')?.appendChild(note);}}
      catch(error){alert(error.message);button.textContent=original;}finally{button.disabled=false;}
    });
    deleteButton?.insertAdjacentElement('beforebegin',button);
  }
}
const observer=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node instanceof Element)enhanceDraftCards(node);});
observer.observe(document.body,{childList:true,subtree:true});
window.addEventListener('tuc:github-auth-changed',()=>enhanceDraftCards(document));

document.addEventListener('click',event=>{
  const edit=event.target.closest('#tucEditPage,#tucDraftsButton');
  if(!edit||authState.status==='authorized')return;
  event.preventDefault();event.stopImmediatePropagation();showAuth().catch(error=>alert(error.message));
},true);

ensureAuthButton();
restoreAuth().then(()=>enhanceDraftCards(document)).catch(error=>{console.error(error);setAuthState('anonymous');});
