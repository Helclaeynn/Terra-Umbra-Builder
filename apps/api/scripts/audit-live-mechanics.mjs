import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {terraUmbraTruthRules as truth} from '../dist/rules/truth/rules.js';
import {terraUmbraCreationRules as reality} from '../dist/rules/terra-umbra-creation.js';
import {getRealityRules} from '../dist/rules/reality.js';
import {dedicatedPowerIds} from '../dist/rules/live-mechanics.js';
import {livePowerRegistry} from '../dist/rules/live-power-registry.js';
import {truthWeaponProfiles} from '../dist/rules/live-truth-items.js';
import {vampirePowerRules} from '../dist/rules/live-vampire.js';
// A definition in a module is distinct from execution through a target resolver.
const realityAudit=JSON.parse(await readFile('../../docs/operations/audit-reality-coverage-20261009.json','utf8'));
const realityRows=new Map(realityAudit.entries.map(r=>[r.family+':'+r.id,r]));
const rows=[];
const add=(family,item,coverage,details={})=>rows.push({family,id:item.id,name:item.name,source:item.compendiumId??null,canonicalEffect:item.effectDetails??item.effect??item.properties??null,coverage,...details});
const talents=[...Object.values(reality.talents.origin).flat(),...Object.values(reality.talents.sphere).flat(),...reality.talents.common,...reality.talents.expertise];
for(const t of new Map(talents.map(t=>[t.id,t])).values()){
 const r=realityRows.get('talent:'+t.id);add('Réalité · talents',t,r?.implemented.length?'calcul ciblé / contexte':'texte / arbitrage MJ',{implemented:r?.implemented??[],manual:r?.manual??[],remaining:r?.pending??[],audit:'audit-reality-20261009.md'});
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
for(const [nature,n] of Object.entries(truth.structure.natures))for(const [i,t] of [...n.baseFreeTraits,...n.freeTraitRules.flatMap(r=>r.traits)].entries())add('Traits · '+nature,{...t,id:`trait:${i}`},'trait conditionnel / calcul partiel',{remaining:['Voir audit individuel des traits : attributs et profils corporels sont calculés ; un texte ne constitue pas une action automatique.'],audit:'audit-truth-items-20261009.md'});
for(const t of truth.corruption.talents)add('Vérité · corruption',t,'acquisition / arbitrage MJ',{remaining:['Dons/Rites/Faveurs, Souillure et Test de Bascule ne sont pas un moteur universel de résolution.'],audit:'audit-truth-capabilities-20261009.md'});
for(const t of truth.equipment){const profiles=truthWeaponProfiles.filter(w=>w.sourceId===t.id);add('Vérité · objets',t,profiles.length?'profil explicite / exceptions assistées':'inventaire / arbitrage MJ',{implemented:profiles.map(w=>w.label+' : DGT '+w.damage+', Perforant '+w.penetration+', '+(w.damageType??'vecteur à arbitrer')),remaining:['Profils à vecteur inconnu ou régime payant non suivi : résolution assistée. Ressources, charges runiques, véhicules et exceptions à consulter individuellement.'],audit:'audit-truth-items-20261009.md'});}
const equipment=getRealityRules();
for(const item of [...equipment.equipment,...equipment.augmentations]){
 const family=item.kind==='augmentation'?'augmentation':'equipment',r=realityRows.get(family+':'+item.id);
 add(family==='augmentation'?'Réalité · augmentations':'Réalité · équipement',item,r?.implemented.length?'calcul ciblé / contexte':'inventaire / arbitrage MJ',{implemented:r?.implemented??[],manual:r?.manual??[],remaining:r?.pending??[],audit:'audit-reality-20261009.md'});
}
const summary=Object.fromEntries([...new Set(rows.map(r=>r.family))].map(f=>[f,{total:rows.filter(r=>r.family===f).length,coverage:Object.fromEntries([...new Set(rows.filter(r=>r.family===f).map(r=>r.coverage))].map(c=>[c,rows.filter(r=>r.family===f&&r.coverage===c).length]))}]));
await mkdir('../../docs/operations',{recursive:true});
await writeFile('../../docs/operations/live-mechanics-inventory.json',JSON.stringify({date:'2026-10-09',scope:'Toutes les entrées des catalogues canoniques versionnés ; audit technique individuel complémentaire, sans prétendre automatiser tout le texte. Exclut les modifications conservées uniquement en base de production.',supplemental:'135 identifiants Mage générés, constructions typées et deux développements du second Spectre : audit-nature-resources-20261009.md.',total:rows.length,summary,entries:rows},null,2)+'\n');
console.log(JSON.stringify({total:rows.length,summary},null,2));
