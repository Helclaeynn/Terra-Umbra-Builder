import assert from 'node:assert/strict';
import {truthCatalogHumain as original} from '../dist/rules/truth/catalog-humain.js';
import {terraUmbraTruthRules as pkg} from '../dist/rules/truth/rules.js';
import {normalizeHunterBuild} from '../dist/rules/truth/hunter-build.js';
const rows=pkg.catalogs.humain,byId=new Map(rows.map(t=>[t.id,t]));
assert.equal(rows.length,266);assert.equal(byId.size,266);assert.equal(rows.reduce((n,t)=>n+t.cost,0),525);
for(const t of rows){const old=original.find(r=>r.id===t.id);assert.ok(old);assert.equal(t.name,old.name);assert.equal(t.group,old.group);assert.ok(t.effectDetails);for(const id of [...t.requiredTalentIds,...t.anyRequiredTalentIds])assert.ok(byId.has(id),id);}
const sang=rows.find(t=>t.name==='Saignée noire');assert.match(sang.effectDetails,/Sang entier est éteint/);assert.match(sang.effectDetails,/Défense occulte/);assert.match(sang.effectDetails,/autres Sangs restent/);assert.equal(sang.cost,2);
assert.match(rows.find(t=>t.name==='Mettre à terre').effectDetails,/Exception explicite.*UNE attaque/s);
assert.equal(rows.find(t=>t.name==='Vase de Souillure').anyRequiredTalentIds.length,2);
const clean=normalizeHunterBuild({doctrines:['xenoshield','xenoshield','fake'],records:{real:{reference:'Existing',pa:900}},ptvEarned:900,approved:true});assert.deepEqual(clean.doctrines,['xenoshield']);assert.equal(clean.ptvEarned,undefined);assert.equal(clean.records.real.pa,undefined);
console.log('HUNTERS API OK — 266 stable IDs, 525 PTV, whole-blood extinction, exact AND/OR prerequisites and bounded permanent records');
