import {selectedHunterDoctrines,hunterDoctrines} from "./hunter";
import {exileOwnedItems,exileUsableTalents,normalizeExileBuild} from "./exile";
import {extralOwnedItems,normalizeExtralBuild} from './extral';
import {mageOwnedAffinities} from "./mage";
import {angelusTalentIds} from './angelus';
import {daemonTalentIds} from './daemon';
import {appearanceGallery} from '../../../api/src/character-appearances';
import {aserynChoiceFields} from './aseryn';
import {isKhinae,khinaeBodyProfile,khinaeProfileText,khinaeNativeBlood,khinaeBloodOptions} from './khinae';
import {vampireNativeBlood,vampireBloodOptions} from './vampire';
import type { CharacterDataV2 } from '../types/character';
import { buildCharacterSheet, type SheetCore } from './character-sheet-model';
import { ensureProgression } from './progression';
import { augmentationLoad, ensureRealityState, equipmentStats, neuroCapacity, neuroRank, realityItemMap, type RealityRulesPackage } from './reality';
import { truthAngelusCapacity, truthAvailableTalents, truthKnownTalents, truthChoiceLabel, truthChoiceOptions, truthRevelationProfile, truthSelectedFreeTraits, type TruthRulesPackage, type TruthState } from './truth';

export type PdfValue = string | boolean;
export type PdfSection = { title:string; text:string };
export type PdfAnnexEntry = PdfSection & {fieldName:string};
export type PdfInput = { data:CharacterDataV2; core:SheetCore; truth:TruthRulesPackage; reality:RealityRulesPackage; campaign:boolean; fallbackName?:string };
export type PdfProjection = { slug:string; name:string; portrait:string; portraitReality:string; portraitTruth:string; fields:Record<string,PdfValue>; values:Record<string,PdfValue>; labels:Record<string,string>; annex:PdfSection[]; annexEntries:PdfAnnexEntry[] };
const EXILES = ['elye','whurten','ashyll','thulkar','azmenorien'];
const EXTRALS = ['talass','mosen','baseanh','rocreen','thalsios','homo_superior','adrak'];
const DIRECT = ['angelus','vampire','mage','daemon','aseryn','garou','khinae'];
const record=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const strings=(v:unknown):string[]=>Array.isArray(v)?v.filter((x):x is string=>typeof x==='string'):[];
const text=(v:unknown)=>typeof v==='string'||typeof v==='number'?String(v):'';
const unique=(v:string[])=>[...new Set(v.filter(Boolean))];
const clean=(v:string)=>v.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function pdfTalentEffect(value:string,name:string){
  let result=value.replace(/<\/(?:p|div|li|h[1-6]|tr)>|<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,'');
  if(result.startsWith(name)&&/^\s*Profil\s*:/.test(result.slice(name.length)))result=result.slice(name.length);
  return result.replace(/\s*(Profil\s*:|Prérequis\s*:|Effet\s*:|Limite\s*:)/g,'\n$1')
    .replace(/(Passif|Permanent|1\/scène|1\/round|[12] PA)(?=[A-ZÀ-ÖØ-Þ])/g,'$1\n').trim();
}

export function dossierSlug(raw:Record<string,unknown>):string {
  const nature=text(raw.nature)||'humain', choices=record(raw.choices);
  if(nature==='humain')return raw.consciousness==='initie'&&selectedHunterDoctrines({nature,choices}).length>0?'chasseur':'realite';
  if(DIRECT.includes(nature))return nature;
  if(nature==='exile'&&EXILES.includes(text(choices.people)))return text(choices.people);
  if(nature==='extral'&&EXTRALS.includes(text(choices.species)))return text(choices.species).replace('_','-');
  throw new Error(nature==='exile'?'Choisis le peuple exilé avant d’exporter son dossier.':nature==='extral'?'Choisis le profil extral avant d’exporter son dossier.':'Cette Nature ne dispose pas encore d’un dossier PDF.');
}

