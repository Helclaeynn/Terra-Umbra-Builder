import cors from "@fastify/cors";
import Fastify from "fastify";
import { databaseStatus, pool } from "./db.js";

const app = Fastify({
  logger: true,
  trustProxy: true
});

await app.register(cors, {
  origin: false
});

app.get("/api/health", async () => ({
  status: "ok",
  service: "tuc-api",
  version: "0.1.0"
}));

app.get("/api/ready", async (_request, reply) => {
  try {
    const database = await databaseStatus();
    return {
      status: "ready",
      service: "tuc-api",
      database
    };
  } catch (error) {
    app.log.error(error);
    return reply.code(503).send({
      status: "not-ready",
      service: "tuc-api"
    });
  }
});

app.get("/api", async () => ({
  name: "Terra Umbra API",
  status: "online"
}));

const port = Number(process.env.PORT ?? 3000);

const shutdown = async () => {
  await app.close();
  await pool.end();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

await app.listen({
  host: "0.0.0.0",
  port
});
