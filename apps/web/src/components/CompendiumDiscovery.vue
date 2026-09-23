<script setup lang="ts">
import { computed } from "vue";
import { compendiumHref } from "../lib/compendium-navigation";
import {
  discoveryBrowseHref, discoveryFeatured, discoveryGuide, discoveryJourneys,
  discoveryThemes, discoveryTruthArticle, discoveryVeilArticle, isDiscoveryNavigationClick,
  type DiscoveryBrowse, type DiscoveryResume
} from "../lib/compendium-discovery";

const props = defineProps<{
  mode: "home" | "guide" | "journey";
  journeyId?: string;
  itemCount?: number;
  resume?: DiscoveryResume;
  articleHref?: (id: string) => string;
}>();
const emit = defineEmits<{
  (event: "open-article", id: string, sectionId?: string): void;
  (event: "browse", payload: DiscoveryBrowse): void;
  (event: "guide"): void;
  (event: "journey", id: string): void;
  (event: "resume"): void;
}>();
const journey = computed(() => discoveryJourneys.find(item => item.id === props.journeyId));
const articleCount = computed(() => Number.isFinite(props.itemCount) && (props.itemCount ?? -1) >= 0
  ? new Intl.NumberFormat("fr-FR").format(props.itemCount!) : null);
const articleLink = (id: string, sectionId?: string) => {
  const href = props.articleHref?.(id) ?? compendiumHref(id);
  return sectionId ? `${href.split("#")[0]}#${encodeURIComponent(sectionId)}` : href;
};
const journeyLink = (id: string) => `/compendium?view=journey&journey=${encodeURIComponent(id)}`;
function navigate(event: MouseEvent, action: () => void) {
  if (!isDiscoveryNavigationClick(event)) return;
  event.preventDefault();
  action();
}
function openArticle(event: MouseEvent, id: string, sectionId?: string) {
  navigate(event, () => emit("open-article", id, sectionId));
}
function browse(event: MouseEvent, payload: DiscoveryBrowse) {
  navigate(event, () => emit("browse", payload));
}
</script>

