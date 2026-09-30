<script setup lang="ts">
import {computed} from 'vue';
import {normalizeHunterBuild,hunterBuildChoiceLabel} from '../../lib/hunter';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage;talentId:string}>();
const emit=defineEmits<{change:[patch:Record<string,unknown>]}>();
const build=computed(()=>normalizeHunterBuild(props.state.choices.hunterBuild));
const record=computed(()=>build.value.records[props.talentId]??{reference:'',agreement:'',profile:'',limits:''});
const talent=computed(()=>props.rules.catalogs.humain?.find(t=>t.id===props.talentId));
function update(field:string,event:Event){emit('change',{hunterBuild:normalizeHunterBuild({...build.value,records:{...build.value.records,[props.talentId]:{...record.value,[field]:(event.target as HTMLInputElement).value}}})});}
</script>
<template>
 <div class="hunter-definition">
  <h4>{{hunterBuildChoiceLabel(talentId)}}</h4>
  <p>{{talent?.effectDetails||talent?.effect}}</p>
  <label>Référence réelle : personne, esprit, arme, famille ou composant<input :value="record.reference" maxlength="1600" @input="update('reference',$event)" /></label>
  <label>Accord, engagement ou événement établi<textarea :value="record.agreement" maxlength="1600" @input="update('agreement',$event)" /></label>
  <label>Propriété ou fonction retenue parmi celles du talent<textarea :value="record.profile" maxlength="1600" @input="update('profile',$event)" /></label>
  <label>PA, portée, durée, conditions et limites du profil<textarea :value="record.limits" maxlength="1600" @input="update('limits',$event)" /></label>
  <small>Cette fiche consigne le choix permanent ; elle n’accorde aucun compagnon, objet, Attribut ou PA supplémentaire.</small>
 </div>
</template>
<style scoped>
.hunter-definition{display:grid;gap:.75rem;min-width:0}.hunter-definition label{display:grid;gap:.4rem}.hunter-definition :is(input,textarea){box-sizing:border-box;width:100%;min-width:0;min-height:44px;padding:.6rem;font:inherit;color:inherit;background:var(--input-bg,#07131f);border:1px solid var(--border,#36536b);border-radius:.4rem}.hunter-definition p{white-space:pre-line;line-height:1.6}
</style>
