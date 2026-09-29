<script setup lang="ts">
import {computed} from 'vue';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
import {mageAffinities,mageTechniqueIssues,mageTechniqueIds,mageTechniqueNames,mageTechniqueKinds,mageMasteries,mageAmplitudes,normalizeMageTechniques,blankMageTechnique,type MageTechniqueKind,type MageTechnique,type MageTechniques} from '../../lib/mage';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage}>();
const emit=defineEmits<{change:[value:MageTechniques]}>();
const definitions=computed(()=>normalizeMageTechniques(props.state.choices.mageTechniques));
const affinities=computed(()=>mageAffinities(props.rules));
const get=(kind:MageTechniqueKind)=>definitions.value[kind]??blankMageTechnique();
const issues=(kind:MageTechniqueKind)=>mageTechniqueIssues(props.rules,props.state,kind);
const owned=(kind:MageTechniqueKind)=>props.state.truthTalents.includes(mageTechniqueIds[kind]);
function update(kind:MageTechniqueKind,patch:Partial<MageTechnique>){emit('change',normalizeMageTechniques({...definitions.value,[kind]:{...get(kind),...patch}}));}
function text(kind:MageTechniqueKind,key:'name'|'effect'|'source'|'exception'|'range',event:Event){update(kind,{[key]:(event.target as HTMLInputElement).value});}
function number(kind:MageTechniqueKind,key:'pa'|'tension',event:Event){const v=(event.target as HTMLInputElement).value;update(kind,{[key]:v===''?null:Number(v)});}
function requirement(kind:MageTechniqueKind,index:number,key:'affinity'|'mastery'|'amplitude',event:Event){const rows=get(kind).requirements.map(r=>({...r}));rows[index]![key]=(event.target as HTMLSelectElement).value;update(kind,{requirements:rows});}
function add(kind:MageTechniqueKind){if(get(kind).requirements.length>=15)return;update(kind,{requirements:[...get(kind).requirements,{affinity:'',mastery:'initiale',amplitude:'mineure'}]});}
function remove(kind:MageTechniqueKind,index:number){if(get(kind).requirements.length<=1)return;update(kind,{requirements:get(kind).requirements.filter((_,i)=>i!==index)});}
</script>
<template>
<section v-if="state.nature==='mage'" class="mage-techniques" aria-label="Techniques magiques personnalisées">
 <h3>Échos, Œuvres et techniques familiales</h3>
 <p>Définissez la technique avec votre MJ avant d’acheter son talent. Ces champs sont sauvegardés avec le personnage et apparaissent sur la fiche partagée ; ils ne valent pas une autorisation du MJ et ne modifient pas les récompenses.</p>
 <details v-for="kind in mageTechniqueKinds" :key="kind" :id="`mage-technique-${kind}`" class="mage-technique-editor" :data-mage-technique="kind">
  <summary><strong>{{mageTechniqueNames[kind]}}</strong><span>{{get(kind).name || 'Définir la technique'}} · {{owned(kind)?'Talent acquis':'Avant achat'}}</span></summary>
  <div class="mage-form">
   <p class="mage-notice">{{kind==='echo'?'Un sort précis issu d’un ancien porteur : −1 niveau de Difficulté intrinsèque, minimum 12 ; sans Affinité éveillée, Initiale / Mineure seulement.':kind==='work'?'Une véritable exception signature ; Maîtrise Magistrale et Amplitude Majeure dans votre Affinité principale restent nécessaires.':'Une technique réellement transmise : chaque Affinité requise et ses paliers doivent être atteints, sans achat d’Œuvre personnelle supplémentaire.'}}</p>
   <label>Nom de la technique<input :data-mage-field="`${kind}-name`" :value="get(kind).name" maxlength="160" @input="text(kind,'name',$event)" /></label>
   <label>Effet concret<textarea :data-mage-field="`${kind}-effect`" :value="get(kind).effect" maxlength="4000" rows="3" @input="text(kind,'effect',$event)" /></label>
   <label>{{kind==='work'?'Développement narratif et conception':'Ancien porteur, tradition ou enseignement'}}<input :data-mage-field="`${kind}-source`" :value="get(kind).source" maxlength="400" @input="text(kind,'source',$event)" /></label>
   <fieldset class="mage-requirements"><legend>Affinités et paliers requis par la technique</legend>
    <div v-for="(r,index) in get(kind).requirements" :key="index" class="mage-requirement">
     <label>Affinité<select :data-mage-field="`${kind}-affinity-${index}`" :value="r.affinity" @change="requirement(kind,index,'affinity',$event)"><option value="">— Choisir —</option><option v-for="a in affinities" :key="a.id" :value="a.id">{{a.name}}</option></select></label>
     <label>Maîtrise<select :data-mage-field="`${kind}-mastery-${index}`" :value="r.mastery" @change="requirement(kind,index,'mastery',$event)"><option v-for="m in mageMasteries" :key="m.id" :value="m.id">{{m.name}}</option></select></label>
     <label>Amplitude<select :data-mage-field="`${kind}-amplitude-${index}`" :value="r.amplitude" @change="requirement(kind,index,'amplitude',$event)"><option v-for="a in mageAmplitudes" :key="a.id" :value="a.id">{{a.name}}</option></select></label>
     <button v-if="get(kind).requirements.length>1" type="button" :aria-label="`Retirer l’Affinité ${index+1} de ${mageTechniqueNames[kind]}`" @click="remove(kind,index)">Retirer</button>
    </div>
    <button v-if="kind!=='echo' && get(kind).requirements.length<15" type="button" @click="add(kind)">Ajouter une Affinité requise</button>
   </fieldset>
   <div class="mage-parameters">
    <label>Coût en PA<input :data-mage-field="`${kind}-pa`" type="number" min="0" max="100" step="1" :value="get(kind).pa??''" @input="number(kind,'pa',$event)" /></label>
    <label>Portée<input :data-mage-field="`${kind}-range`" :value="get(kind).range" maxlength="200" placeholder="Contact, 20 m, zone…" @input="text(kind,'range',$event)" /></label>
    <label>Tension produite<input :data-mage-field="`${kind}-tension`" type="number" min="0" max="20" step="1" :value="get(kind).tension??''" @input="number(kind,'tension',$event)" /></label>
   </div>
   <label>{{kind==='echo'?'Précisions de l’Écho (facultatif)':'Exception ou règle particulière'}}<textarea :data-mage-field="`${kind}-exception`" :value="get(kind).exception" maxlength="2000" rows="2" @input="text(kind,'exception',$event)" /></label>
   <div class="mage-validation" aria-live="polite"><strong>{{issues(kind).length?'À compléter / prérequis manquants':'Paramètres renseignés et prérequis atteints'}}</strong><p v-if="issues(kind).length">{{issues(kind).join(' ')}}</p><p v-else>L’accord sur la technique reste à convenir avec le MJ ; aucune validation MJ n’est déduite de ce formulaire.</p><small v-if="owned(kind)&&issues(kind).length">Votre achat et sa dépense en PTV sont conservés : complétez la définition ou retrouvez les prérequis avant d’utiliser cette technique.</small></div>
  </div>
 </details>
