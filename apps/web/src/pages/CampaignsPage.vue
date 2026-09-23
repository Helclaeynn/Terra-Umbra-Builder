<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { onBeforeRouteLeave, RouterLink, useRoute, useRouter } from 'vue-router';
import { api, ApiError } from '../lib/api';
import CampaignNpcs from '../components/CampaignNpcs.vue';
import CampaignAdmissions from '../components/CampaignAdmissions.vue';
import CampaignSessions from '../components/CampaignSessions.vue';
import TerraUmbraBrand from '../components/TerraUmbraBrand.vue';
type Campaign={admissionRules?:string;id:string;name:string;description:string;gmName:string;ownerId:string;canManage:boolean;membershipStatus:'invited'|'accepted'|null;memberCount?:number;archivedAt:string|null;version:number;gmNotes?:string};
type Member={admissionStatus?:string;userId:string;displayName:string;status:string;characterId:string|null;characterName:string|null;canReadSheet:boolean;updatedAt:string|null};
type Account={id:string;displayName:string};
const router=useRouter(),id=String(useRoute().params.id||''),endpoint='/api/campaigns';
const campaigns=ref<Campaign[]>([]),campaign=ref<Campaign|null>(null),members=ref<Member[]>([]),characters=ref<{id:string;name:string;campaignName?:string}[]>([]);
const userId=ref(''),canCreate=ref(false),loading=ref(true),busy=ref(false),error=ref(''),notice=ref(''),login=ref(false);
const showCreate=ref(false),createName=ref(''),createDescription=ref(''),query=ref(''),accounts=ref<Account[]>([]),searching=ref(false),searchError=ref('');
const accountsOpen=ref(false),accountsMore=ref(false),moreSearching=ref(false);
const chosenCharacter=ref(''),editing=ref(false),draft=ref({name:'',description:'',gmNotes:'',admissionRules:''}),baseline=ref(''),editVersion=ref(0);
const admissionRefresh=ref(0),npcsOpen=ref(false),npcDirty=ref(false);
function toggleNpcs(e:Event){const el=e.target as HTMLDetailsElement;if(!el.open&&npcDirty.value&&!window.confirm('Abandonner les PNJ non enregistrés ?')){el.open=true;return;}npcsOpen.value=el.open;}
const dirty=computed(()=>editing.value&&JSON.stringify(draft.value)!==baseline.value);
const me=computed(()=>members.value.find(m=>m.userId===userId.value));
const invited=computed(()=>campaigns.value.filter(c=>c.membershipStatus==='invited'));
const active=computed(()=>campaigns.value.filter(c=>!c.archivedAt&&c.membershipStatus!=='invited'));
const archived=computed(()=>campaigns.value.filter(c=>c.archivedAt));
let refreshTimer:ReturnType<typeof setInterval>|undefined;
let generation=0,searchGeneration=0,timer:ReturnType<typeof setTimeout>|undefined;
function failure(e:unknown){
  const messages:Record<string,string>={campaign_version_conflict:'La campagne a changé ailleurs. Ton texte est conservé : copie-le avant de recharger la dernière version.',invalid_campaign:'Vérifie le nom (120 caractères), la présentation (2 000) et les notes (20 000).',gm_required:'Le rôle MJ est nécessaire pour créer une campagne.',invitation_unavailable:'Ce compte est déjà invité ou la campagne n’est plus disponible.',membership_unavailable:'La campagne ou la fiche choisie n’est plus disponible.',campaign_not_found:'Cette campagne n’est pas accessible avec ton compte.',authentication_required:'Connecte-toi pour retrouver tes campagnes.'};
  error.value=messages[e instanceof Error?e.message:'']||'Impossible de terminer cette action. Réessaie.';
  if(e instanceof ApiError&&[401,403,404].includes(e.status)){
    campaign.value=null;campaigns.value=[];members.value=[];characters.value=[];accounts.value=[];canCreate.value=false;editing.value=false;draft.value={name:'',description:'',gmNotes:'',admissionRules:''};login.value=e.status===401;
  }
}
async function load(){
  const seq=++generation;loading.value=true;error.value='';
  try{
    if(id){
      const r=await api<{campaign:Campaign;members:Member[];userId:string}>(`${endpoint}/${id}`);if(seq!==generation)return;
      campaign.value=r.campaign;members.value=r.members;userId.value=r.userId;
      chosenCharacter.value=r.members.find(m=>m.userId===r.userId)?.characterId||'';
      if(!r.campaign.canManage){const own=await api<{characters:{id:string;name:string}[]}>('/api/characters?summary=1');if(seq!==generation)return;characters.value=own.characters;}
    }else{
      const r=await api<{campaigns:Campaign[];canCreate:boolean;userId:string}>(endpoint);if(seq!==generation)return;
      campaigns.value=r.campaigns;canCreate.value=r.canCreate;userId.value=r.userId;
    }
  }catch(e){if(seq===generation)failure(e);}finally{if(seq===generation)loading.value=false;}
}
async function action(work:()=>Promise<unknown>,message:string){
  if(busy.value)return;busy.value=true;error.value='';notice.value='';
  try{await work();notice.value=message;await load();}catch(e){failure(e);}finally{busy.value=false;}
}
async function create(){
  await action(async()=>{const r=await api<{campaign:{id:string}}>(endpoint,{method:'POST',body:JSON.stringify({name:createName.value,description:createDescription.value})});await router.push(`/campaigns/${r.campaign.id}`);},'Campagne créée.');
}
async function searchAccounts(more=false){
  if(more&&(searching.value||moreSearching.value||!accountsMore.value))return;
  const seq=more?searchGeneration:++searchGeneration;
  if(more)moreSearching.value=true;else{accounts.value=[];searching.value=true;accountsMore.value=false;}
  searchError.value='';
  try{const r=await api<{accounts:Account[];hasMore:boolean}>(`${endpoint}/${id}/accounts?q=${encodeURIComponent(query.value.trim())}&offset=${more?accounts.value.length:0}`);if(seq===searchGeneration){accounts.value=more?[...accounts.value,...r.accounts.filter(a=>!accounts.value.some(old=>old.id===a.id))]:r.accounts;accountsMore.value=!!r.hasMore;}}
  catch(e){if(seq===searchGeneration){searchError.value='Recherche indisponible. Réessaie.';if(e instanceof ApiError&&[401,403,404].includes(e.status))failure(e);}}
  finally{if(seq===searchGeneration){searching.value=false;moreSearching.value=false;}}
}
function browseAccounts(){if(!accountsOpen.value){accountsOpen.value=true;void searchAccounts();}}
function accountScroll(e:Event){const el=e.target as HTMLElement;if(el.scrollTop+el.clientHeight>=el.scrollHeight-100)void searchAccounts(true);}
watch(query,()=>{searchGeneration++;clearTimeout(timer);accounts.value=[];accountsMore.value=false;moreSearching.value=false;searching.value=accountsOpen.value;if(accountsOpen.value)timer=setTimeout(()=>{void searchAccounts();},250);});
async function invite(a:Account){await action(async()=>{await api(`${endpoint}/${id}/invitations`,{method:'POST',body:JSON.stringify({userId:a.id})});await searchAccounts();},`${a.displayName} a été invité. L’invitation apparaît dans ses campagnes.`);}
async function join(){await action(async()=>{await api(`${endpoint}/${id}/membership`,{method:'PUT',body:JSON.stringify({characterId:chosenCharacter.value||null})});admissionRefresh.value++;},chosenCharacter.value?'Version de campagne proposée au MJ.':'Participation enregistrée.');}
async function remove(m:Member){
  const own=m.userId===userId.value;
  if(!window.confirm(own?'Quitter cette campagne ? Son MJ perdra l’accès à ta fiche accordé par cette campagne.':`Retirer ${m.displayName} de la campagne ?`))return;
  await action(async()=>{await api(`${endpoint}/${id}/members/${m.userId}`,{method:'DELETE'});if(own)await router.push('/campaigns');},'Participation retirée.');
}
async function decline(){await action(async()=>{await api(`${endpoint}/${id}/members/${userId.value}`,{method:'DELETE'});await router.push('/campaigns');},'Invitation déclinée.');}
function edit(){const c=campaign.value!;draft.value={name:c.name,description:c.description,gmNotes:c.gmNotes||'',admissionRules:c.admissionRules||''};baseline.value=JSON.stringify(draft.value);editVersion.value=c.version;editing.value=true;}
function cancel(){if(dirty.value&&!window.confirm('Abandonner les modifications non enregistrées ?'))return;editing.value=false;}
async function save(){await action(async()=>{await api(`${endpoint}/${id}`,{method:'PATCH',body:JSON.stringify({...draft.value,version:editVersion.value,archived:!!campaign.value?.archivedAt})});editing.value=false;},'Campagne enregistrée.');}
async function archive(){
  const c=campaign.value!;if(!window.confirm(c.archivedAt?'Réactiver cette campagne et ses partages de fiches ?':'Archiver cette campagne ? Les invitations et les accès aux fiches par cette campagne seront suspendus.'))return;
  await action(()=>api(`${endpoint}/${id}`,{method:'PATCH',body:JSON.stringify({name:c.name,description:c.description,gmNotes:c.gmNotes||'',version:c.version,archived:!c.archivedAt})}),c.archivedAt?'Campagne réactivée.':'Campagne archivée.');
}
function beforeUnload(e:BeforeUnloadEvent){if(dirty.value){e.preventDefault();e.returnValue='';}}
onBeforeRouteLeave(()=>!dirty.value||window.confirm('Quitter sans enregistrer les notes de campagne ?'));
function focus(){if(document.visibilityState!=='hidden'&&!dirty.value&&!busy.value&&!loading.value)void load();}
function visible(){if(document.visibilityState!=='hidden')focus();}
onMounted(()=>{void load();refreshTimer=setInterval(()=>{if(!id)focus();},30000);document.addEventListener('visibilitychange',visible);window.addEventListener('focus',focus);window.addEventListener('beforeunload',beforeUnload);});
onUnmounted(()=>{clearInterval(refreshTimer);document.removeEventListener('visibilitychange',visible);window.removeEventListener('focus',focus);generation++;searchGeneration++;clearTimeout(timer);window.removeEventListener('beforeunload',beforeUnload);});
</script>

