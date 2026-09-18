import {chromium} from 'playwright-core';

const base=process.env.TUC_SMOKE_BASE_URL||'http://127.0.0.1:8765/';
const executablePath=process.env.CHROME_BIN||'/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-dev-shm-usage']});
const context=await browser.newContext({viewport:{width:1440,height:1000}});

const apiState={blobSeq:0,blobs:[],trees:[],commits:[],refSha:'smoke-base-commit',refUpdates:[]};
const jsonHeaders={'content-type':'application/json; charset=utf-8'};
const aggregate=Buffer.from(JSON.stringify({version:1,updated:'2026-09-18',entries:[]})+'\n','utf8').toString('base64');

await context.route('https://api.github.com/**',async route=>{
  const req=route.request(),url=new URL(req.url()),path=url.pathname,method=req.method();
  if(path==='/user')return route.fulfill({status:200,headers:jsonHeaders,body:JSON.stringify({login:'Helclaeynn'})});
  if(path==='/repos/Helclaeynn/Terra-Umbra-Builder')return route.fulfill({status:200,headers:jsonHeaders,body:JSON.stringify({permissions:{push:true}})});
  if(path==='/repos/Helclaeynn/Terra-Umbra-Builder/git/ref/heads/main'&&method==='GET'){
    return route.fulfill({status:200,headers:jsonHeaders,body:JSON.stringify({object:{sha:apiState.refSha}})});
  }
  if(path==='/repos/Helclaeynn/Terra-Umbra-Builder/git/commits/smoke-base-commit'&&method==='GET'){
    return route.fulfill({status:200,headers:jsonHeaders,body:JSON.stringify({sha:'smoke-base-commit',tree:{sha:'smoke-base-tree'}})});
  }
  if(path==='/repos/Helclaeynn/Terra-Umbra-Builder/contents/compendium/data/manual-overrides.json'&&method==='GET'){
    return route.fulfill({status:200,headers:jsonHeaders,body:JSON.stringify({encoding:'base64',content:aggregate,sha:'smoke-aggregate-file'})});
  }
  if(path==='/repos/Helclaeynn/Terra-Umbra-Builder/git/blobs'&&method==='POST'){
    const body=req.postDataJSON(),sha=`smoke-blob-${++apiState.blobSeq}`;apiState.blobs.push({sha,body});
    return route.fulfill({status:201,headers:jsonHeaders,body:JSON.stringify({sha})});
  }
  if(path==='/repos/Helclaeynn/Terra-Umbra-Builder/git/trees'&&method==='POST'){
    const body=req.postDataJSON(),sha=`smoke-tree-${apiState.trees.length+1}`;apiState.trees.push({sha,body});
    return route.fulfill({status:201,headers:jsonHeaders,body:JSON.stringify({sha})});
  }
  if(path==='/repos/Helclaeynn/Terra-Umbra-Builder/git/commits'&&method==='POST'){
    const body=req.postDataJSON(),sha=`smoke-commit-${apiState.commits.length+1}`;apiState.commits.push({sha,body});
    return route.fulfill({status:201,headers:jsonHeaders,body:JSON.stringify({sha})});
  }
  if(path==='/repos/Helclaeynn/Terra-Umbra-Builder/git/refs/heads/main'&&method==='PATCH'){
    const body=req.postDataJSON();apiState.refSha=body.sha;apiState.refUpdates.push(body);
    return route.fulfill({status:200,headers:jsonHeaders,body:JSON.stringify({object:{sha:body.sha}})});
  }
  return route.fulfill({status:404,headers:jsonHeaders,body:JSON.stringify({message:`Smoke route not mocked: ${method} ${path}`})});
});

const page=await context.newPage();
const dialogs=[];
page.on('dialog',async dialog=>{dialogs.push({type:dialog.type(),message:dialog.message()});await dialog.accept();});

async function seedOwnerAuth(){
  await page.evaluate(async()=>{
    const db=await new Promise((resolve,reject)=>{
      const request=indexedDB.open('tuc-compendium-auth',1);
      request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('github'))request.result.createObjectStore('github');};
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('github','readwrite');
      tx.objectStore('github').put({accessToken:'smoke-owner-token',refreshToken:'',expiresAt:Date.now()+60*60*1000,refreshExpiresAt:0,tokenType:'bearer',savedAt:new Date().toISOString()},'owner-session');
      tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
    });
    db.close();
  });
}