<template>
  <div class="discovery" :data-mode="mode">
    <section v-if="mode === 'home'" class="discovery-hero" aria-labelledby="discovery-title">
      <img class="discovery-orbit" src="/brand/orbital/orbital-earth.webp" alt="" aria-hidden="true" width="1536" height="1024" decoding="async">
      <p class="discovery-eyebrow">COMPENDIUM <span aria-hidden="true">/</span> CALIFORNIA, 2035</p>
      <div class="discovery-coordinates" aria-hidden="true">RÉALITÉ // VÉRITÉ<br>UN MÊME HORIZON</div>
      <h1 id="discovery-title">Un même monde.<span>Une autre réalité.</span></h1>
      <p class="discovery-hero-copy">Sociétés, peuples et puissances cachées.<br>Explorez Terra Umbra, du quotidien de la Grande Californie aux vérités qui se dissimulent derrière le Voile.</p>
      <div class="discovery-actions">
        <a class="discovery-primary" :href="discoveryBrowseHref({})" @click="browse($event, {})">Explorer le Compendium <span aria-hidden="true">→</span></a>
        <a class="discovery-secondary" :href="articleLink(discoveryTruthArticle.id)" @click="openArticle($event, discoveryTruthArticle.id)">Derrière le Voile <span aria-hidden="true">↗</span></a>
      </div>
      <div class="discovery-hero-meta"><span>UN MONDE À EXPLORER <span aria-hidden="true">//</span> PLUSIEURS REGARDS</span><span v-if="articleCount !== null">{{ articleCount }} articles</span></div>
    </section>

    <div class="discovery-content">
      <template v-if="mode === 'home'">
        <section v-if="resume" class="discovery-resume" aria-labelledby="discovery-resume-title">
          <div><p class="discovery-eyebrow">VOTRE DERNIÈRE LECTURE</p><h2 id="discovery-resume-title">{{ resume.title }}</h2><p>{{ resume.sectionTitle }}</p></div>
          <a class="discovery-secondary" :href="articleLink(resume.id, resume.sectionId)" @click="navigate($event, () => emit('resume'))">Reprendre ma lecture <span aria-hidden="true">→</span></a>
        </section>
        <section aria-labelledby="discovery-layers-title">
          <div class="discovery-heading"><h2 id="discovery-layers-title">Choisir son regard</h2><p class="discovery-eyebrow">DEUX FACETTES DU MÊME MONDE</p></div>
          <div class="discovery-layers">
            <a class="discovery-layer" :href="discoveryBrowseHref({ category: 'Réalité' })" @click="browse($event, { category: 'Réalité' })">
              <span class="discovery-eyebrow">01 / LE MONDE VISIBLE</span><h3>Réalité</h3><p>La Grande Californie, ses institutions et ceux qui en parcourent les réseaux.</p>
              <svg class="discovery-drawing" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="64"/><circle cx="80" cy="80" r="47"/><path d="M16 80h128M80 16v128M33 37l94 86M127 37l-94 86"/><circle cx="80" cy="80" r="23"/></svg>
              <span class="discovery-arrow" aria-hidden="true">↗</span>
            </a>
            <a class="discovery-layer" data-layer="Vérité" :href="discoveryBrowseHref({ category: 'Vérité' })" @click="browse($event, { category: 'Vérité' })">
              <img class="discovery-layer-orbit" src="/brand/orbital/orbital-earth-truth.webp" alt="" aria-hidden="true" width="1536" height="1024" loading="lazy" decoding="async">
              <span class="discovery-eyebrow">02 / DERRIÈRE LE VOILE</span><h3>Vérité</h3><p>Le monde caché, ses peuples et les forces qui façonnent l’invisible.</p><span class="discovery-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
        <section class="discovery-section" aria-labelledby="discovery-featured-title">
          <div class="discovery-heading"><h2 id="discovery-featured-title">Premières explorations</h2><a class="discovery-text-link" :href="discoveryBrowseHref({})" @click="browse($event, {})">Tous les articles <span aria-hidden="true">→</span></a></div>
          <div class="discovery-cards">
            <a v-for="article in discoveryFeatured" :key="article.id" class="discovery-article" :data-layer="article.category" :href="articleLink(article.id)" @click="openArticle($event, article.id)">
              <span class="discovery-eyebrow">{{ article.category }} / LORE</span><h3>{{ article.title }}</h3><p>{{ article.summary }}</p><span class="discovery-card-action">Lire l’article <span aria-hidden="true">→</span></span>
            </a>
          </div>
        </section>
      </template>

      <template v-else-if="mode === 'guide'">
        <header class="discovery-page-heading"><p class="discovery-eyebrow">BIENVENUE DANS TERRA UMBRA</p><h1>{{ discoveryGuide.title }}</h1><p>{{ discoveryGuide.intro }}</p></header>
        <div class="discovery-guide-sections">
          <section v-for="(section, index) in discoveryGuide.sections" :key="section.id" class="discovery-guide-section" :data-layer="section.layer" :aria-labelledby="`discovery-${section.id}`">
            <span class="discovery-step-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <div><h2 :id="`discovery-${section.id}`">{{ section.title }}</h2>
              <div class="discovery-guide-layout" :class="{ 'has-illustration': section.image }">
                <figure v-if="section.image" class="discovery-illustration"><img :src="section.image" :alt="section.alt" width="1536" height="1024" loading="lazy" decoding="async"><figcaption>{{ section.caption }}</figcaption></figure>
                <div class="discovery-guide-copy"><p>{{ section.body }}</p><div class="discovery-guide-links">
                  <a v-for="article in section.articles" :key="article.id" :href="articleLink(article.id)" @click="openArticle($event, article.id)">{{ article.title }} <span aria-hidden="true">→</span></a>
                  <a v-if="section.browse" :href="discoveryBrowseHref(section.browse)" @click="browse($event, section.browse)">Consulter les règles de création <span aria-hidden="true">→</span></a>
                </div>
                  <a v-if="section.id === 'decouvrir-la-verite'" class="discovery-comparison-link" :href="articleLink(discoveryVeilArticle.id)" @click="openArticle($event, discoveryVeilArticle.id)">Voir une foule quand l’Hologramme défaille <span aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>

      <template v-else-if="journey">
        <a class="discovery-text-link" href="/compendium?view=guide" @click="navigate($event, () => emit('guide'))">← Guide d’accompagnement</a>
        <header class="discovery-page-heading"><p class="discovery-eyebrow">PARCOURS DE LECTURE / {{ journey.articles.length }} ÉTAPES</p><h1>{{ journey.title }}</h1><p>{{ journey.description }}</p></header>
        <ol class="discovery-steps">
          <li v-for="(article, index) in journey.articles" :key="article.id" :data-layer="article.category"><span class="discovery-step-index" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span><div><p class="discovery-eyebrow">{{ article.category }} / LORE</p><h2><a :href="articleLink(article.id)" @click="openArticle($event, article.id)">{{ article.title }} <span aria-hidden="true">→</span></a></h2><p>{{ article.summary }}</p></div></li>
        </ol>
        <a class="discovery-secondary" :href="discoveryBrowseHref({})" @click="browse($event, {})">Poursuivre dans le Compendium <span aria-hidden="true">→</span></a>
      </template>
      <header v-else class="discovery-page-heading"><p class="discovery-eyebrow">PARCOURS DE LECTURE</p><h1>Choisir un parcours</h1><p>Retrouvez les chemins de découverte ci-dessous, ou explorez librement le Compendium.</p></header>

      <section v-if="mode !== 'journey'" class="discovery-section" aria-labelledby="discovery-themes-title">
        <div class="discovery-heading"><h2 id="discovery-themes-title">Explorer par thème</h2></div>
        <p class="discovery-section-intro">Des pistes de recherche dans l’ensemble du Compendium.</p>
        <div class="discovery-themes">
          <a v-for="theme in discoveryThemes" :key="theme.id" class="discovery-theme" :href="discoveryBrowseHref(theme.browse)" @click="browse($event, theme.browse)"><h3>{{ theme.title }}</h3><p>{{ theme.description }}</p><span>Rechercher « {{ theme.browse.query }} » <span aria-hidden="true">→</span></span></a>
        </div>
      </section>
      <section class="discovery-section" aria-labelledby="discovery-journeys-title">
        <div class="discovery-heading"><h2 id="discovery-journeys-title">{{ mode === 'journey' ? 'Autres parcours à découvrir' : 'Par où commencer ?' }}</h2><a v-if="mode === 'home'" class="discovery-text-link" href="/compendium?view=guide" @click="navigate($event, () => emit('guide'))">Guide d’accompagnement <span aria-hidden="true">→</span></a></div>
        <div class="discovery-journeys">
          <a v-for="(item, index) in discoveryJourneys" :key="item.id" class="discovery-journey" :aria-current="mode === 'journey' && item.id === journeyId ? 'page' : undefined" :href="journeyLink(item.id)" @click="navigate($event, () => emit('journey', item.id))"><span class="discovery-eyebrow">PARCOURS {{ String(index + 1).padStart(2, '0') }} / {{ item.articles.length }} LECTURES</span><h3>{{ item.title }}</h3><p>{{ item.description }}</p><span class="discovery-card-action">{{ mode === 'journey' && item.id === journeyId ? 'Parcours actuel' : 'Commencer' }} <span aria-hidden="true">→</span></span></a>
        </div>
      </section>
      <footer class="discovery-footer"><span>TERRA UMBRA <span aria-hidden="true">//</span> COMPENDIUM</span><a :href="discoveryBrowseHref({})" @click="browse($event, {})">Explorer tous les articles <span aria-hidden="true">→</span></a></footer>
    </div>
  </div>
