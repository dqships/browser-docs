import { COPY_HISTORY_STORAGE_KEY } from "../constants/copy-history.js";

function isEntry(value) {
  return Boolean(value) && typeof value.id === "string" && typeof value.markdown === "string";
}

// Reads the newest-first copy history. Anything malformed is dropped.
export async function getCopyHistory() {
  const stored = await browser.storage.local.get(COPY_HISTORY_STORAGE_KEY);
  const entries = stored?.[COPY_HISTORY_STORAGE_KEY];

  return Array.isArray(entries) ? entries.filter(isEntry) : [];
}
