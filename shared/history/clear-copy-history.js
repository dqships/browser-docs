import { COPY_HISTORY_STORAGE_KEY } from "../constants/copy-history.js";
import { withHistoryLock } from "./with-history-lock.js";

// Deletes every history entry.
export function clearCopyHistory() {
  return withHistoryLock(() => browser.storage.local.remove(COPY_HISTORY_STORAGE_KEY));
}
