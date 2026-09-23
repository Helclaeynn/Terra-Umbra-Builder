<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { api, ApiError } from "../lib/api";
import type { Character } from "../types/character";
import TerraUmbraBrand from "../components/TerraUmbraBrand.vue";
import CharacterSummary from "../components/builder/CharacterSummary.vue";
import { buildCharacterSheet, type SheetCore } from "../lib/character-sheet-model";
import { ensureTruthRulesPackage, type TruthRulesPackage } from "../lib/truth";
import type { RealityRulesPackage } from "../lib/reality";

const route=useRoute();
const id=String(route.params.id);
const endpoint=`/api/characters/${id}`;
const character=shallowRef<Character|null>(null);
const core=shallowRef<SheetCore|null>(null), truth=shallowRef<TruthRulesPackage|null>(null), reality=shallowRef<RealityRulesPackage|null>(null);
const owner=ref(false), ownerName=ref(""), loading=ref(true), error=ref(""), needsLogin=ref(false);
const shareOpen=ref(false), shareBusy=ref(false), shareError=ref(""), shareNotice=ref(""), email=ref("");
type Reader={id:string;displayName:string;email:string;active:boolean};
const readers=ref<Reader[]>([]);
let generation=0;
let controller:AbortController|null=null;
const sheet=computed(()=>character.value&&core.value&&truth.value&&reality.value
  ?buildCharacterSheet(character.value.data,core.value,truth.value,reality.value,true,character.value.name):null);
