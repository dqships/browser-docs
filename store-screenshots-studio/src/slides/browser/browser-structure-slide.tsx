import { BrowserWindowFrame } from "@/components/browser-window-frame";
import { MarkdownCard } from "@/components/markdown-card";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { markdownExcerptLines, sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserStructureSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Keeps structure" tone="paper">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1080 }}>
        <MarketingHeading
          body="Headings, nested lists, code blocks, and tables stay intact. Navigation, sidebars, and cookie prompts stay behind."
          eyebrow="02 — What it keeps"
          headline={
            <>
              Content in.
              <br />
              Chrome out.
            </>
          }
        />
      </div>
      <div style={{ left: 1360, position: "absolute", top: 252, width: 1360 }}>
        <BrowserWindowFrame
          browserName="Chrome"
          imageAlt="Readable web page before copying"
          imageSrc={sourceAssets.browserContextMenu}
        />
      </div>
      <div style={{ left: 1700, position: "absolute", top: 760, width: 1020 }}>
        <MarkdownCard lines={markdownExcerptLines} />
      </div>
    </SlideShell>
  );
}
