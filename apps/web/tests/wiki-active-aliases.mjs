import assert from "node:assert/strict";
import test from "node:test";
import { createWikiLinker } from "../src/lib/wiki-linker.ts";
import {
  WIKI_CASE_SENSITIVE_ALIASES,
  WIKI_EXPLICIT_TARGETS,
  WIKI_SEARCH_FALLBACKS,
  WIKI_STRICT_SURFACE_ALIASES
} from "../src/lib/wiki-data.ts";

// A small index of real, active V2 destinations keeps these tests focused on
// interpreting words in context. Corpus completeness is checked by the API.
const truth = { id: "verite-v7-derriere-le-voile", title: "Vérité — derrière le Voile", category: "Vérité", dataset: "verite-v7" };
const corruption = { id: "verite-v7-six-fleaux-sources-rupture", title: "Les six Fléaux — Sources & Rupture", category: "Vérité", dataset: "verite-v7" };
const hunters = { id: "verite-v7-chasseurs-doctrine-association-traditions", title: "Chasseurs — doctrine, Association & traditions", category: "Vérité", dataset: "verite-v7" };
const mafia = { id: "realite-v9-la-famille", title: "La Famille — mafia italo-américaine", category: "Réalité", dataset: "realite-v9" };

const linker = createWikiLinker([truth, corruption, hunters, mafia], {
  explicitTargets: WIKI_EXPLICIT_TARGETS,
  strictSurfaceAliases: WIKI_STRICT_SURFACE_ALIASES,
  caseSensitiveAliases: WIKI_CASE_SENSITIVE_ALIASES,
  searchFallbacks: WIKI_SEARCH_FALLBACKS,
  hrefForId: id => `/compendium?article=${encodeURIComponent(id)}`
});

function links(text, context) {
  return [...linker.linkify(text, context).matchAll(/<a[^>]+data-wiki-id="([^"]+)"[^>]*>(.*?)<\/a>/g)]
    .map(([, id, label]) => ({ id, label }));
}

test("an equipment family does not resolve to the mafia", () => {
  const equipment = { id: "equipment-page", title: "Armes automatiques", category: "Équipement & Objets" };
  assert.deepEqual(links("La Famille des fusils d'assaut partage ce calibre.", equipment), []);
  assert.deepEqual(links("La Famille contrôle ce territoire.", { id: "city", category: "Réalité" }), [
    { id: mafia.id, label: "La Famille" }
  ]);
});

test("curated aliases may target a section without relying on a matching title", () => {
  const sections = createWikiLinker([mafia], {
    explicitTargets: { "hiérarchie des parrains": { id: mafia.id, section: "organisation" } },
    hrefForId: id => `/compendium?article=${id}`,
    hrefForSection: (id, section) => `/compendium?article=${id}#${section}`
  });
  assert.match(sections.linkify("La hiérarchie des parrains est stricte.", { id: "other", category: "Réalité" }),
    /href="\/compendium\?article=realite-v9-la-famille#organisation" data-wiki-id="realite-v9-la-famille" data-wiki-section="organisation"/);
});

test("Corruption distinguishes political usage while occult aliases keep their active destination", () => {
  const civic = { id: "realite-v9-grande-californie-2035", title: "Grande Californie en 2035", category: "Réalité" };
  assert.deepEqual(links("Corruption politique et détournement de fonds.", civic), []);

  for (const label of ["Corruption", "Souillure"]) {
    assert.deepEqual(links(`${label} provoquée par une Source occulte.`, civic), [{ id: corruption.id, label }]);
  }
  // Fléau and Corruption now share a destination, but only the latter needs
  // the ambiguity guard; a bare proper-name alias must still resolve.
  assert.deepEqual(links("Un Fléau approche.", civic), [{ id: corruption.id, label: "Fléau" }]);
});

test("se révéler does not turn an ordinary expression into a Truth link", () => {
  const context = { id: "realite-v9-grande-californie-2035", title: "Grande Californie en 2035", category: "Réalité" };
  assert.deepEqual(links("Se révéler utile dans cette enquête.", context), []);
  assert.deepEqual(links("Cette personne peut se révéler utile.", context), []);
  assert.deepEqual(links("Il choisit de se révéler à la Vérité.", context), [
    { id: truth.id, label: "se révéler à la Vérité" }
  ]);
  assert.deepEqual(links("Il choisit de se Révéler.", context), [{ id: truth.id, label: "se Révéler" }]);
});

test("Chasseur names the weapon on its equipment pages and the doctrine in lore", () => {
  for (const id of ["equipement-011-owl-lc-014-chasseur", "verite-catalogue-008-owl-lc-014-chasseur"]) {
    assert.deepEqual(links("Le Chasseur possède un chargeur.", {
      id, title: "OWL LC-014 Chasseur", category: "Équipement & Objets"
    }), []);
  }
  const context = { id: truth.id, title: truth.title, category: truth.category };
  assert.deepEqual(links("Un Chasseur protège les habitants.", context), [{ id: hunters.id, label: "Chasseur" }]);
  assert.deepEqual(links("Les Chasseurs suivent leur doctrine.", context), [{ id: hunters.id, label: "Chasseurs" }]);
});
