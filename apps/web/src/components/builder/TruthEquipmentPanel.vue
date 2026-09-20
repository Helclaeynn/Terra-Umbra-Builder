<script setup lang="ts">
import { computed, ref } from "vue";
import BuilderWikiLink from "./BuilderWikiLink.vue";
import {
  truthEquipmentAccess,
  truthEquipmentVisible,
  type TruthEquipmentItem,
  type TruthRulesPackage,
  type TruthState
} from "../../lib/truth";

const props=defineProps<{
  modelValue:TruthState;
  rules:TruthRulesPackage;
}>();

const emit=defineEmits<{
  "update:modelValue":[value:TruthState];
}>();

const query=ref("");
const chapter=ref("");

const chapterLabels:Record<string,string>={
  "22":"Propriétés communes",
  "23":"Équipement de Chasse",
  "24":"Marché des Exilés",
  "25":"Marché xéno",
  "26":"Arsenal AIDH",
  "27":"Calamitechnologie"
};

function norm(value:string){
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("fr");
}

const itemMap=computed(()=>new Map(props.rules.equipment.map(item=>[item.id,item])));
const owned=computed(()=>props.modelValue.truthEquipment??[]);
const ownedItems=computed(()=>owned.value.map(id=>itemMap.value.get(id)).filter((item):item is TruthEquipmentItem=>!!item));
const inaccessibleOwned=computed(()=>ownedItems.value.filter(item=>!truthEquipmentAccess(item,props.modelValue).ok));
const visibleCatalog=computed(()=>props.rules.equipment.filter(item=>truthEquipmentVisible(item,props.modelValue)));

const chapters=computed(()=>[...new Set(visibleCatalog.value.map(item=>item.chapter))]
  .sort((a,b)=>Number(a)-Number(b))
  .map(id=>({id,label:chapterLabels[id]??`Chapitre ${id}`})));

const filtered=computed(()=>{
  const q=norm(query.value.trim());
  return visibleCatalog.value.filter(item=>{
    if(chapter.value&&item.chapter!==chapter.value)return false;
    if(!q)return true;
    const haystack=[
      item.name,item.section,item.status,item.sourceKind,item.lore,
      ...item.tags,
      ...item.properties.flatMap(property=>[property.label,property.value])
    ].join(" ");
    return norm(haystack).includes(q);
  });
});

const groups=computed(()=>{
  const map=new Map<string,TruthEquipmentItem[]>();
  for(const item of filtered.value){
    const label=item.section||chapterLabels[item.chapter]||`Chapitre ${item.chapter}`;
    if(!map.has(label))map.set(label,[]);
    map.get(label)!.push(item);
  }
  return [...map.entries()]
    .map(([label,items])=>({label,items:items.sort((a,b)=>a.name.localeCompare(b.name,"fr"))}))
    .sort((a,b)=>a.label.localeCompare(b.label,"fr"));
});

function update(mutator:(next:TruthState)=>void){
  const next=structuredClone(props.modelValue);
  next.truthEquipment=Array.isArray(next.truthEquipment)?next.truthEquipment:[];
  next.truthEquipmentMjOverride=Boolean(next.truthEquipmentMjOverride);
  mutator(next);
  emit("update:modelValue",next);
}

function setMjOverride(value:boolean){
  update(next=>{next.truthEquipmentMjOverride=value;});
}

function access(item:TruthEquipmentItem){
  return truthEquipmentAccess(item,props.modelValue);
}

function canAdd(item:TruthEquipmentItem){
  if(item.referenceOnly)return false;
  if(!access(item).ok)return false;
  return !owned.value.includes(item.id);
}

function add(item:TruthEquipmentItem){
  if(!canAdd(item))return;
  update(next=>{next.truthEquipment=[...new Set([...next.truthEquipment,item.id])];});
}

function remove(id:string){
  update(next=>{next.truthEquipment=next.truthEquipment.filter(itemId=>itemId!==id);});
}

