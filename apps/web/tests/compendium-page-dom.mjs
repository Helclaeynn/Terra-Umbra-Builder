// Node 24+. Actual CompendiumPage + router + NPC component in jsdom, no browser.
// API responses are local fixtures; no server, session, or private retrieval.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspect } from "node:util";
import { applyCompendiumPnjStatProfiles } from "../../api/dist/compendium-pnj-stat-profiles.js";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const webRequire = createRequire(process.env.TUC_WEB_TEST_MODULE_ROOT || new URL("../package.json", import.meta.url));
const domRequire = createRequire(process.env.TUC_DOM_TEST_MODULE_ROOT || new URL("../package.json", import.meta.url));
const { build } = webRequire("esbuild");
const { parse, compileScript, compileTemplate } = webRequire("@vue/compiler-sfc");
const { JSDOM, VirtualConsole } = domRequire("jsdom");
const moduleDirectory = path.dirname(path.dirname(webRequire.resolve("vue/package.json")));

// Corpus completeness belongs to API tests; future profiles get a minimal host.
class NpcFixtureMap extends Map {
  get(id) {
    if (!this.has(id)) this.set(id, { id, sections: [{ id: "profil-statistique", title: "Statistiques", blocks: [] }] });
    return super.get(id);
  }
}
const coleId = "pnj-agences-cole-gallagher";
const cole = {
  id: coleId, title: "Cole Gallagher", category: "Personnages", tags: [],
  sections: [
    { id: "public", title: "Présentation publique", level: 2, blocks: [{ type: "p", text: "Présentation publique de la fixture PNJ." }] },
    { id: "profil-statistique", title: "Statistiques", blocks: [] }
  ]
};
const additionalNpcs = [
  ["pnj-148-kai-gehrman", "Kai Gehrman"],
  ["pnj-corporations-baldwin-vandrick", "Baldwin Vandrick"],
  ["personnages-verite-especes-tokala", "Tokala"]
].map(([id, title]) => ({ id, title, category: "Personnages", tags: [], sections: [] }));
applyCompendiumPnjStatProfiles(new NpcFixtureMap([cole, ...additionalNpcs].map(article => [article.id, article])));
const profile = cole.sections.at(-1);
const publicArticle = {
  id: "test-page-publique", title: "Page publique de test", category: "Réalité", tags: [],
  sections: [
    { id: "intro", title: "Introduction", level: 2, blocks: [{ type: "p", text: `[Profil de Cole](/compendium?article=${coleId}&section=profil-statistique)` }] },
    { id: "seconde", title: "Seconde partie", level: 2, blocks: [{ type: "p", text: "Contenu public de la seconde section." }] }
  ]
};
const fixtures = new Map([cole, ...additionalNpcs, publicArticle].map(article => [article.id, article]));
const retiredArticleId = "guide-realite-nouveau-joueur";
const articleUrl = (id, section = "") => `/compendium?article=${id}${section ? `&section=${section}` : ""}`;

const bundle = await build({
  stdin: {
    resolveDir: path.join(repoRoot, "apps/web"), sourcefile: "compendium-page-dom-entry.ts", loader: "ts",
    contents: `
      import { createApp, h, nextTick } from 'vue';
      import { createRouter, createMemoryHistory, RouterView } from 'vue-router';
      import CompendiumPage from './src/pages/CompendiumPage.vue';
      const Placeholder = { render: () => h('p', 'Other route') };
      const router = createRouter({ history: createMemoryHistory(), routes: [
        { path: '/', component: CompendiumPage },
        { path: '/compendium', component: CompendiumPage },
        { path: '/account', component: Placeholder },
        { path: '/compendium/new', component: Placeholder },
        { path: '/compendium/edit/:id', component: Placeholder },
        { path: '/characters/:id/builder', component: Placeholder }
      ] });
      router.afterEach(to => window.history.replaceState(null, '', to.fullPath));
      const app = createApp({ render: () => h(RouterView, null, {
        default: ({ Component, route }) => h(Component, { key: route.path })
      }) }).use(router);
      window.pageTest = {
        ready: router.push(window.__initialRoute).then(() => { app.mount('#app'); return nextTick(); }),
        go: async href => { await router.push(href); await nextTick(); },
        back: () => router.back(),
        route: () => router.currentRoute.value.fullPath,
        unmount: () => app.unmount()
      };
    `
  },
  bundle: true, write: false, format: "iife", platform: "browser", nodePaths: [moduleDirectory],
  define: { "process.env.NODE_ENV": "'test'", __VUE_OPTIONS_API__: "true", __VUE_PROD_DEVTOOLS__: "false", __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false" },
  plugins: [{ name: "vue-local-api", setup(builder) {
    builder.onLoad({ filter: /\.vue$/ }, async ({ path: filename }) => {
      const { descriptor, errors } = parse(await readFile(filename, "utf8"), { filename });
      assert.equal(errors.length, 0, filename);
      if (!descriptor.script && !descriptor.scriptSetup) {
        const compiled = compileTemplate({ source: descriptor.template.content, filename, id: "compendium-page-dom" });
        assert.equal(compiled.errors.length, 0, filename);
        return { contents: `${compiled.code}\nexport default { render };`, loader: "ts", resolveDir: path.dirname(filename) };
      }
      return { contents: compileScript(descriptor, { id: "compendium-page-dom", inlineTemplate: true }).content, loader: "ts", resolveDir: path.dirname(filename) };
    });
    builder.onLoad({ filter: /[/\\]lib[/\\]api\.ts$/ }, () => ({ loader: "ts", contents: `
      export class ApiError extends Error {
        constructor(public status: number, code: string, public body: Record<string, unknown>) { super(code); }
      }
      window.__ApiError = ApiError;
      export const api = (...args: unknown[]) => window.__fakeApi(...args);
    ` }));
  } }]
});

const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(predicate, message, timeout = 1500) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await pause(5);
  }
  assert(predicate(), message);
}

