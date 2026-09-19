<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

type ThemeKey = "interface-2035" | "livre-vivant" | "codex-hybride" | "dossier-umbra";
type ViewKey = "builder" | "compendium";

const route = useRoute();

const themes: Array<{
  key: ThemeKey;
  short: string;
  title: string;
  description: string;
}> = [
  {
    key: "interface-2035",
    short: "A",
    title: "Interface 2035",
    description: "Dense, sombre, technique — héritière de la V1."
  },
  {
    key: "livre-vivant",
    short: "B",
    title: "Livre vivant",
    description: "Clair, éditorial — inspiré des livres TUC et de leurs cadres."
  },
  {
    key: "codex-hybride",
    short: "C",
    title: "Codex hybride",
    description: "Chrome sombre, contenu clair — interface et livre cohabitent."
  },
  {
    key: "dossier-umbra",
    short: "D",
    title: "Dossier Umbra",
    description: "Archives 2035, dossiers et couches Réalité / Vérité."
  }
];

const themeKey = computed<ThemeKey>(() => {
  const raw = String(route.params.theme ?? "");
  return themes.some((item) => item.key === raw) ? raw as ThemeKey : "interface-2035";
});

const viewKey = computed<ViewKey>(() =>
  String(route.params.view ?? "") === "compendium" ? "compendium" : "builder"
);

const activeTheme = computed(() =>
  themes.find((item) => item.key === themeKey.value) ?? themes[0]
);

const realityImage = "/api/compendium/media/images/manual/equipement-036-raven-ar-027-rampager.webp";
const truthImage = "/api/compendium/media/images/manual/verite-catalogue-008-owl-lc-014-chasseur.webp";

const steps = [
  ["01", "Concept", true],
  ["02", "Origine", true],
  ["03", "Sphère & Style", true],
  ["04", "Attributs", true],
  ["05", "Compétences", true],
  ["06", "Talents", true],
  ["07", "Nature & Vérité", true],
  ["08", "Désavantages", true],
  ["09", "Edge", true],
  ["10", "Équipement", false],
  ["11", "Finalisation", false]
] as const;

const equipment = [
  {
    kind: "RÉALITÉ",
    title: "Raven AR-027 Rampager",
    body: "Fusil d'assaut terrestre polyvalent, pensé pour les engagements mobiles.",
    meta: "Arme longue · 3 200 $",
    image: realityImage,
    selected: true
  },
  {
    kind: "VÉRITÉ",
    title: "OWL LC-014 Chasseur",
    body: "Arme issue des marchés de Vérité, rare et difficile à obtenir sans intermédiaire.",
    meta: "Marché noir · Accès restreint",
    image: truthImage,
    selected: false
  },
  {
    kind: "SERVICE",
    title: "Planque renforcée",
    body: "Un lieu sûr, discret et sécurisé pour disparaître quelques jours.",
    meta: "Charge fixe · 850 $ / mois",
    image: "",
    selected: false
  },
  {
    kind: "AUGMENTATION",
    title: "Interface neurale civile",
    body: "Connexion assistée aux systèmes personnels, Holonet et équipements compatibles.",
    meta: "Neurotech · Charge 1",
    image: "",
    selected: false
  }
];

const results = [
  ["Armement", "OWL LC-014 Chasseur", "Arme de Vérité · marché noir"],
  ["Armement", "Raven AR-027 Rampager", "Réalité · Raven Arms"],
  ["Augmentation", "Interface neurale civile", "Neurotech · courant"],
  ["Service", "Planque renforcée", "Charge fixe · sécurité"]
] as const;
</script>

