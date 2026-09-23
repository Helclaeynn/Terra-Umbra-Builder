<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import TerraUmbraBrand from '../components/TerraUmbraBrand.vue';
import { api, ApiError } from '../lib/api';
import { compareHistory, revisionLabel, type HistoryPage, type HistoryRevision, type HistoryChange } from '../lib/character-history';
import type { CreationRules } from '../lib/creation-types';
import { ensureTruthRulesPackage, type TruthRulesPackage } from '../lib/truth';
const id=String(useRoute().params.id);
const character=ref<HistoryPage['character']|null>(null),loading=ref(false),error=ref(''),needsLogin=ref(false),nextBefore=ref<number|null>(null);
type Row={revision:HistoryRevision;changes:HistoryChange[];initial:boolean;missing:boolean};
const rows=ref<Row[]>([]),rules=shallowRef<CreationRules|null>(null),truth=shallowRef<TruthRulesPackage|null>(null);
let generation=0,controller:AbortController|null=null;
async function load(more=false){
  const current=++generation;controller?.abort();controller=new AbortController();
  const options={signal:controller.signal};loading.value=true;error.value='';needsLogin.value=false;
  if(!more){rows.value=[];character.value=null;nextBefore.value=null;}
  try{
    const [page,creation,truthRules]=await Promise.all([
      api<HistoryPage>(`/api/characters/${id}/history${more&&nextBefore.value?`?before=${nextBefore.value}`:''}`,options),
      rules.value?Promise.resolve({rules:rules.value}):api<{rules:CreationRules}>('/api/rulesets/terra-umbra/creation',options),
      truth.value??api<TruthRulesPackage>('/api/rulesets/terra-umbra/truth',options)
    ]);
    if(current!==generation)return;
    rules.value=creation.rules;truth.value=ensureTruthRulesPackage(truthRules);
    const batch=page.revisions.map((revision,index)=>({revision,...compareHistory(revision,page.revisions[index+1]??page.predecessor,rules.value!,truth.value!)}));
    rows.value=more?[...rows.value,...batch]:batch;character.value=page.character;nextBefore.value=page.nextBefore;
  }catch(cause){
    if(current!==generation)return;
    const inaccessible=cause instanceof ApiError&&[401,403,404].includes(cause.status);
    if(inaccessible){rows.value=[];character.value=null;nextBefore.value=null;}
    needsLogin.value=cause instanceof ApiError&&cause.status===401;
    error.value=needsLogin.value?'Connecte-toi pour consulter ton historique.':inaccessible?'Cet historique est privé et n’est pas accessible avec ton compte.':'Impossible de charger l’historique. Réessaie dans un instant.';
  }finally{if(current===generation)loading.value=false;}
}
const date=(value:string)=>new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeStyle:'short'}).format(new Date(value));
function visibility(){
  if(document.visibilityState==='hidden'){++generation;controller?.abort();rows.value=[];character.value=null;loading.value=false;}
  else void load();
}
onMounted(()=>{void load();document.addEventListener('visibilitychange',visibility);});
onUnmounted(()=>{++generation;controller?.abort();document.removeEventListener('visibilitychange',visibility);});
</script>
<template>
  <div class="history-page">
    <a class="skip-link" href="#history-main">Aller à l’historique</a>
    <header class="history-topbar"><RouterLink to="/" aria-label="Terra Umbra — accueil"><TerraUmbraBrand /></RouterLink><RouterLink class="ghost" to="/account">Mon espace</RouterLink></header>
    <main id="history-main" tabindex="-1" :aria-busy="loading">
      <p class="eyebrow">SUIVI DU PERSONNAGE · PRIVÉ</p><h1>Historique de progression</h1>
      <p v-if="character" class="history-name">{{ character.name }}</p>
      <p>Retrouve les changements entre deux sauvegardes de ton personnage. Les dates correspondent aux enregistrements ; plusieurs actions peuvent être regroupées dans une même version.</p>
      <nav v-if="character" class="history-actions" aria-label="Actions de l’historique"><RouterLink class="primary" :to="`/characters/${id}/progression`">Ouvrir la progression</RouterLink><RouterLink class="ghost" :to="`/characters/${id}/sheet`">Fiche actuelle</RouterLink><RouterLink class="ghost" :to="`/characters/${id}/journal`">Journal d’aventure</RouterLink><button class="ghost" :disabled="loading" @click="load()">Actualiser</button></nav>
      <aside class="history-explanation"><strong>Comment lire les coûts ?</strong><p>Les XP et PTV reçus sont ceux des sauvegardes. Les dépenses de progression sont recalculées avec les règles actuelles : elles peuvent évoluer si les règles ou les bases de création changent. Les coûts inconnus ne sont pas assimilés à zéro.</p><p>Seules les modifications enregistrées apparaissent. Cet historique reste privé, même si ta fiche est partagée avec un MJ.</p></aside>
      <div v-if="error" class="history-error" role="alert"><p>{{ error }}</p><RouterLink v-if="needsLogin" class="ghost" :to="`/account?redirect=${encodeURIComponent(`/characters/${id}/history`)}`">Se connecter</RouterLink><button v-else class="ghost" :disabled="loading" @click="load(rows.length>0)">Réessayer</button></div>
      <p v-if="loading" role="status">Chargement de l’historique…</p>
      <p v-if="character&&!loading&&!rows.length">Aucune sauvegarde historique disponible pour ce personnage.</p>
      <ol v-if="rows.length" class="history-timeline" aria-label="Versions enregistrées">
        <li v-for="row in rows" :key="row.revision.revision" class="history-entry panel">
          <header><span class="history-version">Version {{ row.revision.revision }}{{ row.revision.revision===character?.version?' · actuelle':'' }}</span><h2>{{ revisionLabel(row.revision) }}</h2><time :datetime="row.revision.createdAt">{{ date(row.revision.createdAt) }}</time></header>
          <p v-if="row.initial">Point de départ enregistré. Les acquisitions antérieures à cette version ne peuvent pas être reconstituées.</p>
          <p v-else-if="row.missing">La version précédente n’est pas disponible : aucune comparaison fiable n’est possible.</p>
          <dl v-else-if="row.changes.length" class="history-changes"><div v-for="(change,index) in row.changes" :key="index"><dt>{{ change.label }}</dt><dd><span><small>Avant</small>{{ change.before }}</span><span aria-hidden="true">→</span><span><small>Après</small>{{ change.after }}</span></dd></div></dl>
          <p v-else>Aucun changement d’XP, de PTV, de rang ou de talent de progression dans cette sauvegarde.</p>
        </li>
      </ol>
      <button v-if="nextBefore" class="ghost history-more" :disabled="loading" @click="load(true)">Voir les versions précédentes</button>
    </main>
  </div>
