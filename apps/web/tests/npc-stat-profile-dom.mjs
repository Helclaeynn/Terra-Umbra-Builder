// Node 24+. Compiles and mounts the actual Vue SFC in jsdom; no browser or server.
// Optional TUC_WEB_TEST_MODULE_ROOT / TUC_DOM_TEST_MODULE_ROOT point to package.json
// files whose node_modules provide Vue/compiler-sfc/esbuild and jsdom respectively.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const webRequire = createRequire(process.env.TUC_WEB_TEST_MODULE_ROOT || new URL("../package.json", import.meta.url));
const domRequire = createRequire(process.env.TUC_DOM_TEST_MODULE_ROOT || new URL("../package.json", import.meta.url));
const { build } = webRequire("esbuild");
const { parse, compileScript } = webRequire("@vue/compiler-sfc");
const { JSDOM, VirtualConsole } = domRequire("jsdom");
const { applyCompendiumPnjStatProfiles } = await import("../../api/dist/compendium-pnj-stat-profiles.js");
const { isNpcStatProfileSection, profileBlockKind, profileTableRows } = await import("../src/lib/npc-stat-profile.ts");

// Exercise the canonical API producer, rather than copying its statistics here.
// Corpus completeness belongs to API tests; future profiles get a minimal host.
class NpcFixtureMap extends Map {
  get(id) {
    if (!this.has(id)) this.set(id, { id, sections: [{ id: "profil-statistique", title: "Statistiques", blocks: [] }] });
    return super.get(id);
  }
}
const articles = [
  "pnj-agences-cole-gallagher",
  "pnj-148-kai-gehrman",
  "pnj-corporations-baldwin-vandrick",
  "personnages-verite-especes-tokala"
].map(id => ({ id, sections: [{ id: "profil-statistique", title: "Statistiques", blocks: [] }] }));
applyCompendiumPnjStatProfiles(new NpcFixtureMap(articles.map(article => [article.id, article])));
const [article] = articles;
const additionalProfiles = articles.slice(1).map(article => structuredClone(article.sections.at(-1)));
const section = article.sections.at(-1);
const canonicalBlocks = structuredClone(section.blocks);
const canonicalSnapshot = JSON.stringify(canonicalBlocks);

// This intentionally small renderer uses DOM APIs to escape all source text.
// Only internal Markdown links are interpreted; no raw HTML is trusted.
function safeInline(window, value) {
  const text = String(value ?? "");
  const span = window.document.createElement("span");
  span.dataset.inlineSource = text;
  const links = /\[([^\]]+)\]\((\/compendium\/[^\s)]+)\)/g;
  let offset = 0;
  for (const match of text.matchAll(links)) {
    span.append(window.document.createTextNode(text.slice(offset, match.index)));
    const link = window.document.createElement("a");
    link.setAttribute("href", match[2]);
    link.textContent = match[1];
    span.append(link);
    offset = match.index + match[0].length;
  }
  span.append(window.document.createTextNode(text.slice(offset)));
  return span.outerHTML;
}

