import { site } from "@/lib/site";

export const downloadTargetIds = ["chrome", "safari"] as const;

export type DownloadTargetId = (typeof downloadTargetIds)[number];

export type DownloadLabelMode = "browser" | "cta";

export function getDownloadTarget(target: DownloadTargetId) {
  return site.downloadTargets[target];
}

export function isDownloadTargetAvailable(target: DownloadTargetId) {
  return getDownloadTarget(target).available;
}

/** Targets with a live store listing, in display order. */
export const availableDownloadTargetIds: DownloadTargetId[] =
  downloadTargetIds.filter(isDownloadTargetAvailable);

/** "Chrome", "Chrome and Safari", … for availability copy. */
export function formatAvailableBrowsers(conjunction = "and") {
  const labels = availableDownloadTargetIds.map(
    (target) => getDownloadTarget(target).browserLabel,
  );
  return labels.length > 1
    ? `${labels.slice(0, -1).join(", ")} ${conjunction} ${labels.at(-1)}`
    : (labels[0] ?? "");
}

export function getDownloadTargetLabel(
  target: DownloadTargetId,
  mode: DownloadLabelMode,
) {
  const targetDetails = getDownloadTarget(target);
  return mode === "browser"
    ? targetDetails.browserLabel
    : targetDetails.ctaLabel;
}

/** The visitor's store target, if it is one with a live listing. */
export function detectPreferredDownloadTarget(userAgent: string) {
  const target = detectBrowserDownloadTarget(userAgent);
  return target !== null && isDownloadTargetAvailable(target) ? target : null;
}

/** The store target that matches the visitor's browser, live or not. */
export function detectBrowserDownloadTarget(
  userAgent: string,
): DownloadTargetId | null {
  const normalizedUserAgent = userAgent.toLowerCase();

  if (!normalizedUserAgent) {
    return null;
  }

  const isIOSDevice =
    normalizedUserAgent.includes("iphone") ||
    normalizedUserAgent.includes("ipad") ||
    normalizedUserAgent.includes("ipod");
  const isMac =
    normalizedUserAgent.includes("macintosh") ||
    normalizedUserAgent.includes("mac os x");
  const isSafari =
    normalizedUserAgent.includes("safari/") &&
    !/(chrome|chromium|crios|edg|edge|opr|opera|firefox|fxios)/.test(
      normalizedUserAgent,
    );

  if (!isIOSDevice && isMac && isSafari) {
    return "safari" as const;
  }

  const isDesktopPlatform =
    (!isIOSDevice &&
      (normalizedUserAgent.includes("macintosh") ||
        normalizedUserAgent.includes("mac os x"))) ||
    normalizedUserAgent.includes("windows nt") ||
    normalizedUserAgent.includes("x11") ||
    normalizedUserAgent.includes("linux x86_64") ||
    normalizedUserAgent.includes("cros");
  const isChromiumBrowser =
    /(chrome|chromium|crios|edg|edge|opr|opera)/.test(normalizedUserAgent);

  if (isDesktopPlatform && isChromiumBrowser) {
    return "chrome" as const;
  }

  return null;
}
