import { BrowserWindowFrame } from "@/components/browser-window-frame";
import { MarkdownCard } from "@/components/markdown-card";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { markdownExcerptLines, sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosWorkflowSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Simple flow" tone="paper">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1080 }}>
        <MarketingHeading
          body="Press ⌥⇧M or use the toolbar popup, then paste anywhere. Headings, lists, code, and tables come with it."
          eyebrow="02 — Open, copy, paste"
          headline={
            <>
              Open. Copy.
              <br />
              Paste.
            </>
          }
        />
      </div>
      <div style={{ left: 1360, position: "absolute", top: 252, width: 1360 }}>
        <BrowserWindowFrame
          browserName="Safari"
          imageAlt="Readable web page in Safari"
          imageSrc={sourceAssets.browserContextMenu}
        />
      </div>
      <div style={{ left: 1700, position: "absolute", top: 760, width: 1020 }}>
        <MarkdownCard lines={markdownExcerptLines} />
      </div>
    </SlideShell>
  );
}
