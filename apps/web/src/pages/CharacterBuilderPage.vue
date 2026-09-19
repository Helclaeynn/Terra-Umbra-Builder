<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { api, ApiError } from "../lib/api";
import TalentSelector, {
  type TalentChoiceOption,
  type TalentChoiceSpec,
  type TalentOption
} from "../components/builder/TalentSelector.vue";
import type { Character, CharacterDataV2 } from "../types/character";

type RuleAttribute={id:string;name:string};
type RuleSkill={id:string;name:string;attribute:string};
type RuleOrigin={name:string};
type RuleSphere={name:string;originId:string;support:string;fixedSkills:string[]};
type RuleStyle={
  id:string;
  sphere:string;
  name:string;
  skills:string[];
  expertiseFamilies:string[];
  lifestyle:string;
  account:number;
  augmentationEnvelope:number;
  gen2SlotsBase:number;
  vehicleCapital:number;
};
type RuleTalent=TalentOption&{
  category?:string;
  sphere?:string;
  attribute?:string;
  skill?:string;
  prerequisite?:string|null;
};
type CreationLore={
  origin:Record<string,string>;
  originTalent:Record<string,string>;
  sphere:Record<string,string>;
  style:Record<string,string>;
  skill:Record<string,string>;
  attribute:Record<string,string>;
  talent:Record<string,string>;
  sphereTalent:Record<string,string>;
};
type CreationRules={
  id:string;
  name:string;
  sourceVersion:string;
  attributes:RuleAttribute[];
  skills:RuleSkill[];
  creation:{
    attributes:{baseTotal:number;min:number;max:number;edgePackPoints:number;edgePackMax:number};
    skills:{sphereFixedPoints:number;stylePoints:number;stylePerSkillMax:number;freePoints:number;rawMax:number;edgePackPoints:number;edgePackMax:number};
  };
  origins:Record<string,RuleOrigin>;
  spheres:Record<string,RuleSphere>;
  styles:RuleStyle[];
  talents:{
    origin:Record<string,RuleTalent[]>;
    sphere:Record<string,RuleTalent[]>;
    common:RuleTalent[];
    expertise:RuleTalent[];
  };
};

type DisadvantageOption={
  id:string;
  name:string;
  effect:string;
  category:"common"|"attribute"|"sphere";
  attribute?:string;
  sphere?:string;
};
type DisadvantageCatalog={
  common:readonly DisadvantageOption[];
  attribute:readonly DisadvantageOption[];
  sphere:Record<string,readonly DisadvantageOption[]>;
};
type EdgeOptionRule={max:number;points?:number;amount?:number;steps?:number;gen2Windows?:number};
type EdgeLore={lore:string;mechanic:string};
type EdgeRules={
  base:number;
  maxHeld:number;
  options:Record<string,EdgeOptionRule>;
  lore:Record<string,EdgeLore>;
};

type StepId="identity"|"origin"|"sphere"|"attributes"|"skills"|"talents"|"truth"|"disadvantages"|"edge"|"equipment"|"finish"|"progression";

const route=useRoute();
const character=ref<Character|null>(null);
const draft=ref<CharacterDataV2|null>(null);
const rules=ref<CreationRules|null>(null);
const lore=ref<CreationLore|null>(null);
const talentChoiceSpecs=ref<Record<string,TalentChoiceSpec>>({});
const skillTalentMap=ref<Record<string,string>>({});
const disadvantages=ref<DisadvantageCatalog|null>(null);
const disadvantageLore=ref<Record<string,string>>({});
const edgeRules=ref<EdgeRules|null>(null);
const disadvantageCategory=ref("common");
const loading=ref(true);
const saving=ref(false);
const error=ref("");
const notice=ref("");
const baseline=ref("");
const activeStep=ref<StepId>("identity");
const portraitInput=ref<HTMLInputElement|null>(null);

const sections:Array<[StepId,string,boolean]>=[
  ["identity","Identité",true],
  ["origin","Origine",true],
  ["sphere","Sphère & Style",true],
  ["attributes","Attributs",true],
  ["skills","Compétences",true],
  ["talents","Talents",true],
  ["truth","Vérité",false],
  ["disadvantages","Désavantages",true],
  ["edge","Edge",true],
  ["equipment","Équipement",false],
  ["finish","Finalisation",false],
  ["progression","Dépense XP & PTV",false]
];

const dirty=computed(()=>{
  if(!draft.value)return false;
  return JSON.stringify(draft.value)!==baseline.value;
});

const identityDisplayName=computed(()=>{
  if(!draft.value)return character.value?.name??"";
  const firstName=draft.value.identity.firstName.trim();
  const name=draft.value.identity.name.trim();
  return [firstName,name].filter(Boolean).join(" ")||character.value?.name||"";
});

const selectedSphere=computed(()=>{
  if(!draft.value||!rules.value)return null;
  return rules.value.spheres[draft.value.creation.sphere]??null;
});

const selectedStyle=computed(()=>{
  if(!draft.value||!rules.value)return null;
  return rules.value.styles.find((style)=>style.id===draft.value?.creation.style)??null;
});

const styleOptions=computed(()=>{
  if(!draft.value||!rules.value)return [];
  return rules.value.styles.filter((style)=>style.sphere===draft.value?.creation.sphere);
});

const originTalents=computed(()=>{
  if(!draft.value||!rules.value)return [];
  return rules.value.talents.origin[draft.value.creation.origin]??[];
});

const sphereTalents=computed(()=>{
  if(!draft.value||!rules.value)return [];
  return rules.value.talents.sphere[draft.value.creation.sphere]??[];
});

const expertiseTalents=computed(()=>{
  if(!selectedStyle.value||!rules.value)return [];
  return rules.value.talents.expertise.filter((talent)=>
    !!talent.attribute&&selectedStyle.value?.expertiseFamilies.includes(talent.attribute)
  );
});

const commonTalents=computed(()=>rules.value?.talents.common??[]);

const stylePointsUsed=computed(()=>{
  if(!draft.value)return 0;
  return Object.values(draft.value.skills).reduce((sum,skill)=>sum+Number(skill.style||0),0);
});

const freeSkillPointsUsed=computed(()=>{
  if(!draft.value)return 0;
  return Object.values(draft.value.skills).reduce((sum,skill)=>sum+Number(skill.free||0),0);
});

