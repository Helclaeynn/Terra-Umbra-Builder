<script setup lang="ts">
import {computed,ref,onUnmounted} from 'vue';
import type {TruthState} from '../../lib/truth';
import {normalizeVampireBuild,vampireAnimalRoles,vampireWeaponProfiles} from '../../lib/vampire';
import {api} from '../../lib/api';
const props=defineProps<{state:TruthState;talentId:string}>();
const emit=defineEmits<{change:[patch:Record<string,unknown>]}>();
const build=computed(()=>normalizeVampireBuild(props.state.choices.vampireBuild));
const capacity=computed(()=>props.state.truthTalents.includes('menagerie')?4:1);
const query=ref(''),results=ref<{id:string;title:string;snippet:string}[]>([]),error=ref(''),busy=ref(false);let generation=0;
onUnmounted(()=>generation++);
const text=(e:Event)=>(e.target as HTMLInputElement).value;
function patch(value:Record<string,unknown>){emit('change',{vampireBuild:normalizeVampireBuild({...build.value,...value})});}
async function search(){const n=++generation;busy.value=true;error.value='';try{const r=await api<{items:{id:string;title:string;snippet:string}[]}>(`/api/compendium/search?q=${encodeURIComponent(query.value.trim())}&category=${encodeURIComponent('Bestiaire')}&limit=20`);if(n===generation)results.value=r.items;}catch{if(n===generation)error.value='Recherche indisponible. Vos choix enregistrés sont conservés.';}finally{if(n===generation)busy.value=false;}}
function add(item:{id:string;title:string}){if(build.value.forms.length>=capacity.value||build.value.forms.some(f=>f.articleId===item.id))return;patch({forms:[...build.value.forms,{articleId:item.id,name:item.title,role:''}]});}
function role(index:number,value:string){patch({forms:build.value.forms.map((f,i)=>i===index?{...f,role:value}:f)});}
</script>
<template>
 <div v-if="talentId==='forme_animale'||talentId==='menagerie'">
  <p>Choisissez {{capacity}} forme{{capacity>1?'s':''}} animale{{capacity>1?'s':''}} de référence dans le Bestiaire. Seuls les animaux ordinaires conviennent : reprenez mobilité, sens, taille et attaque naturelle ; aucun pouvoir surnaturel ni bonus d’Attribut supplémentaire.</p>
  <div v-for="(form,index) in build.forms" :key="form.articleId" class="animal-form">
   <strong>{{form.name}}</strong><small v-if="index>=capacity">Forme conservée, indisponible sans Ménagerie.</small>
   <label>Rôle<select :value="form.role" @change="role(index,text($event))"><option value="">Choisir un rôle</option><option v-for="r in vampireAnimalRoles" :key="r.id" :value="r.id">{{r.name}}</option></select></label>
   <button type="button" @click="patch({forms:build.forms.filter((_,i)=>i!==index)})">Retirer du répertoire</button>
  </div>
  <label>Rechercher un animal<input v-model="query" placeholder="Nom de l’animal" @keydown.enter.prevent="search" /></label><button type="button" :disabled="busy||!query.trim()" @click="search">{{busy?'Recherche…':'Rechercher'}}</button>
  <p v-if="error" role="alert">{{error}}</p>
  <ul><li v-for="item in results" :key="item.id"><strong>{{item.title}}</strong><p>{{item.snippet}}</p><button type="button" :disabled="build.forms.length>=capacity||build.forms.some(f=>f.articleId===item.id)" @click="add(item)">Ajouter cette référence</button></li></ul>
  <p>Transformation ou retour : 1 PA. Équipement laissé sur place ; aucun soin ni renouvellement d’usage.</p>
 </div>
 <div v-else-if="talentId==='arme_hematique'">
  <p>Les trois profils sont disponibles ; une seule arme peut être active. Le PA de Sang animé suffit à la former, mais chaque attaque reste payante.</p>
  <ul><li v-for="p in vampireWeaponProfiles" :key="p.id"><strong>{{p.name}}</strong> — {{p.effect}}</li></ul>
 </div>
 <div v-else-if="talentId==='lien_du_deimon'">
  <p>Consignez le Deimon déjà rencontré et consentant. Son profil reste celui du PNJ réel ; le lien ne crée aucune créature et ne lui attribue aucun PA supplémentaire.</p>
  <label>Nom du Deimon<input :value="build.deimon.name" maxlength="120" @input="patch({deimon:{...build.deimon,name:text($event)}})" /></label>
  <label>Référence du PNJ existant<input :value="build.deimon.reference" maxlength="500" placeholder="Lien de fiche ou référence du PNJ de campagne" @input="patch({deimon:{...build.deimon,reference:text($event)}})" /></label>
  <label>Consentement et obligations établis<textarea :value="build.deimon.obligations" maxlength="1200" @input="patch({deimon:{...build.deimon,obligations:text($event)}})" /></label>
  <p>100 m : intentions simples et alertes. Les actions tactiques demandées utilisent vos PA.</p>
 </div>
 <div v-else-if="talentId==='sang_preserve'">
  <p>Un seul ancrage : une heure de préparation et 3 PV sacrifiés, non récupérables tant qu’il subsiste. Cette fiche conserve ses références ; elle n’active pas le rituel.</p>
  <label>Contenant<input :value="build.anchor.container" maxlength="400" @input="patch({anchor:{...build.anchor,container:text($event)}})" /></label>
  <label>Lieu établi<input :value="build.anchor.location" maxlength="400" @input="patch({anchor:{...build.anchor,location:text($event)}})" /></label>
  <label>Praticien Alghul connaissant le rituel<input :value="build.anchor.practitioner" maxlength="400" @input="patch({anchor:{...build.anchor,practitioner:text($event)}})" /></label>
  <label>Notes<textarea :value="build.anchor.notes" maxlength="1200" @input="patch({anchor:{...build.anchor,notes:text($event)}})" /></label>
  <p>Retour uniquement dans votre propre corps réparable : 24 heures de rituel, ancrage consommé, 1 PV en Stase, sans renouveler les usages.</p>
 </div>
</template>