</section>
</template>
<style scoped>
.mage-techniques{display:grid;gap:12px;min-width:0;margin:16px 0;color:#d4e1ef;line-height:1.6}.mage-techniques h3,.mage-techniques p{margin:0}.mage-technique-editor{min-width:0;border:1px solid #36536b;border-radius:8px;background:#0d1b2d}.mage-technique-editor>summary{padding:14px;min-height:44px;cursor:pointer;overflow-wrap:anywhere}.mage-technique-editor>summary span{display:block;font-size:13px;color:#b3c5d9}.mage-form{display:grid;gap:14px;padding:0 16px 16px;min-width:0}.mage-form label{display:grid;gap:6px;min-width:0}.mage-form :is(input,select,textarea){box-sizing:border-box;min-width:0;width:100%;min-height:44px;background:#08131f;color:#edf4ff;border:1px solid #36536b;border-radius:6px;padding:9px;font:inherit}.mage-form textarea{resize:vertical}.mage-form button{min-height:44px;padding:8px 12px;border:1px solid #557387;border-radius:6px;color:#d2f2fa;background:#142b3a;cursor:pointer;font:inherit}.mage-requirements{min-width:0;margin:0;padding:12px;border:1px solid #36536b}.mage-requirement{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:10px;margin-bottom:12px;align-items:end;min-width:0}.mage-parameters{display:grid;grid-template-columns:1fr 2fr 1fr;gap:12px}.mage-notice,.mage-validation{padding:12px;border-radius:6px;background:#132838;overflow-wrap:anywhere}.mage-techniques :is(summary,button,input,select,textarea):focus-visible{outline:2px solid #a5eafa;outline-offset:2px}@media(max-width:650px){.mage-requirement,.mage-parameters{grid-template-columns:1fr}.mage-form{padding:0 10px 12px}.mage-requirements{padding:8px}}
</style>
