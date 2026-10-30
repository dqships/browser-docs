import { renderHistoryList } from "./render-history-list.js";

// Shows the list, or the empty state, plus the toolbar and the "history is
// off" note that depend on it.
export function renderHistoryView(elements, entries, isEnabled, now = new Date()) {
  const hasEntries = entries.length > 0;

  elements.toolbar.hidden = !hasEntries;
  elements.count.textContent = `${entries.length} saved ${entries.length === 1 ? "copy" : "copies"}`;
  elements.list.hidden = !hasEntries;
  elements.empty.hidden = hasEntries;
  elements.empty.textContent = isEnabled
    ? "Nothing here yet. Pages you copy with WebToMarkdown show up here."
    : "Copy history is off. Turn on Save copy history in Settings to keep pages you copy.";
  elements.offNote.hidden = isEnabled || !hasEntries;

  renderHistoryList(elements.list, entries, now);
}
