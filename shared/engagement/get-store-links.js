import { CHROME_LISTING_URL, CHROME_REVIEW_URL, FIREFOX_LISTING_URL, FIREFOX_REVIEW_URL, SAFARI_LISTING_URL, SAFARI_REVIEW_URL, STORE_FALLBACK_URL } from "../constants/store-links.js";

const LINKS_BY_BROWSER = {
  chrome: { listingUrl: CHROME_LISTING_URL, reviewUrl: CHROME_REVIEW_URL },
  firefox: { listingUrl: FIREFOX_LISTING_URL, reviewUrl: FIREFOX_REVIEW_URL },
  safari: { listingUrl: SAFARI_LISTING_URL, reviewUrl: SAFARI_REVIEW_URL }
};

// Store listing and review page for a browser name from detectBrowser().
// Empty links fall back to the website.
export function getStoreLinks(browserName) {
  const links = LINKS_BY_BROWSER[browserName] ?? LINKS_BY_BROWSER.chrome;

  return {
    listingUrl: links.listingUrl || STORE_FALLBACK_URL,
    reviewUrl: links.reviewUrl || STORE_FALLBACK_URL
  };
}
