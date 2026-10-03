import {terraUmbraCreationRules as rules} from './rules/terra-umbra-creation.js';
const norm=(s:any)=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const number=(s:any)=>{const m=/^-?\d+(?:\s|$)/.exec(String(s??'').replace(/−/g,'-'));return m?Number(m[0]):null;};
export function articleCombatProfiles(article:any){
 const profiles:any[]=[];
 const sections=article.sections??[];
 for(const section of sections){
  if(!/stat|profil|verite|realite/.test(norm(section.id+' '+section.title)))continue;
  const attributes:Record<string,number>={},skills:Record<string,number>={};let armor=0;
  for(const block of section.blocks??[]){if(block.type!=='table')continue;const rows=block.rows??[];
   for(let i=0;i<rows.length;i++)for(let j=0;j<rows[i].length;j++){
    const name=norm(rows[i][j]),a=rules.attributes.find(x=>norm(x.name)===name),s=rules.skills.find(x=>norm(x.name)===name);
    const val=number(rows[i]?.[j+1])??number(rows[i+1]?.[j]);if(val===null)continue;
    if(a)attributes[a.id]=val;if(s)skills[s.id]=val;
    if(name==='armure portee'||name==='armure')armor=number(rows[i].at(-1))??0;
   }
  }
  if(rules.attributes.every(a=>Number.isInteger(attributes[a.id]))){
   const title=norm(section.id+' '+section.title),label=title.includes('verite')||title.includes('revele')?'Vérité / Révélé':'Réalité';
   profiles.push({key:section.id,kind:'npc',name:article.title+' · '+label,data:{name:article.title,attributes,skills,armor,equipmentIds:[],sourceArticle:article.id,sourceSection:section.id,sourcePortrait:portrait(article)}});
  }
 }
 if(/bestiaire/.test(norm(article.category)+' '+article.id)){
  const combatSections=sections.filter((s:any)=>s.id==='dossier-mj');
  const text=(combatSections.length?combatSections:sections).flatMap((s:any)=>(s.blocks??[]).flatMap((b:any)=>b.text?[b.text]:b.rows?.map((r:any)=>r.join(' '))??[])).join('\n'),n=norm(text);
  const read=(pattern:string)=>Number(new RegExp(pattern+'\\s+(?:1d10e?\\s+)?(\\d+)').exec(n)?.[1]??0);
  const stats={pv:read('pv'),initiative:read('initiative'),actions:read('actions'),physicalDefense:read('def physique'),occultDefense:read('def occulte'),armor:read('armure'),attack:read('attaque'),movement:read('mouvement'),perception:read('perception'),mastery:read('maitrise')};
  const attacks=text.split('\n').flatMap((line:string)=>{const m=/^ATTAQUE\s*[—:–]\s*(.+?)\s*[—:–]\s*1d10e?\s*\+\s*(\d+).*?DGT\s*(\d+)/i.exec(line);return m?[{name:m[1],score:Number(m[2]),damage:Number(m[3]),range:/Contact/i.test(line)?'Contact':(/Port[eé]e\s*([^•]+)/i.exec(line)?.[1]??''),properties:line}]:[];});
  const reductions=Object.fromEntries(['melee','balistique','antichoc','feu','neuro'].map(k=>[k,read(k)]));
  if(stats.pv>0&&stats.actions>0&&stats.initiative>0){if(!stats.attack&&attacks.length)stats.attack=attacks[0].score;profiles.push({key:'creature',kind:'creature',name:article.title,data:{name:article.title,stats,attacks,reductions,sourceArticle:article.id,sourcePortrait:portrait(article)}});}
 }
 return profiles;
}
function portrait(a:any){const all=(a.sections??[]).flatMap((s:any)=>s.blocks??[]),p=a.pnj?.portrait??a.image?.src??a.illustration?.src??all.find((b:any)=>b.type==='image')?.src;if(typeof p==='string'&&/^images\//.test(p))return '/api/compendium/media/'+p;return typeof p==='string'&&/^\/api\/compendium\/media\//.test(p)?p:'';}
export async function liveCatalog(){const {getCompendiumQualityCorpus}=await import('./compendium.js');const corpus=await getCompendiumQualityCorpus();return corpus.articles.flatMap(a=>articleCombatProfiles(a).map(p=>({...p,id:a.id+'::'+p.key,articleId:a.id}))).sort((a,b)=>a.name.localeCompare(b.name,'fr'));}
