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
          body="One click copies the readable part of the page as clean Markdown for notes, prompts, or your own archive."
          eyebrow="01 — Copy any page"
          headline={
            <>
              Web page in.
              <br />
              Markdown out.
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
        alt="WebToMarkdown popup after a successful copy"
        src={sourceAssets.popupSuccess}
        style={{ left: 2240, position: "absolute", top: 820, width: 520 }}
        tone="paper"
      />
    </SlideShell>
  );
}
