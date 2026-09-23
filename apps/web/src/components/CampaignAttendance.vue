<script setup lang="ts">
import {computed,ref} from 'vue';
import {api} from '../lib/api';
export type Attendance={userId:string;displayName:string;characterId:string|null;response:'present'|'uncertain'|'absent'|null};
const props=defineProps<{campaignId:string;sessionId:string;rows:Attendance[];userId:string;canManage:boolean;archived:boolean;played:boolean}>();
const emit=defineEmits<{(e:'updated'):void}>();
const busy=ref(false),error=ref('');
const labels={present:'Présent',uncertain:'Incertain',absent:'Absent'};
const mine=computed(()=>props.rows.find(r=>r.userId===props.userId));
async function respond(userId:string,response:string){if(busy.value)return;busy.value=true;error.value='';try{await api(`/api/campaigns/${props.campaignId}/sessions/${props.sessionId}/attendance/${userId}`,{method:'PUT',body:JSON.stringify({response})});emit('updated');}catch{error.value='Réponse non enregistrée. Actualise les présences et réessaie.';}finally{busy.value=false;}}
</script>
<template>
 <section class="attendance" aria-label="Présences à la séance">
  <h3>Qui sera là ?</h3><p>{{ rows.filter(r=>r.response==='present').length }} présent(s) · {{ rows.filter(r=>r.response==='uncertain').length }} incertain(s) · {{ rows.filter(r=>r.response==='absent').length }} absent(s) · {{ rows.filter(r=>!r.response).length }} sans réponse</p>
  <p v-if="error" role="alert">{{ error }}</p>
  <div v-if="mine&&!archived&&!played" class="choices" role="group" aria-label="Ma présence"><button v-for="(label,key) in labels" :key="key" type="button" :disabled="busy" :aria-pressed="mine.response===key" @click="respond(userId,key)">{{ label }}</button></div>
  <details><summary>Voir les réponses{{ canManage?' / ajuster les présences':'' }}</summary><div v-for="r in rows" :key="r.userId" class="row"><span>{{ r.displayName }}</span><label v-if="canManage&&!archived"> <span class="sr-only">Présence de {{ r.displayName }}</span><select :value="r.response||''" :disabled="busy" @change="respond(r.userId,($event.target as HTMLSelectElement).value)"><option value="" disabled>Sans réponse</option><option v-for="(label,key) in labels" :key="key" :value="key">{{ label }}</option></select></label><strong v-else>{{ r.response?labels[r.response]:'Sans réponse' }}</strong></div></details>
 </section>
</template>
<style scoped>
.attendance{margin:16px 0;padding:14px;border:1px solid #405875;border-radius:6px}.choices,.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between}.choices{justify-content:flex-start}.row{padding:10px 0}.attendance p{color:#b5c8dc;line-height:1.6}button,select{min-height:44px;padding:10px;background:#101e30;color:#eaf2ff;border:1px solid #405875;border-radius:6px;font:inherit}button{cursor:pointer}button[aria-pressed=true]{border-color:#a3eaff;background:#173547}summary{cursor:pointer;min-height:44px;align-content:center}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}button:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid #a3eaff;outline-offset:3px}
</style>
