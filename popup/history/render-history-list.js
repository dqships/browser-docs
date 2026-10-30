import { renderHistoryRow } from "./render-history-row.js";

// Replaces the list contents with one row per entry, newest first.
export function renderHistoryList(listElement, entries, now = new Date()) {
  listElement.replaceChildren(
    ...entries.map((entry, index) => renderHistoryRow(entry, index, now))
  );
}
