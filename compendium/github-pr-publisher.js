import {applyOperations,articleHash} from './editor/override-engine.js';
import {loadEditorArticles} from './editor/corpus-loader.js';
import {getMediaDraft,listMediaDrafts} from './editor/media-draft-store.js';

const OWNER='Helclaeynn';
const REPO='Terra-Umbra-Builder';
const BASE_BRANCH='main';
const API='https://api.github.com';
const TOKEN_KEY='tuc-github-token-session-v1';
const DRAFT_KEY='tuc-compendium-drafts-v1';
const SUBMISSIONS_KEY='tuc-compendium-pr-submissions-v1';
const INLINE_MEDIA_TOKEN='@@TUC_INLINE_MEDIA_V1@@';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safeId=value=>String(value||'page').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'page';

function fnv64(value){
  let hash=0xcbf29ce484222325n;
  for(const byte of new TextEncoder().encode(String(value||''))){
    hash^=BigInt(byte);
    hash=BigInt.asUintN(64,hash*0x100000001b3n);
  }
  return hash.toString(16).padStart(16,'0');
}
function overrideFilename(articleId){return `${safeId(articleId).slice(0,72)}--${fnv64(articleId)}.json`;}
function overrideRepoPath(articleId){return `compendium/data/page-overrides/${overrideFilename(articleId)}`;}
function branchName(articleId){return `editor/${safeId(articleId).slice(0,42)}-${Date.now().toString(36)}`;}
function encodePath(path){return String(path).split('/').map(encodeURIComponent).join('/');}
function readJsonStorage(storage,key){try{return JSON.parse(storage.getItem(key)||'{}')||{};}catch{return {};}}
function readDrafts(){return readJsonStorage(localStorage,DRAFT_KEY);}
function readSubmissions(){return readJsonStorage(localStorage,SUBMISSIONS_KEY);}
function writeSubmissions(value){localStorage.setItem(SUBMISSIONS_KEY,JSON.stringify(value));window.dispatchEvent(new CustomEvent('tuc:pr-submissions-changed'));}
function token(){return sessionStorage.getItem(TOKEN_KEY)||'';}
function clearToken(){sessionStorage.removeItem(TOKEN_KEY);window.dispatchEvent(new CustomEvent('tuc:github-auth-changed'));}

async function api(path,{method='GET',body,allow404=false,authToken=token()}={}){
  const response=await fetch(`${API}${path}`,{
    method,
    headers:{
      'Accept':'application/vnd.github+json',
      'X-GitHub-Api-Version':'2022-11-28',
      ...(authToken?{'Authorization':`Bearer ${authToken}`}:{ }),
      ...(body!==undefined?{'Content-Type':'application/json'}:{ }),
    },
    body:body===undefined?undefined:JSON.stringify(body),
  });
  if(allow404&&response.status===404)return null;
  const text=await response.text();
  let data=null;
  try{data=text?JSON.parse(text):null;}catch{data=text;}
  if(!response.ok){
    const message=data?.message||text||`HTTP ${response.status}`;
    const error=new Error(`GitHub · ${message}`);error.status=response.status;error.data=data;throw error;
  }
  return data;
}

async function verifyToken(candidate){
  const user=await api('/user',{authToken:candidate});
  if(String(user?.login||'').toLowerCase()!==OWNER.toLowerCase())throw new Error(`Ce jeton appartient à ${user?.login||'un autre compte'}, pas à ${OWNER}.`);
  const repo=await api(`/repos/${OWNER}/${REPO}`,{authToken:candidate});
  if(repo?.permissions&&!repo.permissions.push)throw new Error('Ce jeton n’a pas le droit d’écrire dans ce dépôt.');
  return user;
}