const freeSkillBudget=computed(()=>rules.value?.creation.skills.freePoints??0);

const edgeSkillPointsUsed=computed(()=>{
  if(!draft.value)return 0;
  return Object.values(draft.value.skills).reduce((sum,skill)=>sum+Number(skill.edge||0),0);
});

const edgeSkillBudget=computed(()=>{
  if(!draft.value||!rules.value)return 0;
  return Number(draft.value.edge.skillPacks||0)*rules.value.creation.skills.edgePackPoints;
});

const attributeTotal=computed(()=>{
  if(!draft.value||!rules.value)return 0;
  return rules.value.attributes.reduce((sum,attribute)=>sum+Number(draft.value?.attributes[attribute.id]??0),0);
});

const attributeBudget=computed(()=>rules.value?.creation.attributes.baseTotal??0);

const edgeAttributePointsUsed=computed(()=>{
  if(!draft.value)return 0;
  return Object.values(draft.value.edgeAttributes).reduce((sum,value)=>sum+Number(value||0),0);
});

const edgeAttributeBudget=computed(()=>{
  if(!draft.value||!rules.value)return 0;
  return Number(draft.value.edge.attributePack||0)*rules.value.creation.attributes.edgePackPoints;
});

function humanError(code:string){
  const labels:Record<string,string>={
    authentication_required:"Ta session a expiré. Reviens à l’accueil pour te reconnecter.",
    character_not_found:"Ce personnage n’existe plus ou ne t’appartient pas.",
    character_version_conflict:"Cette fiche a été modifiée ailleurs. Recharge-la avant d’enregistrer de nouveau.",
    invalid_character_data:"Les données de cette fiche ne sont pas valides.",
    character_update_failed:"La sauvegarde a échoué."
  };
  return labels[code]??"Une erreur est survenue.";
}

function skillName(id:string){
  return rules.value?.skills.find((skill)=>skill.id===id)?.name??id;
}

function attributeName(id:string){
  return rules.value?.attributes.find((attribute)=>attribute.id===id)?.name??id;
}

function talentById(id:string):RuleTalent|null{
  if(!id||!rules.value)return null;
  for(const pool of Object.values(rules.value.talents.origin)){
    const found=pool.find((talent)=>talent.id===id);
    if(found)return found;
  }
  for(const pool of Object.values(rules.value.talents.sphere)){
    const found=pool.find((talent)=>talent.id===id);
    if(found)return found;
  }
  return rules.value.talents.expertise.find((talent)=>talent.id===id)
    ??rules.value.talents.common.find((talent)=>talent.id===id)
    ??null;
}

function talentNarrative(talent:RuleTalent|null){
  if(!talent||!lore.value)return "";
  if(talent.category==="origin")return lore.value.originTalent[talent.id]??"";
  if(talent.category==="sphere")return lore.value.sphereTalent[talent.id]??"";
  return lore.value.talent[talent.id]??"";
}

function talentChoiceSpec(id:string){
  return id?talentChoiceSpecs.value[id]??null:null;
}

function talentChoiceValue(id:string){
  if(!draft.value||!id)return "";
  const value=draft.value.talentChoices[id];
  return typeof value==="string"?value:"";
}

function setTalentChoice(id:string,value:string){
  if(!draft.value||!id)return;
  draft.value.talentChoices[id]=value;
}

function talentChoiceOptions(spec:TalentChoiceSpec|null):TalentChoiceOption[]{
  if(!spec||!rules.value)return [];
  if(spec.kind==="enum")return [...(spec.options??[])];
  if(spec.kind!=="skill")return [];
  const allowed=spec.skills
    ? new Set(spec.skills)
    : new Set(
        rules.value.skills
          .filter((skill)=>!spec.skillAttribute||skill.attribute===spec.skillAttribute)
          .map((skill)=>skill.id)
      );
  return rules.value.skills
    .filter((skill)=>allowed.has(skill.id))
    .map((skill)=>({id:skill.id,name:skill.name}));
}

function talentChoiceValid(id:string){
  const spec=talentChoiceSpec(id);
  return !spec||talentChoiceValue(id).trim().length>0;
}

function setTalent(slot:"origin"|"sphere"|"expertise"|"common",id:string){
  if(!draft.value)return;
  draft.value.talents[slot]=id;
}

function selectedRealityTalentIds(){
  if(!draft.value)return [];
  return [
    draft.value.talents.origin,
    draft.value.talents.sphere,
    draft.value.talents.expertise,
    draft.value.talents.common,
    ...(draft.value.talents.edge||[])
  ].filter(Boolean);
}

function skillTalentBonus(id:string){
  if(!draft.value)return 0;
  let total=0;
  for(const talentId of selectedRealityTalentIds()){
    if(skillTalentMap.value[talentId]===id)total+=1;
    const spec=talentChoiceSpec(talentId);
    if(spec?.kind==="skill"&&spec.permanent&&talentChoiceValue(talentId)===id){
      total+=Number(spec.bonus||0);
    }
  }
  return total;
}

function skillFinal(id:string){
  return skillRaw(id)+skillTalentBonus(id);
}

function formatMoney(value:number){
  return new Intl.NumberFormat("fr-FR").format(value)+" $";
}

function stepDone(id:StepId){
  if(!draft.value||!rules.value)return false;
  if(id==="identity")return !!draft.value.identity.name.trim()&&!!draft.value.identity.age.trim();
  if(id==="origin")return !!draft.value.creation.origin&&!!draft.value.talents.origin&&talentChoiceValid(draft.value.talents.origin);
  if(id==="sphere")return !!draft.value.creation.sphere&&!!draft.value.creation.style&&stylePointsUsed.value===5;
  if(id==="attributes"){
    const bounds=rules.value.creation.attributes;
    return attributeTotal.value===attributeBudget.value&&rules.value.attributes.every((attribute)=>{
      const value=Number(draft.value?.attributes[attribute.id]??0);
      return value>=bounds.min&&value<=bounds.max;
    });
  }
  if(id==="skills"){
    const max=rules.value.creation.skills.rawMax;
    return !!selectedStyle.value&&stylePointsUsed.value===rules.value.creation.skills.stylePoints&&
      freeSkillPointsUsed.value===freeSkillBudget.value&&
      rules.value.skills.every((skill)=>skillRaw(skill.id)<=max);
  }
  if(id==="talents"){
    const selected=[
      draft.value.talents.origin,
      draft.value.talents.sphere,
      draft.value.talents.expertise,
      draft.value.talents.common
    ];
    const expertise=talentById(draft.value.talents.expertise);
    const expertiseOk=!!expertise?.attribute&&!!selectedStyle.value?.expertiseFamilies.includes(expertise.attribute);
    const choicesOk=selected.filter(Boolean).every(talentChoiceValid);
    const neuroOk=draft.value.talents.expertise!=="neurodriver"||skillRaw("neurodive")>=1;
    return selected.every(Boolean)&&expertiseOk&&choicesOk&&neuroOk;
  }
  return false;
}

