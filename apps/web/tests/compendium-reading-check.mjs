import assert from "node:assert/strict";
import test from "node:test";
import { parseReadingPositions, rememberReading } from "../src/lib/compendium-reading.ts";

test("reading storage rejects corrupt entries and retains identifiers only", () => {
  assert.deepEqual(parseReadingPositions("{"), {});
  assert.deepEqual(parseReadingPositions(JSON.stringify({ good: { sectionId: "wiki-section-intro", updatedAt: 12, title: "private title", body: "private text" }, bad: { sectionId: "", updatedAt: 12 }, wrong: null })), { good: { sectionId: "wiki-section-intro", updatedAt: 12 } });
});
test("an explicit reading update does not mutate other saved positions", () => {
  const previous = { article: { sectionId: "wiki-section-3", updatedAt: 12 } };
  const next = rememberReading(previous, "other", "section-0", 20);
  assert.deepEqual(previous, { article: { sectionId: "wiki-section-3", updatedAt: 12 } });
  assert.deepEqual(next.article, previous.article);
  assert.deepEqual(next.other, { sectionId: "section-0", updatedAt: 20 });
});
test("reading storage keeps only the fifty most recent valid positions", () => {
  const source = Object.fromEntries(Array.from({ length: 60 }, (_, index) => ["article-" + index, { sectionId: "intro", updatedAt: index + 1 }]));
  const result = parseReadingPositions(JSON.stringify(source));
  assert.equal(Object.keys(result).length, 50);
  assert.equal(result["article-0"], undefined);
  assert.equal(result["article-59"].updatedAt, 60);
});