function statusLabel(item:TruthEquipmentItem){
  if(item.referenceOnly)return "Référence / règle";
  const result=access(item);
  if(!result.ok)return "Hors filière — MJ requis";
  if(!result.natural)return "Autorisation MJ exceptionnelle";
  return result.reason||item.status||"Acquisition fictionnelle";
}

function propertyPreview(item:TruthEquipmentItem){
  return item.properties.slice(0,4);
}
</script>

<template>
  <section class="truth-equipment-panel">
    <div class="subsection-title">
      <div>
        <h3>Objets de Vérité</h3>
        <p>
          Le catalogue décrit ce qui existe. Un réseau ouvre une voie d’accès mais ne crée jamais
          la marchandise ; posséder un objet ne donne ni PTV ni Talent.
        </p>
      </div>
      <span class="schema-badge">{{ ownedItems.length }} possédé(s)</span>
    </div>

    <div v-if="ownedItems.length" class="truth-equipment-owned">
      <article v-for="item in ownedItems" :key="item.id" class="truth-equipment-owned-row">
        <div>
          <strong>
            <BuilderWikiLink
              :label="item.name"
              :article-id="item.compendiumId"
              category="Équipement & Objets"
              :detail="item.lore"
              :badges="[chapterLabels[item.chapter] || ('Chapitre '+item.chapter),item.section].filter(Boolean)"
              compact
            />
          </strong>
          <span>{{ item.section || chapterLabels[item.chapter] }} · {{ statusLabel(item) }}</span>
        </div>
        <button class="ghost danger compact" type="button" @click="remove(item.id)">Retirer</button>
      </article>
    </div>
    <div v-else class="empty-line">Aucun objet de Vérité enregistré comme possession.</div>

    <div v-if="inaccessibleOwned.length" class="rule-note bad">
      <strong>Accès à régulariser :</strong>
      {{ inaccessibleOwned.map(item=>item.name).join(" · ") }}.
      Ces objets restent enregistrés pour ne perdre aucune donnée, mais la filière actuelle ne les autorise pas sans accord MJ.
    </div>

    <details class="truth-equipment-catalog">
      <summary class="truth-disclosure-summary">
        <span>
          <strong>Catalogue de Vérité</strong>
          <small>{{ visibleCatalog.length }} accessibles · 229 entrées source · Livre V</small>
        </span>
        <span class="schema-badge">{{ filtered.length }}</span>
      </summary>

      <div class="truth-equipment-toolbar">
        <label>
          Rechercher
          <input v-model="query" type="search" placeholder="Nom, marché, propriété, effet…" />
        </label>
        <label>
          Chapitre
          <select v-model="chapter">
            <option value="">Tous les chapitres</option>
            <option v-for="entry in chapters" :key="entry.id" :value="entry.id">
              {{ entry.id }} · {{ entry.label }}
            </option>
          </select>
        </label>
      </div>

      <label class="truth-equipment-mj">
        <input
          type="checkbox"
          :checked="modelValue.truthEquipmentMjOverride"
          @change="setMjOverride(($event.target as HTMLInputElement).checked)"
        />
        <span>
          <strong>Autorisation MJ d’accès exceptionnel aux objets de Vérité</strong>
          <small>
            Ouvre les filières qui ne correspondent pas naturellement au personnage ainsi que les objets uniques,
            hors catalogue et corrompus. Aucun objet n’est accordé automatiquement.
          </small>
        </span>
      </label>

      <div class="rule-note">
        <strong>Acquisition fictionnelle :</strong>
        le Builder mémorise la possession, mais ne paie automatiquement ni PTV ni argent.
        Les entrées de référence restent consultables sans pouvoir être ajoutées. Les marchés d’Aèr, xéno, AIDH,
        de Chasse et corrompus ne sont affichés que si la Nature, la voie ou l’autorisation MJ de la fiche y donne réellement accès.
      </div>

      <details v-for="group in groups" :key="group.label" class="truth-equipment-group">
        <summary>
          <span>{{ group.label }}</span>
          <span class="schema-badge">{{ group.items.length }}</span>
        </summary>
        <div class="truth-equipment-grid">
          <article v-for="item in group.items" :key="item.id" class="truth-equipment-card">
            <div class="truth-equipment-card-head">
              <div>
                <strong>
                  <BuilderWikiLink
                    :label="item.name"
                    :article-id="item.compendiumId"
                    category="Équipement & Objets"
                    :detail="item.lore"
                    :badges="[chapterLabels[item.chapter] || ('Chapitre '+item.chapter),item.section,statusLabel(item)].filter(Boolean)"
                    compact
                  />
                </strong>
                <small>{{ statusLabel(item) }}</small>
              </div>
              <button
                class="secondary compact"
                type="button"
                :disabled="!canAdd(item)"
                @click="add(item)"
              >
                {{ owned.includes(item.id) ? "Possédé" : item.referenceOnly ? "Référence" : !access(item).ok ? "MJ requis" : "Ajouter" }}
              </button>
            </div>

            <p v-if="item.lore">{{ item.lore }}</p>

            <div v-if="propertyPreview(item).length" class="truth-equipment-properties">
              <span v-for="property in propertyPreview(item)" :key="property.label">
                <strong>{{ property.label }}</strong> {{ property.value }}
              </span>
            </div>

            <details v-if="item.properties.length>4" class="truth-equipment-details">
              <summary>Toutes les propriétés ({{ item.properties.length }})</summary>
              <dl>
                <template v-for="property in item.properties" :key="property.label">
                  <dt>{{ property.label }}</dt>
                  <dd>{{ property.value }}</dd>
                </template>
              </dl>
            </details>
          </article>
        </div>
      </details>
    </details>
  </section>
