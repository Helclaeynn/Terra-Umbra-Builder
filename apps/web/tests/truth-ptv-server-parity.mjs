// Le contrôle des PTV par le serveur (apps/api/src/rules/creation-check.ts) suit le
// calcul du Builder (truthPtvSpent) : égal pour toutes les Natures, jamais au-dessus
// (un identifiant que le serveur ne connaît pas compte 0 : il ne refuse jamais à tort).
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const bundle=await build({stdin:{resolveDir:root,loader:'ts',contents:"export * from './src/lib/truth';export {truthCreationPtvSpent,truthBudgetViolations} from '../api/src/rules/creation-check';"},bundle:true,write:false,format:'esm',platform:'node'});
const m=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const {terraUmbraTruthRules:pkg}=await import('../../api/dist/rules/truth/rules.js');

let checked=0,exact=0;
for(const [nature,def] of Object.entries(pkg.structure.natures)){
  const choices={};
  for(const choice of def.choices??[]){const option=(choice.options??[]).find(o=>o.id&&o.id!=='aucune');if(option)choices[choice.key]=option.id;}
  const state={nature,consciousness:'initie',choices,truthTalents:[],truthEquipment:[],corruptionTalents:[],corruption:0,corruptionSource:''};
  // Achète tout ce qui devient accessible, bien au-delà des 5 PTV, pour couvrir les éveils.
  for(let round=0;round<6;round++)for(const t of m.truthAvailableTalents(pkg,state))if(!state.truthTalents.includes(t.id)&&m.truthPrerequisiteSatisfied(pkg,state,t))state.truthTalents.push(t.id);
  const site=m.truthPtvSpent(pkg,state),server=m.truthCreationPtvSpent(pkg,state);
  assert.ok(server<=site,`${nature} : serveur ${server} > site ${site}`);
  if(nature!=='mage')assert.equal(server,site,`${nature} : serveur ${server} ≠ site ${site}`);
  if(server===site)exact++;
  checked++;
  const data={truth:state};
  assert.equal(m.truthBudgetViolations(data,pkg).length,server>pkg.structure.ptvInitial?1:0);
}
assert.ok(checked>=10);
const empty={truth:{nature:'vampire',consciousness:'initie',choices:{},truthTalents:[],corruptionTalents:[]}};
assert.deepEqual(m.truthBudgetViolations(empty,pkg),[],'Aucun talent : rien à refuser');
console.log(`PTV SERVEUR OK — ${checked} Natures, ${exact} identiques au Builder, jamais au-dessus`);
