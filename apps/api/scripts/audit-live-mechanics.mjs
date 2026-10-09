import {mkdir,writeFile} from 'node:fs/promises';
import {terraUmbraTruthRules as truth} from '../dist/rules/truth/rules.js';
import {terraUmbraCreationRules as reality} from '../dist/rules/terra-umbra-creation.js';
import {terraUmbraRealitySkillTalentMap as skillMap,terraUmbraTalentChoiceSpecs as specs} from '../dist/rules/terra-umbra-creation-lore.js';
import {getRealityRules} from '../dist/rules/reality.js';
import {augmentationPlayBonuses,extralPlayBonuses,exilePlayBonuses} from '../dist/rules/play-bonuses.js';
import {BESTIARY_WEAPONS} from '../dist/campaign-bestiary-weapons.js';
process.env.DATABASE_URL ||= 'postgres://audit:unused@localhost/audit_no_connection';
const {combatEquipment}=await import('../dist/campaign-combat.js');
// Inventory coverage is not a claim that prose has been fully automated.
const rows=[];
const add=(family,item,coverage,notes)=>rows.push({family,id:item.id,name:item.name,source:item.compendiumId??null,coverage,notes});
const talents=[...Object.values(reality.talents.origin).flat(),...Object.values(reality.talents.sphere).flat(),...reality.talents.common,...reality.talents.expertise];
for(const t of new Map(talents.map(t=>[t.id,t])).values())add('Réalité · talents',t,skillMap[t.id]||specs[t.id]?'calcul ciblé + texte':'texte / contexte MJ','Acquisition dans le builder ; consulter play-state.ts, reality-conditional-bonuses.ts et reality-talents-policy.ts pour les effets de test, soins et économie. Aucun effet narratif déduit automatiquement.');
for(const [nature,items] of Object.entries(truth.catalogs))for(const t of items){
 const prepared=(nature==='extral'?extralPlayBonuses.map(b=>({...b,id:'extral-'+b.id})):nature==='exile'?exilePlayBonuses.filter(b=>b.id!=='exile-pas-leger'):[]).some(b=>b.id===t.id);
 add('Vérité · '+nature,t,prepared?'bonus conditionnel préparé + activation assistée':'activation assistée / texte',`Accès ${t.access??'R'} ; propriété et prérequis, PA explicites, durée et compteur d’usage simples. Cibles, ressources, exceptions et conséquences du texte à arbitrer. L’activation générique ne prouve pas l’automatisation de l’effet.`);
}
for(const [nature,n] of Object.entries(truth.structure.natures))for(const [i,t] of [...n.baseFreeTraits,...n.freeTraitRules.flatMap(r=>r.traits)].entries())add('Traits · '+nature,{...t,id:`trait:${i}`},'texte / activation assistée','Traits conditionnés par les choix du personnage ; corps et attributs traités séparément dans play-truth.ts et revelation.ts.');
for(const t of truth.corruption.talents)add('Vérité · corruption',t,'texte / arbitrage MJ','Acquisition et corruption suivies dans le builder/récompenses ; activation des Dons/Rites/Faveurs et conséquences non automatisées.');
for(const t of truth.equipment)add('Vérité · objets',t,'inventaire / arbitrage MJ','Inventaire et description ; profils mécaniques spécifiques non assimilés implicitement à une arme standard.');
const equipment=getRealityRules();
for(const item of [...equipment.equipment,...equipment.augmentations]){
 const weapons=BESTIARY_WEAPONS.some(w=>w.id===item.id||w.name===item.name),protection=combatEquipment({equipmentIds:[item.id]},true).length>0,bonus=augmentationPlayBonuses.some(b=>b.id===item.id);
 add(item.kind==='augmentation'?'Réalité · augmentations':'Réalité · équipement',item,weapons||protection||bonus?'calcul ciblé + texte':'inventaire / texte',[weapons?'Arme : jet, DGT, Perforant et famille.':'',protection?'Protection proposée : applicabilité à confirmer.':'',bonus?'Bonus contextuel activable.':'','Charges, munitions, consommables, véhicules, systèmes Neuro et exceptions non déduits du texte.'].filter(Boolean).join(' '));
}
const summary=Object.fromEntries([...new Set(rows.map(r=>r.family))].map(f=>[f,{total:rows.filter(r=>r.family===f).length,coverage:Object.fromEntries([...new Set(rows.filter(r=>r.family===f).map(r=>r.coverage))].map(c=>[c,rows.filter(r=>r.family===f&&r.coverage===c).length]))}]));
await mkdir('../../docs/operations',{recursive:true});
const notes=[...new Set(rows.map(r=>r.notes))];
await writeFile('../../docs/operations/live-mechanics-inventory.json',JSON.stringify({notes,scope:'Catalogues canoniques versionnés, inventaire de couverture technique et non validation intégrale de chaque règle narrative',summary,entries:rows.map(({notes:note,...row})=>({...row,note:notes.indexOf(note)}))},null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
