import type {TruthState,TruthRulesPackage,TruthChoiceOption} from './truth';
import {mageTechniqueIds,mageTechniqueKinds,mageTechniqueNames,mageMasteries,mageAmplitudes,normalizeMageTechniques,mageTechniqueDefinitionIssues,type MageTechniqueKind,type MageTechnique} from '../../../api/src/rules/truth/mage-techniques';
export * from '../../../api/src/rules/truth/mage-techniques';
export const mageWheel=['kaharal','meldir','elinaeth','mestherak','discella'] as const;
export function mageAffinities(pkg:TruthRulesPackage):Array<TruthChoiceOption&{mageius:string}>{
  const choice=pkg.structure.natures.mage?.choices.find(c=>c.key==='dominantAffinity');
  return Object.entries(choice?.optionsBy??{}).flatMap(([mageius,options])=>options.map(o=>({...o,mageius})));
}
export function mageOwnedAffinities(state:Pick<TruthState,'choices'|'truthTalents'>):Set<string>{
  const owned=new Set<string>();
  if(typeof state.choices.dominantAffinity==='string'&&state.choices.dominantAffinity)owned.add(state.choices.dominantAffinity);
  for(const id of state.truthTalents){const m=id.match(/^mage_(?:awaken|accord|traversee)_(.+)$/);if(m)owned.add(m[1]);}
  return owned;
}
export function mageAffinityLevels(state:Pick<TruthState,'choices'|'truthTalents'>,affinity:string){
  const owned=mageOwnedAffinities(state).has(affinity);
  const rank=(kind:string,rows:readonly {id:string;name:string}[])=>owned?Math.max(0,...rows.map((r,i)=>state.truthTalents.includes(`mage_${affinity}_${kind}_${r.id}`)?i:0)):-1;
  return {owned,mastery:rank('mastery',mageMasteries),amplitude:rank('amplitude',mageAmplitudes)};
}
export function mageWheelDistance(a:string,b:string){
  const i=mageWheel.indexOf(a as typeof mageWheel[number]),j=mageWheel.indexOf(b as typeof mageWheel[number]);
  if(i<0||j<0)return Infinity;const d=Math.abs(i-j);return Math.min(d,mageWheel.length-d);
}
export function mageTechniqueIssues(pkg:TruthRulesPackage,state:TruthState,kind:MageTechniqueKind):string[]{
  const technique=normalizeMageTechniques(state.choices.mageTechniques)[kind];
  const affinities=mageAffinities(pkg),issues=mageTechniqueDefinitionIssues(kind,technique,new Set(affinities.map(a=>a.id)));
  if(!technique)return issues;
  if(kind==='work'){
    const dominant=String(state.choices.dominantAffinity??''),level=mageAffinityLevels(state,dominant);
    if(level.mastery<3||level.amplitude<2)issues.push('L’Affinité principale doit atteindre Maîtrise Magistrale et Amplitude Majeure.');
    if(!technique.requirements.some(r=>r.affinity===dominant))issues.push('Incluez l’Affinité principale dans l’Œuvre.');
  }
  for(const r of technique.requirements){
    const a=affinities.find(a=>a.id===r.affinity);if(!a)continue;
    const got=mageAffinityLevels(state,r.affinity);
    const mastery=mageMasteries.findIndex(x=>x.id===r.mastery),amplitude=mageAmplitudes.findIndex(x=>x.id===r.amplitude);
    if(kind==='echo'&&!got.owned){if(mastery>0||amplitude>0)issues.push(`${a.name} non éveillée : Écho limité à Initiale / Mineure.`);continue;}
    if(!got.owned)issues.push(`${a.name} doit être éveillée ; l’improvisation seule ne remplit pas ce prérequis.`);
    else {
      if(got.mastery<mastery)issues.push(`${a.name} : Maîtrise ${mageMasteries[mastery]?.name??''} requise.`);
      if(got.amplitude<amplitude)issues.push(`${a.name} : Amplitude ${mageAmplitudes[amplitude]?.name??''} requise.`);
    }
  }
  return [...new Set(issues)];
}
export type MageTechniqueView={kind:MageTechniqueKind;id:string;label:string;technique?:MageTechnique;requirementsText:string;issues:string[]};
export function mageTechniqueViews(pkg:TruthRulesPackage,state:TruthState):MageTechniqueView[]{
  if(state.nature!=='mage')return [];
  const techniques=normalizeMageTechniques(state.choices.mageTechniques),all=mageAffinities(pkg);
  return mageTechniqueKinds.filter(k=>state.truthTalents.includes(mageTechniqueIds[k])).map(kind=>({
    kind,id:mageTechniqueIds[kind],label:mageTechniqueNames[kind],technique:techniques[kind],issues:mageTechniqueIssues(pkg,state,kind),
    requirementsText:(techniques[kind]?.requirements??[]).map(r=>`${all.find(a=>a.id===r.affinity)?.name??r.affinity} : ${mageMasteries.find(m=>m.id===r.mastery)?.name??'Maîtrise à définir'} / ${mageAmplitudes.find(a=>a.id===r.amplitude)?.name??'Amplitude à définir'}`).join(' ; ')
  }));
}
