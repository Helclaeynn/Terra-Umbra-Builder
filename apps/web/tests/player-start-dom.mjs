// Public onboarding routes, real Vue components and memory navigation; no API or account data.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {parse,compileScript} from '@vue/compiler-sfc';
import {JSDOM,VirtualConsole} from 'jsdom';
const root=fileURLToPath(new URL('../',import.meta.url));
const start=JSON.parse(await readFile(path.join(root,'src/lib/player-start.json'),'utf8'));
const terms=JSON.parse(await readFile(path.join(root,'src/lib/player-glossary.json'),'utf8'));
const readings=JSON.parse(await readFile(path.join(root,'src/lib/article-reading-guides.json'),'utf8'));
const termIds=new Set(terms.map(t=>t.id));
const guideIds=new Set(start.guides.map(g=>g.id));
assert.equal(guideIds.size,21);assert.equal(guideIds.size,start.guides.length);assert.equal(termIds.size,terms.length);
for(const g of start.guides){
  assert.equal(g.choices.length,3);
  for(const field of ['identity','daily','abilities','limits','appeal','tradeoff','outlook','team','example']) assert(g[field]?.length>30,`${g.id}.${field}`);
  for(const t of g.terms) assert(termIds.has(t),`${g.id}: missing term ${t}`);
  for(const l of g.links) assert(/^(regles|verite|realite)-/.test(l.article));
}
for(const s of start.intro) for(const t of s.terms) assert(termIds.has(t));
for(const t of terms){assert(t.definition.split(/\s+/).length<=85,`${t.id}: definition too long`);assert(t.article);}
for(const r of Object.values(readings)){for(const t of r.terms) assert(termIds.has(t));for(const g of r.guides) assert(guideIds.has(g));}
const compiled=await build({
  stdin:{resolveDir:root,loader:'ts',sourcefile:'onboarding-test.ts',contents:`
    import {createApp,h,nextTick} from 'vue';
    import {createRouter,createMemoryHistory,RouterView} from 'vue-router';
    import Start from './src/pages/PlayerStartPage.vue';
    import Glossary from './src/pages/GlossaryPage.vue';
    import Reading from './src/components/ArticleReadingGuide.vue';
    import {filterTerms} from './src/lib/player-start';
    const router=createRouter({history:createMemoryHistory(),routes:[
      {path:'/decouvrir',component:Start},{path:'/decouvrir/:guide',component:Start},
      {path:'/glossaire',component:Glossary},{path:'/article/:id',component:{setup:()=>()=>h(Reading,{articleId:router.currentRoute.value.params.id})}},
      {path:'/compendium',component:{render:()=>h('p','Compendium destination')}},
      {path:'/atlas',component:{render:()=>h('p','Atlas')}},{path:'/account',component:{render:()=>h('p','Account')}}
    ]});
    window.test={filterTerms,go:async(to)=>{await router.push(to);await nextTick()},route:()=>router.currentRoute.value.fullPath};
    window.ready=router.push('/decouvrir').then(()=>{createApp({render:()=>h(RouterView)}).use(router).mount('#app');return nextTick()});
  `},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},
  plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});assert.equal(errors.length,0);return {contents:compileScript(descriptor,{id:filename,inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)}});b.onLoad({filter:/\.css$/},()=>({contents:'',loader:'js'}));}}]
});
const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.join(' ')));vc.on('warn',(...a)=>errors.push(a.join(' ')));
const dom=new JSDOM('<div id="app"></div>',{url:'https://example.test/decouvrir',runScripts:'outside-only',virtualConsole:vc});
dom.window.eval(compiled.outputFiles[0].text);await dom.window.ready;
const d=dom.window.document;const api=dom.window.test;
const wait=()=>new Promise(resolve=>setTimeout(resolve,25));
assert.equal(d.querySelectorAll('.start-intro-card').length,4);
assert.equal(d.querySelectorAll('.start-profile').length,21);
const group=[...d.querySelectorAll('.start-filters button')].find(b=>b.textContent==='Peuples galactiques');group.click();await wait();assert.equal(d.querySelectorAll('.start-profile').length,7);
const input=d.querySelector('input');input.value='supérior';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));await wait();assert.equal(d.querySelectorAll('.start-profile').length,1);
d.querySelector('.start-profile').click();await wait();assert.equal(api.route(),'/decouvrir/homo-superior');assert.match(d.querySelector('h1').textContent,/Homo Superior/);
assert.match(d.querySelector('#envie').textContent,/Ce que cela implique/);assert.match(d.body.textContent,/énergie secrète/);
assert.equal(d.querySelectorAll('#preparer li').length,3);
const nano=[...d.querySelectorAll('.start-terms a')].find(a=>a.textContent.includes('Nanites'));nano.click();await wait();assert.equal(d.querySelectorAll('.glossary-term').length,1);assert.match(d.querySelector('.glossary-term').textContent,/Minuscules dispositifs/);
assert.equal(api.filterTerms('essaim')[0].id,'nanites');assert.equal(api.filterTerms('AIDH')[0].id,'aidh');assert.equal(api.filterTerms('semi revele')[0].id,'semi-revele');assert.equal(api.filterTerms("Ad'rak")[0].id,'adrak');assert.equal(api.filterTerms('PA')[0].id,'pa');
const search=d.querySelector('input');search.value='zzzinconnu';search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));await wait();assert.equal(d.querySelectorAll('.glossary-term').length,0);assert.match(d.body.textContent,/Aucun mot trouvé/);assert(!api.route().includes('terme='));
await api.go('/glossaire?terme=non-existant');assert.match(d.body.textContent,/Cette entrée n’existe pas/);assert.equal(d.querySelectorAll('.glossary-term').length,terms.length);
await api.go('/decouvrir/inconnu');assert.match(d.querySelector('h1').textContent,/Ce guide n’existe pas/);
await api.go('/article/verite-humanite-galactique-aidh');assert(d.querySelector('.article-reading-guide'));assert.equal(d.querySelectorAll('.reading-links a').length,1);assert.equal(d.querySelector('.reading-links a').getAttribute('href'),'/decouvrir/homo-superior');
await api.go('/article/article-sans-guide');assert.equal(d.querySelector('.article-reading-guide'),null);
assert.deepEqual(errors,[]);dom.window.close();
console.log(`Onboarding: 21 complete profiles, ${terms.length} glossary entries, ${Object.keys(readings).length} article introductions; routing, filters, accents, aliases, deep links and empty states passed.`);
