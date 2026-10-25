import { BrowserWindowFrame } from "@/components/browser-window-frame";
import { MarketingHeading } from "@/components/marketing-heading";
import { ScreenshotCard } from "@/components/screenshot-card";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosHeroSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Safari extension" tone="ink">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1080 }}>
        <MarketingHeading
          body="Grab the readable part of the page and paste clean Markdown into notes, prompts, or your own archive."
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
          browserName="Safari"
          imageAlt="WebToMarkdown copy confirmation in Safari"
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
