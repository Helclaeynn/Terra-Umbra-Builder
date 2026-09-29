<script setup lang="ts">
import {computed} from 'vue';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
import {mageAffinities} from '../../lib/mage';
import {normalizeDaemonBuild,normalizeDaemonDefinition,daemonTalentIds as ids,daemonFunctions,daemonFormProperties,daemonRiteDomains,daemonPathologyKinds,daemonLearnedFunctions,daemonUnavailableAcquisitions,type DaemonBuild,type DaemonDefinition,type DaemonPathology} from '../../lib/daemon';
import DaemonDefinitionForm from './DaemonDefinitionForm.vue';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage}>();
const emit=defineEmits<{change:[value:DaemonBuild]}>();
const config=computed(()=>normalizeDaemonBuild(props.state.choices.daemonBuild));
const unavailable=computed(()=>daemonUnavailableAcquisitions(props.rules,props.state));
const affinities=computed(()=>mageAffinities(props.rules));
const owns=(id:string)=>props.state.truthTalents.includes(id);
const pathological=computed(()=>props.state.choices.divinity==='belzebuth'||daemonLearnedFunctions(props.state).includes('tourmenteur')||[ids.disease,ids.contagion,ids.pestilence].some(owns));
const fields=[['name','Nom du profil',160],['symptoms','Symptômes / effet concret',1000],['penalty','Malus (sans empilement)',600],['duration','Durée',300],['transmission','Transmission ou absence de contagion',400],['incubation','Incubation',300],['resistance','Résistance',800],['cure','Soins et moyens de mettre fin à l’effet',800]] as const;
function patch(value:Partial<DaemonBuild>){emit('change',normalizeDaemonBuild({...config.value,...value}));}
function text(key:keyof DaemonBuild,e:Event){patch({[key]:(e.target as HTMLInputElement).value});}
function property(id:string,e:Event){const checked=(e.target as HTMLInputElement).checked;patch({formProperties:checked?[...config.value.formProperties,id]:config.value.formProperties.filter(p=>p!==id)});}
function rite(value:DaemonDefinition,index:number){patch({rites:config.value.rites.map((r,i)=>i===index?value:r)});}
function removeRite(index:number){if(window.confirm('Retirer ce rite du répertoire ? Le talent et sa dépense restent conservés.'))patch({rites:config.value.rites.filter((_,i)=>i!==index)});}
function addRite(){if(config.value.rites.length<8)patch({rites:[...config.value.rites,normalizeDaemonDefinition({})]});}
function addPathology(){if(config.value.pathologies.length<6){const blank=normalizeDaemonBuild({pathologies:[{kind:props.state.choices.divinity==='belzebuth'?'contagion':'disease'}]}).pathologies[0]!;patch({pathologies:[...config.value.pathologies,blank]});}}
function disease(index:number,key:keyof DaemonPathology,e:Event){const value=(e.target as HTMLInputElement).value;patch({pathologies:config.value.pathologies.map((p,i)=>i===index?{...p,[key]:value}:p)});}
function removeDisease(index:number){if(window.confirm('Retirer ce profil de pathologie ? Le talent et sa dépense restent conservés.'))patch({pathologies:config.value.pathologies.filter((_,i)=>i!==index)});}
</script>
<template><section v-if="state.nature==='daemon'" class="daemon-options" aria-label="Choix et manifestations du Daemon">
 <h3>Fonctions, Spectres et manifestations</h3>
 <p>Ces choix et profils sont sauvegardés avec le personnage et visibles sur sa fiche partagée. Les textes ne valent pas validation MJ, n’activent pas les pouvoirs et n’accordent aucune récompense.</p>
 <div v-if="unavailable.length" role="status" class="daemon-warning">Acquisitions à régulariser — non utilisables, dépenses conservées : {{unavailable.join(" ; ")}}.</div>
 <details data-daemon-section="secondary"><summary><strong>Formation secondaire</strong> · {{owns(ids.formation)?'Acquise':'Avant achat — 3 PTV'}}</summary><div class="daemon-form">
  <p>Un mentor et un apprentissage dans la Cour sont nécessaires ; une seconde Fonction n’ajoute ni Divinité ni Faveur de Maisonnée.</p>
  <label>Seconde Fonction<select data-daemon-field="secondaryFunction" :value="config.secondaryFunction" @change="text('secondaryFunction',$event)"><option value="">— Choisir —</option><option v-for="f in daemonFunctions" :key="f.id" :value="f.id" :disabled="f.id===state.choices.function">{{f.name}}</option></select></label>
  <label>Mentor et apprentissage narratif<input data-daemon-field="secondaryMentor" :value="config.secondaryMentor" maxlength="400" @input="text('secondaryMentor',$event)" /></label>
  <p v-if="config.secondaryFunction===state.choices.function&&config.secondaryFunction" role="status">La seconde Fonction doit différer de la principale ; l’achat reste conservé.</p>
 </div></details>
 <details v-if="state.choices.divinity==='mephisto'" data-daemon-section="spectra"><summary><strong>Spectres de Méphisto</strong> · sans Tension ni Revers</summary><div class="daemon-form">
  <label>Première Affinité spectrale — Empreinte gratuite<select data-daemon-field="spectralAffinity" :value="config.spectralAffinity" @change="text('spectralAffinity',$event)"><option value="">— Choisir —</option><option v-for="a in affinities" :key="a.id" :value="a.id">{{a.name}}</option></select></label>
  <p>Premier Spectre : Maîtrise {{owns(ids.affined)?'Affinée':'Initiale'}} / Amplitude {{owns(ids.amplified)?'Significative':'Mineure'}}.</p>
  <label>Seconde Affinité — Polyphonie occulte, 3 PTV<select data-daemon-field="secondSpectralAffinity" :value="config.secondSpectralAffinity" @change="text('secondSpectralAffinity',$event)"><option value="">— Choisir —</option><option v-for="a in affinities" :key="a.id" :value="a.id" :disabled="a.id===config.spectralAffinity">{{a.name}}</option></select></label>
  <p>{{owns(ids.polyphony)?`Second Spectre acquis : Maîtrise ${owns(ids.secondAffined)?'Affinée':'Initiale'} / Amplitude ${owns(ids.secondAmplified)?'Significative':'Mineure'}.`:'Le second Spectre ne devient utilisable qu’après l’achat de Polyphonie occulte.'}}</p>
  <p>Chaque Spectre paie ses propres paliers : Affinée 1 PTV, Significative 2 PTV ; plafond Affinée / Significative, sans Roue, Écho ou Œuvre personnelle.</p>
  <p v-if="config.spectralAffinity&&config.spectralAffinity===config.secondSpectralAffinity" role="status">Les deux Affinités doivent être différentes.</p>
 </div></details>
 <details v-if="state.choices.divinity==='belzebuth'||owns(ids.form)" data-daemon-section="form"><summary><strong>Forme supérieure — répertoire</strong></summary><div class="daemon-form">
  <p>Définissez le répertoire avec le MJ avant achat ; à chaque activation, adoptez au maximum deux de ces propriétés pour 2 PA et pour la scène.</p>
  <label v-for="p in daemonFormProperties" :key="p.id" class="daemon-check"><input type="checkbox" :data-daemon-property="p.id" :checked="config.formProperties.includes(p.id)" @change="property(p.id,$event)" /><span><strong>{{p.name}}</strong> — {{p.effect}}</span></label>
  <p>Aucune de ces propriétés n’est appliquée en permanence aux valeurs de la fiche.</p>
 </div></details>
 <details v-if="state.choices.divinity==='morrighan'||owns(ids.ritual)" data-daemon-section="rites"><summary><strong>Sorcellerie des Corneilles — rites</strong></summary><div class="daemon-form">
  <label>Domaine étroit<select data-daemon-field="riteDomain" :value="config.riteDomain" @change="text('riteDomain',$event)"><option value="">— Choisir —</option><option v-for="d in daemonRiteDomains" :key="d.id" :value="d.id">{{d.name}}</option></select></label>
  <p>Chaque rite reste Initial / Mineur, demande dix minutes et suit une difficulté de base 15 ; précisez ses PA, portée, opposition et limites avec le MJ.</p>
  <fieldset v-for="(r,i) in config.rites" :key="i"><legend>Rite {{i+1}}</legend><DaemonDefinitionForm :prefix="`rite-${i}`" :value="r" @change="rite($event,i)" /><button type="button" @click="removeRite(i)">Retirer ce rite</button></fieldset>
  <button type="button" :disabled="config.rites.length>=8" data-daemon-add="rite" @click="addRite">Ajouter un rite</button>
 </div></details>
 <details v-if="pathological" data-daemon-section="pathologies"><summary><strong>Profils de pathologies</strong> · à définir avant usage</summary><div class="daemon-form">
  <p>Un profil ne donne pas le talent associé : il décrit son utilisation. Les malus et la transmission ne s’empilent pas ; Contagion exige un Miasme réussi ou votre Affliction de Châtiment.</p>
  <fieldset v-for="(p,i) in config.pathologies" :key="i"><legend>Pathologie {{i+1}}</legend>
   <label>Talent associé<select :data-daemon-field="`pathology-${i}-kind`" :value="p.kind" @change="disease(i,'kind',$event)"><option value="">— Choisir —</option><option v-for="kind in daemonPathologyKinds" :key="kind.id" :value="kind.id">{{kind.name}}</option></select></label>
   <label v-for="[key,label,max] in fields" :key="key">{{label}}<textarea :data-daemon-field="`pathology-${i}-${key}`" :value="p[key]" :maxlength="max" rows="2" @input="disease(i,key,$event)" /></label>
   <button type="button" @click="removeDisease(i)">Retirer cette pathologie</button>
  </fieldset>
  <button type="button" :disabled="config.pathologies.length>=6" data-daemon-add="pathology" @click="addPathology">Ajouter un profil de pathologie</button>
 </div></details>
 <details v-if="state.choices.soulOrigin==='ancien_prophete'||owns(ids.remanence)" data-daemon-section="remanence"><summary><strong>Rémanence prophétique</strong> · origine rare, accord MJ nécessaire</summary><div class="daemon-form">
  <p>Décrivez la cicatrice étroite de l’ancien Attribut avant l’achat à 2 PTV : ni Attribut cosmique, ni prières, ni statut actuel de Prophète.</p>
  <DaemonDefinitionForm prefix="remanence" :value="config.remanence" source-label="Ancien Attribut et histoire" @change="patch({remanence:$event})" />
 </div></details>