</template>
<style scoped>
.history-page{min-height:100vh;background:#080f18;color:#e6eef8}.history-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px clamp(16px,3vw,48px);border-bottom:1px solid #284255}.history-page main{max-width:1150px;margin:auto;padding:clamp(16px,4vw,48px)}h1{font-size:clamp(28px,4vw,42px);margin:10px 0}h2{font-size:22px;overflow-wrap:anywhere;margin:10px 0}.history-name{color:#9ce5f4;font-size:22px;font-weight:600;overflow-wrap:anywhere}.history-page p{line-height:1.7}.history-actions{display:flex;gap:12px;flex-wrap:wrap;margin:22px 0}.history-page :is(button,.ghost,.primary){min-height:44px}.history-explanation{padding:18px 22px;background:#102331;border:1px solid #355267;border-radius:6px;color:#bbcedd}.history-explanation p{margin:8px 0 0}.history-timeline{padding:0;list-style:none;margin:26px 0}.history-entry{margin-bottom:20px}.history-version{color:#9ce5f4;font-size:14px}.history-entry time{font-size:14px;color:#adc2d4}.history-changes{margin:20px 0 0}.history-changes>div{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:16px;padding:14px 0;border-top:1px solid #284255;align-items:center;overflow-wrap:anywhere}.history-changes dd{margin:0;display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:12px}.history-changes small{display:block;color:#adc2d4;font-size:12px;margin-bottom:5px}.history-changes dd>span:last-child{color:#9ce5f4}.history-error{padding:16px;border:1px solid #c58072;border-radius:6px;margin:20px 0}.history-more{width:100%}@media(max-width:600px){.history-page main{padding:20px 16px}.history-entry{padding:18px}.history-changes>div{grid-template-columns:1fr;gap:10px}.history-actions>*{flex:1;text-align:center}.history-explanation{padding:16px}}
</style>
