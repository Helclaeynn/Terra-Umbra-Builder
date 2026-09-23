import type { CreationRules } from './creation-types';
import { ensureProgression, xpSpent, ptvSpent } from './progression';
import { truthAvailableTalents, truthPermanentAttributeBonus, type TruthRulesPackage, type TruthState } from './truth';

export type HistorySnapshot={
  creation:{sphere:string};attributes:Record<string,number>;edgeAttributes:Record<string,number>;
  skills:Record<string,{style:number;free:number;edge:number}>;truth:Record<string,unknown>;progression:Record<string,unknown>;
};
export type HistoryRevision={revision:number;reason:string;createdAt:string;snapshot:HistorySnapshot};
export type HistoryPage={character:{id:string;name:string;version:number};revisions:HistoryRevision[];predecessor:HistoryRevision|null;nextBefore:number|null};
export type HistoryChange={label:string;before:string;after:string};
const ids=(value:unknown):string[]=>Array.isArray(value)?value.filter((v):v is string=>typeof v==='string'):[];
const number=(value:unknown)=>Number.isFinite(Number(value))?Number(value):0;
const format=(n:number)=>n.toLocaleString('fr-FR');

function project(data:HistorySnapshot,rules:CreationRules,truth:TruthRulesPackage){
  const raw=data.truth;
  const state:TruthState={nature:typeof raw.nature==='string'?raw.nature:'humain',consciousness:typeof raw.consciousness==='string'?raw.consciousness:'profane',choices:raw.choices&&typeof raw.choices==='object'&&!Array.isArray(raw.choices)?raw.choices as Record<string,unknown>:{},truthTalents:ids(raw.truthTalents),truthEquipment:[],corruptionTalents:[],corruption:0,corruptionSource:'',truthEquipmentMjOverride:false,corruptionMjAuthorized:false};
  const progress=ensureProgression({...data.progression},rules.skills.map(s=>s.id),rules.attributes.map(a=>a.id));
  const skillBases=Object.fromEntries(rules.skills.map(s=>[s.id,(rules.spheres[data.creation.sphere]?.fixedSkills.includes(s.id)?1:0)+number(data.skills[s.id]?.style)+number(data.skills[s.id]?.free)+number(data.skills[s.id]?.edge)]));
  const attributeBases=Object.fromEntries(rules.attributes.map(a=>[a.id,number(data.attributes[a.id])+number(data.edgeAttributes[a.id])+truthPermanentAttributeBonus(state,a.id)]));
  const truthMap=new Map(Object.values(truth.catalogs).flat().map(t=>[t.id,t]));
  for(const t of truthAvailableTalents(truth,{...state,truthTalents:[...new Set([...state.truthTalents,...progress.truthTalents])]}))truthMap.set(t.id,t);
  const corruptionMap=new Map(truth.corruption.talents.map(t=>[t.id,t]));
  const realityMap=new Map([...Object.values(rules.talents.origin).flat(),...Object.values(rules.talents.sphere).flat(),...rules.talents.expertise,...rules.talents.common].map(t=>[t.id,t]));
  // Historical imports may contain invalid ranks: never run an unbounded cost loop.
  const validRanks=[...Object.values(progress.attributeRanks),...Object.values(progress.skillRanks)].every(n=>Number.isInteger(n)&&n>=0&&n<=100);
  return {progress,skillBases,attributeBases,truthMap,realityMap,corruptionMap,
    xp:validRanks&&progress.realityTalents.every(id=>realityMap.has(id))?xpSpent(progress,skillBases,attributeBases):null,
    ptv:progress.truthTalents.every(id=>truthMap.has(id))&&progress.corruptionTalents.every(id=>corruptionMap.has(id))?ptvSpent(progress,id=>Number(truthMap.get(id)?.cost||0),id=>Number(corruptionMap.get(id)?.cost||0)):null};
}
export function compareHistory(current:HistoryRevision,previous:HistoryRevision|null,rules:CreationRules,truth:TruthRulesPackage){
  if(!previous||previous.revision!==current.revision-1)return {changes:[] as HistoryChange[],initial:current.revision===1,missing:current.revision!==1};
  const before=project(previous.snapshot,rules,truth),after=project(current.snapshot,rules,truth),changes:HistoryChange[]=[];
  function add(label:string,a:unknown,b:unknown){if(a!==b)changes.push({label,before:String(a),after:String(b)});}
  const numeric=(label:string,a:number,b:number)=>add(label,format(a),format(b));
  numeric('XP reçus depuis la création',before.progress.xpEarned,after.progress.xpEarned);
  numeric('PTV reçus en campagne',before.progress.ptvEarned,after.progress.ptvEarned);
  const budget=(label:string,a:number|null,b:number|null)=>add(label,a===null?'Coût inconnu':format(a),b===null?'Coût inconnu':format(b));
  budget('XP engagés en progression · coût recalculé',before.xp,after.xp);
  budget('PTV engagés en progression · coût recalculé',before.ptv,after.ptv);
  for(const a of rules.attributes){
    numeric(`${a.name} · rangs acquis en campagne`,before.progress.attributeRanks[a.id]||0,after.progress.attributeRanks[a.id]||0);
    numeric(`${a.name} · base de création`,before.attributeBases[a.id],after.attributeBases[a.id]);
  }
  for(const s of rules.skills){
    numeric(`${s.name} · rangs acquis en campagne`,before.progress.skillRanks[s.id]||0,after.progress.skillRanks[s.id]||0);
    numeric(`${s.name} · base de création`,before.skillBases[s.id],after.skillBases[s.id]);
  }
  for(const [key,map,group] of [['realityTalents',after.realityMap,'Talent Réalité'],['truthTalents',after.truthMap,'Talent Vérité']] as const){
    const old=new Set(before.progress[key]),next=new Set(after.progress[key]);
    const changed=[...new Set([...old,...next])].filter(id=>old.has(id)!==next.has(id)).sort((a,b)=>(map.get(a)?.name??a).localeCompare(map.get(b)?.name??b,'fr'));
    for(const id of changed)add(`${group} · ${map.get(id)?.name??id}`,old.has(id)?'Acquis':'Non acquis',next.has(id)?'Acquis':'Retiré');
  }
  numeric('Corruption · niveau',number(previous.snapshot.truth.corruption),number(current.snapshot.truth.corruption));
  const sourceName=(raw:unknown)=>truth.corruption.sources.find(s=>s.id===raw)?.name||String(raw||'Aucune');
  add('Corruption · Source dominante',sourceName(previous.snapshot.truth.corruptionSource),sourceName(current.snapshot.truth.corruptionSource));
  add('Éveil à la Vérité',previous.snapshot.truth.consciousness==='initie'?'Initié':'Profane',current.snapshot.truth.consciousness==='initie'?'Initié':'Profane');
  for(const [label,key,from,to] of [
    ['Accord MJ déclaré · Corruption','corruptionMjAuthorized',previous.snapshot.truth,current.snapshot.truth],
    ['Accord MJ déclaré · Talents de Vérité','truthTalentsMjAuthorized',previous.snapshot.progression,current.snapshot.progression],
    ['Accord MJ déclaré · Objets de Vérité','truthEquipmentMjAuthorized',previous.snapshot.progression,current.snapshot.progression],
    ['Accord MJ déclaré · Accès exceptionnel aux objets','truthEquipmentMjOverride',previous.snapshot.truth,current.snapshot.truth]
  ] as const)add(label,from[key]?'Confirmé':'Non confirmé',to[key]?'Confirmé':'Non confirmé');
  for(const [label,oldIds,newIds,names] of [
    ['Capacité de Fléau',[...ids(previous.snapshot.truth.corruptionTalents),...before.progress.corruptionTalents],[...ids(current.snapshot.truth.corruptionTalents),...after.progress.corruptionTalents],new Map(truth.corruption.talents.map(t=>[t.id,t.name]))],
    ['Objet de Vérité',ids(previous.snapshot.truth.truthEquipment),ids(current.snapshot.truth.truthEquipment),new Map(truth.equipment.map(t=>[t.id,t.name]))]
  ] as const){
    const old=new Set(oldIds),next=new Set(newIds);
    for(const id of [...new Set([...old,...next])].sort((a,b)=>(names.get(a)??a).localeCompare(names.get(b)??b,'fr'))){
      if(old.has(id)!==next.has(id))add(`${label} · ${names.get(id)??id}`,old.has(id)?'Acquis':'Non acquis',next.has(id)?'Acquis':'Retiré');
    }
  }
  const flashes=(values:string[])=>values.map(value=>{const [id,step]=value.split(':');return `${rules.skills.find(s=>s.id===id)?.name??id} · rang +${step}`;}).sort((a,b)=>a.localeCompare(b,'fr')).join(', ')||'Aucune';
  add('Éclair de génie · réductions appliquées',flashes(before.progress.flashUses),flashes(after.progress.flashUses));
  return {changes,initial:false,missing:false};
}
export function revisionLabel(row:HistoryRevision){
  if(row.reason==='created')return 'Création du personnage';
  if(row.reason==='imported')return 'Import du personnage';
  if(row.reason.startsWith('campaign-reward:'))return `Récompense de séance · ${row.reason.slice(16)}`;
  if(/^restored:\d+$/.test(row.reason))return `Restauration de la version ${row.reason.split(':')[1]}`;
  return 'Personnage enregistré';
}
