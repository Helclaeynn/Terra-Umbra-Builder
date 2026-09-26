<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { onBeforeRouteLeave, RouterLink, useRoute } from "vue-router";
import { api, ApiError } from "../lib/api";
import TerraUmbraBrand from "../components/TerraUmbraBrand.vue";

type Entry={id:string;title:string;playedOn:string;content:string;version:number;createdAt:string;updatedAt:string};
const id=String(useRoute().params.id), endpoint=`/api/characters/${id}/journal`;
const character=ref<{id:string;name:string}|null>(null),entries=ref<Entry[]>([]);
const loading=ref(false),busy=ref(false),hasMore=ref(false),error=ref(""),notice=ref(""),needsLogin=ref(false);
const editorOpen=ref(false),editing=ref<Entry|null>(null),conflict=ref(false);
const editorTitle=ref<HTMLInputElement|null>(null);
const today=()=>{const date=new Date();return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;};
const blank=()=>({title:"",playedOn:today(),content:""});
const draft=ref(blank()),baseline=ref(JSON.stringify(draft.value));
const dirty=computed(()=>JSON.stringify(draft.value)!==baseline.value);
let generation=0,offset=0;
function clearEditor(){editing.value=null;draft.value=blank();baseline.value=JSON.stringify(draft.value);editorOpen.value=false;conflict.value=false;}
function fail(cause:unknown){
  const code=cause instanceof Error?cause.message:"";
  if(cause instanceof ApiError&&[401,403,404].includes(cause.status)&&code!=="journal_entry_not_found"){
    character.value=null;entries.value=[];clearEditor();needsLogin.value=cause.status===401;
  }
  const messages:Record<string,string>={
    authentication_required:"Connecte-toi pour consulter ton journal.",
    character_not_found:"Ce journal est privé et n’est pas accessible avec ton compte.",
    invalid_journal_entry:"Renseigne un titre (120 caractères maximum), une date valide et une note (20 000 caractères maximum).",
    journal_entry_not_found:"Cette note n’existe plus. Ton texte reste dans l’éditeur : tu peux le copier avant de recharger.",
    journal_version_conflict:"Cette note a été modifiée ailleurs. Ton texte reste dans l’éditeur. Copie-le si nécessaire avant de charger la dernière version."
  };
  error.value=messages[code]??"Impossible de joindre le journal. Ton texte n’a pas été effacé ; réessaie.";
  conflict.value=code==="journal_version_conflict";
}
async function load(more=false){
  const current=++generation;
  loading.value=true;error.value="";needsLogin.value=false;
  try{
    const result=await api<{character:{id:string;name:string};entries:Entry[];hasMore:boolean}>(`${endpoint}?offset=${more?offset:0}`);
    if(current!==generation)return;
    character.value=result.character;
    entries.value=more?[...new Map([...entries.value,...result.entries].map(entry=>[entry.id,entry])).values()]:result.entries;
    offset=(more?offset:0)+result.entries.length;hasMore.value=result.hasMore;
  }catch(cause){if(current===generation)fail(cause);}
  finally{if(current===generation)loading.value=false;}
}
async function openEditor(entry?:Entry){
  if(dirty.value&&!window.confirm("Abandonner la note non enregistrée ?"))return;
  editing.value=entry??null;draft.value=entry?{title:entry.title,playedOn:entry.playedOn,content:entry.content}:blank();
  baseline.value=JSON.stringify(draft.value);editorOpen.value=true;error.value="";notice.value="";conflict.value=false;
  await nextTick();editorTitle.value?.focus();
}
function cancel(){if(dirty.value&&!window.confirm("Abandonner la note non enregistrée ?"))return;clearEditor();error.value="";}
async function save(){
  if(busy.value)return;
  busy.value=true;error.value="";notice.value="";
  try{
    await api(`${endpoint}${editing.value?`/${editing.value.id}`:""}`,{
      method:editing.value?"PATCH":"POST",body:JSON.stringify({...draft.value,...(editing.value?{version:editing.value.version}:{})})
    });
    clearEditor();notice.value="Note enregistrée.";await load();
  }catch(cause){fail(cause);}finally{busy.value=false;}
}
async function remove(entry:Entry){
  if(busy.value||!window.confirm(`Supprimer définitivement « ${entry.title} » du journal ?`))return;
  busy.value=true;error.value="";notice.value="";
  try{
    await api(`${endpoint}/${entry.id}`,{method:"DELETE",body:JSON.stringify({version:entry.version})});
    if(editing.value?.id===entry.id)clearEditor();notice.value="Note supprimée.";await load();
  }catch(cause){fail(cause);}finally{busy.value=false;}
}
async function reloadConflict(){
  if(!window.confirm("Remplacer le texte dans l’éditeur par la dernière version enregistrée ?"))return;
  const previous=editing.value?.id;
  await load();
  if(error.value)return;
  const entry=entries.value.find(item=>item.id===previous);
  if(entry){baseline.value=JSON.stringify(draft.value);await openEditor(entry);}
  else{error.value="La note ne figure plus dans cette page du journal. Ton texte reste dans l’éditeur.";}
}
const day=(value:string)=>new Intl.DateTimeFormat("fr-FR",{dateStyle:"long",timeZone:"UTC"}).format(new Date(`${value}T12:00:00Z`));
function beforeUnload(event:BeforeUnloadEvent){if(dirty.value){event.preventDefault();event.returnValue="";}}
onBeforeRouteLeave(()=>!dirty.value||window.confirm("Quitter sans enregistrer la note ?"));
onMounted(()=>{void load();window.addEventListener("beforeunload",beforeUnload);});
onUnmounted(()=>{++generation;window.removeEventListener("beforeunload",beforeUnload);});
</script>
<template>
  <div class="journal-page">
    <a class="skip-link" href="#journal-main">Aller au journal</a>
    <header class="journal-topbar"><RouterLink to="/" aria-label="Terra Umbra — accueil"><TerraUmbraBrand /></RouterLink><RouterLink class="ghost" to="/account#characters">Mes personnages</RouterLink></header>
    <main id="journal-main" tabindex="-1" :aria-busy="loading">
      <p class="eyebrow">SUIVI DU PERSONNAGE · PRIVÉ</p><h1>Journal d’aventure</h1>
      <p v-if="character" class="journal-name">{{ character.name }}</p>
      <p>Consigne tes séances, tes découvertes et tes pistes. Ce journal personnel reste visible uniquement par toi, même si ta fiche est partagée avec un MJ.</p>
      <nav v-if="character" class="journal-actions" aria-label="Actions du journal"><button class="primary" :disabled="busy" @click="openEditor()">Nouvelle note</button><RouterLink class="ghost" :to="`/characters/${id}/sheet`">Fiche actuelle</RouterLink><RouterLink class="ghost" :to="`/characters/${id}/progression`">Progression</RouterLink><RouterLink class="ghost" :to="`/characters/${id}/history`">Historique</RouterLink></nav>
      <div v-if="error" class="journal-feedback error" role="alert"><p>{{ error }}</p><RouterLink v-if="needsLogin" class="ghost" to="/account">Se connecter</RouterLink><button v-else-if="conflict&&editing" class="ghost" :disabled="loading" @click="reloadConflict">Charger la dernière version</button><button v-else-if="!character" class="ghost" :disabled="loading" @click="load()">Réessayer</button></div>
      <p v-if="notice" class="journal-feedback" role="status">{{ notice }}</p>
      <form v-if="character&&editorOpen" class="journal-editor panel" :aria-busy="busy" @submit.prevent="save">
        <h2>{{ editing?'Modifier la note':'Nouvelle note' }}</h2>
        <div class="journal-fields"><label>Titre<input ref="editorTitle" v-model="draft.title" maxlength="120" required :disabled="busy" /></label><label>Date de la séance<input v-model="draft.playedOn" type="date" required :disabled="busy" /></label></div>
        <label>Notes d’aventure<textarea v-model="draft.content" rows="10" maxlength="20000" required :disabled="busy" /></label>
        <p class="journal-counter">{{ draft.content.length.toLocaleString('fr-FR') }} / 20 000 caractères{{ dirty?' · Modifications non enregistrées':'' }}</p>
        <div class="journal-actions"><button class="primary" :disabled="busy||!draft.title.trim()||!draft.content.trim()">{{ busy?'Enregistrement…':'Enregistrer la note' }}</button><button type="button" class="ghost" :disabled="busy" @click="cancel">Annuler</button></div>
      </form>
      <p v-if="loading" role="status">Chargement du journal…</p>
      <p v-else-if="character&&!entries.length&&!editorOpen" class="journal-empty">Ton journal est encore vide. Ajoute une première note pour garder une trace de l’aventure.</p>
      <section v-if="character&&entries.length" class="journal-timeline" aria-label="Notes enregistrées">
        <p class="journal-order">Les notes ajoutées récemment apparaissent en premier.</p>
        <article v-for="entry in entries" :key="entry.id" class="journal-entry panel">
          <header><time :datetime="entry.playedOn">{{ day(entry.playedOn) }}</time><h2>{{ entry.title }}</h2></header>
          <p class="journal-content">{{ entry.content }}</p>
          <footer class="journal-actions"><button class="ghost" :disabled="busy" :aria-label="`Modifier ${entry.title}`" @click="openEditor(entry)">Modifier</button><button class="ghost" :disabled="busy" :aria-label="`Supprimer ${entry.title}`" @click="remove(entry)">Supprimer</button></footer>
        </article>
        <button v-if="hasMore" class="ghost" :disabled="loading" @click="load(true)">Voir les notes précédentes</button>
      </section>
    </main>
  </div>
