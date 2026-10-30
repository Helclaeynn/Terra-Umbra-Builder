import {terraUmbraCreationRules as rules} from './rules/terra-umbra-creation.js';
import {NPC_TALENTS} from './npc-rules.js';
import {NPC_APPEARANCE,NPC_PERSONALITY,NPC_MOTIVATIONS,NPC_HOOKS} from './npc-flavor.js';
import {NPC_NATIONALITIES} from './npc-identities.js';
import {generateNpcTruth,NPC_TRUTH_NATURES,NPC_TRUTH_ARCHETYPES,NPC_TRUTH_TIER_TEMPLATE} from './npc-truth-generator.js';
import {NPC_TRUTH_TIERS} from './npc-truth-tiers.js';
import {NPC_TRUTH_GENERIC_TALENTS} from './npc-truth-generic-talents.js';
import {NPC_TIERS,NPC_SEXES,npcTalentEligible,type NpcSex,type NpcCatalog,type NpcData,type NpcRanges} from './campaign-npc-model.js';
import {existsSync,readFileSync} from 'node:fs';
import path from 'node:path';
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
function npcEquipment(){
 const candidates=[
  process.env.TUC_REALITY_RULES_ROOT&&path.join(process.env.TUC_REALITY_RULES_ROOT,'current-equipment-catalog-v1.json'),
  '/app/rules-data/current-equipment-catalog-v1.json',
  path.resolve(process.cwd(),'compendium/source/current-equipment-catalog-v1.json'),
  path.resolve(process.cwd(),'../../compendium/source/current-equipment-catalog-v1.json')
 ].filter((value):value is string=>!!value);
 const source=candidates.find(existsSync);
 if(!source)throw new Error('Catalogue d’équipement PNJ introuvable.');
 const root=JSON.parse(readFileSync(source,'utf8')) as {catalog?:{entries?:Array<Record<string,unknown>>}};
 return (root.catalog?.entries??[]).map(item=>{
   const data=item.data&&typeof item.data==='object'&&!Array.isArray(item.data)?item.data as Record<string,unknown>:{};
   const values=Object.entries(data).filter(([key])=>/^(?:Protection|Bal\.|Mel\.|Ant\.|Profil)$/i.test(key)).map(([,value])=>String(value));
   const armorValues=values.flatMap(value=>[...value.matchAll(/(?:Balistique|M[eê]l[eé]e|Antichoc)\s*([0-9]+)/gi)].map(match=>Number(match[1])));
   return {id:String(item.id??''),name:String(item.name??''),category:String(item.category??'Autres'),armor:armorValues.length?Math.max(...armorValues):null,armorProfile:values.join(" · ")};
  }).filter(item=>item.id&&item.name);
}
export const NPC_CATALOG:NpcCatalog={tiers:NPC_TIERS,talents:NPC_TALENTS,attributes:[...rules.attributes],skills:[...rules.skills],nationalities:NPC_NATIONALITIES,truthNatures:NPC_TRUTH_NATURES,truthPowers:NPC_TRUTH_TIERS,truthArchetypes:NPC_TRUTH_ARCHETYPES,truthTalents:NPC_TRUTH_GENERIC_TALENTS,equipment:npcEquipment(),variety:{names:NPC_NATIONALITIES.reduce((sum,n)=>(sum+(n.male.length+n.female.length+n.neutral.length)*n.last.length),0),appearances:NPC_APPEARANCE.bearing.length*NPC_APPEARANCE.clothing.length*NPC_APPEARANCE.detail.length,personalities:NPC_PERSONALITY.attitude.length*NPC_PERSONALITY.habit.length,motivations:NPC_MOTIVATIONS.length,secrets:NPC_HOOKS.length},presets:NPC_PRESETS.map(({id,name,description})=>({id,name,description})),ranges:Object.fromEntries(NPC_TIERS.flatMap(t=>NPC_PRESETS.map(p=>[`${t.id}:${p.id}`,npcStatRanges(t.id,p.id)]))),truthRanges:Object.fromEntries(NPC_TRUTH_TIERS.flatMap(t=>NPC_TRUTH_ARCHETYPES.map(a=>[`${t.id}:${a.id}`,npcStatRanges(NPC_TRUTH_TIER_TEMPLATE[t.id],a.presetId)])))};
function seeded(seed:string){let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);return ()=>{n+=0x6D2B79F5;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;};}
function allocate(ids:string[],budget:number,weights:Record<string,number>,cap:number,base=0){const values=Object.fromEntries(ids.map(id=>[id,base]));for(let left=budget-base*ids.length;left>0;left--){const available=ids.filter(id=>values[id]<cap).sort((a,b)=>(values[a]-base+1)/weights[a]-(values[b]-base+1)/weights[b]);if(!available.length)throw Error('npc_budget_unreachable');values[available[0]]++;}return values;}
function baseStats(tierId:string,presetId:string){const tier=NPC_TIERS.find(t=>t.id===tierId)!,preset=NPC_PRESETS.find(p=>p.id===presetId)!;
 const attributes=rules.attributes.map(a=>a.id),skills=rules.skills.map(s=>s.id);
 return {attributes:allocate(attributes,tier.attributes,Object.fromEntries(attributes.map(id=>[id,6-preset.attributes.indexOf(id)])),tier.attributes,Math.max(1,Math.floor(tier.attributes/5)-2)),
  skills:allocate(skills,tier.skills,Object.fromEntries(skills.map(id=>{const index=preset.skills.indexOf(id);return [id,index>=0?10-index:['humanite','maitrise_spirituelle','neurodive'].includes(id)?.015:.35];})),tier.cap)};
}
export function npcStatRanges(tierId:string,presetId:string):NpcRanges{const tier=NPC_TIERS.find(t=>t.id===tierId)!;const base=baseStats(tierId,presetId);
 return {attributes:Object.fromEntries(Object.entries(base.attributes).map(([id,v])=>[id,{min:Math.max(1,v-1),max:v+1}])),
  skills:Object.fromEntries(Object.entries(base.skills).map(([id,v])=>[id,{min:Math.max(0,v-2),max:Math.min(tier.cap,v+2)}]))};}
