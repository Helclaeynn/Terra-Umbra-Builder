import assert from 'node:assert/strict';
import {freeTraitProfile} from '../dist/rules/live-free-traits.js';
const data=(nature,species,consciousness='initie')=>({truth:{nature,consciousness,choices:{species}}});
for(const revelation of ['v','sr','r']){
 const mage=freeTraitProfile(data('mage'),{revelation});assert.equal(mage.occultDefense,revelation==='v'?0:3);assert.equal(mage.bodyArmor,0);assert.equal(mage.naturalDamage,1);
 const mosen=freeTraitProfile(data('extral','mosen'),{revelation});assert.equal(mosen.bodyArmor,revelation==='r'?1:0);assert.equal(mosen.naturalDamage,revelation==='r'?2:1);assert.equal(mosen.occultDefense,0);
 const adrak=freeTraitProfile(data('extral','adrak'),{revelation});assert.equal(adrak.naturalDamage,revelation==='v'?1:revelation==='sr'?2:3);assert.equal(adrak.bodyArmor,0);
 for(const [nature,species] of [['mage',undefined],['extral','mosen'],['extral','adrak']])assert.deepEqual(freeTraitProfile(data(nature,species,'profane'),{revelation}),{bodyArmor:0,naturalDamage:1,occultDefense:0,components:[]});
}
for(const wrong of [data('extral','baseanh'),data('humain','mosen'),data('vampire','adrak'),{}])assert.deepEqual(freeTraitProfile(wrong,{revelation:'r'}),{bodyArmor:0,naturalDamage:1,occultDefense:0,components:[]});
const original=data('extral','mosen'),copy=structuredClone(original);freeTraitProfile(original,{revelation:'r'});assert.deepEqual(original,copy);
assert.equal(freeTraitProfile(data('extral','mosen'),{revelation:'r'}).components.find(c=>c.kind==='armor').mode,'replace','body armor is a layer, not an added duplicate of another body shell');
console.log('FREE TRAITS OK — Mage SR/R occult defense, Mo’sen R body armor/natural damage, Ad’rak SR/R natural damage, exact species/nature gates, Profane rejection and immutable input.');
