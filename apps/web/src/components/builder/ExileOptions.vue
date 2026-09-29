<script setup lang="ts">
import {computed,ref} from 'vue';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
import {normalizeExileBuild,exileNetworks,exileRuneIds,exileTalentIds as ids,exileInventory,exileUsableTalents,exileRuneIssues,exileRuneDuration,exileTechniqueCosts,type ExileBuild} from '../../lib/exile';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage}>();const emit=defineEmits<{change:[value:ExileBuild]}>();
const config=computed(()=>normalizeExileBuild(props.state.choices.exileBuild));const active=computed(()=>exileUsableTalents(props.rules,props.state));
const inventory=computed(()=>exileInventory(props.rules,props.state));const catalogue=computed(()=>props.rules.catalogs.exile??[]);
const owned=computed(()=>catalogue.value.filter(t=>props.state.truthTalents.includes(t.id)));
const unavailable=computed(()=>owned.value.filter(t=>!active.value.has(t.id)).map(t=>t.name));
const title=(id:string)=>catalogue.value.find(t=>t.id===id)?.name??id;
const uid=()=>globalThis.crypto?.randomUUID?.()??'exile-'+Date.now()+'-'+Math.random().toString(36).slice(2);
function patch(p:Partial<ExileBuild>){emit('change',normalizeExileBuild({...config.value,...p}));}
function row(kind:keyof ExileBuild,index:number,key:string,value:unknown){const values=config.value[kind] as unknown as Record<string,unknown>[];patch({[kind]:values.map((r,i)=>i===index?{...r,[key]:value}:r)});}
function remove(kind:keyof ExileBuild,index:number){if(window.confirm('Retirer cette description ? Aucun talent, objet, compteur reçu ni PTV ne sera supprimé.'))patch({[kind]:config.value[kind].filter((_,i)=>i!==index)});}
function add(kind:keyof ExileBuild){const limit={trainings:24,runes:20,techniques:24,works:40,projects:40,landmarks:3,supplies:3}[kind];if(config.value[kind].length>=limit)return;patch({[kind]:[...config.value[kind],{uid:uid()}]});}
function rune(i:number,id:string,yes:boolean){const r=config.value.runes[i];if(yes&&r.runeIds.length>=2)return;row('runes',i,'runeIds',yes?[...r.runeIds,id]:r.runeIds.filter(v=>v!==id));}
const maintain=ref<'none'|'instinct'|'natural'>('none'),fulgurant=ref(false);
const textEvent=(e:Event)=>(e.target as HTMLInputElement).value;
const checked=(e:Event)=>(e.target as HTMLInputElement).checked;
const numeric=(e:Event)=>textEvent(e)===''?null:Number(textEvent(e));
const workFields=[['name','Nom du travail'],['effect','Fonction ou défaut précisément traité'],['materials','Matériaux et moyens réellement employés'],['duration','Durée / entretien'],['limits','Limites et conditions convenues']] as const;
const projectFields=[['name','Nom du dossier / prototype'],['effect','Effet ou opération définie'],['materials','Matériaux, infrastructures ou moyens réels'],['power','Alimentation / caractéristiques techniques'],['delay','Délai annoncé'],['partner','Contact, vendeur ou responsable réel'],['transaction','Référence de transaction ou commande'],['status','État du dossier'],['limits','Limites, garantie et conditions convenues']] as const;
</script>
<template>
 <section v-if="state.nature==='exile'" class="exile-options" aria-label="Traditions et configurations des Exilés">
  <h3>Traditions et configurations des Exilés</h3>
  <p>Ces informations sont sauvegardées et visibles sur la fiche partagée. Elles ne créent ni objet, ni paiement, ni sort inconnu, ni validation automatique du MJ.</p>
  <p v-if="unavailable.length" role="status" class="exile-warning">Acquisitions conservées, à régulariser : {{unavailable.join(' ; ')}}. Les points restent dépensés.</p>
  <details data-exile-section="trainings"><summary><strong>Formations supplémentaires réellement apprises</strong></summary>
   <p>La tradition principale reste distincte de ce registre. Pour ouvrir une formation supplémentaire, précisez son mentor et ses conditions réellement remplies ; aucun talent racial d’un autre peuple n’est accordé.</p>
   <fieldset v-for="(t,i) in config.trainings" :key="t.uid"><legend>Formation {{i+1}}</legend>
    <label>Tradition<select :value="t.network" @change="row('trainings',i,'network',textEvent($event))"><option value="">— Choisir —</option><option v-for="n in exileNetworks" :key="n.id" :value="n.id">{{n.name}}</option></select></label>
    <label>Mentor / école<input :value="t.mentor" maxlength="400" @input="row('trainings',i,'mentor',textEvent($event))" /></label>
    <label>Formation, recrutement, initiation et conditions remplies<textarea :value="t.conditions" maxlength="1000" rows="2" @input="row('trainings',i,'conditions',textEvent($event))" /></label>
    <label class="check"><input type="checkbox" :checked="t.learned" @change="row('trainings',i,'learned',checked($event))" />Apprentissage déclaré acquis selon les conditions convenues avec le MJ</label>
    <button type="button" @click="remove('trainings',i)">Retirer la formation déclarée</button>
   </fieldset><button type="button" data-exile-add="trainings" @click="add('trainings')">Ajouter une formation</button>
  </details>
  <details v-if="owned.some(t=>t.id.startsWith('exile-rune-'))||config.runes.length" data-exile-section="runes"><summary><strong>Runes et Phrases — supports et charges</strong></summary>
   <p>Dix minutes par inscription ordinaire ; une Rune active de chaque type par runiste. Une Phrase contient deux Runes compatibles, exige trois Runes de base acquises et dure tant qu’elle reste intacte ; toute inscription brève expire avec la scène.</p>
   <fieldset v-for="(r,i) in config.runes" :key="r.uid"><legend>Inscription {{i+1}}</legend>
    <label v-for="id in exileRuneIds" :key="id" class="check"><input type="checkbox" :checked="r.runeIds.includes(id)" :disabled="!r.runeIds.includes(id)&&(!active.has(id)||r.runeIds.length>=2)" @change="rune(i,id,checked($event))" />{{title(id)}}</label>
    <label>Objet possédé<select :value="r.itemUid" @change="row('runes',i,'itemUid',textEvent($event))"><option value="">Lieu, peau ou objet confié décrit ci-dessous</option><option v-for="item in inventory" :key="item.uid" :value="item.uid">{{item.name}}</option></select></label>
    <label>Support réel / localisation<input :value="r.support" maxlength="400" @input="row('runes',i,'support',textEvent($event))" /></label>
    <label>Auteur de l’inscription<input :value="r.author" maxlength="200" @input="row('runes',i,'author',textEvent($event))" /></label>
    <label>Bénéficiaire ou responsable du support<input :value="r.beneficiary" maxlength="200" @input="row('runes',i,'beneficiary',textEvent($event))" /></label>
    <label>Condition simple / compatibilité du support<input :value="r.condition" maxlength="400" @input="row('runes',i,'condition',textEvent($event))" /></label>
    <label class="check"><input type="checkbox" :checked="r.brief" :disabled="!r.brief&&!active.has(ids.brief)" @change="row('runes',i,'brief',checked($event))" />Inscription brève — 1 PA, une fois par scène</label>
    <p>Durée : {{exileRuneDuration(r)}}</p>
    <p v-for="issue in exileRuneIssues(rules,state,r)" :key="issue" role="status" class="exile-warning">{{issue}}</p>
    <label class="check"><input type="checkbox" :checked="r.active" :disabled="!r.active&&exileRuneIssues(rules,state,{...r,active:true}).length>0" @change="row('runes',i,'active',checked($event))" />Inscription active déclarée</label>
    <button v-if="r.runeIds.includes(ids.guard)" type="button" :disabled="r.consumed" @click="row('runes',i,'consumed',true)">{{r.consumed?'Garde éteinte — charge consommée':'Noter l’extinction de la Garde'}}</button>
    <p v-if="r.runeIds.includes(ids.guard)">Le bénéficiaire note aussi la protection reçue sur sa propre fiche : une seule par scénario, même avec un autre runiste ou support. Une réinscription ne recharge pas sa protection.</p>
    <button type="button" @click="remove('runes',i)">Retirer cette description</button>
   </fieldset><button type="button" data-exile-add="runes" @click="add('runes')">Ajouter une inscription</button>
  </details>
  <details data-exile-section="techniques"><summary><strong>Techniques magiques réellement apprises</strong></summary>
   <p>Une affinité d’accès n’accorde aucun sort : nommez la tradition, l’apprentissage, l’effet et les coûts. Aucun Mageius, Roue, Tension ou Revers n’est ajouté aux Exilés.</p>
   <fieldset v-for="(t,i) in config.techniques" :key="t.uid"><legend>Technique {{i+1}}</legend>
    <label>Nom<input :value="t.name" maxlength="160" @input="row('techniques',i,'name',textEvent($event))" /></label>
    <label>Tradition / école<input :value="t.tradition" maxlength="250" @input="row('techniques',i,'tradition',textEvent($event))" /></label>
    <label>Apprentissage et exigences remplies<textarea :value="t.learning" maxlength="600" rows="2" @input="row('techniques',i,'learning',textEvent($event))" /></label>
    <label>Effet et limites<textarea :value="t.effect" maxlength="2000" rows="3" @input="row('techniques',i,'effect',textEvent($event))" /></label>
    <div class="exile-grid"><label>PA d’activation<input type="number" min="1" max="100" :value="t.pa??''" @change="row('techniques',i,'pa',numeric($event))" /></label><label>PA de maintien par round<input type="number" min="0" max="100" :value="t.maintenance??''" @change="row('techniques',i,'maintenance',numeric($event))" /></label></div>
    <label>Portée<input :value="t.range" maxlength="250" @input="row('techniques',i,'range',textEvent($event))" /></label>
    <label>Ressources, composants et concentration<textarea :value="t.resources" maxlength="600" rows="2" @input="row('techniques',i,'resources',textEvent($event))" /></label>
    <label>États compatibles<select :value="t.access" @change="row('techniques',i,'access',textEvent($event))"><option>V</option><option>SR/R</option><option>R</option><option>V/SR/R</option></select></label>
    <p data-exile-costs>Coûts dans l’aperçu conditionnel : {{exileTechniqueCosts(rules,state,t,maintain,1,fulgurant).activation??'—'}} PA ; maintien {{exileTechniqueCosts(rules,state,t,maintain,1,fulgurant).maintenance??'—'}} PA/round.</p>
    <p v-if="!exileTechniqueCosts(rules,state,t).defined" role="status">Définition incomplète : aucune réduction de coût.</p>
    <button type="button" @click="remove('techniques',i)">Retirer cette définition</button>
   </fieldset><button type="button" data-exile-add="techniques" @click="add('techniques')">Ajouter une Technique apprise</button>
   <label>Aperçu du maintien, après activation du talent<select v-model="maintain"><option value="none">Coût normal</option><option value="instinct" :disabled="!active.has('exile-accord-instinctif')">Accord instinctif — une Technique, pour la scène</option><option value="natural" :disabled="!active.has('exile-maintien-naturel')">Maintien naturel — une Technique, trois rounds</option></select></label>
   <label class="check"><input v-model="fulgurant" type="checkbox" :disabled="!active.has('exile-incantation-fulgurante')" />Aperçu Incantation fulgurante — une activation par round, minimum 1 PA</label>
   <small>Aperçu seulement : aucun PA n’est accordé, les ressources restent dues et les maintiens équivalents ne se cumulent pas.</small>
  </details>
  <details data-exile-section="works"><summary><strong>Travaux d’atelier et Interface de Vérité</strong></summary>
   <p>Associez un objet ou implant déjà possédé. Fiabilisation conserve ses corrections permanentes ; Fait pour durer ne protège qu’un objet actif par artisan.</p>
   <fieldset v-for="(w,i) in config.works" :key="w.uid"><legend>Travail {{i+1}}</legend>
    <label>Talent acquis<select :value="w.talentId" @change="row('works',i,'talentId',textEvent($event))"><option value="">— Choisir —</option><option v-for="t in owned" :key="t.id" :value="t.id">{{t.name}}</option></select></label>
    <label>Objet / implant réel<select aria-label="Objet / implant réel" :value="w.itemUid" @change="row('works',i,'itemUid',textEvent($event))"><option value="">— Choisir un objet possédé —</option><option v-for="item in inventory" :key="item.uid" :value="item.uid">{{item.name}}</option></select></label>
    <label v-for="[key,label] in workFields" :key="key">{{label}}<textarea :value="w[key]" :maxlength="key==='effect'?2000:600" rows="2" @input="row('works',i,key,textEvent($event))" /></label>
    <template v-if="w.talentId===ids.interface"><label>Talent racial passif soutenu<select :value="w.passiveId" @change="row('works',i,'passiveId',textEvent($event))"><option value="">— Choisir —</option><option v-for="t in owned.filter(t=>t.when?.people&&(t.activation??'').toLowerCase().includes('passif'))" :key="t.id" :value="t.id">{{t.name}}</option></select></label><label class="check"><input type="checkbox" :checked="w.working" @change="row('works',i,'working',checked($event))" />Implant fonctionnel, reproduisant réellement la fonction biologique</label></template>
    <label class="check"><input type="checkbox" :checked="w.active" :disabled="!w.active&&(!inventory.some(item=>item.uid===w.itemUid)||!active.has(w.talentId)||(w.talentId==='exile-fait-pour-durer'&&config.works.some(other=>other.uid!==w.uid&&other.active&&other.talentId===w.talentId)))" @change="row('works',i,'active',checked($event))" />Travail actif déclaré</label>
    <p v-if="!inventory.some(item=>item.uid===w.itemUid)" role="status">Objet absent ou non choisi : description conservée, aucun objet créé.</p><button type="button" @click="remove('works',i)">Retirer cette description</button>
   </fieldset><button type="button" data-exile-add="works" @click="add('works')">Associer un travail à un objet</button>
  </details>
  <details data-exile-section="projects"><summary><strong>Prototypes, contacts, commandes et garanties</strong></summary>
   <p>La technomagie achète une maîtrise, jamais le matériel. Pour une commande ou garantie, nommez le bien, la transaction, l’interlocuteur, le prix et le délai réellement convenus ; aucune indemnisation automatique.</p>
   <fieldset v-for="(p,i) in config.projects" :key="p.uid"><legend>Dossier {{i+1}}</legend>
    <label>Talent associé<select :value="p.talentId" @change="row('projects',i,'talentId',textEvent($event))"><option value="">— Choisir —</option><option v-for="t in owned" :key="t.id" :value="t.id">{{t.name}}</option></select></label>
    <label>Objet possédé concerné<select :value="p.itemUid" @change="row('projects',i,'itemUid',textEvent($event))"><option value="">Dossier sans objet déjà possédé</option><option v-for="item in inventory" :key="item.uid" :value="item.uid">{{item.name}}</option></select></label>
    <label v-for="[key,label] in projectFields" :key="key">{{label}}<textarea :value="p[key]" :maxlength="key==='effect'?2000:1000" rows="2" @input="row('projects',i,key,textEvent($event))" /></label>
    <label>Prix annoncé ($) — descriptif, aucun débit<input type="number" min="0" max="1000000000" :value="p.price??''" @change="row('projects',i,'price',numeric($event))" /></label>
    <button type="button" @click="remove('projects',i)">Retirer ce dossier</button>
   </fieldset><button type="button" data-exile-add="projects" @click="add('projects')">Ajouter un dossier concret</button>
  </details>
  <details v-if="active.has('exile-point-fixe')||config.landmarks.length" data-exile-section="landmarks"><summary><strong>Point fixe — trois repères visités</strong></summary>
   <fieldset v-for="(p,i) in config.landmarks" :key="p.uid"><legend>Repère {{i+1}}</legend><label>Nom<input :value="p.name" maxlength="160" @input="row('landmarks',i,'name',textEvent($event))" /></label><label>Lieu réellement visité<input :value="p.location" maxlength="500" @input="row('landmarks',i,'location',textEvent($event))" /></label><button type="button" @click="remove('landmarks',i)">Retirer le repère</button></fieldset><button type="button" :disabled="config.landmarks.length>=3" data-exile-add="landmarks" @click="add('landmarks')">Noter un repère visité</button>
  </details>
  <details v-if="active.has('exile-rien-ne-se-perd')||config.supplies.length" data-exile-section="supplies"><summary><strong>Rien ne se perd — trois lots récupérés</strong></summary>
   <fieldset v-for="(p,i) in config.supplies" :key="p.uid"><legend>Lot {{i+1}}</legend><label>Composants<input :value="p.name" maxlength="160" @input="row('supplies',i,'name',textEvent($event))" /></label><label>Provenance réelle<input :value="p.source" maxlength="500" @input="row('supplies',i,'source',textEvent($event))" /></label><button type="button" :disabled="p.consumed" @click="row('supplies',i,'consumed',true)">{{p.consumed?'Lot consommé':'Consommer ce lot'}}</button><button type="button" @click="remove('supplies',i)">Retirer ce lot</button></fieldset><button type="button" :disabled="config.supplies.length>=3" data-exile-add="supplies" @click="add('supplies')">Noter un lot réellement récupéré</button>
  </details>
 </section>
</template>
<style scoped>
.exile-options{border:1px solid var(--border,#294655);border-radius:.6rem;padding:1rem;margin:1rem 0;min-width:0}.exile-options details{border-top:1px solid var(--border,#294655);padding:.6rem 0}.exile-options summary{cursor:pointer;min-height:44px;display:flex;align-items:center}.exile-options fieldset{border:1px solid var(--border,#294655);border-radius:.4rem;margin:.7rem 0;padding:.8rem;min-width:0}.exile-options label{display:grid;gap:.35rem;margin:.65rem 0}.exile-options input:not([type=checkbox]),.exile-options textarea,.exile-options select{width:100%;min-width:0;box-sizing:border-box}.exile-options .check{display:flex;align-items:center;gap:.7rem}.exile-options button{min-height:44px;max-width:100%;white-space:normal;margin:.35rem .4rem .35rem 0}.exile-options p,.exile-options small{overflow-wrap:anywhere}.exile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}.exile-warning{border-left:3px solid currentColor;padding:.6rem}@media(max-width:600px){.exile-grid{grid-template-columns:1fr}.exile-options{padding:.65rem}}
</style>
