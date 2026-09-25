import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import fastify from "fastify";
import pg from "pg";

// Exercise the real corpus loader and routes, without a database or network.
process.env.DATABASE_URL ||= "postgres://fixture:fixture@127.0.0.1:1/fixture";
let role = null;
let snapshot = [];
let existingSnapshot = false;
let pendingDraft = null;
const writes = [];
const activeId = "realite-v9-grande-californie-2035";
const retiredSamples = ["guide-realite-nouveau-joueur", "verite-046-10-vampires"];
const customRetiredId = "wiki-retired-draft-fixture";
const fixtureCollection = "00000000-0000-4000-8000-000000000001";

const query = async (sql, values = []) => {
  sql = String(sql);
  const result = (rows = []) => ({ rows, rowCount: rows.length });
  if (sql.includes("FROM sessions s")) return result(role ? [{
    id: "audit", email: "audit@example.invalid", display_name: "Audit", role, is_active: true
  }] : []);
  if (sql.includes("FROM compendium_legacy_articles")) {
    return result(existingSnapshot ? snapshot.map((articleId) => ({ articleId })) : []);
  }
  if (sql.includes("INSERT INTO compendium_legacy_articles")) {
    snapshot = values[0];
    return result();
  }
  if (sql.includes("FROM compendium_custom_articles") && sql.includes("WHERE article_id = $1")) {
    return result(values[0] === customRetiredId ? [{ baseDocument: {
      id: customRetiredId, title: "Retired custom draft", category: "OLD", sections: []
    } }] : []);
  }
  if (sql.includes("FROM compendium_article_edits") && sql.includes("WHERE article_id = $1")) {
    return result(pendingDraft ? [pendingDraft] : []);
  }
  if (sql.includes("FROM compendium_favorites")) {
    return result([activeId, retiredSamples[0]].map((articleId) => ({ articleId })));
  }
  if (sql.includes("FROM compendium_collection_items")) {
    return result([activeId, retiredSamples[0]].map((articleId) => ({ collectionId: fixtureCollection, articleId })));
  }
  if (sql.includes("FROM compendium_collections")) {
    return result([{ id: fixtureCollection, name: "Mes lectures", createdAt: "2026-09-23", updatedAt: "2026-09-23" }]);
  }
  if (sql.includes("FROM compendium_history")) {
    return result([activeId, retiredSamples[0]].map((articleId) => ({ articleId, viewedAt: "2026-09-23", viewCount: 1 })));
  }
  if (/^\s*(?:INSERT|UPDATE|DELETE)\b/.test(sql) && sql.includes("compendium_")) writes.push(sql);
  return result();
};
pg.Pool.prototype.query = query;
pg.Pool.prototype.connect = async () => ({ query, release() {} });

const freshModule = await import("../dist/compendium.js?retirement=fresh");
const fresh = await freshModule.getCompendiumQualityCorpus();
assert.ok(snapshot.length > 800, "fresh database records its retirement snapshot");
assert.ok(fresh.articles.length > 2000, "active V2 corpus remains populated");
assert.equal(fresh.articles.filter((article) => article.category === "OLD").length, 0);
const activeIds = new Set(fresh.articles.map((article) => article.id));
const visibleIds = new Set([...activeIds, ...fresh.publicArticles.map((article) => article.id)]);
for (const id of snapshot) {
  assert.ok(!activeIds.has(id), `${id}: retired article excluded`);
  assert.ok(!fresh.navigationIds.includes(id), `${id}: retired navigation excluded`);
}
for (const article of fresh.articles) {
  const text = JSON.stringify(article);
  const targets = [...text.matchAll(/\/compendium\?article=([a-zA-Z0-9%_.~\-]+)/g)].map((match) => decodeURIComponent(match[1]));
  assert.ok(targets.every((target) => !snapshot.includes(target)), `${article.id}: no link to a retired article`);
}
assert.equal(fresh.articles.filter((article) => article.category === "Personnages").length, 918);
assert.equal(fresh.articles.filter((article) => article.category === "Équipement & Objets").length, 697);
assert.equal(fresh.articles.filter((article) => article.category === "Bestiaire").length, 263);

if (process.env.COMPENDIUM_RETIREMENT_BASELINE) {
  const before = JSON.parse(await readFile(process.env.COMPENDIUM_RETIREMENT_BASELINE, "utf8"));
  assert.deepEqual(fresh.articles, before.articles.filter((article) => article.category !== "OLD"),
    "every active private article is byte-for-byte equivalent to the pre-removal corpus");
  assert.deepEqual(fresh.publicArticles, before.publicArticles.filter((article) => article.category !== "OLD"),
    "every active public article is equivalent to the pre-removal corpus");
}

// A previously archived ID legitimately rebuilt in V2 must survive the old snapshot.
existingSnapshot = true;
snapshot = [...snapshot, activeId];
const existingModule = await import("../dist/compendium.js?retirement=existing");
const existing = await existingModule.getCompendiumQualityCorpus();
assert.deepEqual(existing.articles, fresh.articles, "existing snapshot and fresh install expose identical active bodies");
assert.deepEqual(existing.publicArticles, fresh.publicArticles);

