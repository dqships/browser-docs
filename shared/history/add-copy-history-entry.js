import { COPY_HISTORY_LIMIT } from "../constants/copy-history.js";
import { buildHistoryEntry } from "./build-history-entry.js";
import { insertHistoryEntry } from "./insert-history-entry.js";
import { updateCopyHistory } from "./update-copy-history.js";

// Adds a copied extraction result to the top of the history.
export async function addCopyHistoryEntry(result) {
  const entry = buildHistoryEntry(result, {
    id: crypto.randomUUID(),
    copiedAt: new Date().toISOString()
  });

  if (!entry.markdown) {
    return;
  }

  await updateCopyHistory((entries) => insertHistoryEntry(entries, entry, COPY_HISTORY_LIMIT));
}
