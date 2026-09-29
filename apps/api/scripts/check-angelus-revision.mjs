import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {truthCatalogAngelus as original} from '../dist/rules/truth/catalog-angelus.js';
import {terraUmbraTruthRules as pkg} from '../dist/rules/truth/rules.js';
import {angelusRevisions} from '../dist/rules/truth/angelus-revision.js';
import {normalizeAngelusBuild,angelusTalentIds as ids,angelusAuraCapacity,angelusSins,angelusConstructIssues} from '../dist/rules/truth/angelus-build.js';
import {normalizeCharacterData} from '../dist/character-data.js';
import {getTalentRegistry} from '../dist/rules/talent-registry.js';
import {COMPENDIUM_VERITE_V7_ANGELUS_ARTICLES as articles} from '../dist/compendium-verite-v7-angelus.js';
const approval=JSON.parse(readFileSync(new URL('./angelus-approved-20260929.json',import.meta.url),'utf8'));
const rows=pkg.catalogs.angelus,registry=getTalentRegistry().filter(t=>t.natureId==='angelus'),segmenter=new Intl.Segmenter('fr',{granularity:'sentence'});
assert.equal(rows.length,114);assert.equal(registry.length,114);assert.equal(Object.keys(angelusRevisions).length,55);assert.equal(new Set(rows.map(t=>t.id)).size,114);
let unchanged=0,discounts=0;
for(const before of original){
 const after=rows.find(t=>t.id===before.id),approved=approval.find(t=>t.id===before.id);assert.ok(after&&approved,before.name);
 assert.equal(after.name,approved.name);assert.equal(after.cost,approved.cost);assert.equal(after.group,before.group);assert.equal(after.prerequisiteName,before.prerequisiteName);
 if(!approved.number){const {compendiumId,...rest}=after;assert.deepEqual(rest,before);unchanged++;continue;}
 assert.ok(angelusRevisions[before.id]);assert.ok(after.effectDetails);assert.ok(after.activation);
 assert.ok([...segmenter.segment(after.effect)].length<=2,`${after.name}: more than two sentences`);
 assert.equal(registry.find(t=>t.talentId===after.id).mechanics,after.effectDetails);
 if(after.cost!==before.cost){assert.equal(before.cost-after.cost,1);discounts++;}
}
assert.equal(unchanged,59);assert.equal(discounts,4);
const liaison=rows.find(t=>t.id===ids.liaison);assert.equal(liaison.name,'Liaison céleste');assert.equal(liaison.cost,2);assert.match(liaison.effect,/même monde/);assert.match(liaison.effect,/1 PA et 1 Aura/);assert.doesNotMatch(liaison.effect,/projeter|inerte|Paradis/);
for(const [talents,fm,expected] of [[[],5,8],[[ids.reserve],5,10],[[ids.cherub],5,10],[[ids.cherub,ids.reserve],5,12],[[ids.reserve],0,5],[[ids.reserve],999,10],[[ids.reserve,ids.reserve],5,10]])assert.equal(angelusAuraCapacity(talents,fm).maximum,expected);
for(const fm of [-1,Infinity,NaN])assert.equal(angelusAuraCapacity([],fm).maximum,3);
assert.equal(angelusSins.length,7);assert.match(angelusSins.find(s=>s.id==='envie').effect,/\+2/);assert.doesNotMatch(angelusSins.find(s=>s.id==='envie').effect,/minimum/);
const raw={secondaryNature:'vertu',transcendenceEvent:'Éveil  ',preferredSin:'envie',observedSkill:'Médecine',bladeForm:'ranged',bladeSacrifice:3,liaisonContact:'Contact <script>x</script>',heartLink:'Lien',shapeDescription:'Pont appuyé',construct:{name:'Auxiliaire',kind:'carrier',purpose:'Porter',limits:'30 m et PA du créateur',approved:true},approved:true,auraCurrent:999,xpEarned:100,role:'admin'};
const clean=normalizeAngelusBuild(raw);assert.equal(clean.transcendenceEvent,'Éveil  ');assert.deepEqual(normalizeAngelusBuild(clean),clean);assert.deepEqual(angelusConstructIssues(clean.construct),[]);
for(const key of ['approved','auraCurrent','xpEarned','role'])assert.equal(clean[key],undefined);assert.equal(clean.construct.approved,undefined);
assert.equal(normalizeAngelusBuild({secondaryNature:'seraph',preferredSin:'admin',bladeSacrifice:999}).secondaryNature,'');assert.equal(normalizeAngelusBuild({construct:{purpose:'x'.repeat(5000)}}).construct.purpose.length,1000);
assert.deepEqual(normalizeCharacterData({truth:{nature:'angelus',choices:{angelusBuild:raw}}},'Test').truth.choices.angelusBuild,clean);
const text=JSON.stringify(articles);assert.match(text,/métaphysique/);assert.match(text,/après/);assert.doesNotMatch(text,/Compétence observée est au minimum 2/);
console.log('ANGELUS API OK — 55 approved revisions, 59 untouched, 114 stable IDs, four discounts, Liaison replaces travel, two-sentence cards, complete rules, permanent Aura caps and bounded non-authorizing choices');
