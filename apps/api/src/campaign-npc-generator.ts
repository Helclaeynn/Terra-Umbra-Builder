import {terraUmbraCreationRules as rules} from './rules/terra-umbra-creation.js';
import {NPC_TALENTS} from './npc-rules.js';
import {NPC_FIRST_NAMES,NPC_LAST_NAMES,NPC_APPEARANCE,NPC_PERSONALITY,NPC_MOTIVATIONS,NPC_HOOKS} from './npc-flavor.js';
import {NPC_TIERS,NPC_SEXES,npcTalentEligible,type NpcSex,type NpcCatalog,type NpcData} from './campaign-npc-model.js';
type Preset={id:string;name:string;description:string;attributes:string[];skills:string[];talents:string[]};
export const NPC_PRESETS:Preset[]=[
 {id:'civil',name:'Civil / témoin',description:'Un intervenant ordinaire, attentif à ce qui l’entoure.',attributes:['charisme','esprit','volonte','agilite','vigueur'],skills:['perception','diplomatie','savoirs','langages_argot','commerce','investigation','force_mentale','constitution'],talents:['Lecture des failles','Expertise éprouvée','Dossier préparé']},
 {id:'garde',name:'Garde / agent de sécurité',description:'Surveillance, intervention et protection d’un lieu.',attributes:['agilite','vigueur','volonte','esprit','charisme'],skills:['tir','perception','esquive','athletisme','constitution','pugilat','autorite','force_mentale'],talents:['Tir maîtrisé','Décrochage préparé','Chef de manœuvre','Lutte brève']},
 {id:'combattant',name:'Combattant au contact',description:'Un adversaire orienté mêlée et affrontement physique.',attributes:['vigueur','agilite','volonte','charisme','esprit'],skills:['melee','pugilat','athletisme','constitution','esquive','perception','survie','force_mentale'],talents:['Désarmement net','Lutte brève','Décrochage préparé','Terrain reconnu']},
 {id:'enqueteur',name:'Enquêteur',description:'Recherche, observation et entretiens.',attributes:['esprit','volonte','charisme','agilite','vigueur'],skills:['investigation','perception','savoirs','diplomatie','autorite','furtivite','langages_argot','force_mentale'],talents:['Dossier préparé','Lecture des failles','Expertise éprouvée','Fausse piste administrative']},
 {id:'infiltrateur',name:'Infiltrateur / éclaireur',description:'Approche discrète, repérage et fuite.',attributes:['agilite','volonte','esprit','vigueur','charisme'],skills:['furtivite','larcin','perception','esquive','athletisme','survie','investigation','tir'],talents:['Décrochage préparé','Terrain reconnu','Lecture des failles','Plan de sortie']},
 {id:'negociateur',name:'Négociateur / responsable',description:'Discussions, commerce et autorité.',attributes:['charisme','esprit','volonte','agilite','vigueur'],skills:['diplomatie','autorite','commerce','investigation','langages_argot','savoirs','perception','force_mentale'],talents:['Expertise éprouvée','Dossier préparé','Réseau mobilisable','Chaîne de commandement']},
 {id:'technicien',name:'Technicien',description:'Réparation, analyse et connaissances techniques.',attributes:['esprit','agilite','volonte','charisme','vigueur'],skills:['mecanique','savoirs','investigation','perception','pilotage','langages_argot','force_mentale','esquive'],talents:['Expertise éprouvée','Dossier préparé','Lecture des failles','Plan de sortie']},
 {id:'soignant',name:'Soignant',description:'Soins, diagnostic et sang-froid.',attributes:['esprit','volonte','charisme','agilite','vigueur'],skills:['soin','savoirs','perception','investigation','force_mentale','diplomatie','constitution','langages_argot'],talents:['Expertise éprouvée','Lecture des failles','Dossier préparé']}
];
export const NPC_CATALOG:NpcCatalog={tiers:NPC_TIERS,talents:NPC_TALENTS,attributes:[...rules.attributes],skills:[...rules.skills],variety:{names:Object.values(NPC_FIRST_NAMES).flat().length*NPC_LAST_NAMES.length,appearances:NPC_APPEARANCE.bearing.length*NPC_APPEARANCE.clothing.length*NPC_APPEARANCE.detail.length,personalities:NPC_PERSONALITY.attitude.length*NPC_PERSONALITY.habit.length,motivations:NPC_MOTIVATIONS.length,secrets:NPC_HOOKS.length},presets:NPC_PRESETS.map(({id,name,description})=>({id,name,description}))};
function seeded(seed:string){let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);return ()=>{n+=0x6D2B79F5;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};}
function allocate(ids:string[],budget:number,weights:Record<string,number>,cap:number,base=0){const values=Object.fromEntries(ids.map(id=>[id,base]));for(let left=budget-base*ids.length;left>0;left--){const available=ids.filter(id=>values[id]<cap).sort((a,b)=>(values[a]-base+1)/weights[a]-(values[b]-base+1)/weights[b]);if(!available.length)throw Error('npc_budget_unreachable');values[available[0]]++;}return values;}
export function generateNpc(tierId:string,presetId:string,seed:string,faction='',sexChoice:NpcSex|'random'='random'):NpcData{
 const tier=NPC_TIERS.find(t=>t.id===tierId),preset=NPC_PRESETS.find(p=>p.id===presetId);if(!tier||!preset)throw Error('invalid_npc_generator');
 const random=seeded(seed),identityRandom=seeded(seed+':identity'),storyRandom=seeded(seed+':story');
 const sex:NpcSex=sexChoice==='random'?(identityRandom()<.5?'male':'female'):sexChoice;
 const firstNames=sex==='male'||sex==='female'?[...NPC_FIRST_NAMES[sex],...NPC_FIRST_NAMES.neutral]:sex==='other'?NPC_FIRST_NAMES.neutral:Object.values(NPC_FIRST_NAMES).flat();
 const name=firstNames[Math.floor(identityRandom()*firstNames.length)]+' '+NPC_LAST_NAMES[Math.floor(identityRandom()*NPC_LAST_NAMES.length)];
 const pick=(items:string[])=>items[Math.floor(storyRandom()*items.length)];
 const attributeIds=rules.attributes.map(a=>a.id),skillIds=rules.skills.map(s=>s.id);
 const attributes=allocate(attributeIds,tier.attributes,Object.fromEntries(attributeIds.map(id=>[id,(6-preset.attributes.indexOf(id))*(.9+random()*.2)])),tier.attributes,Math.max(1,Math.floor(tier.attributes/5)-2));
 const skills=allocate(skillIds,tier.skills,Object.fromEntries(skillIds.map(id=>{const index=preset.skills.indexOf(id);return [id,index>=0?(10-index)*(.9+random()*.2):['humanite','maitrise_spirituelle','neurodive'].includes(id)?.015:.35];})),tier.cap);
 const talentIds=preset.talents.filter(id=>npcTalentEligible(id,skills)).slice(0,tier.recommended);
 return {name,sex,tierId,presetId,role:preset.name,faction,appearance:[pick(NPC_APPEARANCE.bearing),pick(NPC_APPEARANCE.clothing),pick(NPC_APPEARANCE.detail)].join(' '),personality:[pick(NPC_PERSONALITY.attitude),pick(NPC_PERSONALITY.habit)].join(' '),motivation:pick(NPC_MOTIVATIONS),secret:pick(NPC_HOOKS),notes:'',equipment:'',truthNotes:'',tags:[preset.name,...(faction?[faction.slice(0,60)]:[])],attributes,skills,talentIds,expertiseSkill:talentIds.includes('Expertise éprouvée')?(preset.skills.find(id=>skills[id]>=7)||''):'',apexSkill:'',apexReason:'',armor:0,portrait:''};
}

export function generateNpcBatch(value:unknown):NpcData[]|null{
 if(!value||typeof value!=='object')return null;const b=value as Record<string,unknown>;
 if(!NPC_TIERS.some(t=>t.id===b.tierId)||!NPC_PRESETS.some(p=>p.id===b.presetId)||typeof b.seed!=='string'||b.seed.length<1||b.seed.length>100||!Number.isInteger(b.count)||Number(b.count)<1||Number(b.count)>10||typeof b.faction!=='string'||b.faction.length>160||(b.sex!==undefined&&b.sex!=='random'&&!NPC_SEXES.some(s=>s.id===b.sex)))return null;
 const npcs:NpcData[]=[],names=new Set<string>();
 for(let i=0;i<Number(b.count);i++){const npc=generateNpc(String(b.tierId),String(b.presetId),b.seed+':'+i,b.faction,(b.sex??'random') as NpcSex|'random');if(names.has(npc.name))npc.name+=' '+(i+1);names.add(npc.name);npcs.push(npc);}return npcs;
}
