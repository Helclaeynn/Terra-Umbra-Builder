import {truthCoreRules} from './truth/core-rules.js';
import {liveTruthState,truthPowers,powerAllowed,usableKhinaeTalent,liveBody} from './play-truth.js';
import type {PlayState} from './play-state.js';

// Explicit handlers: effect prose remains visible, but is never executed as code.
export const defenseMechanics=[
 {id:'extral-reflexe-de-chasse',nature:'extral',name:'Réflexe de chasse',cost:0,bonus:0,surprise:false,limit:'round'},
 {id:'extral-reflexe-conditionne',nature:'extral',name:'Réflexe conditionné',cost:0,bonus:3,surprise:true,limit:'scene'},
 {id:'vitesse_impossible',nature:'garou',name:'Vitesse impossible',cost:0,bonus:0,surprise:true,limit:'round'},
 {id:'khinae_blood_vitesse_impossible',nature:'khinae',name:'Vitesse impossible',cost:0,bonus:0,surprise:true,limit:'round'}
] as const;
export const cycleId='extral-cycle-de-reparation',reserveId='extral-reserve-nanitique';
export const dedicatedPowerIds=new Set<string>([...defenseMechanics.map(p=>p.id),cycleId,reserveId]);
export function usableLiveTalent(data:any,state:Pick<PlayState,'revelation'>,id:string){
 const t=liveTruthState(data),entry=(truthCoreRules.catalogs as Record<string,readonly any[]>)[t.nature]?.find(p=>p.id===id);
 if(!entry||!t.truthTalents.includes(id)||t.consciousness==='profane')return false;
 if(['garou','khinae'].includes(t.nature)&&!usableKhinaeTalent(data,id.replace(/^khinae_blood_/,'')))return false;
 if(entry.when&&!Object.entries(entry.when).every(([k,v])=>Array.isArray(v)?v.includes(t.choices[k]):v===t.choices[k]))return false;
 const rule=truthPowers(data).find(p=>p.id===id);return !!rule&&powerAllowed(rule,state.revelation);
}
export const usageKey=(limit:string,id:string)=>`${limit}:${id}`;
export const used=(state:PlayState,limit:string,id:string)=>(state.powerUses?.[usageKey(limit,id)]??0)>0;
export function consumeUsage(state:PlayState,limit:string,id:string){state.powerUses??={};state.powerUses[usageKey(limit,id)]=(state.powerUses[usageKey(limit,id)]??0)+1;}
export function defenseOptions(data:any,state:PlayState,attack:{damageType:string;surprise:boolean},canReact:boolean){
 if(['occulte','neuro'].includes(attack.damageType))return [];
 return defenseMechanics.filter(p=>p.nature===data.truth?.nature&&usableLiveTalent(data,state,p.id)).map(p=>({...p,used:used(state,p.limit,p.id),available:canReact&&!used(state,p.limit,p.id)&&(!attack.surprise||p.surprise)}));
}
export function hourlyRecovery(data:any,state:PlayState){const body=liveBody(data,state);return body&&body.form!=='hybrid'?body.recovery:0;}
export function naniteStatus(data:any,state:PlayState){
 return {cycle:usableLiveTalent(data,state,cycleId),cycleUsed:used(state,'scenario',cycleId),reserve:usableLiveTalent(data,state,reserveId),reserveUsed:used(state,'scenario',reserveId),functional:state.swarmFunctional!==false};
}
/** Called only for a real external heal, never rest, regeneration, Grace or Cycle. */
export function reserveHealing(data:any,state:PlayState,hp:number,maximum:number,baseHeal:number){
 const status=naniteStatus(data,state);
 if(baseHeal<=0||hp>=maximum||!status.reserve||status.reserveUsed||!status.functional)return 0;
 consumeUsage(state,'scenario',reserveId);return Math.min(3,Math.max(0,maximum-hp-baseHeal));
}
export function resetLivePeriod(state:PlayState,period:'scene'|'scenario'){
 state.powers=[];state.mueBlocked=false;
 state.powerUses=Object.fromEntries(Object.entries(state.powerUses??{}).filter(([k])=>period==='scene'&&!k.startsWith('scene:')&&!k.startsWith('round:')));
}
