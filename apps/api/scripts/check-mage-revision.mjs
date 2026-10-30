import assert from 'node:assert/strict';
import {truthCatalogMage as original} from '../dist/rules/truth/catalog-mage.js';
import {terraUmbraTruthRules as rules} from '../dist/rules/truth/rules.js';
import {mageRevisions} from '../dist/rules/truth/mage-revision.js';
import {getTalentRegistry} from '../dist/rules/talent-registry.js';
import {normalizeMageTechniques,mageTechniqueDefinitionIssues} from '../dist/rules/truth/mage-techniques.js';
import {normalizeCharacterData} from '../dist/character-data.js';
const rows=rules.catalogs.mage,registry=getTalentRegistry(),segmenter=new Intl.Segmenter('fr',{granularity:'sentence'});
assert.equal(rows.length,12);assert.equal(Object.keys(mageRevisions).length,12);
for(const before of original){
 const after=rows.find(t=>t.id===before.id);assert.ok(after);assert.equal(after.cost,before.cost);assert.equal(after.name,before.name);assert.equal(after.group,before.group);
 assert.ok([...segmenter.segment(after.effect)].length<=2,after.name+' must have at most two sentences');
 assert.ok(after.effectDetails);assert.ok(after.compendiumId);
 assert.equal(registry.find(r=>r.natureId==='mage'&&r.talentId===after.id).mechanics,after.effectDetails);
}
const ancrage=rows.find(t=>t.name==='Ancrage du Mageius');assert.match(ancrage.effect,/concentration/);assert.match(ancrage.effectDetails,/Aucun bonus aux tests de Revers/);
assert.notEqual(rows.find(t=>t.name==='Héritage familial').prerequisiteName,'de Maîtrise');
const sample={family:{name:'Test',effect:'Effet défini',source:'Mentor',exception:'Exception',requirements:[{affinity:'alchimie',mastery:'affinee',amplitude:'mineure'}],pa:1,range:'Contact',tension:1,approved:true,xpEarned:100}};
const normal=normalizeMageTechniques(sample);assert.equal(normal.family.approved,undefined);assert.equal(normal.family.xpEarned,undefined);
assert.deepEqual(mageTechniqueDefinitionIssues('family',normal.family,new Set(['alchimie'])),[]);
assert.ok(mageTechniqueDefinitionIssues('family',undefined,new Set()).length);
for(const n of [-1,Infinity,NaN,1.5,'1'])assert.equal(normalizeMageTechniques({echo:{pa:n,tension:n}}).echo.pa,null);
const record=normalizeCharacterData({truth:{nature:'mage',choices:{mageTechniques:sample}}});
assert.deepEqual(record.truth.choices.mageTechniques,normal);
console.log('MAGE API OK — 12 concise revisions, unchanged IDs/costs, full Compendium, bounded technique definitions, no forged GM approval or reward fields');
