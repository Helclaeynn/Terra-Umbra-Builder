import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {truthCatalogDaemon as original} from '../dist/rules/truth/catalog-daemon.js';
import {terraUmbraTruthRules as pkg} from '../dist/rules/truth/rules.js';
import {daemonRevisions,propheticRemanence} from '../dist/rules/truth/daemon-revision.js';
import {getTalentRegistry} from '../dist/rules/talent-registry.js';
import {normalizeDaemonBuild,daemonTalentIds as ids,daemonDefinitionIssues,daemonPathologyIssues} from '../dist/rules/truth/daemon-build.js';
import {normalizeCharacterData} from '../dist/character-data.js';
import {COMPENDIUM_VERITE_V7_DAEMON_ARTICLES as articles} from '../dist/compendium-verite-v7-daemons.js';
const approval=JSON.parse(readFileSync(new URL('./daemon-approved-20260929.json',import.meta.url),'utf8'));
const rows=pkg.catalogs.daemon,registry=getTalentRegistry().filter(r=>r.natureId==='daemon'),segmenter=new Intl.Segmenter('fr',{granularity:'sentence'});
assert.equal(original.length,141);assert.equal(rows.length,142);assert.equal(registry.length,142);assert.equal(new Set(rows.map(t=>t.id)).size,142);assert.equal(Object.keys(daemonRevisions).length,62);
let untouched=0,discount=0;
for(const before of original){
 const after=rows.find(t=>t.id===before.id),review=approval.find(r=>r.id===before.id);assert.ok(after&&review,before.name);
 assert.equal(after.name,before.name);assert.equal(after.group,before.group);assert.equal(after.prerequisiteName,before.prerequisiteName);
 assert.equal(after.cost,review.cost);
 if(review.verdict==='Conserver'){const {compendiumId,...rest}=after;assert.deepEqual(rest,before);untouched++;continue;}
 assert.ok(daemonRevisions[before.id]);assert.ok(after.effectDetails);assert.ok(after.activation);
 assert.ok([...segmenter.segment(after.effect)].length<=2,after.name+' has more than two sentences');
 assert.equal(registry.find(t=>t.talentId===before.id).mechanics,after.effectDetails);
 if(before.cost!==after.cost){assert.equal(before.cost-after.cost,1);discount++;}
}
assert.equal(untouched,79);assert.equal(discount,2);assert.equal(rows.find(t=>t.id===ids.remanence).cost,2);assert.equal(propheticRemanence.id,ids.remanence);
for(const [name,pattern] of [['Loi du Juge',/3 PV irréductibles/],['Arc céleste',/fois par round/],['Anéantissement',/2 PA/],['Typhon',/3 PA/],['Déluge',/2 PA/],['Seigneur des Courants',/vol soutenu/],['La Fin vient',/régénérés/],['Terreur',/trois témoins/],['Formation secondaire',/deuxième Fonction/]])assert.match(rows.find(t=>t.name===name).effect,pattern,name);
const sourceChoice=pkg.structure.natures.daemon.choices.find(c=>c.key==='soulOrigin');assert.ok(sourceChoice.optional);assert.equal(sourceChoice.options.length,3);
const raw={secondaryFunction:'oracle',secondaryMentor:'Mentor  ',spectralAffinity:'photomancie',secondSpectralAffinity:'divination',formProperties:['flight','flight','armour','admin'],rites:[{name:'Rite <script>x</script>',effect:'Un effet étroit',source:'Mentor',pa:1,range:'Contact',frequency:'1/scène',duration:'Scène',resistance:'Opposition',limits:'Initiale / Mineure',approved:true}],pathologies:[{kind:'disease',name:'Test',symptoms:'Vertige',penalty:'−3',duration:'Scène',transmission:'Aucune',incubation:'Immédiate',resistance:'Défense occulte',cure:'Soins adaptés',xpEarned:999}],remanence:{approved:true},approved:true,mjAuthorized:true,role:'admin',xpEarned:999,renownAdjustment:5};
const clean=normalizeDaemonBuild(raw);assert.equal(clean.secondaryMentor,'Mentor  ','Typing is not trimmed on every keystroke');assert.deepEqual(clean.formProperties,['flight','armour']);assert.deepEqual(daemonDefinitionIssues(clean.rites[0]),[]);assert.deepEqual(daemonPathologyIssues(clean.pathologies[0]),[]);
for(const key of ['approved','mjAuthorized','role','xpEarned','renownAdjustment'])assert.equal(clean[key],undefined);assert.equal(clean.rites[0].approved,undefined);assert.equal(clean.pathologies[0].xpEarned,undefined);
assert.deepEqual(normalizeDaemonBuild(clean),clean);for(const pa of [-1,NaN,Infinity,0.5,'1',101])assert.equal(normalizeDaemonBuild({remanence:{pa}}).remanence.pa,null);
assert.equal(normalizeDaemonBuild({rites:Array(100).fill({}),pathologies:Array(100).fill({})}).rites.length,8);
assert.equal(normalizeDaemonBuild({rites:Array(100).fill({}),pathologies:Array(100).fill({})}).pathologies.length,6);
const data=normalizeCharacterData({truth:{nature:'daemon',choices:{daemonBuild:raw}}},'Test');assert.deepEqual(data.truth.choices.daemonBuild,clean);
const rulePage=articles.find(a=>a.id==='regles-verite-v7-daemon-nature-fonctions-divinites-facettes');assert.ok(rulePage.sections.some(s=>s.blocks.some(b=>b.text?.includes('daemon:origine-de-l-elu-ancien-prophete'))));assert.ok(rulePage.sections.some(s=>s.blocks.some(b=>b.text?.includes('Perséphone'))));
console.log('DAEMON API OK — 62 approved revisions, 79 untouched, two discounts, 142 canonical entries, concise cards/full Compendium, bounded saved options, no forged GM approval or rewards');
