<script setup lang="ts">
import HunterBuildChoices from './HunterBuildChoices.vue';
import {hunterBuildChoiceLabel} from '../../lib/hunter';
import {computed} from 'vue';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
import {truthBuildChoiceLabel,truthHasInnateBuildChoice} from '../../lib/truth-build-guidance';
import {normalizeDaemonBuild,daemonTalentIds as d,daemonFunctions,daemonFormProperties} from '../../lib/daemon';
import {normalizeAngelusBuild,angelusTalentIds as a,angelusNatures,angelusConstructKinds} from '../../lib/angelus';
import {normalizeExtralBuild,extralTalentIds as x,extralInventory} from '../../lib/extral';
import {normalizeExileBuild,exileTalentIds as e,exileInventory} from '../../lib/exile';
import {mageAffinities,mageTechniqueKind,normalizeMageTechniques} from '../../lib/mage';
import VampireBuildChoices from './VampireBuildChoices.vue';
import MageTechniques from './MageTechniques.vue';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage;talentId:string}>();
const emit=defineEmits<{change:[patch:Record<string,unknown>]}>();
const label=computed(()=>truthBuildChoiceLabel(props.state,props.talentId));
const innate=computed(()=>props.talentId==='innate-spectre'&&truthHasInnateBuildChoice(props.state));
const dc=computed(()=>normalizeDaemonBuild(props.state.choices.daemonBuild));
const ac=computed(()=>normalizeAngelusBuild(props.state.choices.angelusBuild));
const xc=computed(()=>normalizeExtralBuild(props.state.choices.extralBuild));
const ec=computed(()=>normalizeExileBuild(props.state.choices.exileBuild));
const affinities=computed(()=>mageAffinities(props.rules));
const kind=computed(()=>mageTechniqueKind(props.talentId));
const grafts=computed(()=>extralInventory(props.rules,props.state).filter(i=>i.biological));
const foreignTalents=computed(()=>(props.rules.catalogs.extral??[]).filter(t=>typeof t.when?.species==='string'&&t.when.species!==props.state.choices.species&&t.when.species!=='homo_superior'));
const selectedForeign=computed(()=>foreignTalents.value.find(t=>t.id===xc.value.recombination.talentId));
const implants=computed(()=>exileInventory(props.rules,props.state).filter(i=>i.kind==='augmentation'));
const support=computed(()=>ec.value.works.find(w=>w.talentId===e.interface));
const passives=computed(()=>(props.rules.catalogs.exile??[]).filter(t=>props.state.truthTalents.includes(t.id)&&t.when?.people===props.state.choices.people&&/passif/i.test(t.activation??'')));
const functionHelp:Record<string,string>={oracle:'Influencer les perceptions et les esprits, lire les âmes et communiquer par les rêves.',tourmenteur:'Infliger des afflictions et entraver les pouvoirs adverses.',legionnaire:'Combattre avec l’Armure infernale et la Lame consacrée, puis protéger ses alliés.'};
const natureHelp:Record<string,string>={trone:'Percevoir les liens spirituels, communiquer par la pensée et contrarier les manifestations occultes.',vertu:'Soulager les afflictions spirituelles et détourner leur puissance.',domination:'Former une Lame céleste et poursuivre une cible désignée.'};
const text=(event:Event)=>(event.target as HTMLInputElement).value;
function daemon(patch:Record<string,unknown>){emit('change',{daemonBuild:normalizeDaemonBuild({...dc.value,...patch})});}
function form(id:string,checked:boolean){daemon({formProperties:checked?[...dc.value.formProperties,id]:dc.value.formProperties.filter(v=>v!==id)});}
function construct(id:string){const profile=angelusConstructKinds.find(p=>p.id===id);angelus({construct:{name:profile?.name??'',kind:id,purpose:profile?.effect??'',limits:'10 PV · Armure 3 · 30 m · 2 PA · 3 Aura · 1/scène ; tâches commandées, aucune action autonome.'}});}
function angelus(patch:Record<string,unknown>){emit('change',{angelusBuild:normalizeAngelusBuild({...ac.value,...patch})});}
function graft(patch:Record<string,unknown>){emit('change',{extralBuild:normalizeExtralBuild({...xc.value,recombination:{...xc.value.recombination,...patch}})});}
function implant(patch:Record<string,unknown>){
 const row=support.value??{uid:crypto.randomUUID(),talentId:e.interface,name:'Interface de Vérité',itemUid:'',passiveId:'',effect:'',materials:'',duration:'',limits:'',working:true,active:false};
 emit('change',{exileBuild:normalizeExileBuild({...ec.value,works:[...ec.value.works.filter(w=>w.uid!==row.uid),{...row,...patch}]})});
}
</script>
<template>
 <section v-if="label||innate" class="guided-choice" :data-truth-build-choice="talentId" :aria-label="innate?'Affinité spectrale de Méphisto':label">
  <HunterBuildChoices v-if="hunterBuildChoiceLabel(talentId)" :state="state" :rules="rules" :talent-id="talentId" @change="emit('change',$event)" />
  <VampireBuildChoices v-else-if="state.nature==='vampire'" :state="state" :talent-id="talentId" @change="emit('change',$event)" />
  <template v-else-if="innate||talentId===d.polyphony">
   <h4>{{innate?'Votre magie spectrale':'Une seconde magie spectrale'}}</h4>
   <p>{{innate?'Méphisto vous donne gratuitement un domaine de magie. Choisissez celui que votre personnage sait déjà utiliser.':'Polyphonie ajoute un autre domaine de magie ; elle ne remplace pas votre première Affinité.'}}</p>
   <label>{{innate?'Première Affinité':'Seconde Affinité'}}<select :data-daemon-field="innate?'spectralAffinity':'secondSpectralAffinity'" :value="innate?dc.spectralAffinity:dc.secondSpectralAffinity" @change="daemon({[innate?'spectralAffinity':'secondSpectralAffinity']:text($event)})"><option value="">— Choisir un domaine —</option><option v-for="affinity in affinities" :key="affinity.id" :value="affinity.id" :disabled="!innate&&affinity.id===dc.spectralAffinity">{{affinity.name}}</option></select></label>
   <p class="choice-help">{{affinities.find(f=>f.id===(innate?dc.spectralAffinity:dc.secondSpectralAffinity))?.description || 'Sélectionnez une Affinité pour lire ce qu’elle permet.'}}</p>
   <small>Initiale / Mineure ; les améliorations de chaque Affinité s’achètent séparément.</small>
  </template>
  <template v-else-if="talentId===d.formation">
   <h4>Quelle seconde Fonction avez-vous apprise ?</h4>
   <p>Ce talent ouvre une autre manière de servir votre Divinité : son pouvoir de base et ses talents deviennent accessibles. Vous gardez votre Divinité actuelle.</p>
   <label>Seconde Fonction<select data-daemon-field="secondaryFunction" :value="dc.secondaryFunction" @change="daemon({secondaryFunction:text($event)})"><option value="">— Choisir —</option><option v-for="f in daemonFunctions.filter(f=>f.id!==state.choices.function)" :key="f.id" :value="f.id">{{f.name}}</option></select></label>
   <p v-if="dc.secondaryFunction" class="choice-help">{{functionHelp[dc.secondaryFunction]}}</p>
   <label>Auprès de qui avez-vous appris cette Fonction ?<input data-daemon-field="secondaryMentor" :value="dc.secondaryMentor" maxlength="400" placeholder="Le mentor ou l’enseignement convenu avec votre MJ" @input="daemon({secondaryMentor:text($event)})" /></label>
  </template>
  <template v-else-if="talentId===d.form">
   <p>Choisissez les propriétés permanentes de votre Forme supérieure. Chaque option décrit son profil de règle ; les Armures corporelles ne s’additionnent pas.</p>
   <label v-for="p in daemonFormProperties" :key="p.id" class="check"><input type="checkbox" :checked="dc.formProperties.includes(p.id)" @change="form(p.id,($event.target as HTMLInputElement).checked)" />{{p.name}} — {{p.effect}}</label>
  </template>
  <template v-else-if="talentId===a.construct">
   <p>Votre auxiliaire emploie le profil canonique : 10 PV, Armure 3, à 30 m maximum. Création : 2 PA et 3 Aura, une fois par scène. Il suit vos ordres sans recevoir de PA autonomes.</p>
   <label>Rôle de l’auxiliaire<select data-angelus-field="construct-kind" :value="ac.construct.kind" @change="construct(text($event))"><option value="">— Choisir —</option><option v-for="p in angelusConstructKinds" :key="p.id" :value="p.id">{{p.name}} — {{p.effect}}</option></select></label>
  </template>
  <template v-else-if="talentId===a.cherub">
   <h4>Votre seconde Nature angélique</h4>
   <p>Après 3 PTV investis dans votre Nature initiale et un événement de Transcendance, le Chérubin obtient le pouvoir fondamental d’une autre Nature et l’accès à ses talents.</p>
   <label>Seconde Nature<select data-angelus-field="secondaryNature" :value="ac.secondaryNature" @change="angelus({secondaryNature:text($event)})"><option value="">— Choisir —</option><option v-for="n in angelusNatures.filter(n=>n.id!==state.choices.angelNature)" :key="n.id" :value="n.id">{{n.name}}</option></select></label>
   <p v-if="ac.secondaryNature" class="choice-help">{{natureHelp[ac.secondaryNature]}}</p>
   <label>Quel événement a provoqué cette Transcendance ?<input data-angelus-field="transcendenceEvent" :value="ac.transcendenceEvent" maxlength="800" placeholder="L’événement déjà établi avec votre MJ" @input="angelus({transcendenceEvent:text($event)})" /></label>
  </template>
  <template v-else-if="talentId===x.recombine">
   <h4>Associer une greffe existante à un talent</h4>
   <p>Héritage recombiné ouvre un seul talent d’une autre espèce grâce à une greffe qui en reproduit l’organe. La greffe doit déjà figurer dans votre équipement ; le talent choisi reste à acheter.</p>
   <p v-if="!grafts.length" role="status">Ajoutez d’abord la greffe biologique convenue avec votre MJ dans l’étape Équipement. Aucune greffe n’est fournie par ce talent.</p>
   <template v-else>
    <label>Greffe installée<select data-extral-field="graftUid" :value="xc.recombination.graftUid" @change="graft({graftUid:text($event),architecture:''})"><option value="">— Choisir votre greffe —</option><option v-for="i in grafts" :key="i.uid" :value="i.uid">{{i.name}}</option></select></label>
    <label v-if="xc.recombination.graftUid">Talent reproduit par cette greffe<select data-extral-field="talentId" :value="xc.recombination.talentId" @change="graft({talentId:text($event),architecture:''})"><option value="">— Choisir le talent convenu —</option><option v-for="t in foreignTalents" :key="t.id" :value="t.id">{{t.name}} · {{t.cost}} PTV</option></select></label>
    <p v-if="selectedForeign" class="choice-help">{{selectedForeign.effect}}</p>
    <label v-if="selectedForeign&&xc.recombination.graftUid" class="check"><input type="checkbox" :checked="!!xc.recombination.architecture" @change="graft({architecture:($event.target as HTMLInputElement).checked?'Compatibilité de la greffe et du talent convenue avec le MJ.':''})" />La greffe reproduit bien la fonction biologique nécessaire, selon l’accord avec le MJ.</label>
   </template>
  </template>
  <template v-else-if="talentId===e.interface">
   <h4>Quelle augmentation remplace la fonction biologique ?</h4>
   <p>Interface de Vérité permet de conserver un talent racial passif malgré le remplacement de l’organe dont il dépend. Sélectionnez un implant déjà installé et le talent concerné.</p>
   <label>Implant possédé<select :value="support?.itemUid??''" @change="implant({itemUid:text($event)})"><option value="">— Choisir —</option><option v-for="i in implants" :key="i.uid" :value="i.uid">{{i.name}}</option></select></label>
   <label>Talent racial acquis<select :value="support?.passiveId??''" @change="implant({passiveId:text($event)})"><option value="">— Choisir —</option><option v-for="t in passives" :key="t.id" :value="t.id">{{t.name}}</option></select></label>
   <p v-if="!implants.length">Aucun implant dans votre équipement : ce choix restera disponible après son ajout.</p>
  </template>
  <MageTechniques v-else-if="kind" :state="state" :rules="rules" :only-kind="kind" @change="emit('change',{mageTechniques:normalizeMageTechniques($event)})" />
 </section>
</template>
<style scoped>
.guided-choice{min-width:0;padding:1rem;border:1px solid var(--border,#36536b);border-radius:.5rem;margin:.7rem 0;background:var(--surface,#0b1725);display:grid;gap:.75rem;line-height:1.55}.guided-choice h4,.guided-choice p{margin:0}.guided-choice label{display:grid;gap:.4rem;min-width:0}.guided-choice :is(select,input:not([type=checkbox])){min-height:44px;box-sizing:border-box;width:100%;min-width:0;padding:.65rem;background:var(--input-bg,#07131f);color:inherit;border:1px solid var(--border,#36536b);border-radius:.4rem;font:inherit}.choice-help{padding:.65rem;border-left:3px solid var(--accent,#a6e9ff)}.guided-choice .check{display:flex;gap:.6rem;align-items:center}.check input{flex-shrink:0;width:20px;height:20px}.guided-choice :focus-visible{outline:2px solid var(--accent,#a6e9ff);outline-offset:3px}
</style>
