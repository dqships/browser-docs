import { test } from "node:test";
import assert from "node:assert/strict";
import { buildHistoryEntry } from "./build-history-entry.js";

test("maps an extraction result to a history entry", () => {
  const entry = buildHistoryEntry(
    {
      markdown: "# Hi",
      meta: { title: "  Guide  ", url: "https://docs.test/guide" },
      stats: { wordCount: 1, charCount: 4 }
    },
    { id: "id-1", copiedAt: "2026-10-30T10:00:00.000Z" }
  );

  assert.deepEqual(entry, {
    id: "id-1",
    title: "Guide",
    url: "https://docs.test/guide",
    markdown: "# Hi",
    wordCount: 1,
    charCount: 4,
    copiedAt: "2026-10-30T10:00:00.000Z"
  });
});

test("fills safe defaults for missing fields", () => {
  const entry = buildHistoryEntry({ markdown: "abc" }, { id: "x", copiedAt: "t" });
  assert.equal(entry.title, "");
  assert.equal(entry.url, "");
  assert.equal(entry.wordCount, 0);
  assert.equal(entry.charCount, 3);
});
