import { COPY_HISTORY_STORAGE_KEY } from "../constants/copy-history.js";

// Writes the history list. If the browser refuses because local storage is
// full, older entries are dropped (halving each time) until the write fits.
// Returns the list that was actually stored.
export async function saveCopyHistory(entries) {
  let toStore = entries;

  for (;;) {
    try {
      await browser.storage.local.set({ [COPY_HISTORY_STORAGE_KEY]: toStore });
      return toStore;
    } catch (error) {
      if (toStore.length <= 1) {
        throw error;
      }
      toStore = toStore.slice(0, Math.ceil(toStore.length / 2));
    }
  }
}