async function loadCharacter(){
  loading.value=true;
  error.value="";
  const id=String(route.params.id??"");
  try{
    const [characterResult,rulesResult]=await Promise.all([
      api<{character:Character}>(`/api/characters/${encodeURIComponent(id)}`),
      api<{
        rules:CreationRules;
        lore:CreationLore;
        talentChoiceSpecs:Record<string,TalentChoiceSpec>;
        skillTalentMap:Record<string,string>;
        disadvantages:DisadvantageCatalog;
        disadvantageLore:Record<string,string>;
        edgeRules:EdgeRules;
      }>("/api/rulesets/terra-umbra/creation")
    ]);
    character.value=characterResult.character;
    draft.value=structuredClone(characterResult.character.data);
    rules.value=rulesResult.rules;
    lore.value=rulesResult.lore;
    talentChoiceSpecs.value=rulesResult.talentChoiceSpecs;
    skillTalentMap.value=rulesResult.skillTalentMap;
    disadvantages.value=rulesResult.disadvantages;
    disadvantageLore.value=rulesResult.disadvantageLore;
    edgeRules.value=rulesResult.edgeRules;
    if(
      disadvantageCategory.value==="sphere" &&
      !draft.value.creation.sphere
    ) disadvantageCategory.value="common";
    baseline.value=JSON.stringify(draft.value);
  }catch(cause){
    error.value=humanError((cause as Error).message);
  }finally{
    loading.value=false;
  }
}

async function saveCharacter(){
  if(!character.value||!draft.value||saving.value)return;
  saving.value=true;
  error.value="";
  notice.value="";
  try{
    const surname=draft.value.identity.name.trim()||character.value.name;
    draft.value.identity.name=surname;
    const name=[draft.value.identity.firstName.trim(),surname].filter(Boolean).join(" ");
    const result=await api<{character:Character}>(`/api/characters/${character.value.id}`,{
      method:"PATCH",
      body:JSON.stringify({
        name,
        data:draft.value,
        version:character.value.version
      })
    });
    character.value=result.character;
    draft.value=structuredClone(result.character.data);
    baseline.value=JSON.stringify(draft.value);
    notice.value=`Fiche enregistrée · version ${result.character.version}.`;
  }catch(cause){
    const err=cause as Error;
    error.value=humanError(err.message);
    if(cause instanceof ApiError&&cause.status===409){
      notice.value="Aucune donnée locale n’a été écrasée.";
    }
  }finally{
    saving.value=false;
  }
}

function readImage(file:File){
  return new Promise<string>((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error("Lecture de l’image impossible."));
    reader.onload=()=>resolve(String(reader.result??""));
    reader.readAsDataURL(file);
  });
}

function loadImage(src:string){
  return new Promise<HTMLImageElement>((resolve,reject)=>{
    const image=new Image();
    image.onerror=()=>reject(new Error("Format d’image illisible."));
    image.onload=()=>resolve(image);
    image.src=src;
  });
}

function canvasData(image:HTMLImageElement,max:number,quality:number){
  const ratio=Math.min(1,max/Math.max(image.naturalWidth||1,image.naturalHeight||1));
  const canvas=document.createElement("canvas");
  canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));
  canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
  const context=canvas.getContext("2d");
  if(!context)throw new Error("Impossible de préparer le portrait.");
  context.drawImage(image,0,0,canvas.width,canvas.height);
  let data=canvas.toDataURL("image/webp",quality);
  if(!data.startsWith("data:image/webp"))data=canvas.toDataURL("image/jpeg",quality);
  return data;
}

async function resizePortrait(file:File){
  if(!file.type.startsWith("image/"))throw new Error("Le fichier choisi n’est pas une image.");
  if(file.size>12*1024*1024)throw new Error("Image trop lourde : 12 Mo maximum avant redimensionnement.");
  const image=await loadImage(await readImage(file));
  let data=canvasData(image,640,.82);
  if(data.length>700_000)data=canvasData(image,480,.7);
  if(data.length>800_000)throw new Error("Le portrait reste trop lourd après compression.");
  return data;
}

async function setPortrait(event:Event){
  if(!draft.value)return;
  const input=event.target as HTMLInputElement;
  const file=input.files?.[0];
  if(!file)return;
  error.value="";
  try{
    draft.value.identity.portraitDataUrl=await resizePortrait(file);
    draft.value.identity.portraitName=file.name;
  }catch(cause){
    error.value=(cause as Error).message;
  }finally{
    input.value="";
  }
}

function removePortrait(){
  if(!draft.value)return;
  draft.value.identity.portraitDataUrl="";
  draft.value.identity.portraitName="";
}

function selectOrigin(id:string){
  if(!draft.value||draft.value.creation.origin===id)return;
  draft.value.creation.origin=id;
  draft.value.talents.origin="";
}

function selectOriginTalent(id:string){
  if(!draft.value)return;
  draft.value.talents.origin=id;
}

function resetStyleAllocations(){
  if(!draft.value)return;
  for(const skill of Object.values(draft.value.skills))skill.style=0;
}

function selectSphere(id:string){
  if(!draft.value||draft.value.creation.sphere===id)return;
  draft.value.creation.sphere=id;
  draft.value.creation.style="";
  draft.value.talents.sphere="";
  draft.value.talents.expertise="";
  resetStyleAllocations();
}

function selectStyle(id:string){
  if(!draft.value||draft.value.creation.style===id)return;
  draft.value.creation.style=id;
  draft.value.talents.expertise="";
  resetStyleAllocations();
}

function sphereFixed(id:string){
  return selectedSphere.value?.fixedSkills.includes(id)?1:0;
}

