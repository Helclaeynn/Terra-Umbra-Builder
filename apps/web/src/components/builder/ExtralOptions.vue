<script setup lang="ts">
import {computed} from 'vue';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
import {normalizeExtralBuild,extralTalentIds as ids,extralInventory,extralUsableTalents,extralSheetDetails,extralNetworkAccess,extralAccessLabels,type ExtralBuild,type ExtralPreparation,type ExtralDefinition} from '../../lib/extral';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage;rewardsLocked?:boolean}>();
const emit=defineEmits<{change:[value:ExtralBuild]}>();
const config=computed(()=>normalizeExtralBuild(props.state.choices.extralBuild));
const inventory=computed(()=>extralInventory(props.rules,props.state));
const active=computed(()=>extralUsableTalents(props.rules,props.state));
const capacity=computed(()=>active.value.has(ids.bank)?4:2);
const access=computed(()=>extralNetworkAccess(String(props.state.choices.species??''),String(props.state.choices.network??'')));
const notices=computed(()=>extralSheetDetails(props.rules,props.state).find(r=>r.id==='extral-unavailable'));
const rows=computed(()=>props.rules.catalogs.extral??[]);
const biological=computed(()=>inventory.value.filter(i=>i.biological));
const candidates=computed(()=>rows.value.filter(t=>typeof t.when?.species==='string'&&t.when.species!==props.state.choices.species&&t.when.species!=='homo_superior'));
const owns=(id:string)=>props.state.truthTalents.includes(id);
const uid=()=>globalThis.crypto.randomUUID();
function patch(value:Partial<ExtralBuild>){emit('change',normalizeExtralBuild({...config.value,...value}));}
function preparation(i:number,key:keyof ExtralPreparation,value:string|number){patch({preparations:config.value.preparations.map((p,index)=>index===i?{...p,[key]:value}:p)});}
function addPreparation(){if(config.value.preparations.length>=capacity.value)return;patch({preparations:[...config.value.preparations,{uid:uid(),name:'',kind:'sample',effect:'',resistance:'',duration:'',remaining:1}]});}
function setPatch(id:string,value:string){const other=config.value.patches.filter(p=>p.uid!==id);patch({patches:value?[...other,{uid:id,state:value==='phased'?'phased':'materialized'}]:other});}
function addProject(){if(config.value.projects.length>=12)return;patch({projects:[...config.value.projects,{uid:uid(),name:'',talentId:'',effect:'',materials:'',duration:'',limits:'',pa:null}]});}
function project(i:number,key:keyof ExtralDefinition,value:string|number|null){patch({projects:config.value.projects.map((p,index)=>index===i?{...p,[key]:value}:p)});}
function resetScenario(){if(window.confirm('Un nouveau scénario commence : réinitialiser les deux compteurs de suivi nanitique, sans rendre de PV ?'))patch({reserveUsed:false,repairUsed:false});}
</script>
<template>
 <section v-if="state.nature==='extral'" class="extral-options" aria-label="Physiologie et configurations Extrals">
  <h3>Physiologie et configurations Extrals</h3>
  <p>Choix sauvegardés sur la fiche et partagés au MJ. Une description ne crée ni équipement, ni soin, ni validation du MJ.</p>
  <p v-if="notices" role="status" class="extral-warning">Acquisitions conservées, à régulariser : {{notices.value}}</p>
  <details v-if="access" data-extral-section="training"><summary><strong>Formation au réseau</strong> · {{extralAccessLabels[access]}}</summary><div class="extral-form">
   <label>Recrutement, formation et conditions convenues avec le MJ<textarea data-extral-field="training" :value="config.trainingNetwork===state.choices.network?config.training:''" maxlength="1000" rows="3" @input="patch({training:($event.target as HTMLTextAreaElement).value,trainingNetwork:String(state.choices.network??'')})" /></label>
   <p>N/O/R décrit l’accès à l’enseignement, pas l’état V/SR/R. Une admission restreinte reste à valider avec le MJ ; aucun rôle de compte ne change.</p>
  </div></details>
  <details v-if="state.choices.species==='baseanh'||config.preparations.length" data-extral-section="preparations"><summary><strong>Tardollas</strong> · {{config.preparations.length}} / {{capacity}} préparations</summary><div class="extral-form">
   <p v-if="config.preparations.length>capacity" role="status">Capacité dépassée : les anciennes préparations sont conservées mais doivent être régularisées.</p>
   <fieldset v-for="(p,i) in config.preparations" :key="p.uid" :data-extral-preparation="p.uid"><legend>Préparation {{i+1}}</legend>
    <label>Nom<input :value="p.name" maxlength="160" @input="preparation(i,'name',($event.target as HTMLInputElement).value)" /></label>
    <label>Type<select :value="p.kind" @change="preparation(i,'kind',($event.target as HTMLSelectElement).value)"><option value="sample">Échantillon</option><option value="medical">Secours médical</option><option value="antidote">Antidote</option><option value="toxin">Toxine</option><option value="corrosive">Corrosive</option><option value="adhesive">Adhésive</option></select></label>
    <label>Effet réellement préparé<textarea :value="p.effect" maxlength="1000" rows="2" @input="preparation(i,'effect',($event.target as HTMLTextAreaElement).value)" /></label>
    <label>Résistance<input :value="p.resistance" maxlength="500" @input="preparation(i,'resistance',($event.target as HTMLInputElement).value)" /></label>
    <label>Durée<input :value="p.duration" maxlength="250" @input="preparation(i,'duration',($event.target as HTMLInputElement).value)" /></label>
    <label>Doses restantes<input type="number" min="0" max="20" :value="p.remaining" @change="preparation(i,'remaining',Number(($event.target as HTMLInputElement).value))" /></label>
    <div class="extral-actions"><button type="button" :disabled="!p.remaining" @click="preparation(i,'remaining',Math.max(0,p.remaining-1))">Consommer une dose</button><button type="button" @click="patch({preparations:config.preparations.filter((_,index)=>index!==i)})">Retirer cette préparation</button></div>
   </fieldset>
   <button type="button" data-extral-action="add-preparation" :disabled="config.preparations.length>=capacity" @click="addPreparation">Ajouter une préparation</button>
   <p>Banque vivante : 4 préparations au lieu de 2. Un rechargement de page ou changement de forme ne renouvelle pas les stocks ; les cultures demandent les moyens et Talents appropriés.</p>
  </div></details>
  <details v-if="state.choices.species==='homo_superior'&&(owns(ids.reserve)||owns(ids.repair))" data-extral-section="nanites"><summary><strong>Soins nanitiques</strong> · une utilisation de chaque talent par scénario</summary><div class="extral-form">
   <div v-if="owns(ids.reserve)"><p><strong>Réserve nanitique</strong> : +3 PV sur un soin réel admissible, une fois par scénario. Ni repos, Cycle de réparation ni régénération indépendante.</p><button type="button" data-extral-action="use-reserve" :disabled="config.reserveUsed" @click="patch({reserveUsed:true})">{{config.reserveUsed?'Réserve consommée pour ce scénario':'Marquer la Réserve comme consommée'}}</button></div>
   <div v-if="owns(ids.repair)"><p><strong>Cycle de réparation</strong> : 1 PA, 6 PV, une fois par scénario ; conscient et essaim fonctionnel. Récupération naturelle hors combat doublée.</p><button type="button" data-extral-action="use-repair" :disabled="config.repairUsed" @click="patch({repairUsed:true})">{{config.repairUsed?'Cycle consommé pour ce scénario':'Marquer le Cycle comme consommé'}}</button></div>
   <button type="button" data-extral-action="new-scenario" @click="resetScenario">Nouveau scénario — réinitialiser le suivi</button>
   <small>Ces compteurs de suivi ne soignent pas automatiquement le personnage et ne constituent pas une récompense. Une nouvelle scène de combat ne les réinitialise jamais.</small>
  </div></details>
  <details v-if="owns(ids.phase)||config.patches.length" data-extral-section="patches"><summary><strong>Patchs tatoués AIDH</strong> · équipement existant</summary><div class="extral-form">
   <p>1 PA par élément, 2 PA pour une tenue, une armure ou plusieurs éléments ; mêmes coûts dans les deux sens. L’objet reste le même dans l’inventaire.</p>
   <label v-for="item in inventory" :key="item.uid">{{item.name}}<select :data-extral-patch="item.uid" :disabled="!active.has(ids.phase)" :value="config.patches.find(p=>p.uid===item.uid)?.state||''" @change="setPatch(item.uid,($event.target as HTMLSelectElement).value)"><option value="">Non lié</option><option value="materialized">Lié — matérialisé</option><option value="phased">Lié — déphasé, indisponible</option></select></label>
   <p v-if="!inventory.length">Aucun objet possédé à lier. L’achat du talent ne fournit pas d’équipement.</p>
   <p v-for="p in config.patches.filter(p=>!inventory.some(i=>i.uid===p.uid))" :key="p.uid" role="status">Ancienne liaison sans objet possédé : {{p.uid}}. Aucune copie créée.</p>
  </div></details>
  <details v-if="state.choices.network==='smrc'||owns(ids.recombine)||config.recombination.talentId" data-extral-section="recombination"><summary><strong>Héritage recombiné</strong> · un talent précis</summary><div class="extral-form">
   <label>Greffe biologique réellement possédée<select data-extral-field="graftUid" :value="config.recombination.graftUid" @change="patch({recombination:{...config.recombination,graftUid:($event.target as HTMLSelectElement).value}})"><option value="">— Choisir une greffe —</option><option v-for="i in biological" :key="i.uid" :value="i.uid">{{i.name}}</option></select></label>
   <label>Talent racial ouvert<select data-extral-field="talentId" :value="config.recombination.talentId" @change="patch({recombination:{...config.recombination,talentId:($event.target as HTMLSelectElement).value}})"><option value="">— Choisir un talent —</option><option v-for="t in candidates" :key="t.id" :value="t.id">{{t.name}} · {{t.cost}} PTV</option></select></label>
   <label>Architecture reproduite et limites à valider avec le MJ<textarea data-extral-field="architecture" :value="config.recombination.architecture" maxlength="1000" rows="3" @input="patch({recombination:{...config.recombination,architecture:($event.target as HTMLTextAreaElement).value}})" /></label>
   <p>1 PTV ouvre uniquement cet accès, en R ; la greffe, le talent et ses prérequis restent à acquérir. Une description ne reproduit pas à elle seule l’organe nécessaire.</p>
  </div></details>
  <details v-if="state.choices.species==='rocreen'" data-extral-section="hydration"><summary><strong>Hydratation du Noyau</strong></summary><div class="extral-form"><label class="extral-check"><input type="checkbox" :checked="config.hydrated" @change="patch({hydrated:($event.target as HTMLInputElement).checked})" />Tissus complètement hydratés dans la scène</label><p>En R : Régénération active 4 PV, ou 6 si abondamment hydraté, 1 PA et une fois par round au-dessus de 0 PV. À 0 PV Stabilisé, tous les PA et toute l’activation du round suivant sont requis.</p></div></details>
  <details data-extral-section="projects"><summary><strong>Greffes, prototypes et protocoles</strong> · {{config.projects.length}} configurations</summary><div class="extral-form">
   <fieldset v-for="(p,i) in config.projects" :key="p.uid"><legend>Configuration {{i+1}}</legend>
    <label>Nom<input :value="p.name" maxlength="160" @input="project(i,'name',($event.target as HTMLInputElement).value)" /></label>
    <label>Talent associé<select :value="p.talentId" @change="project(i,'talentId',($event.target as HTMLSelectElement).value)"><option value="">— Choisir —</option><option v-for="t in rows" :key="t.id" :value="t.id">{{t.name}}</option></select></label>
    <label>Fonction précise<textarea :value="p.effect" maxlength="2000" rows="3" @input="project(i,'effect',($event.target as HTMLTextAreaElement).value)" /></label>
    <label>Matériaux, appareils et greffes nécessaires<textarea :value="p.materials" maxlength="1000" rows="2" @input="project(i,'materials',($event.target as HTMLTextAreaElement).value)" /></label>
    <label>Coût en PA<input type="number" min="0" max="100" :value="p.pa??''" @change="project(i,'pa',($event.target as HTMLInputElement).value===''?null:Number(($event.target as HTMLInputElement).value))" /></label>
    <label>Durée / préparation<input :value="p.duration" maxlength="300" @input="project(i,'duration',($event.target as HTMLInputElement).value)" /></label>
    <label>Conditions, oppositions et limites<textarea :value="p.limits" maxlength="1000" rows="2" @input="project(i,'limits',($event.target as HTMLTextAreaElement).value)" /></label>
    <button type="button" @click="patch({projects:config.projects.filter((_,index)=>index!==i)})">Retirer cette configuration</button>
   </fieldset><button type="button" data-extral-action="add-project" :disabled="config.projects.length>=12" @click="addProject">Ajouter une configuration</button>
  </div></details>
 </section>
