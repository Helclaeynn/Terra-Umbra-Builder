/** Bounded saved declarations. These records never grant equipment, XP, money or a GM role. */
export const exilePeople=['elye','whurten','ashyll','thulkar','azmenorien'] as const;
export const exileHordes=['horde_commune','horde_divine','horde_marais','horde_fantome','horde_cendres','horde_rose'] as const;
export const exileNetworks=[
 {id:'protocoles_continuite',name:'Protocoles de Continuité'}, {id:'hds',name:'HDS'},
 {id:'faucon_malachite',name:'Faucon de Malachite'}, {id:'serpentaire_citrine',name:'Serpentaire de Citrine'},
 {id:'aigle_larvikite',name:'Aigle de Larvikite'}, {id:'hibou_onyx',name:'Hibou d’Onyx'},
 {id:'runes_whurten',name:'Runes whurtennes'}, {id:'atelier_clans',name:'Atelier des Clans'}, {id:'iron_law',name:'Iron Law'},
 {id:'green_union',name:'Green Union'}, {id:'quatre_empereurs',name:'Ligue des Quatre Empereurs'}, {id:'syndicat_jade',name:'Syndicat de Jade'},
 {id:'horde_commune',name:'Formation de Horde — commune'}, {id:'horde_divine',name:'Horde Divine'},
 {id:'horde_marais',name:'Horde des Marais'}, {id:'horde_fantome',name:'Horde Fantôme'},
 {id:'horde_cendres',name:'Horde des Cendres'}, {id:'horde_rose',name:'Horde de la Rose'},
 {id:'servants_pluton',name:'Servants de Pluton'}, {id:'technomagie_azmenor',name:'Technomagie azménorienne'}
] as const;
export const exileRuneIds=['exile-rune-du-foyer','exile-rune-de-veille','exile-rune-de-fer','exile-rune-de-scellement','exile-rune-de-garde'] as const;
export const exileTalentIds={hdb:'exile-hdb-hologram-distorsion-block',hdp:'exile-hdp-hologram-distorsion-punishment',brief:'exile-inscription-breve',phrase:'exile-phrase-runique',guard:'exile-rune-de-garde',healing:'exile-refection-vitale',stability:'exile-stabilite-augmentique',interface:'exile-interface-de-verite'} as const;
export type ExileTraining={uid:string;network:string;mentor:string;conditions:string;learned:boolean};
export type ExileRune={uid:string;runeIds:string[];itemUid:string;support:string;author:string;beneficiary:string;condition:string;brief:boolean;active:boolean;consumed:boolean};
export type ExileTechnique={uid:string;name:string;tradition:string;effect:string;pa:number|null;maintenance:number|null;range:string;resources:string;access:string;learning:string};
export type ExileWork={uid:string;talentId:string;itemUid:string;name:string;effect:string;materials:string;duration:string;limits:string;active:boolean;passiveId:string;working:boolean};
export type ExileProject={uid:string;talentId:string;itemUid:string;name:string;effect:string;materials:string;power:string;price:number|null;delay:string;partner:string;transaction:string;status:string;limits:string};
export type ExileBuild={trainings:ExileTraining[];runes:ExileRune[];techniques:ExileTechnique[];works:ExileWork[];projects:ExileProject[];landmarks:{uid:string;name:string;location:string}[];supplies:{uid:string;name:string;source:string;consumed:boolean}[]};
export type BeneficiaryBenefits={scenario:string;refectionReceived:boolean;guardReceived:boolean;refectionSource:string;guardSource:string};
export type ExileOwnedItem={uid:string;itemId:string;name:string;kind:string;installed:boolean;cybermechanical:boolean};
const record=(v:unknown):Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const text=(v:unknown,max=500)=>typeof v==='string'?v.replace(/\u0000/g,'').slice(0,max):'';
const number=(v:unknown,max=100)=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=max?v:null;
const unique=(v:unknown,max:number)=>{const seen=new Set<string>();return (Array.isArray(v)?v:[]).slice(0,max).map(record).filter(r=>{const id=text(r.uid,160);if(!id||seen.has(id))return false;seen.add(id);return true;});};
export function normalizeBeneficiaryBenefits(v:unknown):BeneficiaryBenefits{
 const r=record(v);return {scenario:text(r.scenario,160),refectionReceived:r.refectionReceived===true,guardReceived:r.guardReceived===true,refectionSource:text(r.refectionSource,300),guardSource:text(r.guardSource,300)};
}
export function normalizeExileBuild(v:unknown):ExileBuild{
 const r=record(v);
 return {
  trainings:unique(r.trainings,24).map(p=>({uid:text(p.uid,160),network:exileNetworks.some(n=>n.id===p.network)?String(p.network):'',mentor:text(p.mentor,400),conditions:text(p.conditions,1000),learned:p.learned===true})),
  runes:unique(r.runes,20).map(p=>({uid:text(p.uid,160),runeIds:[...new Set((Array.isArray(p.runeIds)?p.runeIds:[]).filter((id):id is string=>typeof id==='string'&&(exileRuneIds as readonly string[]).includes(id)))].slice(0,2),itemUid:text(p.itemUid,160),support:text(p.support,400),author:text(p.author,200),beneficiary:text(p.beneficiary,200),condition:text(p.condition,400),brief:p.brief===true,active:p.active===true,consumed:p.consumed===true})),
  techniques:unique(r.techniques,24).map(p=>({uid:text(p.uid,160),name:text(p.name,160),tradition:text(p.tradition,250),effect:text(p.effect,2000),pa:number(p.pa),maintenance:number(p.maintenance),range:text(p.range,250),resources:text(p.resources,600),access:['V','SR/R','R','V/SR/R'].includes(String(p.access))?String(p.access):'R',learning:text(p.learning,600)})),
  works:unique(r.works,40).map(p=>({uid:text(p.uid,160),talentId:text(p.talentId,200),itemUid:text(p.itemUid,160),name:text(p.name,160),effect:text(p.effect,2000),materials:text(p.materials,600),duration:text(p.duration,250),limits:text(p.limits,1000),active:p.active===true,passiveId:text(p.passiveId,200),working:p.working!==false})),
  projects:unique(r.projects,40).map(p=>({uid:text(p.uid,160),talentId:text(p.talentId,200),itemUid:text(p.itemUid,160),name:text(p.name,160),effect:text(p.effect,2000),materials:text(p.materials,1000),power:text(p.power,400),price:number(p.price,1000000000),delay:text(p.delay,250),partner:text(p.partner,250),transaction:text(p.transaction,250),status:text(p.status,250),limits:text(p.limits,1000)})),
  landmarks:unique(r.landmarks,3).map(p=>({uid:text(p.uid,160),name:text(p.name,160),location:text(p.location,500)})),
  supplies:unique(r.supplies,3).map(p=>({uid:text(p.uid,160),name:text(p.name,160),source:text(p.source,500),consumed:p.consumed===true}))
 };
}
export function isCybermechanicalItem(item:{category?:string;sourceCategory?:string;data?:Record<string,unknown>;generation?:number|null}){
 const s=`${item.category??''} ${item.sourceCategory??''} ${String(item.data?.type??item.data?.Type??'')}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 // Biological/Orgienetic grafts do not receive Iron Law's cybermechanical reduction.
 if(/biogen|biolog|orgien|genet/.test(s))return false;
 return /cyber|mecan|neural|optique|audio|dermi|interne|membre/.test(s)||(typeof item.generation==='number'&&item.generation>0);
}
