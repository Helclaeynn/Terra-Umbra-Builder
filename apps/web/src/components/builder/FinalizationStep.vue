<script setup lang="ts">
import { computed } from "vue";
import { cloneJson } from "../../lib/json";

type StatusRow={id:string;label:string;ok:boolean;reason:string};
type NamedValue={id:string;name:string;value:number;raw?:number;bonus?:number};
type DerivedStats={
  pvMax:number;death:number;initiative:number;passiveDefense:number;occultDefense:number;
  movement:number;integrity:number;augmentStressMax:number;melee:number;pugilat:number;
  shooting:number;neurodive:number;
};

const props=defineProps<{
  social:Record<string,unknown>;
  reality:Record<string,unknown>;
  sphereId:string;
  sphereSupport:string;
  requiredLanguageCount:number;
  statuses:StatusRow[];
  valid:boolean;
  derived:DerivedStats;
  attributes:NamedValue[];
  skills:NamedValue[];
  identityName:string;
  originName:string;
  sphereName:string;
  styleName:string;
  realityTalentNames:string[];
  disadvantageNames:string[];
  truthNatureName:string;
  truthConsciousnessName:string;
  truthTalentNames:string[];
  truthPtvSpent:number;
  truthPtvInitial:number;
  lifestyleBase:string;
  lifestyleEffective:string;
  account:number;
  renownScore:number;
  campaignCash:number;
  equipmentCount:number;
  augmentationCount:number;
}>();

const emit=defineEmits<{
  "update:social":[value:Record<string,unknown>];
  "update:reality":[value:Record<string,unknown>];
  navigate:[id:string];
}>();

const languages=computed(()=>{
  const raw=Array.isArray(props.social.languages)
    ?props.social.languages.filter((value):value is string=>typeof value==="string")
    :[];
  return Array.from({length:props.requiredLanguageCount},(_,index)=>
    raw[index]??(index===0?"Anglais":"")
  );
});
const contactsText=computed(()=>Array.isArray(props.social.contacts)
  ?props.social.contacts.filter((value):value is string=>typeof value==="string").join("\n")
  :""
);
const reputation=computed(()=>String(props.social.reputation??""));
const renownMilieu=computed(()=>String(props.social.renownMilieu??""));
const supportDetail=computed(()=>String(props.reality.sphereSupportDetail??""));

function updateSocial(patch:Record<string,unknown>){
  emit("update:social",{...cloneJson(props.social),...patch});
}
function updateReality(patch:Record<string,unknown>){
  emit("update:reality",{...cloneJson(props.reality),...patch});
}
function setLanguage(index:number,value:string){
  const next=[...languages.value];
  next[index]=value;
  updateSocial({languages:next});
}
function setContacts(value:string){
  updateSocial({
    contacts:value.split(/\n+/).map(item=>item.trim()).filter(Boolean)
  });
}
</script>