async function mount({ role = null, initialRoute = articleUrl(coleId), authDelay = 20, sendPrivateToUnauthorized = false } = {}) {
  const errors = [], requests = [], landings = [];
  const virtualConsole = new VirtualConsole();
  for (const kind of ["warn", "error"]) virtualConsole.on(kind, (...messages) => errors.push(messages.map(message => typeof message === "string" ? message : inspect(message, { depth: 1 })).join(" ")));
  virtualConsole.on("jsdomError", error => errors.push(error.message));
  const canReadMj = ["gm", "editor", "admin"].includes(role);
  let authFinished = false;
  const fakeApi = async (request, options = {}) => {
    const url = new URL(request, "https://dom-test.invalid");
    requests.push({ path: url.pathname, search: url.search, method: options.method || "GET" });
    if (url.pathname === "/api/auth/me") {
      await pause(authDelay);
      authFinished = true;
      if (!role) throw new Error("not authenticated");
      return { user: { id: "test-user", displayName: "Test", role } };
    }
    if (url.pathname.startsWith("/api/compendium/articles/")) {
      await pause(1);
      const id = decodeURIComponent(url.pathname.split("/").at(-1));
      if (id === retiredArticleId) {
        throw new w.__ApiError(404, "compendium_article_not_found", { error: "compendium_article_not_found" });
      }
      const original = fixtures.get(id);
      if (!original) {
        errors.push(`Unexpected article fetch: ${id}`);
        assert.fail(errors.at(-1));
      }
      const article = structuredClone(original);
      if (!canReadMj && !sendPrivateToUnauthorized) article.sections = article.sections.filter(section => section.audience !== "mj");
      return { article };
    }
    if (url.pathname === "/api/compendium/meta") return {
      version: 2, generated: null, total: fixtures.size, categories: [{ name: "Réalité", count: 1 }, { name: "Personnages", count: 1 }], manufacturers: [],
      expectedTotal: fixtures.size, overrides: { applied: 0, conflicts: 0, missing: 0 }
    };
    if (url.pathname === "/api/compendium/onboarding") return { basics: [], natures: [], restricted: [], loreHubs: [], categories: [] };
    if (url.pathname === "/api/compendium/library") return { favorites: [], favoriteItems: [], collections: [], recentItems: [] };
    if (url.pathname.startsWith("/api/compendium/history")) return {};
    if (url.pathname.startsWith("/api/compendium/builder-usage/")) return { usage: [], sources: [] };
    if (url.pathname === "/api/compendium/talents") return { items: [] };
    if (url.pathname === "/api/compendium/wiki-index") return { entries: [...fixtures.values()].map(article => ({
      id: article.id, title: article.title, category: article.category, dataset: "test", group: "Test", subgroup: "", manufacturer: ""
    })) };
    if (url.pathname === "/api/compendium/search") {
      const category = url.searchParams.get("category");
      const query = (url.searchParams.get("q") || "").toLocaleLowerCase("fr");
      const items = [...fixtures.values()]
        .filter(article => !category || article.category === category)
        .filter(article => !query || article.title.toLocaleLowerCase("fr").includes(query))
        .map(article => ({ id: article.id, title: article.title, category: article.category, dataset: "test", group: "Test", subgroup: "", snippet: "Article actif." }));
      return { items, total: items.length };
    }
    errors.push(`Unexpected API call: ${request}`);
    assert.fail(errors.at(-1));
  };
  const dom = new JSDOM("<!doctype html><div id='app'></div>", {
    url: `https://dom-test.invalid${initialRoute}`, runScripts: "outside-only", pretendToBeVisual: true, virtualConsole,
    beforeParse(window) {
      window.__initialRoute = initialRoute;
      window.__fakeApi = fakeApi;
      window.scrollTo = options => { window.scrollY = Number(options?.top || 0); };
      window.HTMLElement.prototype.scrollIntoView = function(options) { landings.push({ element: this, options }); };
      window.HTMLDialogElement.prototype.showModal = function() { this.open = true; };
      window.HTMLDialogElement.prototype.close = function() { this.open = false; };
      window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
      window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
      window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
    }
  });
  const w = dom.window, d = w.document;
  w.eval(bundle.outputFiles[0].text);
  const page = w.pageTest;
  await page.ready;
  return {
    w, d, page, requests, landings, errors,
    authReady: () => authFinished,
    close() { page.unmount(); dom.window.close(); },
    lastLanding: () => landings.at(-1)?.element
  };
}