</template>

<style scoped>
.truth-equipment-panel{margin-top:24px;border-top:1px solid var(--line);padding-top:22px}
.truth-equipment-owned{display:grid;gap:8px;margin:14px 0}
.truth-equipment-owned-row{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:12px 14px;border:1px solid var(--line);border-radius:12px}
.truth-equipment-owned-row div{display:grid;gap:4px}
.truth-equipment-owned-row span{font-size:12px;color:var(--muted)}
.truth-equipment-catalog{margin-top:16px}
.truth-equipment-toolbar{display:grid;grid-template-columns:minmax(0,2fr) minmax(180px,1fr);gap:12px;margin:16px 0}
.truth-equipment-toolbar label{display:grid;gap:6px}
.truth-equipment-mj{display:flex;gap:10px;align-items:flex-start;margin:12px 0;padding:12px;border:1px solid var(--line);border-radius:12px}
.truth-equipment-mj span{display:grid;gap:3px}
.truth-equipment-mj small{color:var(--muted)}
.truth-equipment-group{margin-top:12px;border:1px solid var(--line);border-radius:12px;padding:0 12px}
.truth-equipment-group>summary{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;cursor:pointer;font-weight:700}
.truth-equipment-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px;padding-bottom:12px}
.truth-equipment-card{padding:12px;border:1px solid var(--line);border-radius:12px;display:grid;gap:10px;align-content:start}
.truth-equipment-card-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.truth-equipment-card-head>div{display:grid;gap:3px}
.truth-equipment-card-head small{color:var(--muted)}
.truth-equipment-card p{margin:0;font-size:13px;line-height:1.45}
.truth-equipment-properties{display:grid;gap:5px;font-size:12px}
.truth-equipment-properties span{padding:5px 7px;border-radius:8px;background:var(--panel-soft)}
.truth-equipment-details summary{cursor:pointer;font-size:12px;color:var(--muted)}
.truth-equipment-details dl{display:grid;grid-template-columns:minmax(90px,.6fr) minmax(0,1.4fr);gap:5px 10px;margin:10px 0 0;font-size:12px}
.truth-equipment-details dt{font-weight:700}
.truth-equipment-details dd{margin:0}
@media(max-width:720px){
  .truth-equipment-toolbar{grid-template-columns:1fr}
  .truth-equipment-owned-row,.truth-equipment-card-head{align-items:stretch;flex-direction:column}
}
</style>