try{
  await page.goto(`${base}compendium/`,{waitUntil:'domcontentloaded',timeout:30000});
  await seedOwnerAuth();
  await page.reload({waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>document.body.classList.contains('tuc-editor-authorized'),null,{timeout:15000});

  const seeded=await page.evaluate(async()=>{
    const {loadEditorArticles}=await import('./editor/corpus-loader.js');
    const {articleHash}=await import('./editor/override-engine.js');
    const {putMediaDraft}=await import('./editor/media-draft-store.js');
    const articles=await loadEditorArticles();
    const firstId='equipement-012-seawares-hl-02-poseidon',secondId='equipement-013-raven-jl-014-cuchulainn';
    const first=articles.get(firstId),second=articles.get(secondId);
    if(!first||!second)throw new Error('Articles smoke bulk introuvables.');
    const mediaPath='images/manual/smoke-bulk-poseidon.webp';
    const now=new Date().toISOString();
    const drafts={
      [firstId]:{articleId:firstId,baseHash:await articleHash(first),updatedAt:now,note:'bulk smoke media',operations:[
        {op:'add',path:'/illustration',value:{src:mediaPath,alt:'Smoke bulk Poseidon'}}
      ]},
      [secondId]:{articleId:secondId,baseHash:await articleHash(second),updatedAt:now,note:'bulk smoke text',operations:[
        {op:'replace',path:'/title',value:`${second.title} [BULK SMOKE]`}
      ]}
    };
    localStorage.setItem('tuc-compendium-drafts-v1',JSON.stringify(drafts));
    await putMediaDraft({path:mediaPath,blob:new Blob([new Uint8Array([82,73,70,70,4,0,0,0,87,69,66,80])],{type:'image/webp'}),articleId:firstId,originalName:'bulk-smoke.webp',width:1,height:1});
    window.dispatchEvent(new CustomEvent('tuc:drafts-changed'));
    return {firstId,secondId,mediaPath};
  });

  const draftsButton=page.locator('#tucDraftsButton');
  await draftsButton.waitFor({state:'visible',timeout:10000});
  await draftsButton.click();
  const manager=page.locator('dialog.editor-drafts-dialog');await manager.waitFor({state:'visible',timeout:10000});
  const bulk=manager.locator('[data-tuc-publish-all-main]');await bulk.waitFor({state:'visible',timeout:10000});
  const label=(await bulk.innerText()).trim();
  if(!/Publier tous sur main \(2\)/.test(label))throw new Error(`Compteur bulk incorrect: ${label}`);

  await bulk.click();
  await page.waitForFunction(()=>document.querySelector('[data-tuc-publish-all-main]')?.textContent?.includes('2 brouillon(s) publié(s)'),null,{timeout:15000});

  const remaining=await page.evaluate(()=>JSON.parse(localStorage.getItem('tuc-compendium-drafts-v1')||'{}'));
  if(Object.keys(remaining).length)throw new Error(`Brouillons non vidés après bulk: ${JSON.stringify(remaining)}`);
  if(apiState.refUpdates.length!==1)throw new Error(`Le bulk doit déplacer main une fois, obtenu: ${apiState.refUpdates.length}`);
  if(apiState.commits.length!==1)throw new Error(`Le bulk doit créer un seul commit, obtenu: ${apiState.commits.length}`);
  if(apiState.trees.length!==1)throw new Error(`Le bulk doit créer un seul arbre, obtenu: ${apiState.trees.length}`);

  const paths=(apiState.trees[0].body.tree||[]).map(row=>row.path);
  for(const expected of ['compendium/data/manual-overrides.json',seeded.mediaPath.replace(/^/,'compendium/')]){
    if(!paths.includes(expected))throw new Error(`Chemin bulk absent de l'arbre: ${expected} · ${JSON.stringify(paths)}`);
  }
  for(const id of [seeded.firstId,seeded.secondId]){
    if(!paths.some(path=>path.startsWith(`compendium/data/page-overrides/${id}`)))throw new Error(`Override bulk absent pour ${id}: ${JSON.stringify(paths)}`);
  }
  const unexpectedAlerts=dialogs.filter(x=>x.type==='alert');
  if(unexpectedAlerts.length)throw new Error(`Alertes pendant le bulk: ${unexpectedAlerts.map(x=>x.message).join(' | ')}`);
  if(!dialogs.some(x=>x.type==='confirm'&&x.message.includes('Pages : 2')&&x.message.includes('Médias : 1')))throw new Error('Confirmation bulk 2 pages / 1 média absente.');

  console.log(`BULK PUBLISH OK — 2 brouillons + 1 WebP dans 1 commit (${apiState.commits[0].sha}), ref main déplacée une seule fois.`);
} finally {await context.close();await browser.close();}
