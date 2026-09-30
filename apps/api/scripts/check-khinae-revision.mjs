import assert from 'node:assert/strict';
import {truthCatalogGarou} from '../dist/rules/truth/catalog-garou.js';
import {truthCatalogKhinae} from '../dist/rules/truth/catalog-khinae.js';
import {terraUmbraTruthRules as pkg} from '../dist/rules/truth/rules.js';
import {khinaeRevisions} from '../dist/rules/truth/khinae-revision.js';
assert.equal(khinaeRevisions.length,88);assert.equal(new Set(khinaeRevisions.flatMap(r=>r.ids)).size,136);
for(const [nature,original] of [['garou',truthCatalogGarou],['khinae',truthCatalogKhinae]]){
 const rows=pkg.catalogs[nature],index=new Map(rows.map(t=>[t.id,t]));assert.equal(rows.length,68);assert.equal(index.size,68);let discounts=0;
 for(const old of original){const t=index.get(old.id);assert.ok(t);assert.equal(t.name,old.name);assert.equal(t.group,old.group);assert.ok(t.effectDetails);assert.doesNotMatch(t.effectDetails,/proposition|proposé/);assert.ok([...new Intl.Segmenter('fr',{granularity:'sentence'}).segment(t.effect)].length<=2,t.id);if(t.cost!==old.cost){discounts++;assert.equal(t.cost,old.cost-1);assert.match(t.id,/metabolisme_de_khinae|memoire/);}if(t.prerequisite)assert.ok(index.has(t.prerequisite),t.id+' exact prerequisite');}
 assert.equal(discounts,nature==='garou'?2:0);
}
for(const t of pkg.catalogs.garou.filter(t=>t.group.startsWith('Sang '))){const k=pkg.catalogs.khinae.find(k=>k.id==='khinae_blood_'+t.id);assert.ok(k);assert.equal(k.effectDetails,t.effectDetails);assert.equal(k.cost,t.cost);}
console.log('KHINAE API OK — 136 stable IDs, 88 rules, shared Sangs, only two approved discounts and exact dependencies');
