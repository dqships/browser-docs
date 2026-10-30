import { BrowserWindowFrame } from "@/components/browser-window-frame";
import { MarketingHeading } from "@/components/marketing-heading";
import { ScreenshotCard } from "@/components/screenshot-card";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserHeroSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Browser extension" tone="ink">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1080 }}>
        <MarketingHeading
          body="One click turns the readable part of any page into clean Markdown. Copy it to your clipboard or save it as a .md file."
          eyebrow="01 — Copy or download"
          headline={
            <>
              Copy it or
              <br />
              download it.
            </>
          }
          tone="ink"
        />
      </div>
      <div style={{ left: 1320, position: "absolute", top: 252, width: 1404 }}>
        <BrowserWindowFrame
          browserName="Chrome"
          imageAlt="WebToMarkdown copy confirmation on a readable web page"
          imageSrc={sourceAssets.browserContextMenu}
          tone="ink"
        />
      </div>
      <ScreenshotCard
        alt="WebToMarkdown popup after a successful copy, with Copy and Download buttons"
        src={sourceAssets.popupSuccess}
        style={{ left: 2164, position: "absolute", top: 560, width: 600 }}
        tone="paper"
      />
    </SlideShell>
  );
}
