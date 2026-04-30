import { describe, expect, it } from "vitest";
import { detectPreferredDownloadTarget } from "@/lib/download-targets";

describe("detectPreferredDownloadTarget", () => {
  it("returns safari for desktop Safari on macOS", () => {
    expect(
      detectPreferredDownloadTarget(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
      ),
    ).toBe("safari");
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