function skillRaw(id:string){
  if(!draft.value)return 0;
  const data=draft.value.skills[id]??{style:0,free:0,edge:0};
  return sphereFixed(id)+Number(data.style||0)+Number(data.free||0)+Number(data.edge||0);
}

function changeStylePoint(id:string,delta:number){
  if(!draft.value||!selectedStyle.value?.skills.includes(id))return;
  const skill=draft.value.skills[id];
  if(!skill)return;
  const next=Number(skill.style||0)+delta;
  if(next<0||next>2)return;
  if(delta>0&&stylePointsUsed.value>=5)return;
  if(delta>0&&skillRaw(id)>=5)return;
  skill.style=next;
}

function changeFreeSkillPoint(id:string,delta:number){
  if(!draft.value||!rules.value)return;
  const skill=draft.value.skills[id];
  if(!skill)return;
  const next=Number(skill.free||0)+delta;
  if(next<0)return;
  if(delta>0&&freeSkillPointsUsed.value>=freeSkillBudget.value)return;
  if(delta>0&&skillRaw(id)>=rules.value.creation.skills.rawMax)return;
  skill.free=next;
}

function changeAttribute(id:string,delta:number){
  if(!draft.value||!rules.value)return;
  const config=rules.value.creation.attributes;
  const current=Number(draft.value.attributes[id]??config.min);
  const next=current+delta;
  if(next<config.min||next>config.max)return;
  if(delta>0&&attributeTotal.value>=attributeBudget.value)return;
  draft.value.attributes[id]=next;
}

function beforeUnload(event:BeforeUnloadEvent){
  if(!dirty.value)return;
  event.preventDefault();
  event.returnValue="";
}

onBeforeRouteLeave(()=>{
  if(!dirty.value)return true;
  return window.confirm("Des modifications ne sont pas enregistrées. Quitter quand même ?");
});

onMounted(()=>{
  window.addEventListener("beforeunload",beforeUnload);
  void loadCharacter();
});
onBeforeUnmount(()=>window.removeEventListener("beforeunload",beforeUnload));
</script>