const loginLink=computed(()=>`/account?redirect=${encodeURIComponent(`/characters/${id}/sheet`)}`);
const updated=computed(()=>character.value?new Intl.DateTimeFormat("fr-FR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(character.value.updatedAt)):"");
async function load(){
  const current=++generation;
  controller?.abort();controller=new AbortController();
  const options={signal:controller.signal};
  loading.value=true;error.value="";needsLogin.value=false;
  // Clear private content while revalidating, including after a tab returns to focus.
  character.value=null;owner.value=false;readers.value=[];
  try{
    const [result,creationPkg,truthPkg,realityPkg]=await Promise.all([
      api<{character:Character;canEdit:boolean;ownerName:string}>(`${endpoint}/sheet`,options),
      core.value??api<SheetCore>("/api/rulesets/terra-umbra/creation",options),
      truth.value??api<TruthRulesPackage>("/api/rulesets/terra-umbra/truth",options),
      reality.value??api<RealityRulesPackage>("/api/rulesets/terra-umbra/reality",options)
    ]);
    if(current!==generation)return;
    core.value=creationPkg;truth.value=ensureTruthRulesPackage(truthPkg);reality.value=realityPkg;
    character.value=result.character;owner.value=result.canEdit;ownerName.value=result.ownerName;
    if(owner.value&&shareOpen.value)void loadReaders();
  }catch(cause){
    if(current!==generation)return;
    needsLogin.value=cause instanceof ApiError&&cause.status===401;
    error.value=needsLogin.value?"Connecte-toi pour consulter cette fiche.":cause instanceof ApiError&&[403,404].includes(cause.status)
      ?"Cette fiche n’est pas accessible avec ton compte. Son propriétaire peut te donner accès si tu disposes du rôle MJ."
      :"Impossible de charger la fiche. Réessaie dans un instant.";
  }finally{if(current===generation)loading.value=false;}
}
async function loadReaders(){
  const current=generation;
  shareError.value="";
  try{
    const result=await api<{readers:Reader[]}>(`${endpoint}/readers`);
    if(current===generation&&owner.value)readers.value=result.readers;
  }catch{if(current===generation)shareError.value="Impossible de charger les accès. Réessaie.";}
}
function toggleShares(event:Event){
  shareOpen.value=(event.target as HTMLDetailsElement).open;
  if(shareOpen.value)void loadReaders();
}
async function changeReader(reader?:Reader){
  if(shareBusy.value)return;
  const current=generation;
  shareBusy.value=true;shareError.value="";shareNotice.value="";
  try{
    await api(reader?`${endpoint}/readers/${reader.id}`:`${endpoint}/readers`,{
      method:reader?"DELETE":"POST",...(reader?{}:{body:JSON.stringify({email:email.value})})
    });
    if(current!==generation)return;
    email.value="";shareNotice.value=reader?"Accès retiré.":"Accès accordé. La fiche est disponible dans Mon espace pour ce MJ.";
    await loadReaders();
  }catch(cause){if(current===generation)shareError.value=cause instanceof ApiError&&cause.message==="reader_not_eligible"
    ?"Vérifie l’adresse : il faut un autre compte actif avec l’accès MJ validé (MJ, éditeur ou administrateur)."
    :"La modification des accès a échoué. Réessaie.";
  }finally{shareBusy.value=false;}
}
function jump(event:MouseEvent){
  const anchor=(event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
  if(!anchor)return;
  const section=document.getElementById(anchor.hash.slice(1));
  if(section instanceof HTMLDetailsElement)section.open=true;
}
function onVisibility(){if(document.visibilityState==="hidden"){
  ++generation;controller?.abort();character.value=null;owner.value=false;readers.value=[];
}else void load();}
function onFocus(){if(!loading.value&&document.visibilityState!=="hidden")void load();}
onMounted(()=>{void load();window.addEventListener("focus",onFocus);document.addEventListener("visibilitychange",onVisibility);});
onUnmounted(()=>{++generation;controller?.abort();window.removeEventListener("focus",onFocus);document.removeEventListener("visibilitychange",onVisibility);});
</script>

<template>
  <div class="standalone-sheet-page">
    <a class="skip-link" href="#sheet-main">Aller à la fiche</a>
    <header class="sheet-topbar"><RouterLink to="/" aria-label="Terra Umbra — accueil"><TerraUmbraBrand /></RouterLink><RouterLink class="ghost" to="/account">Mon espace</RouterLink></header>
    <main id="sheet-main" class="standalone-sheet-main" tabindex="-1" :aria-busy="loading">
      <div class="sheet-toolbar"><div><p class="eyebrow">CONSULTATION · LECTURE SEULE</p><h1>Fiche actuelle</h1></div><button class="ghost" :disabled="loading" @click="load">Actualiser</button></div>
      <p v-if="loading" role="status">Chargement de la fiche actuelle…</p>
      <div v-else-if="error" class="panel" role="alert"><p>{{ error }}</p><RouterLink v-if="needsLogin" class="primary" :to="loginLink">Se connecter</RouterLink><button v-else class="ghost" @click="load">Réessayer</button></div>
      <template v-else-if="sheet">
        <p class="sheet-version">{{ owner ? 'Ta fiche sauvegardée' : `Partagée par ${ownerName}` }} · Mise à jour le {{ updated }} · v{{ character?.version }}</p>
        <nav class="sheet-jumps" @click="jump" aria-label="Sections de la fiche"><a href="#sheet-main">Vue d’ensemble</a><a href="#sheet-skills">Compétences</a><a href="#sheet-reality">Talents</a><a href="#sheet-truth">Vérité</a><a href="#sheet-inventory">Équipement</a></nav>
        <CharacterSummary :sheet="sheet" />
        <details v-if="owner" class="sheet-sharing panel" @toggle="toggleShares">
          <summary>Partager cette fiche avec mon MJ</summary>
          <p>Le partage donne accès à toute cette fiche sauvegardée, y compris sa Vérité et ses notes, en lecture seule. Il ne donne aucun droit de modification. Tu peux retirer cet accès à tout moment.</p>
          <form @submit.prevent="changeReader()"><label>Adresse e-mail du compte MJ<input v-model="email" type="email" autocomplete="off" maxlength="254" required /></label><button class="primary" :disabled="shareBusy || !email.trim()">Accorder l’accès</button></form>
          <p>Le MJ retrouvera la fiche dans Mon espace. Tu peux aussi lui transmettre l’adresse de cette page ; le lien seul ne donne aucun accès.</p>
          <p v-if="shareError" role="alert">{{ shareError }}</p><p v-if="shareNotice" role="status">{{ shareNotice }}</p>
          <ul class="sheet-readers"><li v-for="reader in readers" :key="reader.id"><div><strong>{{ reader.displayName }}</strong><small>{{ reader.email }} · {{ reader.active?'Lecture autorisée':'Accès suspendu (compte ou rôle)' }}</small></div><button class="ghost" :disabled="shareBusy" @click="changeReader(reader)">Retirer l’accès</button></li></ul>
          <p v-if="!readers.length && !shareError">Aucun MJ n’a actuellement accès par ce partage.</p>
        </details>
      </template>
    </main>
  </div>
</template>

<style scoped>
.standalone-sheet-page{min-height:100vh;background:#080f18;color:#e6eef8}.sheet-topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:16px clamp(16px,3vw,48px);border-bottom:1px solid #284255}.standalone-sheet-main{max-width:1380px;margin:auto;padding:clamp(16px,3vw,40px)}.sheet-toolbar{display:flex;justify-content:space-between;align-items:center;gap:1rem}.sheet-toolbar h1{font-size:clamp(26px,4vw,38px);margin:8px 0}.sheet-version{color:#adc2d4;font-size:14px}.sheet-jumps{display:flex;gap:8px;flex-wrap:wrap;margin:20px 0}.sheet-jumps a{padding:12px 16px;border:1px solid #355267;border-radius:6px;color:#a3e9fa;text-decoration:none}.sheet-sharing{margin-top:28px}.sheet-sharing summary{min-height:44px;cursor:pointer;font-weight:600}.sheet-sharing form{display:flex;align-items:end;gap:12px;flex-wrap:wrap}.sheet-sharing label{flex:1;min-width:200px}.sheet-sharing input{width:100%;margin-top:8px}.sheet-sharing p{line-height:1.65}.sheet-readers{list-style:none;padding:0}.sheet-readers li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 0;border-bottom:1px solid #284255}.sheet-readers small{display:block;overflow-wrap:anywhere;margin-top:5px}.sheet-topbar .ghost,.sheet-toolbar button,.sheet-readers button{min-height:44px}@media(max-width:600px){.sheet-readers li{align-items:start;flex-direction:column}.sheet-sharing form button{width:100%}.sheet-jumps a{flex:1;text-align:center;font-size:14px}.sheet-sharing{padding:18px}}
</style>
