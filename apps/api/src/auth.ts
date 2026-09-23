import {
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual
} from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { PoolClient } from "pg";
import * as argon2 from "argon2";
import { pool } from "./db.js";

export const ROLES = ["player", "gm", "editor", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type PublicUser = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

const SESSION_COOKIE = "__Host-tuc_session";
const LEGACY_SESSION_COOKIE = "tuc_session";
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS ?? 30);
// Explicit work factors, independent of library defaults (memoryCost is KiB).
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  version: 0x13,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 1,
  hashLength: 32
} as const;
// Read-only compatibility with hashes written before the Argon2id migration.
const SCRYPT_N = 32768;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 64;

function scryptAsync(
  password: string,
  salt: Buffer,
  length: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      length,
      {
        N: SCRYPT_N,
        r: SCRYPT_R,
        p: SCRYPT_P,
        maxmem: 64 * 1024 * 1024
      },
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      }
    );
  });
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function validateDisplayName(value: string): boolean {
  const length = value.trim().length;
  return length >= 2 && length <= 80;
}

export function validatePassword(value: string): boolean {
  return value.length >= 12 && value.length <= 256;
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, { ...ARGON2_OPTIONS, salt: randomBytes(16) });
}

// Call only after successful verification. The login transaction performs the
// replacement only if the stored password still matches the verified hash.
export function passwordNeedsRehash(encoded: string): boolean {
  if (!encoded.startsWith("$argon2id$")) return true;
  return argon2.needsRehash(encoded, ARGON2_OPTIONS);
}

export async function verifyPassword(
  password: string,
  encoded: string
): Promise<boolean> {
  if (encoded.startsWith("$argon2id$")) {
    try {
      return await argon2.verify(encoded, password);
    } catch {
      return false;
    }
  }

  const parts = encoded.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, nValue, rValue, pValue, saltValue, hashValue] = parts;
  if (
    Number(nValue) !== SCRYPT_N ||
    Number(rValue) !== SCRYPT_R ||
    Number(pValue) !== SCRYPT_P
  ) {
    return false;
  }

  const salt = Buffer.from(saltValue, "base64url");
  const expected = Buffer.from(hashValue, "base64url");
  // Reject truncated/noncanonical stored values before invoking the KDF.
  if (salt.length !== 16 || expected.length !== SCRYPT_KEYLEN ||
      salt.toString("base64url") !== saltValue ||
      expected.toString("base64url") !== hashValue) return false;
  const actual = await scryptAsync(password, salt, SCRYPT_KEYLEN);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function cookieValue(raw: string, name: string): string | null {
  for (const part of raw.split(";")) {
    const [cookieName, ...rest] = part.trim().split("=");
    if (cookieName === name) {
      const value = rest.join("=");
      return value || null;
    }
  }

  return null;
}

export function readSessionToken(request: FastifyRequest): string | null {
  const raw = request.headers.cookie;
  if (!raw) return null;

  return cookieValue(raw, SESSION_COOKIE);
}

function sessionCookie(token: string, maxAge: number): string {
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${maxAge}`
  ].join("; ");
}

function expiredCookie(name: string): string {
  return [
    `${name}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT"
  ].join("; ");
}

export function setSessionCookie(reply: FastifyReply, token: string): void {
  const maxAge = Math.max(1, Math.floor(SESSION_TTL_DAYS * 24 * 60 * 60));

  reply.raw.setHeader("Set-Cookie", [
    sessionCookie(token, maxAge),
    expiredCookie(LEGACY_SESSION_COOKIE)
  ]);
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.raw.setHeader("Set-Cookie", [
    expiredCookie(SESSION_COOKIE),
    expiredCookie(LEGACY_SESSION_COOKIE)
  ]);
}

export async function createSession(
  userId: string,
  request: FastifyRequest,
  executor: Pick<PoolClient, "query"> = pool
): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);

  await executor.query(
    `INSERT INTO sessions
      (token_hash, user_id, expires_at, user_agent, ip_address)
     VALUES
      ($1, $2, now() + ($3::text || ' days')::interval, $4, $5)`,
    [
      tokenHash,
      userId,
      String(SESSION_TTL_DAYS),
      request.headers["user-agent"] ?? null,
      request.ip
    ]
  );

  return token;
}

export async function destroySession(token: string | null): Promise<void> {
  if (!token) return;
  await pool.query("DELETE FROM sessions WHERE token_hash = $1", [
    hashSessionToken(token)
  ]);
}

export async function destroyUserSessions(userId: string): Promise<void> {
  await pool.query("DELETE FROM sessions WHERE user_id = $1", [userId]);
}

export async function currentUser(
  request: FastifyRequest
): Promise<PublicUser | null> {
  const token = readSessionToken(request);
  if (!token) return null;

  const result = await pool.query<{
    id: string;
    email: string;
    display_name: string;
    role: Role;
    is_active: boolean;
    created_at: string;
    last_login_at: string | null;
  }>(
    `SELECT
       u.id,
       u.email,
       u.display_name,
       u.role,
       u.is_active,
       u.created_at::text,
       u.last_login_at::text
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > now()
       AND u.is_active = true`,
    [hashSessionToken(token)]
  );

  const row = result.rows[0];
  if (!row) return null;

  void pool.query(
    "UPDATE sessions SET last_seen_at = now() WHERE token_hash = $1",
    [hashSessionToken(token)]
  );

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    active: row.is_active,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at
  };
}

export async function requireUser(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<PublicUser | null> {
  const user = await currentUser(request);
  if (!user) {
    // Keep the authorization helper pending until asynchronous response hooks finish.
    await reply.code(401).send({ error: "authentication_required" });
    return null;
  }

  return user;
}

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<PublicUser | null> {
  const user = await requireUser(request, reply);
  if (!user) return null;

  if (user.role !== "admin") {
    await reply.code(403).send({ error: "admin_required" });
    return null;
  }

  return user;
}
