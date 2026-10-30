import { removeCopyHistoryEntry } from "../../shared/history/remove-copy-history-entry.js";

export async function deleteHistoryEntry(entry) {
  await removeCopyHistoryEntry(entry.id);
  return "Deleted.";
}
