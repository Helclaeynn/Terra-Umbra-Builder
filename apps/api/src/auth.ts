import {
  createHash,
  randomBytes,
  scrypt,
  timingSafeEqual
} from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
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

const SESSION_COOKIE = "tuc_session";
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS ?? 30);
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
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, SCRYPT_KEYLEN);

  return [
    "scrypt",
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    salt.toString("base64url"),
    hash.toString("base64url")
  ].join("$");
}

export async function verifyPassword(
  password: string,
  encoded: string
): Promise<boolean> {
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
  const actual = await scryptAsync(password, salt, expected.length);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function readSessionToken(request: FastifyRequest): string | null {
  const raw = request.headers.cookie;
  if (!raw) return null;

  for (const part of raw.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === SESSION_COOKIE) {
      const value = rest.join("=");
      return value || null;
    }
  }

  return null;
}

export function setSessionCookie(reply: FastifyReply, token: string): void {
  const maxAge = Math.max(1, Math.floor(SESSION_TTL_DAYS * 24 * 60 * 60));
  reply.header(
    "Set-Cookie",
    [
      `${SESSION_COOKIE}=${token}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      `Max-Age=${maxAge}`
    ].join("; ")
  );
}

export function clearSessionCookie(reply: FastifyReply): void {
  reply.header(
    "Set-Cookie",
    [
      `${SESSION_COOKIE}=`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Strict",
      "Max-Age=0"
    ].join("; ")
  );
}

export async function createSession(
  userId: string,
  request: FastifyRequest
): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);

  await pool.query(
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
    reply.code(401).send({ error: "authentication_required" });
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
    reply.code(403).send({ error: "admin_required" });
    return null;
  }

  return user;
}
