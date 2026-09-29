import {extralSheetDetails} from "./extral";
import {mageOwnedAffinities} from "./mage";
import {truthChoiceOptions,truthSelectedFreeTraits,truthAngelusCapacity,type TruthState,type TruthRulesPackage} from './truth';
import {aserynChoiceFields} from './aseryn';
export type TruthSheetDetail = {id:string;name:string;value:string;description?:string};
/** Common projection for all ten Natures; do not hard-code Vampire-only fields. */
export function truthSheetDetails(rules:TruthRulesPackage,state:TruthState,fortitude:number): TruthSheetDetail[] {
  const nature=rules.structure.natures[state.nature], result:TruthSheetDetail[]=[];
  const format=(v:unknown):string => typeof v==='string'?v:typeof v==='number'?String(v):typeof v==='boolean'?(v?'Oui':'Non'):Array.isArray(v)?v.map(format).filter(Boolean).join(', '):'';
  const known=new Set<string>();
  for(const choice of [...(nature?.choices??[]),...aserynChoiceFields(state).map(c=>({...c,optional:true}))]){
    known.add(choice.key);
    const selected=state.choices[choice.key];
    if(selected===undefined||selected===null||selected===''||selected==='aucune')continue;
    const options=truthChoiceOptions(choice,state.choices);
    const values=Array.isArray(selected)?selected:[selected];
    const names=values.map(value=>options.find(o=>o.id===value)?.name??format(value)).filter(Boolean);
    if(names.length)result.push({id:choice.key,name:choice.label,value:names.join(' · '),description:values.map(v=>options.find(o=>o.id===v)?.description).filter(Boolean).join('\n')});
  }
  // Old or custom saved choices are not silently discarded from the recap.
  for(const [key,value] of Object.entries(state.choices)){
    if(known.has(key)||value===null||value===undefined||value===''||value==='aucune')continue;
    const rendered=format(value);
    if(rendered)result.push({id:key,name:key.replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_',' '),value:rendered});
  }
  const capacity=truthAngelusCapacity(state,fortitude);
  if(capacity){result.push({id:'angelus-rank',name:'Rang céleste',value:capacity.rank==='cherub'?'Chérubin':'Angelus'},{id:'angelus-aura',name:'Aura maximale',value:String(capacity.maximum)});}
  if(state.nature==='mage'){
    const c=nature?.choices.find(c=>c.key==='dominantAffinity');
    const native=c?truthChoiceOptions(c,state.choices):[];
    const all=new Map([...(c?.options??[]),...Object.values(c?.optionsBy??{}).flat()].map(o=>[o.id,o]));
    const owned=mageOwnedAffinities(state);
    for(const id of new Set([...native.map(o=>o.id),...owned])){
      const has=(suffix:string)=>state.truthTalents.includes(`mage_${id}_${suffix}`);
      const mastery=has('mastery_magistrale')?'Magistrale':has('mastery_superieure')?'Supérieure':has('mastery_affinee')?'Affinée':owned.has(id)?'Initiale':'Dormante';
      const amplitude=has('amplitude_cataclysmique')?'Cataclysmique':has('amplitude_majeure')?'Majeure':has('amplitude_significative')?'Significative':owned.has(id)?'Mineure':'—';
      result.push({id:'affinity-'+id,name:all.get(id)?.name??id,value:`Maîtrise ${mastery} · Amplitude ${amplitude}${state.choices.dominantAffinity===id?' · Dominante':''}`});
    }
  }
  result.push(...extralSheetDetails(rules,state));
  return result;
}
export function truthFreeTraitDetails(rules:TruthRulesPackage,state:TruthState){
  return truthSelectedFreeTraits(rules,state).map((t,index)=>({id:`free-trait-${index}`,name:t.name,detail:t.effect,group:[t.source,t.access].filter(Boolean).join(' · ')}));
}