<template>
  <div class="style-lab" :class="`lab--${themeKey}`">
    <header class="lab-topbar">
      <div class="lab-brand">
        <span class="lab-sigil">TU</span>
        <div>
          <small>STYLE LAB · V2</small>
          <strong>{{ activeTheme.short }} — {{ activeTheme.title }}</strong>
        </div>
      </div>

      <nav class="theme-switcher" aria-label="Concepts graphiques">
        <RouterLink
          v-for="theme in themes"
          :key="theme.key"
          :to="`/style-lab/${theme.key}/${viewKey}`"
          :class="{ active: theme.key === themeKey }"
        >
          <span>{{ theme.short }}</span>
          {{ theme.title }}
        </RouterLink>
      </nav>

      <RouterLink class="lab-exit" to="/">← V2 réelle</RouterLink>
    </header>

    <main class="lab-page">
      <section class="lab-intro">
        <div>
          <p class="lab-kicker">CONCEPT {{ activeTheme.short }}</p>
          <h1>{{ activeTheme.title }}</h1>
          <p>{{ activeTheme.description }}</p>
        </div>

        <div class="view-switcher">
          <RouterLink
            :to="`/style-lab/${themeKey}/builder`"
            :class="{ active: viewKey === 'builder' }"
          >
            Builder
          </RouterLink>
          <RouterLink
            :to="`/style-lab/${themeKey}/compendium`"
            :class="{ active: viewKey === 'compendium' }"
          >
            Compendium
          </RouterLink>
        </div>
      </section>

      <section v-if="viewKey === 'builder'" class="prototype-frame prototype-builder">
        <aside class="builder-steps">
          <div class="mini-character">
            <div class="avatar">MV</div>
            <div>
              <small>PERSONNAGE</small>
              <strong>Mara Vance</strong>
              <span>Crawler · Hacker</span>
            </div>
          </div>

          <div class="progress-block">
            <div><span>Création</span><strong>9 / 11</strong></div>
            <div class="progress-track"><span></span></div>
          </div>

          <nav>
            <button
              v-for="step in steps"
              :key="step[0]"
              type="button"
              :class="{ done: step[2], active: step[0] === '10' }"
            >
              <span>{{ step[0] }}</span>
              <strong>{{ step[1] }}</strong>
              <small>{{ step[2] ? "✓" : step[0] === "10" ? "EN COURS" : "" }}</small>
            </button>
          </nav>
        </aside>

        <article class="builder-sheet">
          <header class="sheet-head reality-truth-frame">
            <div>
              <p class="lab-kicker">ÉTAPE 10 · RÉALITÉ ↔ VÉRITÉ</p>
              <h2>Équipement & patrimoine</h2>
              <p>
                Construis ce que Mara possède réellement au début de la campagne,
                sans perdre de vue ce que son réseau peut lui procurer.
              </p>
            </div>
            <span class="step-badge">Compte · 8 450 $</span>
          </header>

          <div class="filter-row">
            <button class="active" type="button">Tout</button>
            <button type="button">Armes</button>
            <button type="button">Augmentations</button>
            <button type="button">Services</button>
            <label>
              <span>Rechercher</span>
              <input value="raven" readonly />
            </label>
          </div>

          <div class="equipment-grid">
            <article
              v-for="item in equipment"
              :key="item.title"
              class="equipment-card"
              :class="{ selected: item.selected, truth: item.kind === 'VÉRITÉ' }"
            >
              <div v-if="item.image" class="equipment-image">
                <img :src="item.image" :alt="item.title" />
              </div>
              <div v-else class="equipment-placeholder">
                <span>{{ item.kind.slice(0, 2) }}</span>
              </div>
              <div class="equipment-copy">
                <small>{{ item.kind }}</small>
                <h3>{{ item.title }}</h3>
                <p>{{ item.body }}</p>
                <footer>
                  <span>{{ item.meta }}</span>
                  <button type="button">{{ item.selected ? "Ajouté" : "Ajouter" }}</button>
                </footer>
              </div>
            </article>
          </div>

          <section class="reality-truth-note">
            <div>
              <strong>RÉALITÉ</strong>
              <p>Achats, comptes, charges fixes et possessions déclarées.</p>
            </div>
            <span class="interlace-mark">◆</span>
            <div>
              <strong>VÉRITÉ</strong>
              <p>Accès rares, marchés occultes et ressources qui ne figurent sur aucun relevé.</p>
            </div>
          </section>
        </article>

        <aside class="builder-summary">
          <header>
            <small>RÉSUMÉ VIVANT</small>
            <span>9/11</span>
          </header>

          <section>
            <h3>Identité</h3>
            <dl>
              <dt>Origine</dt><dd>Corporatiste</dd>
              <dt>Sphère</dt><dd>Crawler</dd>
              <dt>Style</dt><dd>Hacker</dd>
              <dt>Nature</dt><dd>Vampire</dd>
            </dl>
          </section>

          <section>
            <h3>Ressources</h3>
            <dl>
              <dt>Train de vie</dt><dd>Confortable</dd>
              <dt>Compte</dt><dd>8 450 $</dd>
              <dt>Edge</dt><dd>3 / 5</dd>
              <dt>PTV</dt><dd>4</dd>
            </dl>
          </section>

          <section>
            <h3>Sélection</h3>
            <div class="summary-item">
              <img :src="realityImage" alt="" />
              <span><strong>Raven AR-027</strong><small>Équipé</small></span>
            </div>
            <div class="summary-item truth">
              <img :src="truthImage" alt="" />
              <span><strong>OWL LC-014</strong><small>Disponible via contact</small></span>
            </div>
          </section>

          <button class="summary-cta" type="button">Continuer →</button>
        </aside>
      </section>

      <section v-else class="prototype-frame prototype-compendium">
        <aside class="wiki-results">
          <header>
            <p class="lab-kicker">COMPENDIUM</p>
            <h2>Recherche</h2>
            <input value="arme" readonly />
          </header>

          <nav>
            <button type="button" class="active">Tout <span>1 910</span></button>
            <button type="button">Réalité <span>312</span></button>
            <button type="button">Vérité <span>381</span></button>
            <button type="button">Équipement <span>261</span></button>
          </nav>

          <div class="result-stack">
            <button
              v-for="(result, index) in results"
              :key="result[1]"
              type="button"
              :class="{ active: index === 0 }"
            >
              <small>{{ result[0] }}</small>
              <strong>{{ result[1] }}</strong>
              <span>{{ result[2] }}</span>
            </button>
          </div>
        </aside>

        <article class="wiki-article reality-truth-frame">
          <header class="article-head">
            <div class="crumb">VÉRITÉ › ÉQUIPEMENT › ARMEMENT</div>
            <h1>OWL LC-014 Chasseur</h1>
            <p>
              Une arme rare des marchés de Vérité, recherchée pour sa précision et
              sa capacité à frapper des cibles qui ne devraient pas exister.
            </p>
            <div class="tag-row">
              <span>Canon</span>
              <span>OWL</span>
              <span>Arme longue</span>
              <span>Marché noir</span>
            </div>
          </header>

          <figure class="hero-media">
            <img :src="truthImage" alt="OWL LC-014 Chasseur" />
            <figcaption>Catalogue de Vérité · OWL LC-014 Chasseur</figcaption>
          </figure>

          <section class="article-copy">
            <h2>Le Chasseur</h2>
            <p>
              Le LC-014 n'est pas une arme que l'on trouve dans un magasin ordinaire.
              Sa circulation dépend de contacts, de filières et d'un accès réel aux
              réseaux qui connaissent la Vérité.
            </p>
            <p>
              Pour un profane, il ressemble à une arme avancée de fabrication
              inhabituelle. Pour ceux qui savent regarder, certains détails de sa
              conception racontent une autre histoire.
            </p>

            <div class="article-callout">
              <strong>Dans le Builder</strong>
              <span>Équipement · accès de Vérité · ressource rare</span>
            </div>

            <h2>Acquisition</h2>
            <div class="article-cards">
              <article>
                <small>ACCÈS</small>
                <strong>Réseau de Vérité</strong>
                <p>Contact, marché clandestin ou faveur auprès d'une faction informée.</p>
              </article>
              <article>
                <small>RISQUE</small>
                <strong>Traçabilité</strong>
                <p>Posséder ce matériel attire l'attention bien avant de devoir s'en servir.</p>
              </article>
            </div>
          </section>
        </article>

        <aside class="wiki-infobox">
          <figure>
            <img :src="realityImage" alt="Raven AR-027 Rampager" />
            <figcaption>Voir aussi · Raven AR-027 Rampager</figcaption>
          </figure>

          <section>
            <p class="lab-kicker">FICHE</p>
            <dl>
              <dt>Fabricant</dt><dd>OWL</dd>
              <dt>Type</dt><dd>Arme longue</dd>
              <dt>Marché</dt><dd>Vérité</dd>
              <dt>Accès</dt><dd>Restreint</dd>
            </dl>
          </section>

          <section>
            <p class="lab-kicker">SOMMAIRE</p>
            <a href="#0">Le Chasseur</a>
            <a href="#0">Acquisition</a>
            <a href="#0">Usage en jeu</a>
            <a href="#0">Articles liés</a>
          </section>

          <section class="truth-box">
            <strong>DERRIÈRE LE VOILE</strong>
            <p>
              Cette entrée croise volontairement les codes Réalité et Vérité.
            </p>
          </section>
        </aside>
      </section>
    </main>
  </div>
