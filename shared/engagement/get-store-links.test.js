import { test } from "node:test";
import assert from "node:assert/strict";
import { getStoreLinks } from "./get-store-links.js";
import { CHROME_LISTING_URL, CHROME_REVIEW_URL, STORE_FALLBACK_URL } from "../constants/store-links.js";

test("Chrome uses the Chrome Web Store listing and review page", () => {
  assert.deepEqual(getStoreLinks("chrome"), {
    listingUrl: CHROME_LISTING_URL,
    reviewUrl: CHROME_REVIEW_URL
  });
  assert.ok(CHROME_REVIEW_URL.endsWith("/reviews"));
});

test("Firefox and Safari fall back to the website until they are listed", () => {
  for (const name of ["firefox", "safari"]) {
    assert.deepEqual(getStoreLinks(name), {
      listingUrl: STORE_FALLBACK_URL,
      reviewUrl: STORE_FALLBACK_URL
    });
  }
});
