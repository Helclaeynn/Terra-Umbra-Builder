<script setup lang="ts">
import {computed} from 'vue';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
import {normalizeExtralBuild,extralNetworkAccess} from '../../lib/extral';
import {normalizeExileBuild,exileNetworks} from '../../lib/exile';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage}>();
const emit=defineEmits<{change:[patch:Record<string,unknown>]}>();
const xc=computed(()=>normalizeExtralBuild(props.state.choices.extralBuild));
const ec=computed(()=>normalizeExileBuild(props.state.choices.exileBuild));
const access=computed(()=>props.state.nature==='extral'?extralNetworkAccess(String(props.state.choices.species??''),String(props.state.choices.network??'')):'');
const extraDescription=(id:string)=>{const choice=props.rules.structure.natures.exile?.choices.find(c=>c.key==='network');return [...(choice?.options??[]),...Object.values(choice?.optionsBy??{}).flat()].find(o=>o.id===id)?.description??'';};
function trained(event:Event){const checked=(event.target as HTMLInputElement).checked;emit('change',{extralBuild:normalizeExtralBuild({...xc.value,trainingNetwork:String(props.state.choices.network??''),training:checked?'Recrutement et formation convenus avec le MJ.':''})});}
function update(i:number,key:string,event:Event){const el=event.target as HTMLInputElement;emit('change',{exileBuild:normalizeExileBuild({...ec.value,trainings:ec.value.trainings.map((t,index)=>index===i?{...t,[key]:el.type==='checkbox'?el.checked:el.value}:t)})});}
function add(){if(ec.value.trainings.length>=12)return;emit('change',{exileBuild:normalizeExileBuild({...ec.value,trainings:[...ec.value.trainings,{uid:crypto.randomUUID(),network:'',mentor:'',conditions:'',learned:false}]})});}
</script>
<template>
 <div v-if="access==='O'||access==='R'" class="training-choice" data-guided-network-training>
  <p>{{access==='R'?'Ce réseau accepte exceptionnellement un personnage de ce profil. Son recrutement et sa formation doivent faire partie de votre histoire, avec l’accord du MJ.':'Cette formation n’est pas innée : votre personnage doit avoir été recruté et formé par ce réseau.'}}</p>
  <label class="check"><input type="checkbox" :checked="xc.trainingNetwork===state.choices.network&&!!xc.training.trim()" @change="trained" />Ce recrutement et cette formation sont établis avec mon MJ.</label>
 </div>
 <details v-if="state.nature==='exile'" class="training-choice" data-exile-section="trainings">
  <summary>Mon personnage a appris une autre tradition</summary>
  <p>Facultatif. Gardez votre tradition principale ci-dessus ; ajoutez ici seulement une formation supplémentaire déjà apprise dans l’histoire du personnage. Ses talents restent à acheter.</p>
  <fieldset v-for="(t,i) in ec.trainings" :key="t.uid"><legend>Formation supplémentaire {{i+1}}</legend>
   <label>Tradition<select :value="t.network" @change="update(i,'network',$event)"><option value="">— Choisir —</option><option v-for="n in exileNetworks" :key="n.id" :value="n.id">{{n.name}}</option></select></label>
   <p v-if="t.network">{{extraDescription(t.network)}}</p>
   <label>Qui vous l’a enseignée ?<input :value="t.mentor" maxlength="400" placeholder="Mentor ou école" @input="update(i,'mentor',$event)" /></label>
   <label>Comment l’avez-vous apprise ?<textarea :value="t.conditions" rows="2" maxlength="1000" placeholder="Une phrase sur la formation déjà établie avec le MJ" @input="update(i,'conditions',$event)" /></label>
   <label class="check"><input type="checkbox" :checked="t.learned" @change="update(i,'learned',$event)" />Cette formation est effectivement acquise.</label>
   <button type="button" @click="emit('change',{exileBuild:normalizeExileBuild({...ec,trainings:ec.trainings.filter((_,index)=>index!==i)})})">Retirer cette formation</button>
  </fieldset>
  <button type="button" data-exile-add="trainings" :disabled="ec.trainings.length>=12" @click="add">Ajouter une formation apprise</button>
 </details>
</template>
<style scoped>
.training-choice{margin:.8rem 0;padding:.8rem;border:1px solid var(--border,#36536b);border-radius:.5rem;min-width:0;line-height:1.55}.training-choice summary{min-height:44px;cursor:pointer;display:flex;align-items:center}.training-choice label{display:grid;gap:.4rem;margin:.6rem 0;min-width:0}.training-choice .check{display:flex;align-items:center;gap:.7rem}.training-choice :is(select,input:not([type=checkbox]),textarea){box-sizing:border-box;width:100%;min-width:0;min-height:44px;padding:.6rem;background:#07131f;color:inherit;border:1px solid var(--border,#36536b);border-radius:.35rem;font:inherit}.training-choice fieldset{min-width:0;border:1px solid var(--border,#36536b);margin:.6rem 0}.training-choice button{min-height:44px}.training-choice input[type=checkbox]{width:20px;height:20px;flex-shrink:0}
</style>
