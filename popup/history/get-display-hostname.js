// The hostname shown under a history entry's title, without "www.".
export function getDisplayHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
