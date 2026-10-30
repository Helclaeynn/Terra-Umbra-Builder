import {truthAvailableTalents,truthPrerequisiteSatisfied,type TruthState,type TruthRulesPackage,type TruthTalent,type TruthTrait} from './truth';
import {normalizeAngelusBuild,angelusTalentIds as ids,angelusNatures,angelusSins,angelusConstructKinds,angelusConstructIssues} from '../../../api/src/rules/truth/angelus-build';
export * from '../../../api/src/rules/truth/angelus-build';
export const angelusConfig=(s:Pick<TruthState,'choices'>)=>normalizeAngelusBuild(s.choices.angelusBuild);
export function angelusPrimaryInvestment(pkg:TruthRulesPackage,s:TruthState):number{
 if(s.nature!=='angelus')return 0;
 const primary=angelusNatures.find(n=>n.id===s.choices.angelNature);if(!primary)return 0;
 const owned=new Set(s.truthTalents);
 return (pkg.catalogs.angelus??[]).filter(t=>owned.has(t.id)&&t.group===`Nature : ${primary.name}`).reduce((total,t)=>total+t.cost,0);
}
export function angelusAcquisitionIssues(pkg:TruthRulesPackage,s:TruthState,t:TruthTalent):string[]|null{
 if(s.nature!=='angelus')return null;
 const c=angelusConfig(s);
 if(t.id===ids.cherub)return [angelusPrimaryInvestment(pkg,s)<3?'Investissez au moins 3 PTV dans les talents de votre Nature primaire.':'',!c.secondaryNature||c.secondaryNature===s.choices.angelNature?'Choisissez une seconde Nature différente.':'',!c.transcendenceEvent.trim()?'Précisez l’événement de Transcendance à convenir avec le MJ.':''].filter(Boolean);
 if(t.id===ids.construct)return angelusConstructIssues(c.construct);
 return null;
}
export function angelusLearnedNatures(pkg:TruthRulesPackage,s:TruthState):string[]{
 if(s.nature!=='angelus')return [];
 const primary=String(s.choices.angelNature??''),c=angelusConfig(s),out=angelusNatures.some(n=>n.id===primary)?[primary]:[];
 const cherub=(pkg.catalogs.angelus??[]).find(t=>t.id===ids.cherub);
 if(s.truthTalents.includes(ids.cherub)&&cherub&&angelusAcquisitionIssues(pkg,s,cherub)?.length===0)out.push(c.secondaryNature);
 return out;
}
export function angelusSecondaryTraits(pkg:TruthRulesPackage,s:TruthState):TruthTrait[]{
 const second=angelusLearnedNatures(pkg,s).filter(n=>n!==s.choices.angelNature);
 return (pkg.structure.natures.angelus?.freeTraitRules??[]).filter(r=>Object.keys(r.when).length===1&&second.includes(String(r.when.angelNature??''))).flatMap(r=>r.traits.map(t=>({...t,source:'Pouvoir fondamental de seconde Nature — '+angelusNatures.find(n=>n.id===r.when.angelNature)?.name})));
}
export function angelusUnavailableAcquisitions(pkg:TruthRulesPackage,s:TruthState):string[]{
 if(s.nature!=='angelus')return [];
 let usable=[...s.truthTalents];
 for(let n=0;n<=s.truthTalents.length;n++){
  const current={...s,truthTalents:usable},available=truthAvailableTalents(pkg,current),index=new Map(available.map(t=>[t.id,t]));
  const next=usable.filter(id=>{const t=index.get(id);return !!t&&truthPrerequisiteSatisfied(pkg,current,t,available);});
  if(next.length===usable.length)break;usable=next;
 }
 const names=new Map(Object.values(pkg.catalogs).flat().map(t=>[t.id,t.name]));
 return s.truthTalents.filter(id=>!usable.includes(id)).map(id=>names.get(id)||id);
}
export type AngelusSheetEntry={id:string;title:string;body:string;parameters:Array<{label:string;value:string}>;issues:string[]};
export function angelusSheetEntries(pkg:TruthRulesPackage,s:TruthState):AngelusSheetEntry[]{
 if(s.nature!=='angelus')return [];
 const c=angelusConfig(s),entries:AngelusSheetEntry[]=[],owns=(id:string)=>s.truthTalents.includes(id);
 const add=(id:string,title:string,body:string,parameters:AngelusSheetEntry['parameters']=[],issues:string[]=[])=>entries.push({id,title,body,parameters,issues});
 if(owns(ids.cherub))add('cherub','Transcendance chérubique',`Seconde Nature : ${angelusNatures.find(n=>n.id===c.secondaryNature)?.name||'À choisir'}.`,[{label:'Événement narratif',value:c.transcendenceEvent},{label:'Investissement primaire',value:`${angelusPrimaryInvestment(pkg,s)} PTV (3 requis)`},{label:'Rang',value:'Deux paires d’ailes, +1 Agilité au total ; bonus/plafond d’Aura de rang +2. Ni seconde Sephira ni nouvel Archange.'}],angelusAcquisitionIssues(pkg,s,{id:ids.cherub} as TruthTalent)||[]);
 if(owns(ids.liaison))add('liaison','Liaison céleste','1 PA · 1 Aura · scène — messages volontaires entre deux Angelus connus, consentants et reliés à l’Arbre sur le même monde, quelle que soit la distance.',[{label:'Interlocuteur de référence',value:c.liaisonContact||'À convenir en partie'},{label:'Limites',value:'Ni lecture mentale, partage des sens, transfert d’Aura ou voyage dans l’Arbre.'}]);
 if(owns(ids.sin)){
  add('sins','Châtiment capital — les sept Péchés','2 PA · 3 Aura · 1/scène — sur soi ou un allié consentant, pour la scène, à partir de la ressource réellement absorbée ; avantages et contreparties disparaissent ensemble lors d’une Purification.',angelusSins.map(sin=>({label:sin.name+(sin.id===c.preferredSin?' — variante préparée':''),value:sin.effect+(sin.id==='envie'&&c.observedSkill?` Compétence observée préparée : ${c.observedSkill}.`:'')})));
 }
 if(angelusLearnedNatures(pkg,s).includes('domination'))add('blade','Lame céleste — forme préparée',`${c.bladeForm==='ranged'?'Arme de tir':'Arme de mêlée'} · ${c.bladeSacrifice} PV sacrifiés · DGT ${[0,7,9,11][c.bladeSacrifice]}.`,[{label:'Activation',value:'R · 1 PA · 1 Aura · une seule Lame pour la scène'},{label:'Sacrifice',value:'Les PV sacrifiés réduisent le maximum et ne peuvent être soignés tant que la Lame existe ; impossible de sacrifier sous 1 PV.'},{label:'Usage',value:'Compétence de la forme choisie, attaques payantes ; aucune munition ordinaire nécessaire.'}]);
 if(owns(ids.shape))add('shape','Idée incarnée — forme préparée',c.shapeDescription||'À définir en partie.',[{label:'Profil',value:'1 PA · 2 Aura · scène · 3 m maximum · charge 200 kg · 6 PV · Armure 0'},{label:'Limites',value:'Une fonction simple et des ancrages cohérents ; aucun déplacement gratuit de charge ni attaque autonome.'}]);
 if(owns(ids.construct))add('construct','Rêve rendu réel — '+(c.construct.name||'À définir'),c.construct.purpose,[{label:'Fonction',value:angelusConstructKinds.find(k=>k.id===c.construct.kind)?.name||'À choisir'},{label:'Profil',value:'2 PA · 3 Aura · 1/scène · 10 PV · Armure 3 · taille humaine · contrôle à 30 m · un seul auxiliaire'},{label:'Actions',value:'PA et Compétences du créateur ; Déplacement normal, sans vol implicite. Porteur : charge 200 kg.'},{label:'Limites convenues',value:c.construct.limits}],angelusConstructIssues(c.construct));
 if(c.heartLink)add('link','Lien affectif de référence',c.heartLink,[{label:'Statut',value:'Description uniquement ; chaque talent de lien conserve ses prérequis, portée, consentement et cadence.'}]);
 const unavailable=angelusUnavailableAcquisitions(pkg,s);if(unavailable.length)add('unavailable','Acquisitions à régulariser','Les talents restent enregistrés et comptés en PTV, mais leurs conditions actuelles ne permettent pas leur utilisation.',[],unavailable);
 return entries;
}
