<script setup lang="ts">
import {computed} from 'vue';
import type {TruthState,TruthRulesPackage} from '../../lib/truth';
import {normalizeAngelusBuild,angelusTalentIds as ids,angelusNatures,angelusSins,angelusConstructKinds,angelusPrimaryInvestment,angelusLearnedNatures,angelusUnavailableAcquisitions,type AngelusBuild,type AngelusConstruct} from '../../lib/angelus';
const props=defineProps<{state:TruthState;rules:TruthRulesPackage}>();
const emit=defineEmits<{change:[value:AngelusBuild]}>();
const config=computed(()=>normalizeAngelusBuild(props.state.choices.angelusBuild));
const investment=computed(()=>angelusPrimaryInvestment(props.rules,props.state));
const learned=computed(()=>angelusLearnedNatures(props.rules,props.state));
const unavailable=computed(()=>angelusUnavailableAcquisitions(props.rules,props.state));
const owns=(id:string)=>props.state.truthTalents.includes(id);
const yessod=computed(()=>props.state.choices.sephirah==='yessod'||owns(ids.shape)||owns(ids.construct));
function patch(value:Partial<AngelusBuild>){emit('change',normalizeAngelusBuild({...config.value,...value}));}
function text(key:keyof AngelusBuild,e:Event){patch({[key]:(e.target as HTMLInputElement).value});}
function construct(key:keyof AngelusConstruct,e:Event){patch({construct:{...config.value.construct,[key]:(e.target as HTMLInputElement).value}});}
</script>
<template>
 <section v-if="state.nature==='angelus'" class="angelus-options" aria-label="Transcendance et manifestations de l’Angelus">
  <h3>Transcendance et manifestations</h3>
  <p>Ces choix sont sauvegardés et visibles sur la fiche partagée. Ils ne valent ni accord du MJ ni activation : les pouvoirs, dépenses d’Aura et sacrifices de PV se jouent en partie.</p>
  <p v-if="unavailable.length" role="status" class="angelus-warning">Acquisitions à régulariser — dépenses conservées : {{unavailable.join(' ; ')}}.</p>
  <details data-angelus-section="cherub"><summary><strong>Transcendance chérubique</strong> · {{owns(ids.cherub)?'Acquise':'3 PTV'}} · {{investment}} / 3 PTV préalables</summary>
   <div class="angelus-form">
    <p>Investissez au moins 3 PTV dans les talents de votre Nature primaire ; les talents communs et de Sephira ne comptent pas. L’événement de Transcendance doit être convenu avec le MJ.</p>
    <label>Seconde Nature<select data-angelus-field="secondaryNature" :value="config.secondaryNature" @change="text('secondaryNature',$event)"><option value="">— Choisir —</option><option v-for="nature in angelusNatures" :key="nature.id" :value="nature.id" :disabled="nature.id===state.choices.angelNature">{{nature.name}}</option></select></label>
    <label>Événement narratif de Transcendance<textarea data-angelus-field="transcendenceEvent" :value="config.transcendenceEvent" maxlength="800" rows="3" @input="text('transcendenceEvent',$event)" /></label>
    <p>Deuxième pouvoir fondamental et ses talents ; bonus et plafond d’Aura de rang +2. Les deux paires d’ailes donnent toujours +1 Agilité au total ; aucun nouvel Archange ou Sephira.</p>
   </div>
  </details>
  <details v-if="owns(ids.liaison)" data-angelus-section="liaison"><summary><strong>Liaison céleste</strong></summary><div class="angelus-form">
   <label>Angelus connu à contacter<input data-angelus-field="liaisonContact" :value="config.liaisonContact" maxlength="400" @input="text('liaisonContact',$event)" /></label>
   <p>1 PA · 1 Aura · scène ; même monde, consentement et lien à l’Arbre requis, quelle que soit la distance. Messages volontaires uniquement ; pas de projection dans l’Arbre, de partage des sens ou de transfert d’Aura.</p>
  </div></details>
  <details v-if="learned.includes('vertu')||owns(ids.sin)" data-angelus-section="sins"><summary><strong>Les sept Péchés</strong> · {{owns(ids.sin)?'Châtiment capital acquis':'Aperçu avant achat'}}</summary><div class="angelus-form">
   <p>2 PA · 3 Aura · 1/scène ; soi ou allié consentant, pour la scène. La ressource absorbée est réellement nécessaire ; purification = retrait des avantages et des contreparties.</p>
   <label>Variante préparée<select data-angelus-field="preferredSin" :value="config.preferredSin" @change="text('preferredSin',$event)"><option value="">— Aucune préparée —</option><option v-for="sin in angelusSins" :key="sin.id" :value="sin.id">{{sin.name}}</option></select></label>
   <label v-if="config.preferredSin==='envie'">Compétence réellement observée<input data-angelus-field="observedSkill" :value="config.observedSkill" maxlength="100" @input="text('observedSkill',$event)" /></label>
   <dl class="angelus-variants"><div v-for="sin in angelusSins" :key="sin.id" :data-angelus-sin="sin.id"><dt>{{sin.name}}</dt><dd>{{sin.effect}}</dd></div></dl>
   <p>Préparer une variante ne l’active pas et ne modifie aucune Compétence permanente.</p>
  </div></details>
  <details v-if="learned.includes('domination')" data-angelus-section="blade"><summary><strong>Lame céleste — forme préparée</strong></summary><div class="angelus-form">
   <label>Forme<select data-angelus-field="bladeForm" :value="config.bladeForm" @change="text('bladeForm',$event)"><option value="melee">Arme de mêlée</option><option value="ranged">Arme de tir</option></select></label>
   <label>Sacrifice prévu<select data-angelus-field="bladeSacrifice" :value="config.bladeSacrifice" @change="patch({bladeSacrifice:Number(($event.target as HTMLSelectElement).value)})"><option :value="1">1 PV — DGT 7</option><option :value="2">2 PV — DGT 9</option><option :value="3">3 PV — DGT 11</option></select></label>
   <p>R · 1 PA · 1 Aura ; une seule Lame pour la scène. Les PV sacrifiés réduisent le maximum et restent non soignables tant que la Lame existe ; impossible de sacrifier sous 1 PV.</p>
  </div></details>
  <details v-if="yessod" data-angelus-section="construct"><summary><strong>Créations de Yessod</strong></summary><div class="angelus-form">
   <label>Idée incarnée — forme simple<textarea data-angelus-field="shapeDescription" :value="config.shapeDescription" maxlength="800" rows="2" @input="text('shapeDescription',$event)" /></label>
   <p>Idée incarnée : 1 PA · 2 Aura · 3 m maximum · charge 200 kg · 6 PV · Armure 0, pour la scène ; ancrages cohérents, aucune attaque autonome.</p>
   <fieldset><legend>Rêve rendu réel — définir avant l’achat</legend>
    <label>Nom de l’auxiliaire<input data-angelus-field="construct-name" :value="config.construct.name" maxlength="160" @input="construct('name',$event)" /></label>
    <label>Fonction unique<select data-angelus-field="construct-kind" :value="config.construct.kind" @change="construct('kind',$event)"><option value="">— Choisir —</option><option v-for="kind in angelusConstructKinds" :key="kind.id" :value="kind.id">{{kind.name}}</option></select></label>
    <label>Tâche précise<textarea data-angelus-field="construct-purpose" :value="config.construct.purpose" maxlength="1000" rows="3" @input="construct('purpose',$event)" /></label>
    <label>Conditions et limites à convenir avec le MJ<textarea data-angelus-field="construct-limits" :value="config.construct.limits" maxlength="1000" rows="3" @input="construct('limits',$event)" /></label>
    <p>2 PA · 3 Aura · 1/scène · 10 PV · Armure 3 · taille humaine · contrôle à 30 m ; un seul auxiliaire pour la scène. Ses actions consomment vos PA, avec vos Compétences ; aucun vol implicite. Porteur : charge 200 kg.</p>
   </fieldset>
  </div></details>
  <details v-if="state.choices.sephirah==='nesah'" data-angelus-section="links"><summary><strong>Liens affectifs — repère de fiche</strong></summary><div class="angelus-form"><label>Partenaire / lien réellement consenti<input data-angelus-field="heartLink" :value="config.heartLink" maxlength="400" @input="text('heartLink',$event)" /></label><p>Ce repère n’accorde ni consentement ni talent ; chaque lien conserve ses propres conditions.</p></div></details>
 </section>
