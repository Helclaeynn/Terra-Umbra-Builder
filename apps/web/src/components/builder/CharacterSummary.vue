<script setup lang="ts">
import { computed } from "vue";
import type { CharacterSheet, SheetEntry } from "../../lib/character-sheet";
import { sortedNames } from "../../lib/catalog-order";
import BuilderWikiLink from "./BuilderWikiLink.vue";

const props=defineProps<{ sheet:CharacterSheet }>();
const metrics=computed(()=>[
  {id:"pvMax",label:"PV maximum",value:props.sheet.derived.pvMax},
  {id:"passiveDefense",label:"Défense passive",value:props.sheet.derived.passiveDefense},
  {id:"occultDefense",label:"Défense occulte",value:props.sheet.derived.occultDefense},
  {id:"initiative",label:"Initiative",value:props.sheet.derived.initiative,suffix:"+ 1d10e"},
  {id:"movement",label:"Déplacement",value:props.sheet.derived.movement,suffix:"m / PA"},
  {id:"integrity",label:"Intégrité",value:props.sheet.derived.integrity}
]);
const rolls=computed(()=>[
  ["Mêlée",props.sheet.derived.melee],["Pugilat",props.sheet.derived.pugilat],
  ["Tir",props.sheet.derived.shooting],["Neurodive",props.sheet.derived.neurodive]
]);
const skillGroups=computed(()=>props.sheet.attributes.map(attribute=>({
  ...attribute, skills:props.sheet.skills.filter(skill=>skill.attribute===attribute.id)
})));
const lists=computed<Array<{id:string;title:string;items:SheetEntry[]}>>(()=>[
  {id:"reality",title:"Talents de Réalité",items:sortedNames(props.sheet.realityTalents)},
  {id:"truth",title:"Talents de Vérité et Fléaux",items:sortedNames(props.sheet.truthTalents)},
  {id:"disadvantages",title:"Désavantages",items:props.sheet.disadvantages},
  {id:"inventory",title:"Équipement et augmentations",items:props.sheet.inventory}
]);
const biography=computed(()=>[
  ["Âge",props.sheet.identity.age],["Sexe",props.sheet.identity.sex],
  ["Taille",props.sheet.identity.height],["Poids",props.sheet.identity.weight]
].filter(([,value])=>value));
const money=(value:number)=>`${value.toLocaleString("fr-FR")} $`;
</script>

