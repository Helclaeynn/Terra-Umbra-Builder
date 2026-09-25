import { registerCampaignRoutes } from "./campaigns.js";
import type { FastifyInstance, FastifyReply } from "fastify";
import { registerCharacterHistoryRoutes } from "./character-history.js";
import { pool } from "./db.js";
import { registerCharacterJournalRoutes } from "./character-journal.js";
import { registerCharacterSheetRoutes } from "./character-sheets.js";
import { requireUser } from "./auth.js";
import {
  blankCharacterData,
  importV1CharacterData,
  normalizeCharacterData
} from "./character-data.js";

type CharacterRow = {
  id: string;
  name: string;
  data: Record<string, unknown>;
  version: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validName(value: unknown): value is string {
  return typeof value === "string" && value.trim().length >= 1 && value.trim().length <= 120;
}

function validData(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  try {
    return Buffer.byteLength(JSON.stringify(value), "utf8") <= 1024 * 1024;
  } catch {
    return false;
  }
}

function bad(reply: FastifyReply, error: string) {
  return reply.code(400).send({ error });
}

async function insertCharacter(
  ownerId: string,
  name: string,
  data: Record<string, unknown>,
  reason: "created" | "imported"
): Promise<CharacterRow> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const created = await client.query<CharacterRow>(
      `INSERT INTO characters (owner_id, name, data, version)
       VALUES ($1, $2, $3::jsonb, 1)
       RETURNING
         id,
         name,
         data,
         version,
         favorite,
         created_at::text AS "createdAt",
         updated_at::text AS "updatedAt",
         campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=characters.campaign_id) AS "campaignName"`,
      [ownerId, name, JSON.stringify(data)]
    );

    const character = created.rows[0];
    await client.query(
      `INSERT INTO character_revisions
        (character_id, revision, name, data, reason, created_by)
       VALUES ($1, 1, $2, $3::jsonb, $4, $5)`,
      [character.id, character.name, JSON.stringify(character.data), reason, ownerId]
    );
    await client.query("COMMIT");
    return character;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export async function registerCharacterRoutes(app: FastifyInstance) {
  await registerCampaignRoutes(app);
  await registerCharacterHistoryRoutes(app);
  await registerCharacterSheetRoutes(app);
  await registerCharacterJournalRoutes(app);
  app.get<{Querystring:{summary?:string}}>("/api/characters", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const result = await pool.query<CharacterRow>(
      `SELECT
         id,
         name,
         ${request.query.summary === "1" ? "" : "data,"}
         version,
         favorite,
         created_at::text AS "createdAt",
         updated_at::text AS "updatedAt",
         campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=characters.campaign_id) AS "campaignName"
       FROM characters
       WHERE owner_id = $1
         AND archived_at IS NULL
       ORDER BY favorite DESC, updated_at DESC`,
      [user.id]
    );

    return { characters: result.rows };
  });

  app.patch<{Params:{id:string};Body:{favorite?:boolean}}>("/api/characters/:id/favorite",async(request,reply)=>{
    const user=await requireUser(request,reply);
    if(!user)return;
    if(!UUID_RE.test(request.params.id)||typeof request.body?.favorite!=="boolean")return bad(reply,"invalid_character_favorite");
    const result=await pool.query<{id:string;favorite:boolean}>(
      `UPDATE characters SET favorite=$3 WHERE id=$1 AND owner_id=$2 AND archived_at IS NULL RETURNING id,favorite`,
      [request.params.id,user.id,request.body.favorite]
    );
    if(!result.rows[0])return reply.code(404).send({error:"character_not_found"});
    return {character:result.rows[0]};
  });

  app.post<{
    Body: { name?: string; data?: Record<string, unknown> };
  }>("/api/characters", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const requestedName = request.body?.name?.trim();
    const requestedData = request.body?.data;
    const name = requestedName || "Nouveau personnage";

    if (requestedName !== undefined && !validName(requestedName)) {
      return bad(reply, "invalid_character_name");
    }
    if (requestedData !== undefined && !validData(requestedData)) {
      return bad(reply, "invalid_character_data");
    }

    const data =
      requestedData && Object.keys(requestedData).length > 0
        ? normalizeCharacterData(requestedData, name)
        : blankCharacterData(name);

    try {
      const character = await insertCharacter(user.id, name, data, "created");
      return reply.code(201).send({ character });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: "character_create_failed" });
    }
  });

  app.post<{
    Body: { data?: Record<string, unknown> };
  }>("/api/characters/import-v1", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;

    const source = request.body?.data;
    if (!validData(source)) return bad(reply, "invalid_character_data");

    const data = importV1CharacterData(source);
    if (!data) return bad(reply, "invalid_v1_character");

    const name = data.identity.name;
    if (!validName(name)) return bad(reply, "invalid_character_name");

    try {
      const character = await insertCharacter(user.id, name, data, "imported");
      return reply.code(201).send({ character });
    } catch (error) {
      app.log.error(error);
      return reply.code(500).send({ error: "character_import_failed" });
    }
  });

  app.get<{
    Params: { id: string };
  }>("/api/characters/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_character_id");

    const result = await pool.query<CharacterRow>(
      `SELECT
         id,
         name,
         data,
         version,
         created_at::text AS "createdAt",
         updated_at::text AS "updatedAt",
         campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=characters.campaign_id) AS "campaignName"
       FROM characters
       WHERE id = $1
         AND owner_id = $2
         AND archived_at IS NULL`,
      [request.params.id, user.id]
    );

    const character = result.rows[0];
    if (!character) return reply.code(404).send({ error: "character_not_found" });
    character.data = normalizeCharacterData(character.data, character.name);
    return { character };
  });

  app.patch<{
    Params: { id: string };
    Body: {
      name?: string;
      data?: Record<string, unknown>;
      version?: number;
    };
  }>("/api/characters/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_character_id");

    const version = request.body?.version;
    if (!Number.isInteger(version) || Number(version) < 1) {
      return bad(reply, "invalid_character_version");
    }

    const requestedName = request.body?.name;
    const requestedData = request.body?.data;

    if (requestedName === undefined && requestedData === undefined) {
      return bad(reply, "no_changes");
    }

    if (requestedName !== undefined && !validName(requestedName)) {
      return bad(reply, "invalid_character_name");
    }

    if (requestedData !== undefined && !validData(requestedData)) {
      return bad(reply, "invalid_character_data");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const currentResult = await client.query<CharacterRow>(
        `SELECT
           id,
           name,
           data,
           version,
           created_at::text AS "createdAt",
           updated_at::text AS "updatedAt",
         campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=characters.campaign_id) AS "campaignName"
         FROM characters
         WHERE id = $1
           AND owner_id = $2
           AND archived_at IS NULL
         FOR UPDATE`,
        [request.params.id, user.id]
      );

      const current = currentResult.rows[0];
      if (!current) {
        await client.query("ROLLBACK");
        return reply.code(404).send({ error: "character_not_found" });
      }

      if (current.version !== version) {
        await client.query("ROLLBACK");
        return reply.code(409).send({
          error: "character_version_conflict",
          currentVersion: current.version
        });
      }

      const nextName = requestedName?.trim() ?? current.name;
      const nextData =
        requestedData !== undefined
          ? normalizeCharacterData(requestedData, nextName)
          : normalizeCharacterData(current.data, nextName);
      const nextVersion = current.version + 1;

      const updated = await client.query<CharacterRow>(
        `UPDATE characters
         SET
           name = $1,
           data = $2::jsonb,
           version = $3,
           updated_at = now()
         WHERE id = $4
         RETURNING
           id,
           name,
           data,
           version,
           created_at::text AS "createdAt",
           updated_at::text AS "updatedAt",
         campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=characters.campaign_id) AS "campaignName"`,
        [nextName, JSON.stringify(nextData), nextVersion, current.id]
      );

      await client.query(
        `INSERT INTO character_revisions
          (character_id, revision, name, data, reason, created_by)
         VALUES ($1, $2, $3, $4::jsonb, 'saved', $5)`,
        [current.id, nextVersion, nextName, JSON.stringify(nextData), user.id]
      );

      await client.query("COMMIT");
      return { character: updated.rows[0] };
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      app.log.error(error);
      return reply.code(500).send({ error: "character_update_failed" });
    } finally {
      client.release();
    }
  });

  app.delete<{
    Params: { id: string };
    Body: { version?: number };
  }>("/api/characters/:id", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_character_id");

    const version = request.body?.version;
    if (!Number.isInteger(version) || Number(version) < 1) {
      return bad(reply, "invalid_character_version");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const currentResult = await client.query<CharacterRow>(
        `SELECT
           id,
           name,
           data,
           version,
           created_at::text AS "createdAt",
           updated_at::text AS "updatedAt",
         campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=characters.campaign_id) AS "campaignName"
         FROM characters
         WHERE id = $1
           AND owner_id = $2
           AND archived_at IS NULL
         FOR UPDATE`,
        [request.params.id, user.id]
      );

      const current = currentResult.rows[0];
      if (!current) {
        await client.query("ROLLBACK");
        return reply.code(404).send({ error: "character_not_found" });
      }

      if (current.version !== version) {
        await client.query("ROLLBACK");
        return reply.code(409).send({
          error: "character_version_conflict",
          currentVersion: current.version
        });
      }

      const nextVersion = current.version + 1;
      await client.query(
        `UPDATE characters
         SET archived_at = now(), version = $1, updated_at = now()
         WHERE id = $2`,
        [nextVersion, current.id]
      );

      await client.query(
        `INSERT INTO character_revisions
          (character_id, revision, name, data, reason, created_by)
         VALUES ($1, $2, $3, $4::jsonb, 'archived', $5)`,
        [current.id, nextVersion, current.name, JSON.stringify(current.data), user.id]
      );

      await client.query("COMMIT");
      return { ok: true };
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      app.log.error(error);
      return reply.code(500).send({ error: "character_archive_failed" });
    } finally {
      client.release();
    }
  });

  app.get<{
    Params: { id: string };
  }>("/api/characters/:id/revisions", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_character_id");

    const ownership = await pool.query(
      "SELECT 1 FROM characters WHERE id = $1 AND owner_id = $2",
      [request.params.id, user.id]
    );

    if (ownership.rowCount === 0) {
      return reply.code(404).send({ error: "character_not_found" });
    }

    const result = await pool.query(
      `SELECT
         revision,
         name,
         reason,
         created_at::text AS "createdAt"
       FROM character_revisions
       WHERE character_id = $1
       ORDER BY revision DESC
       LIMIT 100`,
      [request.params.id]
    );

    return { revisions: result.rows };
  });

  app.post<{
    Params: { id: string; revision: string };
  }>("/api/characters/:id/revisions/:revision/restore", async (request, reply) => {
    const user = await requireUser(request, reply);
    if (!user) return;
    if (!UUID_RE.test(request.params.id)) return bad(reply, "invalid_character_id");

    const revision = Number(request.params.revision);
    if (!Number.isInteger(revision) || revision < 1) {
      return bad(reply, "invalid_revision");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const currentResult = await client.query<CharacterRow>(
        `SELECT
           id,
           name,
           data,
           version,
           created_at::text AS "createdAt",
           updated_at::text AS "updatedAt",
         campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=characters.campaign_id) AS "campaignName"
         FROM characters
         WHERE id = $1
           AND owner_id = $2
           AND archived_at IS NULL
         FOR UPDATE`,
        [request.params.id, user.id]
      );

      const current = currentResult.rows[0];
      if (!current) {
        await client.query("ROLLBACK");
        return reply.code(404).send({ error: "character_not_found" });
      }

      const snapshotResult = await client.query<{
        name: string;
        data: Record<string, unknown>;
      }>(
        `SELECT name, data
         FROM character_revisions
         WHERE character_id = $1
           AND revision = $2`,
        [current.id, revision]
      );

      const snapshot = snapshotResult.rows[0];
      if (!snapshot) {
        await client.query("ROLLBACK");
        return reply.code(404).send({ error: "revision_not_found" });
      }

      const nextVersion = current.version + 1;
      const restoredData = normalizeCharacterData(snapshot.data, snapshot.name);
      const updated = await client.query<CharacterRow>(
        `UPDATE characters
         SET
           name = $1,
           data = $2::jsonb,
           version = $3,
           updated_at = now()
         WHERE id = $4
         RETURNING
           id,
           name,
           data,
           version,
           created_at::text AS "createdAt",
           updated_at::text AS "updatedAt",
         campaign_id AS "campaignId",(SELECT name FROM campaigns WHERE id=characters.campaign_id) AS "campaignName"`,
        [snapshot.name, JSON.stringify(restoredData), nextVersion, current.id]
      );

      await client.query(
        `INSERT INTO character_revisions
          (character_id, revision, name, data, reason, created_by)
         VALUES ($1, $2, $3, $4::jsonb, $5, $6)`,
        [
          current.id,
          nextVersion,
          snapshot.name,
          JSON.stringify(snapshot.data),
          `restored:${revision}`,
          user.id
        ]
      );

      await client.query("COMMIT");
      return { character: updated.rows[0] };
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      app.log.error(error);
      return reply.code(500).send({ error: "character_restore_failed" });
    } finally {
      client.release();
    }
  });
}
