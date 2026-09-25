import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript,compileTemplate} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
import {NPC_CATALOG,generateNpcBatch} from '../../api/dist/campaign-npc-generator.js';
import {canonicalNpcDraft} from '../../api/dist/canonical-npc-draft.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:`
 import {createApp,h,nextTick} from 'vue';import {createRouter,createMemoryHistory,RouterView} from 'vue-router';import Editor from './src/pages/CompendiumEditorPage.vue';
 const router=createRouter({history:createMemoryHistory(),routes:[{path:'/',component:{render:()=>h('p','Home')}},{path:'/compendium/new',component:Editor},{path:'/compendium/edit/:id',component:Editor},{path:'/compendium',component:{render:()=>h('p','Index')}},{path:'/account',component:{render:()=>h('p','Account')}}]});
 const app=createApp({render:()=>h(RouterView,null,{default:({Component,route})=>h(Component,{key:route.path})})}).use(router);
 window.test={ready:router.push('/compendium/new?category=Personnages&template=npc').then(()=>{app.mount('#app');return nextTick();}),route:()=>router.currentRoute.value.fullPath,unmount:()=>app.unmount()};
 `},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor}=parse(await readFile(filename,'utf8'));const contents=descriptor.script||descriptor.scriptSetup?compileScript(descriptor,{id:'canonical-test',inlineTemplate:true}).content:compileTemplate({source:descriptor.template.content,filename,id:'canonical-test'}).code+'\nexport default {render};';return {contents,loader:'ts',resolveDir:path.dirname(filename)};});}}]});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const portrait='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDasAAAAASUVORK5CYII=';
for(const role of ['admin','editor']){
 const errors=[],calls=[],vc=new VirtualConsole();for(const kind of ['jsdomError','error','warn'])vc.on(kind,(...e)=>errors.push(e.map(String).join(' ')));
 const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only',virtualConsole:vc}),w=dom.window;
 w.Headers=Headers;w.structuredClone=structuredClone;w.confirm=()=>true;w.scrollTo=()=>{};
 let baseArticle=null,saved=null,published=false,failSave=true;
 const id='wiki-npc-dom';
 w.fetch=async(url,opts={})=>{
  const method=opts.method||'GET',b=opts.body?JSON.parse(opts.body):undefined;calls.push({url,method,b});let result;
  if(url==='/api/auth/me')result={user:{role}};
  else if(url.endsWith('/npc-generator/catalog'))result=NPC_CATALOG;
  else if(url.endsWith('/npc-generator/generate')){result={npcs:generateNpcBatch(b)};result.npcs[0].portrait=portrait;}
  else if(url.endsWith('/npc-generator/preview'))result={article:canonicalNpcDraft(b.npc)};
  else if(url==='/api/compendium/editor/articles'&&method==='POST'){baseArticle={...b,id,sections:[]};result={articleId:id,article:baseArticle};}
  else if(url.includes('/builder-source/'))result={records:[]};
  else if(url.endsWith('/media')){assert.equal(b.data,portrait.split(',')[1]);assert.equal(b.slot,'portrait');result={src:'/compendium/media/'+id+'.png'};}
  else if(url.endsWith('/draft')&&method==='PUT'){
   if(failSave){failSave=false;return {ok:false,status:503,json:async()=>({error:'test_retry'})};}
   saved=structuredClone(b.article);result={ok:true};
  }
  else if(url.endsWith('/publish')){assert.ok(saved);published=true;result={article:saved};}
  else if(url.endsWith('/articles/'+id)&&method==='GET'){assert.ok(saved,'New editor must load only after draft persistence');result={article:baseArticle,draft:saved,conflict:false,draftUpdatedAt:'2026-09-23T10:00:00Z',publishedAt:null};}
  else throw Error('Unexpected API '+method+' '+url);
  return {ok:true,status:200,json:async()=>result};
 };
 async function until(fn){for(let i=0;i<300;i++){if(fn())return;await pause(10);}assert.ok(fn(),JSON.stringify({errors,calls,dom:w.document.body.textContent}).slice(-15000));}
 function button(text){const b=[...w.document.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(b,text);return b;}
 function field(text){return [...w.document.querySelectorAll('.npc-sheet label')].find(l=>l.firstChild?.textContent.trim()===text)?.querySelector('input,select,textarea');}
 async function fill(el,value,event='input'){assert.ok(el);el.value=value;el.dispatchEvent(new w.Event(event,{bubbles:true}));await pause(0);}
 try{
  w.eval(bundle.outputFiles[0].text);await w.test.ready;await until(()=>w.document.querySelector('.editor-actions'));
  if(role==='editor'){assert.equal(w.document.querySelector('.canonical-generator'),null);assert.equal(calls.filter(c=>c.url.includes('npc-generator')).length,0);continue;}
  await until(()=>w.document.querySelector('.canonical-generator select'));
  await fill(w.document.querySelectorAll('.canonical-generator .choices select')[2],'female','change');await pause(0);button('Générer un aperçu').click();
  await until(()=>field('Nom affiché / alias'));
  assert.equal(w.document.querySelector('[aria-label="Sexe du PNJ"]').value,'female');
  await fill(field('Nom affiché / alias'),'Alex Test');
  await fill(field('Secret ou accroche MJ'),'SECRET\n== Heading injection ==\nHIDDEN TEXT\n{{MJ}}\nStill private');
  await fill(w.document.querySelector('[aria-label="Sexe du PNJ"]'),'other','change');await pause(0);
  assert.ok(!published);button('Créer le brouillon PNJ').click();
  await until(()=>calls.some(c=>c.url.endsWith('/draft')));await until(()=>!button('Enregistrer le brouillon').disabled);
  // A failed draft write preserves the content locally and does not change route.
  assert.match(w.test.route(),/^\/compendium\/new/);assert.equal(saved,null);assert.ok(w.document.body.textContent.includes('test_retry'));
  button('Enregistrer le brouillon').click();await until(()=>saved&&w.test.route()==='/compendium/edit/'+id);await until(()=>w.document.querySelector('.editor-actions'));
  assert.equal(saved.title,'Alex Test');assert.equal(saved.category,'Personnages');assert.equal(saved.pnj.sexe,'Autre');assert.equal(saved.pnj.portrait,'/compendium/media/'+id+'.png');
  assert.ok(saved.pnj.generator_profile?.tierId,'Le profil mécanique PNJ doit être conservé.');
  assert.ok(Array.isArray(saved.pnj.tags),'Les tags de travail PNJ doivent être structurés.');
  const identity=saved.sections.find(s=>s.title==='Identité apparente');
  assert.ok(identity,'Le bloc Identité apparente doit être généré.');
  const identityText=JSON.stringify(identity);
  for(const text of ['Alex Test','Nationalité d’origine','Rôle','Autre'])assert.ok(identityText.includes(text),`Identité générée incomplète : ${text}`);
  assert.ok(saved.sections.some(s=>s.title==='Dossier MJ'&&s.audience==='mj'),'Le dossier MJ doit être généré et rester privé.');
  assert.ok(saved.sections.some(s=>s.title==='Profil statistique'&&s.audience==='mj'),'Le tableau statistique doit être généré et rester privé.');
  assert.equal(calls.filter(c=>c.url.endsWith('/media')).length,1,'Retry must reuse uploaded image');
  assert.equal(calls.filter(c=>c.url==='/api/compendium/editor/articles').length,1,'Retry must reuse created page');
  const pub=JSON.stringify(saved.sections.filter(s=>s.audience!=='mj')),mj=JSON.stringify(saved.sections.filter(s=>s.audience==='mj'));
  for(const text of ['SECRET','Heading injection','HIDDEN TEXT','Still private']){assert.ok(!pub.includes(text));assert.ok(mj.includes(text));}
  assert.equal(saved.sections.length,3);assert.equal(saved.sections.filter(s=>s.audience==='mj').length,2);
  assert.equal(published,false);assert.equal(calls.filter(c=>c.url.endsWith('/publish')).length,0);
  button('Publier dans le wiki').click();await until(()=>published);await until(()=>!button('Enregistrer le brouillon').disabled);
  assert.equal(calls.filter(c=>c.url.endsWith('/publish')).length,1);
  assert.deepEqual(errors,[]);
 }finally{w.test?.unmount();dom.window.close();}
}
console.log('CANONICAL NPC DOM OK — admin-only generation, editable sex, real editor round-trip, private wiki escaping, portrait upload, draft failure/retry without data loss, persistence before navigation, explicit publication');