<template>
  <section class="character-sheet" aria-label="Fiche du personnage" :data-mode="sheet.mode">
    <header class="sheet-header">
      <img v-if="sheet.identity.portraitDataUrl" :src="sheet.identity.portraitDataUrl" :alt="`Portrait de ${sheet.name}`" class="sheet-portrait" />
      <div class="sheet-identity">
        <p class="sheet-eyebrow">FICHE DU PERSONNAGE · {{ sheet.mode==='campaign' ? 'CAMPAGNE' : 'CRÉATION' }}</p>
        <h2>{{ sheet.name || 'Personnage sans nom' }}</h2>
        <p v-if="sheet.identity.alias" class="sheet-alias">« {{ sheet.identity.alias }} »</p>
        <p v-if="sheet.identity.occupation">{{ sheet.identity.occupation }}</p>
        <div class="sheet-tags">
          <span v-for="(value,index) in [sheet.origin,sheet.sphere,sheet.style].filter(Boolean)" :key="index">{{ value }}</span>
        </div>
      </div>
    </header>
    <p class="sheet-context">{{ sheet.mode==='campaign' ? 'Valeurs actuelles, avec les gains de progression.' : 'Valeurs de création, avant les gains de progression.' }} Bonus permanents inclus ; effets temporaires et de Révélation à appliquer selon leurs conditions.</p>

    <section aria-label="Valeurs essentielles" class="sheet-metrics">
      <div v-for="metric in metrics" :key="metric.id" :data-stat="metric.id">
        <span>{{ metric.label }}</span><strong>{{ metric.value }}</strong><small v-if="metric.suffix">{{ metric.suffix }}</small>
      </div>
    </section>
    <div class="sheet-secondary-stats">
      <span>Seuil de mort <strong>{{ sheet.derived.death }}</strong></span>
      <span>Stress augmentique maximum <strong>{{ sheet.derived.augmentStressMax }}</strong></span>
    </div>

    <section aria-label="Attributs" class="sheet-attributes">
      <div v-for="item in sheet.attributes" :key="item.id" :data-attribute="item.id">
        <span>{{ item.name }}</span><strong>{{ item.value }}</strong>
        <small v-if="item.base!==undefined && item.base!==item.value">{{ item.base }} à la création</small>
      </div>
    </section>

    <section class="sheet-rolls" aria-label="Jets rapides">
      <h3>Jets rapides</h3>
      <div><span v-for="[label,value] in rolls" :key="label">{{ label }} <strong>{{ value }} + 1d10e</strong></span></div>
      <p>Les attaques et actions restent soumises à leurs conditions et à l’équipement disponible.</p>
    </section>

    <section class="sheet-resources" aria-label="Ressources">
      <h3>Ressources</h3>
      <dl>
        <div><dt>Edge de création restant</dt><dd>{{ sheet.edge }}</dd></div>
        <div v-if="sheet.mode==='campaign'"><dt>XP disponibles</dt><dd :class="{negative:sheet.xpRemaining<0}">{{ sheet.xpRemaining }}</dd></div>
        <div><dt>PTV disponibles</dt><dd :class="{negative:sheet.ptvRemaining<0}">{{ sheet.ptvRemaining }}</dd></div>
        <div><dt>{{ sheet.mode==='campaign' ? 'Solde de campagne' : 'Compte de création restant' }}</dt><dd>{{ money(sheet.mode==='campaign' ? sheet.cash : sheet.account) }}</dd></div>
        <div><dt>Train de vie effectif</dt><dd>{{ sheet.lifestyle }}</dd></div>
        <div v-if="sheet.lifestyle!==sheet.lifestyleBase"><dt>Train de vie de base</dt><dd>{{ sheet.lifestyleBase }}</dd></div>
        <div><dt>Renommée</dt><dd>{{ sheet.renown }}<span v-if="sheet.renownMilieu"> · {{ sheet.renownMilieu }}</span></dd></div>
      </dl>
    </section>

    <details class="sheet-details" open>
      <summary>Compétences <span>{{ sheet.skills.length }}</span></summary>
      <p class="sheet-hint">Le total inclut les bonus permanents de Talents. Le rang brut reste indiqué séparément.</p>
      <div class="sheet-skill-groups">
        <section v-for="group in skillGroups" :key="group.id">
          <h3>{{ group.name }}</h3>
          <dl>
            <div v-for="skill in group.skills" :key="skill.id" :data-skill="skill.id">
              <dt>{{ skill.name }}<small>Brut {{ skill.raw }}<template v-if="skill.bonus"> · bonus {{ skill.bonus }}</template></small></dt>
              <dd>{{ skill.value }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </details>

    <section class="sheet-truth" aria-label="Vérité du personnage">
      <div><p class="sheet-eyebrow">VÉRITÉ</p><h3>{{ sheet.truthNature || 'Nature à choisir' }}</h3><p>{{ sheet.truthConsciousness || 'Conscience à préciser' }}</p></div>
      <div v-if="sheet.corruption"><strong>Corruption {{ sheet.corruption }} / {{ sheet.derived.integrity }}</strong><p>{{ sheet.corruptionSource }}</p></div>
    </section>

    <details v-for="list in lists" :key="list.id" class="sheet-details" :data-list="list.id">
      <summary>{{ list.title }} <span>{{ list.items.length }}</span></summary>
      <p v-if="!list.items.length" class="sheet-hint">Aucun élément enregistré.</p>
      <ul v-else class="sheet-entries">
        <li v-for="item in list.items" :key="item.id">
          <div><BuilderWikiLink v-if="item.compendiumId && list.id!=='reality' && list.id!=='truth'" :label="item.name" :article-id="item.compendiumId" compact>{{ item.name }}</BuilderWikiLink><strong v-else>{{ item.name }}</strong><small v-if="item.group">{{ item.group }}</small></div>
          <p v-if="item.lore" class="sheet-entry-lore">{{ item.lore }}</p><p v-if="item.detail">{{ item.detail }}</p>
        </li>
      </ul>
    </details>

    <details class="sheet-details" :open="Boolean(sheet.identity.concept)">
      <summary>Identité et repères personnels</summary>
      <dl class="sheet-biography"><div v-for="[label,value] in biography" :key="label"><dt>{{ label }}</dt><dd>{{ value }}</dd></div></dl>
      <section v-if="sheet.identity.concept"><h3>Concept</h3><p class="sheet-prose">{{ sheet.identity.concept }}</p></section>
      <section v-if="sheet.identity.objective"><h3>Objectif</h3><p class="sheet-prose">{{ sheet.identity.objective }}</p></section>
      <section><h3>Langues</h3><p>{{ sheet.languages.join(' · ') || 'À renseigner dans Finalisation' }}</p></section>
      <section v-if="sheet.contacts.length"><h3>Contacts</h3><ul><li v-for="(contact,index) in sheet.contacts" :key="index">{{ contact }}</li></ul></section>
      <section v-if="sheet.reputation"><h3>Réputation</h3><p class="sheet-prose">{{ sheet.reputation }}</p></section>
      <section v-if="sheet.identity.notes"><h3>Notes</h3><p class="sheet-prose">{{ sheet.identity.notes }}</p></section>
    </details>
  </section>
</template>

<style scoped>
.character-sheet{color:#e8f1fc;font:15px/1.6 Inter,"Segoe UI",sans-serif;min-width:0;display:grid;gap:24px}
.character-sheet *{box-sizing:border-box;min-width:0}
.character-sheet h2,.character-sheet h3,.character-sheet p{margin:0}
.character-sheet h3{font-size:17px;line-height:1.4;letter-spacing:-.015em}
.sheet-header{display:flex;align-items:center;gap:24px;padding-bottom:24px;border-bottom:1px solid #30485d}
.sheet-portrait{width:104px;height:128px;object-fit:cover;border:1px solid #3b586e;border-radius:8px}
.sheet-identity{overflow-wrap:anywhere}
.sheet-identity h2{font-size:clamp(25px,3vw,36px);line-height:1.2;margin:8px 0;font-weight:650;letter-spacing:-.025em}
.sheet-eyebrow{color:#93dfef;font-size:11px;letter-spacing:.14em;font-weight:600}
.sheet-alias{color:#b7a6e6}.sheet-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.sheet-tags span{padding:4px 9px;background:#14293a;border:1px solid #30485d;border-radius:4px;color:#c0d5e7;font-size:13px}
.sheet-context,.sheet-hint{color:#aabfd1;font-size:13px}
.sheet-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.sheet-metrics>div{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 8px;padding:18px;border:1px solid #36536a;border-radius:6px;background:linear-gradient(130deg,#142b3d,#101c2e)}
.sheet-metrics span{flex-basis:100%;color:#bbd0e1;font-size:13px}.sheet-metrics strong{font-size:30px;line-height:1.4;color:#a3ecfa;font-weight:600}.sheet-metrics small{color:#bfd6e5;font-size:13px}
.sheet-secondary-stats{display:flex;flex-wrap:wrap;gap:12px 28px;color:#aec4d7;font-size:14px}.sheet-secondary-stats strong{margin-left:8px;color:#e8f1fc}
.sheet-attributes{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}.sheet-attributes>div{display:grid;align-content:start;text-align:center;padding:14px 8px;border:1px solid #30485d;border-radius:6px;background:#111e31}.sheet-attributes span{font-size:13px}.sheet-attributes strong{font-size:25px;color:#e8f1fc}.sheet-attributes small{font-size:11px;color:#a5bed2}
.sheet-rolls>div{display:flex;flex-wrap:wrap;gap:12px 24px;margin:12px 0}.sheet-rolls span{display:grid;gap:4px;color:#b0c7d9}.sheet-rolls strong{color:#e8f1fc}.sheet-rolls p{color:#a5bed2;font-size:13px}
.character-sheet dl{margin:12px 0 0}.character-sheet dl>div{display:flex;justify-content:space-between;align-items:baseline;gap:16px;padding:10px 0;border-bottom:1px solid #243b4e}.character-sheet dt{color:#b7cddd}.character-sheet dd{margin:0;text-align:right;color:#edf4ff;font-weight:600;overflow-wrap:anywhere}.character-sheet dd.negative{color:#ffb7c3}
.sheet-resources dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 28px}
.sheet-details{border:1px solid #30485d;border-radius:6px;padding:0 20px;background:#0d1a2b}
.sheet-details>summary{min-height:60px;padding:16px 0;cursor:pointer;font-size:16px;font-weight:600;overflow-wrap:anywhere}.sheet-details>summary span{font-size:12px;margin-left:10px;color:#91dceb;border:1px solid #36536a;border-radius:4px;padding:3px 7px}
.sheet-details[open]{padding-bottom:20px}.sheet-details[open]>summary{margin-bottom:12px;border-bottom:1px solid #30485d}
.sheet-details>section+section{margin-top:20px}.sheet-details>section h3{margin-bottom:8px}
.sheet-skill-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;margin-top:18px}.sheet-skill-groups h3{color:#9ce5f4;font-size:14px}.sheet-skill-groups dt small{display:block;font-size:12px;color:#95aec4}.sheet-skill-groups dd{font-size:20px}
.sheet-truth{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;border-left:3px solid #a38cdb;padding:18px 20px;background:#171d32}.sheet-truth h3{margin:6px 0}.sheet-truth p{color:#bfbedb}
.sheet-entries{margin:0;padding:0;list-style:none}.sheet-entries li+li{border-top:1px solid #283f53;margin-top:16px;padding-top:16px}.sheet-entries small{display:block;color:#9bb4ca;font-size:12px}.sheet-entries p{margin:8px 0 0;color:#b8cada;white-space:pre-line;font-size:14px}.sheet-prose{white-space:pre-wrap;overflow-wrap:anywhere}
.sheet-biography{display:flex;flex-wrap:wrap;gap:12px 24px;margin-bottom:20px!important}
.character-sheet :is(summary,a):focus-visible{outline:2px solid #9ce5f4;outline-offset:4px}
@media(max-width:650px){.character-sheet{gap:20px}.sheet-header{gap:16px;align-items:flex-start}.sheet-portrait{width:72px;height:92px}.sheet-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.sheet-metrics>div{padding:12px}.sheet-attributes{grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}.sheet-skill-groups,.sheet-resources dl{grid-template-columns:1fr}.sheet-details{padding:0 14px}.sheet-identity h2{font-size:25px}.sheet-eyebrow{font-size:10px}.character-sheet dl>div{gap:12px}}

.sheet-attributes>div{grid-column:span 2;padding:18px 12px}.sheet-attributes>div:nth-child(4){grid-column:2 / span 2}.sheet-attributes>div:nth-child(5){grid-column:4 / span 2}
.sheet-attributes strong{font-size:30px;color:#a3ecfa}.sheet-attributes span{font-size:14px;color:#d6e7f3}
.sheet-skill-groups{grid-template-columns:repeat(6,minmax(0,1fr))}.sheet-skill-groups>section{grid-column:span 2;padding:16px;background:#122337;border:1px solid #30485d;border-radius:6px}.sheet-skill-groups>section:nth-child(4){grid-column:2 / span 2}.sheet-skill-groups>section:nth-child(5){grid-column:4 / span 2}
.sheet-entries .sheet-entry-lore{color:#bdc4e0;font-style:italic}
@media(max-width:900px){.sheet-skill-groups{grid-template-columns:1fr}.sheet-skill-groups>section:nth-child(n){grid-column:auto}}
@media(max-width:650px){.sheet-attributes>div{padding:12px 6px}.sheet-attributes span{font-size:12px}}
</style>
