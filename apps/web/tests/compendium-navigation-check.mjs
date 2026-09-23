import assert from "node:assert/strict";
import test from "node:test";
import {
  compendiumHref,
  compendiumLinkTarget,
  compendiumTarget,
  positionCompendiumArticle,
  searchResultTarget
} from "../src/lib/compendium-navigation.ts";

const baseUrl = "https://terra.example/compendium?article=origine";

// Minimal DOM surface: unlike a browser, focus and scroll record their effects
// synchronously so a stale reading position cannot conceal a missing reset.
function readerFixture(articleId = "origine") {
  const page = { activeElement: null, scrollY: 1900, effects: [] };
  function element(id, offsetTop, children = []) {
    return {
      id,
      offsetTop,
      children,
      attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      focus(options) {
        page.activeElement = this;
        page.effects.push({ action: "focus", id, options });
        if (!options?.preventScroll) page.scrollY = offsetTop;
      },
      scrollIntoView(options) {
        page.scrollY = offsetTop;
        page.effects.push({ action: "scroll", id, options });
      },
      querySelector(selector) { return this.children.find(child => child.selector === selector) ?? null; },
      querySelectorAll(selector) { return this.children.filter(child => child.selector === selector); }
    };
  }
  const header = Object.assign(element(`${articleId}-header`, 320), { selector: ".article-header" });
  const intro = Object.assign(element("wiki-section-intro", 520), { selector: ".article-section" });
  const mjDetails = { selector: "details.mj-section", open: false };
  const secret = Object.assign(element("wiki-section-secret", 1350, [mjDetails]), { selector: ".article-section" });
  const section = Object.assign(element("wiki-section-section-3", 2300), { selector: ".article-section" });
  const accent = Object.assign(element("wiki-section--nergie-du-Qi", 2900), { selector: ".article-section" });
  const panel = element(`${articleId}-panel`, 280, [header, intro, secret, section, accent]);
  const sections = [{ id: "intro" }, { id: "secret" }, { id: "section-3" }, { id: "énergie du Qi" }];
  return { page, panel, header, intro, secret, section, accent, mjDetails, sections };
}

function expectPosition(fixture, destination) {
  assert.equal(fixture.page.scrollY, destination.offsetTop);
  assert.equal(fixture.page.activeElement, destination);
  assert.equal(destination.attributes.tabindex, "-1");
  assert.deepEqual(fixture.page.effects.slice(-2), [
    { action: "focus", id: destination.id, options: { preventScroll: true } },
    { action: "scroll", id: destination.id, options: { behavior: "instant", block: "start" } }
  ]);
}

test("shared article targets accept query section, sectionId, and encoded native fragments", () => {
  assert.deepEqual(compendiumTarget({ article: "verite-qi", section: "secret" }), {
    articleId: "verite-qi", section: "secret"
  });
  assert.deepEqual(compendiumLinkTarget("#intro", "https://terra.example/compendium?article=verite-qi&section=secret"), {
    articleId: "verite-qi", section: "intro"
  });
  assert.deepEqual(compendiumTarget({ article: "verite-qi", sectionId: "section-3" }), {
    articleId: "verite-qi", section: "section-3"
  });
  assert.deepEqual(compendiumTarget({ article: "verite-qi" }, "#%C3%A9nergie%20du%20Qi"), {
    articleId: "verite-qi", section: "énergie du Qi"
  });
  assert.deepEqual(compendiumTarget({ article: "verite-qi" }), { articleId: "verite-qi", section: "" });
  assert.equal(compendiumTarget({ q: "Qi" }), null);
});

test("previous-generation article@section bookmarks retain their destination", () => {
  assert.deepEqual(compendiumTarget({}, "#/article/verite-qi@section-3"), {
    articleId: "verite-qi", section: "section-3"
  });
  assert.deepEqual(compendiumTarget({}, "#/article/verite-qi@%C3%A9nergie%20du%20Qi"), {
    articleId: "verite-qi", section: "énergie du Qi"
  });
  assert.deepEqual(compendiumTarget({}, "#/article/verite-qi"), { articleId: "verite-qi", section: "" });
});

