import { test } from "node:test";
import assert from "node:assert/strict";
import { insertHistoryEntry } from "./insert-history-entry.js";

function entry(id, url, markdown, copiedAt = "2026-10-30T10:00:00.000Z") {
  return { id, title: id, url, markdown, wordCount: 1, charCount: markdown.length, copiedAt };
}

test("adds the new entry at the top", () => {
  const existing = [entry("a", "https://a.test/", "A")];
  const next = insertHistoryEntry(existing, entry("b", "https://b.test/", "B"), 100);
  assert.deepEqual(next.map((item) => item.id), ["b", "a"]);
});

test("moves an identical copy of the same URL to the top instead of duplicating", () => {
  const existing = [
    entry("a", "https://a.test/", "A"),
    entry("b", "https://b.test/", "B", "2026-10-29T10:00:00.000Z")
  ];
  const next = insertHistoryEntry(
    existing,
    entry("new", "https://b.test/", "B", "2026-10-30T12:00:00.000Z"),
    100
  );
  assert.deepEqual(next.map((item) => item.id), ["b", "a"]);
  assert.equal(next[0].copiedAt, "2026-10-30T12:00:00.000Z");
});

test("keeps a separate entry when the same URL has different Markdown", () => {
  const existing = [entry("a", "https://a.test/", "old")];
  const next = insertHistoryEntry(existing, entry("b", "https://a.test/", "new"), 100);
  assert.deepEqual(next.map((item) => item.id), ["b", "a"]);
});

test("keeps only the newest entries up to the limit", () => {
  const existing = Array.from({ length: 100 }, (_, index) =>
    entry(`e${index}`, `https://x.test/${index}`, `M${index}`)
  );
  const next = insertHistoryEntry(existing, entry("new", "https://new.test/", "N"), 100);
  assert.equal(next.length, 100);
  assert.equal(next[0].id, "new");
  assert.equal(next.at(-1).id, "e98");
});

test("does not change the list it was given", () => {
  const existing = [entry("a", "https://a.test/", "A")];
  insertHistoryEntry(existing, entry("b", "https://b.test/", "B"), 100);
  assert.equal(existing.length, 1);
});
