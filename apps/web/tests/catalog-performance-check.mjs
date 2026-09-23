import assert from 'node:assert/strict';
import { build } from 'esbuild';
const built=await build({stdin:{resolveDir:process.cwd(),loader:'ts',contents:`export * from './src/lib/catalog-order';export * from './src/lib/render-cache';export * from './src/lib/api';export {truthGroups} from './src/lib/truth';export {createWikiLinker} from './src/lib/wiki-linker';`},bundle:true,write:false,format:'esm',platform:'node'});
const {sortedNames,truthGroups,createRenderCache,api,createWikiLinker}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].text).toString('base64'));
const rows=[{name:'Zèbre'},{name:'Talent 10'},{name:'Élan'},{name:'Talent 2'},{name:'Aube'}];
const original=JSON.stringify(rows);
assert.deepEqual(sortedNames(rows).map(x=>x.name),['Aube','Élan','Talent 2','Talent 10','Zèbre']);
assert.equal(JSON.stringify(rows),original);
assert.deepEqual(truthGroups([{name:'Zénith',group:'Z',cost:1},{name:'B',group:'A',cost:10},{name:'Z',group:'A',cost:2},{name:'A',group:'A',cost:2}]).map(g=>[g.name,g.items.map(t=>t.name)]),[['A',['A','Z','B']],['Z',['Zénith']]]);
const requests=[];globalThis.fetch=async(path,options)=>{requests.push({path,...options});return {ok:true,json:async()=>({})}};
for(const path of ['/api/rulesets/terra-umbra/creation','/api/rulesets/terra-umbra/truth','/api/rulesets/terra-umbra/reality','/api/compendium/meta','/api/compendium/onboarding']){await api(path);assert.equal(requests.at(-1).cache,'default');}
for(const path of ['/api/auth/me','/api/characters/123','/api/compendium/library','/api/compendium/articles/mj','/api/compendium/search?q=secret','/api/compendium/wiki-index?compact=1','/api/compendium/wiki-preview/mj','/api/compendium/editor/articles/test']){await api(path,{cache:'force-cache'});assert.equal(requests.at(-1).cache,'no-store',path);}
await api('/api/rulesets/terra-umbra/truth',{method:'POST',body:'{}'});assert.equal(requests.at(-1).cache,'no-store');
let calls=0;const memo=createRenderCache(2,100);const render=()=>{calls++;return 'résultat'};
memo.get('a',render);memo.get('a',render);assert.equal(calls,1);memo.get('b',render);memo.get('c',render);memo.get('a',render);assert.equal(calls,4);memo.clear();memo.get('a',render);assert.equal(calls,5);
const bounded=createRenderCache(10,5);bounded.get('trop long',render);bounded.get('trop long',render);assert.equal(calls,7,'Oversized chunks must not accumulate');
const entries=Array.from({length:2200},(_,i)=>({id:`article-${i}`,title:`Dossier Umbra ${i}`,category:'Réalité'}));
const linker=createWikiLinker(entries);const context={id:'current',category:'Réalité'};
const text='Le Dossier Umbra 42 décrit la ville et ses habitants. Le Dossier Umbra 128 en précise les institutions.';
const expected=linker.linkify(text,context);const cache=createRenderCache();let linkedCalls=0;
const start=performance.now();for(let i=0;i<1000;i++)assert.equal(linker.linkify(text,context),expected);const plain=performance.now()-start;
const cachedStart=performance.now();for(let i=0;i<1000;i++)assert.equal(cache.get(text,()=>{linkedCalls++;return linker.linkify(text,context)}),expected);const cached=performance.now()-cachedStart;
assert.equal(linkedCalls,1);
console.log(`CATALOG PERFORMANCE OK — deterministic non-mutating ordering, private requests always no-store, bounded memoization. Local render replay: ${plain.toFixed(1)}ms → ${cached.toFixed(1)}ms; 1000 → 1 interlink calculations (not an end-to-end site timing).`);
