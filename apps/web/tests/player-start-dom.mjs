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
const reality=JSON.parse(await readFile(path.join(root,'src/lib/reality-start.json'),'utf8'));
const termIds=new Set(terms.map(t=>t.id));
const guideIds=new Set(start.guides.map(g=>g.id));
assert.equal(guideIds.size,21);assert.equal(guideIds.size,start.guides.length);assert.equal(termIds.size,terms.length);
for(const g of start.guides){
  assert.equal(g.choices.length,3);
  for(const field of ['identity','daily','abilities','limits','appeal','tradeoff','outlook','team','example']) assert(g[field]?.length>30,`${g.id}.${field}`);
  for(const t of g.terms) assert(termIds.has(t),`${g.id}: missing term ${t}`);
  for(const l of g.links) assert(/^(regles|verite|realite)-/.test(l.article));
  for(const field of ['known','rumours','unknown','exceptions']) assert(g.knowledge[field]?.length>30);
  assert(g.stereotypes.length>=6 && g.stereotypes.length<=8);
  for(const s of g.stereotypes) assert(s.voice && s.subject && s.status && s.limit);
  assert(g.heritage.length>100 && g.inScene.length>100);assert(g.stakes.length>250 && g.pressure.length>200);
  assert(termIds.has(g.interpretation.term));
  assert(g.illustration.src.startsWith('/api/compendium/media/images/lore/'));assert(g.illustration.alt && g.illustration.caption);
  assert.equal(g.quickTerms.length,3);
}
for(const s of start.intro) for(const t of s.terms) assert(termIds.has(t));
for(const t of terms){assert(t.definition.split(/\s+/).length<=85,`${t.id}: definition too long`);assert(t.article);}
for(const r of Object.values(readings)){for(const t of r.terms) assert(termIds.has(t));for(const g of r.guides) assert(guideIds.has(g));}
const compiled=await build({
  stdin:{resolveDir:root,loader:'ts',sourcefile:'onboarding-test.ts',contents:`
    import {createApp,h,nextTick,ref} from 'vue';
    import {createRouter,createMemoryHistory,RouterView} from 'vue-router';
    import Start from './src/pages/PlayerStartPage.vue';
    import Reality from './src/pages/RealityStartPage.vue';
    import Glossary from './src/pages/GlossaryPage.vue';
    import Reading from './src/components/ArticleReadingGuide.vue';
    import NatureGuide from './src/components/builder/NatureStartGuide.vue';
    import {filterTerms,playerGuideForTruth} from './src/lib/player-start';
    const truth=ref({nature:'vampire',choices:{}});
    const router=createRouter({history:createMemoryHistory(),routes:[
      {path:'/decouvrir',component:Start},{path:'/decouvrir/realite',component:Reality},{path:'/decouvrir/realite/:milieu',component:Reality},{path:'/decouvrir/:guide',component:Start},
      {path:'/glossaire',component:Glossary},{path:'/article/:id',component:{setup:()=>()=>h(Reading,{articleId:router.currentRoute.value.params.id})}},
      {path:'/builder-guide-test',component:{setup:()=>()=>h(NatureGuide,{state:truth.value})}},
      {path:'/compendium',component:{render:()=>h('p','Compendium destination')}},
      {path:'/campaigns',component:{render:()=>h('p','Campaigns')}},{path:'/atlas',component:{render:()=>h('p','Atlas')}},{path:'/account',component:{render:()=>h('p','Account')}}
    ]});
    window.test={filterTerms,playerGuideForTruth,setTruth:async(s)=>{truth.value=s;await nextTick()},go:async(to)=>{await router.push(to);await nextTick()},route:()=>router.currentRoute.value.fullPath};
    window.ready=router.push('/decouvrir').then(()=>{createApp({render:()=>h(RouterView)}).use(router).mount('#app');return nextTick()});
  `},bundle:true,write:false,format:'iife',platform:'browser',define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},
  plugins:[{name:'vue',setup(b){b.onLoad({filter:/\.vue$/},async({path:filename})=>{const {descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});assert.equal(errors.length,0);return {contents:compileScript(descriptor,{id:filename,inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)}});b.onLoad({filter:/\.css$/},()=>({contents:'',loader:'js'}));}}]
});
const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));vc.on('error',(...a)=>errors.push(a.join(' ')));vc.on('warn',(...a)=>errors.push(a.join(' ')));
const dom=new JSDOM('<div id="app"></div>',{url:'https://example.test/decouvrir',runScripts:'outside-only',virtualConsole:vc});
dom.window.eval(compiled.outputFiles[0].text);await dom.window.ready;
const d=dom.window.document;const api=dom.window.test;
const wait=()=>new Promise(resolve=>setTimeout(resolve,25));
assert.equal(d.querySelectorAll('.start-intro-card').length,6);
assert.equal(d.querySelector('.start-perspectives'),null);
assert.match(d.querySelector('#suite').textContent,/inscris-toi/);
assert.match(d.querySelector('#cadre').textContent,/Réalité est le monde publiquement connu/);
assert.match(d.querySelector('#cadre').textContent,/Vérité est la part cachée de ce même monde/);
assert.equal(d.querySelectorAll('.start-site-steps>li').length,6);
assert.match(d.querySelector('.start-site-steps').textContent,/Un administrateur doit valider/);
assert.match(d.querySelector('.start-site-steps').textContent,/Mes campagnes et invitations/);
assert.match(d.querySelector('.start-site-steps').textContent,/Accepter l’invitation et faire accepter sa fiche sont deux étapes distinctes/);
assert.match(d.querySelector('.start-site-steps').textContent,/Soumettre ma version actuelle/);
assert.equal(d.querySelector('#suite a[href="/campaigns"]').getAttribute('href'),'/campaigns');
assert.equal(d.querySelectorAll('#choisir .start-profile').length,21);
const group=[...d.querySelectorAll('.start-filters button')].find(b=>b.textContent==='Peuples galactiques');group.click();await wait();assert.equal(d.querySelectorAll('#choisir .start-profile').length,7);
const input=d.querySelector('input');input.value='supérior';input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));await wait();assert.equal(d.querySelectorAll('#choisir .start-profile').length,1);
d.querySelector('#choisir .start-profile').click();await wait();assert.equal(api.route(),'/decouvrir/homo-superior');assert.match(d.querySelector('h1').textContent,/Homo Superior/);
assert.match(d.querySelector('#envie').textContent,/Ce que cela implique/);assert.match(d.body.textContent,/énergie secrète/);
assert.match(d.body.textContent,/briefing/);
const disclosure=d.querySelector('.start-stereotypes');assert.equal(disclosure.open,false);disclosure.querySelector('summary').click();await wait();assert.equal(disclosure.open,true);assert.match(disclosure.textContent,/Hors briefing/);assert.equal(disclosure.querySelectorAll('.start-stereotype>p:not(.stereotype-context)').length,0);
assert.equal(d.querySelectorAll('#preparer li').length,3);
const nano=[...d.querySelectorAll('.start-terms a')].find(a=>a.textContent.includes('Nanites'));nano.click();await wait();assert.equal(d.querySelectorAll('.glossary-term').length,1);assert.match(d.querySelector('.glossary-term').textContent,/Minuscules dispositifs/);
assert.equal(api.filterTerms('essaim')[0].id,'nanites');assert.equal(api.filterTerms('AIDH')[0].id,'aidh');assert.equal(api.filterTerms('semi revele')[0].id,'semi-revele');assert.equal(api.filterTerms("Ad'rak")[0].id,'adrak');assert.equal(api.filterTerms('PA')[0].id,'pa');
const search=d.querySelector('input');search.value='zzzinconnu';search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));await wait();assert.equal(d.querySelectorAll('.glossary-term').length,0);assert.match(d.body.textContent,/Aucun mot trouvé/);assert(!api.route().includes('terme='));
await api.go('/glossaire?terme=non-existant');assert.match(d.body.textContent,/Cette entrée n’existe pas/);assert.equal(d.querySelectorAll('.glossary-term').length,terms.length);
await api.go('/decouvrir');
assert.equal(d.querySelectorAll('#milieu .start-profile').length,5);
assert.equal(d.querySelectorAll('#milieu img').length,5);
d.querySelector('#milieu a[href="/decouvrir/realite/corpo"]').click();await wait();
assert.equal(api.route(),'/decouvrir/realite/corpo');
assert.equal(d.querySelector('[data-reality-guide]').dataset.realityGuide,'corpo');
assert.match(d.querySelector('h1').textContent,/Jouer un Corpo/);
assert.equal(d.querySelectorAll('.start-guide-cover .guide-illustration').length,1);
const corpoOpinions=d.querySelector('.start-stereotypes');corpoOpinions.querySelector('summary').click();await wait();
assert(corpoOpinions.open);assert.match(corpoOpinions.textContent,/vous ne l’invitez pas à dîner/i);
assert.equal(d.querySelectorAll('.start-stereotype>p').length,0,'No automatic moral rebuttal under each prejudice');
await api.go('/decouvrir/realite');
assert.match(d.querySelector('h1').textContent,/De quoi vis-tu/);
assert.equal(d.querySelectorAll('.start-profile').length,5);
for(const profile of reality.profiles){
 await api.go('/decouvrir/realite/'+profile.id);
 assert.equal(d.querySelector('[data-reality-guide]').dataset.realityGuide,profile.id);
 for(const anchor of ['envie','regard','quotidien','capacites','preparer','approfondir']) assert(d.querySelector('#'+anchor));
 assert.equal(d.querySelectorAll('.start-stereotype').length,profile.stereotypes.length);
 assert.equal(d.querySelectorAll('.guide-quick-terms>div').length,3);
 assert.equal(d.querySelector('#regles'),null,'Reality guides do not repeat the core rules');
 assert.equal(d.querySelector('a[href="#regles"]'),null);
 assert.equal(profile.choices.length,3);assert.equal(profile.stereotypes.length,6);
 assert(profile.links.length>=2);assert(profile.illustration.alt.length>20);
 for(const key of ['heritage','outlook','resources','limits','pressure','team','example']) assert(profile[key].length>180,profile.id+' '+key);
}
await api.go('/decouvrir/realite/religieux');assert.match(d.body.textContent,/Pourquoi cette vie/);assert.match(d.body.textContent,/convictions et des engagements/);assert.match(d.body.textContent,/Army of United Christendom/);assert.match(d.body.textContent,/diplomates cherchent des accords/);
await api.go('/decouvrir/realite/inconnu');assert.match(d.querySelector('h1').textContent,/Ce guide de Réalité n’existe pas/);
await api.go('/decouvrir/homo-superior');
assert.match(d.querySelector('.start-guide-body').textContent,/L’AIDH est une institution galactique/);assert.match(d.querySelector('#pression').textContent,/absent du briefing/);
assert.equal(d.querySelectorAll('.guide-illustration').length,1);
assert.match(d.querySelector('#approfondir h2').textContent,/Pour aller plus loin/);
assert.match(d.querySelector('#regles').textContent,/Un 1 naturel au premier dé/);
await api.go('/decouvrir/baseanh');assert.match(d.querySelector('.start-guide-body').textContent,/quatre bras, six yeux bleu ciel/);
await api.go('/decouvrir/inconnu');assert.match(d.querySelector('h1').textContent,/Ce guide n’existe pas/);
await api.go('/decouvrir/talass');assert.match(d.body.textContent,/tu ignores l’existence des Exilés/);assert.match(d.querySelector('.start-stereotypes').textContent,/Serys/);
for(const [id,filename] of [['talass','verite-talass-fils.webp'],['mosen','verite-mosen-atelier.webp'],['thalsios','verite-thalsios-mecanique.webp']]){
 await api.go('/decouvrir/'+id);
 assert(d.querySelector('.guide-illustration img').getAttribute('src').endsWith(filename));
 assert.equal(d.querySelector('.guide-portrait'),null,'Narrative scene, not a white-background portrait');
}
for(const id of ['daemon','angelus','vampire']){
 await api.go('/decouvrir/'+id);
 assert.match(d.querySelector('.start-guide-body').textContent,/Fléau/);
 assert.match(d.querySelector('.start-stereotypes').textContent,id==='vampire'?/Les Angelus/:/Les Vampires/);
}
await api.go('/decouvrir/mage');assert.match(d.body.textContent,/Les extraterrestres sont généralement ignorés/);
await api.go('/article/verite-humanite-galactique-aidh');assert(d.querySelector('.article-reading-guide'));assert.equal(d.querySelectorAll('.reading-links a').length,1);assert.equal(d.querySelector('.reading-links a').getAttribute('href'),'/decouvrir/homo-superior');
await api.go('/article/article-sans-guide');assert.equal(d.querySelector('.article-reading-guide'),null);
await api.go('/builder-guide-test');
const guideLink=()=>d.querySelector('[data-nature-guide] a');
assert.equal(guideLink().getAttribute('href'),'/decouvrir/vampire');assert.equal(guideLink().target,'_blank');assert.match(guideLink().rel,/noopener/);
d.querySelector('[data-nature-guide] summary').click();await wait();assert(d.querySelector('[data-nature-guide] details').open);
for(const id of ['vampire','garou','khinae','mage','daemon','angelus','aseryn']) {
 await api.setTruth({nature:id,choices:{}});assert.equal(guideLink().getAttribute('href'),`/decouvrir/${id}`);
}
for(const [people,id] of [['elye','elfe'],['whurten','nain'],['ashyll','ashyll'],['thulkar','thulkar'],['azmenorien','azmenorien']]) {
 await api.setTruth({nature:'exile',choices:{people}});assert.equal(guideLink().getAttribute('href'),`/decouvrir/${id}`);
}
for(const species of ['talass','mosen','baseanh','rocreen','thalsios','homo_superior','adrak']) {
 await api.setTruth({nature:'extral',choices:{species}});assert.equal(guideLink().getAttribute('href'),`/decouvrir/${species.replace('_','-')}`);
}
await api.setTruth({nature:'humain',choices:{hunterTradition:'aucune'}});assert.equal(guideLink().getAttribute('href'),'/decouvrir/humain');
await api.setTruth({nature:'humain',choices:{hunterTradition:'doctrine_commune'}});assert.equal(guideLink().getAttribute('href'),'/decouvrir/chasseur');
await api.setTruth({nature:'humain',choices:{hunterTradition:'aucune',hunterBuild:{doctrines:['xenoshield']}}});assert.equal(guideLink().getAttribute('href'),'/decouvrir/chasseur');
await api.setTruth({nature:'vampire',choices:{hunterTradition:'lavandiere'}});assert.equal(guideLink().getAttribute('href'),'/decouvrir/vampire');
await api.setTruth({nature:'extral',choices:{species:'unknown'}});assert.equal(guideLink().getAttribute('href'),'/decouvrir#choisir');
assert.deepEqual(errors,[]);dom.window.close();
console.log(`Onboarding: 21 Nature guides, 5 full Reality guides, ${terms.length} glossary entries, ${Object.keys(readings).length} article introductions; routing, filters, accents, aliases, deep links and empty states passed.`);
