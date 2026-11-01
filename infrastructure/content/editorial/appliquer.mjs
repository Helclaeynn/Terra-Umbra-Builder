// Passe éditoriale (étape 8.3) : applique une liste de modifications d'articles
// sur la base de contenu, comme une publication depuis l'éditeur du site :
// version d'origine gardée, version + 1, révision commentée (restaurable).
//
// À lancer dans le conteneur de l'API (pool et variables de la base) :
//   docker compose cp plan.json recette-api:/tmp/plan.json
//   docker compose cp appliquer.mjs recette-api:/app/appliquer.mjs
//   docker compose exec -T recette-api node /app/appliquer.mjs /tmp/plan.json [--essai]
//
// plan.json : [{ slug, comment, visibility?, sections?, body?, tags?, tagsVerite?, tagsMj?, title? }]
//   visibility : public | verite | gm (page entière) ;
//   sections   : { "<id de section>": "verite" | "mj" | null } (null = publique) ;
//   body       : corps complet remplaçant (sections, blocs…), pour une réécriture.
import fs from "node:fs";
import { pool } from "./dist/db.js";

const [file, flag] = process.argv.slice(2);
const dryRun = flag === "--essai";
const plan = JSON.parse(fs.readFileSync(file, "utf8"));
const AUDIENCE = { public: undefined, verite: "verite", gm: "mj" };
let changed = 0;
const missing = [];

for (const step of plan) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: [row] } = await client.query(
      `SELECT id, version, title, visibility, body, tags, tags_verite, tags_mj FROM content_entry
        WHERE type = 'article' AND scope = 'compendium' AND slug = $1 AND status = 'published' FOR UPDATE`,
      [step.slug]);
    if (!row) { missing.push(step.slug); await client.query("ROLLBACK"); continue; }
    const body = structuredClone(step.body ?? row.body);
    const visibility = step.visibility ?? row.visibility;
    if (AUDIENCE[visibility]) body.audience = AUDIENCE[visibility]; else delete body.audience;
    for (const [id, audience] of Object.entries(step.sections ?? {})) {
      const section = (body.sections ?? []).find((s) => s?.id === id);
      if (!section) throw new Error(`${step.slug} : section ${id} introuvable`);
      if (audience) section.audience = audience; else delete section.audience;
    }
    const next = {
      title: step.title ?? row.title,
      tags: step.tags ?? row.tags,
      tags_verite: step.tagsVerite ?? row.tags_verite,
      tags_mj: step.tagsMj ?? row.tags_mj
    };
    const same = visibility === row.visibility && JSON.stringify(body) === JSON.stringify(row.body) &&
      Object.entries(next).every(([key, value]) => JSON.stringify(value) === JSON.stringify(row[key]));
    if (same) { await client.query("ROLLBACK"); continue; }
    await client.query(
      `INSERT INTO content_revision (entry_id, version, snapshot, comment)
       SELECT $1, $2, $3::jsonb, 'Version d''origine'
        WHERE NOT EXISTS (SELECT 1 FROM content_revision WHERE entry_id = $1)`,
      [row.id, row.version, JSON.stringify(row.body)]);
    const { rows: [saved] } = await client.query(
      `UPDATE content_entry SET title = $2, body = $3::jsonb, visibility = $4, tags = $5::jsonb,
              tags_verite = $6::jsonb, tags_mj = $7::jsonb, version = version + 1, updated_at = now()
        WHERE id = $1 RETURNING version`,
      [row.id, next.title, JSON.stringify(body), visibility, JSON.stringify(next.tags),
        JSON.stringify(next.tags_verite), JSON.stringify(next.tags_mj)]);
    await client.query(
      `INSERT INTO content_revision (entry_id, version, snapshot, comment) VALUES ($1, $2, $3::jsonb, $4)`,
      [row.id, saved.version, JSON.stringify(body), `Passe éditoriale : ${step.comment}`]);
    await client.query(dryRun ? "ROLLBACK" : "COMMIT");
    changed++;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
console.log(`${changed} articles ${dryRun ? "à modifier (essai, rien d'enregistré)" : "modifiés"}${missing.length ? `, introuvables : ${missing.join(", ")}` : ""}.`);
await pool.end();
