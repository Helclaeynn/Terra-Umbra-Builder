import {access,mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {terraUmbraTruthRules as truth} from '../dist/rules/truth/rules.js';
import {truthRuntimeStructure} from '../dist/rules/truth/runtime-structure.js';
import {terraUmbraCreationRules as reality} from '../dist/rules/terra-umbra-creation.js';
import {terraUmbraCreationRules as realityBaseline} from '../dist/rules/terra-umbra-creation-base.js';
import {realityTalentRevision} from '../dist/rules/reality-talents-revision.js';
import {V9_MISSING_AUGMENTATIONS} from '../dist/rules/reality-v9-augmentations.js';
import {getRealityRules} from '../dist/rules/reality.js';
import {dedicatedPowerIds} from '../dist/rules/live-mechanics.js';
import {livePowerRegistry} from '../dist/rules/live-power-registry.js';
import {truthWeaponProfiles} from '../dist/rules/live-truth-items.js';
import {vampirePowerRules} from '../dist/rules/live-vampire.js';
// A definition in a module is distinct from execution through a target resolver.
const realityAudit=JSON.parse(await readFile('../../docs/operations/audit-reality-coverage-20261009.json','utf8'));
const realityRows=new Map(realityAudit.entries.map(r=>[r.family+':'+r.id,r]));
const inventoryOnlyImplementation='Inventaire / acquisition / attribution MJ et affichage du profil canonique.';
const realitySources=new Map();
const sourceRef=(file,selector)=>`${file}#${selector}`;
function talentSources(items,selector){
 for(const [i,t] of items.entries()){
  const definitionSource=sourceRef('apps/api/src/rules/terra-umbra-creation-base.ts',`terraUmbraCreationRules.talents.${selector}[${i}]`);
  realitySources.set('talent:'+t.id,realityTalentRevision[t.id]
   ?{source:sourceRef('apps/api/src/rules/reality-talents-revision.ts',`realityTalentRevision[${JSON.stringify(t.id)}].effect`),definitionSource}
   :{source:definitionSource});
 }
}
for(const family of ['origin','sphere'])for(const [group,items] of Object.entries(realityBaseline.talents[family]))talentSources(items,`${family}[${JSON.stringify(group)}]`);
for(const family of ['common','expertise'])talentSources(realityBaseline.talents[family],family);
async function catalogSources(file,family,selector,compressed=false){
 const text=await readFile('../../'+file,'utf8');
 const raw=JSON.parse(compressed?gunzipSync(Buffer.from(text.replace(/\s+/g,''),'base64')).toString('utf8'):text);
 const entries=selector==='catalog.entries'?raw.catalog.entries:raw.entries;
 for(const [i,item] of entries.entries())realitySources.set(family+':'+item.id,{source:sourceRef(file,`${selector}[${i}]`),canonical:item});
}
await catalogSources('compendium/source/current-equipment-catalog-v1.json','equipment','catalog.entries');
await catalogSources('character-builder/rulesets/terra-umbra/reality/safe/neuroprograms.part01.b64','equipment','entries',true);
await catalogSources('character-builder/rulesets/terra-umbra/reality/safe/vehicles.part01.b64','equipment','entries',true);
await catalogSources('character-builder/rulesets/terra-umbra/reality/augmentations.json.gz.b64','augmentation','entries',true);
for(const [i,item] of V9_MISSING_AUGMENTATIONS.entries())if(!realitySources.has('augmentation:'+item.id))realitySources.set('augmentation:'+item.id,{source:sourceRef('apps/api/src/rules/reality-v9-augmentations.ts',`V9_MISSING_AUGMENTATIONS[${i}]`),canonical:item});
for(const r of realityAudit.entries){
 const provenance=realitySources.get(r.family+':'+r.id);
 assert(provenance,`Missing versioned Reality source: ${r.family}:${r.id}`);
 r.source=provenance.source;
 if(provenance.definitionSource)r.definitionSource=provenance.definitionSource;
 // Inventory, acquisition and display are useful operations, but are not a mechanical calculation.
 const calculated=r.implemented.some(text=>text!==inventoryOnlyImplementation);
 r.coverage=calculated?'calcul ciblé / contexte':r.family==='talent'?'texte / arbitrage MJ':'inventaire / arbitrage MJ';
}
const traitSources=new Map();
function traitSource(nature,t,selector,baseline){
 const definitionSource=sourceRef('apps/api/src/rules/truth/runtime-structure.ts',`truthRuntimeStructure.natures.${nature}.${selector}`);
 if(JSON.stringify(t)===JSON.stringify(baseline))return {source:definitionSource};
 assert.equal(nature,'extral',`Unexpected trait revision: ${nature}:${selector}`);
 if(t.id==='free-extral-talass-fractures')return {source:sourceRef('apps/api/src/rules/truth/extral-build.ts','applyExtralStructure (id="free-extral-talass-fractures")')};
 assert(baseline,`Unidentified added trait: ${nature}:${selector}`);
 return {source:sourceRef('apps/api/src/rules/truth/extral-build.ts',`innate[${JSON.stringify(t.name)}]`),definitionSource};
}
const truthItemsAudit=JSON.parse(await readFile('../../docs/operations/audit-truth-items-20261009.json','utf8'));
const rows=[];
const add=(family,item,coverage,details={})=>rows.push({family,id:item.id,name:item.name,source:item.compendiumId??null,canonicalEffect:item.effectDetails??item.effect??item.properties??null,coverage,...details});
const talents=[...Object.values(reality.talents.origin).flat(),...Object.values(reality.talents.sphere).flat(),...reality.talents.common,...reality.talents.expertise];
for(const t of new Map(talents.map(t=>[t.id,t])).values()){
 const r=realityRows.get('talent:'+t.id);add('Réalité · talents',t,r.coverage,{source:r.source,...(r.definitionSource?{definitionSource:r.definitionSource}:{}),implemented:r.implemented,manual:r.manual,remaining:r.pending,audit:'audit-reality-20261009.md'});
}
for(const [nature,items] of Object.entries(truth.catalogs))for(const t of items){
 const rule=livePowerRegistry.find(p=>p.nature===nature&&p.id===t.id),v=nature==='vampire'?vampirePowerRules[t.id]:null;
 let coverage='texte / activation assistée',implemented=[],remaining=['Cible, contexte, opposition et conséquences particulières à résoudre explicitement.'];
 if(rule){coverage=rule.route==='external'?'définition contrôlée / résolution externe':rule.route==='passive'?'calcul passif ciblé':'action dédiée / calcul ciblé';implemented=[`Route ${rule.route} ; coût ${rule.cost} PA ; quota ${rule.limit??'aucun'} ; durée ${rule.duration}.`,...rule.effects.map(e=>`${e.kind} ${e.amount}${e.skills?' : '+e.skills.join(', '):''}.`)];remaining=[rule.notes,...(rule.context?[rule.context]:[])];}
 else if(dedicatedPowerIds.has(t.id)){coverage='action dédiée / quota serveur';implemented=['Défense spéciale, réparation nanitique ou récupération selon identifiant explicite.'];}
 else if(v){coverage=['vampire','defense','passive'].includes(v.route)?'ressource / action dédiée':'activation assistée / coût contrôlé';implemented=[`Route ${v.route} ; coût ${v.cost} PA ; quota ${v.limit??'aucun'} ; entretien ${v.maintenance??0} PA/round.`];}
 else if(['mage','daemon','angelus'].includes(nature)){coverage=nature==='mage'?'construction / ressource dédiée':'ressource / activation assistée';implemented=['Préparation et ressources de Nature via commandes dédiées ; le coût doit être fixe et défini pour être exécuté.'];remaining=['Le journal de préparation/activation ne résout pas automatiquement la cible, la zone, les soins/transferts ou les conséquences narratives.'];}
 add('Vérité · '+nature,t,coverage,{access:t.access??'R',implemented,remaining,audit:nature==='vampire'?'audit-vampire-20261009.md':['mage','daemon','angelus'].includes(nature)?'audit-nature-resources-20261009.md':'audit-truth-capabilities-20261009.md'});
}
for(const [nature,n] of Object.entries(truth.structure.natures)){
 let flatIndex=0;
 const baseline=truthRuntimeStructure.natures[nature];
 const addTrait=(t,selector,auditId,base)=>{
  const provenance=traitSource(nature,t,selector,base);
  traitSources.set(auditId,{...provenance,name:t.name,effect:t.effect});
  add('Traits · '+nature,{...t,id:`trait:${flatIndex++}`},'trait conditionnel / calcul partiel',{...provenance,remaining:['Voir audit individuel des traits : attributs et profils corporels sont calculés ; un texte ne constitue pas une action automatique.'],audit:'audit-truth-items-20261009.md'});
 };
 for(const [i,t] of n.baseFreeTraits.entries())addTrait(t,`baseFreeTraits[${i}]`,`${nature}:base:${i}`,baseline.baseFreeTraits[i]);
 for(const [i,rule] of n.freeTraitRules.entries())for(const [j,t] of rule.traits.entries())addTrait(t,`freeTraitRules[${i}].traits[${j}]`,`${nature}:choice:${i}:${j}`,baseline.freeTraitRules[i]?.traits[j]);
}
for(const t of truthItemsAudit.freeTraits){
 const provenance=traitSources.get(t.id);
 assert(provenance,`Missing trait provenance: ${t.id}`);
 assert.equal(t.name,provenance.name,`Trait audit identity mismatch: ${t.id}`);
 assert.equal(t.canonicalEffect,provenance.effect,`Trait audit effect mismatch: ${t.id}`);
 t.source=provenance.source;
 if(provenance.definitionSource)t.definitionSource=provenance.definitionSource;
}
assert.equal(truthItemsAudit.freeTraits.length,traitSources.size);
truthItemsAudit.sourceFiles=truthItemsAudit.sourceFiles.filter(file=>file!=='.v2-rules-data (Réalité seulement)');
for(const file of ['apps/api/src/rules/truth/runtime-structure.ts','apps/api/src/rules/truth/extral-build.ts'])if(!truthItemsAudit.sourceFiles.includes(file))truthItemsAudit.sourceFiles.push(file);
for(const t of truth.corruption.talents)add('Vérité · corruption',t,'acquisition / arbitrage MJ',{remaining:['Dons/Rites/Faveurs, Souillure et Test de Bascule ne sont pas un moteur universel de résolution.'],audit:'audit-truth-capabilities-20261009.md'});
for(const t of truth.equipment){const profiles=truthWeaponProfiles.filter(w=>w.sourceId===t.id);add('Vérité · objets',t,profiles.length?'profil explicite / exceptions assistées':'inventaire / arbitrage MJ',{implemented:profiles.map(w=>w.label+' : DGT '+w.damage+', Perforant '+w.penetration+', '+(w.damageType??'vecteur à arbitrer')),remaining:['Profils à vecteur inconnu ou régime payant non suivi : résolution assistée. Ressources, charges runiques, véhicules et exceptions à consulter individuellement.'],audit:'audit-truth-items-20261009.md'});}
const equipment=getRealityRules();
for(const item of [...equipment.equipment,...equipment.augmentations]){
 const family=item.kind==='augmentation'?'augmentation':'equipment',r=realityRows.get(family+':'+item.id);
 const canonical=realitySources.get(family+':'+item.id)?.canonical;
 assert(canonical,`Missing catalog entry: ${family}:${item.id}`);
 const {_path,...loaded}=item.data;
 assert.deepEqual(loaded,item.neuro||item.vehicle||family==='augmentation'?canonical:canonical.data,`Loaded catalog differs from versioned source: ${family}:${item.id}`);
 add(family==='augmentation'?'Réalité · augmentations':'Réalité · équipement',item,r.coverage,{source:r.source,implemented:r.implemented,manual:r.manual,remaining:r.pending,audit:'audit-reality-20261009.md'});
}
const summary=Object.fromEntries([...new Set(rows.map(r=>r.family))].map(f=>[f,{total:rows.filter(r=>r.family===f).length,coverage:Object.fromEntries([...new Set(rows.filter(r=>r.family===f).map(r=>r.coverage))].map(c=>[c,rows.filter(r=>r.family===f&&r.coverage===c).length]))}]));
assert.equal(rows.length,2553);
assert.equal(new Set(rows.map(r=>r.family+':'+r.id)).size,rows.length);
assert.equal(realityAudit.entries.length,635);
assert.equal(summary['Réalité · équipement'].coverage['inventaire / arbitrage MJ'],190);
for(const row of rows)assert.equal(typeof row.source==='string'&&row.source.trim().length>0,true,`Missing source: ${row.family}:${row.id}`);
const files=new Set([...rows,...realityAudit.entries,...truthItemsAudit.freeTraits].flatMap(r=>[r.source,r.definitionSource]).filter(s=>s?.includes('#')).map(s=>s.split('#')[0]));
for(const file of files)await access('../../'+file);
for(const audit of new Set(rows.map(r=>r.audit)))await access('../../docs/operations/'+audit);
await mkdir('../../docs/operations',{recursive:true});
await writeFile('../../docs/operations/audit-reality-coverage-20261009.json',JSON.stringify(realityAudit,null,2)+'\n');
await writeFile('../../docs/operations/audit-truth-items-20261009.json',JSON.stringify(truthItemsAudit,null,2)+'\n');
await writeFile('../../docs/operations/live-mechanics-inventory.json',JSON.stringify({date:'2026-10-09',scope:'Toutes les entrées des catalogues canoniques versionnés ; audit technique individuel complémentaire, sans prétendre automatiser tout le texte. Exclut les modifications conservées uniquement en base de production.',supplemental:'135 identifiants Mage générés, constructions typées et deux développements du second Spectre : audit-nature-resources-20261009.md.',total:rows.length,summary,entries:rows},null,2)+'\n');
console.log(JSON.stringify({total:rows.length,summary},null,2));