function vary(values:Record<string,number>,ranges:Record<string,{min:number;max:number}>,random:()=>number,attempts:number){const ids=Object.keys(values),result={...values};
 for(let i=0;i<attempts;i++){const from=ids[Math.floor(random()*ids.length)],to=ids[Math.floor(random()*ids.length)];if(from!==to&&result[from]>ranges[from].min&&result[to]<ranges[to].max){result[from]--;result[to]++;}}
 return result;
}
function chooseTalents(preset:Preset,skills:Record<string,number>,count:number,random:()=>number){
 const eligible=NPC_TALENTS.filter(t=>npcTalentEligible(t.id,skills)).map(t=>({id:t.id,weight:preset.talents.includes(t.id)?5:1})),chosen:string[]=[];
 while(chosen.length<count&&eligible.length){const total=eligible.reduce((n,t)=>n+t.weight,0),value=random()*total;let left=value,index=0;for(;index<eligible.length-1;index++){left-=eligible[index].weight;if(left<0)break;}chosen.push(eligible.splice(index,1)[0].id);}
 return chosen;
}
export function generateNpc(tierId:string,presetId:string,seed:string,faction='',sexChoice:NpcSex|'random'='random',nationalityChoice='random'):NpcData{
 const tier=NPC_TIERS.find(t=>t.id===tierId),preset=NPC_PRESETS.find(p=>p.id===presetId);if(!tier||!preset)throw Error('invalid_npc_generator');
 const random=seeded(seed),identityRandom=seeded(seed+':identity'),storyRandom=seeded(seed+':story');
 const sex:NpcSex=sexChoice==='random'?(identityRandom()<.5?'male':'female'):sexChoice;
 const nationality=nationalityChoice==='random'?NPC_NATIONALITIES[Math.floor(identityRandom()*NPC_NATIONALITIES.length)]:NPC_NATIONALITIES.find(n=>n.id===nationalityChoice);
 if(!nationality)throw Error('invalid_npc_generator');
 const firstNames:readonly string[]=sex==='male'?[...nationality.male,...nationality.neutral]:sex==='female'?[...nationality.female,...nationality.neutral]:sex==='other'?nationality.neutral:[...nationality.male,...nationality.female,...nationality.neutral];
 const firstName=firstNames[Math.floor(identityRandom()*firstNames.length)],lastName=nationality.last[Math.floor(identityRandom()*nationality.last.length)];
 const name=firstName+' '+lastName;
 const pick=(items:string[])=>items[Math.floor(storyRandom()*items.length)];
 const attributeIds=rules.attributes.map(a=>a.id),skillIds=rules.skills.map(s=>s.id);
 const base=baseStats(tierId,presetId),ranges=npcStatRanges(tierId,presetId);
 const attributes=vary(base.attributes,ranges.attributes,random,50),skills=vary(base.skills,ranges.skills,random,160);
 const talentIds=chooseTalents(preset,skills,tier.id==='superieur'?4:tier.recommended,random);
 return {name,firstName,lastName,nationality:nationality.id,truth:null,sex,tierId,presetId,role:preset.name,faction,appearance:[pick(NPC_APPEARANCE.bearing),pick(NPC_APPEARANCE.clothing),pick(NPC_APPEARANCE.detail)].join(' '),personality:[pick(NPC_PERSONALITY.attitude),pick(NPC_PERSONALITY.habit)].join(' '),motivation:pick(NPC_MOTIVATIONS),secret:pick(NPC_HOOKS),notes:'',equipment:'',equipmentIds:[],truthNotes:'',tags:[preset.name,...(faction?[faction.slice(0,60)]:[])],attributes,skills,talentIds,expertiseSkill:talentIds.includes('Expertise éprouvée')?(preset.skills.find(id=>skills[id]>=7)||''):'',apexSkill:'',apexReason:'',armor:0,portrait:''};
}

