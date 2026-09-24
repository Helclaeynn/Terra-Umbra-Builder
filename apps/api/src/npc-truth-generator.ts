import {NPC_TRUTH_TIERS} from './npc-truth-tiers.js';
import {NPC_TRUTH_GENERIC_TALENTS} from './npc-truth-generic-talents.js';
import type {NpcData,NpcTruth} from './campaign-npc-model.js';

export const NPC_TRUTH_NATURES=[
 {id:'humain-chasseur',name:'Humain / Chasseur'},{id:'vampire',name:'Vampire'},{id:'garou',name:'Garou'},
 {id:'khinae',name:'Autre Khinae'},{id:'mage',name:'Mage'},{id:'daemon',name:'Daemon'},
 {id:'angelus',name:'Angelus'},{id:'exile',name:'Exilé'},{id:'extral',name:'Extral'},
 {id:'aseryn',name:'Aseryn'},{id:'corrompu',name:'Corrompu'},{id:'autre',name:'Autre Nature'}
] as const;
export const NPC_TRUTH_ARCHETYPES=[
 {id:'veilleur',name:'Veilleur / observateur',presetId:'enqueteur'},
 {id:'predateur',name:'Prédateur',presetId:'combattant'},
 {id:'occultiste',name:'Occultiste',presetId:'technicien'},
 {id:'protecteur',name:'Protecteur',presetId:'garde'},
 {id:'diplomate',name:'Diplomate surnaturel',presetId:'negociateur'},
 {id:'soigneur',name:'Soigneur / guide',presetId:'soignant'},
 {id:'traqueur',name:'Traqueur',presetId:'infiltrateur'},
 {id:'custom',name:'Personnalisé',presetId:'civil'}
] as const;
export const NPC_TRUTH_TIER_TEMPLATE:{[key:string]:string}={recent:'entraine',initie:'elite',confirme:'haute-elite',majeur:'heroique',exceptionnel:'superieur'};
// Only unconditional Nature traits are prefilled. Lineage, court and purchased
// gifts depend on choices the generator does not make on the MJ's behalf.
const NATURE_ABILITIES:Record<string,string>={
 vampire:'Sens prédateurs (SR) : voit dans l’obscurité naturelle et perçoit le sang frais. Prédation sanguine (R, 1 PA) : jet de Pugilat ; en cas de réussite, récupère des PV selon le DR et la vitalité réellement prélevée. Stase (R, 2 PA) : devient inerte ; dégradation naturelle et hémorragies interrompues.',
 garou:'Régénération lente (R, forme humaine révélée ou animale) : récupère 1 PV par heure hors combat. Corps de guerre (R, hybride) : +3 aux tests de Pugilat et 2 PV récupérés au début de chaque round tant que la forme est maintenue et que le personnage vit. Rythme Khinae (R, hybride) : +1 PA par round après l’achèvement de la Mue.'
};
function talentSelection(powerId:string,skillValue:number,seed:string){const power=NPC_TRUTH_TIERS.find(t=>t.id===powerId)!;
 const pool=NPC_TRUTH_GENERIC_TALENTS.filter(t=>t.name!=='Surpassement singulier'||skillValue>=15);
 const combinations:{ids:string[];cost:number}[]=[];
 for(let mask=0;mask<(1<<pool.length);mask++){
  const selected=pool.filter((_,i)=>mask&(1<<i)),cost=selected.reduce((sum,t)=>sum+t.cost,0);
  if(cost>=power.minPtv&&(power.maxPtv===null||cost<=power.maxPtv))combinations.push({ids:selected.map(t=>t.name),cost});
 }
 if(!combinations.length)throw Error('npc_truth_budget_unreachable');
 let hash=2166136261;for(const ch of seed)hash=Math.imul(hash^ch.charCodeAt(0),16777619);
 return combinations[(hash>>>0)%combinations.length];
}

// Truth stats are final values in R; the independent Reality tier never caps them.
export function generateNpcTruth(template:NpcData,natureId:string,powerId:string,archetypeId:string,seed:string):NpcTruth{
 const power=NPC_TRUTH_TIERS.find(t=>t.id===powerId),archetype=NPC_TRUTH_ARCHETYPES.find(t=>t.id===archetypeId);
 if(!power||!archetype||!NPC_TRUTH_NATURES.some(t=>t.id===natureId))throw Error('invalid_npc_generator');
 const skill=Object.entries(template.skills).sort((a,b)=>b[1]-a[1])[0]?.[0]||'';
 const second=Object.entries(template.skills).sort((a,b)=>b[1]-a[1]).find(([id,v])=>id!==skill&&v>=6)?.[0]||'';
 const selection=talentSelection(powerId,template.skills[skill],seed),talentIds=selection.ids;
 return {natureId,powerId,archetypeId,state:'revele',attributes:template.attributes,skills:template.skills,
  talentIds,ptv:selection.cost,
  specialtySkill:skill,secondSpecialtySkill:second,notes:'',abilities:NATURE_ABILITIES[natureId]||''};
}