<template>
  <div class="builder-v2-shell">
    <header class="topbar builder-topbar">
      <a class="brand" href="/">
        <span class="brand-mark">TU</span>
        <span>
          <strong>Terra Umbra</strong>
          <small>California · Builder V2</small>
        </span>
      </a>

      <div class="top-actions">
        <span v-if="character" class="api-pill ok">v{{ character.version }}</span>
        <a class="ghost compact back-link" href="/">Mes personnages</a>
        <button class="primary compact" type="button" :disabled="saving || loading || !dirty" @click="saveCharacter">
          {{ saving ? "Enregistrement…" : dirty ? "Enregistrer" : "Enregistré" }}
        </button>
      </div>
    </header>

    <main v-if="loading" class="builder-loading">
      Chargement de la fiche…
    </main>

    <main v-else-if="error && !draft" class="builder-loading error-state">
      <strong>Impossible d’ouvrir cette fiche.</strong>
      <span>{{ error }}</span>
      <a class="secondary back-link" href="/">Retour à Mes personnages</a>
    </main>

    <main v-else-if="draft && character && rules && lore" class="builder-workspace">
      <aside class="builder-sidebar panel">
        <div class="builder-character">
          <div class="builder-mini-portrait" :class="{ empty: !draft.identity.portraitDataUrl }">
            <img
              v-if="draft.identity.portraitDataUrl"
              :src="draft.identity.portraitDataUrl"
              :alt="`Portrait de ${identityDisplayName || character.name}`"
            />
            <span v-else>TU</span>
          </div>
          <div>
            <p class="eyebrow">PERSONNAGE</p>
            <h1>{{ identityDisplayName || character.name }}</h1>
            <small>
              {{ draft.meta?.importedFrom === "v1-json" ? "Importé depuis le Builder V1" : "Fiche native V2" }}
            </small>
          </div>
        </div>

        <nav class="builder-nav" aria-label="Étapes du Builder">
          <button
            v-for="([id,label,enabled],index) in sections"
            :key="id"
            type="button"
            :class="{ active: id === activeStep, done: enabled && stepDone(id) }"
            :disabled="!enabled"
            @click="enabled && (activeStep = id)"
          >
            <span>{{ index + 1 }}.</span>
            <strong>{{ label }}</strong>
            <small v-if="enabled">{{ stepDone(id) ? "ok" : "à compléter" }}</small>
            <small v-else>à reconstruire</small>
          </button>
        </nav>
      </aside>

      <section class="builder-main">
        <div v-if="notice || error" class="feedback" :class="{ error: !!error }">
          {{ error || notice }}
        </div>

        <article v-if="activeStep === 'identity'" class="panel builder-card">
          <div class="section-heading builder-heading">
            <div>
              <p class="eyebrow">01 · IDENTITÉ</p>
              <h2>Concept et identité</h2>
            </div>
            <span class="schema-badge">schema v{{ draft.schemaVersion }}</span>
          </div>

          <p class="builder-intro">
            Commencez par la personne avant les chiffres. Le portrait est stocké avec la fiche
            après redimensionnement ; il suivra donc le personnage sur les autres navigateurs.
          </p>

          <div class="identity-layout">
            <aside class="portrait-card">
              <div class="portrait-frame" :class="{ empty: !draft.identity.portraitDataUrl }">
                <img
                  v-if="draft.identity.portraitDataUrl"
                  :src="draft.identity.portraitDataUrl"
                  :alt="`Portrait de ${identityDisplayName || 'personnage'}`"
                />
                <div v-else class="portrait-empty">
                  <strong>Portrait</strong>
                  <span>Ajoutez une image pour incarner visuellement le personnage.</span>
                </div>
              </div>

              <button class="ghost" type="button" @click="portraitInput?.click()">
                {{ draft.identity.portraitDataUrl ? "Changer le portrait" : "Choisir une image" }}
              </button>
              <input ref="portraitInput" type="file" accept="image/*" hidden @change="setPortrait" />
              <button
                v-if="draft.identity.portraitDataUrl"
                class="ghost danger"
                type="button"
                @click="removePortrait"
              >
                Retirer le portrait
              </button>
              <small>Image redimensionnée à 640 px maximum avant enregistrement.</small>
            </aside>

            <div>
              <div class="identity-grid">
                <label>
                  Nom
                  <input v-model="draft.identity.name" maxlength="120" />
                  <small class="field-help">Le nom principal sous lequel le personnage est identifié.</small>
                </label>
                <label>
                  Prénom
                  <input v-model="draft.identity.firstName" maxlength="120" />
                  <small class="field-help">Le prénom courant du personnage.</small>
                </label>
                <label>
                  Alias
                  <input v-model="draft.identity.alias" />
                  <small class="field-help">Surnom, indicatif, nom de scène, pseudonyme de réseau ou identité utilisée dans certains milieux.</small>
                </label>
                <label>
                  Occupation
                  <input v-model="draft.identity.occupation" />
                  <small class="field-help">Ce que le personnage fait aujourd’hui ; la Sphère et le Style préciseront son milieu et sa pratique de départ.</small>
                </label>
                <label>
                  Âge
                  <input v-model="draft.identity.age" />
                  <small class="field-help">Âge réel, légal ou apparent si cela a du sens pour le concept.</small>
                </label>
                <label>
                  Sexe
                  <input v-model="draft.identity.sex" />
                  <small class="field-help">Information descriptive sans conséquence mécanique.</small>
                </label>
                <label>
                  Taille
                  <input v-model="draft.identity.height" />
                  <small class="field-help">Information descriptive ; gardez l’unité qui vous convient.</small>
                </label>
                <label>
                  Poids
                  <input v-model="draft.identity.weight" />
                  <small class="field-help">Information descriptive sans conséquence mécanique.</small>
                </label>
              </div>

              <div class="narrative-grid">
                <label>
                  Concept
                  <textarea v-model="draft.identity.concept" rows="3"></textarea>
                  <small class="field-help">Une phrase qui résume l’idée du personnage : rôle, tempérament, contradiction ou image forte.</small>
                </label>
                <label>
                  Objectif
                  <textarea v-model="draft.identity.objective" rows="3"></textarea>
                  <small class="field-help">Ce que le personnage veut concrètement aujourd’hui : retrouver quelqu’un, gagner une place, payer une dette, comprendre un secret…</small>
                </label>
                <label>
                  Notes / background
                  <textarea v-model="draft.identity.notes" rows="7"></textarea>
                  <small class="field-help">Caractère, apparence, relations, histoire ou événements marquants ; inutile d’écrire une biographie complète avant de jouer.</small>
                </label>
              </div>
            </div>
          </div>
        </article>

        <article v-else-if="activeStep === 'origin'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">02 · ORIGINE</p>
              <h2>Origine sociale</h2>
            </div>
            <span class="schema-badge">{{ stepDone("origin") ? "complet" : "à compléter" }}</span>
          </div>

          <p class="builder-intro">
            L’Origine décrit le milieu dans lequel le personnage a grandi ou reçu l’essentiel
            de son éducation. Elle ne détermine pas sa Sphère actuelle.
          </p>

          <div class="rule-note">
            <strong>Ce que ce choix représente :</strong> des habitudes, des codes et un acquis durable
            de l’enfance ou de la formation initiale. Le Talent d’Origine choisi n’est pas perdu si
            le personnage change ensuite de métier, de Sphère ou de loyauté.
          </div>

          <div class="choice-grid">
            <button
              v-for="(origin,id) in rules.origins"
              :key="id"
              type="button"
              class="choice-card"
              :class="{ selected: draft.creation.origin === id }"
              @click="selectOrigin(String(id))"
            >
              <strong>{{ origin.name }}</strong>
              <span>{{ lore.origin[String(id)] }}</span>
            </button>
          </div>

          <div v-if="draft.creation.origin" class="subsection">
            <TalentSelector
              label="Talent d’Origine gratuit"
              placeholder="— Choisir un acquis de votre Origine —"
              :groups="[{ label: `Origine — ${rules.origins[draft.creation.origin]?.name || ''}`, items: originTalents }]"
              :model-value="draft.talents.origin"
              :selected-lore="talentNarrative(talentById(draft.talents.origin))"
              :choice-spec="talentChoiceSpec(draft.talents.origin)"
              :choice-value="talentChoiceValue(draft.talents.origin)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.origin))"
              @update:model-value="setTalent('origin',$event)"
              @update:choice-value="setTalentChoice(draft.talents.origin,$event)"
            />
          </div>
        </article>

        <article v-else-if="activeStep === 'sphere'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">03 · SPHÈRE & STYLE</p>
              <h2>Sphère actuelle & Style</h2>
            </div>
            <span class="schema-badge">Style {{ stylePointsUsed }}/5</span>
          </div>

          <p class="builder-intro">
            La Sphère décrit le milieu dans lequel vous vivez et travaillez aujourd’hui.
            Elle pose cinq Compétences fixes à +1. Le Style décrit votre pratique de départ
            et fournit cinq points guidés à répartir.
          </p>

          <div class="rule-note">
            <strong>Sphère ≠ Origine :</strong> l’Origine raconte d’où vous venez ; la Sphère raconte
            où vous vivez et travaillez aujourd’hui. <strong>Style ≠ classe :</strong> il décrit votre
            pratique de départ mais ne vous enferme pas dans une progression. L’Enveloppe augmentique
            d’un Style représente ce qui a déjà pu être investi dans le corps avant le scénario 1 :
            ce n’est pas de l’argent liquide.
          </div>

          <div class="choice-grid">
            <button
              v-for="(sphere,id) in rules.spheres"
              :key="id"
              type="button"
              class="choice-card sphere-card"
              :class="{ selected: draft.creation.sphere === id }"
              @click="selectSphere(String(id))"
            >
              <strong>{{ sphere.name }}</strong>
              <span>{{ lore.sphere[String(id)] }}</span>
              <small><b>5 points fixes :</b> {{ sphere.fixedSkills.map((skill)=>skillName(skill)+" +1").join(" · ") }}</small>
              <small><b>Appui :</b> {{ sphere.support }}</small>
            </button>
          </div>

          <template v-if="selectedSphere">
            <div class="subsection">
              <h3>Choisir le Style</h3>
              <div class="choice-grid">
                <button
                  v-for="style in styleOptions"
                  :key="style.id"
                  type="button"
                  class="choice-card style-card"
                  :class="{ selected: draft.creation.style === style.id }"
                  @click="selectStyle(style.id)"
                >
                  <strong>{{ style.name }}</strong>
                  <span>{{ lore.style[style.id] }}</span>
                  <small>
                    <b>Train de vie :</b> {{ style.lifestyle }} · <b>Compte :</b> {{ formatMoney(style.account) }}
                    · <b>Augmentique :</b> {{ formatMoney(style.augmentationEnvelope) }}
                    <template v-if="style.vehicleCapital"> · <b>Véhicule :</b> {{ formatMoney(style.vehicleCapital) }}</template>
                  </small>
                </button>
              </div>
            </div>

            <div v-if="selectedStyle" class="subsection">
              <div class="subsection-title">
                <div>
                  <h3>Répartir les 5 points du Style</h3>
                  <p>Maximum +2 dans une même Compétence. Le brut de création ne peut pas dépasser 5.</p>
                </div>
                <span class="schema-badge">{{ stylePointsUsed }}/5</span>
              </div>

              <div class="allocator-grid">
                <div v-for="skillId in selectedStyle.skills" :key="skillId" class="allocator-card">
                  <div>
                    <strong>{{ skillName(skillId) }}</strong>
                    <small>Brut actuel {{ skillRaw(skillId) }}/5</small>
                    <p>{{ lore.skill[skillId] }}</p>
                  </div>
                  <div class="stepper">
                    <button type="button" @click="changeStylePoint(skillId,-1)">−</button>
                    <strong>{{ draft.skills[skillId]?.style || 0 }}</strong>
                    <button type="button" @click="changeStylePoint(skillId,1)">+</button>
                  </div>
                </div>
              </div>

              <div class="rule-note">
                <strong>Expertises autorisées :</strong>
                {{ selectedStyle.expertiseFamilies.map(attributeName).join(" / ") }}
                <br />
                <strong>Appui de Sphère :</strong> {{ selectedSphere.support }}
              </div>
            </div>
          </template>
        </article>

        <article v-else-if="activeStep === 'attributes'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">04 · ATTRIBUTS</p>
              <h2>Attributs</h2>
            </div>
            <span class="schema-badge">{{ attributeTotal }} / {{ attributeBudget }}</span>
          </div>

          <p class="builder-intro">
            Répartissez le budget entre les cinq Attributs. Base {{ rules.creation.attributes.baseTotal }}
            points, minimum {{ rules.creation.attributes.min }}, maximum {{ rules.creation.attributes.max }}.
            Les éventuels +2 Attributs achetés avec Edge sont attribués séparément à l’étape Edge et ne modifient jamais ce budget de 22 points.
          </p>

          <div class="attribute-grid">
            <div v-for="attribute in rules.attributes" :key="attribute.id" class="attribute-card">
              <strong>{{ attribute.name }}</strong>
              <p>{{ lore.attribute[attribute.id] }}</p>
              <div class="stepper large">
                <button type="button" @click="changeAttribute(attribute.id,-1)">−</button>
                <span>{{ draft.attributes[attribute.id] }}</span>
                <button type="button" @click="changeAttribute(attribute.id,1)">+</button>
              </div>
            </div>
          </div>

          <div class="rule-note" :class="{ bad: attributeTotal !== attributeBudget }">
            <strong v-if="attributeTotal === attributeBudget">Budget entièrement réparti.</strong>
            <strong v-else-if="attributeTotal < attributeBudget">
              Il reste {{ attributeBudget - attributeTotal }} point{{ attributeBudget - attributeTotal > 1 ? "s" : "" }} à répartir.
            </strong>
            <strong v-else>
              Budget dépassé de {{ attributeTotal - attributeBudget }}.
            </strong>
          </div>
        </article>

        <article v-else-if="activeStep === 'skills'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">05 · COMPÉTENCES</p>
              <h2>Compétences libres</h2>
            </div>
            <span class="schema-badge">{{ freeSkillPointsUsed }} / {{ freeSkillBudget }}</span>
          </div>

          <p class="builder-intro">
            Les cinq points fixes de Sphère et les cinq points de Style sont déjà intégrés.
            Répartissez ici uniquement les {{ rules.creation.skills.freePoints }} points libres.
            Les éventuels points achetés avec Edge sont affichés dans les valeurs mais se répartissent
            à l’étape Edge. Le Brut ne peut pas dépasser {{ rules.creation.skills.rawMax }} à la création.
          </p>

          <div v-if="!selectedStyle" class="rule-note bad">
            Choisissez d’abord une Sphère et un Style.
          </div>

          <template v-else>
            <div v-if="edgeSkillBudget > 0" class="rule-note">
              <strong>Edge déjà acheté :</strong> {{ edgeSkillPointsUsed }} / {{ edgeSkillBudget }}
              point{{ edgeSkillBudget > 1 ? "s" : "" }} attribué{{ edgeSkillPointsUsed > 1 ? "s" : "" }}.
              Cette enveloppe sera modifiable uniquement au bloc Edge.
            </div>

            <div
              v-for="attribute in rules.attributes"
              :key="attribute.id"
              class="skill-family"
            >
              <h3>{{ attribute.name }}</h3>
              <div class="skill-grid">
                <div
                  v-for="skill in rules.skills.filter((item)=>item.attribute===attribute.id)"
                  :key="skill.id"
                  class="skill-card"
                >
                  <div class="skill-head">
                    <strong>{{ skill.name }}</strong>
                    <span>
                      Brut {{ skillRaw(skill.id) }}/{{ rules.creation.skills.rawMax }}
                      <template v-if="skillTalentBonus(skill.id)"> · Final {{ skillFinal(skill.id) }}</template>
                    </span>
                  </div>

                  <p class="skill-lore">{{ lore.skill[skill.id] }}</p>

                  <div class="skill-breakdown">
                    <span>Sphère <strong>{{ sphereFixed(skill.id) }}</strong></span>
                    <span>Style <strong>{{ draft.skills[skill.id]?.style || 0 }}</strong></span>
                    <span>Libre <strong>{{ draft.skills[skill.id]?.free || 0 }}</strong></span>
                    <span v-if="draft.skills[skill.id]?.edge">Edge <strong>{{ draft.skills[skill.id]?.edge }}</strong></span>
                    <span v-if="skillTalentBonus(skill.id)">Talent <strong>+{{ skillTalentBonus(skill.id) }}</strong></span>
                  </div>

                  <div class="skill-free-line">
                    <span>Points libres</span>
                    <div class="stepper">
                      <button type="button" @click="changeFreeSkillPoint(skill.id,-1)">−</button>
                      <strong>{{ draft.skills[skill.id]?.free || 0 }}</strong>
                      <button type="button" @click="changeFreeSkillPoint(skill.id,1)">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rule-note" :class="{ bad: freeSkillPointsUsed !== freeSkillBudget }">
              <strong v-if="freeSkillPointsUsed === freeSkillBudget">
                Tous les points libres sont répartis.
              </strong>
              <strong v-else-if="freeSkillPointsUsed < freeSkillBudget">
                Il reste {{ freeSkillBudget - freeSkillPointsUsed }} point{{ freeSkillBudget - freeSkillPointsUsed > 1 ? "s" : "" }} libre{{ freeSkillBudget - freeSkillPointsUsed > 1 ? "s" : "" }}.
              </strong>
              <strong v-else>
                Budget dépassé de {{ freeSkillPointsUsed - freeSkillBudget }}.
              </strong>
            </div>
          </template>
        </article>

        <article v-else-if="activeStep === 'talents'" class="panel builder-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">06 · TALENTS</p>
              <h2>Talents de Réalité</h2>
            </div>
            <span class="schema-badge">{{ stepDone("talents") ? "complet" : "à compléter" }}</span>
          </div>

          <p class="builder-intro">
            Choisissez un Talent gratuit pour chacune des quatre provenances de création.
            Les Talents d’Expertise proposés sont limités aux deux familles ouvertes par votre Style.
            Les précisions et choix secondaires sont enregistrés avec la fiche.
          </p>

          <div v-if="!draft.creation.origin || !draft.creation.sphere || !selectedStyle" class="rule-note bad">
            Choisissez d’abord Origine, Sphère et Style.
          </div>

          <template v-else>
            <TalentSelector
              label="Talent d’Origine"
              placeholder="— Choisir le Talent d’Origine —"
              :groups="[{ label: `Origine — ${rules.origins[draft.creation.origin]?.name || ''}`, items: originTalents }]"
              :model-value="draft.talents.origin"
              :selected-lore="talentNarrative(talentById(draft.talents.origin))"
              :choice-spec="talentChoiceSpec(draft.talents.origin)"
              :choice-value="talentChoiceValue(draft.talents.origin)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.origin))"
              @update:model-value="setTalent('origin',$event)"
              @update:choice-value="setTalentChoice(draft.talents.origin,$event)"
            />

            <TalentSelector
              label="Talent de Sphère"
              placeholder="— Choisir le Talent de Sphère —"
              :groups="[{ label: `Sphère — ${rules.spheres[draft.creation.sphere]?.name || ''}`, items: sphereTalents }]"
              :model-value="draft.talents.sphere"
              :selected-lore="talentNarrative(talentById(draft.talents.sphere))"
              :choice-spec="talentChoiceSpec(draft.talents.sphere)"
              :choice-value="talentChoiceValue(draft.talents.sphere)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.sphere))"
              @update:model-value="setTalent('sphere',$event)"
              @update:choice-value="setTalentChoice(draft.talents.sphere,$event)"
            />

            <TalentSelector
              label="Talent d’Expertise"
              placeholder="— Choisir une Expertise —"
              :groups="selectedStyle.expertiseFamilies.map((attribute)=>({
                label: attributeName(attribute),
                items: expertiseTalents.filter((talent)=>talent.attribute===attribute)
              }))"
              :model-value="draft.talents.expertise"
              :selected-lore="talentNarrative(talentById(draft.talents.expertise))"
              :choice-spec="talentChoiceSpec(draft.talents.expertise)"
              :choice-value="talentChoiceValue(draft.talents.expertise)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.expertise))"
              @update:model-value="setTalent('expertise',$event)"
              @update:choice-value="setTalentChoice(draft.talents.expertise,$event)"
            />

            <TalentSelector
              label="Talent Commun"
              placeholder="— Choisir un Talent Commun —"
              :groups="[{ label: 'Communs', items: commonTalents }]"
              :model-value="draft.talents.common"
              :selected-lore="talentNarrative(talentById(draft.talents.common))"
              :choice-spec="talentChoiceSpec(draft.talents.common)"
              :choice-value="talentChoiceValue(draft.talents.common)"
              :choice-options="talentChoiceOptions(talentChoiceSpec(draft.talents.common))"
              @update:model-value="setTalent('common',$event)"
              @update:choice-value="setTalentChoice(draft.talents.common,$event)"
            />

            <div v-if="draft.talents.expertise === 'neurodriver' && skillRaw('neurodive') < 1" class="rule-note bad">
              Neurodriver exige Neurodive 1+.
            </div>

            <div v-if="Number(draft.edge.talentPacks || 0) > 0" class="rule-note">
              <strong>Talents achetés avec Edge :</strong>
              ils restent enregistrés dans la fiche importée et seront configurés nativement à l’étape Edge.
            </div>
          </template>
        </article>

        <article v-else class="panel builder-card">
          <p class="eyebrow">RECONSTRUCTION V2</p>
          <h2>Bloc suivant</h2>
          <p class="builder-intro">
            Ce bloc sera reconstruit nativement dans la V2. Les données éventuellement
            importées de la V1 restent conservées en base pendant la migration.
          </p>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.builder-v2-shell{min-height:100vh}.builder-topbar{position:sticky}.back-link{text-decoration:none;display:inline-flex;align-items:center}.builder-loading{min-height:calc(100vh - 74px);display:grid;place-content:center;gap:1rem;color:#9f988c;text-align:center}.error-state strong{color:#e2b0aa}.builder-workspace{width:min(1440px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 5rem;display:grid;grid-template-columns:285px minmax(0,1fr);gap:1.25rem;align-items:start}.builder-sidebar{position:sticky;top:94px;overflow:hidden}.builder-character{padding:1.1rem;display:grid;grid-template-columns:54px 1fr;gap:.8rem;align-items:center;border-bottom:1px solid rgba(255,255,255,.07)}.builder-character h1{margin:.15rem 0 .35rem;font-family:Georgia,serif;font-size:1.35rem;font-weight:500}.builder-character small{color:#7e786f}.builder-mini-portrait{width:54px;height:68px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:#0d0c0a;display:grid;place-items:center}.builder-mini-portrait img{width:100%;height:100%;object-fit:cover}.builder-mini-portrait.empty span{color:#7c6b4b;font-family:Georgia,serif}.builder-nav{display:grid;padding:.55rem}.builder-nav button{display:grid;grid-template-columns:1.6rem 1fr auto;align-items:center;gap:.45rem;width:100%;padding:.7rem .65rem;border:0;border-left:2px solid transparent;text-align:left;color:#8e887f;background:transparent}.builder-nav button.active{border-left-color:#a17d45;color:#e6ddcf;background:rgba(161,125,69,.08)}.builder-nav button.done:not(.active){color:#a7c4a4}.builder-nav button:disabled{opacity:.5}.builder-nav button span,.builder-nav button small{font-size:.68rem}.builder-nav button small{color:#675f56}.builder-nav button.done small{color:#8faf8c}.builder-main{min-width:0}.builder-card{padding:clamp(1.2rem,3vw,2rem)}.builder-heading{align-items:center}.schema-badge{padding:.35rem .55rem;border:1px solid rgba(199,173,120,.25);color:#c7ad78;font-size:.72rem;white-space:nowrap}.builder-intro{color:#969085;line-height:1.65}.identity-layout{display:grid;grid-template-columns:230px minmax(0,1fr);gap:1.4rem;margin-top:1.4rem;align-items:start}.portrait-card{display:grid;gap:.65rem}.portrait-card>small{color:#777169;line-height:1.45}.portrait-frame{aspect-ratio:4/5;overflow:hidden;border:1px solid rgba(255,255,255,.14);background:#090908;display:grid;place-items:center}.portrait-frame img{width:100%;height:100%;object-fit:cover}.portrait-frame.empty{border-style:dashed}.portrait-empty{padding:1rem;display:grid;gap:.5rem;text-align:center;color:#777169}.portrait-empty strong{color:#cfc6b6;font-family:Georgia,serif;font-size:1.2rem}.identity-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}.field-help{color:#777169;font-size:.7rem;line-height:1.4}.narrative-grid{display:grid;gap:1rem;margin-top:1rem}textarea{width:100%;padding:.7rem .75rem;border:1px solid rgba(255,255,255,.12);outline:none;resize:vertical;color:#eee8dc;background:#12110f;font:inherit}textarea:focus{border-color:#9d7c48;box-shadow:0 0 0 2px rgba(157,124,72,.14)}.choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:.8rem;margin-top:1.25rem}.choice-card{display:grid;gap:.45rem;min-height:94px;padding:1rem;border:1px solid rgba(255,255,255,.1);text-align:left;color:#cfc7ba;background:rgba(255,255,255,.018)}.choice-card:hover{border-color:rgba(199,173,120,.38)}.choice-card.selected{border-color:#a17d45;background:rgba(161,125,69,.1)}.choice-card span{color:#938d83;font-size:.8rem;line-height:1.45}.choice-card small{color:#746e65;font-size:.69rem;line-height:1.45}.sphere-card{min-height:150px}.style-card{min-height:120px}.subsection{margin-top:2rem;padding-top:1.4rem;border-top:1px solid rgba(255,255,255,.07)}.subsection h3{margin:0 0 .7rem;font-family:Georgia,serif;font-size:1.25rem}.subsection-title{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start}.subsection-title p{margin:.35rem 0 0;color:#8f897f;font-size:.85rem}.talent-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:.7rem}.allocator-grid,.attribute-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem;margin-top:1rem}.allocator-card,.attribute-card{padding:.85rem;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.015)}.allocator-card{display:flex;justify-content:space-between;align-items:center;gap:.8rem}.allocator-card>div:first-child{display:grid;gap:.2rem}.allocator-card small{color:#746e65}.allocator-card p{margin:.3rem 0 0;color:#817a70;font-size:.72rem;line-height:1.4}.stepper{display:grid;grid-template-columns:34px 32px 34px;align-items:center;text-align:center}.stepper button{height:34px;border:1px solid rgba(255,255,255,.12);color:#d8cebe;background:#11100e}.stepper button:hover{border-color:#9d7c48}.attribute-card{display:grid;gap:.75rem;text-align:center}.attribute-card>strong{font-family:Georgia,serif}.attribute-card p{margin:0;color:#817a70;font-size:.74rem;line-height:1.45;text-align:left}.stepper.large{grid-template-columns:42px 1fr 42px}.stepper.large span{font-family:Georgia,serif;font-size:1.7rem}.rule-note{margin-top:1rem;padding:.85rem 1rem;border:1px solid rgba(112,168,121,.22);color:#a8bca6;background:rgba(49,80,54,.1);line-height:1.55}.rule-note.bad{border-color:rgba(166,81,72,.28);color:#d0a29c;background:rgba(93,42,37,.12)}.skill-family{margin-top:1.7rem}.skill-family h3{margin:0 0 .65rem;font-family:Georgia,serif;font-size:1.15rem}.skill-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:.7rem}.skill-card{display:grid;gap:.7rem;padding:.85rem;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.015)}.skill-head,.skill-free-line{display:flex;justify-content:space-between;align-items:center;gap:.7rem}.skill-head span{color:#c7ad78;font-size:.72rem}.skill-lore{margin:0;color:#817a70;font-size:.73rem;line-height:1.45}.skill-breakdown{display:flex;flex-wrap:wrap;gap:.4rem}.skill-breakdown span{padding:.28rem .42rem;border:1px solid rgba(255,255,255,.07);color:#7d776e;font-size:.68rem}.skill-breakdown strong{color:#bdb4a6}.skill-free-line{padding-top:.55rem;border-top:1px solid rgba(255,255,255,.06);color:#8f897f;font-size:.78rem}@media(max-width:900px){.builder-workspace{grid-template-columns:1fr}.builder-sidebar{position:static}.builder-nav{grid-template-columns:repeat(2,minmax(0,1fr))}.identity-layout{grid-template-columns:1fr}.portrait-card{max-width:260px}.builder-topbar{flex-wrap:wrap}.top-actions{width:100%;justify-content:flex-end}}@media(max-width:620px){.identity-grid{grid-template-columns:1fr}.builder-nav{grid-template-columns:1fr}.choice-grid{grid-template-columns:1fr}.subsection-title{flex-direction:column}}
</style>
