/** Saved Extral preparation is descriptive: no role grant, generated stock, healing or reward. */
export const extralTalentIds={repair:'extral-cycle-de-reparation',reserve:'extral-reserve-nanitique',phase:'extral-phasage-de-l-equipement',bank:'extral-banque-vivante',recombine:'extral-heritage-recombine'} as const;
export const extralSpecies=['talass','mosen','baseanh','rocreen','thalsios','homo_superior','adrak'] as const;
export const extralNetworks=[
 {id:'continuite',name:'Protocoles de Continuité'}, {id:'ctu',name:'CTU — Californian Talasses Union'},
 {id:'croix_verte',name:'Croix Verte / Ligue Baséanne'}, {id:'reptile',name:'REPTILE'},
 {id:'shaediri',name:'Mafia Shaediri'}, {id:'hydroguard',name:'Hydroguard / THDF'},
 {id:'smrc',name:'SMRC / AGI — Orgienétique'}, {id:'emeraude',name:'Émeraude Sanglante'},
 {id:'aidh_intervention',name:'Doctrine d’Intervention AIDH'}, {id:'aidh_coherence',name:'Protocoles de Cohérence AIDH'},
 {id:'nelakna',name:'Arts de Nel’Akna'}
] as const;
export type ExtralLearningAccess='N'|'O'|'R'|'';
/** Learning restrictions are separate from V/SR/R manifestation states. */
export function extralNetworkAccess(species:string,network:string):ExtralLearningAccess{
 if(!(extralSpecies as readonly string[]).includes(species))return '';
 switch(network){
  case 'continuite':return 'N';
  case 'ctu':return ['talass','thalsios'].includes(species)?'N':'O';
  case 'croix_verte':return species==='baseanh'?'N':'O';
  case 'reptile':return species==='mosen'?'N':species==='homo_superior'?'R':'O';
  case 'shaediri':return species==='rocreen'?'N':species==='homo_superior'?'R':'O';
  case 'hydroguard':return ['thalsios','rocreen'].includes(species)?'N':species==='mosen'?'R':'O';
  case 'smrc':return ['baseanh','thalsios'].includes(species)?'N':['talass','homo_superior'].includes(species)?'R':'O';
  case 'emeraude':return species==='talass'?'N':'R';
  case 'aidh_intervention':case 'aidh_coherence':return species==='homo_superior'?'N':'R';
  case 'nelakna':return species==='adrak'?'N':'';
  default:return '';
 }
}
export const extralAccessLabels={N:'Naturel — formation nécessaire',O:'Organisé — recrutement et formation réels',R:'Restreint — admission exceptionnelle à valider avec le MJ'} as const;
export type ExtralPreparation={uid:string;name:string;kind:string;effect:string;resistance:string;duration:string;remaining:number};
export type ExtralPatch={uid:string;state:'materialized'|'phased'};
export type ExtralDefinition={uid:string;name:string;talentId:string;effect:string;materials:string;duration:string;limits:string;pa:number|null};
export type ExtralBuild={training:string;trainingNetwork:string;hydrated:boolean;reserveUsed:boolean;repairUsed:boolean;preparations:ExtralPreparation[];patches:ExtralPatch[];recombination:{graftUid:string;talentId:string;architecture:string};projects:ExtralDefinition[]};
export type ExtralOwnedItem={uid:string;itemId:string;name:string;kind:string;biological:boolean};
const record=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const text=(v:unknown,max=500)=>typeof v==='string'?v.replace(/\u0000/g,'').slice(0,max):'';
const integer=(v:unknown,max=100)=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0&&v<=max?v:0;
const unique=(v:unknown,max:number)=>{const seen=new Set<string>();return (Array.isArray(v)?v:[]).slice(0,max).map(record).filter(r=>{const id=text(r.uid,160);if(!id||seen.has(id))return false;seen.add(id);return true;});};
export function normalizeExtralBuild(value:unknown):ExtralBuild{
 const r=record(value),g=record(r.recombination);
 return {training:text(r.training,1000),trainingNetwork:extralNetworks.some(n=>n.id===r.trainingNetwork)?String(r.trainingNetwork):'',hydrated:r.hydrated===true,reserveUsed:r.reserveUsed===true,repairUsed:r.repairUsed===true,
  preparations:unique(r.preparations,4).map(p=>({uid:text(p.uid,160),name:text(p.name,160),kind:['medical','antidote','toxin','corrosive','adhesive','sample'].includes(String(p.kind))?String(p.kind):'sample',effect:text(p.effect,1000),resistance:text(p.resistance,500),duration:text(p.duration,250),remaining:integer(p.remaining,20)})),
  patches:unique(r.patches,100).map(p=>({uid:text(p.uid,160),state:p.state==='phased'?'phased':'materialized'})),
  recombination:{graftUid:text(g.graftUid,160),talentId:text(g.talentId,200),architecture:text(g.architecture,1000)},
  projects:unique(r.projects,12).map(p=>({uid:text(p.uid,160),name:text(p.name,160),talentId:text(p.talentId,200),effect:text(p.effect,2000),materials:text(p.materials,1000),duration:text(p.duration,300),limits:text(p.limits,1000),pa:typeof p.pa==='number'&&Number.isSafeInteger(p.pa)&&p.pa>=0&&p.pa<=100?p.pa:null}))};
}
const innate:Record<string,string>={
 'Affinité Talwa’Etax':'Substrat psychique naturel : scan, télépathie et télékinésie ; les Talents précisent les développements contrôlés, leur portée et leurs coûts.',
 'Soie conductrice':'Soie physiologique transportant un courant ou un Talwa compatible ; Relais conducteur améliore la portée maîtrisée et ne fait pas payer la conductivité de base.',
 'Bond talass':'Bonds sans élan et changements d’appui biologiques, dans les limites de l’endurance ; les Talents améliorent les manœuvres difficiles.',
 'Résonance psychique':'Communication et perceptions partagées entre Rocréens et partenaires télépathiquement compatibles proches ; Lien de banc ouvre une exception aux partenaires non télépathes.',
 'Toucher thalsios':'Perçoit naturellement les vibrations et variations de pression. Les Thalsios acclimatés à la Terre sentent les fluctuations locales de l’Hologramme, sans identification automatique ; les Talents améliorent leur interprétation.'
};
export function applyExtralStructure<T extends {natures:{extral:{choices:readonly any[];freeTraitRules:readonly any[]}}}>(structure:T){
 const current=structure.natures.extral;
 const optionsBy=Object.fromEntries(extralSpecies.map(species=>[species,[{id:'aucune',name:'Aucun réseau / doctrine',description:'Profil biologique seulement.'},...extralNetworks.filter(n=>extralNetworkAccess(species,n.id)).map(n=>({id:n.id,name:n.name,description:extralAccessLabels[extralNetworkAccess(species,n.id) as 'N'|'O'|'R']+' ; les PTV et équipements restent à acquérir séparément.'}))]]));
 return {...structure,natures:{...structure.natures,extral:{...current,
  choices:current.choices.map(c=>c.key==='network'?{...c,optionsBy}:c),
  freeTraitRules:current.freeTraitRules.map(r=>({...r,traits:[...r.traits.map((t:any)=>({...t,effect:innate[t.name]??t.effect})),...(r.when.species==='talass'?[{id:'free-extral-talass-fractures',name:'Perception des fractures',access:'SR/R',effect:'Détecte naturellement une fracture dimensionnelle active ou un résidu récent du Néant ; Vision des fractures développe son interprétation.'}]:[])]}))
 }}};
}
