<script setup lang="ts">
import {onMounted,onUnmounted,ref} from 'vue';
import {RouterLink} from 'vue-router';
import {api} from '../lib/api';
const props=defineProps<{userId:string}>();
type Invitation={id:string;name:string;gmName:string;membershipStatus:string};
const invitations=ref<Invitation[]>([]),loading=ref(false),failed=ref(false);
let generation=0,timer:ReturnType<typeof setInterval>|undefined;
async function load(){
  const seq=++generation;loading.value=true;failed.value=false;
  try{
    const r=await api<{campaigns:Invitation[];userId:string}>('/api/campaigns');
    if(seq!==generation)return;
    invitations.value=r.userId===props.userId?r.campaigns.filter(c=>c.membershipStatus==='invited'):[];
  }catch{if(seq===generation){invitations.value=[];failed.value=true;}}
  finally{if(seq===generation)loading.value=false;}
}
function refresh(){if(document.visibilityState!=='hidden'&&!loading.value)void load();}
function visibility(){if(document.visibilityState==='hidden'){generation++;invitations.value=[];loading.value=false;}else refresh();}
onMounted(()=>{void load();window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',visibility);timer=setInterval(refresh,30000);});
onUnmounted(()=>{generation++;clearInterval(timer);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',visibility);});
</script>
<template>
  <section class="account-campaigns" aria-label="Mes campagnes et invitations">
    <div class="campaigns-heading"><div><p class="eyebrow">À VOTRE TABLE</p><h2>Mes campagnes</h2><p>Retrouve ton groupe et tes invitations.</p></div><RouterLink class="ghost" to="/campaigns">Ouvrir mes campagnes →</RouterLink></div>
    <p v-if="loading&&!invitations.length" role="status">Vérification des invitations…</p>
    <p v-else-if="failed" role="status">Les invitations n’ont pas pu être chargées. <button class="ghost" type="button" @click="load">Réessayer</button></p>
    <template v-if="invitations.length"><p class="invitation-count" role="status">{{ invitations.length }} invitation{{ invitations.length>1?'s':'' }} à rejoindre une campagne</p>
      <div v-for="c in invitations" :key="c.id" class="invitation-row"><div><strong>{{ c.name }}</strong><p>{{ c.gmName }} t’invite à sa table.</p></div><RouterLink class="primary" :to="`/campaigns/${c.id}`">Voir l’invitation →</RouterLink></div>
    </template>
  </section>
</template>
<style scoped>
.account-campaigns{margin:0 0 24px;padding:24px;border:1px solid #425673;border-radius:8px;background:#101d30;color:#e7f1fc}.campaigns-heading,.invitation-row{display:flex;align-items:center;justify-content:space-between;gap:20px}.account-campaigns h2{margin:6px 0;font-size:22px}.account-campaigns p{margin:6px 0;color:#b9cbde;line-height:1.6}.account-campaigns .eyebrow{font-size:11px;letter-spacing:.14em;color:#8be2f0}.account-campaigns .invitation-count{color:#d6bcff;margin-top:20px}.invitation-row{border-top:1px solid #46506b;padding:16px 0}.invitation-row:last-child{padding-bottom:0}.campaigns-heading>div,.invitation-row>div{min-width:0;overflow-wrap:anywhere}.account-campaigns a,.account-campaigns button{min-height:44px;display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;flex-shrink:0;text-decoration:none}.account-campaigns a:focus-visible{outline:2px solid #a4eaff;outline-offset:4px}@media(max-width:650px){.campaigns-heading,.invitation-row{align-items:stretch;flex-direction:column}.account-campaigns{padding:18px}}
</style>
