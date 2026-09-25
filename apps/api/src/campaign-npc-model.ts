import {NPC_TIERS} from './npc-tiers.js';
import type {NPC_TALENTS} from './npc-rules.js';
import {NPC_NATIONALITIES} from './npc-identities.js';
import {NPC_TRUTH_NATURES,NPC_TRUTH_ARCHETYPES} from './npc-truth-generator.js';
import {NPC_TRUTH_TIERS} from './npc-truth-tiers.js';
import {NPC_TRUTH_GENERIC_TALENTS} from './npc-truth-generic-talents.js';
export {NPC_TIERS};
export {NPC_NATIONALITIES,NPC_TRUTH_NATURES,NPC_TRUTH_ARCHETYPES,NPC_TRUTH_TIERS,NPC_TRUTH_GENERIC_TALENTS};
export const NPC_SEXES=[{id:'male',name:'Masculin'},{id:'female',name:'Féminin'},{id:'other',name:'Autre'},{id:'unspecified',name:'Non précisé'}] as const;
export type NpcSex=typeof NPC_SEXES[number]['id'];
export type NpcTruth={natureId:string;powerId:string;archetypeId:string;archetypeLabel?:string;state:'voile'|'semi-revele'|'revele';attributes:Record<string,number>;skills:Record<string,number>;talentIds:string[];ptv:number;specialtySkill:string;secondSpecialtySkill?:string;notes:string;abilities:string};
export type NpcData={sex?:NpcSex;name:string;firstName?:string;lastName?:string;nationality?:string;truth?:NpcTruth|null;tierId:string;presetId:string;role:string;faction:string;appearance:string;personality:string;motivation:string;secret:string;notes:string;equipment:string;truthNotes:string;tags:string[];attributes:Record<string,number>;skills:Record<string,number>;talentIds:string[];expertiseSkill:string;apexSkill:string;apexReason:string;armor:number;portrait:string};
export type NpcSummary={id:string;name:string;tierId:string;role:string;faction:string;tags:string[];hasPortrait:boolean;version:number;archived:boolean};
export type NpcRecord=NpcSummary&{data:NpcData};
export type NpcRanges={attributes:Record<string,{min:number;max:number}>;skills:Record<string,{min:number;max:number}>};
export type NpcCatalog={variety?:{names:number;appearances:number;personalities:number;motivations:number;secrets:number};tiers:typeof NPC_TIERS;talents:typeof NPC_TALENTS;attributes:{id:string;name:string}[];skills:{id:string;name:string;attribute:string}[];presets:{id:string;name:string;description:string}[];ranges:Record<string,NpcRanges>;truthRanges:Record<string,NpcRanges>;nationalities:typeof NPC_NATIONALITIES;truthNatures:typeof NPC_TRUTH_NATURES;truthPowers:typeof NPC_TRUTH_TIERS;truthArchetypes:typeof NPC_TRUTH_ARCHETYPES;truthTalents:typeof NPC_TRUTH_GENERIC_TALENTS};
export function npcTruthIssues(truth:NpcTruth,catalog:Pick<NpcCatalog,'attributes'|'skills'>):string[]{
 const issues:string[]=[];
 if(!truth||typeof truth!=='object'||Array.isArray(truth))return ['Profil de Vérité invalide.'];
 if(!NPC_TRUTH_NATURES.some(n=>n.id===truth.natureId)||!NPC_TRUTH_TIERS.some(t=>t.id===truth.powerId)||!NPC_TRUTH_ARCHETYPES.some(a=>a.id===truth.archetypeId)||!['voile','semi-revele','revele'].includes(truth.state))issues.push('Type, puissance, archétype ou état de Vérité inconnu.');
 if(truth.archetypeLabel!==undefined&&(typeof truth.archetypeLabel!=='string'||truth.archetypeLabel.length>120))issues.push('Nom d’archétype personnalisé invalide.');
 const stats=(values:Record<string,number>,keys:{id:string}[],min:number,max:number)=>values&&typeof values==='object'&&!Array.isArray(values)&&Object.keys(values).length===keys.length&&keys.every(k=>Number.isSafeInteger(values[k.id])&&values[k.id]>=min&&values[k.id]<=max);
 if(!stats(truth.attributes,catalog.attributes,1,50)||!stats(truth.skills,catalog.skills,0,25))issues.push('Valeurs de Vérité incomplètes ou hors limites.');
 if(!Array.isArray(truth.talentIds)||new Set(truth.talentIds).size!==truth.talentIds.length||truth.talentIds.some(id=>!NPC_TRUTH_GENERIC_TALENTS.some(t=>t.name===id)))issues.push('Talent de Vérité inconnu ou en double.');
 const cost=Array.isArray(truth.talentIds)?truth.talentIds.reduce((sum,id)=>sum+(NPC_TRUTH_GENERIC_TALENTS.find(t=>t.name===id)?.cost||0),0):0;
 if(!Number.isSafeInteger(truth.ptv)||truth.ptv<cost||truth.ptv>999)issues.push('PTV dépensés inférieurs au coût des talents sélectionnés.');
 if(typeof truth.specialtySkill!=='string'||truth.specialtySkill.length>80||truth.specialtySkill&&!catalog.skills.some(s=>s.id===truth.specialtySkill))issues.push('Spécialité de Vérité inconnue.');
 if(truth.secondSpecialtySkill!==undefined&&(typeof truth.secondSpecialtySkill!=='string'||truth.secondSpecialtySkill.length>80||truth.secondSpecialtySkill&&!catalog.skills.some(s=>s.id===truth.secondSpecialtySkill)))issues.push('Seconde spécialité de Vérité inconnue.');
 if(typeof truth.notes!=='string'||truth.notes.length>3000||typeof truth.abilities!=='string'||truth.abilities.length>3000)issues.push('Notes ou capacités de Vérité trop longues.');
 if(Array.isArray(truth.talentIds)&&truth.talentIds.some(id=>['Élan révélé','Maîtrise révélée','Second domaine'].includes(id))&&(!truth.specialtySkill||!(truth.skills?.[truth.specialtySkill]>=6)))issues.push('Les talents de spécialité exigent une compétence de Vérité à 6 ou plus.');
 if(Array.isArray(truth.talentIds)&&truth.talentIds.includes('Surpassement singulier')&&(!truth.specialtySkill||!(truth.skills?.[truth.specialtySkill]>=15)))issues.push('Surpassement singulier exige une compétence à 15 ou plus.');
 if(Array.isArray(truth.talentIds)&&truth.talentIds.includes('Second domaine')&&(!truth.secondSpecialtySkill||truth.secondSpecialtySkill===truth.specialtySkill||!(truth.skills?.[truth.secondSpecialtySkill]>=6)))issues.push('Second domaine exige une autre compétence de Vérité à 6 ou plus.');
 return issues;
}
const checks:Record<string,{skills:string[];min:number}>={
 'Dossier préparé':{skills:['investigation'],min:6},'Expertise éprouvée':{skills:[],min:7},'Lecture des failles':{skills:['investigation','perception'],min:7},'Fausse piste administrative':{skills:['investigation','savoirs'],min:6},
 'Tir maîtrisé':{skills:['tir'],min:7},'Désarmement net':{skills:['melee','pugilat'],min:8},'Lutte brève':{skills:['pugilat'],min:7},'Décrochage préparé':{skills:['athletisme','esquive'],min:6},'Terrain reconnu':{skills:['survie','perception'],min:7},'Chef de manœuvre':{skills:['autorite'],min:6},'Réseau mobilisable':{skills:['autorite'],min:6},'Chaîne de commandement':{skills:['autorite'],min:7},'Plan de sortie':{skills:['investigation','autorite'],min:6}
};
export function npcTalentEligible(id:string,skills:Record<string,number>){if(typeof id!=='string'||!Object.hasOwn(checks,id))return false;const c=checks[id];return (c.skills.length?c.skills.map(s=>skills[s]||0):Object.values(skills)).some(v=>v>=c.min);}
export function npcBudgetIssues(d:NpcData){
 const issues:string[]=[],tier=NPC_TIERS.find(t=>t.id===d.tierId);if(!tier)return ['Palier inconnu.'];
 const sum=(values:Record<string,number>)=>Object.values(values).reduce((a,b)=>a+b,0);
 if(sum(d.attributes)>tier.attributes)issues.push(`Budget d’attributs dépassé (${sum(d.attributes)}/${tier.attributes}).`);
 if(sum(d.skills)>tier.skills)issues.push(`Budget de compétences dépassé (${sum(d.skills)}/${tier.skills}).`);
 if(d.apexSkill&&(!['heroique','legendaire'].includes(d.tierId)||d.skills[d.apexSkill]!==15||!d.apexReason.trim()))issues.push('Apex exige le palier Héroïque ou Légendaire, une compétence à 15 et une spécialité documentée.');
 if(Object.entries(d.skills).some(([id,v])=>v>(id===d.apexSkill?15:tier.cap)))issues.push(`Le plafond ordinaire des compétences est ${tier.cap}.`);
 if(d.talentIds.includes('Expertise éprouvée')&&(!d.expertiseSkill||!(d.skills[d.expertiseSkill]>=7)))issues.push('Expertise éprouvée exige une compétence définie à 7 ou plus.');
 if(d.talentIds.some(id=>!npcTalentEligible(id,d.skills)))issues.push('Un talent ne remplit plus ses prérequis de compétence.');
 return issues;
}
export function validNpcData(value:unknown,catalog:Pick<NpcCatalog,'attributes'|'skills'>):value is NpcData{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;const d=value as NpcData;
 if(d.sex!==undefined&&!NPC_SEXES.some(s=>s.id===d.sex))return false;
 if(d.firstName!==undefined&&(typeof d.firstName!=='string'||d.firstName.length>80))return false;
 if(d.lastName!==undefined&&(typeof d.lastName!=='string'||d.lastName.length>80))return false;
 if(d.nationality!==undefined&&(typeof d.nationality!=='string'||d.nationality.length>80))return false;
 if(d.truth!==undefined&&d.truth!==null&&npcTruthIssues(d.truth,catalog).length)return false;
 const fields:Record<string,number>={name:120,tierId:40,presetId:40,role:160,faction:160,appearance:1000,personality:1000,motivation:1000,secret:3000,notes:6000,equipment:2000,truthNotes:3000,expertiseSkill:80,apexSkill:80,apexReason:1000,portrait:700000};
 if(Object.entries(fields).some(([key,max])=>typeof (d as any)[key]!=='string'||(d as any)[key].length>max)||!d.name.trim())return false;
 if(!Array.isArray(d.tags)||d.tags.length>12||d.tags.some(t=>typeof t!=='string'||!t.trim()||t.length>60))return false;
 if(!Array.isArray(d.talentIds)||d.talentIds.length>Object.keys(checks).length||new Set(d.talentIds).size!==d.talentIds.length)return false;
 const stats=(values:Record<string,number>,keys:{id:string}[],min:number,max:number)=>values&&typeof values==='object'&&!Array.isArray(values)&&Object.keys(values).length===keys.length&&keys.every(k=>Number.isSafeInteger(values[k.id])&&values[k.id]>=min&&values[k.id]<=max);
 if(!stats(d.attributes,catalog.attributes,1,46)||!stats(d.skills,catalog.skills,0,15)||!Number.isSafeInteger(d.armor)||d.armor<0||d.armor>100)return false;
 if(d.apexSkill&&!catalog.skills.some(s=>s.id===d.apexSkill))return false;
 return !npcBudgetIssues(d).length;
}
export function cleanNpcData(d:NpcData):NpcData{return {sex:d.sex??'unspecified',name:d.name.trim(),firstName:d.firstName?.trim()??'',lastName:d.lastName?.trim()??'',nationality:d.nationality?.trim()??'',truth:d.truth??null,tierId:d.tierId,presetId:d.presetId,role:d.role,faction:d.faction,appearance:d.appearance,personality:d.personality,motivation:d.motivation,secret:d.secret,notes:d.notes,equipment:d.equipment,truthNotes:d.truthNotes,tags:[...new Set(d.tags.map(t=>t.trim()))],attributes:d.attributes,skills:d.skills,talentIds:d.talentIds,expertiseSkill:d.expertiseSkill,apexSkill:d.apexSkill,apexReason:d.apexReason,armor:d.armor,portrait:d.portrait};}

export type NpcArticleBlock={type:'p';text:string}|{type:'table';rows:string[][]};
export type NpcArticleDraft={id:string;title:string;category:string;source:string;status:string;tags:string[];pnj:Record<string,unknown>;sections:{id:string;title:string;level:number;audience?:string;blocks:NpcArticleBlock[]}[]};
