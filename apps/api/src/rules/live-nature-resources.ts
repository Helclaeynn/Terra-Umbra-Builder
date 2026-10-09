import {terraUmbraCreationRules} from './terra-umbra-creation.js';
import {truthCoreRules} from './truth/core-rules.js';
import {liveTruthState} from './play-truth.js';
import {angelusAuraCapacity,angelusTalentIds,normalizeAngelusBuild,angelusConstructIssues} from './truth/angelus-build.js';
import {daemonTalentIds,normalizeDaemonBuild,daemonDefinitionIssues,daemonPathologyIssues} from './truth/daemon-build.js';
import {mageMasteries,mageAmplitudes} from './truth/mage-techniques.js';
import type {TruthTalent,TruthNature} from './truth/types.js';

const pkg=truthCoreRules as unknown as {structure:{natures:Record<string,TruthNature>};catalogs:Record<string,TruthTalent[]>};
const cap='capacites_et_talents_communs_talents_communs_';
export const natureResourceIds={equilibrium:cap+'equilibrage_du_flux',discharge:cap+'decharge_controlee',boost:'nature_commune_pouvoirs_angeliques_talents_communs_recharge_fulgurante',egide:'nature_commune_pouvoirs_angeliques_talents_communs_egide_renforcee',offering:'les_dix_sephiroth_tiph_ereth_la_beaute_facette_sacrifice_offrande',resonance:'daemon_clean_talents_communs_de_nature_resonance_profonde'} as const;
export type NatureSpell={intent?:'hostile'|'support'|'narrative';affinity:string;amplitude:'mineure'|'significative'|'majeure'|'cataclysmique';range:'contact'|'will'|'sight';channel:number;opposed:boolean;urgent:boolean;contextDifficult:boolean;forceAmplitude:boolean;forceMastery:boolean;note:string};
export type SpellPlan=NatureSpell&{name:string;mastery:number;owned:boolean;difficulty:number;pa:number;tension:number;damage:number;automatic:boolean;forced:boolean;mandatoryChannel:number};
export type NatureResources={
 mage:{tension:number;lastAffinity:string;dormant:boolean;pendingBacklash:number|null;blockedUntilRound:number|null;preparation:(SpellPlan&{paid:number;startedRound:number})|null;maintained:string[];usedRound:number|null};
 angelus:{aura:number;connected:boolean;holyPlace:boolean;bladeHp:number;offeringHp:number;effects:string[]};
 daemon:{resonancePlace:boolean;formProperties:string[];pendingFavor:{bonus:number;note:string;skill:string}|null};
 powerPreparation:{id:string;pa:number;aura:number;paid:number;startedRound:number}|null;
};
export type NatureLiveState={revelation:'v'|'sr'|'r';round:number;pa:number;hp:number|null;initiative:number|null;unconscious?:boolean;powerUses?:Record<string,number>;natureResources?:NatureResources};
export type NatureActionContext={inCombat:boolean;manager?:boolean;hp?:number;pvMax?:number;death?:number;permanentFortitude?:number;rollResult?:number;narrativeFailure?:boolean;spiritualDamage?:boolean;damage?:number};
export type NatureActionInput={action:string;spell?:unknown;invest?:number;amount?:number;id?:string;boost?:boolean;note?:string;skill?:string;connected?:boolean;holyPlace?:boolean;resonancePlace?:boolean;mageDormant?:boolean;clearTension?:boolean;aura?:number;properties?:string[];sacrifice?:number};
export class NatureActionError extends Error {constructor(public code:string){super(code);}}
function fail(code:string):never {throw new NatureActionError(code);}
const obj=(v:unknown):Record<string,any>=>v!==null&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,any>:{};
const int=(v:unknown,max:number,fallback=0)=>Number.isSafeInteger(v)&&Number(v)>=0&&Number(v)<=max?Number(v):fallback;
const strings=(v:unknown,max=30)=>Array.isArray(v)?[...new Set(v.filter((s):s is string=>typeof s==='string'&&s.length<=180))].slice(0,max):[];
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,'').toLowerCase();
const limitUsed=(state:NatureLiveState,key:string)=>int(state.powerUses?.[key],100000);
const mark=(state:NatureLiveState,key:string)=>{state.powerUses={...state.powerUses,[key]:limitUsed(state,key)+1};};
export function blankNatureResources():NatureResources{return {mage:{tension:0,lastAffinity:'',dormant:false,pendingBacklash:null,blockedUntilRound:null,preparation:null,maintained:[],usedRound:null},angelus:{aura:0,connected:true,holyPlace:false,bladeHp:0,offeringHp:0,effects:[]},daemon:{resonancePlace:false,formProperties:[],pendingFavor:null},powerPreparation:null};}
/** Only normalize persisted server state. Client save payloads must not own this field. */
export function normalizedNatureResources(value:unknown):NatureResources{
 const v=obj(value),m=obj(v.mage),a=obj(v.angelus),d=obj(v.daemon),base=blankNatureResources();
 const prep=obj(m.preparation),p=obj(v.powerPreparation);
 return {mage:{...base.mage,tension:int(m.tension,10000),lastAffinity:typeof m.lastAffinity==='string'?m.lastAffinity.slice(0,100):'',dormant:m.dormant===true,pendingBacklash:m.pendingBacklash===null||m.pendingBacklash===undefined?null:int(m.pendingBacklash,10000),blockedUntilRound:m.blockedUntilRound===null||m.blockedUntilRound===undefined?null:int(m.blockedUntilRound,100000),preparation:typeof prep.affinity==='string'&&Number.isSafeInteger(prep.pa)?prep as NatureResources['mage']['preparation']:null,maintained:strings(m.maintained),usedRound:m.usedRound===null||m.usedRound===undefined?null:int(m.usedRound,100000)},angelus:{aura:int(a.aura,10000),connected:a.connected!==false,holyPlace:a.holyPlace===true,bladeHp:int(a.bladeHp,3),offeringHp:int(a.offeringHp,10000),effects:strings(a.effects)},daemon:{resonancePlace:d.resonancePlace===true,formProperties:strings(d.formProperties,2).filter(x=>['flight','armour','weapon','amphibian'].includes(x)),pendingFavor:typeof obj(d.pendingFavor).note==='string'&&terraUmbraCreationRules.skills.some(s=>s.id===obj(d.pendingFavor).skill)?{bonus:3,note:obj(d.pendingFavor).note.slice(0,1000),skill:obj(d.pendingFavor).skill}:null},powerPreparation:typeof p.id==='string'&&Number.isSafeInteger(p.pa)?p as NatureResources['powerPreparation']:null};
}
export function natureAffinities(data:any){
 const t=liveTruthState(data),choice=pkg.structure.natures.mage.choices.find(c=>c.key==='dominantAffinity');
 const all=Object.entries(choice?.optionsBy??{}).flatMap(([mageius,rows])=>rows.map(row=>({...row,mageius})));
 const owned=new Set<string>();
 if(all.some(a=>a.id===t.choices.dominantAffinity&&a.mageius===t.choices.mageiusType))owned.add(String(t.choices.dominantAffinity));
 for(const id of t.truthTalents){const match=/^mage_(?:awaken|accord|traversee)_(.+)$/.exec(id);if(match&&all.some(a=>a.id===match[1]))owned.add(match[1]);}
 const rank=(affinity:string,kind:string,rows:readonly {id:string}[])=>{let level=0;for(let i=1;i<rows.length;i++){if(!t.truthTalents.includes(`mage_${affinity}_${kind}_${rows[i].id}`))break;level=i;}return level;};
 return all.map(a=>({...a,owned:owned.has(a.id),mastery:owned.has(a.id)?rank(a.id,'mastery',mageMasteries):-1,amplitude:owned.has(a.id)?rank(a.id,'amplitude',mageAmplitudes):-1}));
}
const difficultyScale=[12,15,18,21,25];
export function mageSpellPlan(data:any,state:NatureLiveState,raw:unknown):SpellPlan{
 const t=liveTruthState(data),r=obj(raw),a=natureAffinities(data).find(a=>a.id===r.affinity);
 if(t.nature!=='mage'||t.consciousness==='profane'||!a)fail('nature_spell_unavailable');
 const resources=normalizedNatureResources(state.natureResources);
 if(state.revelation==='v'||resources.mage.dormant||resources.mage.pendingBacklash!==null||state.unconscious||(resources.mage.blockedUntilRound!==null&&state.round<=resources.mage.blockedUntilRound))fail('mageius_unavailable');
 if(r.intent!==undefined&&!['hostile','support','narrative'].includes(r.intent))fail('invalid_spell_intent');
 const amplitude=mageAmplitudes.findIndex(x=>x.id===r.amplitude);
 if(amplitude<0||!['contact','will','sight'].includes(r.range)||!Number.isSafeInteger(r.channel)||r.channel<0||r.channel>100)fail('invalid_spell');
 const forceAmplitude=r.forceAmplitude===true,forceMastery=r.forceMastery===true,forced=forceAmplitude||forceMastery;
 if(forced&&!a.owned)fail('force_requires_owned_affinity');
 const maximum=a.owned?a.amplitude:0;
 if(amplitude>maximum+(forceAmplitude?1:0)||state.revelation==='sr'&&amplitude>0)fail('spell_amplitude_unavailable');
 if(forceAmplitude&&amplitude!==maximum+1||forceMastery&&a.mastery>=3)fail('invalid_superior_will');
 const difference=a.owned?maximum-amplitude:0;
 const baseIndex=amplitude+1; // Minor 15, Significant 18, Major 21, Cataclysmic 25.
 const adjusted=baseIndex-Math.max(0,difference)+(a.owned?0:1)+(r.range==='contact'?-1:r.range==='sight'?1:0);
 const mandatoryChannel=Math.max(0,adjusted-4);
 if(r.channel<mandatoryChannel)fail('mandatory_channel_missing');
 const difficulty=difficultyScale[Math.max(0,Math.min(4,adjusted-r.channel))];
 const automatic=difference>=2&&r.intent!=='hostile'&&r.opposed===false&&r.urgent===false&&r.contextDifficult===false;
 return {intent:r.intent??'narrative',affinity:a.id,name:a.name,amplitude:r.amplitude,range:r.range,channel:r.channel,opposed:r.opposed!==false||r.intent==='hostile',urgent:r.urgent!==false,contextDifficult:r.contextDifficult!==false,forceAmplitude,forceMastery,note:typeof r.note==='string'?r.note.slice(0,1200):'',mastery:Math.min(3,(a.owned?a.mastery:0)+(forceMastery?1:0)),owned:a.owned,difficulty,pa:amplitude+1+r.channel,tension:amplitude+1,damage:(amplitude+1)*6,automatic,forced,mandatoryChannel};
}
export function daemonSpectra(data:any){
 const t=liveTruthState(data),b=normalizeDaemonBuild(t.choices.daemonBuild),all=natureAffinities(data);if(t.nature!=='daemon'||t.consciousness==='profane'||t.choices.divinity!=='mephisto')return [];
 const result=[] as Array<{id:string;name:string;description?:string;mastery:number;amplitude:number;owned:true}>;
 for(const [id,mastery,amplitude,enabled] of [[b.spectralAffinity,daemonTalentIds.affined,daemonTalentIds.amplified,true],[b.secondSpectralAffinity,daemonTalentIds.secondAffined,daemonTalentIds.secondAmplified,t.truthTalents.includes(daemonTalentIds.polyphony)&&b.spectralAffinity!==b.secondSpectralAffinity]] as const){const a=all.find(a=>a.id===id);if(!enabled||!a)continue;result.push({id:a.id,name:a.name,description:a.description,owned:true,mastery:t.truthTalents.includes(mastery)?1:0,amplitude:t.truthTalents.includes(amplitude)?1:0});}return result;
}
export function daemonSpectrumPlan(data:any,state:NatureLiveState,raw:unknown){
 const t=liveTruthState(data),r=obj(raw),spectrum=daemonSpectra(data).find(a=>a.id===r.affinity);if(!spectrum||state.revelation!=='r'||state.unconscious)fail('spectrum_unavailable');if(r.forceMastery||r.forceAmplitude)fail('spectrum_cannot_force');
 const virtual={...data,truth:{...t,nature:'mage',choices:{mageiusType:natureAffinities(data).find(a=>a.id===spectrum.id)!.mageius,dominantAffinity:spectrum.id},truthTalents:[...(spectrum.mastery?[`mage_${spectrum.id}_mastery_affinee`]:[]),...(spectrum.amplitude?[`mage_${spectrum.id}_amplitude_significative`]:[])]},progression:{}};
 const clean={...state,natureResources:blankNatureResources()};return {...mageSpellPlan(virtual,clean,raw),tension:0};
}
function learnedFunctions(data:any){const t=liveTruthState(data),b=normalizeDaemonBuild(t.choices.daemonBuild),out=[String(t.choices.function??'')];if(t.truthTalents.includes(daemonTalentIds.formation)&&b.secondaryMentor.trim()&&b.secondaryFunction&&b.secondaryFunction!==t.choices.function)out.push(b.secondaryFunction);return out;}
function learnedAngelusNatures(data:any){const t=liveTruthState(data),b=normalizeAngelusBuild(t.choices.angelusBuild),out=[String(t.choices.angelNature??'')];const names:Record<string,string>={trone:'Trône',vertu:'Vertu',domination:'Domination'};const invested=(pkg.catalogs.angelus??[]).filter(p=>t.truthTalents.includes(p.id)&&p.group==='Nature : '+names[String(t.choices.angelNature)]).reduce((n,p)=>n+p.cost,0);if(t.truthTalents.includes(angelusTalentIds.cherub)&&invested>=3&&b.transcendenceEvent.trim()&&b.secondaryNature&&b.secondaryNature!==t.choices.angelNature)out.push(b.secondaryNature);return out;}
export function natureTalentAvailable(data:any,id:string):boolean{
 const t=liveTruthState(data);if(freeNaturePowers(data).some(row=>row.id===id))return true;const catalog=pkg.catalogs[t.nature]??[],row=catalog.find(r=>r.id===id);if(!row||!t.truthTalents.includes(id)||t.consciousness==='profane')return false;
 if(row.when&&!Object.entries(row.when).every(([key,w])=>Array.isArray(w)?w.includes(String(t.choices[key])):t.choices[key]===w))return false;
 if(row.requiredTalentIds?.some(x=>!t.truthTalents.includes(x))||row.anyRequiredTalentIds?.length&&!row.anyRequiredTalentIds.some(x=>t.truthTalents.includes(x)))return false;
 if(row.prerequisite&&!t.truthTalents.includes(row.prerequisite))return false;
 if(row.prerequisiteName){const predecessor=catalog.find(p=>norm(p.name)===norm(row.prerequisiteName!));if(predecessor&&!t.truthTalents.includes(predecessor.id))return false;}
 if(t.nature==='daemon'){
  const gods:Record<string,string>={alabor:'alabor',astaroth:'astaroth',belial:'belial',diablo:'diablo',lilith:'lilith',mammon:'mammon',mephisto:'mephisto',satan:'satan',lucifer:'lucifer',belzebuth:'belzebuth',abigor:'abigor',baal:'baal',morrighan:'morrighan'};
  const deity=Object.keys(gods).find(g=>norm(row.group).startsWith(g+' '));if(deity&&t.choices.divinity!==deity)return false;
  if(row.id.startsWith('daemon_clean_oracle_')&&!learnedFunctions(data).includes('oracle')||row.id.startsWith('daemon_clean_chatiment_')&&!learnedFunctions(data).includes('tourmenteur')||row.id.startsWith('daemon_clean_chevalier_')&&!learnedFunctions(data).includes('legionnaire'))return false;
  const b=normalizeDaemonBuild(t.choices.daemonBuild);
  if(id===daemonTalentIds.form&&!b.formProperties.length||id===daemonTalentIds.ritual&&(!b.riteDomain||!b.rites.length||b.rites.some(d=>daemonDefinitionIssues(d).length))||id===daemonTalentIds.remanence&&(t.choices.soulOrigin!=='ancien_prophete'||daemonDefinitionIssues(b.remanence).length))return false;
  const pathology=[[daemonTalentIds.disease,'disease'],[daemonTalentIds.contagion,'contagion'],[daemonTalentIds.pestilence,'pestilence']].find(([p])=>p===id);
  if(pathology&&!b.pathologies.some(p=>p.kind===pathology[1]&&!daemonPathologyIssues(p).length))return false;
 }
 if(t.nature==='angelus'){
  const names:Record<string,string>={trone:'Trône',vertu:'Vertu',domination:'Domination'};
  if(row.group.startsWith('Nature : ')&&!learnedAngelusNatures(data).some(n=>row.group==='Nature : '+names[n]))return false;
  if(row.group.startsWith('Les dix Sephiroth')){const chosen=pkg.structure.natures.angelus.choices.find(c=>c.key==='sephirah')?.options.find(o=>o.id===t.choices.sephirah);if(!chosen||!norm(row.group).includes(norm(chosen.name).split(' — ')[0]))return false;}
  if(id===angelusTalentIds.cherub&&learnedAngelusNatures(data).length<2)return false;
  if(id===angelusTalentIds.construct&&angelusConstructIssues(normalizeAngelusBuild(t.choices.angelusBuild).construct).length)return false;
 }
 return true;
}
export function freeNaturePowers(data:any){
 const t=liveTruthState(data),nature=pkg.structure.natures[t.nature];if(!nature||!['daemon','angelus'].includes(t.nature)||t.consciousness==='profane')return [];
 return nature.freeTraitRules.filter(rule=>Object.entries(rule.when).every(([key,value])=>Array.isArray(value)?value.includes(String(t.choices[key])):value===t.choices[key])).flatMap(rule=>rule.traits.filter(trait=>['Patron daemoniaque','Don archangélique','Faveur séraphique'].includes(trait.source??'')).map(trait=>({id:'trait:'+trait.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-'),name:trait.name,cost:0,group:trait.source??'',effect:trait.effect,access:trait.access,free:true,when:rule.when})));
}
export type NaturePower={id:string;name:string;text:string;access:string;stage:'v'|'sr'|'r';pa:number|null;aura:number;limit:'round'|'scene'|'day'|'scenario'|null;available:boolean;reason:string;resolution:'assisted'};
/** Read only explicit canonical cost fields. Missing parameters remain blocked, never guessed. */
export function naturePowers(data:any,state:NatureLiveState):NaturePower[]{
 const t=liveTruthState(data),resources=normalizedNatureResources(state.natureResources);
 if(!['daemon','angelus'].includes(t.nature)||t.consciousness==='profane')return [];
 return [...(pkg.catalogs[t.nature]??[]).filter(p=>t.truthTalents.includes(p.id)).map(p=>({...p,free:false})),...freeNaturePowers(data)].map(p=>{
  const cost=norm((('activation' in p?p.activation:'')??'')+' '+(p.access??'')+(p.free?' '+p.effect:'')),text=('effectDetails' in p?p.effectDetails:'')||p.effect,paMatch=/(\d+)\s*pa\b/.exec(cost),auraMatch=/(\d+)\s*aura\b/.exec(cost),frequency=norm(cost+' '+text);
  const reaction=/reaction/.test(cost),pa=paMatch?Number(paMatch[1]):reaction?1:/passif|progression|permanent|acquisition/.test(cost)?null:auraMatch||/sans pa|1\s*\/\s*(scene|scenario)|une fois par (scene|scenario)/.test(cost)?0:null;
  const aura=auraMatch?Number(auraMatch[1]):0;
  const quota=/1\s*\/\s*(round|scene|jour|scenario)/.exec(cost)??/^une fois par (round|scene|jour|scenario)/.exec(norm(text));
  const limit=quota?(quota[1]==='jour'?'day':quota[1]) as 'round'|'scene'|'day'|'scenario':null;
  const stage=/(?:^|\W)v(?:\W|$)/.test(cost)?'v':/(?:^|\W)sr(?:\W|$)/.test(cost)?'sr':'r';
  const allowed=stage==='v'||state.revelation==='r'||stage==='sr'&&state.revelation==='sr';
  const specialized=([natureResourceIds.boost,natureResourceIds.egide,natureResourceIds.offering,angelusTalentIds.reserve,angelusTalentIds.cherub] as string[]).includes(p.id);
  const ambiguousFree=p.free&&(/1\s*\/\s*scene\s*\/\s*cible/.test(cost)||/ensuite|plus tard|2 aura.*attaque|attaque.*pour 1 pa/.test(cost));
  const reason=ambiguousFree?'Variantes ou quota par cible : résolution MJ requise':!natureTalentAvailable(data,p.id)?'Conditions ou prérequis non remplis':!allowed?'État de Révélation insuffisant':state.unconscious?'Personnage incapable d’agir':specialized?'Commande dédiée ou effet passif':pa===null?'Progression ou effet passif':limit&&limitUsed(state,`${limit}:${p.id}`)>0?'Usage déjà dépensé':t.nature==='angelus'&&resources.angelus.aura<aura?'Aura insuffisante':'';
  return {id:p.id,name:p.name,text,access:p.access??'R',stage:stage as 'v'|'sr'|'r',pa,aura,limit,available:!reason,reason,resolution:'assisted'};
 });
}
export function natureResourceProfile(data:any,state:NatureLiveState,permanentFortitude=0){
 const t=liveTruthState(data),resources=normalizedNatureResources(state.natureResources),enabled=t.consciousness!=='profane';
 const talents=t.truthTalents.filter(id=>natureTalentAvailable(data,id));
 const capacity=angelusAuraCapacity(talents,permanentFortitude),aura=Math.min(capacity.maximum,resources.angelus.aura);
 const mageCanCast=enabled&&t.nature==='mage'&&state.revelation!=='v'&&!resources.mage.dormant&&resources.mage.pendingBacklash===null&&!state.unconscious&&!limitUsed(state,'round:mage-rest')&&(resources.mage.blockedUntilRound===null||state.round>resources.mage.blockedUntilRound);
 const boostUsed=limitUsed(state,'scene:'+natureResourceIds.boost)>0,canBoost=talents.includes(natureResourceIds.boost)&&!boostUsed;
 const favorLimit=talents.includes(natureResourceIds.resonance)?2:1,favorUsed=limitUsed(state,'scene:daemon-faveur-divine');
 return {nature:t.nature,enabled,resources,mage:{...resources.mage,affinities:natureAffinities(data),canCast:mageCanCast,canDischarge:mageCanCast&&talents.includes(natureResourceIds.discharge)&&!limitUsed(state,'round:'+natureResourceIds.discharge),dominant:String(t.choices.dominantAffinity??'')},angelus:{...resources.angelus,aura,maximum:capacity.maximum,rank:capacity.rank,canOpen:enabled&&t.nature==='angelus'&&state.revelation!=='v'&&resources.angelus.connected&&!state.unconscious&&aura<capacity.maximum,canFill:enabled&&t.nature==='angelus'&&state.revelation!=='v'&&resources.angelus.connected&&state.initiative===null&&!state.unconscious&&aura<capacity.maximum,recharge:resources.angelus.holyPlace?3:2,canBoost,boostUsed,egidePerAura:talents.includes(natureResourceIds.egide)?3:2,canBlade:learnedAngelusNatures(data).includes('domination'),hasOffering:talents.includes(natureResourceIds.offering),eyesActive:resources.angelus.effects.includes('celestial-eyes'),wingsActive:resources.angelus.effects.includes('celestial-wings')},daemon:{...resources.daemon,spectra:daemonSpectra(data),favorLimit,favorUsed,canFavor:enabled&&t.nature==='daemon'&&state.revelation!=='v'&&resources.daemon.resonancePlace&&!state.unconscious&&favorUsed<favorLimit&&!resources.daemon.pendingFavor},powers:naturePowers(data,state)};
}
function checkActor(data:any,state:NatureLiveState,nature:string,allowVoiled=false){const t=liveTruthState(data);if(t.nature!==nature||t.consciousness==='profane'||!allowVoiled&&state.revelation==='v')fail('nature_action_unavailable');if(state.unconscious)fail('cannot_react');}
function spendPa(state:NatureLiveState,amount:number,ctx:NatureActionContext){if(!Number.isSafeInteger(amount)||amount<0)fail('invalid_pa_cost');if(ctx.inCombat){if(state.initiative===null)fail('initiative_required');if(state.pa<amount)fail('insufficient_pa');state.pa-=amount;}return ctx.inCombat?amount:0;}
function requireNoPrep(r:NatureResources){if(r.mage.preparation||r.powerPreparation)fail('preparation_already_active');}
function applyBacklash(state:NatureLiveState,r:NatureResources,severity:number,ctx:NatureActionContext){
 const catastrophic=ctx.narrativeFailure===true||severity>=7,damage=catastrophic?7:severity>=5?5:3;
 state.hp=(ctx.hp??state.hp??0)-damage;state.pa=0;r.mage.preparation=null;r.mage.maintained=[];r.mage.dormant=true;r.mage.pendingBacklash=null;
 if(catastrophic)state.unconscious=true;else if(severity>=5)r.mage.blockedUntilRound=state.round+1;
 return {irreducibleDamage:damage,dormanceDays:catastrophic?'3 à 5':severity>=5?'environ 3':'environ 2',catastrophic};
}
/** Returns a cloned state plus a structured journal; lock, idempotency and random rolls belong to the route. */
export function applyNatureResourceAction<T extends NatureLiveState>(data:any,inputState:T,input:NatureActionInput,ctx:NatureActionContext):{state:T;payload:Record<string,unknown>;paCost:number}{
 const state=JSON.parse(JSON.stringify(inputState)) as T,r=normalizedNatureResources(state.natureResources),before=JSON.parse(JSON.stringify(r));state.natureResources=r;
 const profile=natureResourceProfile(data,state,ctx.permanentFortitude??0),t=liveTruthState(data);if(input.action!=='nature-settings'&&ctx.death!==undefined&&(ctx.hp??state.hp??0)<=ctx.death)fail('character_dead');let paCost=0,payload:Record<string,unknown>={action:input.action};
 if(input.action==='nature-settings'){
  if(!ctx.manager)fail('nature_settings_mj_only');
  for(const [k,v] of [['connected',input.connected],['holyPlace',input.holyPlace]] as const)if(v!==undefined){if(typeof v!=='boolean')fail('invalid_nature_settings');r.angelus[k]=v;}
  if(input.resonancePlace!==undefined){if(typeof input.resonancePlace!=='boolean')fail('invalid_nature_settings');r.daemon.resonancePlace=input.resonancePlace;}
  if(input.mageDormant!==undefined){if(typeof input.mageDormant!=='boolean')fail('invalid_nature_settings');r.mage.dormant=input.mageDormant;if(!input.mageDormant)r.mage.blockedUntilRound=null;}
  if(input.clearTension===true){r.mage.tension=0;r.mage.lastAffinity='';} // True calm certified by the MJ, never by a new combat.
  if(input.aura!==undefined){if(!Number.isSafeInteger(input.aura)||input.aura<0||input.aura>profile.angelus.maximum)fail('invalid_aura');r.angelus.aura=input.aura;}
  payload={...payload,label:'Conditions de Vérité fixées par le MJ'};
 }else if(input.action.startsWith('nature-mage-')){
  checkActor(data,state,'mage');
  if(input.action==='nature-mage-backlash'){
   if(r.mage.pendingBacklash===null)fail('backlash_not_pending');const severity=r.mage.pendingBacklash,difficulty=difficultyScale[Math.min(4,severity-3)];
   if(!Number.isFinite(ctx.rollResult))fail('nature_roll_required');
   const success=!ctx.narrativeFailure&&Number(ctx.rollResult)>=difficulty;
   payload={...payload,label:'Test de Revers',tension:severity,difficulty,total:ctx.rollResult,narrativeFailure:!!ctx.narrativeFailure,success,...(success?{}:applyBacklash(state,r,severity,ctx))};if(success)r.mage.pendingBacklash=null;
  }else{
   if(!profile.mage.canCast)fail('mageius_unavailable');
   if(input.action==='nature-mage-begin'){
    requireNoPrep(r);const spell=mageSpellPlan(data,state,input.spell),invest=ctx.inCombat?input.invest??Math.min(state.pa,spell.pa):spell.pa;
    if(!Number.isSafeInteger(invest)||invest<1||invest>spell.pa)fail('invalid_investment');paCost=spendPa(state,invest,ctx);r.mage.preparation={...spell,paid:invest,startedRound:state.round};r.mage.usedRound=state.round;
    payload={...payload,label:'Préparation du sort',spell:{...spell},invested:invest,remaining:spell.pa-invest};
   }else if(input.action==='nature-mage-invest'){
    const prep=r.mage.preparation;if(!prep)fail('spell_not_prepared');if(state.round>prep.startedRound+1)fail('preparation_interrupted');
    const amount=input.amount;if(!Number.isSafeInteger(amount)||Number(amount)<1||Number(amount)>prep.pa-prep.paid)fail('invalid_investment');paCost=spendPa(state,Number(amount),ctx);prep.paid+=Number(amount);prep.startedRound=state.round;r.mage.usedRound=state.round;payload={...payload,label:'Canalisation du sort',invested:amount,remaining:prep.pa-prep.paid};
   }else if(input.action==='nature-mage-release'){
    const prep=r.mage.preparation;if(!prep||prep.paid<prep.pa)fail('spell_not_ready');if(state.round>prep.startedRound+1)fail('preparation_interrupted');
    if(!prep.automatic&&!Number.isFinite(ctx.rollResult))fail('nature_roll_required');
    const changed=!!r.mage.lastAffinity&&r.mage.lastAffinity!==prep.affinity,equilibrated=changed&&natureTalentAvailable(data,natureResourceIds.equilibrium)&&!limitUsed(state,'round:'+natureResourceIds.equilibrium),reduction=changed?(equilibrated?2:1):0;
    r.mage.tension=Math.max(0,r.mage.tension-reduction)+prep.tension;r.mage.lastAffinity=prep.affinity;r.mage.usedRound=state.round;r.mage.preparation=null;if(equilibrated)mark(state,'round:'+natureResourceIds.equilibrium);
    const success=prep.automatic||!ctx.narrativeFailure&&Number(ctx.rollResult)>=prep.difficulty;
    if(prep.forced){payload={...payload,...applyBacklash(state,r,7,{...ctx,narrativeFailure:true})};}else if(r.mage.tension>=3)r.mage.pendingBacklash=r.mage.tension;
    payload={...payload,label:'Sort · '+prep.name,spell:prep,total:ctx.rollResult??null,narrativeFailure:!!ctx.narrativeFailure,success,tensionBefore:before.mage.tension,tensionAfter:r.mage.tension,affinityReduction:reduction,backlashRequired:r.mage.pendingBacklash!==null};
   }else if(input.action==='nature-mage-cancel'){
    if(!r.mage.preparation)fail('spell_not_prepared');payload={...payload,label:'Sort interrompu',lostPa:r.mage.preparation.paid,tensionAdded:0};r.mage.preparation=null;
   }else if(input.action==='nature-mage-rest'){
    if(!ctx.inCombat||r.mage.usedRound===state.round||r.mage.preparation||r.mage.maintained.length)fail('mage_rest_unavailable');
    const key='round:mage-rest';if(limitUsed(state,key))fail('power_already_used');paCost=spendPa(state,state.pa,ctx);r.mage.tension=Math.max(0,r.mage.tension-1);mark(state,key);payload={...payload,label:'Round sans utiliser le Mageius',tensionBefore:before.mage.tension,tensionAfter:r.mage.tension};
   }else if(input.action==='nature-mage-discharge'){
    if(!natureTalentAvailable(data,natureResourceIds.discharge))fail('nature_power_unavailable');if(!profile.mage.canDischarge)fail('power_already_used');if(!Number.isFinite(ctx.rollResult))fail('nature_roll_required');paCost=spendPa(state,1,ctx);mark(state,'round:'+natureResourceIds.discharge);r.mage.usedRound=state.round;
    const delta=ctx.narrativeFailure?1:Number(ctx.rollResult)>=15?-1:0;r.mage.tension=Math.max(0,r.mage.tension+delta);payload={...payload,label:'Décharge contrôlée',difficulty:15,total:ctx.rollResult,narrativeFailure:!!ctx.narrativeFailure,tensionBefore:before.mage.tension,tensionAfter:r.mage.tension};
   }else fail('unknown_nature_action');
  }
 }else if(input.action.startsWith('nature-angelus-')){
  checkActor(data,state,'angelus');r.angelus.aura=profile.angelus.aura;
  if(input.action==='nature-angelus-open'||input.action==='nature-angelus-fill'){
   if(!r.angelus.connected)fail('aureole_disconnected');if(r.angelus.aura>=profile.angelus.maximum)fail('aura_full');
   if(input.action==='nature-angelus-fill'){if(ctx.inCombat||state.initiative!==null)fail('aura_fill_outside_combat');r.angelus.aura=profile.angelus.maximum;}
   else {if(input.boost===true&&!profile.angelus.canBoost)fail('power_already_used');paCost=spendPa(state,1,ctx);r.angelus.aura=Math.min(profile.angelus.maximum,r.angelus.aura+(input.boost===true?4:profile.angelus.recharge));if(input.boost===true)mark(state,'scene:'+natureResourceIds.boost);}
   payload={...payload,label:input.action==='nature-angelus-fill'?'Réserve avant la scène':'Ouvrir l’Auréole',auraBefore:before.angelus.aura,auraAfter:r.angelus.aura,recovered:r.angelus.aura-before.angelus.aura,boost:input.boost===true};
  }else if(input.action==='nature-angelus-eyes'||input.action==='nature-angelus-wings'||input.action==='nature-angelus-impulse'){
   const effect=input.action==='nature-angelus-eyes'?'celestial-eyes':'celestial-wings';if(input.action!=='nature-angelus-eyes'&&state.revelation!=='r')fail('nature_power_unavailable');
   if(input.action!=='nature-angelus-impulse'&&r.angelus.effects.includes(effect))fail('power_already_active');if(r.angelus.aura<1)fail('insufficient_aura');
   paCost=spendPa(state,input.action==='nature-angelus-eyes'&&!ctx.inCombat?0:1,ctx);r.angelus.aura-=1;if(input.action!=='nature-angelus-impulse')r.angelus.effects.push(effect);
   payload={...payload,label:input.action==='nature-angelus-eyes'?'Yeux célestes':input.action==='nature-angelus-wings'?'Ailes transcendées':'Impulsion céleste',auraSpent:1,until:'scene',agilityBonus:input.action==='nature-angelus-wings'?1:0,movementMultiplier:input.action==='nature-angelus-impulse'?2:1};
  }else if(input.action==='nature-angelus-egide'){
   const amount=input.amount;if(!Number.isSafeInteger(amount)||Number(amount)<1||Number(amount)>3||Number(amount)>r.angelus.aura)fail('invalid_aura_spend');if(!ctx.spiritualDamage||!Number.isSafeInteger(ctx.damage)||Number(ctx.damage)<=0)fail('egide_not_applicable');
   paCost=spendPa(state,1,ctx);r.angelus.aura-=Number(amount);const reduction=Math.min(Number(ctx.damage),Number(amount)*profile.angelus.egidePerAura);payload={...payload,label:'Égide d’Aura',auraSpent:amount,damageReduction:reduction,damageAfter:Number(ctx.damage)-reduction};
  }else if(input.action==='nature-angelus-offering'){
   if(!natureTalentAvailable(data,natureResourceIds.offering))fail('nature_power_unavailable');const key='round:'+natureResourceIds.offering;if(limitUsed(state,key))fail('power_already_used');if((ctx.hp??state.hp??0)<=0||r.angelus.aura>=profile.angelus.maximum)fail('offering_unavailable');
   state.hp=(ctx.hp??state.hp??0)-1;r.angelus.offeringHp+=1;r.angelus.aura=Math.min(profile.angelus.maximum,r.angelus.aura+2);mark(state,key);payload={...payload,label:'Offrande vivante',irreducibleDamage:1,auraRecovered:r.angelus.aura-before.angelus.aura,unhealableUntil:'scene'};
  }else if(input.action==='nature-angelus-blade'){
   if(state.revelation!=='r'||!learnedAngelusNatures(data).includes('domination'))fail('nature_power_unavailable');if(r.angelus.bladeHp)fail('blade_already_active');const sacrifice=input.sacrifice??normalizeAngelusBuild(t.choices.angelusBuild).bladeSacrifice;
   if(![1,2,3].includes(sacrifice)||(ctx.hp??state.hp??0)-sacrifice<1||r.angelus.aura<1)fail('blade_unavailable');paCost=spendPa(state,1,ctx);r.angelus.aura-=1;r.angelus.bladeHp=sacrifice;state.hp=(ctx.hp??state.hp??0)-sacrifice;r.angelus.effects.push('celestial-blade');payload={...payload,label:'Lame céleste',sacrificedHp:sacrifice,damage:[0,7,9,11][sacrifice],form:normalizeAngelusBuild(t.choices.angelusBuild).bladeForm,auraSpent:1};
  }else if(input.action==='nature-angelus-dismiss-blade'){if(!r.angelus.bladeHp)fail('blade_not_active');r.angelus.bladeHp=0;r.angelus.effects=r.angelus.effects.filter(id=>id!=='celestial-blade');payload={...payload,label:'Lame céleste dissipée',recoveredHp:0};
  }else fail('unknown_nature_action');
 }else if(input.action.startsWith('nature-daemon-spectrum-')){
  checkActor(data,state,'daemon');if(state.revelation!=='r')fail('spectrum_unavailable');
  if(input.action==='nature-daemon-spectrum-begin'){requireNoPrep(r);const spell=daemonSpectrumPlan(data,state,input.spell),invest=ctx.inCombat?input.invest??Math.min(state.pa,spell.pa):spell.pa;if(!Number.isSafeInteger(invest)||invest<1||invest>spell.pa)fail('invalid_investment');paCost=spendPa(state,invest,ctx);r.mage.preparation={...spell,paid:invest,startedRound:state.round};payload={...payload,label:'Préparation du Spectre · '+spell.name,spell,invested:invest,remaining:spell.pa-invest};
  }else if(input.action==='nature-daemon-spectrum-invest'){const prep=r.mage.preparation;if(!prep||!daemonSpectra(data).some(a=>a.id===prep.affinity))fail('spectrum_not_prepared');if(state.round>prep.startedRound+1)fail('preparation_interrupted');const amount=input.amount;if(!Number.isSafeInteger(amount)||Number(amount)<1||Number(amount)>prep.pa-prep.paid)fail('invalid_investment');paCost=spendPa(state,Number(amount),ctx);prep.paid+=Number(amount);prep.startedRound=state.round;payload={...payload,label:'Canalisation du Spectre',remaining:prep.pa-prep.paid};
  }else if(input.action==='nature-daemon-spectrum-release'){const prep=r.mage.preparation;if(!prep||!daemonSpectra(data).some(a=>a.id===prep.affinity))fail('spectrum_not_prepared');if(prep.paid<prep.pa)fail('spell_not_ready');if(state.round>prep.startedRound+1)fail('preparation_interrupted');if(!Number.isFinite(ctx.rollResult))fail('nature_roll_required');r.mage.preparation=null;payload={...payload,label:'Spectre · '+prep.name,spell:prep,total:ctx.rollResult,narrativeFailure:!!ctx.narrativeFailure,success:!ctx.narrativeFailure&&Number(ctx.rollResult)>=prep.difficulty,tensionAdded:0,backlashRequired:false};
  }else if(input.action==='nature-daemon-spectrum-cancel'){if(!r.mage.preparation)fail('spectrum_not_prepared');payload={...payload,label:'Spectre interrompu',lostPa:r.mage.preparation.paid,auraSpent:0,tensionAdded:0};r.mage.preparation=null;
  }else fail('unknown_nature_action');
 }else if(input.action==='nature-daemon-favor'){
  checkActor(data,state,'daemon');if(!profile.daemon.canFavor)fail('divine_favor_unavailable');if(typeof input.note!=='string'||!input.note.trim())fail('favor_context_required');if(!terraUmbraCreationRules.skills.some(s=>s.id===input.skill))fail('favor_skill_required');mark(state,'scene:daemon-faveur-divine');r.daemon.pendingFavor={bonus:3,note:input.note.slice(0,1000),skill:input.skill!};payload={...payload,label:'Faveur divine',bonus:3,skill:input.skill,context:input.note.slice(0,1000),usage:limitUsed(state,'scene:daemon-faveur-divine'),limit:profile.daemon.favorLimit,applyToNextTest:true};
 }else if(input.action==='nature-power'){
  if(!['angelus','daemon'].includes(t.nature))fail('nature_power_unavailable');requireNoPrep(r);const power=profile.powers.find(p=>p.id===input.id);if(!power?.available||power.pa===null)fail('nature_power_unavailable');
  const invest=ctx.inCombat?input.invest??Math.min(state.pa,power.pa):power.pa;if(!Number.isSafeInteger(invest)||invest<0||invest>power.pa||power.pa>0&&invest<1)fail('invalid_investment');paCost=spendPa(state,invest,ctx);
  if(t.nature==='angelus')r.angelus.aura=profile.angelus.aura-power.aura;if(power.limit)mark(state,`${power.limit}:${power.id}`);
  r.powerPreparation={id:power.id,pa:power.pa,aura:power.aura,paid:invest,startedRound:state.round};payload={...payload,label:'Activation · '+power.name,powerId:power.id,canonicalText:power.text,auraSpent:power.aura,invested:invest,remaining:power.pa-invest,resolution:'assisted'};
 }else if(input.action==='nature-power-invest'){
  const p=r.powerPreparation;if(!p)fail('power_not_prepared');const power=profile.powers.find(row=>row.id===p.id);if(!power||!natureTalentAvailable(data,p.id)||state.unconscious||!(power.stage==='v'||state.revelation==='r'||power.stage==='sr'&&state.revelation==='sr'))fail('nature_power_unavailable');
  if(state.round>p.startedRound+1)fail('preparation_interrupted');const amount=input.amount;if(!Number.isSafeInteger(amount)||Number(amount)<1||Number(amount)>p.pa-p.paid)fail('invalid_investment');paCost=spendPa(state,Number(amount),ctx);p.paid+=Number(amount);p.startedRound=state.round;payload={...payload,label:'Préparation du pouvoir',powerId:p.id,invested:amount,remaining:p.pa-p.paid};
 }else if(input.action==='nature-power-release'||input.action==='nature-power-cancel'){
  const p=r.powerPreparation;if(!p)fail('power_not_prepared');if(input.action==='nature-power-release'&&p.paid<p.pa)fail('power_not_ready');
  const power=profile.powers.find(row=>row.id===p.id);
  if(input.action==='nature-power-release'&&(!natureTalentAvailable(data,p.id)||state.unconscious||!power||!(power.stage==='v'||state.revelation==='r'||power.stage==='sr'&&state.revelation==='sr')))fail('nature_power_unavailable');
  if(input.action==='nature-power-release'&&state.round>p.startedRound+1)fail('preparation_interrupted');r.powerPreparation=null;
  if(input.action==='nature-power-release'&&p.id===daemonTalentIds.form){const allowed=normalizeDaemonBuild(t.choices.daemonBuild).formProperties,chosen=input.properties??allowed.slice(0,2);if(!Array.isArray(chosen)||!chosen.length||chosen.length>2||chosen.some(x=>typeof x!=='string'||!allowed.includes(x)))fail('invalid_form_properties');r.daemon.formProperties=[...new Set(chosen)];}
  payload={...payload,label:(input.action==='nature-power-release'?'Pouvoir libéré · ':'Pouvoir interrompu · ')+(power?.name??p.id),powerId:p.id,canonicalText:power?.text??'',auraSpent:p.aura,paInvested:p.paid,resolution:'assisted',effectApplied:false};
 }else fail('unknown_nature_action');
 payload.paCost=paCost;return {state,payload,paCost};
}
export function resetNaturePeriod(state:NatureLiveState,period:'scene'|'scenario'){
 const r=normalizedNatureResources(state.natureResources);r.angelus.offeringHp=0;r.angelus.bladeHp=0;r.angelus.effects=[];r.daemon.formProperties=[];r.daemon.pendingFavor=null;r.powerPreparation=null;r.mage.preparation=null;r.mage.maintained=[];
 // Tension, current Aura, Dormance, connection and pending Revers persist; a scene is not recovery.
 state.natureResources=r;
}
export function natureHpCeiling(data:any,state:NatureLiveState,pvMax:number){const r=normalizedNatureResources(state.natureResources);return data.truth?.nature==='angelus'?Math.max(0,pvMax-r.angelus.bladeHp-r.angelus.offeringHp):pvMax;}

/** A prepared Faveur is used by the next explicitly selected matching test; callers must journal its context. */
export function consumeNatureTest(data:any,state:NatureLiveState,skill:string){const r=normalizedNatureResources(state.natureResources),t=liveTruthState(data);if(t.nature!=='daemon'||t.consciousness==='profane'||state.revelation==='v'||!r.daemon.pendingFavor||r.daemon.pendingFavor.skill!==skill)return null;const favor=r.daemon.pendingFavor;r.daemon.pendingFavor=null;state.natureResources=r;return {id:'daemon-faveur-divine',label:'Faveur divine',bonus:3,context:favor.note};}
export function natureAttributeModifiers(data:any,state:NatureLiveState){const r=normalizedNatureResources(state.natureResources);return data.truth?.nature==='angelus'&&data.truth?.consciousness!=='profane'&&state.revelation==='r'&&r.angelus.effects.includes('celestial-wings')?[{attribute:'agilite',amount:1,label:'Ailes transcendées'}]:[];}

export const consumeNatureRollBonus=consumeNatureTest;
