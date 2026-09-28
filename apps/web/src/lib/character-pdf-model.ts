import type { CharacterDataV2 } from '../types/character';
import { buildCharacterSheet, type SheetCore } from './character-sheet-model';
import { ensureProgression } from './progression';
import { augmentationLoad, ensureRealityState, equipmentStats, neuroCapacity, neuroRank, realityItemMap, type RealityRulesPackage } from './reality';
import { truthAngelusCapacity, truthAvailableTalents, truthChoiceLabel, truthChoiceOptions, truthRevelationProfile, truthSelectedFreeTraits, type TruthRulesPackage, type TruthState } from './truth';

export type PdfValue = string | boolean;
export type PdfSection = { title:string; text:string };
export type PdfInput = { data:CharacterDataV2; core:SheetCore; truth:TruthRulesPackage; reality:RealityRulesPackage; campaign:boolean; fallbackName?:string };
export type PdfProjection = { slug:string; name:string; portrait:string; values:Record<string,PdfValue>; labels:Record<string,string>; annex:PdfSection[] };
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
  if(nature==='humain')return raw.consciousness==='initie'&&text(choices.hunterTradition)&&choices.hunterTradition!=='aucune'?'chasseur':'realite';
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
  const values:Record<string,PdfValue>={}, labels:Record<string,string>={}, annex:PdfSection[]=[];
  const add=(title:string,value:unknown)=>{const content=text(value).trim();if(content)annex.push({title,text:content});};
  const put=(keys:string|string[],value:unknown,label:string,overflow=true)=>{
    const list=Array.isArray(keys)?keys:[keys];
    if(value===undefined||value===null||value==='')return false;
    const matches=list.filter(key=>available.has(key));
    for(const key of matches){values[key]=typeof value==='boolean'?value:text(value);labels[key]=label;}
    if(!matches.length&&overflow&&typeof value!=='boolean')add(label,value);
    return matches.length>0;
  };
  const real=(key:string,value:unknown,label=key.replaceAll('_',' '))=>put('reality.'+key,value,label);
  const choices=record(data.truth.choices);
  const state:TruthState={nature:text(data.truth.nature)||'humain',consciousness:text(data.truth.consciousness)||'profane',choices,
    truthTalents:strings(data.truth.truthTalents),truthEquipment:strings(data.truth.truthEquipment),corruptionTalents:strings(data.truth.corruptionTalents),
    truthEquipmentMjOverride:Boolean(data.truth.truthEquipmentMjOverride),corruptionMjAuthorized:Boolean(data.truth.corruptionMjAuthorized),
    corruption:Math.max(0,Number(data.truth.corruption)||0),corruptionSource:text(data.truth.corruptionSource)};
  const progress=ensureProgression(structuredClone(data.progression),core.rules.skills.map(s=>s.id),core.rules.attributes.map(a=>a.id));
  const currentState={...state,truthTalents:unique([...state.truthTalents,...(campaign?progress.truthTalents:[])]),corruptionTalents:unique([...state.corruptionTalents,...(campaign?progress.corruptionTalents:[])])};
  const talentMap=new Map(Object.values(truth.catalogs).flat().map(t=>[t.id,t]));
  for(const t of truthAvailableTalents(truth,currentState))talentMap.set(t.id,t);
  const corruptionMap=new Map(truth.corruption.talents.map(t=>[t.id,t]));
  const selectedReality=sheet.realityTalents.map(t=>t.id);
  const purchases=ensureRealityState(structuredClone(data.reality));
  purchases.equipment=purchases.equipment.filter(p=>campaign||!p.acquiredInCampaign);
  purchases.augmentations=purchases.augmentations.filter(p=>campaign||!p.acquiredInCampaign);
  const items=realityItemMap(reality), load=augmentationLoad(reality,purchases,selectedReality);
  const description=(entry:{name:string;detail?:string;group?:string})=>[entry.name,entry.group,entry.detail].filter(Boolean).join(' — ');
  const realityTalent=(id:string)=>sheet.realityTalents.find(t=>t.id===id);
  const talentText=(ids:string[])=>unique(ids).map(id=>{const t=realityTalent(id);return t?description(t):id;}).join('\n');

  real('nom',[sheet.name,data.identity.alias?`« ${data.identity.alias} »`:''].filter(Boolean).join(' '),'Nom / alias');
  real('concept',data.identity.concept,'Concept');
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
  real('talent_origine',talentText([data.talents.origin]),'Talent d’origine');
  real('talent_commun',talentText([data.talents.common]),'Talent commun');
  real('talents_sphere',talentText([data.talents.sphere]),'Talents de Sphère');
  real('talents_expertise',talentText([data.talents.expertise]),'Talents d’Expertise');
  const initial=new Set([data.talents.origin,data.talents.common,data.talents.sphere,data.talents.expertise]);
  real('autres_talents',talentText(selectedReality.filter(id=>!initial.has(id))),'Autres talents de Réalité');
  real('desavantages',sheet.disadvantages.map(description).join('\n'),'Désavantages');
  real('contacts',sheet.contacts.map(c=>[c.name,c.group,c.detail].filter(Boolean).join(' — ')).join('\n'),'Contacts');
  real('milieu_reputation',[sheet.renownMilieu,sheet.reputation].filter(Boolean).join(' — '),'Milieu / réputation');

  const equipment=purchases.equipment.map(p=>({purchase:p,item:items.get(p.itemId)}));
  const weapons=equipment.filter(({item})=>item&&equipmentStats(item).some(([k])=>k==='DGT'));
  for(const [index,{purchase,item}] of weapons.entries()){
    const title=item?.name??purchase.itemId, stats=item?Object.fromEntries(equipmentStats(item)):{};
    if(index>=5){add('Armes supplémentaires',[title,...Object.entries(stats).map(([k,v])=>`${k} : ${v}`),item?.effect].filter(Boolean).join(' — '));continue;}
    const prefix=`arme_${index+1}_`;
    real(prefix+'arme',title,`Arme ${index+1}`);real(prefix+'degats',stats.DGT,`${title} — dégâts`);real(prefix+'portee',stats['Portée'],`${title} — portée`);
    real(prefix+'proprietes_munitions',[stats['Propriétés'],stats['Capacité']?`Capacité ${stats['Capacité']}`:'',item?.effect].filter(Boolean).join(' — '),`${title} — propriétés / munitions`);
  }
  const armors=equipment.filter(({item})=>item&&equipmentStats(item).some(([k])=>['Armure','Protection','Balistique','Énergie'].includes(k)));
  real('armure_protection',armors.map(({item})=>`${item!.name} — ${equipmentStats(item!).map(([k,v])=>`${k} ${v}`).join(', ')}`).join('\n'),'Armure / protection');
  const vehicles=equipment.filter(({item})=>item?.vehicle);
  real('vehicule',vehicles.map(({item})=>item!.name).join(', '),'Véhicule');
  for(const {item} of vehicles)if(item?.effect)add('Véhicule — '+item.name,item.effect);
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
  const other=equipment.filter(({purchase})=>!used.has(purchase.uid)).map(({purchase,item})=>[item?.name??purchase.itemId,item?.effect].filter(Boolean).join(' — '));
  other.push(...recurring.filter(row=>!recurringHousing.includes(row)&&!recurringShelters.includes(row)).map(({purchase:p})=>`${p.name}${p.monthly?` — ${p.monthly} / mois`:''}`));
  real('autres_biens_abonnements',other.join('\n'),'Autres biens et abonnements');
  for(const [index,purchase] of purchases.augmentations.entries()){
    const item=items.get(purchase.itemId), title=item?.name??purchase.itemId;
    const notes=[purchase.gen2System!=null?`Système Gen2 ${purchase.gen2System}`:'',item?.effect].filter(Boolean).join(' — ');
    const detail=[title,item?.generation?`G${item.generation}`:'',item?.charge!=null?`Charge ${item.charge}`:'',item?.stress!=null?`Stress ${item.stress}`:'',notes].filter(Boolean).join(' — ');
    if(index>=5){add('Augmentations supplémentaires',detail);continue;}
    const prefix=`augmentation_${index+1}_`;
    real(prefix+'nom',title,`Augmentation ${index+1}`);real(prefix+'generation',item?.generation,`${title} — génération`);real(prefix+'charge',item?.charge,`${title} — charge`);real(prefix+'stress',item?.stress,`${title} — stress`);real(prefix+'notes',notes,`${title} — effet / système`);
  }
  const neuro=sheet.skills.find(s=>s.id==='neurodive')?.raw??0;
  real('rang_neuro',neuroRank(neuro),'Rang Neuro');real('capacite_programmes',neuroCapacity(neuro,selectedReality,data.disadvantages),'Capacité de programmes');
  real('programmes_charges',programs.filter(p=>p.purchase.loaded).length,'Programmes chargés');
  for(const [index,{purchase,item}] of programs.entries()){
    if(index>=5){add('Programmes supplémentaires',[item?.name??purchase.itemId,purchase.loaded?'Chargé':'Non chargé',item?.effect].filter(Boolean).join(' — '));continue;}
    real(`neuro_${index+1}_programme`,item?.name??purchase.itemId,`Programme ${index+1}`);real(`neuro_${index+1}_effet`,item?.effect,`${item?.name??purchase.itemId} — effet du programme`);
    put(`reality.neuro_${index+1}_charge`,Boolean(purchase.loaded),'Programme chargé',false);
  }
  add('Identité complémentaire',[data.identity.occupation?`Activité : ${data.identity.occupation}`:'',data.identity.age?`Âge : ${data.identity.age}`:'',data.identity.sex?`Sexe : ${data.identity.sex}`:'',data.identity.height?`Taille : ${data.identity.height}`:'',data.identity.weight?`Poids : ${data.identity.weight}`:''].filter(Boolean).join('\n'));
  add('Objectif',data.identity.objective);add('Notes du personnage',data.identity.notes);

  if(slug!=='realite'){
    put('truth.identity.name',[sheet.name,data.identity.alias].filter(Boolean).join(' / '),'Nom de Vérité / alias');
    put('truth.corruption.current',sheet.corruption,'Corruption actuelle');put('truth.corruption.source',sheet.corruptionSource,'Source de corruption');put('truth.integrity',sheet.derived.integrity,'Intégrité');
    put(['truth.ptv.available',`truth.${slug}.ptv.available`],sheet.ptvRemaining,'PTV disponibles',false);
    put(['truth.ptv.spent',`truth.${slug}.ptv.spent`],truth.structure.ptvInitial+(campaign?progress.ptvEarned:0)-sheet.ptvRemaining,'PTV dépensés',false);
    const celestial=truthAngelusCapacity(currentState,sheet.skills.find(skill=>skill.id==='force_mentale')?.value??0);
    if(celestial){
      for(const rank of ['angelus','cherub','seraph'])put(`truth.angelus.rank.${rank}`,rank===celestial.rank,'Rang céleste',false);
      put('truth.angelus.aura.max',celestial.maximum,'Aura maximale');
    }
    if(slug==='chasseur')put('truth.chasseur.real_nature','Humain','Nature réelle');
    const aliases:Record<string,string[]>={angelNature:['nature','angelNature'],sephirah:['sephirah','sephira'],archangel:['archangel','archange'],seraph:['seraphPatron','seraph','seraphin'],
      mageiusType:['type','mageius','mageiusType'],dominantAffinity:['affinity','dominantAffinity'],hunterTradition:['tradition','hunterTradition'],
      lineage:['lineage','lignee'],variant:['variant','variante'],blood:['nativeBlood','blood','sang'],pelage:['pelage'],court:['court','cour'],
      function:['function','fonction'],divinity:['divinity','divinite'],patron:['patron'],origin:['origin','origine'],tradition:['thirteenTradition','tradition'],
      seratheenTradition:['council','seratheenTradition','seratheen'],network:['organization','doctrine','network','reseau'],people:['people','peuple'],species:['species','espece']};
    for(const [key,value] of Object.entries(choices)){
      if(value===null||value===undefined||value===''||value==='aucune')continue;
      const spec=truth.structure.natures[state.nature]?.choices.find(c=>c.key===key);
      const rendered=truthChoiceLabel(truth,state,key)||text(value)||(Array.isArray(value)?value.map(text).join(', '):JSON.stringify(value));
      if((key==='people'||key==='species')&&rendered)continue; // The selected template already identifies the people.
      if(slug==='angelus'&&key==='angelNature'){
        const options:Record<string,string>={trone:'throne',vertu:'virtue',domination:'dominion'};
        for(const [id,field] of Object.entries(options))put(`truth.angelus.primaryNature.${field}`,value===id,'Nature angélique',false);
        continue;
      }
      if(slug==='daemon'&&key==='function'){
        const options:Record<string,string>={oracle:'oracle',tourmenteur:'punishment',legionnaire:'knight'};
        for(const [id,field] of Object.entries(options))put(`truth.daemon.function.${field}`,value===id,'Fonction daemoniaque',false);
        continue;
      }
      // A second hunting tradition must not overwrite a Nature's own tradition.
      if(key==='hunterTradition'&&slug!=='chasseur'){add('Tradition de Chasse',rendered);continue;}
      put(unique([key,...aliases[key]??[]]).flatMap(id=>[`truth.${slug}.${id}`,`truth.identity.${id}`]),rendered,spec?.label??key.replaceAll('_',' '));
    }
    const revelation=truth.revelation?truthRevelationProfile(truth,state):null;
    if(revelation){
      if(slug==='angelus'){
        put('truth.angelus.bonus.semiRevealed',revelation.stats.sr,'Bonus semi-révélé');put('truth.angelus.bonus.revealed',revelation.stats.r,'Bonus révélé');
      }else if(slug==='daemon'){
        put('truth.daemon.bonus.SR',revelation.stats.sr,'Bonus semi-révélé');put('truth.daemon.bonus.R',revelation.stats.r,'Bonus révélé');
      }else if(slug==='aseryn'){
        put('truth.aseryn.bonus.total.SR',revelation.stats.sr,'Bonus total semi-révélé');put('truth.aseryn.bonus.total.R',revelation.stats.r,'Bonus total révélé');
      }else if(slug==='khinae'){
        // Keep conditional water/land and variant rules intact. Never turn a
        // situational bonus into an unconditional character statistic.
        add('Formes de la lignée — '+revelation.label,revelation.stats.r);
        const base=truth.revelation.khinaeBase[text(choices.lineage)],variant=truth.revelation.khinaeVariant[text(choices.lineage)]?.[text(choices.variant)]??'';
        if(base)for(const form of ['animal','hybrid'] as const){
          const profile=base[form];
          if(/eau|terre/i.test(profile+variant))continue;
          for(const [label,key] of [['Vigueur','vigor'],['Agilité','agility']] as const){
            if(new RegExp(label,'i').test(variant))continue;
            const match=profile.match(new RegExp(`([+]\\d+) ${label}`,'i'));
            if(match)put(`truth.khinae.stats.${form}.${key}`,match[1],`${form} — bonus de ${label}`);
          }
        }
      }else if(slug==='garou'&&choices.blood==='sang_enchaine'){
        add('Sang Enchaîné — profil révélé, Mue hybride interdite',revelation.stats.r);
      }
    }
    const commonTraits=new Set((truth.structure.natures[state.nature]?.baseFreeTraits??[]).map(t=>`${t.name}|${t.effect}`));
    for(const trait of truthSelectedFreeTraits(truth,state)){
      const source=clean(trait.source??'');let prefix='';
      if(slug==='angelus')prefix=source.includes('sephirah')?'truth.angelus.gift.sephira.':source.includes('archangelique')?'truth.angelus.gift.archangel.':source.includes('seraphique')?'truth.angelus.gift.seraphic.':'';
      if(slug==='vampire'&&source.includes('cour'))prefix='truth.vampire.courtImprint.';
      if(slug==='daemon')prefix=source.includes('divinite')?'truth.daemon.imprint.':source.includes('patron')?'truth.daemon.favor.':'';
      if(slug==='garou'&&source.includes('pelage'))prefix='truth.garou.freeTradition.';
      if(slug==='khinae'&&source.includes('signature'))prefix='truth.khinae.signature.';
      if(prefix){put(prefix+'name',trait.name,'Don / trait personnel');put(prefix+'effect',[trait.access,trait.effect].filter(Boolean).join(' — '),`${trait.name} — effet`);put(prefix+'activation',trait.access,`${trait.name} — activation`,false);}
      else if(slug==='khinae'&&source.includes('biologie'))put('truth.khinae.morphology',[trait.name,trait.effect].join(' — '),'Biologie de la variante');
      else if(slug==='homo-superior'&&trait.name==='Patchs tatoués AIDH')put('truth.homo-superior.patches',[trait.name,trait.effect].join(' — '),'Patchs tatoués AIDH');
      else if(!commonTraits.has(`${trait.name}|${trait.effect}`))add(trait.name,[trait.access,trait.effect].filter(Boolean).join(' — '));
    }
    if(slug==='mage'){
      const choice=truth.structure.natures.mage?.choices.find(c=>c.key==='dominantAffinity');
      const native=choice?truthChoiceOptions(choice,choices):[];
      const owned=new Set([text(choices.dominantAffinity),...currentState.truthTalents.filter(id=>id.startsWith('mage_awaken_')).map(id=>id.slice(12))]);
      const allOptions=new Map([...(choice?.options??[]),...Object.values(choice?.optionsBy??{}).flat()].map(option=>[option.id,option]));
      const affinities=[...native,...[...owned].filter(id=>id&&!native.some(n=>n.id===id)).map(id=>allOptions.get(id)??{id,name:id})];
      for(const [index,affinity] of affinities.entries()){
        const prefix=`truth.mage.affinities.${String(index+1).padStart(2,'0')}.`;
        const learnt=(suffix:string)=>currentState.truthTalents.includes(`mage_${affinity.id}_${suffix}`);
        const mastery=learnt('mastery_magistrale')?'Magistrale':learnt('mastery_superieure')?'Supérieure':learnt('mastery_affinee')?'Affinée':owned.has(affinity.id)?'Initiale':'Dormante';
        const amplitude=learnt('amplitude_cataclysmique')?'Cataclysmique':learnt('amplitude_majeure')?'Majeure':learnt('amplitude_significative')?'Significative':owned.has(affinity.id)?'Mineure':'';
        put(prefix+'name',affinity.name,'Affinité');put(prefix+'type',native.some(n=>n.id===affinity.id)?'Native':'Acquise',`${affinity.name} — type`);put(prefix+'dominant',choices.dominantAffinity===affinity.id?'Oui':'',`${affinity.name} — dominante`);put(prefix+'mastery',mastery,`${affinity.name} — maîtrise`);put(prefix+'amplitude',amplitude,`${affinity.name} — amplitude`);
      }
    }
    const talents=sheet.truthTalents;
    const talentCapacity=[...available].filter(name=>/^truth\.talents\.\d+\.name$/.test(name)).length;
    for(const [index,talent] of talents.entries()){
      const reference=talentMap.get(talent.id)??corruptionMap.get(talent.id);
      const effect=pdfTalentEffect(reference?.effect??talent.detail??'',talent.name);
      const detail=[talent.name,talent.group,effect].filter(Boolean).join(' — ');
      if(index>=talentCapacity){add(`Talent de Vérité — ${talent.name}`,[detail,reference?.group,reference?.access,reference?`${reference.cost} PTV`:''].filter(Boolean).join(' — '));continue;}
      const prefix=`truth.talents.${String(index+1).padStart(2,'0')}.`;
      put(prefix+'name',talent.name,`Talent de Vérité ${index+1}`);put(prefix+'source',reference?.group??talent.group,`${talent.name} — voie / source`);
      put(prefix+'ptv',reference?.cost,`${talent.name} — coût PTV`);put(prefix+'activation',reference?.access,`${talent.name} — accès / activation`);
      put(prefix+'effect',[effect,talent.group].filter(Boolean).join(' — '),`${talent.name} — effet`);
    }
    for(const id of state.truthEquipment){const item=truth.equipment.find(t=>t.id===id);add('Équipement de Vérité',[item?.name??id,item?.lore].filter(Boolean).join(' — '));}
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
  return {slug,name:sheet.name||'Personnage',portrait:sheet.identity.portraitDataUrl,values,labels,annex};
}