const moduleDirectory = path.dirname(path.dirname(webRequire.resolve("vue/package.json")));
const compiled = await build({
  stdin: {
    resolveDir: path.join(repoRoot, "apps/web"), sourcefile: "npc-stat-profile-dom-entry.ts", loader: "ts",
    contents: `
      import { createApp, h, ref, nextTick } from 'vue';
      import NpcStatProfile from './src/components/NpcStatProfile.vue';
      const blocks = ref(window.__canonicalBlocks);
      const app = createApp({ setup: () => () => h(NpcStatProfile, {
        blocks: blocks.value, renderInline: window.__renderInline
      }) });
      app.mount('#app');
      window.npcProfileTest = {
        set: async value => { blocks.value = value; await nextTick(); },
        snapshot: () => JSON.stringify(blocks.value),
        unmount: () => app.unmount()
      };
    `
  },
  bundle: true, write: false, format: "iife", platform: "browser", nodePaths: [moduleDirectory],
  define: { "process.env.NODE_ENV": "'test'", __VUE_OPTIONS_API__: "true", __VUE_PROD_DEVTOOLS__: "false", __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false" },
  plugins: [{ name: "vue-sfc", setup(builder) {
    builder.onLoad({ filter: /\.vue$/ }, async ({ path: filename }) => {
      const source = await readFile(filename, "utf8");
      const { descriptor, errors } = parse(source, { filename });
      assert.equal(errors.length, 0, filename);
      const script = compileScript(descriptor, { id: "npc-profile-dom", inlineTemplate: true });
      return { contents: script.content, loader: "ts", resolveDir: path.dirname(filename) };
    });
  } }]
});
const errors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", error => errors.push(error.message));
virtualConsole.on("error", (...messages) => errors.push(messages.join(" ")));
virtualConsole.on("warn", (...messages) => errors.push(messages.join(" ")));
const dom = new JSDOM("<!doctype html><section><h2 id='profile-title'></h2><div id='app'></div></section>", {
  url: "https://dom-test.invalid/", runScripts: "outside-only", pretendToBeVisual: true, virtualConsole,
  beforeParse(window) {
    window.__canonicalBlocks = structuredClone(canonicalBlocks);
    window.__renderInline = text => safeInline(window, text);
  }
});
const { document } = dom.window;
document.querySelector("#profile-title").textContent = section.title;
dom.window.eval(compiled.outputFiles[0].text);
const test = dom.window.npcProfileTest;
let checks = 0;
function check(label, verify) {
  verify();
  checks++;
  console.log("OK", label);
}
const renderedBlocks = () => [...document.querySelectorAll("#app [data-profile-block-index]")];
const sourceStrings = blocks => blocks.flatMap(block => block.type === "p" ? [block.text] : block.rows.flat());
const inlineStrings = root => [...root.querySelectorAll("[data-inline-source]")].map(node => node.dataset.inlineSource);
const sorted = values => [...values].sort();

function verifySourceBlocks(blocks) {
  const rendered = renderedBlocks();
  assert.equal(rendered.length, blocks.length, "Each source block is rendered exactly once");
  assert.deepEqual(rendered.map(node => Number(node.dataset.profileBlockIndex)), blocks.map((_, index) => index), "Source block order is unchanged");
  for (const [index, block] of blocks.entries()) {
    const node = rendered[index];
    if (block.type === "p") {
      const paragraphs = node.matches("p.npc-profile-paragraph") ? [node] : [...node.querySelectorAll("p.npc-profile-paragraph")];
      assert.equal(paragraphs.length, 1, `Block ${index}: one canonical paragraph`);
      assert.deepEqual(inlineStrings(node), [block.text], `Block ${index}: full paragraph passed to the inline renderer once`);
      const reference = document.createElement("div");
      reference.innerHTML = safeInline(dom.window, block.text);
      assert.equal(paragraphs[0].textContent, reference.textContent, `Block ${index}: full visible paragraph retained`);
      continue;
    }
    const cells = [...node.querySelectorAll("[data-profile-source-cell]")];
    const expectedCells = block.rows.flatMap((row, rowIndex) => row.map((value, columnIndex) => ({ key: `${rowIndex}:${columnIndex}`, value })));
    assert.equal(cells.length, expectedCells.length, `Block ${index}: no missing or additional source cell`);
    for (const { key, value } of expectedCells) {
      const matching = cells.filter(cell => cell.dataset.profileSourceCell === key);
      assert.equal(matching.length, 1, `Block ${index}, cell ${key}: rendered exactly once`);
      assert.deepEqual(inlineStrings(matching[0]), [value], `Block ${index}, cell ${key}: full canonical text passed once`);
      const reference = document.createElement("div");
      reference.innerHTML = safeInline(dom.window, value);
      assert.equal(matching[0].textContent, reference.textContent, `Block ${index}, cell ${key}: full visible text retained`);
    }
  }
  assert.deepEqual(sorted(inlineStrings(document.querySelector("#app"))), sorted(sourceStrings(blocks)), "All source strings, including repeats, are rendered with their exact multiplicities");
}

try {
  check("La section canonique est reconnue sans dépendre des chiffres du profil", () => {
    assert.equal(isNpcStatProfileSection(section), true);
    assert.equal(isNpcStatProfileSection({ id: "profil-statistique", title: "Profil futur", blocks: [] }), true);
    assert.equal(isNpcStatProfileSection({ title: "Statistiques", blocks: [] }), true);
    assert.equal(isNpcStatProfileSection({ title: "Profil statistique · Autre PNJ", blocks: [] }), true);
    assert.equal(isNpcStatProfileSection({ id: "profil", title: "Profil", blocks: canonicalBlocks }), false);
  });
  check("Les catégories de blocs suivent le profil canonique", () => {
    assert.deepEqual(canonicalBlocks.map(profileBlockKind), ["paragraph", "attributes", "skills", "derived", "paragraph", "talents", "paragraph"]);
    for (const block of canonicalBlocks.filter(block => block.type === "table")) assert.deepEqual(profileTableRows(block), block.rows);
  });
  const truthBlocks = [
    { type: "table", rows: [["Attribut révélé", "Vigueur", "Agilité", "Esprit", "Volonté", "Charisme"], ["Valeur proposée", "10", "10", "12", "13", "11"]] },
    { type: "table", rows: [["Compétence de Vérité saillante", "Rang proposé"], ["Autorité", "21"], ["Tir", "19"], ["Diplomatie", "18"]] }
  ];
  await test.set(truthBlocks);
  check("Karina : attributs et compétences de Vérité sont visibles dans le profil statistique", () => {
    assert.deepEqual(truthBlocks.map(profileBlockKind), ["attributes", "skills"]);
    verifySourceBlocks(truthBlocks);
    assert.equal(document.querySelectorAll(".npc-profile-attribute").length, 5);
    assert.equal(document.querySelectorAll(".npc-profile-skill-group").length, 3);
  });
  await test.set(canonicalBlocks);
  check("Chaque paragraphe et cellule canonique paraît en entier une seule fois, dans l’ordre des blocs", () => verifySourceBlocks(canonicalBlocks));
  check("Le titre porté par le parent n’est pas dupliqué dans le composant", () => {
    const titles = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,summary")].filter(node => node.textContent === section.title);
    assert.equal(titles.length, 1);
    assert.equal(document.querySelector("#app").textContent.includes(section.title), false);
  });
  check("Le rendu ne modifie aucun bloc canonique", () => assert.equal(test.snapshot(), canonicalSnapshot));

  for (const profile of additionalProfiles) {
    const snapshot = JSON.stringify(profile.blocks);
    document.querySelector("#profile-title").textContent = profile.title;
    await test.set(structuredClone(profile.blocks));
    check(`${profile.title} : chaque paragraphe et cellule source reste intégral et unique`, () => {
      assert.equal(isNpcStatProfileSection(profile), true);
      verifySourceBlocks(profile.blocks);
      assert.equal(test.snapshot(), snapshot, "Rendering must not mutate any source block");
      for (const block of profile.blocks.filter(block => block.type === "table")) assert.deepEqual(profileTableRows(block), block.rows);
    });
    check(`${profile.title} : Compétence au singulier est présentée en groupes de compétences`, () => {
      assert.deepEqual(profile.blocks.map(profileBlockKind), ["paragraph", "attributes", "skills", "derived", "paragraph", "paragraph"]);
      const skillsIndex = profile.blocks.findIndex(block => block.type === "table" && block.rows[0][0] === "Compétence");
      assert(skillsIndex >= 0, "Canonical fixture exercises the singular Compétence header");
      const skills = renderedBlocks()[skillsIndex];
      assert(skills.querySelector(".npc-profile-skills"), "Singular header must retain the skill-card presentation");
      assert.equal(skills.querySelector('[data-profile-source-cell="0:0"]').textContent, profile.blocks[skillsIndex].rows[0][0]);
    });
    check(`${profile.title} : dérivées à deux colonnes sans formule ou titre ajouté`, () => {
      const derivedIndex = profile.blocks.findIndex(block => block.type === "table" && block.rows[0][0] === "Valeur dérivée");
      assert(derivedIndex >= 0);
      const derivedSource = profile.blocks[derivedIndex];
      assert(derivedSource.rows.every(row => row.length === 2), "Canonical fixture exercises the two-column derived values");
      const derived = renderedBlocks()[derivedIndex];
      assert(derived.querySelector(".npc-profile-derived"), "Two-column values must retain the derived-card presentation");
      assert.equal(derived.querySelector(".npc-profile-calculation"), null, "No calculation exists in the source");
      assert.deepEqual([...derived.querySelectorAll(".npc-profile-result")].map(node => node.textContent), derivedSource.rows.slice(1).map(row => row[1]), "Results must be the source result strings without recalculation");
      const withoutSource = derived.cloneNode(true);
      withoutSource.querySelectorAll("[data-profile-source-cell]").forEach(node => node.remove());
      assert.equal(withoutSource.textContent.trim(), "", "The renderer adds no invented formula or other derived text");
      assert.equal([...document.querySelectorAll("h1,h2,h3,h4,h5,h6,summary")].filter(node => node.textContent === profile.title).length, 1);
      assert.equal(document.querySelector("#app").textContent.includes(profile.title), false);
    });
  }

  const linkTarget = "/compendium/regles-pnj-talents-statistiques?section=talents-expertise#talents-expertise";
  const linkedText = `[Talents PNJ](${linkTarget})`;
  const hostileText = '<img src=x onerror="window.__unsafe = true"> & texte intégral';
  const fallbackBlocks = [
    { type: "p", text: `Avant ${linkedText}.` },
    { type: "table", rows: [["Champ inédit", "Valeur libre", "Note"], ["Référence", linkedText, hostileText]] },
    { type: "p", text: `Après ${hostileText}.` }
  ];
  await test.set(fallbackBlocks);
  check("Un tableau inconnu reste un tableau complet entre ses paragraphes", () => {
    assert.equal(profileBlockKind(fallbackBlocks[1]), "table");
    verifySourceBlocks(fallbackBlocks);
    const table = renderedBlocks()[1].querySelector("table");
    assert(table, "Fallback retains a semantic table");
    assert.deepEqual([...table.rows].map(row => row.cells.length), fallbackBlocks[1].rows.map(row => row.length));
  });
  check("Les liens rendus restent actifs et conservent query et ancre", () => {
    const links = [...document.querySelectorAll("#app a")];
    assert.equal(links.length, 2);
    for (const link of links) {
      assert.equal(link.getAttribute("href"), linkTarget);
      assert.equal(link.textContent, "Talents PNJ");
    }
  });
  check("Le mock échappe le HTML source sans perdre son texte", () => {
    assert.equal(document.querySelector("#app img,#app script"), null);
    assert.equal(dom.window.__unsafe, undefined);
    assert(document.querySelector("#app").textContent.includes(hostileText));
  });

  await test.set(canonicalBlocks);
  document.querySelector("#profile-title").textContent = section.title;
  check("Remplacer les données puis revenir au profil canonique conserve l’intégralité du rendu", () => verifySourceBlocks(canonicalBlocks));
  check("Aucune erreur ni alerte Vue ou DOM", () => assert.deepEqual(errors, []));
  console.log(`${checks} checks passed using the actual Vue component and ${articles.length} canonical API profiles. No browser layout claim.`);
} finally {
  test.unmount();
  dom.window.close();
}
