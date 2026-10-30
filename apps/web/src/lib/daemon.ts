import {truthAvailableTalents,truthPrerequisiteSatisfied,truthKnownTalents,type TruthState,type TruthRulesPackage,type TruthTalent,type TruthTrait} from './truth';
import {mageAffinities} from './mage';
import {normalizeDaemonBuild,daemonTalentIds as ids,daemonFunctions,daemonFormProperties,daemonDefinitionIssues,daemonPathologyIssues,type DaemonBuild} from '../../../api/src/rules/truth/daemon-build';
export * from '../../../api/src/rules/truth/daemon-build';
export function daemonConfig(state:Pick<TruthState,'choices'>){return normalizeDaemonBuild(state.choices.daemonBuild);}
export function daemonLearnedFunctions(state:TruthState):string[]{
 if(state.nature!=='daemon')return [];
 const primary=String(state.choices.function??''),c=daemonConfig(state),out=daemonFunctions.some(f=>f.id===primary)?[primary]:[];
 if(state.truthTalents.includes(ids.formation)&&c.secondaryMentor.trim()&&c.secondaryFunction&&c.secondaryFunction!==primary)out.push(c.secondaryFunction);
 return out;
}
export function daemonAdditionalTalents(pkg:TruthRulesPackage):TruthTalent[]{
 const rows=pkg.catalogs.daemon??[];
 return ([[ids.affined,ids.secondAffined,'Spectre affiné — second Spectre'],[ids.amplified,ids.secondAmplified,'Spectre amplifié — second Spectre']] as const).flatMap(([base,id,name])=>{
  const t=rows.find(t=>t.id===base);return t?[{...t,id,name,prerequisite:ids.polyphony,prerequisiteName:'Polyphonie occulte — seconde Affinité différente définie',effect:t.effect,effectDetails:(t.effectDetails||t.effect)+'\n\nCet achat améliore seulement le second Spectre, pas le premier.'}]:[];
 });
}
/** Return null for ordinary talents so the shared prerequisite engine remains authoritative. */
export function daemonAcquisitionIssues(pkg:TruthRulesPackage,state:TruthState,talent:TruthTalent):string[]|null{
 if(state.nature!=='daemon')return null;
 const c=daemonConfig(state),all=new Set(mageAffinities(pkg).map(a=>a.id));
 switch(talent.id){
  case ids.formation:return [!c.secondaryFunction||c.secondaryFunction===state.choices.function?'Choisissez une autre Fonction.':'',!c.secondaryMentor.trim()?'Précisez le mentor et l’apprentissage ; accord narratif à convenir avec le MJ.':''].filter(Boolean);
  case ids.affined:case ids.amplified:return state.choices.divinity==='mephisto'&&all.has(c.spectralAffinity)?[]:['Choisissez votre première Affinité spectrale de Méphisto.'];
  case ids.polyphony:return state.choices.divinity==='mephisto'&&all.has(c.spectralAffinity)&&all.has(c.secondSpectralAffinity)&&c.spectralAffinity!==c.secondSpectralAffinity?[]:['Définissez deux Affinités spectrales différentes.'];
  case ids.secondAffined:case ids.secondAmplified:return state.truthTalents.includes(ids.polyphony)?daemonAcquisitionIssues(pkg,state,{...talent,id:ids.polyphony}):['Polyphonie occulte requise.'];
  case ids.form:return state.choices.divinity==='belzebuth'&&c.formProperties.length?[]:['Choisissez le répertoire de Forme supérieure avant l’achat.'];
  case ids.ritual:return state.choices.divinity==='morrighan'&&c.riteDomain&&c.rites.length&&c.rites.every(r=>!daemonDefinitionIssues(r).length)?[]:['Définissez le domaine étroit et au moins un rite complet avec le MJ.'];
  case ids.remanence:return [...(state.choices.soulOrigin==='ancien_prophete'?[]:['Réservé à l’origine Ancien Prophète, avec accord MJ.']),...daemonDefinitionIssues(c.remanence)];
  default:return null;
 }
}
export function daemonSecondaryTraits(pkg:TruthRulesPackage,state:TruthState):TruthTrait[]{
 const secondary=daemonLearnedFunctions(state).filter(f=>f!==state.choices.function);
 return (pkg.structure.natures.daemon?.freeTraitRules??[]).filter(r=>secondary.includes(String(r.when.function??''))&&Object.keys(r.when).length===1).flatMap(r=>r.traits.map(t=>({...t,source:'Empreinte de Fonction secondaire — '+daemonFunctions.find(f=>f.id===r.when.function)?.name})));
}
/** Keep paid history, but explicitly mark unusable acquisitions (including dependent chains). */
export function daemonUnavailableAcquisitions(pkg:TruthRulesPackage,state:TruthState):string[]{
 if(state.nature!=='daemon')return [];
 let usable=[...state.truthTalents];
 for(let i=0;i<=state.truthTalents.length;i++){
  const current={...state,truthTalents:usable},available=truthAvailableTalents(pkg,current),byId=new Map(available.map(t=>[t.id,t]));
  const next=usable.filter(id=>{const t=byId.get(id);return !!t&&truthPrerequisiteSatisfied(pkg,current,t,available);});
  if(next.length===usable.length)break;usable=next;
 }
 const names=new Map(truthKnownTalents(pkg,state).map(t=>[t.id,t.name]));
 return state.truthTalents.filter(id=>!usable.includes(id)).map(id=>names.get(id)||id);
}
export type DaemonSheetEntry={id:string;title:string;body:string;parameters:Array<{label:string;value:string}>;issues:string[]};
export function daemonSheetEntries(pkg:TruthRulesPackage,state:TruthState):DaemonSheetEntry[]{
 if(state.nature!=='daemon')return [];
 const c=daemonConfig(state),out:DaemonSheetEntry[]=[],owned=(id:string)=>state.truthTalents.includes(id),all=mageAffinities(pkg),lookup=(id:string)=>(pkg.catalogs.daemon??[]).find(t=>t.id===id),issues=(id:string)=>{const t=lookup(id);return t?daemonAcquisitionIssues(pkg,state,t)||[]:[];};
 const add=(id:string,title:string,body:string,parameters:DaemonSheetEntry['parameters']=[],warnings:string[]=[])=>out.push({id,title,body,parameters,issues:warnings});
 if(owned(ids.formation))add('secondary','Fonction secondaire',daemonFunctions.find(f=>f.id===c.secondaryFunction)?.name||'À choisir',[{label:'Mentor et apprentissage',value:c.secondaryMentor||'À préciser'},{label:'Portée',value:'Empreinte de la seconde Fonction et accès à ses talents ; ni seconde Divinité ni seconde Faveur.'}],issues(ids.formation));
 if(state.choices.divinity==='mephisto'){
  for(const [slot,id,masteryId,amplitudeId] of [['primary',c.spectralAffinity,ids.affined,ids.amplified],['secondary',c.secondSpectralAffinity,ids.secondAffined,ids.secondAmplified]] as const){
   if(slot==='secondary'&&!owned(ids.polyphony))continue;
   const valid=all.some(a=>a.id===id)&&(slot==='primary'||id!==c.spectralAffinity);
   add('spectrum-'+slot,slot==='primary'?'Spectre de Mageius':'Second Spectre de Mageius',all.find(a=>a.id===id)?.name||'Affinité à choisir',[
    {label:'Maîtrise · Amplitude',value:`${owned(masteryId)?'Affinée':'Initiale'} / ${owned(amplitudeId)?'Significative':'Mineure'}`},
    {label:'Moteur',value:'Volonté + Maîtrise spirituelle ; PA, portée et Défenses normaux, sans Tension ni Revers.'},
    {label:'Limites',value:'Plafond Affinée / Significative par Spectre ; ni Roue, Écho, Œuvre ou Volonté supérieure.'}
   ],valid?[]:['Choix manquant ou identique à l’autre Spectre : compléter avant utilisation, achat conservé.']);
  }
 }
 if(owned(ids.form))add('form','Répertoire — Forme supérieure','À l’activation : 2 PA, jusqu’à deux propriétés pour la scène ; aucune propriété n’est activée automatiquement par la fiche.',c.formProperties.map(id=>{const p=daemonFormProperties.find(p=>p.id===id)!;return {label:p.name,value:p.effect};}),issues(ids.form));
 if(owned(ids.ritual)){
  const rows=c.rites.length?c.rites:[null];
  rows.forEach((r,i)=>add('rite-'+i,'Sorcellerie des Corneilles — '+(r?.name||'À définir'),r?.effect||'',[
   {label:'Domaine',value:c.riteDomain||'À définir'},{label:'Préparation et échelle',value:'10 minutes · difficulté de base 15 · usages Initials / Mineurs'},
   ...(r?[{label:'PA · Portée · Cadence',value:`${r.pa??'À définir'} PA · ${r.range} · ${r.frequency}`},{label:'Durée et opposition',value:r.duration+' · '+r.resistance},{label:'Source et limites',value:r.source+' · '+r.limits}]:[])
  ],r?daemonDefinitionIssues(r):['Rite à définir avant utilisation.']));
 }
 const kinds=[['disease',ids.disease],['contagion',ids.contagion],['pestilence',ids.pestilence]] as const;
 for(const [kind,id] of kinds)if(owned(id)){
  const rows=c.pathologies.filter(p=>p.kind===kind);
  if(!rows.length)add('pathology-'+kind,lookup(id)?.name||kind,'Profil de pathologie à définir avant usage.',[],['Symptômes, malus, durée, résistance et soins manquants.']);
  rows.forEach((p,i)=>add('pathology-'+kind+'-'+i,(lookup(id)?.name||kind)+' — '+(p.name||'À définir'),p.symptoms,[{label:'Malus',value:p.penalty},{label:'Durée',value:p.duration},{label:'Transmission · Incubation',value:p.transmission+' · '+p.incubation},{label:'Résistance',value:p.resistance},{label:'Soins / fin',value:p.cure}],daemonPathologyIssues(p)));
 }
 if(owned(ids.remanence)){
  const r=c.remanence;add('remanence','Rémanence prophétique — '+(r.name||'À définir'),r.effect,[{label:'Ancien Attribut / histoire',value:r.source},{label:'PA · Portée · Cadence',value:`${r.pa??'À définir'} PA · ${r.range} · ${r.frequency}`},{label:'Durée · Résistance',value:r.duration+' · '+r.resistance},{label:'Conditions et limites',value:r.limits},{label:'Origine rare',value:'Accord MJ nécessaire ; aucun Attribut cosmique, prière ou statut de Prophète actuel.'}],issues(ids.remanence));
 }
 const unavailable=daemonUnavailableAcquisitions(pkg,state);
 if(unavailable.length)add('unavailable','Acquisitions à régulariser','Les achats et leurs PTV restent enregistrés, mais ces talents ne sont pas utilisables avec les choix ou prérequis actuels.',[],unavailable);
 return out;
}