function authDialog(){
  const dialog=document.createElement('dialog');
  dialog.className='editor-dialog tuc-github-dialog';
  dialog.innerHTML=`<form method="dialog" class="editor-form"><header><div><div class="eyebrow">PUBLICATION CONTRÔLÉE</div><h2>Connexion GitHub</h2></div><button value="cancel" class="editor-close">×</button></header><p>Seul le compte <strong>${OWNER}</strong> peut publier depuis cet éditeur. Le jeton reste uniquement dans cette session de navigateur : il n’est ni commité, ni enregistré dans le stockage permanent.</p><label>Jeton GitHub finement limité<input type="password" name="token" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></label><p class="tuc-github-help">Permissions recommandées sur <code>${OWNER}/${REPO}</code> : <strong>Contents · Read and write</strong> et <strong>Pull requests · Read and write</strong>.</p><div class="tuc-github-auth-error" hidden></div><footer><button value="cancel">Annuler</button><button type="button" class="editor-primary" data-action="connect">Vérifier et connecter</button></footer></form>`;
  document.body.appendChild(dialog);
  dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  dialog.querySelector('[data-action="connect"]').addEventListener('click',async()=>{
    const input=dialog.querySelector('[name="token"]'),button=dialog.querySelector('[data-action="connect"]'),errorBox=dialog.querySelector('.tuc-github-auth-error');
    const candidate=input.value.trim();if(!candidate)return;
    button.disabled=true;button.textContent='Vérification…';errorBox.hidden=true;
    try{
      const user=await verifyToken(candidate);
      sessionStorage.setItem(TOKEN_KEY,candidate);
      window.dispatchEvent(new CustomEvent('tuc:github-auth-changed',{detail:{login:user.login}}));
      dialog.close();
    }catch(error){errorBox.textContent=error.message;errorBox.hidden=false;button.disabled=false;button.textContent='Vérifier et connecter';}
  });
  return dialog;
}
async function ensureAuthenticated(){
  if(token()){
    try{return await verifyToken(token());}catch(error){clearToken();throw new Error(`Session GitHub expirée ou invalide : ${error.message}`);}
  }
  const dialog=authDialog();dialog.showModal();return null;
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
async function repositoryFile(path,ref=BASE_BRANCH){return api(`/repos/${OWNER}/${REPO}/contents/${encodePath(path)}?ref=${encodeURIComponent(ref)}`,{allow404:true});}
async function inspectDraft(articleId){
  const draft=readDrafts()[articleId];if(!draft)throw new Error('Brouillon local introuvable.');
  const articles=await loadEditorArticles(),raw=articles.get(articleId);if(!raw)throw new Error(`Page introuvable : ${articleId}`);
  const currentHash=await articleHash(raw);if(currentHash!==draft.baseHash)throw new Error('Le corpus source a changé depuis cette édition. Rouvre la page et réconcilie le brouillon avant de créer la PR.');
  const effective=applyOperations(raw,draft.operations||[]);
  const before=collectMediaPaths(raw),after=collectMediaPaths(effective);
  const changed=[...after].filter(path=>!before.has(path));
  const localRows=await listMediaDrafts().catch(()=>[]),local=new Map(localRows.map(item=>[item.path,item]));
  const media=[];
  for(const path of changed){
    const item=local.get(path)||await getMediaDraft(path).catch(()=>null);
    if(item?.blob){media.push({path,item});continue;}
    const existing=await repositoryFile(`compendium/${path.replace(/^compendium\//,'')}`);
    if(existing)continue;
    throw new Error(`Média local manquant : ${path}`);
  }
  return {draft,raw,effective,media};
}

function bytesBase64(bytes){
  let binary='';const step=0x8000;
  for(let i=0;i<bytes.length;i+=step)binary+=String.fromCharCode(...bytes.subarray(i,i+step));
  return btoa(binary);
}
function utf8Base64(text){return bytesBase64(new TextEncoder().encode(text));}
async function blobBase64(blob){return bytesBase64(new Uint8Array(await blob.arrayBuffer()));}
async function putFile(path,content,branch,message,{binary=false}={}){
  const existing=await repositoryFile(path,BASE_BRANCH);
  const encoded=binary?await blobBase64(content):utf8Base64(content);
  return api(`/repos/${OWNER}/${REPO}/contents/${encodePath(path)}`,{
    method:'PUT',
    body:{message,content:encoded,branch,...(existing?.sha?{sha:existing.sha}:{})},
  });
}
async function deleteBranch(branch){
  try{await api(`/repos/${OWNER}/${REPO}/git/refs/heads/${branch.split('/').map(encodeURIComponent).join('/')}`,{method:'DELETE'});}catch(error){console.warn('Branche de publication non supprimée après échec',error);}
}

async function createPagePullRequest(articleId){
  if(!token()){authDialog().showModal();return null;}
  await verifyToken(token());
  const item=await inspectDraft(articleId);
  if(!item.draft.operations?.length)throw new Error('Ce brouillon ne contient aucune modification.');
  const base=await api(`/repos/${OWNER}/${REPO}/git/ref/heads/${BASE_BRANCH}`),sha=base?.object?.sha;
  if(!sha)throw new Error('Impossible de déterminer le HEAD de main.');
  const branch=branchName(articleId);
  await api(`/repos/${OWNER}/${REPO}/git/refs`,{method:'POST',body:{ref:`refs/heads/${branch}`,sha}});
  let prCreated=false;
  try{
    const payload={version:1,updated:new Date().toISOString().slice(0,10),entries:[item.draft]};
    const overridePath=overrideRepoPath(articleId);
    await putFile(overridePath,JSON.stringify(payload,null,2)+'\n',branch,`edit(compendium): ${item.effective.title||articleId}`);
    for(const media of item.media){
      const repoPath=`compendium/${media.path.replace(/^compendium\//,'')}`;
      await putFile(repoPath,media.item.blob,branch,`media(compendium): ${item.effective.title||articleId}`,{binary:true});
    }
    const body=[
      `<!-- tuc-page:${articleId} -->`,
      `## Édition Compendium — ${item.effective.title||articleId}`,
      '',
      `- Page : \`${articleId}\``,
      `- Opérations éditoriales : ${item.draft.operations.length}`,
      `- Médias WebP ajoutés/remplacés : ${item.media.length}`,
      `- Base source : \`${item.draft.baseHash}\``,
      item.draft.note?`- Note : ${item.draft.note}`:'',
      '',
      'Cette PR a été générée depuis l’éditeur du Compendium. Aucun changement n’est appliqué à `main` avant fusion.',
      'Après fusion, l’agrégat `manual-overrides.json` est reconstruit automatiquement à partir des overrides page par page.',
    ].filter(Boolean).join('\n');
    const pr=await api(`/repos/${OWNER}/${REPO}/pulls`,{method:'POST',body:{title:`Compendium · ${item.effective.title||articleId}`,head:branch,base:BASE_BRANCH,body}});
    prCreated=true;
    const submissions=readSubmissions();submissions[articleId]={number:pr.number,url:pr.html_url,branch,createdAt:new Date().toISOString()};writeSubmissions(submissions);
    return pr;
  }catch(error){if(!prCreated)await deleteBranch(branch);throw error;}
}

function authButton(){
  let button=document.querySelector('#tucGithubAuthButton');
  if(button)return button;
  button=document.createElement('button');button.id='tucGithubAuthButton';button.className='tuc-github-auth-button';button.type='button';
  button.addEventListener('click',async()=>{
    if(token()){
      if(confirm('Déconnecter cette session GitHub ?')){clearToken();refreshAuthButton();}
      return;
    }
    authDialog().showModal();
  });
  document.body.appendChild(button);refreshAuthButton();return button;
}
async function refreshAuthButton(){
  const button=document.querySelector('#tucGithubAuthButton');if(!button)return;
  if(!token()){button.textContent='GitHub · non connecté';button.classList.remove('is-connected');return;}
  button.textContent='GitHub · vérification…';
  try{const user=await verifyToken(token());button.textContent=`GitHub · ${user.login}`;button.classList.add('is-connected');}
  catch{clearToken();button.textContent='GitHub · non connecté';button.classList.remove('is-connected');}
}

function enhanceDraftCard(card){
  if(!(card instanceof Element)||card.dataset.githubPrEnhanced)return;
  const articleId=card.dataset.id;if(!articleId)return;
  card.dataset.githubPrEnhanced='1';
  const submissions=readSubmissions(),submission=submissions[articleId];
  const actions=document.createElement('div');actions.className='tuc-pr-card-actions';
  if(submission?.url){
    actions.innerHTML=`<a class="tuc-pr-link" href="${esc(submission.url)}" target="_blank" rel="noopener">PR #${esc(submission.number)} ↗</a><button type="button" data-action="create-page-pr">Créer une nouvelle PR</button>`;
  }else actions.innerHTML='<button type="button" class="editor-primary" data-action="create-page-pr">Créer la PR de cette page</button>';
  const deleteButton=card.querySelector('[data-action="delete-draft"]');
  if(deleteButton)deleteButton.insertAdjacentElement('beforebegin',actions);else card.appendChild(actions);
  actions.querySelector('[data-action="create-page-pr"]')?.addEventListener('click',async event=>{
    event.stopPropagation();const button=event.currentTarget,original=button.textContent;
    if(!token()){authDialog().showModal();return;}
    button.disabled=true;button.textContent='Création de la PR…';
    try{
      const pr=await createPagePullRequest(articleId);
      if(pr){button.textContent=`PR #${pr.number} créée ✓`;setTimeout(()=>{card.dataset.githubPrEnhanced='';actions.remove();enhanceDraftCard(card);},900);}
    }catch(error){alert(error.message);button.textContent=original;button.disabled=false;}
  });
}
function enhanceDraftManager(root=document){
  if(root.matches?.('.editor-draft-card'))enhanceDraftCard(root);
  root.querySelectorAll?.('.editor-draft-card').forEach(enhanceDraftCard);
  const intro=root.matches?.('.editor-draft-intro')?root:root.querySelector?.('.editor-draft-intro');
  if(intro&&!intro.dataset.githubPrCopy){intro.dataset.githubPrCopy='1';intro.insertAdjacentHTML('beforeend','<br><strong>Publication :</strong> chaque page part dans sa propre PR GitHub. Rien n’est écrit directement sur <code>main</code>.');}
  const legacy=root.matches?.('[data-action="publication"]')?root:root.querySelector?.('[data-action="publication"]');
  if(legacy){legacy.hidden=true;legacy.title='Remplacé par les PR page par page';}
}

const observer=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node instanceof Element)enhanceDraftManager(node);});
observer.observe(document.body,{childList:true,subtree:true});
authButton();enhanceDraftManager();
window.addEventListener('tuc:github-auth-changed',refreshAuthButton);
window.addEventListener('tuc:pr-submissions-changed',()=>document.querySelectorAll('.editor-draft-card').forEach(card=>{card.dataset.githubPrEnhanced='';card.querySelector('.tuc-pr-card-actions')?.remove();enhanceDraftCard(card);}));

window.TUCGitHubPublisher={connect:ensureAuthenticated,createPagePullRequest,overrideRepoPath};
