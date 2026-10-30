// Only http(s) pages are opened from the history view. Anything else stored
// with an entry (javascript:, data:, file:, browser-internal pages) is ignored.
export function isOpenableUrl(url) {
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}