const app = fastify();
await existingModule.registerCompendiumRoutes(app);
const request = (url, method = "GET", payload) => app.inject({
  url, method, ...(payload === undefined ? {} : { payload }),
  headers: role ? { cookie: "__Host-tuc_session=audit" } : {}
});

for (role of [null, "player", "gm", "editor", "admin"]) {
  const meta = (await request("/api/compendium/meta")).json();
  assert.equal(meta.total, fresh.articles.length);
  assert.equal(meta.archivedTotal, 0);
  assert.ok(!meta.categories.some((category) => category.name === "OLD"));
  assert.equal((await request("/api/compendium/search?category=OLD")).json().total, 0);
  for (const compact of ["", "?compact=1"]) {
    const entries = (await request(`/api/compendium/wiki-index${compact}`)).json().entries;
    assert.ok(entries.every((article) => article.category !== "OLD" && visibleIds.has(article.id)));
  }
  for (const id of retiredSamples) {
    for (const endpoint of ["articles", "wiki-preview"]) {
      assert.equal((await request(`/api/compendium/${endpoint}/${id}`)).statusCode, 404, `${role}/${endpoint}/${id}`);
    }
  }
  assert.equal((await request(`/api/compendium/articles/${activeId}`)).statusCode, 200);
  const firstSection = fresh.publicArticles.find(article => article.id === activeId)?.sections?.find(section => section.id && section.title);
  assert.ok(firstSection, "a public section exists for anchor preview");
  const sectionPreview = await request(`/api/compendium/wiki-preview/${activeId}?section=${encodeURIComponent(firstSection.id)}`);
  assert.equal(sectionPreview.statusCode, 200);
  assert.equal(sectionPreview.json().sectionTitle, firstSection.title);
  assert.equal((await request(`/api/compendium/wiki-preview/${activeId}?section=unknown-section-anchor`)).statusCode, 404);
  if (role) {
    const library = (await request("/api/compendium/library")).json();
    assert.deepEqual(library.favorites, [activeId]);
    assert.deepEqual(library.favoriteItems.map((article) => article.id), [activeId]);
    assert.deepEqual(library.collections[0].articleIds, [activeId]);
    assert.deepEqual(library.collections[0].items.map((article) => article.id), [activeId]);
    assert.deepEqual(library.recentItems.map((article) => article.id), [activeId]);
    assert.equal((await request(`/api/compendium/history/${retiredSamples[0]}`, "PUT")).statusCode, 404);
    assert.equal((await request(`/api/compendium/favorites/${retiredSamples[0]}`, "PUT")).statusCode, 404);
  }
}

for (role of ["editor", "admin"]) {
  for (const id of [...retiredSamples, customRetiredId]) {
    for (const [suffix, method, payload] of [
      ["", "GET"], ["/draft", "PUT", { article: { title: "Republish", category: "Réalité" } }],
      ["/draft", "DELETE"], ["/publish", "POST"], ["/media", "POST", { data: "fixture" }]
    ]) {
      assert.equal((await request(`/api/compendium/editor/articles/${id}${suffix}`, method, payload)).statusCode,
        404, `${role}: retired editor route ${id}${suffix}`);
    }
  }
  assert.equal((await request("/api/compendium/editor/articles", "POST", { title: "Archive", category: "OLD" })).statusCode, 400);
  assert.equal((await request(`/api/compendium/editor/articles/${activeId}/draft`, "PUT", {
    article: { title: "Archive", category: "OLD", sections: [] }
  })).statusCode, 400);
  const editor = (await request(`/api/compendium/editor/articles/${activeId}`)).json();
  pendingDraft = { baseHash: editor.baseHash, draft: { ...editor.article, category: "OLD" } };
  assert.equal((await request(`/api/compendium/editor/articles/${activeId}/publish`, "POST")).statusCode, 400);
  pendingDraft = null;
}
assert.deepEqual(writes, [], "retired articles never reach database mutation paths");

const onboarding = (await request("/api/compendium/onboarding")).json();
assert.equal(onboarding.basics.length, 4);
assert.equal(onboarding.natures.length, 10);
assert.equal(onboarding.restricted.length, 1);
assert.equal(onboarding.loreHubs.length, 4);
for (const item of [...onboarding.basics, ...onboarding.natures, ...onboarding.restricted, ...onboarding.loreHubs]) {
  for (const key of ["id", "loreId", "rulesId"]) {
    if (item[key]) assert.ok(activeIds.has(item[key]), `${key} ${item[key]} points to an active article`);
  }
}
// Established merged PNJ aliases continue to resolve; no new successor is invented.
assert.equal((await request("/api/compendium/articles/pnj-crawlers-antisysteme-p52-ciara-macfarlane")).json().article.id,
  "pnj-religions-ciara-mcfarlane");
await app.close();
console.log(`COMPENDIUM RETIREMENT OK — ${snapshot.length - 1} archives removed · ${fresh.articles.length} active articles preserved · all roles, editor, libraries, onboarding and fresh/existing snapshots checked`);
