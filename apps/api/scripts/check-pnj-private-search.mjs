import assert from "node:assert/strict";
import pg from "pg";
import fastify from "fastify";

let role = null;
pg.Pool.prototype.query = async function (sql) {
  if (String(sql).includes("FROM sessions s")) {
    return { rows: role ? [{ id: "audit", email: "audit@example.invalid", display_name: "Audit", role, is_active: true }] : [], rowCount: role ? 1 : 0 };
  }
  return { rows: [], rowCount: 0 };
};

const { registerCompendiumRoutes, getCompendiumQualityCorpus } = await import("../dist/compendium.js");
const app = fastify();
await registerCompendiumRoutes(app);

// A fresh database and an existing OLD snapshot must expose the same active
// religious profiles. This check runs against the fresh database simulation.
const corpus = await getCompendiumQualityCorpus();
assert.equal(corpus.articles.filter((item) => item.category === "Personnages").length, 918);
assert.equal(corpus.articles.filter((item) =>
  item.dataset === "realite-v9-religions-pnj" && item.category === "Personnages").length, 15);
const mergedCiara = corpus.articles.find((item) => item.id === "pnj-religions-ciara-mcfarlane");
assert.ok(mergedCiara.sections.some((section) => section.id === "antisysteme-p52-realite"));
assert.ok(!corpus.articles.some((item) => item.id === "pnj-crawlers-antisysteme-p52-ciara-macfarlane"));

const search = async (value) => {
  const response = await app.inject({
    method: "GET",
    url: `/api/compendium/search?category=Personnages&q=${encodeURIComponent(value)}`,
    headers: role ? { cookie: "__Host-tuc_session=audit" } : {}
  });
  assert.equal(response.statusCode, 200, response.body);
  return response.json();
};

for (const audience of [null, "editor"]) {
  role = audience;
  assert.equal((await search('tag:"vérité/espèce/loup-garou"')).total, 0);
  assert.equal((await search('tag:"vérité/nom/Mirrissi"')).total, 0);
  assert.equal((await search("Mirrissi")).total, 0);
  assert.ok(!(await search("Thar’lal Rark")).items.some((item) => item.title === "Thor"));
  assert.ok(!(await search("Siadara")).items.some((item) => item.title === "Sianna Danein"));
  assert.ok(!(await search("Morrighan")).items.some((item) => item.title === "Moira Blake"));
  assert.ok((await search("Thor")).items.some((item) => item.id === "personnages-verite-fantastiques-thor"));
  assert.ok(!(await search("Viviane")).items.some((item) => item.id === "pnj-loges-mages-nina-le-guellec-03"));
  assert.ok((await search('tag:"réalité/faction/corporatiste"')).total > 0);
  const response = await app.inject({
    method: "GET",
    url: "/api/compendium/articles/pnj-agences-cole-gallagher",
    headers: role ? { cookie: "__Host-tuc_session=audit" } : {}
  });
  assert.equal(response.statusCode, 200);
  assert.equal(response.json().article.sections.some((section) => section.id === "profil-statistique"), audience === "editor");
  const privateArticle = await app.inject({
    method: "GET", url: "/api/compendium/articles/regles-pnj-talents-statistiques",
    headers: role ? { cookie: "__Host-tuc_session=audit" } : {}
  });
  assert.equal(privateArticle.statusCode, audience === "editor" ? 200 : 404);
}

for (const audience of ["gm", "admin"]) {
  role = audience;
  assert.ok((await search('tag:"vérité/espèce/loup-garou"')).total > 0);
  assert.ok((await search('tag:"vérité/nom/Mirrissi"')).total > 0);
  assert.equal((await search("Viviane")).items[0]?.id, "pnj-loges-mages-nina-le-guellec-03");
  assert.ok((await search("Thar’lal Rark")).items.some((item) => item.id === "personnages-verite-fantastiques-tharlal-rark"));
  assert.ok((await search('tag:"vérité/nom/Morrighan"')).items.some((item) => item.id === "personnages-verite-humains-galactiques-moira-blake"));
  assert.ok((await search('tag:"vérité/nom/Fée Viviane – Dame du lac"')).items
    .some((item) => item.id === "pnj-loges-mages-nina-le-guellec-03"));
}

role = null;
const response = await app.inject({ method: "GET", url: "/api/compendium/articles/pnj-140-benedicte-vilhelmsen" });
assert.equal(response.statusCode, 200);
const publicArticle = response.json().article;
assert.equal(publicArticle.secretTags, undefined);
assert.ok(!(publicArticle.tags ?? []).some((tag) => /loup|pelage|v[ée]rit[ée]/i.test(tag)));

const article = async (id) => {
  const reply = await app.inject({
    method: "GET", url: `/api/compendium/articles/${id}`,
    headers: role ? { cookie: "__Host-tuc_session=audit" } : {}
  });
  assert.equal(reply.statusCode, 200, reply.body);
  return reply.json().article;
};
const publicMilda = await article("pnj-pegre-milda-tarasknovna");
assert.equal(publicMilda.realityName, "Milda Tarasknovna");
assert.ok(publicMilda.tags.includes("réalité/type/personnage"));
assert.ok(!JSON.stringify(publicMilda).includes("Selaphielle"));
assert.ok((await article("pnj-pegre-arkhangel")).tags.includes("réalité/faction/pègre"));
const nina = await article("pnj-loges-mages-nina-le-guellec-03");
assert.equal(nina.realityName, "Nina Le Guellec");
assert.ok(nina.tags.includes("réalité/faction/corporatiste"));
assert.ok(nina.tags.includes("réalité/organisation/Tuatha"));
assert.equal(nina.secretTags, undefined);
const amaya = await article("pnj-religions-amaya-carvallo");
assert.equal(amaya.realityName, "Amaya Carvallo");
assert.ok(amaya.tags.includes("réalité/faction/religieux"));
assert.equal(amaya.secretTags, undefined);
assert.equal((await article("pnj-crawlers-antisysteme-p52-ciara-macfarlane")).id,
  "pnj-religions-ciara-mcfarlane");
assert.equal((await article("personnages-verite-fantastiques-tharlal-rark")).id,
  "personnages-verite-fantastiques-thor");
role = "gm";
const gmMilda = await article("pnj-pegre-milda-tarasknovna");
assert.ok(gmMilda.secretTags.includes("vérité/nom/Selaphielle"));
assert.ok(gmMilda.secretTags.includes("vérité/groupe/angelus"));
assert.ok((await search('tag:"vérité/groupe/angelus"')).total > 0);

await app.close();
console.log("PNJ PRIVATE SEARCH OK — public/editor truth-tag search blocked; editor dossier access preserved; MJ/admin search enabled");
