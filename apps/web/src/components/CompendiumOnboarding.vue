<script setup lang="ts">
type StartItem={id:string;label:string;summary:string};
type NatureItem={label:string;summary:string;rulesId?:string;loreId?:string;note?:string};
type CategoryItem={label:string;category:string;summary:string};
type OnboardingData={
  basics:StartItem[];
  natures:NatureItem[];
  restricted:NatureItem[];
  loreHubs:StartItem[];
  categories:CategoryItem[];
};

defineProps<{data:OnboardingData|null}>();
const emit=defineEmits<{
  (event:"open-article",id:string):void;
  (event:"open-category",category:string):void;
  (event:"close"):void;
}>();
</script>

<template>
  <section v-if="data" class="newcomer-layer">
    <header class="newcomer-hero panel">
      <div>
        <p class="eyebrow">NOUVEAU JOUEUR</p>
        <h2>Entrer dans Terra Umbra</h2>
        <p>
          Tu n’as pas besoin de connaître tout le Compendium. Commence par le monde visible,
          puis découvre progressivement ce qui se cache derrière le Voile.
        </p>
      </div>
      <button class="secondary" type="button" @click="emit('close')">Explorer directement l’index</button>
    </header>

    <section v-if="data.basics.length" class="newcomer-section">
      <div class="newcomer-section-head">
        <div>
          <p class="eyebrow">COMMENCER ICI</p>
          <h3>Les quatre repères essentiels</h3>
        </div>
      </div>
      <div class="newcomer-grid">
        <button
          v-for="item in data.basics"
          :key="item.id"
          class="newcomer-card panel"
          type="button"
          @click="emit('open-article',item.id)"
        >
          <strong>{{ item.label }}</strong>
          <p>{{ item.summary }}</p>
          <span>Lire →</span>
        </button>
      </div>
    </section>

    <section v-if="data.natures.length || data.restricted.length" class="newcomer-section">
      <div class="newcomer-section-head">
        <div>
          <p class="eyebrow">CHOISIR UNE NATURE</p>
          <h3>Règles et lore côte à côte</h3>
        </div>
      </div>
      <div class="nature-grid">
        <article v-for="item in data.natures" :key="item.label" class="nature-card panel">
          <div>
            <strong>{{ item.label }}</strong>
            <p>{{ item.summary }}</p>
          </div>
          <div class="nature-actions">
            <button v-if="item.rulesId" type="button" @click="emit('open-article',item.rulesId)">Règles de Nature</button>
            <button v-if="item.loreId" type="button" @click="emit('open-article',item.loreId)">Présentation & lore</button>
          </div>
        </article>
      </div>

      <h4 v-if="data.restricted.length" class="restricted-title">Origines restreintes</h4>
      <div v-if="data.restricted.length" class="nature-grid">
        <article v-for="item in data.restricted" :key="item.label" class="nature-card panel restricted">
          <div>
            <div class="nature-title-row">
              <strong>{{ item.label }}</strong>
              <span v-if="item.note" class="start-pill">{{ item.note }}</span>
            </div>
            <p>{{ item.summary }}</p>
          </div>
          <div class="nature-actions">
            <button v-if="item.rulesId" type="button" @click="emit('open-article',item.rulesId)">Règles</button>
            <button v-if="item.loreId" type="button" @click="emit('open-article',item.loreId)">Lore</button>
          </div>
        </article>
      </div>
    </section>

    <section v-if="data.loreHubs.length" class="newcomer-section">
      <div class="newcomer-section-head">
        <div>
          <p class="eyebrow">POUR ALLER PLUS LOIN</p>
          <h3>Les grands repères du monde caché</h3>
        </div>
      </div>
      <div class="newcomer-grid compact">
        <button
          v-for="item in data.loreHubs"
          :key="item.id"
          class="newcomer-card panel"
          type="button"
          @click="emit('open-article',item.id)"
        >
          <strong>{{ item.label }}</strong>
          <p>{{ item.summary }}</p>
          <span>Ouvrir →</span>
        </button>
      </div>
    </section>

    <section v-if="data.categories.length" class="newcomer-section">
      <div class="newcomer-section-head">
        <div>
          <p class="eyebrow">EXPLORER</p>
          <h3>Entrer par une grande rubrique</h3>
        </div>
      </div>
      <div class="category-entry-grid">
        <button
          v-for="item in data.categories"
          :key="item.category"
          class="category-entry panel"
          type="button"
          @click="emit('open-category',item.category)"
        >
          <strong>{{ item.label }}</strong>
          <p>{{ item.summary }}</p>
        </button>
      </div>
    </section>
  </section>
</template>

<style scoped>
.newcomer-layer{display:grid;gap:1.35rem;margin:0 0 1.2rem}
.newcomer-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;padding:1.4rem 1.5rem;border-color:rgba(43,146,255,.3);background:linear-gradient(135deg,rgba(43,146,255,.09),rgba(255,255,255,.018))}
.newcomer-hero h2{margin:.15rem 0 .45rem;font:650 clamp(1.8rem,3vw,2.8rem)/1.05 var(--tu-font)}
.newcomer-hero p:not(.eyebrow){max-width:82ch;margin:0;color:#c1d1e4;line-height:1.6}
.newcomer-section{display:grid;gap:.8rem}.newcomer-section-head h3{margin:.15rem 0 0;font:650 clamp(1.35rem,2vw,1.8rem)/1.15 var(--tu-font)}
.newcomer-grid,.category-entry-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.75rem}
.newcomer-card,.category-entry{text-align:left;padding:1rem;display:flex;flex-direction:column;align-items:flex-start;min-height:145px;cursor:pointer}
.newcomer-grid.compact .newcomer-card{min-height:125px}
.newcomer-card strong,.category-entry strong{font:650 1.15rem/1.2 var(--tu-font);color:#d7e3e7}
.newcomer-card p,.category-entry p,.nature-card p{color:#a1b5cc;line-height:1.55;margin:.45rem 0}
.newcomer-card span{margin-top:auto;color:#6fcff1;font-size:.875rem;font-weight:700}
.newcomer-card:hover,.category-entry:hover,.nature-actions button:hover{border-color:rgba(43,146,255,.55)}
.nature-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem}
.nature-card{padding:.9rem 1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem}
.nature-card>div:first-child{min-width:0}.nature-card strong{font-size:1rem;color:#d3e0e4}.nature-actions{display:flex;justify-content:flex-end;gap:.4rem;flex-wrap:wrap}
.nature-actions button{min-height:44px;border-radius:6px;white-space:nowrap;border:1px solid rgba(255,255,255,.1);background:transparent;color:#c1d1e4;padding:.4rem .55rem}
.nature-title-row{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap}.start-pill{padding:.2rem .45rem;border:1px solid rgba(166,124,230,.45);color:#cdb8ef;font-size:.875rem;text-transform:uppercase;letter-spacing:.05em}
.restricted-title{margin:.7rem 0 0;color:#8fb7c5;font-size:.8rem;text-transform:uppercase;letter-spacing:.08em}
@media(max-width:900px){.newcomer-grid,.category-entry-grid,.nature-grid{grid-template-columns:1fr}.newcomer-hero,.nature-card{align-items:flex-start;flex-direction:column}.nature-actions{justify-content:flex-start}}

/* Shared orbital reading style. */
.newcomer-hero{
  border-color:#2b4259;
  background:linear-gradient(135deg,rgba(100,222,245,.07),rgba(43,146,255,.025));
}
.newcomer-card:hover,.category-entry:hover,.nature-actions button:hover{border-color:#64def5}
.start-pill{border-color:rgba(166,124,230,.36);color:#cdb8ef}

</style>
