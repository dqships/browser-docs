import { getCopyHistory } from "./get-copy-history.js";
import { saveCopyHistory } from "./save-copy-history.js";
import { withHistoryLock } from "./with-history-lock.js";

// Read-modify-write of the history under the lock, so a copy recorded by the
// service worker and a delete in the popup cannot overwrite each other.
// transform receives the current list and returns the next one.
export function updateCopyHistory(transform) {
  return withHistoryLock(async () => {
    const entries = await getCopyHistory();
    return saveCopyHistory(transform(entries));
  });
}