<template>
  <article class="finish-step">
    <div class="section-heading">
      <div>
        <p class="eyebrow">11 · FINALISATION</p>
        <h2>Contrôle final de la fiche</h2>
      </div>
      <span class="schema-badge" :class="{bad:!valid}">{{ valid ? "Fiche valide" : "À corriger" }}</span>
    </div>

    <p class="builder-intro">
      La Finalisation ne crée aucune nouvelle ressource. Elle vérifie les choix précédents,
      complète les éléments sociaux obligatoires et présente les valeurs réellement utilisées en jeu.
    </p>

    <section class="final-panel">
      <div class="subsection-title">
        <div>
          <h3>Contrôle de validation</h3>
          <p>Chaque voyant reprend la logique du moteur, pas une simple présence visuelle.</p>
        </div>
      </div>
      <div class="validation-grid">
        <button
          v-for="row in statuses"
          :key="row.id"
          type="button"
          class="validation-row"
          :class="row.ok?'ok':'bad'"
          @click="emit('navigate',row.id)"
        >
          <span class="dot"></span>
          <span><strong>{{ row.label }}</strong><small>{{ row.ok ? "Validé" : row.reason }}</small></span>
        </button>
      </div>
    </section>

    <section class="final-panel">
      <div class="subsection-title">
        <div>
          <h3>Langues, contacts & réputation</h3>
          <p>
            Une langue native, puis une langue supplémentaire par point brut de Langages & Argot.
            La langue native californienne par défaut est l’anglais.
          </p>
        </div>
        <span class="schema-badge">{{ requiredLanguageCount }} langue(s)</span>
      </div>

      <div class="language-grid">
        <label v-for="(_,index) in languages" :key="index">
          {{ index===0 ? "Langue native" : `Langue supplémentaire ${index}` }}
          <input
            :value="languages[index]"
            :placeholder="index===0?'Anglais':'Espagnol, Russe, argot Underlife…'"
            @input="setLanguage(index,($event.target as HTMLInputElement).value)"
          />
        </label>
      </div>

      <div class="social-grid">
        <label>
          Contacts · un par ligne
          <textarea
            :value="contactsText"
            rows="5"
            placeholder="Nom — rôle — ce qu’il sait ou peut faire"
            @input="setContacts(($event.target as HTMLTextAreaElement).value)"
          ></textarea>
          <small v-if="sphereId==='crawler'">Un Crawler doit nommer au moins son Contact fiable de Sphère.</small>
        </label>
        <label>
          Réputation
          <textarea
            :value="reputation"
            rows="5"
            placeholder="Comment le personnage est-il perçu ?"
            @input="updateSocial({reputation:($event.target as HTMLTextAreaElement).value})"
          ></textarea>
        </label>
        <label>
          Milieu de Renommée · score {{ renownScore }}
          <input
            :value="renownMilieu"
            placeholder="Milieu, scène, réseau ou institution concernée"
            @input="updateSocial({renownMilieu:($event.target as HTMLInputElement).value})"
          />
        </label>
        <label v-if="sphereId==='corporatiste'">
          Appui de Sphère · précision
          <textarea
            :value="supportDetail"
            rows="4"
            :placeholder="sphereSupport"
            @input="updateReality({sphereSupportDetail:($event.target as HTMLTextAreaElement).value})"
          ></textarea>
          <small>Ex. logement de fonction, couverture santé, transport ou autre prestation contractuelle.</small>
        </label>
      </div>
    </section>

    <section class="final-panel">
      <div class="subsection-title">
        <div>
          <h3>Valeurs dérivées</h3>
          <p>Attributs finaux et bonus permanents de Talent déjà inclus.</p>
        </div>
      </div>
      <div class="derived-grid">
        <div><small>PV max</small><strong>{{ derived.pvMax }}</strong></div>
        <div><small>Mort</small><strong>{{ derived.death }}</strong></div>
        <div><small>Initiative</small><strong>{{ derived.initiative }}</strong></div>
        <div><small>Défense passive</small><strong>{{ derived.passiveDefense }}</strong></div>
        <div><small>Défense occulte</small><strong>{{ derived.occultDefense }}</strong></div>
        <div><small>Déplacement</small><strong>{{ derived.movement }} m</strong></div>
        <div><small>Intégrité</small><strong>{{ derived.integrity }}</strong></div>
        <div><small>Stress aug. max</small><strong>{{ derived.augmentStressMax }}</strong></div>
        <div><small>Mêlée</small><strong>{{ derived.melee }}</strong></div>
        <div><small>Pugilat</small><strong>{{ derived.pugilat }}</strong></div>
        <div><small>Tir</small><strong>{{ derived.shooting }}</strong></div>
        <div><small>Neurodive</small><strong>{{ derived.neurodive }}</strong></div>
      </div>
    </section>

    <section class="final-panel">
      <div class="subsection-title">
        <div>
          <h3>Récapitulatif</h3>
          <p>Les valeurs ci-dessous décrivent la fiche au début de la campagne.</p>
        </div>
      </div>

      <div class="recap-grid">
        <section>
          <h4>Parcours</h4>
          <p><strong>{{ identityName || "Personnage sans nom" }}</strong></p>
          <span>{{ originName || "Origine à compléter" }}</span>
          <span>{{ sphereName || "Sphère à compléter" }}</span>
          <span>{{ styleName || "Style à compléter" }}</span>
        </section>
        <section>
          <h4>Ressources</h4>
          <span>Train de vie : <strong>{{ lifestyleBase }}</strong></span>
          <span v-if="lifestyleEffective!==lifestyleBase">Après charges : <strong>{{ lifestyleEffective }}</strong></span>
          <span>Compte de création restant : <strong>{{ account.toLocaleString("fr-FR") }} $</strong></span>
          <span>Solde de campagne : <strong>{{ campaignCash.toLocaleString("fr-FR") }} $</strong></span>
          <span>Équipement : {{ equipmentCount }} · Augmentations : {{ augmentationCount }}</span>
        </section>
        <section>
          <h4>Vérité</h4>
          <span>{{ truthNatureName || "Nature" }} · {{ truthConsciousnessName || "Conscience" }}</span>
          <span>PTV de création : {{ truthPtvSpent }}/{{ truthPtvInitial }}</span>
          <span>{{ truthTalentNames.length }} Talent(s) de Vérité acheté(s)</span>
        </section>
        <section>
          <h4>Talents & Désavantages</h4>
          <span>{{ realityTalentNames.length }} Talent(s) de Réalité</span>
          <span>{{ disadvantageNames.length }} Désavantage(s)</span>
          <p v-if="realityTalentNames.length">{{ realityTalentNames.join(" · ") }}</p>
          <p v-if="disadvantageNames.length">{{ disadvantageNames.join(" · ") }}</p>
        </section>
      </div>

      <details class="values-details">
        <summary>Attributs et Compétences finales</summary>
        <div class="value-columns">
          <section>
            <h4>Attributs</h4>
            <div v-for="item in attributes" :key="item.id" class="value-row">
              <span>{{ item.name }}</span><strong>{{ item.value }}</strong>
            </div>
          </section>
          <section>
            <h4>Compétences</h4>
            <div v-for="item in skills" :key="item.id" class="value-row">
              <span>{{ item.name }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </section>
        </div>
      </details>
    </section>

    <div class="rule-note" :class="{bad:!valid}">
      <strong>{{ valid ? "Validation mécanique : aucune erreur bloquante détectée." : "La fiche n’est pas encore validée." }}</strong>
      <template v-if="!valid"> Les voyants rouges ci-dessus indiquent les blocs à corriger.</template>
    </div>
  </article>
</template>

<style scoped>
.finish-step{display:grid;gap:1rem}.final-panel{padding:1rem;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.012)}.validation-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.55rem;margin-top:1rem}.validation-row{display:grid;grid-template-columns:10px 1fr;gap:.65rem;align-items:center;padding:.7rem .8rem;border:1px solid rgba(255,255,255,.08);text-align:left;background:#100f0d;color:#bdb4a7}.validation-row>span:last-child{display:grid;gap:.15rem}.validation-row small{color:#777168}.validation-row .dot{width:8px;height:8px;border-radius:50%;background:#8a5149}.validation-row.ok{border-color:rgba(89,133,91,.28)}.validation-row.ok .dot{background:#6f9d70}.validation-row.bad{border-color:rgba(166,81,72,.28)}.language-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.75rem;margin-top:1rem}.social-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem;margin-top:1rem}.social-grid label,.language-grid label{display:grid;gap:.4rem}.social-grid small{color:#7c756c;line-height:1.4}.derived-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:.55rem;margin-top:1rem}.derived-grid>div{display:grid;gap:.2rem;padding:.7rem;border:1px solid rgba(255,255,255,.08)}.derived-grid small{color:#787168}.derived-grid strong{font-family:Georgia,serif;font-size:1.25rem}.recap-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem;margin-top:1rem}.recap-grid section{display:grid;gap:.35rem;padding:.85rem;border:1px solid rgba(255,255,255,.08)}.recap-grid h4,.value-columns h4{margin:0 0 .3rem;font-family:Georgia,serif}.recap-grid span,.recap-grid p{margin:0;color:#938c81;font-size:.78rem;line-height:1.5}.recap-grid p strong,.recap-grid span strong{color:#c9c0b2}.values-details{margin-top:1rem;border-top:1px solid rgba(255,255,255,.07);padding-top:.8rem}.values-details summary{cursor:pointer;color:#bdb4a7}.value-columns{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:.8rem}.value-row{display:flex;justify-content:space-between;gap:.75rem;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.05);color:#8f887e;font-size:.76rem}.value-row strong{color:#c7ad78}@media(max-width:760px){.social-grid,.recap-grid,.value-columns{grid-template-columns:1fr}}
</style>
