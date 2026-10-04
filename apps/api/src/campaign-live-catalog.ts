import {NPC_TALENTS} from './npc-rules.js';
import {NPC_TRUTH_GENERIC_TALENTS} from './npc-truth-generic-talents.js';
import {BESTIARY_WEAPONS} from './campaign-bestiary-weapons.js';
import {terraUmbraCreationRules as rules} from './rules/terra-umbra-creation.js';
const norm=(s:any)=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const number=(s:any)=>{const m=/^-?\d+(?:\s|$)/.exec(String(s??'').replace(/−/g,'-'));return m?Number(m[0]):null;};
// Preserve explicit rules beside the numeric profile, without inventing bonuses.
const plain=(s:any)=>String(s??'').replace(/\*\*|__/g,'').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/<[^>]*>/g,'').replace(/^[\s•>*-]+/,'').trim();
function blockLines(b:any):string[]{return [typeof b.text==='string'?plain(b.text):'',...(b.items??[]).flatMap((i:any)=>typeof i==='string'?[plain(i)]:blockLines(i)),...(b.rows??[]).map((r:any[])=>r.map(plain).join(' · '))].filter(Boolean);}
export function combatReference(data:any){
 const list=(v:any):string[]=>Array.isArray(v)?v.filter(x=>typeof x==='string'):typeof v==='string'&&v.trim()?[v]:[];
 return {abilities:[...list(data.abilities),...list(data.truth?.abilities),...NPC_TALENTS.filter(t=>(data.talentIds??[]).includes(t.id)).map(t=>`${t.name} — ${t.prerequisite} — ${t.effect}`),...NPC_TRUTH_GENERIC_TALENTS.filter(t=>(data.truth?.talentIds??[]).includes(t.name)).map(t=>`${t.name} — ${t.prerequisite} — ${t.effect}`)],strengths:list(data.strengths),weaknesses:list(data.weaknesses),equipment:list(data.equipment),notes:[...list(data.truthNotes),...list(data.truth?.notes)],ruleSections:data.ruleSections??[]};
}
function articleReference(article:any){
 const sections=(article.sections??[]).filter((s:any)=>/dossier|capacite|pouvoir|talent|force|faiblesse|limite|equipement|armement/.test(norm(s.id+' '+s.title)));
 const lines=sections.flatMap((s:any)=>(s.blocks??[]).flatMap(blockLines));
 return {abilities:lines.filter((l:string)=>/^capacite|^pouvoir/i.test(norm(l))),strengths:lines.filter((l:string)=>/^force |^atout /i.test(norm(l))),weaknesses:lines.filter((l:string)=>/^faiblesse|^limite/i.test(norm(l))),equipment:lines.filter((l:string)=>/^equipement|^armement/i.test(norm(l))).join('\n'),ruleSections:sections.filter((s:any)=>s.id!=='dossier-mj').map((s:any)=>({title:s.title,lines:(s.blocks??[]).flatMap(blockLines)}))};
}
export function capabilityRolls(data:any){
 return combatReference(data).abilities.flatMap((text:string,i:number)=>{const matches=[...text.matchAll(/1d10e?\s*\+\s*(\d+)/gi)];if(matches.length!==1)return [];const score=Number(matches[0][1]);return [{id:'capability:'+i,label:text.split(/[—–]/).slice(0,2).join(' — ').trim().slice(0,120),modifier:score,attack:false,description:text,components:{profileScore:score,profileName:'Capacité',bonus:0}}];});
}
export function articleCombatProfiles(article:any){
 const profiles:any[]=[];
 const sections=article.sections??[];
 for(const section of sections){
  if(!/stat|profil|verite|realite/.test(norm(section.id+' '+section.title)))continue;
  const attributes:Record<string,number>={},skills:Record<string,number>={};let armor=0,attributesRead=false;
  const revealed=/verite|revele/.test(norm(section.id+' '+section.title));
  for(const block of section.blocks??[]){if(block.type!=='table')continue;const rows=block.rows??[];
   const heading=norm(rows[0]?.join(' '));
   if(!revealed&&/verite|revele/.test(heading))continue;
   const attributeTable=rules.attributes.every(a=>rows[0]?.some((v:any)=>norm(v)===norm(a.name)));
   if(attributeTable&&attributesRead)continue;
   if(attributeTable)attributesRead=true;
   for(let i=0;i<rows.length;i++)for(let j=0;j<rows[i].length;j++){
    const name=norm(rows[i][j]),a=rules.attributes.find(x=>norm(x.name)===name),s=rules.skills.find(x=>norm(x.name)===name);
    const val=number(rows[i]?.[j+1])??number(rows[i+1]?.[j]);if(val===null)continue;
    if(a)attributes[a.id]=val;if(s)skills[s.id]=val;
    if(name==='armure portee'||name==='armure')armor=number(rows[i].at(-1))??0;
   }
  }
  if(rules.attributes.every(a=>Number.isInteger(attributes[a.id]))){
   const title=norm(section.id+' '+section.title),label=title.includes('verite')||title.includes('revele')?'Vérité / Révélé':'Réalité';
   profiles.push({key:section.id,kind:'npc',name:article.title+' · '+label,data:{name:article.title,attributes,skills,armor,combatProfileVersion:3,...articleReference(article),equipmentIds:articleEquipment(article),sourceArticle:article.id,sourceSection:section.id,sourcePortrait:portrait(article)}});
  }
 }
 if(/bestiaire/.test(norm(article.category)+' '+article.id)){
  const combatSections=sections.filter((s:any)=>s.id==='dossier-mj');
  const text=(combatSections.length?combatSections:sections).flatMap((s:any)=>(s.blocks??[]).flatMap(blockLines)).join('\n'),n=norm(text);
  const read=(pattern:string)=>Number(new RegExp(pattern+'\\s+(?:1d10e?\\s+)?(\\d+)').exec(n)?.[1]??0);
  const stats={pv:read('pv'),initiative:read('initiative'),actions:read('actions'),physicalDefense:read('def physique'),occultDefense:read('def occulte'),armor:read('armure'),attack:read('attaque'),movement:read('mouvement'),perception:read('perception'),mastery:read('maitrise')};
  const attacks=text.split('\n').flatMap((line:string)=>{const m=/^ATTAQUE\s*[—:–]\s*(.+?)\s*[—:–]\s*1d10e?\s*\+\s*(\d+).*?DGT\s*(\d+)/i.exec(line);return m?[{name:m[1],score:Number(m[2]),damage:Number(m[3]),range:/Contact/i.test(line)?'Contact':(/Port[eé]e\s*([^•]+)/i.exec(line)?.[1]??''),properties:line}]:[];});
  const reductions=Object.fromEntries(['melee','balistique','antichoc','feu','neuro'].map(k=>[k,read(k)]));
  if(stats.pv>0&&stats.actions>0&&stats.initiative>0){if(!stats.attack&&attacks.length)stats.attack=attacks[0].score;profiles.push({key:'creature',kind:'creature',name:article.title,data:{name:article.title,combatProfileVersion:3,...articleReference(article),stats,attacks,reductions,sourceArticle:article.id,sourcePortrait:portrait(article)}});}
 }
 const reality=profiles.find(p=>p.kind==='npc'&&!/verite|revele/.test(norm(p.key)));
 if(reality)for(const p of profiles)if(p.kind==='npc'&&p!==reality)p.data.skills={...reality.data.skills,...p.data.skills};
 return profiles;
}
function portrait(a:any){const all=(a.sections??[]).flatMap((s:any)=>s.blocks??[]),p=a.pnj?.portrait??a.image?.src??a.illustration?.src??all.find((b:any)=>b.type==='image')?.src;if(typeof p==='string'&&/^images\//.test(p))return '/api/compendium/media/'+p;return typeof p==='string'&&/^\/api\/compendium\/media\//.test(p)?p:'';}
function articleEquipment(article:any){
 const texts=(article.sections??[]).flatMap((s:any)=>(s.blocks??[]).filter((b:any)=>/equipement|armement/.test(norm(s.title+' '+s.id))||b.type==='table'&&/equipement|arme portee/.test(norm(b.rows?.[0]?.join(' ')))).map((b:any)=>norm(b.text??b.rows?.flat().join(' '))));
 return BESTIARY_WEAPONS.filter(w=>texts.some((t:string)=>t.includes(norm(w.name)))).map(w=>w.id);
}
let cached:Promise<any[]>|null=null,expires=0;
export async function liveCatalog(){
 if(!cached||Date.now()>expires){expires=Date.now()+30000;cached=(async()=>{const {getCompendiumQualityCorpus}=await import('./compendium.js');const corpus=await getCompendiumQualityCorpus();return corpus.articles.flatMap(a=>articleCombatProfiles(a).map(p=>({...p,id:a.id+'::'+p.key,articleId:a.id}))).sort((a,b)=>a.name.localeCompare(b.name,'fr'));})();cached.catch(()=>{cached=null;});}
 return cached;
}
/** Repair legacy canonical snapshots without touching current HP, PA or initiative. */
export async function repairedCombatantData(c:any){
 if(!c.data?.sourceArticle||c.data.combatProfileVersion===3)return c.data;
 const row=(await liveCatalog()).find(p=>p.articleId===c.data.sourceArticle&&p.kind===c.source_kind&&(p.kind==='creature'||p.key===c.data.sourceSection));
 if(!row)return c.data;
 return {...c.data,...row.data,...(c.data.equipmentIds?.length?{equipmentIds:c.data.equipmentIds}:{})};
}
