import {NPC_TIERS} from './npc-tiers.js';
import type {NPC_TALENTS} from './npc-rules.js';
export {NPC_TIERS};
export type NpcData={name:string;tierId:string;presetId:string;role:string;faction:string;appearance:string;personality:string;motivation:string;secret:string;notes:string;equipment:string;truthNotes:string;tags:string[];attributes:Record<string,number>;skills:Record<string,number>;talentIds:string[];expertiseSkill:string;apexSkill:string;apexReason:string;armor:number;portrait:string};
export type NpcSummary={id:string;name:string;tierId:string;role:string;faction:string;tags:string[];hasPortrait:boolean;version:number;archived:boolean};
export type NpcRecord=NpcSummary&{data:NpcData};
export type NpcCatalog={tiers:typeof NPC_TIERS;talents:typeof NPC_TALENTS;attributes:{id:string;name:string}[];skills:{id:string;name:string;attribute:string}[];presets:{id:string;name:string;description:string}[]};
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
 const fields:Record<string,number>={name:120,tierId:40,presetId:40,role:160,faction:160,appearance:1000,personality:1000,motivation:1000,secret:3000,notes:6000,equipment:2000,truthNotes:3000,expertiseSkill:80,apexSkill:80,apexReason:1000,portrait:700000};
 if(Object.entries(fields).some(([key,max])=>typeof (d as any)[key]!=='string'||(d as any)[key].length>max)||!d.name.trim())return false;
 if(!Array.isArray(d.tags)||d.tags.length>12||d.tags.some(t=>typeof t!=='string'||!t.trim()||t.length>60))return false;
 if(!Array.isArray(d.talentIds)||d.talentIds.length>Object.keys(checks).length||new Set(d.talentIds).size!==d.talentIds.length)return false;
 const stats=(values:Record<string,number>,keys:{id:string}[],min:number,max:number)=>values&&typeof values==='object'&&!Array.isArray(values)&&Object.keys(values).length===keys.length&&keys.every(k=>Number.isSafeInteger(values[k.id])&&values[k.id]>=min&&values[k.id]<=max);
 if(!stats(d.attributes,catalog.attributes,1,46)||!stats(d.skills,catalog.skills,0,15)||!Number.isSafeInteger(d.armor)||d.armor<0||d.armor>100)return false;
 if(d.apexSkill&&!catalog.skills.some(s=>s.id===d.apexSkill))return false;
 return !npcBudgetIssues(d).length;
}
export function cleanNpcData(d:NpcData):NpcData{return {name:d.name.trim(),tierId:d.tierId,presetId:d.presetId,role:d.role,faction:d.faction,appearance:d.appearance,personality:d.personality,motivation:d.motivation,secret:d.secret,notes:d.notes,equipment:d.equipment,truthNotes:d.truthNotes,tags:[...new Set(d.tags.map(t=>t.trim()))],attributes:d.attributes,skills:d.skills,talentIds:d.talentIds,expertiseSkill:d.expertiseSkill,apexSkill:d.apexSkill,apexReason:d.apexReason,armor:d.armor,portrait:d.portrait};}