</template>

<style scoped>
.style-lab{
  --bg:#0b0f12;
  --surface:#111820;
  --surface-2:#151f29;
  --surface-3:#0d141a;
  --line:#25313d;
  --line-strong:#3b4b59;
  --text:#eaf0f4;
  --muted:#93a3af;
  --reality:#48d7b1;
  --truth:#73a8ff;
  --danger:#ff7b87;
  --shadow:0 18px 48px rgba(0,0,0,.28);
  --radius:14px;
  min-height:100vh;
  color:var(--text);
  background:var(--bg);
  font:15px/1.5 Inter,Segoe UI,Roboto,Arial,sans-serif;
}
.style-lab *{box-sizing:border-box}
.style-lab button,.style-lab input{font:inherit}
.style-lab button{cursor:pointer}
.lab-topbar{
  position:sticky;top:0;z-index:30;
  display:grid;grid-template-columns:minmax(230px,1fr) auto auto;
  gap:18px;align-items:center;
  min-height:72px;padding:10px clamp(12px,3vw,34px);
  border-bottom:1px solid var(--line);
  background:color-mix(in srgb,var(--bg) 92%,transparent);
  backdrop-filter:blur(16px);
}
.lab-brand{display:flex;align-items:center;gap:10px;min-width:0}
.lab-brand>div{display:grid;gap:1px;min-width:0}
.lab-brand small{color:var(--muted);font-size:10px;letter-spacing:.14em}
.lab-brand strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lab-sigil{
  display:grid;place-items:center;width:38px;height:38px;flex:0 0 38px;
  border:1px solid var(--reality);color:var(--reality);font-weight:900;
}
.theme-switcher{display:flex;gap:6px}
.theme-switcher a,.view-switcher a,.lab-exit{
  text-decoration:none;color:var(--muted);border:1px solid var(--line);
  padding:8px 10px;border-radius:9px;background:var(--surface-3);
}
.theme-switcher a{display:flex;align-items:center;gap:6px;font-size:12px}
.theme-switcher a>span{color:var(--reality);font-weight:900}
.theme-switcher a.active,.view-switcher a.active{
  color:var(--text);border-color:var(--line-strong);background:var(--surface-2)
}
.lab-exit{white-space:nowrap}
.lab-page{width:min(1680px,calc(100% - 24px));margin:auto;padding:28px 0 48px}
.lab-intro{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:18px}
.lab-intro h1{margin:2px 0 5px;font-size:clamp(30px,4vw,48px);line-height:1}
.lab-intro>div>p:last-child{margin:0;color:var(--muted)}
.lab-kicker{margin:0;color:var(--reality);font-size:10px;font-weight:900;letter-spacing:.14em}
.view-switcher{display:flex;gap:6px}
.prototype-frame{min-height:760px}
.prototype-builder{
  display:grid;grid-template-columns:240px minmax(0,1fr) 300px;gap:14px;align-items:start;
}
.builder-steps,.builder-sheet,.builder-summary,.wiki-results,.wiki-article,.wiki-infobox{
  border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);box-shadow:var(--shadow)
}
.builder-steps,.builder-summary,.wiki-results,.wiki-infobox{position:sticky;top:92px}
.builder-steps{overflow:hidden}
.mini-character{display:grid;grid-template-columns:48px 1fr;gap:10px;padding:14px;border-bottom:1px solid var(--line)}
.avatar{display:grid;place-items:center;height:58px;border:1px solid var(--line-strong);background:var(--surface-3);color:var(--reality);font-weight:900}
.mini-character>div:last-child{display:grid;align-content:center;gap:2px}
.mini-character small,.mini-character span{color:var(--muted);font-size:10px}
.progress-block{padding:12px 14px;border-bottom:1px solid var(--line)}
.progress-block>div:first-child{display:flex;justify-content:space-between;color:var(--muted);font-size:11px}
.progress-block strong{color:var(--text)}
.progress-track{height:5px;margin-top:8px;background:var(--surface-3);overflow:hidden}
.progress-track span{display:block;width:82%;height:100%;background:linear-gradient(90deg,var(--reality),var(--truth))}
.builder-steps nav{display:grid;gap:4px;padding:8px}
.builder-steps nav button{
  display:grid;grid-template-columns:26px 1fr auto;gap:7px;align-items:center;width:100%;padding:8px;
  border:1px solid transparent;border-radius:8px;color:var(--muted);background:transparent;text-align:left
}
.builder-steps nav button span{font-size:10px}
.builder-steps nav button strong{font-size:12px}
.builder-steps nav button small{font-size:9px}
.builder-steps nav button.done small{color:var(--reality)}
.builder-steps nav button.active{color:var(--text);border-color:var(--line-strong);background:var(--surface-2)}
.builder-sheet{padding:22px;min-width:0}
.sheet-head{display:flex;justify-content:space-between;gap:20px;padding:8px 4px 20px;border-bottom:1px solid var(--line)}
.sheet-head h2{margin:4px 0 8px;font-size:clamp(26px,3vw,38px);line-height:1}
.sheet-head p:not(.lab-kicker){margin:0;max-width:70ch;color:var(--muted)}
.step-badge{align-self:start;padding:7px 9px;border:1px solid var(--line-strong);border-radius:999px;color:var(--reality);white-space:nowrap}
.filter-row{display:flex;align-items:end;gap:7px;margin:18px 0}
.filter-row button{padding:8px 10px;border:1px solid var(--line);border-radius:8px;color:var(--muted);background:var(--surface-3)}
.filter-row button.active{color:var(--text);border-color:var(--reality)}
.filter-row label{display:grid;gap:4px;margin-left:auto;color:var(--muted);font-size:9px;letter-spacing:.08em}
.filter-row input{width:190px;padding:8px;border:1px solid var(--line);border-radius:8px;color:var(--text);background:var(--surface-3)}
.equipment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.equipment-card{min-width:0;overflow:hidden;border:1px solid var(--line);border-radius:12px;background:var(--surface-3)}
.equipment-card.selected{border-color:var(--reality);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--reality) 25%,transparent)}
.equipment-card.truth{border-color:color-mix(in srgb,var(--truth) 44%,var(--line))}
.equipment-image,.equipment-placeholder{height:148px;background:color-mix(in srgb,var(--surface-2) 80%,black)}
.equipment-image img{width:100%;height:100%;object-fit:contain;display:block}
.equipment-placeholder{display:grid;place-items:center}
.equipment-placeholder span{font-size:34px;font-weight:900;color:var(--line-strong)}
.equipment-copy{padding:13px}
.equipment-copy>small{color:var(--reality);font-size:9px;font-weight:900;letter-spacing:.12em}
.equipment-card.truth .equipment-copy>small{color:var(--truth)}
.equipment-copy h3{margin:4px 0;font-size:17px}
.equipment-copy p{min-height:44px;margin:0;color:var(--muted);font-size:12px}
.equipment-copy footer{display:flex;align-items:center;justify-content:space-between;gap:9px;margin-top:12px;padding-top:10px;border-top:1px solid var(--line)}
.equipment-copy footer span{color:var(--muted);font-size:10px}
.equipment-copy footer button{padding:6px 8px;border:1px solid var(--line-strong);border-radius:7px;color:var(--text);background:var(--surface-2)}
.reality-truth-note{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:center;margin-top:18px;padding:14px;border:1px solid var(--line);border-radius:12px}
.reality-truth-note p{margin:3px 0 0;color:var(--muted);font-size:11px}
.reality-truth-note>div:first-child strong{color:var(--reality)}
.reality-truth-note>div:last-child strong{color:var(--truth)}
.interlace-mark{color:color-mix(in srgb,var(--reality) 50%,var(--truth));font-size:20px}
.builder-summary{overflow:hidden}
.builder-summary>header{display:flex;justify-content:space-between;padding:13px;border-bottom:1px solid var(--line)}
.builder-summary>header small{color:var(--muted);letter-spacing:.1em}
.builder-summary>header span{color:var(--reality);font-weight:800}
.builder-summary section{padding:13px;border-bottom:1px solid var(--line)}
.builder-summary h3{margin:0 0 9px;color:var(--muted);font-size:10px;letter-spacing:.1em}
.builder-summary dl{display:grid;grid-template-columns:1fr auto;gap:6px;margin:0;font-size:12px}
.builder-summary dt{color:var(--muted)}
.builder-summary dd{margin:0;font-weight:700}
.summary-item{display:grid;grid-template-columns:52px 1fr;gap:9px;align-items:center;margin:7px 0}
.summary-item img{width:52px;height:40px;object-fit:contain;border:1px solid var(--line);background:var(--surface-3)}
.summary-item span{display:grid}
.summary-item small{color:var(--muted);font-size:9px}
.summary-item.truth strong{color:var(--truth)}
.summary-cta{width:calc(100% - 24px);margin:12px;padding:10px;border:1px solid var(--reality);border-radius:8px;color:#071813;background:var(--reality);font-weight:800}

.prototype-compendium{display:grid;grid-template-columns:280px minmax(0,1fr) 260px;gap:14px;align-items:start}
.wiki-results{overflow:hidden}
.wiki-results>header{padding:14px;border-bottom:1px solid var(--line)}
.wiki-results h2{margin:3px 0 10px}
.wiki-results input{width:100%;padding:9px;border:1px solid var(--line);border-radius:8px;color:var(--text);background:var(--surface-3)}
.wiki-results nav{display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:8px;border-bottom:1px solid var(--line)}
.wiki-results nav button{display:flex;justify-content:space-between;padding:7px;border:1px solid var(--line);border-radius:7px;color:var(--muted);background:var(--surface-3);font-size:10px}
.wiki-results nav button.active{color:var(--text);border-color:var(--reality)}
.result-stack{display:grid;padding:7px}
.result-stack button{display:grid;gap:3px;padding:11px 9px;border:1px solid transparent;border-bottom-color:var(--line);color:var(--text);background:transparent;text-align:left}
.result-stack button.active{border-color:var(--line-strong);border-radius:8px;background:var(--surface-2)}
.result-stack small{color:var(--reality);font-size:9px;letter-spacing:.08em}
.result-stack strong{font-size:12px}
.result-stack span{color:var(--muted);font-size:10px}
.wiki-article{padding:24px;min-width:0}
.article-head{padding-bottom:18px;border-bottom:1px solid var(--line)}
.crumb{color:var(--reality);font-size:9px;font-weight:900;letter-spacing:.1em}
.article-head h1{margin:5px 0 8px;font-size:clamp(32px,4vw,52px);line-height:1}
.article-head>p{margin:0;max-width:75ch;color:var(--muted);font-size:14px}
.tag-row{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.tag-row span{padding:5px 7px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:9px}
.hero-media{margin:18px 0;border:1px solid var(--line);background:var(--surface-3)}
.hero-media img{display:block;width:100%;height:330px;object-fit:contain}
.hero-media figcaption{padding:7px 9px;border-top:1px solid var(--line);color:var(--muted);font-size:9px}
.article-copy{max-width:900px}
.article-copy h2{margin:24px 0 8px;font-size:22px}
.article-copy>p{color:color-mix(in srgb,var(--text) 82%,var(--muted));line-height:1.72}
.article-callout{display:flex;justify-content:space-between;gap:10px;margin:18px 0;padding:12px;border-left:3px solid var(--reality);background:var(--surface-3)}
.article-callout span{color:var(--muted);font-size:11px}
.article-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.article-cards article{padding:13px;border:1px solid var(--line);border-radius:10px;background:var(--surface-3)}
.article-cards small{color:var(--truth);font-size:9px;font-weight:900;letter-spacing:.1em}
.article-cards strong{display:block;margin:4px 0}
.article-cards p{margin:0;color:var(--muted);font-size:11px}
.wiki-infobox{display:grid;gap:0;overflow:hidden}
.wiki-infobox figure{margin:0}
.wiki-infobox figure img{display:block;width:100%;height:150px;object-fit:contain;background:var(--surface-3)}
.wiki-infobox figcaption{padding:8px;border-top:1px solid var(--line);color:var(--muted);font-size:9px}
.wiki-infobox section{padding:13px;border-top:1px solid var(--line)}
.wiki-infobox dl{display:grid;grid-template-columns:1fr auto;gap:6px;margin:8px 0 0;font-size:11px}
.wiki-infobox dt{color:var(--muted)}
.wiki-infobox dd{margin:0;font-weight:700}
.wiki-infobox section>a{display:block;padding:4px 0;color:var(--muted);font-size:11px;text-decoration:none}
.truth-box{border-left:3px solid var(--truth)}
.truth-box strong{color:var(--truth);font-size:9px;letter-spacing:.1em}
.truth-box p{margin:5px 0 0;color:var(--muted);font-size:10px}

/* B — Livre vivant */
.lab--livre-vivant{
  --bg:#d8d9d6;--surface:#ebece8;--surface-2:#f2f2ee;--surface-3:#e2e4e1;
  --line:#b7bbb9;--line-strong:#8e9796;--text:#20282a;--muted:#667174;
  --reality:#1f7f78;--truth:#5b668d;--shadow:0 16px 34px rgba(32,40,42,.13);--radius:2px;
  background:
    linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.2)),
    repeating-linear-gradient(0deg,rgba(33,44,46,.018) 0,rgba(33,44,46,.018) 1px,transparent 1px,transparent 5px),
    var(--bg);
}
.lab--livre-vivant .lab-topbar{background:rgba(225,226,222,.94)}
.lab--livre-vivant .lab-sigil{border-width:2px;font-family:Georgia,serif}
.lab--livre-vivant .lab-intro h1,
.lab--livre-vivant .sheet-head h2,
.lab--livre-vivant .article-head h1,
.lab--livre-vivant .article-copy h2{font-family:Georgia,"Times New Roman",serif;font-weight:500}
.lab--livre-vivant .builder-sheet,
.lab--livre-vivant .wiki-article{
  background:#f0f0ec;
  box-shadow:0 16px 30px rgba(42,50,51,.12),inset 0 0 0 7px #f0f0ec,inset 0 0 0 8px var(--line);
}
.lab--livre-vivant .reality-truth-frame{position:relative}
.lab--livre-vivant .builder-sheet::before,
.lab--livre-vivant .wiki-article::before{
  content:"";position:absolute;inset:10px;pointer-events:none;
  border-top:2px solid var(--reality);border-right:2px solid var(--truth);
  clip-path:polygon(0 0,55% 0,62% 8px,100% 8px,100% 100%,0 100%);
  opacity:.65
}
.lab--livre-vivant .builder-sheet,
.lab--livre-vivant .wiki-article{position:relative}
.lab--livre-vivant .equipment-card,
.lab--livre-vivant .article-cards article{box-shadow:0 7px 16px rgba(42,50,51,.07)}
.lab--livre-vivant .summary-cta{color:#f7fffd}

/* C — Codex hybride */
.lab--codex-hybride{
  --bg:#080d11;--surface:#101820;--surface-2:#162129;--surface-3:#0c1217;
  --line:#283743;--line-strong:#4a6270;--text:#edf3f5;--muted:#93a3af;
  --reality:#48d7b1;--truth:#a99de7;--shadow:0 20px 55px rgba(0,0,0,.32);--radius:12px;
  background:radial-gradient(circle at 12% 0%,#13232b 0,#080d11 34%);
}
.lab--codex-hybride .builder-sheet,
.lab--codex-hybride .wiki-article{
  --surface:#e3e4e1;--surface-2:#eef0ed;--surface-3:#d8dcda;
  --line:#b2b9b8;--line-strong:#879493;--text:#1d282b;--muted:#647174;
  color:var(--text);background:#e3e4e1;
  box-shadow:0 26px 68px rgba(0,0,0,.34),inset 0 0 0 1px rgba(255,255,255,.45)
}
.lab--codex-hybride .builder-sheet .equipment-card,
.lab--codex-hybride .builder-sheet .reality-truth-note,
.lab--codex-hybride .wiki-article .hero-media,
.lab--codex-hybride .wiki-article .article-cards article{
  background:#eef0ed
}
.lab--codex-hybride .sheet-head,
.lab--codex-hybride .article-head{
  border-image:linear-gradient(90deg,var(--reality),var(--truth)) 1;
}
.lab--codex-hybride .sheet-head h2,
.lab--codex-hybride .article-head h1,
.lab--codex-hybride .article-copy h2{font-family:Georgia,"Times New Roman",serif}
.lab--codex-hybride .summary-cta{color:#071813}

/* D — Dossier Umbra */
.lab--dossier-umbra{
  --bg:#242a2d;--surface:#30373b;--surface-2:#394146;--surface-3:#282f33;
  --line:#4b555a;--line-strong:#69757a;--text:#edf0ef;--muted:#b0b8b8;
  --reality:#85c4bd;--truth:#c2a0b5;--shadow:0 18px 38px rgba(0,0,0,.30);--radius:3px;
  background:
    linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px),
    linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),
    #242a2d;background-size:32px 32px
}
.lab--dossier-umbra .lab-topbar{background:rgba(36,42,45,.96)}
.lab--dossier-umbra .lab-sigil{border-style:dashed}
.lab--dossier-umbra .builder-steps,
.lab--dossier-umbra .builder-summary,
.lab--dossier-umbra .wiki-results,
.lab--dossier-umbra .wiki-infobox{box-shadow:6px 8px 0 rgba(0,0,0,.13)}
.lab--dossier-umbra .builder-sheet,
.lab--dossier-umbra .wiki-article{
  position:relative;
  background:#d4d1c8;color:#24282a;--text:#24282a;--muted:#656a6a;--line:#aaa89f;--line-strong:#777d7b;--surface-2:#e0ddd4;--surface-3:#c9c7bf;
  box-shadow:10px 12px 0 rgba(0,0,0,.18)
}
.lab--dossier-umbra .builder-sheet::after,
.lab--dossier-umbra .wiki-article::after{
  content:"DOSSIER · TUC-2035";position:absolute;top:18px;right:-1px;padding:5px 10px;
  border:1px solid #7d7771;border-right:0;background:#c6c1b5;color:#5d5a55;
  font:800 9px/1 Inter,sans-serif;letter-spacing:.12em;transform:rotate(-.5deg)
}
.lab--dossier-umbra .sheet-head h2,
.lab--dossier-umbra .article-head h1{font-family:"Courier New",monospace;font-weight:700;letter-spacing:-.04em}
.lab--dossier-umbra .equipment-copy>small,
.lab--dossier-umbra .crumb,
.lab--dossier-umbra .article-cards small{font-family:"Courier New",monospace}
.lab--dossier-umbra .truth-box{background:rgba(194,160,181,.08)}
.lab--dossier-umbra .summary-cta{color:#202628;background:var(--reality)}

@media(max-width:1250px){
  .prototype-builder{grid-template-columns:220px minmax(0,1fr)}
  .builder-summary{position:static;grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr)}
  .builder-summary>header,.builder-summary>.summary-cta{grid-column:1/-1}
  .prototype-compendium{grid-template-columns:250px minmax(0,1fr)}
  .wiki-infobox{position:static;grid-column:1/-1;display:grid;grid-template-columns:repeat(4,1fr)}
  .wiki-infobox figure{grid-row:1}
}
@media(max-width:900px){
  .lab-topbar{position:static;grid-template-columns:1fr}
  .theme-switcher{overflow:auto;padding-bottom:2px}
  .lab-exit{display:none}
  .lab-intro{align-items:flex-start;flex-direction:column}
  .prototype-builder,.prototype-compendium{grid-template-columns:1fr}
  .builder-steps,.builder-summary,.wiki-results,.wiki-infobox{position:static}
  .builder-steps nav{grid-template-columns:repeat(2,1fr)}
  .builder-summary,.wiki-infobox{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .lab-page{width:min(100% - 12px,1680px);padding-top:14px}
  .theme-switcher a{min-width:max-content}
  .equipment-grid,.article-cards{grid-template-columns:1fr}
  .filter-row{align-items:stretch;flex-wrap:wrap}
  .filter-row label{margin-left:0;width:100%}
  .filter-row input{width:100%}
  .builder-summary,.wiki-infobox{grid-template-columns:1fr}
  .sheet-head{flex-direction:column}
  .hero-media img{height:220px}
}
</style>
