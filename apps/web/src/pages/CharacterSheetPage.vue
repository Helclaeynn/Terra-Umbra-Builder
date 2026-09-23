<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
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
const campaignBack=computed(()=>typeof route.query.campaign==='string'&&/^[0-9a-f-]{36}$/i.test(route.query.campaign)?`/campaigns/${route.query.campaign}`:null);
const endpoint=`/api/characters/${id}`;
const character=shallowRef<Character|null>(null);
const core=shallowRef<SheetCore|null>(null), truth=shallowRef<TruthRulesPackage|null>(null), reality=shallowRef<RealityRulesPackage|null>(null);
const owner=ref(false), ownerName=ref(""), loading=ref(true), error=ref(""), needsLogin=ref(false);
const shareOpen=ref(false), shareBusy=ref(false), shareError=ref(""), shareNotice=ref("");
const accountQuery=ref(""),searching=ref(false),searchError=ref(""),searched=ref(false);
type AccountMatch={id:string;displayName:string;role:string;shared:boolean};
const matches=ref<AccountMatch[]>([]),chosen=ref<AccountMatch|null>(null);
let searchGeneration=0,searchTimer:ReturnType<typeof setTimeout>|undefined;
let searchController:AbortController|null=null;
const roleName=(role:string)=>({gm:"MJ",editor:"Éditeur",admin:"Administrateur"}[role]??"MJ");
const accountCode=(id:string)=>id.slice(0,8);
type Reader={id:string;displayName:string;role:string;active:boolean};
const readers=ref<Reader[]>([]);
const readersLoading=ref(false);
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
  character.value=null;owner.value=false;readers.value=[];resetSearch();
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
  shareError.value="";readersLoading.value=true;
  try{
    const result=await api<{readers:Reader[]}>(`${endpoint}/readers`);
    if(current===generation&&owner.value)readers.value=result.readers;
  }catch{if(current===generation)shareError.value="Impossible de charger les accès. Réessaie.";}
  finally{if(current===generation)readersLoading.value=false;}
}
function toggleShares(event:Event){
  shareOpen.value=(event.target as HTMLDetailsElement).open;
  if(shareOpen.value)void loadReaders();
  else resetSearch();
}
async function changeReader(reader?:Reader){
  if(shareBusy.value||(!reader&&!chosen.value))return;
  const current=generation;
  shareBusy.value=true;shareError.value="";shareNotice.value="";
  try{
    await api(reader?`${endpoint}/readers/${reader.id}`:`${endpoint}/readers`,{
      method:reader?"DELETE":"POST",...(reader?{}:{body:JSON.stringify({readerId:chosen.value?.id})})
    });
    if(current!==generation)return;
    resetSearch();shareNotice.value=reader?"Accès retiré.":"Accès accordé. La fiche est disponible dans Mon espace pour ce MJ.";
    await loadReaders();
  }catch(cause){if(current===generation)shareError.value=cause instanceof ApiError&&cause.message==="reader_not_eligible"
    ?"Ce compte n’est plus disponible pour le partage. Relance la recherche : son accès MJ doit être actif."
    :"La modification des accès a échoué. Réessaie.";
  }finally{shareBusy.value=false;}
}
function resetSearch(){
  ++searchGeneration;clearTimeout(searchTimer);searchController?.abort();
  accountQuery.value="";chosen.value=null;matches.value=[];searching.value=false;searched.value=false;searchError.value="";
}
watch([accountQuery,shareOpen],()=>{
  const current=++searchGeneration;
  clearTimeout(searchTimer);searchController?.abort();
  chosen.value=null;matches.value=[];searched.value=false;searchError.value="";searching.value=false;
  const q=accountQuery.value.trim();
  if(q.length<2||!owner.value||!shareOpen.value)return;
  searching.value=true;
  searchTimer=setTimeout(()=>{void searchAccounts(q,current);},250);
});
async function searchAccounts(q:string,current:number){
  searchController=new AbortController();
  try{
    const result=await api<{accounts:AccountMatch[]}>(`${endpoint}/reader-search?q=${encodeURIComponent(q)}`,{signal:searchController.signal});
    if(current!==searchGeneration||!owner.value||!shareOpen.value)return;
    matches.value=result.accounts;searched.value=true;
  }catch{if(current===searchGeneration)searchError.value="La recherche a échoué. Modifie le nom pour réessayer.";}
  finally{if(current===searchGeneration)searching.value=false;}
}
function chooseAccount(account:AccountMatch){chosen.value=account;shareError.value="";shareNotice.value="";}
function jump(event:MouseEvent){
  const anchor=(event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
  if(!anchor)return;
  const section=document.getElementById(anchor.hash.slice(1));
  if(section instanceof HTMLDetailsElement)section.open=true;
}
function onVisibility(){if(document.visibilityState==="hidden"){
  ++generation;controller?.abort();character.value=null;owner.value=false;readers.value=[];resetSearch();
}else void load();}
function onFocus(){if(!loading.value&&document.visibilityState!=="hidden")void load();}
onMounted(()=>{void load();window.addEventListener("focus",onFocus);document.addEventListener("visibilitychange",onVisibility);});
onUnmounted(()=>{++generation;controller?.abort();resetSearch();window.removeEventListener("focus",onFocus);document.removeEventListener("visibilitychange",onVisibility);});
</script>

<template>
  <div class="standalone-sheet-page">
    <a class="skip-link" href="#sheet-main">Aller à la fiche</a>
    <header class="sheet-topbar"><RouterLink to="/" aria-label="Terra Umbra — accueil"><TerraUmbraBrand /></RouterLink><RouterLink class="ghost" to="/account">Mon espace</RouterLink></header>
    <RouterLink v-if="campaignBack" class="campaign-back" :to="campaignBack">← Retour au groupe</RouterLink>
    <main id="sheet-main" class="standalone-sheet-main" tabindex="-1" :aria-busy="loading">
      <div class="sheet-toolbar"><div><p class="eyebrow">CONSULTATION · LECTURE SEULE</p><h1>Fiche actuelle</h1></div><button class="ghost" :disabled="loading" @click="load">Actualiser</button></div>
      <p v-if="loading" role="status">Chargement de la fiche actuelle…</p>
      <div v-else-if="error" class="panel" role="alert"><p>{{ error }}</p><RouterLink v-if="needsLogin" class="primary" :to="loginLink">Se connecter</RouterLink><button v-else class="ghost" @click="load">Réessayer</button></div>
      <template v-else-if="sheet">
        <p v-if="character?.campaignId" class="sheet-version">Version de campagne · <RouterLink :to="`/campaigns/${character.campaignId}`">{{ character.campaignName }}</RouterLink> · Progression indépendante</p>
        <p class="sheet-version">{{ owner ? 'Ta fiche sauvegardée' : `Partagée par ${ownerName}` }} · Mise à jour le {{ updated }} · v{{ character?.version }}</p>
        <nav class="sheet-jumps" @click="jump" aria-label="Sections de la fiche"><a href="#sheet-main">Vue d’ensemble</a><a href="#sheet-skills">Compétences</a><a href="#sheet-reality">Talents</a><a href="#sheet-truth">Vérité</a><a href="#sheet-inventory">Équipement</a></nav>
        <CharacterSummary :sheet="sheet" />
        <details v-if="owner" class="sheet-sharing panel" @toggle="toggleShares">
          <summary>Partager cette fiche avec mon MJ</summary>
          <p>Le partage donne accès à toute cette fiche sauvegardée, y compris sa Vérité et les notes de la fiche, en lecture seule. Le journal d’aventure reste privé. Ce partage ne donne aucun droit de modification. Tu peux retirer cet accès à tout moment.</p>
          <form class="reader-search" @submit.prevent="changeReader()">
            <label for="mj-account-search">Rechercher un compte MJ par son nom<input id="mj-account-search" v-model="accountQuery" type="search" autocomplete="off" maxlength="80" aria-describedby="mj-search-help" :disabled="shareBusy" /></label>
            <p id="mj-search-help">Saisis au moins deux caractères du nom affiché. Seuls les comptes ayant l’accès MJ validé sont proposés. Le code de compte permet de distinguer les homonymes.</p>
            <p v-if="searching" role="status">Recherche des comptes…</p>
            <p v-else-if="searchError" role="alert">{{ searchError }}</p>
            <p v-else-if="searched&&!matches.length" role="status">Aucun compte MJ correspondant. Vérifie le nom affiché ou demande à ton MJ de faire valider son rôle.</p>
            <ul v-if="matches.length" class="reader-results" aria-label="Comptes MJ trouvés">
              <li v-for="account in matches" :key="account.id"><button type="button" class="reader-option" :class="{selected:chosen?.id===account.id}" :aria-pressed="chosen?.id===account.id" :disabled="account.shared||shareBusy" @click="chooseAccount(account)"><strong>{{ account.displayName }}</strong><small>{{ roleName(account.role) }} · Compte {{ accountCode(account.id) }}{{ account.shared?' · Déjà autorisé':'' }}</small></button></li>
            </ul>
            <p v-if="matches.length===12" class="search-hint">Affichage limité à 12 résultats. Précise le nom si nécessaire.</p>
            <p v-if="chosen" role="status">Compte sélectionné : <strong>{{ chosen.displayName }}</strong> · {{ accountCode(chosen.id) }}</p>
            <button class="primary" :disabled="shareBusy || !chosen || searching">{{ shareBusy?'Mise à jour…':'Accorder l’accès' }}</button>
          </form>
          <p>Le MJ retrouvera la fiche dans Mon espace. Tu peux aussi lui transmettre l’adresse de cette page ; le lien seul ne donne aucun accès.</p>
          <p v-if="shareError" role="alert">{{ shareError }}</p><p v-if="shareNotice" role="status">{{ shareNotice }}</p>
          <ul class="sheet-readers"><li v-for="reader in readers" :key="reader.id"><div><strong>{{ reader.displayName }}</strong><small>{{ roleName(reader.role) }} · Compte {{ accountCode(reader.id) }} · {{ reader.active?'Lecture autorisée':'Accès suspendu (compte ou rôle)' }}</small></div><button class="ghost" :disabled="shareBusy" @click="changeReader(reader)">Retirer l’accès</button></li></ul>
          <p v-if="readersLoading" role="status">Chargement des accès…</p>
          <p v-else-if="!readers.length && !shareError">Aucun MJ n’a actuellement accès par ce partage.</p>
        </details>
      </template>
    </main>
  </div>
</template>

<style scoped>
.campaign-back{display:inline-block;margin:20px 32px 0;padding:12px 16px;color:#a3e9fa;border:1px solid #355267;border-radius:6px;text-decoration:none;min-height:44px}

.standalone-sheet-page{min-height:100vh;background:#080f18;color:#e6eef8}.sheet-topbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:16px clamp(16px,3vw,48px);border-bottom:1px solid #284255}.standalone-sheet-main{max-width:1380px;margin:auto;padding:clamp(16px,3vw,40px)}.sheet-toolbar{display:flex;justify-content:space-between;align-items:center;gap:1rem}.sheet-toolbar h1{font-size:clamp(26px,4vw,38px);margin:8px 0}.sheet-version{color:#adc2d4;font-size:14px}.sheet-jumps{display:flex;gap:8px;flex-wrap:wrap;margin:20px 0}.sheet-jumps a{padding:12px 16px;border:1px solid #355267;border-radius:6px;color:#a3e9fa;text-decoration:none}.sheet-sharing{margin-top:28px}.sheet-sharing summary{min-height:44px;cursor:pointer;font-weight:600}.sheet-sharing form{display:flex;align-items:end;gap:12px;flex-wrap:wrap}.sheet-sharing label{flex:1;min-width:200px}.sheet-sharing input{width:100%;margin-top:8px}.sheet-sharing p{line-height:1.65}.sheet-readers{list-style:none;padding:0}.sheet-readers li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 0;border-bottom:1px solid #284255}.sheet-readers small{display:block;overflow-wrap:anywhere;margin-top:5px}.sheet-topbar .ghost,.sheet-toolbar button,.sheet-readers button{min-height:44px}@media(max-width:600px){.sheet-readers li{align-items:start;flex-direction:column}.sheet-sharing form button{width:100%}.sheet-jumps a{flex:1;text-align:center;font-size:14px}.sheet-sharing{padding:18px}}
.sheet-sharing .reader-search{display:block}.reader-search label{display:block}.reader-search>button{margin-top:12px;min-height:44px}.reader-results{list-style:none;padding:0;display:grid;gap:8px;max-height:320px;overflow:auto}.reader-option{display:grid;gap:6px;width:100%;text-align:left;min-height:58px;background:#102033;border:1px solid #355267;color:#e6eef8;padding:12px;border-radius:6px;overflow-wrap:anywhere;white-space:normal}.reader-option.selected{border-color:#9ce5f4;background:#173547}.reader-option small{color:#adc2d4}.reader-option:disabled{opacity:.65}.search-hint{font-size:14px}
</style>