let checks = 0;
function check(label, verify) { verify(); checks++; console.log("OK", label); }
function verifyProfile(reader, sourceProfile = profile) {
  const rendered = reader.d.querySelector(".npc-stat-profile");
  assert(rendered, "Authorized profile uses NPC cards");
  const blocks = [...rendered.querySelectorAll("[data-profile-block-index]")];
  assert.deepEqual(blocks.map(block => Number(block.dataset.profileBlockIndex)), sourceProfile.blocks.map((_, index) => index));
  sourceProfile.blocks.forEach((block, index) => {
    if (block.type === "p") assert.equal(blocks[index].querySelector(".npc-profile-paragraph").textContent, block.text);
    else {
      const cells = [...blocks[index].querySelectorAll("[data-profile-source-cell]")];
      assert.equal(cells.length, block.rows.flat().length);
      block.rows.forEach((row, rowIndex) => row.forEach((value, columnIndex) => {
        const key = `${rowIndex}:${columnIndex}`;
        const matches = cells.filter(cell => cell.dataset.profileSourceCell === key);
        assert.equal(matches.length, 1, `Cell ${index}/${key} remains unique`);
        assert.equal(matches[0].textContent, value, `Cell ${index}/${key} remains exact`);
      }));
    }
  });
  const titleCopies = [...reader.d.querySelectorAll("summary,h1,h2,h3,h4,h5,h6")].filter(node => node.textContent.trim() === sourceProfile.title);
  assert.equal(titleCopies.length, 1, "The MJ summary must not duplicate the section title");
}

for (const role of [null, "player"]) {
  const reader = await mount({ role, sendPrivateToUnauthorized: role !== null, initialRoute: articleUrl(coleId, "profil-statistique") });
  try {
    await waitFor(() => reader.authReady() && reader.d.querySelector(".article-header h1"), "Public article loaded");
    await waitFor(() => reader.lastLanding()?.classList.contains("article-header"), "Unavailable section falls back to the article heading");
    check(`${role || "anonymous"} : aucun profil ni titre MJ dans l’article, le sommaire ou le DOM`, () => {
      assert.equal(reader.d.querySelector(".npc-stat-profile,details.mj-section"), null);
      assert(!reader.d.body.textContent.includes(profile.title));
      assert(!reader.d.querySelector('.wiki-toc a[href*="profil-statistique"]'));
      assert(reader.d.body.textContent.includes(cole.sections[0].blocks[0].text));
      assert(reader.lastLanding()?.classList.contains("article-header"), "Unavailable private target falls back to public article heading");
      assert.deepEqual(reader.errors, []);
    });
  } finally { reader.close(); }
}

