import type {TruthState,TruthTrait,TruthTalent} from './truth';
const prefix='aseryn_origines_jouables_seratheen_empreinte_sang_mele_';
export const aserynHeritageIds={atavism:prefix+'atavisme_marque',plural:prefix+'sang_pluriel',awaken:prefix+'heritage_eveille',mosaic:prefix+'mosaique_ancestrale'};
export const aserynOrigins=[{id:'aerilien',name:'Aérilienne'},{id:'mulien',name:'Mûlienne'},{id:'hyperboreen',name:'Hyperboréenne'},{id:'lemurian',name:'Lémurienne'}];
export const aserynElements=[{id:'air',name:'Air'},{id:'eau',name:'Eau'},{id:'terre',name:'Terre'},{id:'feu',name:'Feu'}];
const extraKeys=['aserynTrace1','aserynTrace2','aserynTrace3','aserynAtavism','aserynMosaic','aserynElement'];
const owns=(s:Pick<TruthState,'truthTalents'>,id:string)=>(s.truthTalents??[]).includes(id);
export function sanitizeAserynChoices(source:Record<string,unknown>):Record<string,string>{
  const result:Record<string,string>={};
  for(const key of extraKeys){const v=source[key];const valid=key==='aserynElement'?aserynElements:aserynOrigins;if(typeof v==='string'&&valid.some(o=>o.id===v))result[key]=v;}
  return result;
}
export function aserynTraces(state:TruthState):string[]{
  if(state.nature!=='aseryn'||state.choices.origin!=='seratheen')return [];
  const keys=owns(state,aserynHeritageIds.plural)?['aserynTrace1','aserynTrace2','aserynTrace3']:['aserynTrace1','aserynTrace2'];
  return [...new Set(keys.map(k=>String(state.choices[k]??'')).filter(v=>aserynOrigins.some(o=>o.id===v)))];
}
export function aserynFullSignatures(state:TruthState):string[]{
  if(state.nature!=='aseryn')return [];
  const origin=String(state.choices.origin??'');
  if(origin!=='seratheen')return aserynOrigins.some(o=>o.id===origin)?[origin]:[];
  const traces=aserynTraces(state),first=String(state.choices.aserynAtavism??''),second=String(state.choices.aserynMosaic??'');
  if(!owns(state,aserynHeritageIds.atavism)||!traces.includes(first))return [];
  return [first,...(owns(state,aserynHeritageIds.awaken)&&owns(state,aserynHeritageIds.mosaic)&&traces.includes(second)&&second!==first?[second]:[])];
}
export function aserynLearnableOrigins(state:TruthState):string[]{
  const origin=String(state.choices.origin??'');
  return origin==='seratheen'?(owns(state,aserynHeritageIds.awaken)?aserynFullSignatures(state):[]):aserynFullSignatures(state);
}
export function aserynChoiceFields(state:TruthState){
  const fields:Array<{key:string;label:string;options:Array<{id:string;name:string}>}>=[];
  if(state.nature!=='aseryn')return fields;
  if(state.choices.origin==='seratheen'){
    const traceKeys=['aserynTrace1','aserynTrace2',...(owns(state,aserynHeritageIds.plural)?['aserynTrace3']:[])];
    for(const [i,key] of traceKeys.entries()){
      fields.push({key,label:`Trace ancestrale ${i+1}`,options:aserynOrigins.filter(o=>!traceKeys.some(k=>k!==key&&state.choices[k]===o.id))});
    }
    const traces=aserynTraces(state);
    if(owns(state,aserynHeritageIds.atavism))fields.push({key:'aserynAtavism',label:'Atavisme marqué — première Signature',options:aserynOrigins.filter(o=>traces.includes(o.id))});
    if(owns(state,aserynHeritageIds.mosaic))fields.push({key:'aserynMosaic',label:'Mosaïque ancestrale — seconde Signature',options:aserynOrigins.filter(o=>traces.includes(o.id)&&o.id!==state.choices.aserynAtavism)});
  }
  if(state.choices.origin==='lemurian'||aserynTraces(state).includes('lemurian'))fields.push({key:'aserynElement',label:'Résonance élémentaire héritée',options:aserynElements});
  return fields;
}
export function aserynTalentEffect(talent:TruthTalent,state?:TruthState|null):string{
  const element=String(state?.choices.aserynElement??'');
  return talent.elementEffects?.[element]??talent.effect;
}
export function aserynSignatureTraits(state:TruthState):TruthTrait[]{
  if(state.nature!=='aseryn')return [];
  const full=aserynFullSignatures(state),partial=aserynTraces(state).filter(x=>!full.includes(x));
  const signatures:Record<string,string>={
    aerilien:'Ressent les manifestations magiques actives perceptibles ; Esprit + Perception affine l’analyse. +3 contre les conditions nocives d’une magie ambiante brute ou instable, pas contre les sorts ciblés.',
    mulien:'Pour 1 PA, envoie un mot, une image ou une intention mentale à courte portée à une cible consentante. +3 contre lecture forcée, intrusion télépathique et confusion psychique.',
    hyperboreen:' +3 contre fatigue physique, effort prolongé, froid naturel et conditions corporelles comparables ; pas de réduction des dégâts d’une attaque surnaturelle.',
    lemurian:`Ressent les manifestations de l’élément hérité (${aserynElements.find(e=>e.id===state.choices.aserynElement)?.name??'à choisir'}) et gagne +3 contre ses conditions naturelles ordinaires, sans réduction automatique des dégâts surnaturels.`
  };
  const traces:Record<string,string>={aerilien:'Pour 1 PA, Esprit + Perception permet de sentir une magie active directement perceptible.',mulien:'Une fois par scène, peut envoyer une Étincelle psychique simple à une cible consentante.',hyperboreen:'+3 contre renversement et déplacement physique forcé.',lemurian:'Ressent les manifestations significatives de l’élément choisi, sans pouvoir le manipuler.'};
  return [...full.map(id=>({name:'Signature '+aserynOrigins.find(o=>o.id===id)!.name,access:'SR/R',source:state.choices.origin==='seratheen'?'Ascendance éveillée — aucun bonus d’Attribut':'Origine',effect:signatures[id]})),...partial.map(id=>({name:'Trace '+aserynOrigins.find(o=>o.id===id)!.name,access:'SR/R',source:'Sang mêlé',effect:traces[id]}))];
}