test("only same-origin Compendium links become internal article navigation", () => {
  assert.deepEqual(compendiumLinkTarget("/compendium?article=verite-qi#section-3", baseUrl), {
    articleId: "verite-qi", section: "section-3"
  });
  assert.deepEqual(compendiumLinkTarget("https://terra.example/?article=verite-qi&sectionId=secret", baseUrl), {
    articleId: "verite-qi", section: "secret"
  });
  assert.deepEqual(compendiumLinkTarget("/compendium/#/article/verite-qi@section-3", baseUrl), {
    articleId: "verite-qi", section: "section-3"
  });
  for (const href of [
    "https://elsewhere.example/compendium?article=verite-qi#secret",
    "//elsewhere.example/compendium?article=verite-qi",
    "/compendium/edit/verite-qi",
    "/characters/person/builder?article=verite-qi",
    "javascript:alert(1)",
    "/compendium?q=Qi"
  ]) assert.equal(compendiumLinkTarget(href, baseUrl), null, href);
  const shared = compendiumHref("article avec espace", "énergie du Qi");
  assert.equal(shared, "/compendium?article=article%20avec%20espace#%C3%A9nergie%20du%20Qi");
  assert.deepEqual(compendiumLinkTarget(shared, baseUrl), {
    articleId: "article avec espace", section: "énergie du Qi"
  });
});

test("search results follow explicit targets and otherwise start at the article heading", () => {
  const explicit = searchResultTarget({ id: "verite-qi", sectionId: "section-3", snippet: "Un extrait sans identifiant." }, baseUrl);
  assert.deepEqual(explicit, { articleId: "verite-qi", section: "section-3" });
  assert.deepEqual(searchResultTarget({ id: "verite-qi", section: "secret" }, baseUrl), {
    articleId: "verite-qi", section: "secret"
  });
  assert.deepEqual(searchResultTarget({ id: "verite-qi", href: "/compendium?article=verite-qi#secret" }, baseUrl), {
    articleId: "verite-qi", section: "secret"
  });
  for (const result of [
    { id: "verite-qi", snippet: "section-3 : énergie du Qi" },
    { id: "verite-qi", href: "/compendium?article=autre#secret" },
    { id: "verite-qi", href: "https://elsewhere.example/compendium?article=verite-qi#secret" }
  ]) {
    const target = searchResultTarget(result, baseUrl);
    assert.deepEqual(target, { articleId: "verite-qi", section: "" });
    const fixture = readerFixture("verite-qi");
    positionCompendiumArticle(fixture.panel, fixture.sections, target.section);
    expectPosition(fixture, fixture.header);
  }
  const fixture = readerFixture("verite-qi");
  positionCompendiumArticle(fixture.panel, fixture.sections, explicit.section);
  expectPosition(fixture, fixture.section);
});

test("a reader at mid-article follows a new article at its heading, then a section on the same article", () => {
  const fixture = readerFixture("destination");
  assert.equal(fixture.page.scrollY, 1900);
  const articleLink = compendiumLinkTarget("/compendium?article=destination", baseUrl);
  assert.equal(articleLink.articleId, "destination");
  positionCompendiumArticle(fixture.panel, fixture.sections, articleLink.section);
  expectPosition(fixture, fixture.header);

  fixture.page.scrollY = 1900;
  const sectionLink = compendiumLinkTarget("#section-3", "https://terra.example/compendium?article=destination");
  assert.equal(sectionLink.articleId, "destination");
  positionCompendiumArticle(fixture.panel, fixture.sections, sectionLink.section);
  expectPosition(fixture, fixture.section);

  // Selecting the current article again is still an intentional return to its start.
  positionCompendiumArticle(fixture.panel, fixture.sections, articleLink.section);
  expectPosition(fixture, fixture.header);
});

test("source IDs, encoded accents, and existing DOM fragments find the intended section", () => {
  const fixture = readerFixture();
  const target = compendiumTarget({ article: "origine" }, "#%C3%A9nergie%20du%20Qi");
  positionCompendiumArticle(fixture.panel, fixture.sections, target.section);
  expectPosition(fixture, fixture.accent);
  positionCompendiumArticle(fixture.panel, fixture.sections, "wiki-section-section-3");
  expectPosition(fixture, fixture.section);
});

test("an unknown section or an absent rendered section recovers at the article heading", () => {
  const fixture = readerFixture();
  positionCompendiumArticle(fixture.panel, fixture.sections, "deleted-section");
  expectPosition(fixture, fixture.header);
  fixture.page.scrollY = 1900;
  fixture.panel.children = fixture.panel.children.filter(child => child !== fixture.section);
  positionCompendiumArticle(fixture.panel, fixture.sections, "section-3");
  expectPosition(fixture, fixture.header);
});

test("an explicit MJ section opens its disclosure before reading and receives focus", () => {
  const fixture = readerFixture();
  assert.equal(fixture.mjDetails.open, false);
  const scrollIntoView = fixture.secret.scrollIntoView;
  fixture.secret.scrollIntoView = options => {
    assert.equal(fixture.mjDetails.open, true, "MJ content must be exposed before positioning");
    scrollIntoView(options);
  };
  positionCompendiumArticle(fixture.panel, fixture.sections, "secret");
  expectPosition(fixture, fixture.secret);
});
