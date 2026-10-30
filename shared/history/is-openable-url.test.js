import { test } from "node:test";
import assert from "node:assert/strict";
import { isOpenableUrl } from "./is-openable-url.js";

test("allows http and https", () => {
  assert.equal(isOpenableUrl("https://example.com/a"), true);
  assert.equal(isOpenableUrl("http://localhost:3000/"), true);
});

test("rejects other schemes and junk", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,hi", "file:///etc/passwd", "chrome://settings", "", "not a url", undefined]) {
    assert.equal(isOpenableUrl(url), false, String(url));
  }
});
