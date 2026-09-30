import {hunterDoctrines,normalizeHunterBuild} from '../../../api/src/rules/truth/hunter-build';
import type {TruthRulesPackage,TruthState,TruthTalent} from './truth';
export {hunterDoctrines,normalizeHunterBuild};
export function selectedHunterDoctrines(state:TruthState){
 const native=typeof state.choices.hunterTradition==='string'?state.choices.hunterTradition:'';
 if(state.mode==='creation')return state.nature==='humain'&&native&&native!=='aucune'?[native]:[];
 return [...new Set([...(native&&native!=='aucune'?[native]:[]),...normalizeHunterBuild(state.choices.hunterBuild).doctrines])].filter(id=>hunterDoctrines.some(d=>d.id===id)&&(id!=='lavandiere'||state.nature==='vampire'));
}
export function hunterTalentReady(pkg:TruthRulesPackage,state:TruthState,talent:TruthTalent,available:TruthTalent[],seen=new Set<string>()):boolean{
 if(seen.has(talent.id)||!available.some(t=>t.id===talent.id))return false;
 const path=new Set(seen).add(talent.id),owned=new Set(state.truthTalents),byId=new Map((pkg.catalogs.humain??[]).map(t=>[t.id,t]));
 const has=(id:string)=>owned.has(id)&&!!byId.get(id)&&hunterTalentReady(pkg,state,byId.get(id)!,available,path);
 return (talent.requiredTalentIds??[]).every(has)&&(!(talent.anyRequiredTalentIds?.length)||talent.anyRequiredTalentIds.some(has));
}
export function hunterBuildChoiceLabel(id:string){
 if(/rompu_aux_horreurs$/.test(id))return 'Familles rencontrées';
 if(/pacte_du_djinn$|lien_du_shikigami$|pacte_de_faveur$/.test(id))return 'Compagnon ou esprit lié';
 if(/possession_consentie$|incarnation_profonde$|souffle_emprunte$|manifestation_pretee$|forme_legendaire$|rite_de_la_maison$/.test(id))return 'Profil permanent';
 if(/arme_du_serment$|appel_de_l_arme$|interface_batarde$|relais_de_propriete$|prototype_unique$/.test(id))return 'Support réel et fonction';
 if(/cicatrice_revelatrice$|resonance_etrangere$|je_te_retrouverai$|serment_de_quete$|repertoire_xenologique$/.test(id))return 'Référence et engagement';
 return '';
}