<template>
  <div class="campaign-page">
    <header class="campaign-nav"><RouterLink to="/" aria-label="Accueil Terra Umbra"><TerraUmbraBrand /></RouterLink><nav aria-label="Navigation"><RouterLink to="/account">Mon espace</RouterLink><RouterLink to="/campaigns">Mes campagnes</RouterLink></nav></header>
    <main>
      <RouterLink class="campaign-return" to="/account">← Retour à Mon espace</RouterLink>
      <RouterLink v-if="id" class="campaign-return" to="/campaigns">← Retour à mes campagnes</RouterLink>
      <p v-if="error" role="alert" class="error">{{ error }} <RouterLink v-if="login" to="/account">Se connecter</RouterLink><button v-else type="button" @click="load">Réessayer</button></p>
      <p v-if="notice" role="status" class="notice">{{ notice }}</p>
      <p v-if="loading" role="status">Chargement des campagnes…</p>
      <template v-if="!id">
        <header class="page-heading"><button type="button" :disabled="loading" @click="load">Actualiser les invitations</button><div><p class="eyebrow">À VOTRE TABLE</p><h1>Mes campagnes</h1><p>Retrouve ton groupe et ouvre les fiches en un clic.</p></div><button v-if="canCreate" class="primary" @click="showCreate=!showCreate">Créer une campagne</button></header>
        <form v-if="showCreate&&canCreate" class="panel form" @submit.prevent="create"><h2>Une nouvelle table</h2><label>Nom de la campagne<input v-model="createName" required maxlength="120" autofocus /></label><label>Présentation aux joueurs<textarea v-model="createDescription" maxlength="2000" rows="3" /></label><div class="actions"><button class="primary" :disabled="busy||!createName.trim()">Créer</button><button type="button" @click="showCreate=false">Annuler</button></div></form>
        <section v-if="invited.length" aria-label="Invitations" class="invitations"><h2>Invitations à rejoindre une table <span>{{ invited.length }}</span></h2><RouterLink v-for="c in invited" :key="c.id" class="campaign-card" :to="`/campaigns/${c.id}`"><div><strong>{{ c.name }}</strong><p>Invitation de {{ c.gmName }}</p></div><span>Répondre →</span></RouterLink></section>
        <section class="campaign-list" aria-label="Campagnes actives"><RouterLink v-for="c in active" :key="c.id" class="campaign-card" :to="`/campaigns/${c.id}`"><div><p class="eyebrow">{{ c.canManage?'MA TABLE MJ':'JOUEUR' }}</p><h2>{{ c.name }}</h2><p>{{ c.gmName }} · {{ c.memberCount }} joueur(s)</p></div><span>Ouvrir →</span></RouterLink></section>
        <div v-if="!loading&&!active.length&&!invited.length&&!error" class="panel empty"><h2>Ta prochaine aventure commence ici</h2><p>{{ canCreate?'Crée une campagne puis invite tes joueurs par leur nom de compte.':'Les invitations de tes MJ apparaîtront ici. Tu pourras accepter et choisir ton personnage.' }}</p></div>
        <details v-if="archived.length" class="panel"><summary>Campagnes archivées · {{ archived.length }}</summary><RouterLink v-for="c in archived" :key="c.id" class="campaign-card" :to="`/campaigns/${c.id}`">{{ c.name }} <span>Consulter →</span></RouterLink></details>
      </template>
      <template v-else-if="campaign">
        <header class="page-heading"><div><p class="eyebrow">{{ campaign.canManage?'TABLEAU DE BORD MJ':'MA CAMPAGNE' }} <span v-if="campaign.archivedAt">· ARCHIVÉE</span></p><h1>{{ campaign.name }}</h1><p>MJ · {{ campaign.gmName }}</p></div><button v-if="campaign.canManage&&!editing" @click="edit">Notes et paramètres</button></header>
        <p v-if="campaign.description" class="description">{{ campaign.description }}</p>
        <form v-if="editing&&campaign.canManage" class="panel form" @submit.prevent="save"><h2>Notes et paramètres</h2><label>Nom<input v-model="draft.name" required maxlength="120" /></label><label>Présentation visible par les joueurs<textarea v-model="draft.description" rows="3" maxlength="2000" /></label><label>Conditions d’admission des personnages<textarea v-model="draft.admissionRules" rows="3" maxlength="4000" placeholder="Ex. : uniquement des Crawlers, personnages débutants, pas de Corruption au départ…" /></label><label>Notes privées du MJ<textarea v-model="draft.gmNotes" rows="9" maxlength="20000" /></label><small>Ces notes sont réservées au MJ de cette campagne.</small><div class="actions"><button class="primary" :disabled="busy">Enregistrer</button><button type="button" @click="cancel">Annuler</button></div><p v-if="dirty">Modifications non enregistrées.</p></form>
        <section v-if="campaign.membershipStatus==='invited'" class="panel form"><h2>Tu es invité à cette campagne</h2><p v-if="campaign.admissionRules" class="description"><strong>Conditions de la table :</strong><br />{{ campaign.admissionRules }}</p><p>Une copie indépendante de la fiche choisie sera proposée à {{ campaign.gmName }}, avec ses acquis actuels et sa Vérité. Le MJ doit la valider. Les gains de cette campagne resteront sur cette version. Ton journal personnel reste privé.</p><label>Personnage<select v-model="chosenCharacter"><option value="">Je choisirai plus tard</option><option v-for="c in characters" :key="c.id" :value="c.id">{{ c.name }} · {{ c.campaignName||'Hors campagne' }}</option></select></label><div class="actions"><button class="primary" :disabled="busy" @click="join">Accepter l’invitation</button><button :disabled="busy" @click="decline">Décliner</button></div></section>
        <template v-if="campaign.canManage||campaign.membershipStatus==='accepted'">
          <CampaignSessions :user-id="userId" :campaign-id="id" :can-manage="campaign.canManage" :archived="!!campaign.archivedAt" :members="members" />
          <details v-if="campaign.canManage" class="panel" @toggle="toggleNpcs"><summary>Mes PNJ de campagne · générateur et fiches</summary><CampaignNpcs v-if="npcsOpen" :campaign-id="id" :archived="!!campaign.archivedAt" @dirty="npcDirty=$event" /></details>
          <section class="panel"><div class="section-heading"><h2>Le groupe</h2><span>{{ members.filter(m=>m.status==='accepted').length }} joueur(s)</span></div><p v-if="!members.length" class="empty">Invite tes joueurs pour réunir leurs fiches ici.</p>
            <div v-for="m in members" :key="m.userId" class="member-row"><div><strong>{{ m.characterName||m.displayName }}</strong><p>{{ m.displayName }} <span v-if="m.status==='invited'">· Invitation en attente</span><span v-else-if="!m.characterId">· Personnage à choisir</span><span v-else>· {{ m.admissionStatus==='approved'?'Fiche acceptée':'Fiche à valider' }}</span></p><small v-if="m.updatedAt">Fiche mise à jour le {{ new Date(m.updatedAt).toLocaleDateString('fr-FR') }}</small></div><div class="actions"><RouterLink v-if="m.canReadSheet" class="primary sheet-link" :to="{path:`/characters/${m.characterId}/sheet`,query:{campaign:id}}">Ouvrir la fiche →</RouterLink><button v-if="campaign.canManage&&!campaign.archivedAt" :disabled="busy" :aria-label="`Retirer ${m.displayName}`" @click="remove(m)">{{ m.status==='invited'?'Annuler l’invitation':'Retirer' }}</button></div></div>
          </section>
          <section v-if="!campaign.canManage&&me" class="panel form"><h2>Mon personnage</h2><p>Choisir une autre fiche propose une copie indépendante au MJ, avec ses acquis actuels. La fiche source et les autres campagnes ne seront pas modifiées.</p><label>Fiche partagée<select v-model="chosenCharacter"><option value="">Aucune fiche partagée</option><option v-for="c in characters" :key="c.id" :value="c.id">{{ c.name }} · {{ c.campaignName||'Hors campagne' }}</option></select></label><div class="actions"><button class="primary" :disabled="busy||chosenCharacter===(me.characterId||'')" @click="join">Proposer cette fiche</button><button :disabled="busy" @click="remove(me)">Quitter la campagne</button></div><RouterLink v-if="!characters.length" to="/account">Créer un personnage dans Mon espace →</RouterLink></section>
          <section v-if="campaign.canManage&&!campaign.archivedAt" class="panel form"><h2>Inviter un joueur</h2><label>Nom de compte<input v-model="query" type="search" maxlength="80" placeholder="Parcourir les joueurs ou chercher un nom…" autocomplete="off" @focus="browseAccounts" /></label><button v-if="!accountsOpen" type="button" @click="browseAccounts">Parcourir les joueurs</button><div v-if="accountsOpen" class="account-picker" role="region" aria-label="Joueurs disponibles" tabindex="0" @scroll="accountScroll"><p v-if="searching" role="status">Recherche…</p><p v-else-if="searchError" role="alert">{{ searchError }} <button type="button" @click="searchAccounts()">Réessayer la recherche</button></p><p v-else-if="!accounts.length" role="status">Aucun compte disponible. Les joueurs déjà invités ne sont pas proposés.</p><div v-for="a in accounts" :key="a.id" class="member-row"><div><strong>{{ a.displayName }}</strong><small>Compte {{ a.id.slice(0,8) }}</small></div><button :disabled="busy" @click="invite(a)">Inviter {{ a.displayName }}</button></div><button v-if="accountsMore" type="button" :disabled="moreSearching||searching" @click="searchAccounts(true)">{{ moreSearching?'Chargement…':'Voir d’autres joueurs' }}</button></div><small>Le joueur recevra l’invitation dans « Mes campagnes » et choisira lui-même sa fiche.</small></section>
          <CampaignAdmissions v-if="!campaign.archivedAt" :campaign-id="id" :can-manage="campaign.canManage" :refresh-key="admissionRefresh" @updated="load" />

          <details v-if="campaign.canManage&&!editing" class="panel"><summary>Mes notes privées</summary><p class="private-notes">{{ campaign.gmNotes||'Aucune note pour le moment.' }}</p><button @click="edit">Modifier mes notes</button></details>
          <details v-if="campaign.canManage&&!editing" class="panel"><summary>Gérer la campagne</summary><p>L’archivage conserve le groupe et les notes, mais suspend les accès aux fiches accordés par cette campagne.</p><button :disabled="busy" @click="archive">{{ campaign.archivedAt?'Réactiver la campagne':'Archiver la campagne' }}</button></details>
        </template>
      </template>
      <RouterLink v-if="id" class="campaign-return" to="/campaigns">← Retour à mes campagnes</RouterLink>
      <RouterLink class="campaign-return" to="/account">← Retour à Mon espace</RouterLink>
    </main>
  </div>
