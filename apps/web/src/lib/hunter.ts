import {hunterDoctrines,normalizeHunterBuild} from '../../../api/src/rules/truth/hunter-build';
import type {TruthRulesPackage,TruthState,TruthTalent} from './truth';
export {hunterDoctrines,normalizeHunterBuild};
export function selectedHunterDoctrines(state:Pick<TruthState,"nature"|"choices"|"mode">){
 const native=typeof state.choices.hunterTradition==='string'?state.choices.hunterTradition:'';
 if(state.mode==='creation')return state.nature==='humain'&&native&&native!=='aucune'?[native]:[];
 return [...new Set([...(native&&native!=='aucune'?[native]:[]),...normalizeHunterBuild(state.choices.hunterBuild).doctrines])].filter(id=>(id===native||hunterDoctrines.some(d=>d.id===id))&&(id!=='lavandiere'||state.nature==='vampire'));
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
 if(/possession_consentie$|incarnation_profonde$|souffle_emprunte$|manifestation_pretee$|forme_du_chevalier$|rite_de_la_maison$/.test(id))return 'Profil permanent';
 if(/arme_du_serment$|appel_de_larme$|interface_batarde$|relais_de_propriete$|prototype_unique$|arme_heritee$|meme_selle_meme_destin$/.test(id))return 'Support réel et fonction';
 if(/cicatrice_revelatrice$|resonance_etrangere$|je_te_retrouverai$|serment_de_quete$|signature_impossible$|odeur_du_semblable$|resonance_parfaite$/.test(id))return 'Référence et engagement';
 return '';
}

/** Closed profiles approved for talents whose function is chosen permanently. */
export function hunterProfileOptions(id:string):string[]{
 if(id.endsWith('manifestation_pretee'))return ['Attaque : DGT 7 à 10 m contre la Défense adaptée · 2 PA · 1/scène','Poussée : 3 m sur opposition · 2 PA · 1/scène','Manipulation : 1 litre à 10 m · 2 PA · 1/scène','Protection : 3 contre un vecteur précis pendant un round · 2 PA · 1/scène'];
 if(id.endsWith('forme_du_chevalier'))return ['Interception : réaction 1 PA, à 10 m · 1/scène','Ouverture de seuil : 2 PA au contact, sur opposition · 1/scène','Verrou de fuite : 1 PA à 10 m, sur opposition · 1/scène'];
 if(id.endsWith('rite_de_la_maison'))return ['Seuil : ouverture de 3 m','Détection : portée 10 m','Blocage de régénération : un round','Refuge : rayon 3 m'];
 return [];
}