</template>
<style scoped>
.angelus-options{display:grid;gap:12px;min-width:0;margin:16px 0;color:#d4e1ef;line-height:1.6}.angelus-options h3,.angelus-options p{margin:0}.angelus-options details{min-width:0;border:1px solid #36536b;border-radius:8px;background:#0d1b2d}.angelus-options summary{padding:14px;min-height:44px;cursor:pointer;overflow-wrap:anywhere}.angelus-form{display:grid;gap:14px;padding:16px;min-width:0}.angelus-form label{display:grid;gap:6px;min-width:0}.angelus-form input,.angelus-form select,.angelus-form textarea{box-sizing:border-box;width:100%;min-width:0;min-height:44px;background:#081420;color:#e3edf8;border:1px solid #36536b;border-radius:7px;padding:10px;font:inherit}.angelus-form textarea{resize:vertical}.angelus-options :focus-visible{outline:2px solid #a6e9ff;outline-offset:3px}.angelus-form fieldset{display:grid;gap:14px;min-width:0;border:1px solid #36536b;border-radius:8px;margin:0;padding:14px}.angelus-variants{display:grid;gap:12px;margin:0}.angelus-variants dt{font-weight:700}.angelus-variants dd{margin:0;overflow-wrap:anywhere}.angelus-warning{padding:12px;border:1px solid #a6e9ff;border-radius:8px}.angelus-options small{color:#afc1d5}
</style>
