// Saved Daemon options are descriptions, never GM authorization or permanent statistic grants.
export const daemonTalentIds = {
  "formation": "daemon_clean_fonctions_daemoniaques_formation_secondaire_formation_secondaire",
  "affined": "mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_spectre_affine",
  "amplified": "mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_spectre_amplifie",
  "polyphony": "mephisto_l_occulte_la_parole_et_le_hasard_facette_magie_polyphonie_occulte",
  "form": "belzebuth_la_vie_sans_jugement_moral_facette_nature_evolution_forme_superieure",
  "ritual": "morrighan_la_corneille_etrangere_facette_royaute_magie_sorcellerie_des_corneilles",
  "disease": "daemon_clean_chatiment_tourmenteur_affliction_maladie_sacree",
  "contagion": "belzebuth_la_vie_sans_jugement_moral_facette_maladie_contagion",
  "pestilence": "belzebuth_la_vie_sans_jugement_moral_facette_maladie_pestilence",
  "miasma": "belzebuth_la_vie_sans_jugement_moral_facette_maladie_miasme",
  "remanence": "daemon_origine_ancien_prophete_remanence_prophetique",
  "secondAffined": "daemon_spectral_second_mastery_affinee",
  "secondAmplified": "daemon_spectral_second_amplitude_significative"
} as const;
export const daemonFunctions = [{id:'oracle',name:'Oracle / Tentateur'},{id:'tourmenteur',name:'Châtiment / Tourmenteur'},{id:'legionnaire',name:'Chevalier / Légionnaire'}] as const;
export const daemonFormProperties = [
 {id:'flight',name:'Vol soutenu',effect:'Vol soutenu au Déplacement normal ; les déplacements coûtent leurs PA normaux.'},
 {id:'armour',name:'Armure corporelle 3',effect:'Armure corporelle 3 ; conserver la meilleure Armure corporelle, sans addition de deux sources corporelles.'},
 {id:'weapon',name:'Arme naturelle DGT 7',effect:'Une arme naturelle inflige DGT 7 ; ses attaques coûtent leurs PA normaux.'},
 {id:'amphibian',name:'Corps amphibie des profondeurs',effect:'Corps adapté à la respiration et au milieu aquatiques des profondeurs ; aucune action supplémentaire.'}
] as const;
export const daemonRiteDomains = [{id:'sang',name:'Sang'},{id:'presage',name:'Présages'},{id:'morts',name:'Morts'},{id:'corvides',name:'Corvidés'},{id:'bataille',name:'Bataille'}] as const;
export const daemonPathologyKinds=[{id:'disease',name:'Maladie sacrée'},{id:'contagion',name:'Contagion'},{id:'pestilence',name:'Pestilence'}] as const;
export type DaemonDefinition={name:string;effect:string;source:string;pa:number|null;range:string;frequency:string;duration:string;resistance:string;limits:string};
export type DaemonPathology={kind:string;name:string;symptoms:string;penalty:string;duration:string;transmission:string;incubation:string;resistance:string;cure:string};
export type DaemonBuild={secondaryFunction:string;secondaryMentor:string;spectralAffinity:string;secondSpectralAffinity:string;formProperties:string[];riteDomain:string;rites:DaemonDefinition[];pathologies:DaemonPathology[];remanence:DaemonDefinition};
const record=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const text=(v:unknown,max=300)=>typeof v==='string'?v.replace(/\u0000/g,'').slice(0,max):'';
const id=(v:unknown)=>text(v,80).replace(/[^a-z0-9_]/g,'');
const integer=(v:unknown):number|null=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0&&v<=100?v:null;
export function normalizeDaemonDefinition(value:unknown):DaemonDefinition{const r=record(value);return {name:text(r.name,160),effect:text(r.effect,2000),source:text(r.source,400),pa:integer(r.pa),range:text(r.range),frequency:text(r.frequency),duration:text(r.duration),resistance:text(r.resistance,800),limits:text(r.limits,1000)};}
export function normalizeDaemonBuild(value:unknown):DaemonBuild{
 const r=record(value);
 return {secondaryFunction:daemonFunctions.some(f=>f.id===r.secondaryFunction)?String(r.secondaryFunction):'',secondaryMentor:text(r.secondaryMentor,400),spectralAffinity:id(r.spectralAffinity),secondSpectralAffinity:id(r.secondSpectralAffinity),
  formProperties:[...new Set((Array.isArray(r.formProperties)?r.formProperties:[]).filter((v):v is string=>daemonFormProperties.some(p=>p.id===v)))],
  riteDomain:daemonRiteDomains.some(d=>d.id===r.riteDomain)?String(r.riteDomain):'',
  rites:(Array.isArray(r.rites)?r.rites:[]).slice(0,8).map(normalizeDaemonDefinition),
  pathologies:(Array.isArray(r.pathologies)?r.pathologies:[]).slice(0,6).map(raw=>{const p=record(raw);return {kind:daemonPathologyKinds.some(k=>k.id===p.kind)?String(p.kind):'',name:text(p.name,160),symptoms:text(p.symptoms,1000),penalty:text(p.penalty,600),duration:text(p.duration),transmission:text(p.transmission,400),incubation:text(p.incubation),resistance:text(p.resistance,800),cure:text(p.cure,800)};}),
  remanence:normalizeDaemonDefinition(r.remanence)};
}
export function daemonDefinitionIssues(d:DaemonDefinition):string[]{
 return [!d.name.trim()?'Nom à préciser.':'',!d.effect.trim()?'Effet concret à définir.':'',!d.source.trim()?'Origine ou enseignement à préciser.':'',d.pa===null?'Coût en PA à définir.':'',!d.range.trim()?'Portée à définir.':'',!d.frequency.trim()?'Cadence à définir.':'',!d.duration.trim()?'Durée à définir.':'',!d.resistance.trim()?'Résistance ou absence d’opposition à préciser.':'',!d.limits.trim()?'Conditions et limites à définir.':''].filter(Boolean);
}
export function daemonPathologyIssues(p:DaemonPathology):string[]{
 const labels:Record<string,string>={kind:'talent associé',name:'nom',symptoms:'symptômes',penalty:'malus',duration:'durée',transmission:'transmission',incubation:'incubation',resistance:'résistance',cure:'soins et fin'};
 return Object.entries(p).filter(([,v])=>!v.trim()).map(([k])=>`Pathologie : ${labels[k]||k} à préciser.`);
}
/** Add a non-mandatory historical-origin choice without invalidating existing characters. */
export function applyDaemonStructure<T extends {natures:{daemon:{choices:readonly unknown[]}}}>(structure:T){
 return {...structure,natures:{...structure.natures,daemon:{...structure.natures.daemon,choices:[...structure.natures.daemon.choices,{key:'soulOrigin',label:'Origine de l’Élu',optional:true,options:[
  {id:'eveille',name:'Éveillé',description:'Une âme choisie par la Divinité ; aucun bonus automatique.'},
  {id:'heros',name:'Héros',description:'Une âme remarquable dans une vie antérieure ; le passé justifie souvenirs et relations, pas des points gratuits.'},
  {id:'ancien_prophete',name:'Ancien Prophète — accord MJ requis',description:'Origine rare à convenir avec le MJ : l’ancien Attribut a disparu. Seule une Rémanence étroite peut être achetée ; ce choix ne valide pas lui-même l’origine.'}
 ]}]}}};
}