</section></template>
<style scoped>
.daemon-options{display:grid;gap:12px;min-width:0;margin:16px 0;color:#d4e1ef;line-height:1.6}.daemon-options h3,.daemon-options p{margin:0}.daemon-options details{min-width:0;border:1px solid #36536b;border-radius:8px;background:#0d1b2d}.daemon-options summary{padding:14px;min-height:44px;cursor:pointer;overflow-wrap:anywhere}.daemon-form{display:grid;gap:14px;padding:0 16px 16px;min-width:0}.daemon-form label{display:grid;gap:6px;min-width:0}.daemon-form :is(input,select,textarea){box-sizing:border-box;min-width:0;width:100%;min-height:44px;background:#08131f;color:#edf4ff;border:1px solid #36536b;border-radius:6px;padding:9px;font:inherit}.daemon-form textarea{resize:vertical}.daemon-form button{min-height:44px;padding:8px 12px;border:1px solid #557387;border-radius:6px;color:#d2f2fa;background:#142b3a;cursor:pointer;font:inherit}.daemon-form button:disabled{opacity:.5;cursor:default}.daemon-form fieldset{min-width:0;margin:0;padding:12px;border:1px solid #36536b;display:grid;gap:12px}.daemon-form .daemon-check{display:flex;align-items:center;gap:10px;min-height:44px}.daemon-check input{width:22px;min-height:22px;flex:none}.daemon-options :is(summary,button,input,select,textarea):focus-visible{outline:2px solid #a5eafa;outline-offset:2px}@media(max-width:650px){.daemon-form{padding:0 10px 12px}.daemon-form fieldset{padding:8px}}
</style>
