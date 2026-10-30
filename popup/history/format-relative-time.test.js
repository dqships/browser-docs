import { test } from "node:test";
import assert from "node:assert/strict";
import { formatRelativeTime } from "./format-relative-time.js";

const now = new Date(2026, 9, 30, 15, 0, 0);

function ago(milliseconds) {
  return new Date(now.getTime() - milliseconds).toISOString();
}

test("under a minute reads Just now", () => {
  assert.equal(formatRelativeTime(ago(20 * 1000), now), "Just now");
  assert.equal(formatRelativeTime(ago(-5000), now), "Just now");
});

test("minutes and hours on the same day", () => {
  assert.equal(formatRelativeTime(ago(2 * 60 * 1000), now), "2 min ago");
  assert.equal(formatRelativeTime(ago(59 * 60 * 1000), now), "59 min ago");
  assert.equal(formatRelativeTime(ago(3 * 60 * 60 * 1000), now), "3 hr ago");
});

test("the previous calendar day reads Yesterday", () => {
  assert.equal(formatRelativeTime(new Date(2026, 9, 29, 23, 0).toISOString(), now), "Yesterday");
  assert.equal(formatRelativeTime(new Date(2026, 9, 29, 1, 0).toISOString(), now), "Yesterday");
});

test("older copies show a date, with the year only when it differs", () => {
  assert.equal(formatRelativeTime(new Date(2026, 9, 12, 9, 0).toISOString(), now, "en-US"), "Oct 12");
  assert.equal(
    formatRelativeTime(new Date(2025, 9, 12, 9, 0).toISOString(), now, "en-US"),
    "Oct 12, 2025"
  );
});

test("invalid dates render nothing", () => {
  assert.equal(formatRelativeTime("nope", now), "");
});
