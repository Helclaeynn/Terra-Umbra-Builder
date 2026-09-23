// Node 24+. Actual CompendiumPage + router + NPC component in jsdom, no browser.
// API responses are local fixtures; no server, session, or private retrieval.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inspect } from "node:util";
import { applyCompendiumPnjStatProfiles } from "../../api/src/compendium-pnj-stat-profiles.ts";

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
  const canReadMj = ["gm", "admin"].includes(role);
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
    if (url.pathname === "/api/compendium/search") return { items: [], total: 0 };
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

for (const role of [null, "player", "editor"]) {
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

for (const role of ["gm", "admin"]) {
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
console.log(`${checks} integration checks passed using the actual CompendiumPage, router, and NPC profile. No browser layout claim.`);