for (const role of ["gm", "editor", "admin"]) {
  const reader = await mount({ role, initialRoute: articleUrl(coleId, "profil-statistique"), authDelay: 35 });
  try {
    await waitFor(() => reader.authReady() && reader.d.querySelector(".npc-stat-profile"), `${role}: NPC profile mounted after authentication`);
    await waitFor(() => reader.d.querySelector("#wiki-section-profil-statistique details.mj-section")?.open && reader.lastLanding() === reader.d.getElementById("wiki-section-profil-statistique"), `${role}: explicit MJ section opens after delayed authentication`);
    check(`${role} : profil canonique intégral en cartes, sans titre dupliqué`, () => verifyProfile(reader));
    check(`${role} : ancre initiale MJ ouverte et focalisée malgré authentification retardée`, () => {
      const section = reader.d.getElementById("wiki-section-profil-statistique");
      assert.equal(reader.lastLanding(), section);
      assert.equal(reader.d.activeElement, section);
      assert.equal(reader.landings.at(-1).options.behavior, "instant");
    });

    reader.w.scrollY = 1900;
    await reader.page.go(articleUrl(coleId));
    await waitFor(() => reader.lastLanding()?.classList.contains("article-header"), "Plain same-article URL resets to heading");
    check(`${role} : lien sans ancre ramène au début du même article`, () => assert.equal(reader.d.activeElement, reader.lastLanding()));

    await reader.page.go(articleUrl(publicArticle.id, "seconde"));
    await waitFor(() => reader.lastLanding()?.id === "wiki-section-seconde", "Public section navigation landed");
    check(`${role} : changer d’article respecte la section demandée`, () => assert.equal(reader.d.activeElement.id, "wiki-section-seconde"));

    const inlineLink = reader.d.querySelector(`a[href*="article=${coleId}"]`);
    assert(inlineLink, "Actual Markdown link is rendered");
    inlineLink.click();
    await waitFor(() => reader.d.querySelector(".npc-stat-profile") && reader.lastLanding() === reader.d.getElementById("wiki-section-profil-statistique"), "Markdown link retains its section");
    check(`${role} : lien Markdown vers le profil conserve query et destination`, () => assert(reader.d.querySelector("#wiki-section-profil-statistique details").open));

    await reader.page.go("/compendium?view=guide");
    await waitFor(() => reader.d.querySelector('.discovery[data-mode="guide"]'), "Guide opens in the same component");
    check(`${role} : quitter le profil pour le guide ne laisse aucun bloc MJ`, () => assert.equal(reader.d.querySelector(".npc-stat-profile,.article-header"), null));
    reader.page.back();
    await waitFor(() => reader.d.querySelector(".npc-stat-profile") && reader.lastLanding() === reader.d.getElementById("wiki-section-profil-statistique"), "History returns from guide to targeted article");
    check(`${role} : retour historique depuis le guide rétablit le profil ciblé`, () => {
      verifyProfile(reader);
      assert(reader.d.querySelector("#wiki-section-profil-statistique details").open);
      assert.deepEqual(reader.errors, []);
    });
  } finally { reader.close(); }
}
for (const npc of additionalNpcs) {
  const reader = await mount({ role: "gm", initialRoute: articleUrl(npc.id, "profil-statistique") });
  try {
    await waitFor(() => reader.d.querySelector("#wiki-section-profil-statistique details.mj-section")?.open && reader.lastLanding() === reader.d.getElementById("wiki-section-profil-statistique"), `${npc.title}: private profile opened and focused`);
    check(`${npc.title} : profil canonique exact, compétences et résultats en cartes sans calcul ajouté`, () => {
      verifyProfile(reader, npc.sections.at(-1));
      assert(reader.d.querySelector('.npc-profile-block[data-profile-kind="skills"] .npc-profile-skills'));
      assert(reader.d.querySelector('.npc-profile-block[data-profile-kind="derived"] .npc-profile-result'));
      assert.equal(reader.d.querySelector(".npc-profile-calculation"), null);
      assert.equal(reader.d.activeElement, reader.d.getElementById("wiki-section-profil-statistique"));
      assert.deepEqual(reader.errors, []);
    });
  } finally { reader.close(); }
}
{
  const reader=await mount({role:'admin',initialRoute:'/compendium?category=R%C3%A9alit%C3%A9&q=Page'});
  try{
    await waitFor(()=>reader.d.querySelector('.search-active-filters button[aria-label="Retirer la rubrique Réalité"]'),'The active category chip appears');
    reader.d.querySelector('.search-active-filters button[aria-label="Retirer la rubrique Réalité"]').click();
    await waitFor(()=>reader.page.route().includes('q=Page')&&!reader.page.route().includes('category='),'Clearing one filter keeps the search');
    check('un filtre actif se retire sans perdre les autres critères',()=>{
      assert(reader.d.querySelector('.search-active-filters button[aria-label="Retirer la recherche Page"]'));
      assert.equal(reader.d.querySelector('.search-active-filters button[aria-label="Retirer la rubrique Réalité"]'),null);
      assert.deepEqual(reader.errors,[]);
    });
  }finally{reader.close();}
}

