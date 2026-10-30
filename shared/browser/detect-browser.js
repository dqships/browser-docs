// Returns "firefox", "safari", or "chrome" (every Chromium browser, including
// Edge, uses the Chrome Web Store listing).
export function detectBrowser(userAgent = globalThis.navigator?.userAgent ?? "") {
  if (/Firefox\//.test(userAgent)) {
    return "firefox";
  }

  if (/Safari\//.test(userAgent) && !/(Chrome|Chromium|Edg)\//.test(userAgent)) {
    return "safari";
  }

  return "chrome";
}
