import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { parse, compileScript } from '@vue/compiler-sfc';
import { JSDOM, VirtualConsole } from 'jsdom';

const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({
  stdin:{resolveDir:root,loader:'ts',contents:`
    import {createApp,ref,h} from 'vue';
    import TalentSelector from './src/components/builder/TalentSelector.vue';
    window.start=props=>{
      const state=ref({...props});
      const app=createApp({render:()=>h(TalentSelector,{
        ...state.value,
        'onUpdate:modelValue':value=>{state.value.modelValue=value;},
        'onUpdate:choiceValue':value=>{state.value.choiceValue=value;}
      })});
      app.mount('#app');
      window.update=patch=>{state.value={...state.value,...patch};};
      window.value=()=>state.value.modelValue;
      window.choice=()=>state.value.choiceValue;
      window.stop=()=>app.unmount();
    };`},
  bundle:true,write:false,format:'iife',platform:'browser',
  define:{'process.env.NODE_ENV':'"test"',__VUE_OPTIONS_API__:'true',__VUE_PROD_DEVTOOLS__:'false',__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:'false'},
  plugins:[{name:'vue',setup(builder){
    builder.onLoad({filter:/\.vue$/},async({path:filename})=>{
      const {descriptor,errors}=parse(await readFile(filename,'utf8'),{filename});
      assert.equal(errors.length,0);
      return {contents:compileScript(descriptor,{id:'talent-disclosure-test',inlineTemplate:true}).content,loader:'ts',resolveDir:path.dirname(filename)};
    });
  }}]
});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(predicate){
  for(let i=0;i<100;i++){if(predicate())return;await wait(5);}
  assert.ok(predicate(),'Expected talent selector state was not reached');
}
function environment(){
  const errors=[], console=new VirtualConsole();
  console.on('jsdomError',error=>errors.push(error.message));
  console.on('error',error=>errors.push(String(error)));
  const dom=new JSDOM('<div id="app"></div>',{url:'https://test.invalid/',runScripts:'outside-only',virtualConsole:console});
  dom.window.eval(bundle.outputFiles[0].text);
  return {w:dom.window,close(){dom.window.stop?.();dom.window.close();assert.deepEqual(errors,[]);}};
}
const groups=[
  {label:'Talents communs',items:[
    {id:'z',name:'Zèle',effect:'Effet Zèle',category:'common'},
    {id:'b',name:'Brave',effect:'Effet Brave',category:'common'},
    {id:'a',name:'Aube',effect:'Effet Aube',category:'common'}
  ]},
  {label:'Expertise',items:[{id:'expert',name:'Expert',effect:'Effet Expert',category:'expertise'}]},
  {label:'Vide',items:[]}
];
const unchanged=JSON.stringify(groups);
const base={label:'Talent',placeholder:'Choisir un talent',groups,modelValue:'b',selectedLore:'Lore du talent'};
const env=environment(), {w}=env, d=w.document;
w.start(base);
assert.equal(d.querySelectorAll('details.talent-group').length,2);
assert.equal(d.querySelectorAll('details.talent-group[open]').length,0,'All unfiltered groups start collapsed');
assert.match(d.querySelector('.talent-detail').textContent,/Brave.*Lore du talent.*Effet Brave/s);
assert.equal(d.querySelector('.talent-detail').closest('details'),null,'Selected talent stays visible outside the collapsed catalog');
assert.deepEqual(Array.from(d.querySelectorAll('.talent-group:first-of-type .talent-choice-card strong'),node=>node.textContent),['Aube','Brave','Zèle']);
const group=d.querySelector('details.talent-group');
group.querySelector('summary').click();
await until(()=>group.open);
Array.from(group.querySelectorAll('.talent-choice-card')).find(button=>button.querySelector('strong').textContent==='Aube').click();
await until(()=>w.value()==='a' && d.querySelector('.talent-detail').textContent.includes('Effet Aube'));
assert.equal(group.open,true,'Selecting a talent does not close the available choices');
assert.equal(group.querySelectorAll('.talent-choice-card[aria-pressed="true"]').length,1);
group.querySelector('summary').click();
await until(()=>!group.open);
w.update({modelValue:'z'});
await until(()=>d.querySelector('.talent-detail').textContent.includes('Effet Zèle'));
assert.equal(group.open,false,'A selection update does not reopen a manually collapsed group');
w.update({choiceSpec:{kind:'enum',label:'Spécialisation'},choiceOptions:[{id:'one',name:'Première option'}]});
await until(()=>d.querySelector('.talent-choice select'));
const choice=d.querySelector('.talent-choice select');
assert.equal(choice.closest('details'),null,'Required subchoices remain accessible when cards are collapsed');
choice.value='one';choice.dispatchEvent(new w.Event('change',{bubbles:true}));
await until(()=>w.choice()==='one');
assert.equal(d.querySelectorAll('a').length,0,'Talent choices stay local to the Builder');
assert.equal(JSON.stringify(groups),unchanged,'Sorting and selecting do not mutate the supplied catalog');
env.close();

const filtered=environment(), fw=filtered.w, fd=fw.document;
fw.start({...base,categoryPicker:true});
assert.equal(fd.querySelectorAll('details.talent-group').length,0);
const category=fd.querySelector('.talent-selector>label select');
category.value='Talents communs';category.dispatchEvent(new fw.Event('change',{bubbles:true}));
await until(()=>fd.querySelector('details.talent-group')?.open);
let active=fd.querySelector('details.talent-group');
active.querySelector('summary').click();
await until(()=>!active.open);
fw.update({modelValue:'a'});
await until(()=>fd.querySelector('.talent-detail').textContent.includes('Effet Aube'));
assert.equal(active.open,false,'Explicit category groups can still be folded manually');
category.value='Expertise';category.dispatchEvent(new fw.Event('change',{bubbles:true}));
await until(()=>fd.querySelector('details.talent-group')?.textContent.includes('Expertise'));
active=fd.querySelector('details.talent-group');
assert.equal(active.open,true,'Choosing a new category opens that category');
assert.equal(fd.querySelectorAll('.talent-choice-card').length,1);
filtered.close();
console.log('TALENT SELECTOR OK — collapsed defaults, native disclosures, persistent selection/subchoices, manual folding, explicit categories and stable sorting');
