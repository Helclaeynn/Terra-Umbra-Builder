<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { cloneJson } from "../../lib/json";
import BuilderWikiLink from "./BuilderWikiLink.vue";
import BuilderCatalogImage from './BuilderCatalogImage.vue';
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
const family=ref("");
const catalogMode=ref("objects");

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

const modeCatalog=computed(()=>{
  if(catalogMode.value==='owned')return ownedItems.value;
  return visibleCatalog.value.filter(item=>catalogMode.value==='references' ? item.referenceOnly : !item.referenceOnly);
});
const chapters=computed(()=>[...new Set(modeCatalog.value.map(item=>item.chapter))]
  .sort((a,b)=>Number(a)-Number(b))
  .map(id=>({id,label:chapterLabels[id]??`Chapitre ${id}`})));

watch(chapters,(available)=>{
  if(chapter.value&&!available.some(entry=>entry.id===chapter.value))chapter.value="";
});

const filtered=computed(()=>{
  const q=norm(query.value.trim());
  return modeCatalog.value.filter(item=>{
    if(catalogMode.value!=='owned'&&!chapter.value&&!family.value&&!q)return false;
    if(chapter.value&&item.chapter!==chapter.value)return false;
    if(family.value&&(item.section||chapterLabels[item.chapter]||'Autres')!==family.value)return false;
    if(!q)return true;
    const haystack=[
      item.name,item.section,item.status,item.sourceKind,item.lore,
      ...item.tags,
      ...item.properties.flatMap(property=>[property.label,property.value])
    ].join(" ");
    return norm(haystack).includes(q);
  });
});
const families=computed(()=>[...new Set(modeCatalog.value.filter(item=>!chapter.value||item.chapter===chapter.value).map(item=>item.section||chapterLabels[item.chapter]||'Autres'))].sort((a,b)=>a.localeCompare(b,'fr')));
watch(chapter,()=>{family.value='';});

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
  const next=cloneJson(props.modelValue);
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
  <details class="truth-equipment-panel" open>
    <summary class="subsection-title equipment-section-summary">
      <div>
        <h3>Objets de Vérité</h3>
        <p>
          Le catalogue décrit ce qui existe. Un réseau ouvre une voie d’accès mais ne crée jamais
          la marchandise ; posséder un objet ne donne ni PTV ni Talent.
        </p>
      </div>
      <span class="schema-badge">{{ ownedItems.length }} possédé(s)</span>
    </summary>

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
          <small>{{ modeCatalog.length }} entrée(s) dans cette vue · Livre V</small>
        </span>
        <span class="schema-badge">{{ filtered.length }}</span>
      </summary>

      <div class="catalog-modes" role="group" aria-label="Afficher dans le catalogue">
        <button v-for="mode in [{id:'objects',label:'Objets à acquérir'},{id:'owned',label:'Mes possessions'},{id:'references',label:'Règles et références'}]" :key="mode.id" type="button" :aria-pressed="catalogMode===mode.id" @click="catalogMode=mode.id;chapter='';family='';query=''">{{ mode.label }}</button>
      </div>
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
        <label>Famille<select v-model="family"><option value="">— Choisir une famille —</option><option v-for="item in families" :key="item" :value="item">{{ item }}</option></select></label>
      </div>

      <details class="catalog-help"><summary>Accès exceptionnel et règles d’acquisition</summary>
      <label class="truth-equipment-mj">
        <span class="truth-equipment-mj-copy">
          <strong>Autorisation MJ d’accès exceptionnel aux objets de Vérité</strong>
          <small id="truth-equipment-mj-help">
            Avec l’accord explicite du MJ, ouvre les filières qui ne correspondent pas naturellement au personnage
            ainsi que les objets uniques, hors catalogue et corrompus. Aucun objet n’est accordé automatiquement.
          </small>
        </span>
        <input
          type="checkbox"
          role="switch"
          aria-label="Autorisation MJ d’accès exceptionnel aux objets de Vérité"
          aria-describedby="truth-equipment-mj-help"
          :checked="modelValue.truthEquipmentMjOverride"
          @change="setMjOverride(($event.target as HTMLInputElement).checked)"
        />
      </label>

      <div class="rule-note">
        <strong>Acquisition fictionnelle :</strong>
        le Builder mémorise la possession, mais ne paie automatiquement ni PTV ni argent.
        Les entrées de référence restent consultables sans pouvoir être ajoutées. Les marchés d’Aèr, xéno, AIDH,
        de Chasse et corrompus ne sont affichés que si la Nature, la voie ou l’autorisation MJ de la fiche y donne réellement accès.
      </div>

      </details>
      <p class="catalog-count" role="status">{{ filtered.length }} résultat(s) · {{ catalogMode==='references' ? 'Consultation uniquement' : 'La possession ne débite pas automatiquement vos ressources' }}</p>
      <p v-if="catalogMode==='objects'&&!modeCatalog.length" class="empty-line" role="status">
        Aucun objet accessible avec les choix actuels du personnage. Les propriétés communes sont des règles à consulter dans « Règles et références ». Un accord MJ peut ouvrir un accès exceptionnel.
      </p>
      <p v-else-if="!groups.length" class="empty-line" role="status">
        {{ !chapter&&!family&&!query ? 'Choisis un chapitre ou une famille pour voir ses objets illustrés, ou effectue une recherche.' : 'Aucun objet ne correspond à ces filtres. Essaie une autre famille ou réinitialise les filtres.' }}
        <button v-if="query||chapter||family" type="button" @click="query='';chapter='';family=''">Réinitialiser les filtres</button>
      </p>

      <details v-for="group in groups" :key="group.label" class="truth-equipment-group">
        <summary>
          <span>{{ group.label }}</span>
          <span class="schema-badge">{{ group.items.length }}</span>
        </summary>
        <div class="truth-equipment-grid">
          <article v-for="item in group.items" :key="item.id" class="truth-equipment-card">
            <BuilderCatalogImage :article-id="item.compendiumId" :name="item.name" category="Équipement & Objets" />
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
                v-if="!item.referenceOnly"
                class="secondary compact"
                type="button"
                :disabled="!canAdd(item)"
                @click="add(item)"
              >
                {{ owned.includes(item.id) ? "Possédé" : item.referenceOnly ? "Référence" : !access(item).ok ? "MJ requis" : "Ajouter" }}
              </button>
            </div>

            <details class="equipment-description"><summary>Effets, propriétés et lore</summary><p v-if="item.lore">{{ item.lore }}</p>

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
            </details>
          </article>
        </div>
      </details>
    </details>
  </details>
