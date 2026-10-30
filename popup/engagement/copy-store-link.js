import { detectBrowser } from "../../shared/browser/detect-browser.js";
import { getStoreLinks } from "../../shared/engagement/get-store-links.js";
import { copyText } from "../copy-text.js";

// Copies this browser's store listing link to the clipboard.
export async function copyStoreLink() {
  const { listingUrl } = getStoreLinks(detectBrowser());
  await copyText(listingUrl);
}
