import { describe, expect, it } from "vitest";
import {
  availableDownloadTargetIds,
  detectBrowserDownloadTarget,
  detectPreferredDownloadTarget,
  formatAvailableBrowsers,
} from "@/lib/download-targets";

const DESKTOP_SAFARI_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";

describe("available download targets", () => {
  it("lists only Chrome while the Safari app is pulled from the App Store", () => {
    expect(availableDownloadTargetIds).toEqual(["chrome"]);
    expect(formatAvailableBrowsers()).toBe("Chrome");
  });
});

describe("detectBrowserDownloadTarget", () => {
  it("still recognizes desktop Safari on macOS", () => {
    expect(detectBrowserDownloadTarget(DESKTOP_SAFARI_UA)).toBe("safari");
  });
});

describe("detectPreferredDownloadTarget", () => {
  it("returns null for desktop Safari while the Safari listing is unavailable", () => {
    expect(detectPreferredDownloadTarget(DESKTOP_SAFARI_UA)).toBeNull();
  });

  it("returns chrome for desktop Chrome on macOS", () => {
    expect(
      detectPreferredDownloadTarget(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      ),
    ).toBe("chrome");
  });

  it("returns chrome for Edge because the Chrome Web Store target still applies", () => {
    expect(
      detectPreferredDownloadTarget(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0",
      ),
    ).toBe("chrome");
  });

  it("returns null for Firefox", () => {
    expect(
      detectPreferredDownloadTarget(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 15.6; rv:137.0) Gecko/20100101 Firefox/137.0",
      ),
    ).toBeNull();
  });

  it("returns null for mobile Safari because the Safari listing is macOS only", () => {
    expect(
      detectPreferredDownloadTarget(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Mobile/15E148 Safari/604.1",
      ),
    ).toBeNull();
  });
});