export function generateNpcBatch(value:unknown):NpcData[]|null{
 if(!value||typeof value!=='object')return null;const b=value as Record<string,unknown>;
 if(!NPC_TIERS.some(t=>t.id===b.tierId)||!NPC_PRESETS.some(p=>p.id===b.presetId)||typeof b.seed!=='string'||b.seed.length<1||b.seed.length>100||!Number.isInteger(b.count)||Number(b.count)<1||Number(b.count)>10||typeof b.faction!=='string'||b.faction.length>160||(b.sex!==undefined&&b.sex!=='random'&&!NPC_SEXES.some(s=>s.id===b.sex))||(b.nationality!==undefined&&b.nationality!=='random'&&!NPC_NATIONALITIES.some(n=>n.id===b.nationality)))return null;
 const truth=b.truth;if(truth!==undefined&&truth!==null&&(!truth||typeof truth!=='object'||!NPC_TRUTH_NATURES.some(n=>n.id===(truth as any).natureId)||!NPC_TRUTH_TIERS.some(n=>n.id===(truth as any).powerId)||!NPC_TRUTH_ARCHETYPES.some(n=>n.id===(truth as any).archetypeId)))return null;
 const npcs:NpcData[]=[],names=new Set<string>();
 for(let i=0;i<Number(b.count);i++){const npc=generateNpc(String(b.tierId),String(b.presetId),b.seed+':'+i,b.faction,(b.sex??'random') as NpcSex|'random',String(b.nationality??'random'));if(names.has(npc.name))npc.name+=' '+(i+1);names.add(npc.name);
  if(truth){const selection=truth as {natureId:string;powerId:string;archetypeId:string};const arch=NPC_TRUTH_ARCHETYPES.find(a=>a.id===selection.archetypeId)!;const template=generateNpc(NPC_TRUTH_TIER_TEMPLATE[selection.powerId],arch.presetId,b.seed+':truth:'+i);npc.truth=generateNpcTruth(template,selection.natureId,selection.powerId,selection.archetypeId,b.seed+':truth-talents:'+i);}
  npcs.push(npc);}return npcs;
}
