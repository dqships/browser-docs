import { detectBrowser } from "../../shared/browser/detect-browser.js";
import { getStoreLinks } from "../../shared/engagement/get-store-links.js";

// Opens this browser's store review page in a new tab.
export async function openReviewPage() {
  const { reviewUrl } = getStoreLinks(detectBrowser());
  await browser.tabs.create({ url: reviewUrl });
}
