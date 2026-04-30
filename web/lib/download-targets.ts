import { site } from "@/lib/site";

export const downloadTargetIds = ["chrome", "safari"] as const;

export type DownloadTargetId = (typeof downloadTargetIds)[number];

export type DownloadLabelMode = "browser" | "cta";

export function getDownloadTarget(target: DownloadTargetId) {
  return site.downloadTargets[target];
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

export function detectPreferredDownloadTarget(userAgent: string) {
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