</template>
<style scoped>
.journal-page{min-height:100vh;background:#080f18;color:#e6eef8}.journal-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px clamp(16px,3vw,48px);border-bottom:1px solid #284255}.journal-page main{max-width:1100px;margin:auto;padding:clamp(16px,4vw,48px)}h1{font-size:clamp(28px,4vw,42px);margin:10px 0}h2{overflow-wrap:anywhere;font-size:22px}.journal-name{color:#9ce5f4;font-size:22px;font-weight:600}.journal-page p{line-height:1.7}.journal-actions{display:flex;gap:12px;flex-wrap:wrap;margin:22px 0}.journal-actions button,.journal-actions a,.journal-topbar>a.ghost{min-height:44px}.journal-fields{display:grid;grid-template-columns:2fr 1fr;gap:16px}.journal-editor label{display:grid;gap:8px;margin-bottom:18px}.journal-editor input,.journal-editor textarea{width:100%;min-width:0}.journal-editor textarea{resize:vertical;line-height:1.6}.journal-counter,.journal-order{color:#adc2d4;font-size:14px}.journal-content{white-space:pre-wrap;overflow-wrap:anywhere}.journal-entry time{font-size:14px;color:#9ce5f4}.journal-entry{margin-top:20px}.journal-entry footer{margin-bottom:0}.journal-feedback{padding:14px 18px;background:#102737;border:1px solid #355267;border-radius:6px}.journal-feedback.error{border-color:#c58072}.journal-empty{padding:24px;border:1px dashed #355267;border-radius:6px}.journal-timeline{margin-top:30px}@media(max-width:600px){.journal-fields{grid-template-columns:1fr}.journal-editor,.journal-entry{padding:18px}.journal-actions>*{flex:1;text-align:center}.journal-page main{padding:20px 16px}}
</style>