</template>
<style scoped>
.extral-options{display:grid;gap:12px;min-width:0;margin:16px 0;line-height:1.6;color:#d4e1ef}.extral-options h3,.extral-options p{margin:0}.extral-options details{min-width:0;border:1px solid #36536b;border-radius:8px;background:#0d1b2d}.extral-options summary{padding:14px;min-height:44px;cursor:pointer;overflow-wrap:anywhere}.extral-form{display:grid;gap:14px;padding:16px;min-width:0}.extral-form label{display:grid;gap:6px;min-width:0}.extral-form input,.extral-form select,.extral-form textarea,.extral-form button{box-sizing:border-box;max-width:100%;width:100%;min-width:0;min-height:44px;background:#081420;color:#e3edf8;border:1px solid #36536b;border-radius:7px;padding:10px;font:inherit}.extral-form textarea{resize:vertical}.extral-form fieldset{display:grid;gap:12px;min-width:0;margin:0;padding:14px;border:1px solid #36536b;border-radius:8px}.extral-options :focus-visible{outline:2px solid #a6e9ff;outline-offset:3px}.extral-form button{cursor:pointer;white-space:normal}.extral-form button:disabled{opacity:.55;cursor:default}.extral-warning{border:1px solid #a6e9ff;padding:12px;overflow-wrap:anywhere}.extral-actions{display:flex;flex-wrap:wrap;gap:8px}.extral-actions button{flex:1 1 180px}.extral-form .extral-check{display:flex;align-items:center}.extral-check input{width:24px;flex-shrink:0}.extral-options small{color:#afc1d5}
</style>
