<script setup lang="ts">
import {computed} from 'vue';
import {normalizeBeneficiaryBenefits,type BeneficiaryBenefits} from '../../lib/exile';
const props=defineProps<{value:unknown}>();const emit=defineEmits<{change:[value:BeneficiaryBenefits]}>();
const config=computed(()=>normalizeBeneficiaryBenefits(props.value));
function patch(p:Partial<BeneficiaryBenefits>){emit('change',normalizeBeneficiaryBenefits({...config.value,...p}));}
function reset(){if(window.confirm('Un nouveau scénario commence : remettre à zéro uniquement le suivi des soins et protections reçus, sans rendre de PV ni recharger une Rune ?'))patch({refectionReceived:false,guardReceived:false,refectionSource:'',guardSource:''});}
</script>
<template>
 <details class="beneficiary-benefits" data-exile-section="received"><summary><strong>Soins et protections reçus — suivi par scénario</strong></summary>
  <p>Ce suivi appartient au bénéficiaire, quelle que soit sa Nature ou l’identité du lanceur. Un autre lanceur ou support ne renouvelle pas une utilisation ; ces contrôles ne modifient pas les PV.</p>
  <label>Scénario<input data-beneficiary="scenario" :value="config.scenario" maxlength="160" @input="patch({scenario:($event.target as HTMLInputElement).value})" /></label>
  <p><strong>Réfection vitale</strong> · 4 + DR PV, au plus une fois par scénario sur ce personnage.</p>
  <label>Lanceur / référence du soin<input :value="config.refectionSource" maxlength="300" @input="patch({refectionSource:($event.target as HTMLInputElement).value})" /></label>
  <button type="button" data-beneficiary="refection" :disabled="config.refectionReceived" @click="patch({refectionReceived:true})">{{config.refectionReceived?'Réfection vitale déjà reçue':'Noter Réfection vitale reçue'}}</button>
  <p><strong>Rune de Garde</strong> · protection de 6 dégâts surnaturels, au plus une fois par scénario sur ce personnage, même après réinscription.</p>
  <label>Runiste / support de la protection<input :value="config.guardSource" maxlength="300" @input="patch({guardSource:($event.target as HTMLInputElement).value})" /></label>
  <button type="button" data-beneficiary="guard" :disabled="config.guardReceived" @click="patch({guardReceived:true})">{{config.guardReceived?'Protection déjà reçue pour ce scénario':'Noter Rune de Garde reçue'}}</button>
  <p>Le runiste note séparément l’extinction de son inscription. Le partage d’une fiche ne modifie jamais celle d’un autre personnage : le bénéficiaire ou son MJ renseigne ce suivi sur la fiche concernée.</p>
  <button type="button" data-beneficiary="reset" @click="reset">Nouveau scénario — réinitialiser le suivi reçu</button>
 </details>
</template>
<style scoped>
.beneficiary-benefits{border:1px solid var(--border,#294655);border-radius:.6rem;padding:1rem;margin:1rem 0;min-width:0}.beneficiary-benefits label{display:grid;gap:.35rem;margin:.7rem 0}.beneficiary-benefits input{width:100%;min-width:0;box-sizing:border-box}.beneficiary-benefits button{min-height:44px;max-width:100%;white-space:normal;margin:.4rem 0}.beneficiary-benefits p{overflow-wrap:anywhere}summary{cursor:pointer;min-height:44px}
</style>
