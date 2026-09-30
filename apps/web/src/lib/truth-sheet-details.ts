import {normalizeHunterBuild,selectedHunterDoctrines,hunterDoctrines} from "./hunter";
import {normalizeVampireBuild,vampireNativeBlood,vampireAwakenedBloods,vampireBloodOptions,vampireUnavailable,vampireWeaponProfiles} from "./vampire";
import {isKhinae,khinaeNativeBlood,khinaeAwakenedBloods,khinaeBloodOptions,khinaeUnavailable} from "./khinae";
import {exileSheetDetails,beneficiarySheetDetails} from "./exile";
import {extralSheetDetails} from "./extral";
import {mageOwnedAffinities} from "./mage";
import {truthUnavailableHunters,truthChoiceOptions,truthSelectedFreeTraits,truthAngelusCapacity,type TruthState,type TruthRulesPackage} from './truth';
import {aserynChoiceFields} from './aseryn';
export type TruthSheetDetail = {id:string;name:string;value:string;description?:string};
/** Common projection for all ten Natures; do not hard-code Vampire-only fields. */
export function truthSheetDetails(rules:TruthRulesPackage,state:TruthState,fortitude:number): TruthSheetDetail[] {
  const nature=rules.structure.natures[state.nature], result:TruthSheetDetail[]=[];
  const format=(v:unknown):string => typeof v==='string'?v:typeof v==='number'?String(v):typeof v==='boolean'?(v?'Oui':'Non'):Array.isArray(v)?v.map(format).filter(Boolean).join(', '):'';
  const known=new Set<string>();
  for(const choice of [...(nature?.choices??[]),...aserynChoiceFields(state).map(c=>({...c,optional:true}))]){
    known.add(choice.key);
    const selected=isKhinae(state)&&choice.key==='blood'?khinaeNativeBlood(state):state.nature==='vampire'&&choice.key==='blood'?vampireNativeBlood(state):state.choices[choice.key];
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
  if(isKhinae(state)){
    const opts=khinaeBloodOptions(rules,state),bloods=khinaeAwakenedBloods(rules,state);
    result.push({id:'khinae-bloods',name:'Sangs éveillés — ordre d’acquisition',value:bloods.map((b,i)=>(opts.find(o=>o.id===b)?.name??b)+(i?' · éveil acheté 3 PTV':' · natif')).join(' → ')});
    const invalid=khinaeUnavailable(rules,state);if(invalid.length)result.push({id:'khinae-unavailable',name:'Acquisitions conservées, indisponibles',value:invalid.map(id=>rules.catalogs[state.nature]?.find(t=>t.id===id)?.name??id).join(' · ')});
  }
  if(state.nature==='vampire'){
    const opts=vampireBloodOptions(rules),bloods=vampireAwakenedBloods(rules,state),b=normalizeVampireBuild(state.choices.vampireBuild);
    result.push({id:'vampire-bloods',name:'Sangs éveillés — ordre d’acquisition',value:bloods.map((id,i)=>(opts.find(o=>o.id===id)?.name??id)+(i?' · éveil 3 PTV':' · natif')).join(' → ')});
    const unavailable=vampireUnavailable(rules,state);if(unavailable.length)result.push({id:'vampire-unavailable',name:'Acquisitions conservées et payées, indisponibles',value:unavailable.map(id=>rules.catalogs.vampire?.find(t=>t.id===id)?.name??id).join(' · ')});
    if(b.forms.length)result.push({id:'vampire-forms',name:'Répertoire animal',value:b.forms.map((f,i)=>f.name+' · '+f.role+' · référence '+f.articleId+(i>0&&!state.truthTalents.includes('menagerie')?' · indisponible sans Ménagerie':'')).join(' ; '),description:'Profil de l’animal de référence : mobilité, sens, taille et attaque naturelle remplacés ; aucun Attribut supplémentaire ni soin.'});
    if(state.truthTalents.includes('arme_hematique'))result.push({id:'vampire-weapons',name:'Armes hématiques',value:vampireWeaponProfiles.map(p=>p.name+' : '+p.effect).join(' ; ')});
    if(b.deimon.name||b.deimon.reference)result.push({id:'vampire-deimon',name:'Deimon lié — PNJ existant',value:[b.deimon.name,b.deimon.reference,b.deimon.obligations].filter(Boolean).join(' · ')});
    if(b.anchor.container||b.anchor.location||b.anchor.practitioner||b.anchor.notes)result.push({id:'vampire-anchor',name:'Ancrage de Sang préservé',value:[b.anchor.container,b.anchor.location,b.anchor.practitioner,b.anchor.notes].filter(Boolean).join(' · '),description:'3 PV sacrifiés tant que l’ancrage subsiste ; retour en 24 h dans le corps réparable, à 1 PV en Stase ; ancrage consommé.'});
  }
  const unavailableHunters=truthUnavailableHunters(rules,state);
  if(unavailableHunters.length)result.push({id:'hunter-unavailable',name:'Talents de Chasse conservés et payés, indisponibles',value:unavailableHunters.map(id=>rules.catalogs.humain?.find(t=>t.id===id)?.name??id).join(' · ')});
  const hunter=normalizeHunterBuild(state.choices.hunterBuild),doctrines=selectedHunterDoctrines(state);
  if(doctrines.length)result.push({id:'hunter-doctrines',name:'Doctrines de Chasse choisies',value:doctrines.map(id=>hunterDoctrines.find(d=>d.id===id)?.name??id).join(' · ')});
  for(const [id,r] of Object.entries(hunter.records))if(state.truthTalents.includes(id))result.push({id:'hunter-'+id,name:rules.catalogs.humain?.find(t=>t.id===id)?.name??id,value:[r.reference,r.agreement,r.profile,r.limits].filter(Boolean).join(' · ')});
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
  result.push(...extralSheetDetails(rules,state),...exileSheetDetails(rules,state),...beneficiarySheetDetails(state));
  return result;
}
export function truthFreeTraitDetails(rules:TruthRulesPackage,state:TruthState){
  return truthSelectedFreeTraits(rules,state).map((t,index)=>({id:`free-trait-${index}`,name:t.name,detail:t.effect,group:[t.source,t.access].filter(Boolean).join(' · ')}));
}