{
  const reader = await mount({ role: "admin", initialRoute: "/compendium?category=OLD" });
  try {
    await waitFor(() => reader.authReady() && reader.d.querySelector(".main-result-card"), "Retired category recovers the active article list");
    check("ancienne rubrique OLD : avis de suppression et articles actifs, sans filtre OLD envoyé à l’API", () => {
      const notice = reader.d.querySelector(".archive-retirement-notice");
      assert(notice?.textContent.includes("ont été supprimées"));
      assert.equal(notice.getAttribute("role"), "status");
      const searches = reader.requests.filter(request => request.path === "/api/compendium/search");
      assert(searches.length > 0, "The active corpus is fetched");
      assert(searches.every(request => !new URLSearchParams(request.search).has("category")), "OLD is never sent as a search filter");
      const cards = [...reader.d.querySelectorAll(".main-result-card")];
      assert.equal(cards.length, fixtures.size);
      assert(cards.some(card => card.textContent.includes(publicArticle.title)));
      assert.equal(reader.d.querySelector(".article-unavailable"), null);
      assert.deepEqual(reader.errors, []);
    });
  } finally { reader.close(); }
}

{
  const reader = await mount({ role: "admin", initialRoute: articleUrl(retiredArticleId) });
  try {
    await waitFor(() => reader.authReady() && reader.d.querySelector(".article-unavailable"), "A retired direct URL returns the recovery screen");
    const unavailable = reader.d.querySelector(".article-unavailable");
    const browse = unavailable.querySelector('a[href="/compendium?view=all"]');
    check("article retiré : le 404 affiche une explication et deux liens de repli accessibles", () => {
      assert.equal(unavailable.querySelector("h1").textContent, "Article indisponible");
      assert.equal(unavailable.getAttribute("role"), "status");
      assert(unavailable.textContent.includes("supprimée ou n’est pas accessible"));
      assert.equal(browse?.textContent.trim(), "Parcourir les articles");
      assert.equal(unavailable.querySelector('a[href="/compendium"]')?.textContent.trim(), "Retour à l’accueil");
      assert.equal(reader.d.querySelector(".article-header"), null);
      assert(!reader.requests.some(request => request.path === `/api/compendium/history/${retiredArticleId}`), "Unavailable articles are not recorded as read");
      assert.deepEqual(reader.errors, []);
    });
    browse.click();
    await waitFor(() => reader.d.querySelector(".main-result-card"), "Recovery link opens active articles");
    const activeCard = [...reader.d.querySelectorAll(".main-result-card")].find(card => card.textContent.includes(publicArticle.title));
    assert(activeCard, "The active public article is available in recovery results");
    activeCard.click();
    await waitFor(() => reader.d.querySelector(".article-header h1")?.textContent === publicArticle.title, "An active article opens after the retired-page recovery");
    check("après un article retiré : navigation vers un article actif sans message d’erreur résiduel", () => {
      assert.equal(reader.page.route(), articleUrl(publicArticle.id));
      assert.equal(reader.d.querySelector(".article-unavailable,.compendium-feedback.error"), null);
      assert(reader.d.body.textContent.includes("Contenu public de la seconde section."));
      assert.deepEqual(reader.errors, []);
    });
  } finally { reader.close(); }
}
{
  const reader = await mount({ initialRoute: "/compendium?q=Cole" });
  try {
    const input = () => reader.d.querySelector('input[aria-label="Recherche dans le Compendium"]');
    await waitFor(() => input()?.value === "Cole", "Previous search query restored from URL");
    reader.w.dispatchEvent(new reader.w.KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
    await waitFor(() => reader.page.route() === "/compendium?view=all" && input()?.value === "", "Ctrl K clears URL and search field");
    check("Ctrl K ouvre une recherche vierge, sans rétablir l’ancienne requête de l’URL", () => {
      assert.equal(input().value, "");
      assert.equal(reader.d.activeElement, input());
      assert.deepEqual(reader.errors, []);
    });
  } finally { reader.close(); }
}
console.log(`${checks} integration checks passed using the actual CompendiumPage, router, and NPC profile. No browser layout claim.`);
