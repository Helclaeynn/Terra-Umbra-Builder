// Node 24+: exercise the active API catalog through the builder's real filtering.
import assert from 'node:assert/strict';
import {truthCatalogExtral} from '../../api/src/rules/truth/catalog-extral.ts';
import {truthRuntimeStructure} from '../../api/src/rules/truth/runtime-structure.ts';
import {truthAvailableTalents, truthSelectedFreeTraits, truthPtvSpent, truthSanitizeTalents} from '../src/lib/truth.ts';

const id='extral-phasage-de-l-equipement';
const rules={
  structure:truthRuntimeStructure,
  catalogs:{extral:truthCatalogExtral},
  visibility:{needles:{},sharedHunterNatures:[]},
  corruption:{sources:[],precedence:[],talents:[]}
};
const state=(species,consciousness='initie')=>({
  nature:'extral',consciousness,choices:{species},truthTalents:[],truthEquipment:[],
  truthEquipmentMjOverride:false,corruptionMjAuthorized:false,corruption:0,
  corruptionSource:'',corruptionTalents:[]
});
const original=JSON.stringify(rules);
const hs=state('homo_superior');
const talent=truthAvailableTalents(rules,hs).find(t=>t.id===id);
assert.ok(talent,'The builder offers equipment phasing to an initiated Homo Superior');
assert.equal(truthCatalogExtral.filter(t=>t.id===id).length,1,'The talent has one stable catalog id');
assert.equal(talent.cost,1,'Acquisition costs exactly 1 PTV');
assert.equal(talent.access,'V/SR/R','The same equipment phasing talent is accessible in every Truth state');
assert.equal(talent.activation,'Actif — 1 ou 2 PA');
assert.match(talent.effect,/Matérialiser ou déphaser/);
assert.match(talent.effect,/existant lié aux patchs tatoués AIDH/);
assert.match(talent.effect,/1 PA pour un élément individuel/);
assert.match(talent.effect,/2 PA pour une tenue complète, une armure ou plusieurs éléments/);
assert.match(talent.effect,/dans les deux sens/);
assert.match(talent.effect,/Ne crée aucun matériel/);

const speciesChoice=truthRuntimeStructure.natures.extral.choices.find(c=>c.key==='species');
for(const {id:species} of speciesChoice.options){
  if(species==='homo_superior')continue;
  assert.ok(!truthAvailableTalents(rules,state(species)).some(t=>t.id===id),`${species} cannot purchase Homo Superior phasing`);
  assert.ok(!truthSelectedFreeTraits(rules,state(species)).some(t=>t.name==='Patchs tatoués AIDH'),`${species} receives no AIDH tattoo patches`);
}
assert.ok(!truthAvailableTalents(rules,state('homo_superior','profane')).some(t=>t.id===id),'Profane state still blocks Truth talent purchases');
const patches=truthSelectedFreeTraits(rules,hs).filter(t=>t.name==='Patchs tatoués AIDH');
assert.equal(patches.length,1,'Tattoo patches are a free innate trait, not a paid equipment item');
assert.match(patches[0].effect,/n’accorde ni le Talent/,'Patches alone do not grant the paid phasing talent');
assert.equal(truthPtvSpent(rules,hs),0,'Free tattoo patches spend no PTV');
const acquired={...hs,truthTalents:[id]};
assert.equal(truthPtvSpent(rules,acquired),1,'Purchasing phasing debits exactly 1 PTV');
assert.ok(truthSanitizeTalents(rules,acquired).includes(id),'A valid purchased phasing talent survives sanitization');
assert.ok(!truthSanitizeTalents(rules,{...acquired,choices:{species:'talass'}}).includes(id),'Changing species removes an invalid Homo Superior purchase');
assert.equal(JSON.stringify(rules),original,'Filtering and purchases do not mutate the canonical rules');
console.log('HOMO SUPERIOR PHASING OK — 1 PTV, V/SR/R, 1/2 PA both directions, linked existing gear only, HS-only, free patches, purchase and sanitization');