/** Pure, read-only projection. Session values absent from the app remain blank. */
export function projectCharacterPdf(input:PdfInput, available:ReadonlySet<string>):PdfProjection {
  const {data,core,truth,reality,campaign}=input;
  const slug=dossierSlug(data.truth);
  const sheet=buildCharacterSheet(data,core,truth,reality,campaign,input.fallbackName);
  const values:Record<string,PdfValue>={}, labels:Record<string,string>={}, annex:PdfSection[]=[],annexEntries:PdfAnnexEntry[]=[];
  const add=(title:string,value:unknown,fieldName='')=>{const content=text(value).trim();if(content&&!annexEntries.some(entry=>entry.title===title&&entry.text===content)){annex.push({title,text:content});annexEntries.push({fieldName,title,text:content});}};
  const put=(keys:string|string[],value:unknown,label:string,overflow=true)=>{
    const list=Array.isArray(keys)?keys:[keys];
    if(value===undefined||value===null||value==='')return false;
    const matches=list.filter(key=>available.has(key));
    for(const key of matches){values[key]=typeof value==='boolean'?value:text(value);labels[key]=label;}
    if(!matches.length&&overflow&&typeof value!=='boolean')add(label,value,list[0]);
    return matches.length>0;
  };
  const append=(keys:string|string[],value:unknown,label:string)=>{
    const target=(Array.isArray(keys)?keys:[keys]).find(key=>available.has(key));
    const content=text(value).trim();
    if(!content)return false;
    if(!target)return false;
    values[target]=[text(values[target]),content].filter(Boolean).join('\n\n');labels[target]=label;return true;
  };
  const background=(key:string,value:unknown,label:string)=>put('bg.'+key,value,label,key!=='concept');
  const packed=available.has('reality.talents.01.detail');
  const real=(key:string,value:unknown,label=key.replaceAll('_',' '))=>{
    if(value===undefined||value===null||value==='')return false;
    if(packed&&!available.has('reality.'+key)){
      if(['langues','contacts','milieu_reputation','vehicule','habitation','planque_refuge','autres_biens_abonnements'].includes(key))return append('reality.resources.compact',`${label} : ${text(value)}`,label);
      if(['charge_totale','integrite','stress_aug_base'].includes(key))return append('reality.augmentationTotals',`${label} : ${text(value)}`,label);
      if(key==='xp_disponibles')return put('reality.xp.summary',`XP disponibles : ${text(value)}`,'XP disponibles / dépensés');
      if(key==='xp_depenses')return put('reality.xp.summary',[text(values['reality.xp.summary']),`dépensés : ${text(value)}`].filter(Boolean).join(' / '),'XP disponibles / dépensés');
      if(['ptv_disponibles','ptv_depenses'].includes(key))return available.has('truth.ptv.available')?false:append('reality.resources.compact',`${label} : ${text(value)}`,label);
    }
    return put('reality.'+key,value,label);
  };
  const choices=record(data.truth.choices);
  const state:TruthState={nature:text(data.truth.nature)||'humain',consciousness:text(data.truth.consciousness)||'profane',choices,
    truthTalents:strings(data.truth.truthTalents),truthEquipment:strings(data.truth.truthEquipment),corruptionTalents:strings(data.truth.corruptionTalents),
    truthEquipmentMjOverride:Boolean(data.truth.truthEquipmentMjOverride),corruptionMjAuthorized:Boolean(data.truth.corruptionMjAuthorized),
    corruption:Math.max(0,Number(data.truth.corruption)||0),corruptionSource:text(data.truth.corruptionSource)};
  const progress=ensureProgression(structuredClone(data.progression),core.rules.skills.map(s=>s.id),core.rules.attributes.map(a=>a.id));
  if(state.nature==='exile')state.exileInventory=exileOwnedItems(data.reality,campaign,[...reality.equipment,...reality.augmentations]);
  if(state.nature==='extral')state.extralInventory=extralOwnedItems(data.reality,campaign,[...reality.equipment,...reality.augmentations]);
  const currentState={...state,truthTalents:unique([...state.truthTalents,...(campaign?progress.truthTalents:[])]),corruptionTalents:unique([...state.corruptionTalents,...(campaign?progress.corruptionTalents:[])])};
  const talentMap=new Map(Object.values(truth.catalogs).flat().map(t=>[t.id,t]));
  for(const talent of truthKnownTalents(truth,currentState))talentMap.set(talent.id,talent);
  for(const t of truthAvailableTalents(truth,currentState))talentMap.set(t.id,t);
  const corruptionMap=new Map(truth.corruption.talents.map(t=>[t.id,t]));
  const selectedReality=sheet.realityTalents.map(t=>t.id);
  const purchases=ensureRealityState(structuredClone(data.reality));
  purchases.equipment=purchases.equipment.filter(p=>campaign||!p.acquiredInCampaign);
  purchases.augmentations=purchases.augmentations.filter(p=>campaign||!p.acquiredInCampaign);
  const items=realityItemMap(reality), load=augmentationLoad(reality,purchases,selectedReality,[...exileUsableTalents(truth,currentState)]);
  const description=(entry:{name:string;detail?:string;group?:string})=>[entry.name,entry.group,entry.detail].filter(Boolean).join(' — ');
  const realityTalent=(id:string)=>sheet.realityTalents.find(t=>t.id===id);
  const talentText=(ids:string[])=>unique(ids).map(id=>{const t=realityTalent(id);return t?description(t):id;}).join('\n');

  real('nom',[sheet.name,data.identity.alias?`« ${data.identity.alias} »`:''].filter(Boolean).join(' '),'Nom / alias');
  const concept=data.identity.concept;
  real('concept',available.has('bg.concept')&&concept.length>44?concept.split('\n')[0].slice(0,43)+'…':concept,'Concept');
  real('origine',sheet.origin,'Origine');real('sphere',sheet.sphere,'Sphère');real('style',sheet.style,'Style');
  real('langue_native',sheet.languages[0],'Langue native');real('langues',sheet.languages.join(', '),'Langues');
  for(const attr of sheet.attributes)real(attr.id,attr.value,attr.name);
  for(const skill of sheet.skills)real(skill.id==='neurodive'?'neurodrive':skill.id,skill.value,skill.name);
  for(const [key,value] of Object.entries({pv_max:sheet.derived.pvMax,seuil_mort:sheet.derived.death,defense_physique:sheet.derived.passiveDefense,
    defense_occulte:sheet.derived.occultDefense,deplacement:sheet.derived.movement,seuil_augmentique:sheet.derived.augmentStressMax,
    initiative:sheet.derived.initiative,attaque_melee:sheet.derived.melee,attaque_pugilat:sheet.derived.pugilat,
    attaque_tir:sheet.derived.shooting,attaque_neurodrive:sheet.derived.neurodive,argent:campaign?sheet.cash:sheet.account,train_de_vie:sheet.lifestyle,
    charge_totale:load.charge,integrite:sheet.derived.integrity,stress_aug_base:load.stress,xp_disponibles:campaign?sheet.xpRemaining:0,
    xp_depenses:campaign?Math.max(0,progress.xpEarned)-sheet.xpRemaining:0,ptv_disponibles:sheet.ptvRemaining,
    ptv_depenses:truth.structure.ptvInitial+(campaign?progress.ptvEarned:0)-sheet.ptvRemaining}))real(key,value);
  for(let n=0;n<9;n++)put(`reality.edge_${n}`,sheet.edge===n,`Edge ${n}`,false);
  if(sheet.edge<0||sheet.edge>8)add('Edge disponible',sheet.edge);
  for(let n=0;n<6;n++)put(`reality.renommee_${n}`,sheet.renown===n,`Renommée ${n}`,false);
  const initial=new Set([data.talents.origin,data.talents.common,data.talents.sphere,data.talents.expertise]);
  if(packed){
    const ordered=unique([data.talents.origin,data.talents.common,data.talents.sphere,data.talents.expertise,...selectedReality]);
    for(const [index,id] of ordered.entries())put(`reality.talents.${String(index+1).padStart(2,'0')}.detail`,talentText([id]),`Talent de Réalité — ${realityTalent(id)?.name??id}`);
  }else{
    real('talent_origine',talentText([data.talents.origin]),'Talent d’origine');
    real('talent_commun',talentText([data.talents.common]),'Talent commun');
    real('talents_sphere',talentText([data.talents.sphere]),'Talents de Sphère');
    real('talents_expertise',talentText([data.talents.expertise]),'Talents d’Expertise');
    real('autres_talents',talentText(selectedReality.filter(id=>!initial.has(id))),'Autres talents de Réalité');
  }
  real('desavantages',sheet.disadvantages.map(description).join('\n'),'Désavantages');
  real('contacts',sheet.contacts.map(c=>[c.name,c.group,c.detail].filter(Boolean).join(' — ')).join('\n'),'Contacts');
  real('milieu_reputation',[sheet.renownMilieu,sheet.reputation].filter(Boolean).join(' — '),'Milieu / réputation');

  const equipment=purchases.equipment.map(p=>({purchase:p,item:items.get(p.itemId)}));
  const weapons=equipment.filter(({item})=>item&&equipmentStats(item).some(([k])=>k==='DGT'));
  for(const [index,{purchase,item}] of weapons.entries()){
    const title=item?.name??purchase.itemId, stats=item?Object.fromEntries(equipmentStats(item)):{};
    if(index>=5){const detail=[title,...Object.entries(stats).map(([k,v])=>`${k} : ${v}`),item?.effect].filter(Boolean).join(' — ');if(!append('reality.equipment.details',detail,'Armes supplémentaires'))add('Armes supplémentaires',detail,`reality.arme_${index+1}_arme`);continue;}
    const prefix=`arme_${index+1}_`;
    real(prefix+'arme',title,`Arme ${index+1}`);real(prefix+'degats',stats.DGT,`${title} — dégâts`);real(prefix+'portee',stats['Portée'],`${title} — portée`);
    real(prefix+'proprietes_munitions',[stats['Propriétés'],stats['Capacité']?`Capacité ${stats['Capacité']}`:'',item?.effect].filter(Boolean).join(' — '),`${title} — propriétés / munitions`);
  }
  const armors=equipment.filter(({item})=>item&&equipmentStats(item).some(([k])=>['Armure','Protection','Balistique','Énergie'].includes(k)));
  real('armure_protection',armors.map(({item})=>`${item!.name} — ${equipmentStats(item!).map(([k,v])=>`${k} ${v}`).join(', ')}`).join('\n'),'Armure / protection');
  const vehicles=equipment.filter(({item})=>item?.vehicle);
  real('vehicule',vehicles.map(({item})=>item!.name).join(', '),'Véhicule');
  for(const {item} of vehicles)if(item?.effect&&!append('reality.resources.compact',`${item.name} — ${item.effect}`,'Véhicule'))add('Véhicule — '+item.name,item.effect,'reality.vehicule');
  const shelterPattern=/planque|refuge|cache (secrete|sure)|abri/;
  const housingPattern=/logement|habitation|hebergement|residence|appartement|maison|villa|studio/;
  const housing=equipment.filter(({item})=>item&&housingPattern.test(clean(`${item.category} ${item.name}`)));
  const shelters=equipment.filter(({item})=>item&&shelterPattern.test(clean(`${item.category} ${item.name}`)));
  const recurring=purchases.fixedChargeItems.map(p=>({purchase:p,item:p.sourceItemId?items.get(p.sourceItemId):undefined}));
  const recurringText=(row:typeof recurring[number])=>clean(`${row.purchase.name} ${row.item?.name??''} ${row.item?.category??''}`);
  const recurringShelters=recurring.filter(row=>shelterPattern.test(recurringText(row)));
  const recurringHousing=recurring.filter(row=>housingPattern.test(recurringText(row))&&!recurringShelters.includes(row));
  real('habitation',[...housing.map(({item})=>item!.name),...recurringHousing.map(({purchase})=>purchase.name)].join(', '),'Habitation');
  real('planque_refuge',[...shelters.map(({item})=>item!.name),...recurringShelters.map(({purchase})=>purchase.name)].join(', '),'Planque / refuge');
  const used=new Set([...weapons,...armors,...vehicles,...housing,...shelters].map(e=>e.purchase.uid));
  const programs=equipment.filter(({item})=>item?.neuro);
  for(const {purchase} of programs)used.add(purchase.uid);
  const other=equipment.filter(({purchase})=>!used.has(purchase.uid)).map(({purchase,item})=>{const entry=sheet.inventory.find(entry=>entry.id===purchase.uid);return entry?description(entry):[item?.name??purchase.itemId,item?.effect,purchase.loanEffect].filter(Boolean).join(' — ');});
  other.push(...recurring.filter(row=>!recurringHousing.includes(row)&&!recurringShelters.includes(row)).map(({purchase})=>{const entry=sheet.inventory.find(entry=>entry.id===purchase.uid);return entry?description(entry):`${purchase.name}${purchase.monthly!=null?` — ${purchase.monthly} / mois`:''}`;}));
  real('autres_biens_abonnements',other.join('\n'),'Autres biens et abonnements');
  for(const [index,purchase] of purchases.augmentations.entries()){
    const item=items.get(purchase.itemId), title=item?.name??purchase.itemId;
    const ownedEntry=sheet.inventory.find(entry=>entry.id===purchase.uid);
    const notes=[purchase.gen2System!=null?`Système Gen2 ${purchase.gen2System}`:'',ownedEntry?.detail??item?.effect,ownedEntry?.group].filter(Boolean).join(' — ');
    const detail=[title,item?.generation?`G${item.generation}`:'',item?.charge!=null?`Charge ${item.charge}`:'',item?.stress!=null?`Stress ${item.stress}`:'',notes].filter(Boolean).join(' — ');
    if(packed){append('reality.augmentations.compact',detail,'Augmentations et neuroprogrammes');continue;}
    if(index>=5){add('Augmentations supplémentaires',detail);continue;}
    const prefix=`augmentation_${index+1}_`;
    real(prefix+'nom',title,`Augmentation ${index+1}`);real(prefix+'generation',item?.generation,`${title} — génération`);real(prefix+'charge',item?.charge,`${title} — charge`);real(prefix+'stress',item?.stress,`${title} — stress`);real(prefix+'notes',notes,`${title} — effet / système`);
  }
  const neuro=sheet.skills.find(s=>s.id==='neurodive')?.raw??0;
  const neuroSummary=`Rang Neuro : ${neuroRank(neuro)} · Capacité : ${neuroCapacity(neuro,selectedReality,data.disadvantages)} · Programmes chargés : ${programs.filter(p=>p.purchase.loaded).length}`;
  if(packed)append('reality.augmentations.compact',neuroSummary,'Augmentations et neuroprogrammes');
  else{real('rang_neuro',neuroRank(neuro),'Rang Neuro');real('capacite_programmes',neuroCapacity(neuro,selectedReality,data.disadvantages),'Capacité de programmes');real('programmes_charges',programs.filter(p=>p.purchase.loaded).length,'Programmes chargés');}
  for(const [index,{purchase,item}] of programs.entries()){
    if(packed){append('reality.augmentations.compact',[item?.name??purchase.itemId,purchase.loaded?'Chargé':'Non chargé',item?.effect].filter(Boolean).join(' — '),'Augmentations et neuroprogrammes');continue;}
    if(index>=5){add('Programmes supplémentaires',[item?.name??purchase.itemId,purchase.loaded?'Chargé':'Non chargé',item?.effect].filter(Boolean).join(' — '));continue;}
    real(`neuro_${index+1}_programme`,item?.name??purchase.itemId,`Programme ${index+1}`);real(`neuro_${index+1}_effet`,item?.effect,`${item?.name??purchase.itemId} — effet du programme`);
    put(`reality.neuro_${index+1}_charge`,Boolean(purchase.loaded),'Programme chargé',false);
  }
  put('bg.name',[sheet.name,data.identity.alias].filter(Boolean).join(' / '),'Nom / alias',false);
  background('identity',[data.identity.nationality?`Nationalité : ${data.identity.nationality}`:'',data.identity.occupation?`Activité : ${data.identity.occupation}`:'',data.identity.age!==undefined&&data.identity.age!==''?`Âge : ${data.identity.age}`:'',data.identity.sex?`Sexe : ${data.identity.sex}`:'',data.identity.height?`Taille : ${data.identity.height}`:'',data.identity.weight?`Poids : ${data.identity.weight}`:'',data.identity.publicDescription].filter(Boolean).join(' · '),'Identité complémentaire');
  background('concept',data.identity.concept,'Concept complet');background('objective',data.identity.objective,'Objectif');background('history.01',data.identity.notes,'Notes du personnage');
  const extraIdentity=record(data.identity),social=record(data.social),rawTruth=record(data.truth);
  background('history.02',extraIdentity.history??extraIdentity.background??social.history??rawTruth.history,'Histoire, formation et éveil');
  background('secrets',extraIdentity.secrets??social.secrets??rawTruth.secrets,'Liens, obligations et informations réservées');
  background('campaign',extraIdentity.campaignNotes??record(data.progression).notes??social.campaignNotes,'Événements et évolutions');
  if(packed){
    for(const {purchase,item} of equipment.filter(({purchase})=>used.has(purchase.uid))){
      const entry=sheet.inventory.find(entry=>entry.id===purchase.uid);
      const extraDetail=entry?.detail&&item?.effect&&entry.detail.startsWith(item.effect)?entry.detail.slice(item.effect.length).trim():entry?.detail;
      const annotation=[extraDetail||purchase.loanEffect,purchase.sphereSupport?'Appui de Sphère':'',purchase.talentGrant?'Prêt de talent non revendable':''].filter(Boolean).join('\n');
      if(annotation)append('reality.equipment.details',`${entry?.name??item?.name??purchase.itemId}\n${annotation}`,'Provenance et contraintes du matériel');
    }
    for(const {purchase,item} of [...housing,...shelters]){const entry=sheet.inventory.find(entry=>entry.id===purchase.uid);if(entry?.detail||item?.effect)append('reality.resources.compact',description(entry??{name:item?.name??purchase.itemId,detail:item?.effect}),'Logement et refuge');}
    for(const {purchase} of [...recurringHousing,...recurringShelters]){const entry=sheet.inventory.find(entry=>entry.id===purchase.uid);if(entry)append('reality.resources.compact',description(entry),'Logement et charges fixes');}
    for(const entry of sheet.inventory.filter(entry=>entry.id.startsWith('everyday-')))append('reality.resources.compact',description(entry),'Biens et appuis');
    for(const entry of sheet.talentRules??[])append('reality.resources.compact',description(entry),'Rappels et contraintes');
    for(const skill of sheet.skills)for(const context of skill.contexts??[])append('reality.resources.compact',`${skill.name} — ${context.label} : ${context.total}`, 'Bonus conditionnels');
  }

  if(slug!=='realite'){
    put('truth.identity.name',[sheet.name,data.identity.alias].filter(Boolean).join(' / '),'Nom de Vérité / alias');
    put('truth.corruption.current',sheet.corruption,'Corruption actuelle');put('truth.corruption.source',sheet.corruptionSource,'Source de corruption');put('truth.integrity',sheet.derived.integrity,'Intégrité');
    put(['truth.ptv.available',`truth.${slug}.ptv.available`],sheet.ptvRemaining,'PTV disponibles',false);
    put(['truth.ptv.spent',`truth.${slug}.ptv.spent`],truth.structure.ptvInitial+(campaign?progress.ptvEarned:0)-sheet.ptvRemaining,'PTV dépensés',false);
    const celestial=truthAngelusCapacity(currentState,sheet.skills.find(skill=>skill.id==='force_mentale')?.value??0);
    if(celestial){
      for(const rank of ['angelus','cherub','seraph'])put(`truth.angelus.rank.${rank}`,rank===celestial.rank,'Rang céleste',false);
      put('truth.angelus.aura.max',celestial.maximum,'Aura maximale');
      put('truth.angelus.rankLabel',celestial.rank==='cherub'?'Chérubin':celestial.rank==='seraph'?'Séraphin':'Angelus','Rang céleste',false);
    }
    if(slug==='chasseur'){
      put('truth.chasseur.real_nature','Humain','Nature réelle');
      const doctrines=selectedHunterDoctrines(state).map(id=>hunterDoctrines.find(d=>d.id===id)?.name??id).join(' · ');
      put('truth.chasseur.tradition',doctrines,'Doctrines de Chasse');
    }
    const aliases:Record<string,string[]>={angelNature:['primaryNatureLabel','nature','angelNature'],sephirah:['sephirah','sephira'],archangel:['archangel','archange'],seraph:['seraphPatron','seraph','seraphin'],seraphPatron:['seraphPatron'],
      mageiusType:['type','mageius','mageiusType'],dominantAffinity:['affinity','dominantAffinity'],hunterTradition:['tradition','hunterTradition'],
      lineage:['lineage','lignee'],variant:['variant','variante'],blood:['nativeBlood','blood','sang'],pelage:['pelage'],court:['court','cour'],
      function:['functionLabel','function','fonction'],divinity:['divinity','divinite'],patron:['patron'],soulOrigin:['originLabel'],origin:['origin','origine'],tradition:['thirteenTradition','tradition'],
      seratheenTradition:['council','seratheenTradition','seratheen'],network:['organization','doctrine','network','reseau'],people:['people','peuple'],species:['species','espece']};
    for(const [key,value] of Object.entries(choices)){
      if(key.endsWith('Build')||['beneficiaryBenefits','mageTechniques'].includes(key)||value===null||value===undefined||value===''||value==='aucune')continue;
      const spec=truth.structure.natures[state.nature]?.choices.find(c=>c.key===key);
      const extraChoice=aserynChoiceFields(currentState).find(choice=>choice.key===key);
      const rendered=extraChoice?.options.find(option=>option.id===value)?.name||truthChoiceLabel(truth,currentState,key)||text(value)||(Array.isArray(value)?value.map(text).join(', '):JSON.stringify(value));
      if((key==='people'||key==='species')&&rendered)continue; // The selected template already identifies the people.
      if(slug==='angelus'&&key==='angelNature'){
        put('truth.angelus.primaryNatureLabel',rendered,'Nature angélique',false);
        const options:Record<string,string>={trone:'throne',vertu:'virtue',domination:'dominion'};
        for(const [id,field] of Object.entries(options))put(`truth.angelus.primaryNature.${field}`,value===id,'Nature angélique',false);
        continue;
      }
      if(slug==='daemon'&&key==='function'){
        put('truth.daemon.functionLabel',rendered,'Fonction daemoniaque',false);
        const options:Record<string,string>={oracle:'oracle',tourmenteur:'punishment',legionnaire:'knight'};
        for(const [id,field] of Object.entries(options))put(`truth.daemon.function.${field}`,value===id,'Fonction daemoniaque',false);
        continue;
      }
      // A second hunting tradition must not overwrite a Nature's own tradition.
      if(key==='hunterTradition'&&slug==='chasseur')continue;
      const label=spec?.label??extraChoice?.label??key.replaceAll('_',' ');
      if(key==='hunterTradition'&&slug!=='chasseur'){if(!append('bg.history.02',`Tradition de Chasse : ${rendered}`,'Formation et traditions'))add('Tradition de Chasse',rendered,'truth.chasseur.tradition');continue;}
      const targets=unique([key,...aliases[key]??[]]).flatMap(id=>[`truth.${slug}.${id}`,`truth.identity.${id}`]);
      if(!put(targets,rendered,label,false)&&!append('bg.history.02',`${label} : ${rendered}`,'Histoire, formation et éveil'))add(label,rendered,targets[0]);
    }
    const revelation=truth.revelation?truthRevelationProfile(truth,currentState):null;
    if(isKhinae(currentState))put(`truth.${slug}.nativeBlood`,khinaeBloodOptions(truth,currentState).find(option=>option.id===khinaeNativeBlood(currentState))?.name??khinaeNativeBlood(currentState),'Sang vif natif',false);
    if(slug==='vampire')put('truth.vampire.nativeBlood',vampireBloodOptions(truth).find(option=>option.id===vampireNativeBlood(currentState))?.name??vampireNativeBlood(currentState),'Sang noir natif',false);
    if(revelation){
      put('truth.profile.SR',revelation.stats.sr,'Profil total semi-révélé',false);put('truth.profile.R',revelation.stats.r,'Profil total révélé',false);
      if(slug==='angelus'){
        put('truth.angelus.bonus.semiRevealed',revelation.stats.sr,'Bonus semi-révélé',false);put('truth.angelus.bonus.revealed',revelation.stats.r,'Bonus révélé',false);
      }else if(slug==='daemon'){
        put('truth.daemon.bonus.SR',revelation.stats.sr,'Bonus semi-révélé',false);put('truth.daemon.bonus.R',revelation.stats.r,'Bonus révélé',false);
      }else if(slug==='aseryn'){
        put('truth.aseryn.bonus.total.SR',revelation.stats.sr,'Bonus total semi-révélé',false);put('truth.aseryn.bonus.total.R',revelation.stats.r,'Bonus total révélé',false);
      }else if(slug==='khinae'){
        const forms=(['human','animal','hybrid'] as const).map(form=>`${form==='human'?'Humain':form==='animal'?'Animal':'Hybride'} : ${khinaeProfileText(khinaeBodyProfile(truth,currentState,form))}`);
        if(!append('truth.khinae.morphology',forms.join('\n'),'Formes de la lignée — '+revelation.label))add('Formes de la lignée — '+revelation.label,forms.join('\n'),'truth.khinae.morphology');
        for(const form of ['animal','hybrid'] as const){
          const dry=khinaeBodyProfile(truth,currentState,form,false),wet=khinaeBodyProfile(truth,currentState,form,true);
          if(!dry.available)continue;
          for(const key of ['vigor','agility','damage','armor'] as const){
            const value=dry[key]===wet[key]?String(dry[key]):`${dry[key]} terre / ${wet[key]} eau`;
            put(`truth.khinae.stats.${form}.${key}`,value,`${form} — ${key}`,false);
          }
        }
      }else if(slug==='garou'){
        const title='Profils corporels Révélés';
        if(!append('truth.garou.packLinks',revelation.stats.r,title))add(title,revelation.stats.r,'truth.garou.packLinks');
      }
    }
    const commonTraits=new Set((truth.structure.natures[state.nature]?.baseFreeTraits??[]).map(t=>`${t.name}|${t.effect}`));
    let aserynTrait=0;
    for(const trait of truthSelectedFreeTraits(truth,currentState)){
      const source=clean(trait.source??'');let prefix='';
      if(slug==='angelus')prefix=source.includes('sephir')?'truth.angelus.gift.sephira.':source.includes('archangelique')?'truth.angelus.gift.archangel.':source.includes('seraphique')?'truth.angelus.gift.seraphic.':'';
      if(slug==='vampire'&&source.includes('cour'))prefix='truth.vampire.courtImprint.';
      if(slug==='daemon')prefix=source.includes('divinite')?'truth.daemon.imprint.':source.includes('patron')?'truth.daemon.favor.':'';
      if(slug==='garou'&&source.includes('pelage'))prefix='truth.garou.freeTradition.';
      if(slug==='khinae'&&source.includes('signature'))prefix='truth.khinae.signature.';
      const composite=[trait.name,trait.access,trait.effect].filter(Boolean).join(' — ');
      if(prefix){put(prefix+'name',trait.name,'Don / trait personnel',false);if(!append(prefix+'effect',available.has(prefix+'name')?[trait.access,trait.effect].filter(Boolean).join(' — '):composite,`${trait.name} — effet`))put(prefix+'effect',composite,`${trait.name} — effet`);put(prefix+'activation',trait.access,`${trait.name} — activation`,false);}
      else if(slug==='angelus'&&source.includes('nature')){if(!append('truth.angelus.natureGift',composite,'Don fondamental de Nature'))add(trait.name,composite,'truth.angelus.natureGift');}
      else if(slug==='daemon'&&source.includes('fonction')){if(!append('truth.daemon.functionGift',composite,'Don de Fonction'))add(trait.name,composite,'truth.daemon.functionGift');}
      else if(slug==='aseryn'&&/^(Trace|Signature)\b/.test(trait.name)){const target=aserynTrait++===1?'truth.aseryn.trace02.effect':'truth.aseryn.imprint.effect';if(!append(target,composite,trait.name))add(trait.name,composite,target);}
      else if(slug==='khinae'&&source.includes('biologie')){if(!append('truth.khinae.morphology',composite,'Biologie de la variante'))add(trait.name,composite,'truth.khinae.morphology');}
      else if(slug==='homo-superior'&&trait.name==='Patchs tatoués AIDH'){if(!append('truth.homo-superior.patches',composite,'Patchs tatoués AIDH'))add(trait.name,composite,'truth.homo-superior.patches');}
      else if(!commonTraits.has(`${trait.name}|${trait.effect}`)&&!(packed&&(state.nature==='extral'||state.nature==='exile'))){if(!append('bg.history.02',composite,'Traits personnels gratuits'))add(trait.name,composite,'truth.freeTraits');}
    }
    if(slug==='mage'){
      const choice=truth.structure.natures.mage?.choices.find(c=>c.key==='dominantAffinity');
      const native=choice?truthChoiceOptions(choice,choices):[];
      const owned=mageOwnedAffinities(currentState);
      const allOptions=new Map([...(choice?.options??[]),...Object.values(choice?.optionsBy??{}).flat()].map(option=>[option.id,option]));
      const affinities=[...native,...[...owned].filter(id=>id&&!native.some(n=>n.id===id)).map(id=>allOptions.get(id)??{id,name:id})];
      for(const [index,affinity] of affinities.entries()){
        const prefix=`truth.mage.affinities.${String(index+1).padStart(2,'0')}.`;
        const learnt=(suffix:string)=>currentState.truthTalents.includes(`mage_${affinity.id}_${suffix}`);
        const mastery=learnt('mastery_magistrale')?'Magistrale':learnt('mastery_superieure')?'Supérieure':learnt('mastery_affinee')?'Affinée':owned.has(affinity.id)?'Initiale':'Dormante';
        const amplitude=learnt('amplitude_cataclysmique')?'Cataclysmique':learnt('amplitude_majeure')?'Majeure':learnt('amplitude_significative')?'Significative':owned.has(affinity.id)?'Mineure':'';
        put(prefix+'name',affinity.name,'Affinité');put(prefix+'type',native.some(n=>n.id===affinity.id)?'Native':'Acquise',`${affinity.name} — type`);put(prefix+'dominant',packed?choices.dominantAffinity===affinity.id:choices.dominantAffinity===affinity.id?'Oui':'',`${affinity.name} — dominante`);put(prefix+'mastery',mastery,`${affinity.name} — maîtrise`);put(prefix+'amplitude',amplitude,`${affinity.name} — amplitude`);
      }
    }
    const powerNotes=new Map<string,string[]>();
    const note=(id:string,value:string)=>{powerNotes.set(id,[...powerNotes.get(id)??[],value]);};
    const route=(targets:string[],title:string,value:string)=>{if(!append(targets,value,title)&&!append('bg.history.02',`${title}\n${value}`,'Histoire, formation et éveil'))add(title,value,targets[0]??'bg.history.02');};
    for(const entry of sheet.mageTechniques??[]){
      const technique=entry.technique;
      const content=technique?[
        `${entry.label} — ${technique.name}`,technique.effect,entry.requirementsText,`${technique.pa??'À définir'} PA · ${technique.range||'Portée à définir'} · ${technique.tension??'À définir'} Tension`,
        `Transmission / conception : ${technique.source}`,`Règle particulière : ${technique.exception}`,
        entry.kind==='echo'?'Écho exact : −1 niveau de Difficulté intrinsèque, minimum 12 ; sans Affinité éveillée, Initiale / Mineure seulement.':'',
        ...entry.issues,'Description à convenir avec le MJ ; aucune activation automatique.'
      ].filter(Boolean).join('\n'):'Acquisition conservée — définition à compléter.';
      if(available.size===0)add(`${entry.label} — ${technique?.name||'À compléter'}`,content);
      else note(entry.id,content);
      put(entry.kind==='echo'?'truth.mage.echo':'truth.mage.personalWork',[entry.label,technique?.name].filter(Boolean).join(' — '),entry.label,false);
    }
    const angelusIds:Record<string,string>={cherub:angelusTalentIds.cherub,liaison:angelusTalentIds.liaison,sins:angelusTalentIds.sin,shape:angelusTalentIds.shape,construct:angelusTalentIds.construct};
    const daemonIds:Record<string,string>={secondary:daemonTalentIds.formation,form:daemonTalentIds.form,remanence:daemonTalentIds.remanence};
    for(const [entries,ids] of [[sheet.angelusDetails??[],angelusIds],[sheet.daemonDetails??[],daemonIds]] as const){
      for(const entry of entries){
        const content=[entry.title,entry.body,...entry.parameters.map(parameter=>`${parameter.label} : ${parameter.value}`),...entry.issues,'Description à convenir avec le MJ ; aucune activation automatique.'].filter(Boolean).join('\n');
        if(available.size===0){add(entry.title,content);continue;}
        const id=ids[entry.id]??(entry.id.startsWith('rite-')?daemonTalentIds.ritual:entry.id.startsWith('pathology-disease')?daemonTalentIds.disease:entry.id.startsWith('pathology-contagion')?daemonTalentIds.contagion:entry.id.startsWith('pathology-pestilence')?daemonTalentIds.pestilence:'');
        if(id)note(id,content);
        else if(entry.id==='blade')route(['truth.angelus.natureGift'],entry.title,content);
        else if(entry.id.startsWith('spectrum-'))route(['truth.daemon.imprint.effect'],entry.title,content);
        else if(!append('bg.secrets',content,'Liens et conditions particulières'))add(entry.title,content,'bg.secrets');
      }
    }
    const extralBuild=normalizeExtralBuild(choices.extralBuild),exileBuild=normalizeExileBuild(choices.exileBuild);
    for(const [index,preparation] of extralBuild.preparations.entries()){
      put(`truth.baseanh.tardolla.${String(index+1).padStart(2,'0')}`,[preparation.name,`${preparation.remaining} dose(s) · ${preparation.kind}`,preparation.effect,`Résistance : ${preparation.resistance}`,`Durée : ${preparation.duration}`].join('\n'),'Préparation Tardollas — '+(preparation.name||String(index+1)));
    }
    const linkedDetails=new Map<string,string>();
    for(const project of extralBuild.projects)linkedDetails.set('extral-project-'+project.uid,project.talentId);
    for(const work of exileBuild.works)linkedDetails.set('exile-work-'+work.uid,work.talentId);
    for(const project of exileBuild.projects)linkedDetails.set('exile-project-'+project.uid,project.talentId);
    for(const entry of sheet.truthDetails??[]){
      if(available.size===0&&/^(hunter-|extral-|exile-|beneficiary-)/.test(entry.id)){add(entry.name,[entry.value,entry.description].filter(Boolean).join('\n'));continue;}
      if(entry.id.startsWith('extral-prep-')||entry.id==='extral-tardollas')continue;
      if(entry.id.startsWith('affinity-')||entry.id==='angelus-rank'||entry.id==='angelus-aura'||entry.id==='hunter-doctrines')continue;
      const id=linkedDetails.get(entry.id)??(entry.id.startsWith('hunter-')?entry.id.slice(7):entry.id.startsWith('extral-')?entry.id.slice(7):'');
      const content=[entry.name,entry.value,entry.description].filter(Boolean).join('\n');
      if(id&&currentState.truthTalents.includes(id)){note(id,content);continue;}
      if(Object.hasOwn(choices,entry.id)){
        const description=entry.description?.trim();
        const alreadyPresent=description&&Object.values(values).some(value=>typeof value==='string'&&value.includes(description));
        if(description&&!alreadyPresent&&!append('bg.history.02',`${entry.name} — ${description}`,'Histoire, formation et éveil'))add(entry.name,description,'bg.history.02');
        continue;
      }
      const targets=entry.id.startsWith('extral-patch-')?['truth.homo-superior.patches']:entry.id==='extral-training'?[`truth.${slug}.training`,'truth.identity.training']:entry.id==='extral-hydration'?['truth.rocreen.hydration.notes']:entry.id==='vampire-bloods'?['truth.vampire.awakenedBloods']:entry.id==='khinae-bloods'?[`truth.${slug}.awakenedBloods`]:entry.id==='extral-body'||entry.id==='exile-body'?[`truth.${slug}.morphology`,`truth.${slug}.carapace`,`truth.${slug}.adaptations`]:entry.id.startsWith('hunter-')?['truth.chasseur.prey','truth.chasseur.neutralization']:[];
      route(targets,entry.name,content);
    }
    const talents=sheet.truthTalents.filter((talent,index,entries)=>entries.findIndex(other=>other.id===talent.id)===index);
    const talentCapacity=[...available].filter(name=>/^truth\.(?:talents\.\d+\.name|powers\.\d+\.access)$/.test(name)).length;
    for(const [index,talent] of talents.entries()){
      const reference=talentMap.get(talent.id)??corruptionMap.get(talent.id);
      const extended=reference&&'effectDetails'in reference?reference.effectDetails:undefined;
      const activation=reference&&'activation'in reference?reference.activation:undefined;
      const summary=pdfTalentEffect(reference?.effect||talent.detail||'',talent.name),full=pdfTalentEffect(extended||'',talent.name);
      const effect=unique([full&&full.includes(summary)?'':summary,full,...powerNotes.get(talent.id)??[]]).join('\n\n');
      const access=[talent.name,...unique([reference?.group??'',talent.group??'']),reference?`${reference.cost} PTV`:'',reference?.access,activation].filter(Boolean).join(' — ');
      if(index>=talentCapacity){add(`Talent de Vérité — ${talent.name}`,[access,effect].filter(Boolean).join('\n'),`truth.powers.${String(index+1).padStart(2,'0')}.effect`);continue;}
      const powerPrefix=`truth.powers.${String(index+1).padStart(2,'0')}.`;
      if(available.has(powerPrefix+'access')){put(powerPrefix+'access',access,`Talent de Vérité — ${talent.name}`);put(powerPrefix+'effect',[effect,talent.group].filter(Boolean).join('\n'),`${talent.name} — effet`);continue;}
      const prefix=`truth.talents.${String(index+1).padStart(2,'0')}.`;
      put(prefix+'name',talent.name,`Talent de Vérité ${index+1}`);put(prefix+'source',unique([reference?.group??'',talent.group??'']).join(' — '),`${talent.name} — voie / source`);
      put(prefix+'ptv',reference?.cost,`${talent.name} — coût PTV`);put(prefix+'activation',[reference?.access,activation].filter(Boolean).join(' — '),`${talent.name} — accès / activation`);
      put(prefix+'effect',[effect,talent.group].filter(Boolean).join(' — '),`${talent.name} — effet`);
    }
    for(const id of state.truthEquipment){const item=truth.equipment.find(t=>t.id===id);const content=[item?.name??id,item?.lore,...(item?.properties??[]).map(property=>`${property.label} : ${property.value}`)].filter(Boolean).join('\n');if(!append('reality.resources.compact',content,'Équipement de Vérité'))add('Équipement de Vérité',content,'reality.resources.compact');}
  }else{
    // Human characters without a hunting tradition use the two Reality pages,
    // but exceptional Truth purchases/corruption must still survive in annexes.
    for(const talent of sheet.truthTalents){
      const reference=talentMap.get(talent.id)??corruptionMap.get(talent.id);
      add(`Talent de Vérité — ${talent.name}`,[talent.group,reference?.group,reference?.access,reference?`${reference.cost} PTV`:'',pdfTalentEffect(reference?.effect??talent.detail??'',talent.name)].filter(Boolean).join(' — '));
    }
    if(sheet.corruption||sheet.corruptionSource)add('Corruption',[`Corruption : ${sheet.corruption}`,`Intégrité : ${sheet.derived.integrity}`,sheet.corruptionSource].filter(Boolean).join(' — '));
    for(const id of state.truthEquipment){const item=truth.equipment.find(t=>t.id===id);add('Équipement de Vérité',[item?.name??id,item?.lore].filter(Boolean).join(' — '));}
  }
  const portraitReality=appearanceGallery(data.appearances,'reality',data.identity).primary?.src??'';
  const portraitTruth=appearanceGallery(data.appearances,'truth').primary?.src??'';
  return {slug,name:sheet.name||'Personnage',portrait:portraitReality,portraitReality,portraitTruth,fields:values,values,labels,annex,annexEntries};
}
