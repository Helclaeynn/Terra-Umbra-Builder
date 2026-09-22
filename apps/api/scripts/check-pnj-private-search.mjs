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

const { registerCompendiumRoutes } = await import("../dist/compendium.js");
const app = fastify();
await registerCompendiumRoutes(app);

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
  assert.ok((await search('tag:"réalité/faction/corporatiste"')).total > 0);
}

for (const audience of ["gm", "admin"]) {
  role = audience;
  assert.ok((await search('tag:"vérité/espèce/loup-garou"')).total > 0);
  assert.ok((await search('tag:"vérité/nom/Mirrissi"')).total > 0);
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
role = "gm";
const gmMilda = await article("pnj-pegre-milda-tarasknovna");
assert.ok(gmMilda.secretTags.includes("vérité/nom/Selaphielle"));
assert.ok(gmMilda.secretTags.includes("vérité/groupe/angelus"));
assert.ok((await search('tag:"vérité/groupe/angelus"')).total > 0);

await app.close();
console.log("PNJ PRIVATE SEARCH OK — public/editor blocked; MJ/admin enabled; public payload sanitized");