</template>

<style scoped>

.truth-equipment-panel{--truth-accent:#b79aff;--truth-line:#35405c;margin-top:28px;border-top:1px solid #25374c;padding-top:26px;color:#edf4ff;font-family:Inter,"Segoe UI",sans-serif}
.subsection-title{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}
.subsection-title>div{min-width:0}
.subsection-title h3{margin:0;font:650 1.15rem/1.35 Inter,"Segoe UI",sans-serif;letter-spacing:-.02em}
.subsection-title p{margin:10px 0 0;max-width:78ch;color:#b3c5d9;font-size:14px;line-height:1.65}
.schema-badge{flex:none;align-self:flex-start;padding:6px 10px;border:1px solid var(--truth-line);border-radius:6px;background:#17192c;color:#d2c2ff;font-size:12px;font-weight:650;white-space:nowrap;font-variant-numeric:tabular-nums}
.truth-equipment-owned{display:grid;gap:10px;margin:18px 0}
.truth-equipment-owned-row{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:16px;border:1px solid #2b3b51;border-radius:8px;background:#0e1a2b}
.truth-equipment-owned-row>div{display:grid;gap:6px;min-width:0}
.truth-equipment-owned-row span{font-size:13px;line-height:1.5;color:#a1b5cc}
.truth-equipment-catalog{margin-top:20px;border:1px solid #2b3b51;border-radius:8px;background:#0a1422;padding:0 20px 4px}
.truth-disclosure-summary{display:flex;align-items:center;gap:16px;min-height:76px;padding:18px 0;list-style:none;cursor:pointer}
.truth-disclosure-summary::-webkit-details-marker{display:none}
.truth-disclosure-summary>span:first-child{display:grid;gap:6px;flex:1;min-width:0}
.truth-disclosure-summary strong{font-size:16px;line-height:1.4}
.truth-disclosure-summary small{color:#a1b5cc;font-size:13px;line-height:1.5}
.truth-disclosure-summary::after,.truth-equipment-group>summary::after{content:"";flex:none;width:8px;height:8px;border-right:1.5px solid var(--truth-accent);border-bottom:1.5px solid var(--truth-accent);transform:rotate(45deg);transition:transform .16s ease;margin-right:3px}
.truth-equipment-catalog[open]>.truth-disclosure-summary::after,.truth-equipment-group[open]>summary::after{transform:rotate(225deg)}
.truth-equipment-catalog[open]>.truth-disclosure-summary{border-bottom:1px solid #25374c}
.truth-equipment-toolbar{display:grid;grid-template-columns:minmax(0,2fr) minmax(180px,1fr);gap:16px;margin:20px 0}
.truth-equipment-toolbar label{display:grid;gap:8px;color:#b3c5d9;font-size:14px}
.truth-equipment-toolbar :is(input,select){width:100%;min-width:0;min-height:44px;border:1px solid #344a62;border-radius:6px;background-color:#08121f;color:#edf4ff;font:inherit}
.truth-equipment-mj{display:flex;justify-content:space-between;gap:24px;align-items:center;margin:20px 0;padding:18px;border:1px solid var(--truth-line);border-radius:8px;background:linear-gradient(120deg,#16192a,#0d1726);cursor:pointer}
.truth-equipment-mj-copy{display:grid;gap:7px;min-width:0}
.truth-equipment-mj strong{color:#d2c2ff;font-size:14px;line-height:1.5}
.truth-equipment-mj small{color:#b3c5d9;font-size:13px;line-height:1.6}
.truth-equipment-mj input{appearance:none;flex:0 0 44px;display:block;width:44px;min-width:44px;max-width:44px;height:26px;min-height:26px;margin:0;padding:3px;border:1px solid #62718b;border-radius:20px;background:#263348;cursor:pointer;transition:background .16s ease,border-color .16s ease}
.truth-equipment-mj input::before{content:"";display:block;width:18px;height:18px;border-radius:50%;background:#b9c9db;transition:transform .16s ease}
.truth-equipment-mj input:checked{border-color:#b79aff;background:#634b93}
.truth-equipment-mj input:checked::before{background:#f0eaff;transform:translateX(18px)}
.truth-equipment-mj input:focus-visible{outline:2px solid #cbb8ff;outline-offset:5px}
.rule-note{margin:18px 0;padding:16px;border:1px solid #2b3b51;border-radius:8px;color:#b3c5d9;background:#101b2b;font-size:14px;line-height:1.65}
.rule-note strong{color:#edf4ff}
.rule-note.bad{border-color:#794850;background:#241820;color:#f0bdc0}
.empty-line{margin:18px 0;padding:16px;border:1px dashed #354860;border-radius:8px;color:#a1b5cc;font-size:14px;line-height:1.6}
.truth-equipment-group{margin:14px 0;border:1px solid #2b3b51;border-radius:8px;padding:0 16px;background:#0e1a2b}
.truth-equipment-group>summary{display:flex;align-items:center;gap:14px;min-height:60px;padding:14px 0;cursor:pointer;font-size:15px;font-weight:650;list-style:none}
.truth-equipment-group>summary::-webkit-details-marker{display:none}
.truth-equipment-group>summary>span:first-child{flex:1;min-width:0}
.truth-equipment-group>summary>.schema-badge{align-self:center}
.truth-equipment-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:14px;padding-bottom:16px}
.truth-equipment-card{min-width:0;padding:18px;border:1px solid #34425a;border-radius:8px;background:#0b1524;display:grid;gap:14px;align-content:start}
.truth-equipment-card-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}
.truth-equipment-card-head>div{min-width:0;display:grid;gap:7px}
.truth-equipment-card-head strong{font-size:15px;line-height:1.4}
.truth-equipment-card-head small{color:#b5a2da;font-size:12px;line-height:1.5}
.truth-equipment-card p{margin:0;color:#b3c5d9;font-size:14px;line-height:1.6}
.truth-equipment-properties{display:grid;gap:7px;font-size:13px;line-height:1.55}
.truth-equipment-properties span{padding:8px 10px;border-radius:6px;background:#152035;color:#c0cde0;overflow-wrap:anywhere}
.truth-equipment-properties strong{color:#edf4ff}
.truth-equipment-details summary{min-height:44px;align-content:center;cursor:pointer;font-size:13px;color:#cbb8ff}
.truth-equipment-details dl{display:grid;grid-template-columns:minmax(90px,.6fr) minmax(0,1.4fr);gap:8px 14px;margin:12px 0 0;font-size:13px;line-height:1.55;overflow-wrap:anywhere}
.truth-equipment-details dt{font-weight:650;color:#edf4ff}
.truth-equipment-details dd{margin:0;color:#b3c5d9}
.truth-equipment-panel button{min-height:44px;padding:10px 14px;border-radius:6px;font-size:13px;flex:none}
@media(max-width:720px){
  .truth-equipment-toolbar{grid-template-columns:1fr}
  .truth-equipment-owned-row,.truth-equipment-card-head{align-items:stretch;flex-direction:column}
  .subsection-title{flex-wrap:wrap;gap:12px}
  .truth-equipment-catalog{padding-inline:14px}
  .truth-equipment-mj{gap:16px;padding:16px}
  .truth-equipment-group{padding-inline:12px}
  .truth-equipment-card{padding:14px}
}
@media(prefers-reduced-motion:reduce){.truth-equipment-mj input,.truth-equipment-mj input::before,.truth-disclosure-summary::after,.truth-equipment-group>summary::after{transition:none}}

.catalog-modes{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.catalog-modes button{border:1px solid #344a62;background:#101b2b;color:#b3c5d9}
.catalog-modes button[aria-pressed=true]{border-color:#b79aff;color:#eee6ff;background:#28213b}
.catalog-help>summary,.equipment-description>summary{min-height:44px;cursor:pointer;align-content:center;color:#cbb8ff;font-size:13px}
.catalog-count{font-size:13px;color:#a1b5cc;margin:12px 0}
.truth-equipment-grid{grid-template-columns:minmax(0,1fr);gap:8px}
.truth-equipment-card{padding:12px 16px;gap:4px}
.equipment-description[open]>p{margin:8px 0 12px}
.equipment-section-summary{cursor:pointer;min-height:56px;padding-bottom:12px}
.equipment-section-summary::after{content:'＋';color:#b79aff;align-self:center}
.truth-equipment-panel[open]>.equipment-section-summary::after{content:'−'}
.equipment-section-summary:focus-visible{outline:2px solid #b79aff;outline-offset:4px}
</style>
