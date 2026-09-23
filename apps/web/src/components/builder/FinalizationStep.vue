<script setup lang="ts">
import { computed } from "vue";
import { cloneJson } from "../../lib/json";
import CharacterSummary from "./CharacterSummary.vue";
import type { CharacterSheet } from "../../lib/character-sheet";

type StatusRow={id:string;label:string;ok:boolean;reason:string};
const props=defineProps<{
  social:Record<string,unknown>;
  sphereId:string;
  requiredLanguageCount:number;
  statuses:StatusRow[];
  valid:boolean;
  sheet:CharacterSheet|null;
  renownScore:number;
}>();

const emit=defineEmits<{
  "update:social":[value:Record<string,unknown>];
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

function updateSocial(patch:Record<string,unknown>){
  emit("update:social",{...cloneJson(props.social),...patch});
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

    <section class="final-panel final-social-panel">
      <div class="final-intro-box">
        <strong>Derniers repères de personnage</strong>
        <span>
          La Finalisation ne redemande plus les éléments économiques gérés dans Équipement.
          Ici restent seulement les informations sociales et linguistiques nécessaires pour jouer la fiche.
        </span>
      </div>

      <div class="subsection-title">
        <div>
          <h3>Renommée, langues & relations</h3>
          <p>Précisez les derniers ancrages concrets du personnage dans le monde.</p>
        </div>
      </div>

      <div class="final-top-fields">
        <label>
          Milieu de Renommée · score {{ renownScore }}
          <small>La Renommée n’est jamais universelle : indiquez le milieu où le nom du personnage circule réellement.</small>
          <input
            :value="renownMilieu"
            placeholder="Underlife de Los Angeles, sécurité corporatiste…"
            @input="updateSocial({renownMilieu:($event.target as HTMLInputElement).value})"
          />
        </label>
        <label>
          Réputation importante
          <small>Ce que les autres racontent du personnage ; un repère fictionnel, pas un bonus automatique.</small>
          <input
            :value="reputation"
            placeholder="Fiable sous pression, brutal mais loyal…"
            @input="updateSocial({reputation:($event.target as HTMLInputElement).value})"
          />
        </label>
      </div>

      <div class="final-lore-box">
        <strong>Langues</strong>
        <span>
          Chaque personnage possède une langue native. <em>Langages & Argot</em> ajoute ensuite
          une langue connue par point brut : renseignez <strong>{{ requiredLanguageCount }}</strong> langue(s).
        </span>
      </div>

      <div class="language-grid">
        <label v-for="(_,index) in languages" :key="index">
          {{ index===0 ? "Langue native" : `Langue supplémentaire ${index}` }}
          <small>Une langue réellement pratiquée par le personnage.</small>
          <input
            :value="languages[index]"
            :placeholder="index===0?'Anglais':'Espagnol, Russe, argot Underlife…'"
            @input="setLanguage(index,($event.target as HTMLInputElement).value)"
          />
        </label>
      </div>

      <div class="final-relations-grid">
        <label>
          Contacts · un par ligne
          <small>Qui il est, ce qu’il peut faire ou savoir, et le lien qui l’unit au personnage.</small>
          <textarea
            :value="contactsText"
            rows="5"
            placeholder="Nom — rôle — ce qu’il sait / peut faire — Fiable / de Renom si pertinent"
            @input="setContacts(($event.target as HTMLTextAreaElement).value)"
          ></textarea>
          <small v-if="sphereId==='crawler'">Un Crawler doit nommer au moins son Contact fiable de Sphère.</small>
        </label>
        <div v-if="sphereId==='corporatiste'" class="support-reminder">
          <strong>Appui Corporatiste</strong>
          <span>
            La prestation contractuelle est choisie, chiffrée et validée directement dans Équipement.
            La Finalisation ne la redemande pas.
          </span>
        </div>
      </div>
    </section>

    <CharacterSummary v-if="sheet" :sheet="sheet" class="final-panel final-sheet" />
    <p v-else class="rule-note" role="status">La fiche récapitulative sera disponible une fois les catalogues chargés.</p>

    <div class="rule-note" :class="{bad:!valid}">
      <strong>{{ valid ? "Validation mécanique : aucune erreur bloquante détectée." : "La fiche n’est pas encore validée." }}</strong>
      <template v-if="!valid"> Les voyants rouges ci-dessus indiquent les blocs à corriger.</template>
    </div>
  </article>
</template>

<style scoped>

.finish-step{display:grid;gap:1rem}

.final-panel{padding:1rem;border:1px solid #2b3b51;border-radius:10px;background:rgba(255,255,255,.012)}

.validation-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:.55rem;margin-top:1rem}

.validation-row{display:grid;grid-template-columns:12px 1fr;gap:.7rem;align-items:center;padding:.72rem .82rem;border:1px solid #2b3b51;border-radius:9px;text-align:left;background:#0b1524;color:#c3d2e4}

.validation-row>span:last-child{display:grid;gap:.15rem}
.validation-row small{color:#a1b5cc;font-size:.875rem}
.validation-row .dot{width:10px;height:10px;border-radius:50%;background:#8a5149}
.validation-row.ok{border-color:rgba(89,133,91,.28)}
.validation-row.ok .dot{background:#6f9d70}
.validation-row.bad{border-color:rgba(166,81,72,.28)}

.final-intro-box,.final-lore-box{display:grid;gap:.3rem;margin:.15rem 0 1rem;padding:.8rem .9rem;border:1px solid #2b3b51;border-radius:9px;background:rgba(255,255,255,.02)}

.final-intro-box span,.final-lore-box span,.final-top-fields small,.final-relations-grid small,.language-grid small{color:#a1b5cc;font-size:.875rem;line-height:1.5}

.final-top-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.85rem;margin-top:1rem}

.final-top-fields label,.language-grid label,.final-relations-grid label{display:grid;gap:.4rem}

.language-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:.8rem;margin:1rem 0 1.5rem}

.language-grid label{flex:0 1 calc(33.333% - .55rem);min-width:220px}

.final-relations-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.65fr);gap:.85rem;align-items:stretch}

.support-reminder{display:grid;align-content:start;gap:.4rem;padding:.85rem;border:1px solid rgba(100,222,245,.16);border-radius:9px;background:rgba(100,222,245,.025);color:#b3c5d9;font-size:.875rem;line-height:1.5}

.support-reminder strong{color:#edf4ff}






@media(max-width:980px){
.language-grid label{flex-basis:calc(50% - .4rem)}
}

@media(max-width:760px){.final-top-fields,.final-relations-grid{grid-template-columns:1fr}
}

@media(max-width:620px){.language-grid label{flex-basis:100%;min-width:0}
}

:where(.section-heading,.subsection-title){display:flex;justify-content:space-between;align-items:flex-start;gap:18px}
.subsection-title h3{margin:0;font-size:18px;line-height:1.4;letter-spacing:-.02em}
.subsection-title p{margin:8px 0 0;color:#b3c5d9;font-size:14px;line-height:1.65;max-width:78ch}
.builder-intro{margin:0;color:#b3c5d9;font-size:15px;line-height:1.7;max-width:85ch}
.schema-badge{padding:6px 10px;border:1px solid #344a62;border-radius:6px;white-space:nowrap;color:#9eeafd;background:#14263a;font-size:12px}
.schema-badge.bad{border-color:#794850;color:#f0bdc0;background:#241820}
.rule-note{padding:16px;border:1px solid #344a62;border-radius:8px;color:#c3d6e8;background:#122337;font-size:14px;line-height:1.65}
.rule-note.bad{border-color:#794850;color:#f0bdc0;background:#241820}
:is(input,select,textarea){min-width:0;min-height:44px;border-radius:6px;font:inherit}
button{min-height:44px;border-radius:6px;font-size:14px}
label{font-size:14px;line-height:1.5}
@media(max-width:620px){.section-heading,.subsection-title{flex-wrap:wrap}.section-heading .schema-badge{align-self:flex-start}}

.finish-step{gap:24px;color:#edf4ff;font-family:Inter,"Segoe UI",sans-serif}
.final-panel{padding:22px;background:#0e1b2d;border-radius:8px}
.validation-grid{grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px}
.validation-row{min-height:68px;padding:14px;border-radius:6px;line-height:1.4}
.validation-row small{font-size:13px;color:#a1b5cc;line-height:1.5}
.validation-row.ok{border-color:#36596b;background:#102738}
.validation-row.ok .dot{background:#64def5}
.validation-row.bad{border-color:#794850;background:#241820}
.validation-row.bad .dot{background:#f2aab6}
.final-intro-box,.final-lore-box{padding:18px;gap:8px;background:#121f32;border-radius:8px}
.final-intro-box span,.final-lore-box span{line-height:1.65}
.final-top-fields,.final-relations-grid{gap:20px}
.language-grid{justify-content:flex-start;gap:16px}
.support-reminder{padding:18px;background:#102738;border-color:#36596b;border-radius:8px;line-height:1.65}
@media(max-width:620px){.final-panel{padding:16px}.language-grid label{min-width:0}}
</style>
