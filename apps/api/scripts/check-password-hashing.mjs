import assert from "node:assert/strict";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { test } from "node:test";
import * as argon2 from "argon2";

// No database connection is made by these tests.
process.env.DATABASE_URL ||= "postgres://fixture:fixture@127.0.0.1:1/fixture";
const { hashPassword, verifyPassword, passwordNeedsRehash } = await import("../dist/auth.js");
const password = "Fixture-Argon2id-été-🔒-2026";

test("new passwords use Argon2id v19, explicit costs, random 16-byte salts and 32-byte hashes", async () => {
  const first = await hashPassword(password);
  const second = await hashPassword(password);
  assert.match(first, /^\$argon2id\$v=19\$/);
  assert.deepEqual(Object.fromEntries(first.split("$")[3].split(",").map(pair => pair.split("="))),
    { m: "65536", t: "3", p: "1" });
  assert.notEqual(first, second);
  assert.equal(Buffer.from(first.split("$")[4], "base64").length, 16);
  assert.equal(Buffer.from(first.split("$")[5], "base64").length, 32);
  assert.notEqual(first.split("$")[4], second.split("$")[4]);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword(password + "wrong", first), false);
  assert.equal(await verifyPassword(password, second), true);
  assert.equal(passwordNeedsRehash(first), false);
});

test("legacy scrypt remains verifiable and is marked for upgrade; corrupt formats are rejected", async () => {
  const salt = randomBytes(16);
  const hash = await promisify(scrypt)(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const legacy = `scrypt$32768$8$1$${salt.toString("base64url")}$${hash.toString("base64url")}`;
  assert.equal(await verifyPassword(password, legacy), true);
  assert.equal(await verifyPassword("incorrect", legacy), false);
  assert.equal(passwordNeedsRehash(legacy), true);
  for (const invalid of [
    "", "sha256$unknown", "$argon2id$broken", "$argon2i$v=19$bad",
    "scrypt$32768$8$1$$", legacy.replace("32768", "1073741824"),
    legacy.slice(0, -2), legacy + "=", legacy.replace(salt.toString("base64url"), "AA")
  ]) {
    assert.equal(await verifyPassword(password, invalid), false, `reject ${invalid.split("$")[0] || "invalid PHC"}`);
  }
});

test("an older Argon2id cost remains readable and can be upgraded without changing the password", async () => {
  const older = await argon2.hash(password, {
    type: argon2.argon2id, memoryCost: 8192, timeCost: 1, parallelism: 1
  });
  assert.equal(await verifyPassword(password, older), true);
  assert.equal(passwordNeedsRehash(older), true);
  const upgraded = await hashPassword(password);
  assert.equal(await verifyPassword(password, upgraded), true);
  assert.equal(passwordNeedsRehash(upgraded), false);
});

test("Unicode and embedded NUL characters are preserved during password verification", async () => {
  const original = "Un-mot-de-passe\0éété-🔒";
  const encoded = await hashPassword(original);
  assert.equal(await verifyPassword(original, encoded), true);
  assert.equal(await verifyPassword(original.split("\0")[0], encoded), false);
});
