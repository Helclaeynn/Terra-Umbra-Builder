<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { api, ApiError } from "../lib/api";
import type { Character, CharacterDataV2 } from "../types/character";

const route=useRoute();
const character=ref<Character|null>(null);
const draft=ref<CharacterDataV2|null>(null);
const loading=ref(true);
const saving=ref(false);
const error=ref("");
const notice=ref("");
const baseline=ref("");

const sections=[
  ["identity","Identité",true],
  ["origin","Origine",false],
  ["sphere","Sphère & Style",false],
  ["attributes","Attributs",false],
  ["skills","Compétences",false],
  ["talents","Talents",false],
  ["truth","Vérité",false],
  ["disadvantages","Désavantages",false],
  ["edge","Edge",false],
  ["equipment","Équipement",false],
  ["finish","Finalisation",false],
  ["progression","Dépense XP & PTV",false]
] as const;

const dirty=computed(()=>{
  if(!draft.value)return false;
  return JSON.stringify(draft.value)!==baseline.value;
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

async function loadCharacter(){
  loading.value=true;
  error.value="";
  const id=String(route.params.id??"");
  try{
    const result=await api<{character:Character}>(`/api/characters/${encodeURIComponent(id)}`);
    character.value=result.character;
    draft.value=structuredClone(result.character.data);
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
    const name=draft.value.identity.name.trim()||character.value.name;
    draft.value.identity.name=name;
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
    if(cause instanceof ApiError && cause.status===409){
      notice.value="Aucune donnée locale n’a été écrasée.";
    }
  }finally{
    saving.value=false;
  }
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

    <main v-else-if="draft && character" class="builder-workspace">
      <aside class="builder-sidebar panel">
        <div class="builder-character">
          <p class="eyebrow">PERSONNAGE</p>
          <h1>{{ draft.identity.name || character.name }}</h1>
          <small>
            {{ draft.meta?.importedFrom === "v1-json" ? "Importé depuis le Builder V1" : "Fiche native V2" }}
          </small>
        </div>

        <nav class="builder-nav" aria-label="Étapes du Builder">
          <button
            v-for="([id,label,enabled],index) in sections"
            :key="id"
            type="button"
            :class="{ active: id === 'identity' }"
            :disabled="!enabled"
          >
            <span>{{ index + 1 }}.</span>
            <strong>{{ label }}</strong>
            <small v-if="!enabled">à reconstruire</small>
          </button>
        </nav>
      </aside>

      <section class="builder-main">
        <div v-if="notice || error" class="feedback" :class="{ error: !!error }">
          {{ error || notice }}
        </div>

        <article class="panel builder-card">
          <div class="section-heading builder-heading">
            <div>
              <p class="eyebrow">01 · IDENTITÉ</p>
              <h2>Concept et identité</h2>
            </div>
            <span class="schema-badge">schema v{{ draft.schemaVersion }}</span>
          </div>

          <p class="builder-intro">
            Cette page est désormais une vraie vue Vue de la V2. Elle lit la fiche par l’API
            et enregistre directement le JSON canonique en PostgreSQL.
          </p>

          <div class="identity-grid">
            <label>
              Nom
              <input v-model="draft.identity.name" maxlength="120" />
            </label>
            <label>
              Âge
              <input v-model="draft.identity.age" />
            </label>
            <label>
              Alias
              <input v-model="draft.identity.alias" />
            </label>
            <label>
              Sexe / genre
              <input v-model="draft.identity.sex" />
            </label>
            <label>
              Taille
              <input v-model="draft.identity.height" />
            </label>
            <label>
              Poids
              <input v-model="draft.identity.weight" />
            </label>
          </div>

          <div class="narrative-grid">
            <label>
              Concept
              <textarea v-model="draft.identity.concept" rows="3"></textarea>
            </label>
            <label>
              Objectif
              <textarea v-model="draft.identity.objective" rows="3"></textarea>
            </label>
            <label>
              Notes / background
              <textarea v-model="draft.identity.notes" rows="7"></textarea>
            </label>
          </div>
        </article>

        <article class="panel migration-card">
          <p class="eyebrow">ARCHITECTURE V2</p>
          <h3>État conservé côté serveur</h3>
          <p>
            Les autres blocs ne sont pas encore affichés dans le nouveau front, mais leurs
            données importées restent présentes dans la fiche et ne sont pas perdues pendant
            la reconstruction.
          </p>
          <div class="migration-stats">
            <span><strong>{{ Object.keys(draft.skills || {}).length }}</strong> compétences</span>
            <span><strong>{{ draft.disadvantages?.length || 0 }}</strong> désavantages</span>
            <span><strong>{{ draft.equipment?.length || 0 }}</strong> entrées équipement legacy</span>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.builder-v2-shell{min-height:100vh}.builder-topbar{position:sticky}.back-link{text-decoration:none;display:inline-flex;align-items:center}.builder-loading{min-height:calc(100vh - 74px);display:grid;place-content:center;gap:1rem;color:#9f988c;text-align:center}.error-state strong{color:#e2b0aa}.builder-workspace{width:min(1440px,calc(100% - 2rem));margin:0 auto;padding:2rem 0 5rem;display:grid;grid-template-columns:270px minmax(0,1fr);gap:1.25rem;align-items:start}.builder-sidebar{position:sticky;top:94px;overflow:hidden}.builder-character{padding:1.3rem;border-bottom:1px solid rgba(255,255,255,.07)}.builder-character h1{margin:.15rem 0 .4rem;font-family:Georgia,serif;font-size:1.55rem;font-weight:500}.builder-character small{color:#7e786f}.builder-nav{display:grid;padding:.55rem}.builder-nav button{display:grid;grid-template-columns:1.6rem 1fr auto;align-items:center;gap:.45rem;width:100%;padding:.7rem .65rem;border:0;border-left:2px solid transparent;text-align:left;color:#8e887f;background:transparent}.builder-nav button.active{border-left-color:#a17d45;color:#e6ddcf;background:rgba(161,125,69,.08)}.builder-nav button:disabled{opacity:.52}.builder-nav button span,.builder-nav button small{font-size:.68rem}.builder-nav button small{color:#675f56}.builder-main{min-width:0}.builder-card,.migration-card{padding:clamp(1.2rem,3vw,2rem)}.builder-heading{align-items:center}.schema-badge{padding:.35rem .55rem;border:1px solid rgba(199,173,120,.25);color:#c7ad78;font-size:.72rem}.builder-intro,.migration-card p{color:#969085;line-height:1.65}.identity-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-top:1.5rem}.narrative-grid{display:grid;gap:1rem;margin-top:1rem}textarea{width:100%;padding:.7rem .75rem;border:1px solid rgba(255,255,255,.12);outline:none;resize:vertical;color:#eee8dc;background:#12110f;font:inherit}textarea:focus{border-color:#9d7c48;box-shadow:0 0 0 2px rgba(157,124,72,.14)}.migration-card{margin-top:1.25rem}.migration-card h3{margin:.2rem 0 .65rem;font-family:Georgia,serif;font-size:1.35rem}.migration-stats{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}.migration-stats span{padding:.55rem .7rem;border:1px solid rgba(255,255,255,.08);color:#918a80;font-size:.78rem}.migration-stats strong{color:#d9c69e}@media(max-width:860px){.builder-workspace{grid-template-columns:1fr}.builder-sidebar{position:static}.builder-nav{grid-template-columns:repeat(2,minmax(0,1fr))}.identity-grid{grid-template-columns:1fr}.builder-topbar{flex-wrap:wrap}.top-actions{width:100%;justify-content:flex-end}}
</style>
