import { copyText } from "../copy-text.js";

// Puts a saved entry's Markdown back on the clipboard. This deliberately does
// not go through recordMarkdownAction: re-copies are not new history entries.
export async function copyHistoryEntry(entry) {
  await copyText(entry.markdown);
  return "Markdown copied to the clipboard.";
}
