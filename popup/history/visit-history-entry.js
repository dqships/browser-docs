import { isOpenableUrl } from "../../shared/history/is-openable-url.js";
import { openTab } from "../../shared/browser/open-tab.js";

// Opens the entry's source page in a new tab (http and https only).
export async function visitHistoryEntry(entry) {
  if (!isOpenableUrl(entry.url)) {
    throw new Error("This entry has no web page to open.");
  }

  await openTab(entry.url);
  return "Opened the source page.";
}
