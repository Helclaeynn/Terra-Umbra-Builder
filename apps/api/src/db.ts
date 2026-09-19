import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({
  connectionString,
  max: Number(process.env.DB_POOL_SIZE ?? 5),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000
});

export async function databaseStatus() {
  const result = await pool.query<{ database: string; now: string }>(
    "select current_database() as database, now()::text as now"
  );

  return result.rows[0];
}
