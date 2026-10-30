import { test } from "node:test";
import assert from "node:assert/strict";
import { detectBrowser } from "./detect-browser.js";

const CHROME = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const EDGE = `${CHROME} Edg/130.0.0.0`;
const FIREFOX = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:132.0) Gecko/20100101 Firefox/132.0";
const SAFARI = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";

test("detects each browser family from its user agent", () => {
  assert.equal(detectBrowser(CHROME), "chrome");
  assert.equal(detectBrowser(EDGE), "chrome");
  assert.equal(detectBrowser(FIREFOX), "firefox");
  assert.equal(detectBrowser(SAFARI), "safari");
  assert.equal(detectBrowser(""), "chrome");
});
