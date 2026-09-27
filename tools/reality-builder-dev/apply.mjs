import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {dirname,resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const files=new Set();
function put(path,content){mkdirSync(dirname(path),{recursive:true});writeFileSync(path,content);files.add(path);}
function sub(path,from,to,count=1){const s=readFileSync(path,'utf8');const hits=s.split(from).length-1;if(hits!==count)throw new Error(`${path}: expected ${count}, found ${hits}: ${from.slice(0,100)}`);put(path,s.split(from).join(to));}
function rx(path,pattern,fn,count=1){const s=readFileSync(path,'utf8');let hits=0;const next=s.replace(pattern,(...args)=>{hits++;return typeof fn==='function'?fn(...args):fn;});if(hits!==count)throw new Error(`${path}: ${pattern} matched ${hits}, expected ${count}`);put(path,next);}
if(process.env.GITHUB_REF&&process.env.GITHUB_REF!=='refs/heads/feature/tuc-web-v2')throw new Error('Only the V2 development branch is authorized.');
const root='apps/web/src/';
const reality=root+'lib/reality.ts',progress=root+'lib/progression.ts',equipment=root+'components/builder/EquipmentStep.vue',step=root+'components/builder/ProgressionStep.vue',page=root+'pages/CharacterBuilderPage.vue',sheet=root+'lib/character-sheet-model.ts';
sub(reality,'  campaignCommerceDegree?:number;','  campaignCommerceDegree?:number;\n  cataloguePrice?:number;\n  supplierPurchase?:boolean;\n  talentGrant?:string;\n  grantCreated?:boolean;\n  loanEffect?:string;');
sub(reality,'  grantOriginalMonthly?:number;','  grantOriginalMonthly?:number;\n  grantAcquiredInCampaign?:boolean;');
sub(reality,'export type RealityStyle={','export type RealityStyle={\n  skills?:readonly string[];');
sub(progress,'  xpEarned:number;','  xpEarned:number;\n  renownAdjustment:number;\n  realityTalentChoices:Record<string,unknown>;\n  profilCalibreUsed:boolean;');
sub(progress,'    xpEarned:Math.max(0,Number(raw.xpEarned)||0),','    xpEarned:Math.max(0,Number(raw.xpEarned)||0),\n    renownAdjustment:Number.isFinite(Number(raw.renownAdjustment))?Math.max(-5,Math.min(5,Math.trunc(Number(raw.renownAdjustment)))):0,\n    realityTalentChoices:{...record(raw.realityTalentChoices)},\n    profilCalibreUsed:Boolean(raw.profilCalibreUsed),');
const lore='apps/api/src/rules/terra-umbra-creation-lore.ts';
rx(lore,/  profil_calibre: \{[^\n]+\},/g,'  profil_calibre: {kind:"skill",styleSkills:true,permanent:false,bonus:0,label:"Compétence professionnelle du Style",help:"Une relance par scénario, hors échec narratif. Aucun bonus permanent. Un ancien choix libre est conservé et doit être vérifié."},');
sub(root+'components/builder/TalentSelector.vue','  skillAttribute?:string;','  skillAttribute?:string;\n  styleSkills?:boolean;');
sub(page,'import { computed,','import {permanentSkillBonus,pruneBenefits,uniqueTalents,renownScore as computeRenown} from "../lib/reality-benefits";\nimport { computed,');
sub(page,'.filter((skill)=>allowed.has(skill.id))','.filter((skill)=>allowed.has(skill.id)&&(!spec.styleSkills||selectedStyle.value?.skills.includes(skill.id)))');
sub(page,'  return !spec||talentChoiceValue(id).trim().length>0;','  if(!spec)return true;\n  const value=talentChoiceValue(id);\n  return spec.kind==="text"?value.trim().length>0:talentChoiceOptions(spec).some(option=>option.id===value);');
sub(page,'const derivedStats=computed(()=>characterDerivedStats(finalAttribute,skillFinal,draft.value?.disadvantages??[]));',`function skillPermanent(id:string){return skillRaw(id)+permanentSkillBonus(selectedRealityTalentIds(),draft.value?.talentChoices??{},talentChoiceSpecs.value,id);}
function ownedRealityTalentIds(){const learned=draft.value?.progression.realityTalents;return uniqueTalents(selectedRealityTalentIds(),Array.isArray(learned)?learned.filter((id):id is string=>typeof id==='string'):[]);}
const derivedStats=computed(()=>characterDerivedStats(finalAttribute,skillPermanent,draft.value?.disadvantages??[],skillFinal));`);
sub(page,'watch([realityRules,()=>draft.value?.reality,()=>selectedRealityTalentIds().join("|")],()=>{\n  if(realityRules.value&&realityState.value)syncRealityTalentBenefits(realityRules.value,realityState.value,selectedRealityTalentIds());\n});',`watch([realityRules,()=>draft.value?.reality,()=>ownedRealityTalentIds().join("|"),()=>draft.value?.creation.sphere],()=>{
  if(realityRules.value&&realityState.value){syncRealityTalentBenefits(realityRules.value,realityState.value,ownedRealityTalentIds());pruneBenefits(realityState.value,ownedRealityTalentIds(),draft.value?.creation.sphere??'');}
});`);
rx(page,/const renownScore=computed\(\(\)=>\{[\s\S]*?\n\}\);/g,`const renownScore=computed(()=>draft.value?computeRenown(selectedRealityTalentIds(),progressionMode?(draft.value.progression.realityTalents as string[]??[]):[],Number(draft.value.edge.renownPack||0),hasUnknownDisadvantage.value,progressionMode?Number(draft.value.progression.renownAdjustment||0):0):0);`);
sub(page,'if((purchase.selectedPrice??item.price??0)>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)return false;','if(!purchase.sphereSupport&&(purchase.cataloguePrice??purchase.selectedPrice??item.price??0)>pkg.economy.advancedPurchaseThreshold&&!state.mjAdvancedOverride)return false;',2);
rx(page,/<ProgressionStep\b/g,'<ProgressionStep :talent-choice-specs="talentChoiceSpecs" :creation-talent-choices="draft.talentChoices"');
rx(page,/<EquipmentStep[\s\S]*?\/>/g,block=>{if(!block.includes(':talent-ids="selectedRealityTalentIds()"'))throw new Error('Equipment binding changed');return block.replace(':talent-ids="selectedRealityTalentIds()"',':talent-ids="ownedRealityTalentIds()"');});
sub(equipment,'import { computed, nextTick, ref } from "vue";',`import { computed, nextTick, ref } from "vue";
import RealityBenefitsPanel from './RealityBenefitsPanel.vue';
import {acquisitionCost,supplierEligible,loanLabel,referencePrice} from '../../lib/reality-benefits';`);
sub(equipment,'const equipmentQuery=ref("");','const equipmentQuery=ref("");\nconst useSupplier=ref(false);');
sub(equipment,'  return value===null?item:{...item,price:value,priceMin:value,priceMax:value};',`  const cost=value===null?null:acquisitionCost(value,item,props.talentIds,useSupplier.value&&props.sphereId==='corporatiste');
  return cost===null?item:{...item,price:cost,priceMin:cost,priceMax:cost};`);
sub(equipment,'  return canAffordRealityPurchase(props.rules,state.value,props.style,props.edge,pricedItem(item));',`  if((priceValue(item)??0)>props.rules.economy.advancedPurchaseThreshold&&!state.value.mjAdvancedOverride)return {ok:false,reason:'Prix catalogue supérieur au seuil : accord MJ requis'};
  return canAffordRealityPurchase(props.rules,state.value,props.style,props.edge,pricedItem(item));`);
sub(equipment,'    selectedPrice:value,',`    selectedPrice:acquisitionCost(value,item,props.talentIds,useSupplier.value&&props.sphereId==='corporatiste'),
    cataloguePrice:value,
    supplierPurchase:useSupplier.value&&props.sphereId==='corporatiste'&&props.talentIds.includes('acces_fournisseur')&&supplierEligible(item),`);
sub(equipment,'    if(!charge.sphereSupport)return [charge];','    if(!charge.sphereSupport||charge.talentGrant)return [charge];');
sub(equipment,'    if(!purchase.sphereSupport)return [purchase];','    if(!purchase.sphereSupport||purchase.talentGrant)return [purchase];');
sub(equipment,'  if(removed.sphereSupport){','  if(removed.sphereSupport&&!removed.talentGrant){');
sub(equipment,'  const type=state.value.sphereSupportType;\n  clearCorporateSupportAsset(true);',`  const type=state.value.sphereSupportType;
  if(itemId&&[...state.value.equipment,...state.value.fixedChargeItems].some(row=>row.talentGrant==='avantages_salaries'&&('itemId' in row?row.itemId:row.sourceItemId)===itemId)){window.alert('Cette prestation est déjà couverte par le deuxième Appui.');return;}
  clearCorporateSupportAsset(true);`);
sub(equipment,'</script>',`function repriceCreation(){
  if(!window.confirm('Recalculer uniquement les achats de création avec les Talents actuels ? Les transactions de campagne sont conservées.'))return;
  for(const p of [...state.value.equipment,...state.value.augmentations]){
    if(p.acquiredInCampaign||p.sphereSupport||p.talentGrant)continue;
    const item=items.value.get(p.itemId);if(!item)continue;
    p.cataloguePrice=referencePrice(p,item);
    p.selectedPrice=acquisitionCost(p.cataloguePrice,item,props.talentIds,!!p.supplierPurchase&&props.sphereId==='corporatiste');
  }
  notify();
}
function benefitUpdate(value:Record<string,unknown>){emit('update:modelValue',value);}
</script>`);
sub(equipment,'    <template v-else>',`    <template v-else>
      <RealityBenefitsPanel :model-value="modelValue" :rules="rules" :talent-ids="talentIds" :sphere-id="sphereId" :disadvantages="disadvantages" @update:model-value="benefitUpdate" />
      <section v-if="talentIds.includes('maitre_du_troc')||talentIds.includes('acces_fournisseur')" class="rule-note" data-creation-discounts><strong>Prix après Talents</strong><p>Maître du Troc : −5 % du prix de référence. Accès fournisseur : −10 % seulement auprès de votre corporation ou d’un partenaire autorisé.</p><label v-if="sphereId==='corporatiste'&&talentIds.includes('acces_fournisseur')"><input v-model="useSupplier" type="checkbox" /> Prochains achats auprès du fournisseur autorisé, hors prestations exclues</label><button type="button" class="ghost compact" @click="repriceCreation">Recalculer les achats de création</button><p>Le recalcul est explicite. Il ne modifie pas les transactions de campagne déjà enregistrées.</p></section>`);
sub(equipment,'<span>{{ realityPriceSpec(item).label }}</span>',`<span>{{ realityPriceSpec(item).label }}</span><span v-if="priceValue(item)!==null&&acquisitionCost(priceValue(item)??0,item,talentIds,useSupplier&&sphereId==='corporatiste')!==(priceValue(item)??0)">À payer après Talents : {{ money(acquisitionCost(priceValue(item)??0,item,talentIds,useSupplier&&sphereId==='corporatiste')) }}</span>`);
sub(equipment,'<template v-if="row.purchase.sphereSupport"> · véhicule de fonction</template>','<template v-if="row.purchase.sphereSupport"> · véhicule de fonction</template><template v-if="row.purchase.talentGrant"> · {{ loanLabel(row.purchase.talentGrant) }} · prêt non revendable</template>');
sub(step,'import { computed, ref } from "vue";',`import { computed, ref } from "vue";
import RealityBenefitsPanel from './RealityBenefitsPanel.vue';
import TalentChoiceFields from './TalentChoiceFields.vue';
import {uniqueTalents,permanentSkillBonus,renownScore,renownScale,supplierEligible,saleAllowed,pruneBenefits,type ChoiceSpec} from '../../lib/reality-benefits';
import {purchaseWithTalents,saleWithTalents} from '../../../../api/src/rules/reality-talents-policy';`);
sub(step,'  currentSkillRaw as campaignSkillRaw,','  freezeCampaignCash,\n  currentSkillRaw as campaignSkillRaw,');
sub(step,'  talentLore?:Record<string,string>;','  talentLore?:Record<string,string>;\n  talentChoiceSpecs?:Record<string,ChoiceSpec>;\n  creationTalentChoices?:Record<string,unknown>;');
sub(step,'const saleDegree=ref(0);','const saleDegree=ref(0);\nconst tradeSupplier=ref(false);\nconst choiceDrafts=ref<Record<string,unknown>>({});');
sub(step,'function currentSkillFinal(id:string){ return campaignSkillFinal(state.value,props.skillBases,props.skillFinalBases,props.skillTalentMap,id); }',`function currentSkillFinal(id:string){return campaignSkillFinal(state.value,props.skillBases,props.skillFinalBases,props.skillTalentMap,id)+permanentSkillBonus(state.value.realityTalents,state.value.realityTalentChoices,props.talentChoiceSpecs??{},id);}
function permanentSkill(id:string){return currentSkillRaw(id)+permanentSkillBonus(props.creationTalentIds,props.creationTalentChoices??{},props.talentChoiceSpecs??{},id)+permanentSkillBonus(state.value.realityTalents,state.value.realityTalentChoices,props.talentChoiceSpecs??{},id);}
const combinedRealityIds=computed(()=>uniqueTalents(props.creationTalentIds,state.value.realityTalents));
const currentRenown=computed(()=>renownScore(props.creationTalentIds,state.value.realityTalents,Number(props.edge.renownPack||0),props.disadvantages.includes('inconnu'),state.value.renownAdjustment));
function adjustRenown(delta:number){const target=currentRenown.value+delta;if(target<0||target>5)return;const next=structuredClone(state.value);next.renownAdjustment=target-renownScore(props.creationTalentIds,state.value.realityTalents,Number(props.edge.renownPack||0),props.disadvantages.includes('inconnu'));emitProgression(next);}
function setLearnedChoices(value:Record<string,unknown>){const next=structuredClone(state.value);next.realityTalentChoices=value;emitProgression(next);}
function markProfile(used:boolean){const next=structuredClone(state.value);next.profilCalibreUsed=used;emitProgression(next);}
function talentChoicesValid(id:string){const s=props.talentChoiceSpecs?.[id];if(!s)return true;const value=choiceDrafts.value[id]??state.value.realityTalentChoices[id];if(typeof value!=='string'||!value.trim())return false;if(s.kind==='enum')return !!s.options?.some(o=>o.id===value);if(s.kind==='skill')return props.rules.skills.some(k=>k.id===value&&(!s.skills||s.skills.includes(k.id))&&(!s.skillAttribute||s.skillAttribute===k.attribute)&&(!s.styleSkills||props.style?.skills?.includes(k.id)));return true;}
function updateBenefitReality(value:Record<string,unknown>){const next=structuredClone(state.value);freezeCampaignCash(next,props.creationAccount);emitProgression(next);emit('update:reality',value);}`);
sub(step,'characterDerivedStats(currentAttribute,currentSkillFinal,props.disadvantages)','characterDerivedStats(currentAttribute,permanentSkill,props.disadvantages,currentSkillFinal)');
sub(step,'  if(talent.id==="neurodriver"',`  if(talent.id==='renomme'&&currentRenown.value>=5)return {ok:false,reason:'Renommée déjà à 5 : aucun XP ne sera dépensé.'};
  if(!talentChoicesValid(talent.id))return {ok:false,reason:'Précisez le choix du Talent avant de dépenser les XP.'};
  if(talent.id==="neurodriver"`);
sub(step,'  next.realityTalents.push(talent.id);','  next.realityTalents.push(talent.id);\n  if(choiceDrafts.value[talent.id]!==undefined)next.realityTalentChoices[talent.id]=choiceDrafts.value[talent.id];');
sub(step,'  next.realityTalents=next.realityTalents.filter(item=>item!==id);\n  emitProgression(next);',`  const affected=realityState.value.equipment.some(p=>p.talentGrant===id)||realityState.value.fixedChargeItems.some(c=>c.talentGrant===id);
  if(affected&&!window.confirm('Retirer ce Talent et restituer ses prêts/prestations ? Vos achats personnels restent conservés.'))return;
  freezeCampaignCash(next,props.creationAccount);
  next.realityTalents=next.realityTalents.filter(item=>item!==id);
  const real=structuredClone(realityState.value);pruneBenefits(real,uniqueTalents(props.creationTalentIds,next.realityTalents),props.sphereId);
  emitProgression(next);emitReality(real);`);
sub(step,'  return {list,degree,total:Math.round(list*degree.buy)};',`  const troc=combinedRealityIds.value.includes('maitre_du_troc');
  const supplier=tradeSupplier.value&&props.sphereId==='corporatiste'&&combinedRealityIds.value.includes('acces_fournisseur')&&supplierEligible(tradeItem.value);
  return {list,degree,troc,supplier,total:purchaseWithTalents(list,degree.buy,troc,supplier)};`);
sub(step,'    campaignCatalogPrice:list,','    cataloguePrice:list,\n    supplierPurchase:tradePreview.value.supplier,\n    campaignCatalogPrice:list,');
sub(step,'    if(item)rows.push({kind:"equipment",purchase,item,key:"equipment:"+purchase.uid});','    if(item&&saleAllowed(purchase))rows.push({kind:"equipment",purchase,item,key:"equipment:"+purchase.uid});');
sub(step,'    if(item)rows.push({kind:"augmentation",purchase,item,key:"augmentation:"+purchase.uid});','    if(item&&saleAllowed(purchase))rows.push({kind:"augmentation",purchase,item,key:"augmentation:"+purchase.uid});');
sub(step,'Number(purchase.campaignCatalogPrice??purchase.selectedPrice??purchasePrice(purchase,row.item))','Number(purchase.cataloguePrice??purchase.campaignCatalogPrice??purchase.selectedPrice??purchasePrice(purchase,row.item))');
sub(step,'  return {degree,reference,total:Math.round(reference*degree.sale)};',`  const troc=combinedRealityIds.value.includes('maitre_du_troc');
  return {degree,reference,troc,total:saleWithTalents(reference,degree.sale,troc)};`);
sub(step,'  if(!row||!salePreview.value.reference)return;','  if(!row||!saleAllowed(row.purchase)||!salePreview.value.reference)return;');
sub(step,'    <section class="pool-grid">',`    <section class="progress-panel" data-renown-progression><h3>Renommée · {{ currentRenown }}/5 — {{ renownScale[currentRenown].name }}</h3><p>{{ renownScale[currentRenown].benefit }}</p><p>Évolution de campagne : {{ state.renownAdjustment }}. Les gains se notent séparément du +1 de Renommé ; aucun XP n’est dépensé.</p><div class="action-row"><button type="button" class="ghost compact" :disabled="currentRenown<=0" @click="adjustRenown(-1)">−1 Renommée</button><button type="button" class="secondary compact" :disabled="currentRenown>=5" @click="adjustRenown(1)">+1 Renommée accordée par le MJ</button></div><p class="rule-note">Une fois par scène : une Renommée strictement supérieure auprès d’un interlocuteur non hostile qui reconnaît une réputation pertinente donne une concession modeste. Une réputation pertinente peut apporter +3 ou −3 au test, jamais le score de Renommée ajouté au jet.</p></section>
    <section v-if="combinedRealityIds.includes('profil_calibre')" class="progress-panel" data-profile-use><h3>Profil calibré · une relance par scénario</h3><p>{{ state.profilCalibreUsed?'Relance déjà utilisée ce scénario.':'Relance disponible, hors échec narratif, pour la Compétence du Style choisie.' }}</p><div class="action-row"><button type="button" class="secondary compact" :disabled="state.profilCalibreUsed" @click="markProfile(true)">Marquer la relance utilisée</button><button type="button" class="ghost compact" @click="markProfile(false)">Nouveau scénario · réinitialiser</button></div></section>
    <section class="pool-grid">`);
sub(step,'      <p class="catalog-sort-hint">Talents illustrés par famille, classés par ordre alphabétique.</p>',`      <TalentChoiceFields :talents="state.realityTalents.map(id=>({id,name:ruleTalentById(id)?.name||id}))" :specs="talentChoiceSpecs??{}" :choices="state.realityTalentChoices" :skills="rules.skills" :style-skills="style?.skills" @update:choices="setLearnedChoices" />
      <p class="catalog-sort-hint">Talents illustrés par famille, classés par ordre alphabétique.</p>`);
sub(step,'            <small v-if="!realityTalentAllowed(talent).ok">',`            <TalentChoiceFields :talents="[talent]" :specs="talentChoiceSpecs??{}" :choices="choiceDrafts" :skills="rules.skills" :style-skills="style?.skills" @update:choices="choiceDrafts=$event" />
            <small v-if="!realityTalentAllowed(talent).ok">`);
sub(step,'    <details class="progress-panel campaign-money" open>',`    <RealityBenefitsPanel :model-value="reality" :rules="realityRules" :talent-ids="combinedRealityIds" :sphere-id="sphereId" :disadvantages="disadvantages" campaign @update:model-value="updateBenefitReality" />
    <details class="progress-panel campaign-money" open>`);
sub(step,'        <div v-if="tradeItem" class="trade-preview">',`        <label v-if="sphereId==='corporatiste'&&combinedRealityIds.includes('acces_fournisseur')&&supplierEligible(tradeItem)" class="rule-note"><input v-model="tradeSupplier" type="checkbox" /> Commande à ma corporation ou à un partenaire autorisé · Accès fournisseur −10 %</label>
        <div v-if="tradeItem" class="trade-preview">`);
sub(step,'          <span>À payer <strong>{{ money(tradePreview.total) }}</strong></span>','          <span v-if="tradePreview.troc">Maître du Troc <strong>−5 %</strong></span><span v-if="tradePreview.supplier">Accès fournisseur <strong>−10 %</strong></span>\n          <span>À payer <strong>{{ money(tradePreview.total) }}</strong></span>');
sub(step,'          <span>À récupérer <strong>{{ money(salePreview.total) }}</strong></span>','          <span v-if="salePreview.troc">Maître du Troc <strong>+5 % de la base de reprise (50 % du neuf)</strong></span>\n          <span>À récupérer <strong>{{ money(salePreview.total) }}</strong></span>');
sub(sheet,'import type { CharacterDataV2 }',`import {uniqueTalents,permanentSkillBonus,renownScore,projectBenefits,benefitSettings,loanLabel,recoverySummary} from './reality-benefits';
import {cloneJson} from './json';
import type { CharacterDataV2 }`);
sub(sheet,'  const realityState=ensureRealityState({...data.reality});','  const realityState=ensureRealityState(cloneJson(data.reality));');
sub(sheet,'  const choiceValue=(id:string)=>typeof data.talentChoices[id]==="string"?data.talentChoices[id] as string:"";',`  const realityIds=uniqueTalents(creationIds,campaign?progress.realityTalents:[]);
  projectBenefits(realityState,realityIds,data.creation.sphere,campaign);
  const choices={...data.talentChoices,...(campaign?progress.realityTalentChoices:{})};
  const choiceValue=(id:string)=>typeof choices[id]==="string"?choices[id] as string:"";`);
sub(sheet,'  const skill=(id:string)=>campaign?currentSkillFinal(progress,skillBases,skillFinalBases,core.skillTalentMap,id):skillFinal(id);',`  const skill=(id:string)=>campaign?currentSkillFinal(progress,skillBases,skillFinalBases,core.skillTalentMap,id)+permanentSkillBonus(progress.realityTalents,progress.realityTalentChoices,core.talentChoiceSpecs,id):skillFinal(id);
  const permanentSkill=(id:string)=>rawSkill(id)+permanentSkillBonus(realityIds,choices,core.talentChoiceSpecs,id);`);
sub(sheet,'  const derived=characterDerivedStats(attribute,skill,data.disadvantages);','  const derived=characterDerivedStats(attribute,permanentSkill,data.disadvantages,skill);');
sub(sheet,'realityLifestyleBase(reality,style,data.edge,creationIds,data.disadvantages)','realityLifestyleBase(reality,style,data.edge,realityIds,data.disadvantages)');
sub(sheet,'  const renown=data.disadvantages.includes("inconnu")?0:creationIds.includes("renomme")||Number(data.edge.renownPack||0)>0?2:1;',`  const renown=renownScore(creationIds,campaign?progress.realityTalents:[],Number(data.edge.renownPack||0),data.disadvantages.includes('inconnu'),campaign?progress.renownAdjustment:0);`);
sub(sheet,'  const realityIds=[...new Set([...creationIds,...(campaign?progress.realityTalents:[])])];\n','');
sub(sheet,'detail:item?.effect,compendiumId:item?.compendiumId,','detail:[item?.effect,purchase.loanEffect].filter(Boolean).join("\\n"),compendiumId:item?.compendiumId,');
sub(sheet,'purchase.sphereSupport?"Appui de Sphère":"",purchase.loaded?"Chargé":""','purchase.sphereSupport?"Appui de Sphère":"",purchase.talentGrant?loanLabel(purchase.talentGrant)+" · prêt non revendable":"",purchase.loaded?"Chargé":""');
sub(sheet,'  const strings=(value:unknown)=>',`  for(const charge of realityState.fixedChargeItems.filter(c=>c.talentGrant||c.sphereSupport))inventory.push({id:charge.uid,name:charge.name,group:charge.talentGrant?loanLabel(charge.talentGrant):'Appui de Sphère',detail:charge.monthly+' $/mois · prestation prise en charge'});
  const recovered=recoverySummary(permanentSkill('constitution'),realityIds);
  const talentRules:SheetEntry[]=[{id:'daily-recovery',name:'Récupération de repos',detail:recovered.normal+' PV / 24 h ; '+recovered.prolonged+' PV avec soins prolongés. Pas de supplément aux soins instantanés.'}];
  if(realityIds.includes('insensibilite_a_la_douleur'))talentRules.push({id:'injury-stress',name:'Insensibilité à la douleur',detail:'Blessures : à la moitié des PV, Stress minimal Normal ; au quart, Tendu. Un Stress indépendant plus grave reste applicable. Agonie inchangée.'});
  if(realityIds.includes('assurance_corporative')){const uid=benefitSettings(realityState).insuredAssetUid,p=[...realityState.equipment,...realityState.augmentations].find(p=>p.uid===uid);talentRules.push({id:'insured-asset',name:'Bien assuré',detail:p?(items.get(p.itemId)?.name??p.itemId):'À préciser : aucune sélection automatique.'});}
  const strings=(value:unknown)=>`);
sub(sheet,'    derived,edge:edgeRemaining,','    derived,talentRules,edge:edgeRemaining,');
sub(root+'lib/character-sheet.ts','  attributes:SheetValue[]; skills:SheetValue[]; derived:DerivedStats;','  attributes:SheetValue[]; skills:SheetValue[]; derived:DerivedStats;\n  talentRules?:SheetEntry[];');
const summary=root+'components/builder/CharacterSummary.vue';
sub(summary,'    <section aria-label="Attributs" class="sheet-attributes">',`    <section v-if="sheet.talentRules?.length" class="sheet-resources" data-talent-rules><h3>Applications des Talents</h3><dl><div v-for="rule in sheet.talentRules" :key="rule.id"><dt>{{ rule.name }}</dt><dd>{{ rule.detail }}</dd></div></dl></section>
    <section aria-label="Attributs" class="sheet-attributes">`);
sub(summary,'Bonus permanents inclus ; effets temporaires et de Révélation à appliquer selon leurs conditions.','Valeurs dérivées calculées sur les scores permanents ; bonus aux tests et effets de Révélation à appliquer selon leurs conditions.');
sub(summary,'Le total inclut les bonus permanents de Talents. Le rang brut reste indiqué séparément.','Le total de test inclut les bonus de Talents applicables. Le rang brut reste séparé ; un bonus aux tests ne gonfle pas une valeur dérivée.');
const payload=resolve(dirname(fileURLToPath(import.meta.url)),'files');
function copy(directory){for(const e of readdirSync(directory,{withFileTypes:true})){const f=resolve(directory,e.name);if(e.isDirectory())copy(f);else put(relative(payload,f),readFileSync(f,'utf8'));}}
copy(payload);
const packagePath='apps/web/package.json';const pkg=JSON.parse(readFileSync(packagePath,'utf8'));pkg.scripts['test:reality-talents']='node tests/reality-talents-integration.mjs';pkg.scripts['test:ui']+=' && npm run test:reality-talents';put(packagePath,JSON.stringify(pkg,null,2)+'\n');
put('tools/reality-builder-dev/generated-files.json',JSON.stringify([...files].sort(),null,2)+'\n');
console.log('DEV INTEGRATION GENERATED — '+files.size+' files; no production deployment, no persistent data mutation.');
