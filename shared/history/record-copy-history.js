import { getSettings } from "../storage/settings-repository.js";
import { addCopyHistoryEntry } from "./add-copy-history-entry.js";

// Called from the action hook. Saves copies (not downloads) while the
// "Save copy history" setting is on.
export async function recordCopyHistory({ kind, result }) {
  if (kind !== "copy") {
    return;
  }

  const settings = await getSettings();
  if (!settings.saveCopyHistory) {
    return;
  }

  await addCopyHistoryEntry(result);
}