</template>

<style scoped>
.account-picker{max-height:340px;overflow-y:auto;overscroll-behavior:contain;padding:0 12px;border:1px solid #405875;border-radius:6px}.campaign-page .campaign-return{display:inline-flex;align-items:center;min-height:44px;box-sizing:border-box;padding:10px 16px;margin:0 10px 24px 0;border:1px solid #405875;border-radius:6px;background:#101e30;color:#b6efff;font-weight:600}.campaign-page .campaign-return:hover{background:#18334a;border-color:#80dfea}

.campaign-page{min-height:100vh;background:#080f19;color:#eaf2ff;font-family:Inter,'Segoe UI',sans-serif}.campaign-nav{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:16px 32px;border-bottom:1px solid #2b4056}.campaign-nav>a{max-width:280px}.campaign-nav nav{display:flex;gap:20px}.campaign-page a{color:#a4e7f5;text-decoration:none}.campaign-page main{max-width:1280px;margin:auto;padding:36px 28px 80px}.page-heading,.section-heading{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px}h1{font-size:clamp(28px,4vw,42px);margin:8px 0}h2{font-size:20px;margin:0 0 12px}p{line-height:1.65;color:#b5c8dc}.eyebrow{font:600 11px/1.6 monospace;letter-spacing:.15em;color:#70dce9}.panel,.campaign-card{background:#0e1b2c;border:1px solid #2e455d;border-radius:10px;padding:22px;margin:20px 0}.campaign-card{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:0;min-width:0}.campaign-card:hover{border-color:#80dfea;background:#14263a}.campaign-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:16px}.campaign-card h2,.campaign-card strong{color:#eaf2ff}.campaign-card p{margin:6px 0}.invitations{margin:24px 0}.invitations .campaign-card{border-color:#716092;margin:10px 0}.form{display:grid;gap:16px}.form label{display:grid;gap:8px;font-size:14px}.form input,.form textarea,.form select{width:100%;min-width:0;box-sizing:border-box;min-height:44px;padding:12px;color:#edf4ff;background:#08131f;border:1px solid #405875;border-radius:6px;font:inherit}.form textarea{resize:vertical}.actions{display:flex;align-items:center;flex-wrap:wrap;gap:10px}.campaign-page button,.campaign-page .sheet-link{min-height:44px;padding:10px 16px;border:1px solid #405875;border-radius:6px;background:#101e30;color:#eaf2ff;cursor:pointer;font:600 14px/1.5 inherit}.campaign-page .primary{background:#a3eaff;border-color:#a3eaff;color:#071725}.campaign-page button:disabled{opacity:.5;cursor:default}.member-row{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 0;border-bottom:1px solid #293d52}.member-row:last-child{border-bottom:0}.member-row p{margin:5px 0}.member-row small{display:block}.member-row>div{min-width:0}small{color:#a3b7cc;line-height:1.6}.description,.private-notes{white-space:pre-wrap;overflow-wrap:anywhere}.error,.notice{padding:16px;border-radius:6px;border:1px solid #78505c;background:#251925}.notice{background:#102c2c;border-color:#38716a}summary{cursor:pointer;min-height:44px;align-content:center;color:#b7d9ef}a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid #a3eaff;outline-offset:4px}strong,h1,h2{overflow-wrap:anywhere}.empty{padding-block:24px}@media(max-width:640px){.campaign-nav{padding:14px;flex-wrap:wrap}.campaign-page main{padding:24px 14px}.panel,.campaign-card{padding:16px}.page-heading,.member-row{align-items:stretch;flex-direction:column}.actions>*{flex:1;text-align:center}.campaign-list{grid-template-columns:1fr}}
</style>