</template>

<style scoped>
.discovery{--discovery-cyan:#64def5;--discovery-violet:#b79aff;--discovery-accent:var(--discovery-cyan);color:#edf4ff;background:#080f1a;min-width:0;border:1px solid #24384c;border-radius:12px;overflow:hidden;font-family:Inter,"Segoe UI",Arial,sans-serif}
.discovery *{box-sizing:border-box}.discovery [data-layer="Vérité"]{--discovery-accent:var(--discovery-violet)}
.discovery a{color:inherit;text-decoration:none;touch-action:manipulation}.discovery a:focus-visible{outline:2px solid var(--discovery-accent);outline-offset:5px}.discovery a:hover{color:#fff}.discovery h1,.discovery h2,.discovery h3,.discovery p{margin:0}.discovery h1,.discovery h2,.discovery h3{font-family:inherit;font-weight:500;text-wrap:balance}.discovery p{line-height:1.75}.discovery-eyebrow{font:500 .72rem/1.7 Consolas,"Liberation Mono",monospace;letter-spacing:.12em;color:#acc1d6;text-transform:uppercase}
.discovery-hero{position:relative;isolation:isolate;display:flex;flex-direction:column;min-height:460px;padding:48px 44px 28px;border-bottom:1px solid #294259;overflow:hidden}.discovery-orbit{position:absolute;inset:0;z-index:-2;width:100%;height:100%;object-fit:cover;object-position:center 47%;pointer-events:none}.discovery-hero:after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,#050c17ed 0%,#050c17aa 40%,#050c1720 80%),linear-gradient(0deg,#080f1a,transparent 35%)}.discovery-hero h1{font-size:clamp(2.5rem,4.5vw,4.4rem);letter-spacing:-.045em;line-height:1.1;margin:28px 0 22px;max-width:770px}.discovery-hero h1 span{display:block;color:#91e7ff;font-weight:400}.discovery-hero .discovery-hero-copy{max-width:490px;color:#c0d0e2;font-size:.95rem}.discovery-coordinates{position:absolute;right:32px;top:45px;text-align:right;font:.7rem/1.9 Consolas,monospace;letter-spacing:.12em;color:#b4d9f2}.discovery-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.discovery-primary,.discovery-secondary{display:inline-flex;align-items:center;justify-content:center;gap:16px;min-height:44px;padding:12px 18px;border:1px solid #42627b;border-radius:5px;font-size:.85rem;font-weight:600;text-align:center;line-height:1.5}.discovery .discovery-primary{background:#a2eaff;border-color:#a2eaff;color:#041322}.discovery .discovery-primary:hover{background:#d0f8ff;color:#001019}.discovery-secondary{background:#0b1728b3;color:#d3e3f3}.discovery-secondary:hover{background:#16263b;border-color:#6491ac}.discovery-hero-meta{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-top:36px;font:.7rem/1.7 Consolas,monospace;letter-spacing:.07em;color:#b0c4d9}
.discovery-content{max-width:1350px;margin:0 auto;padding:36px 42px 24px}.discovery-section{margin-top:38px}.discovery-heading{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:20px}.discovery-heading h2{font-size:1.4rem;letter-spacing:-.025em}.discovery .discovery-text-link{display:inline-flex;align-items:center;gap:10px;min-height:44px;font-size:.84rem;color:#b4d7e8}.discovery-section-intro{margin:-10px 0 20px!important;color:#a9bfd2;font-size:.9rem}.discovery-layers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.discovery-layer{position:relative;isolation:isolate;overflow:hidden;padding:25px;min-height:190px;border:1px solid #355368;border-radius:7px;background:linear-gradient(125deg,#102534,#0a1523 65%);transition:border-color .2s,transform .2s}.discovery-layer:hover{transform:translateY(-2px);border-color:var(--discovery-accent)}.discovery-layer[data-layer="Vérité"]{border-color:#514269;background:linear-gradient(125deg,#201c33,#0d1524 65%)}.discovery-layer .discovery-eyebrow{color:var(--discovery-accent)}.discovery-layer h3{font-size:1.9rem;letter-spacing:-.025em;margin:12px 0 8px}.discovery-layer p{max-width:80%;font-size:.9rem;color:#bfd0df}.discovery-arrow{position:absolute;right:24px;bottom:22px;font-size:1.5rem;color:var(--discovery-accent)}.discovery-drawing{position:absolute;right:-15px;top:18px;width:160px;height:160px;opacity:.22;z-index:-1;fill:none;stroke:var(--discovery-accent);stroke-width:1}.discovery-layer-orbit{position:absolute;inset:0;z-index:-1;width:100%;height:100%;object-fit:cover;object-position:65% 42%;opacity:.35;mask-image:linear-gradient(90deg,transparent,#000)}
.discovery-cards,.discovery-journeys{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.discovery-article,.discovery-journey,.discovery-theme{display:flex;flex-direction:column;gap:14px;padding:23px;border:1px solid #344b61;border-radius:7px;background:linear-gradient(140deg,#132236,#0b1320)}.discovery-article:hover,.discovery-theme:hover,.discovery-journey:hover{border-color:#789bb5;background:#132337}.discovery-article .discovery-eyebrow{color:var(--discovery-accent)}.discovery-article h3{font-size:1.2rem;line-height:1.4}.discovery-article p,.discovery-journey p,.discovery-theme p{color:#b2c5d8;font-size:.9rem}.discovery-card-action{display:flex;justify-content:space-between;gap:12px;margin-top:auto;padding-top:12px;color:#d2e6f4;font-size:.85rem;line-height:1.6}.discovery-themes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.discovery-theme h3{font-size:1rem;line-height:1.5}.discovery-theme>span{display:flex;justify-content:space-between;gap:10px;margin-top:auto;font-size:.8rem;line-height:1.6;color:#b7d4e5}.discovery-journey:nth-child(2){border-color:#534266;background:linear-gradient(140deg,#251e38,#111624)}.discovery-journey h3{font-size:1.4rem;line-height:1.3}.discovery-journey[aria-current="page"]{border-color:var(--discovery-accent)}
.discovery-resume{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;padding:22px 24px;margin-bottom:32px;border:1px solid #4d6b80;border-radius:8px;background:linear-gradient(110deg,#162b3a,#111c2d)}.discovery-resume>div{min-width:0;flex:1 1 240px;overflow-wrap:anywhere}.discovery-resume h2{font-size:1.25rem;line-height:1.4;margin:8px 0}.discovery-resume p:not(.discovery-eyebrow){color:#b7cadd;font-size:.9rem}.discovery-page-heading{margin:16px 0 36px}.discovery-page-heading h1{font-size:clamp(2rem,3.4vw,3rem);letter-spacing:-.035em;line-height:1.15;margin:14px 0 22px}.discovery-page-heading>p:last-child{max-width:75ch;color:#bdcfe0;font-size:1rem;line-height:1.85}.discovery-guide-sections,.discovery-steps{display:grid;gap:20px}.discovery-guide-section,.discovery-steps>li{display:grid;grid-template-columns:30px minmax(0,1fr);gap:18px;padding:28px;border:1px solid #334b61;border-radius:8px;background:#0d1827}.discovery-guide-section:nth-child(2){background:linear-gradient(135deg,#201a30,#0d1827 75%);border-color:#514363}.discovery-step-index{font:.85rem/1.8 Consolas,monospace;color:var(--discovery-accent)}.discovery-guide-section h2,.discovery-steps h2{font-size:1.5rem;line-height:1.4;letter-spacing:-.02em;margin:0 0 18px}.discovery-guide-layout,.discovery-guide-copy{min-width:0}.discovery-guide-layout.has-illustration{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:24px;align-items:start}.discovery-guide-copy>p,.discovery-steps li>div>p:not(.discovery-eyebrow){font-size:1rem;line-height:1.85;color:#bdcfe0;max-width:75ch}.discovery-illustration{margin:0;overflow:hidden;border:1px solid #36566b;border-radius:6px;background:#091523}.discovery-guide-section[data-layer="Vérité"] .discovery-illustration{border-color:#57446f}.discovery-illustration img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:contain}.discovery-illustration figcaption{padding:12px 14px;color:#b9cadd;font-size:.85rem;line-height:1.6}.discovery-guide-links{display:flex;flex-wrap:wrap;gap:4px 18px;margin-top:16px}.discovery-guide-links a{display:inline-flex;align-items:center;gap:8px;min-height:44px;font-size:.88rem;line-height:1.65;color:var(--discovery-accent);padding:8px 0}.discovery-guide-links a:hover,.discovery-text-link:hover{text-decoration:underline;text-underline-offset:4px}.discovery .discovery-comparison-link{display:inline-flex;align-items:center;gap:8px;min-height:44px;margin-top:16px;padding:10px 0;color:#d2bcff;font-size:.9rem;line-height:1.7;text-decoration:underline;text-underline-offset:4px}.discovery-steps{list-style:none;padding:0;margin:30px 0}.discovery-steps .discovery-eyebrow{color:var(--discovery-accent);margin-bottom:8px}.discovery-steps h2 a{display:inline-block;min-height:44px}.discovery-footer{display:flex;justify-content:space-between;flex-wrap:wrap;align-items:center;gap:12px;border-top:1px solid #2d4257;margin-top:32px;padding-top:16px;color:#a3b9cd;font:.72rem/1.7 Consolas,monospace;letter-spacing:.06em}.discovery-footer a{display:inline-flex;align-items:center;min-height:44px;gap:12px}
@media(max-width:1200px){.discovery-hero{padding:38px 30px 26px}.discovery-content{padding:30px}.discovery-coordinates{display:none}.discovery-cards,.discovery-journeys{grid-template-columns:repeat(2,minmax(0,1fr))}.discovery-article:last-child,.discovery-journey:last-child{grid-column:1/-1}.discovery-guide-layout.has-illustration{grid-template-columns:1fr}.discovery-illustration{max-width:640px}.discovery-themes{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:700px){.discovery{border-radius:8px}.discovery-hero{padding:32px 20px 24px;min-height:460px}.discovery-hero h1{font-size:clamp(2.25rem,9vw,3rem)}.discovery-orbit{object-position:65% center}.discovery-hero:after{background:linear-gradient(90deg,#050c17e6,#050c1760),linear-gradient(0deg,#080f1a,transparent 50%)}.discovery-hero-copy{font-size:.9rem!important}.discovery-hero>.discovery-eyebrow{font-size:.67rem;letter-spacing:.07em}.discovery-content{padding:26px 18px 18px}.discovery-layers,.discovery-cards,.discovery-journeys,.discovery-themes{grid-template-columns:1fr}.discovery-layer{min-height:180px}.discovery-layer p{max-width:85%}.discovery-article:last-child,.discovery-journey:last-child{grid-column:auto}.discovery-resume{padding:20px}.discovery-resume .discovery-secondary{width:100%}.discovery-heading>.discovery-eyebrow{font-size:.65rem}.discovery-guide-section,.discovery-steps>li{grid-template-columns:22px minmax(0,1fr);gap:10px;padding:21px 14px}.discovery-guide-section h2,.discovery-steps h2{font-size:1.3rem}.discovery-guide-copy>p,.discovery-steps li>div>p:not(.discovery-eyebrow){font-size:.95rem}.discovery-footer{font-size:.67rem}.discovery-primary,.discovery-secondary{font-size:.8rem}}
@media(prefers-reduced-motion:reduce){.discovery-layer{transition:none}.discovery-layer:hover{transform:none}}
</style>
