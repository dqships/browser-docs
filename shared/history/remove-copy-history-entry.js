import { updateCopyHistory } from "./update-copy-history.js";

// Deletes one entry by id. Returns the remaining entries.
export function removeCopyHistoryEntry(id) {
  return updateCopyHistory((entries) => entries.filter((entry) => entry.id !== id));
}
