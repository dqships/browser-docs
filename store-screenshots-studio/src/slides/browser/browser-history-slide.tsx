import { MarketingHeading } from "@/components/marketing-heading";
import { ScreenshotCard } from "@/components/screenshot-card";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserHistorySlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Copy history" tone="ink">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1400 }}>
        <MarketingHeading
          body="Copy a page again, download it as .md, or go back to the site. History stays in your browser. No account, no upload, no server."
          eyebrow="04 — Copy history"
          headline={
            <>
              Every copy,
              <br />
              kept on your device.
            </>
          }
          tone="ink"
        />
      </div>
      <ScreenshotCard
        alt="WebToMarkdown popup History view with three saved copies"
        src={sourceAssets.popupHistory}
        style={{ left: 1964, position: "absolute", top: 252, width: 760 }}
        tone="ink"
      />
    </SlideShell>
  );
}
