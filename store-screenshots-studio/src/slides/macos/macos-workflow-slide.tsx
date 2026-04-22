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
    <SlideShell className={className} variant="light">
      <div
        style={{
          left: 160,
          position: "absolute",
          top: 176,
          width: 920,
        }}
      >
        <MarketingHeading
          body="Use the keyboard shortcut or copy right from the extension then paste anywhere."
          eyebrow="Simple flow"
          headline={
            <>
              Open, copy,
              <br />
              paste, done.
            </>
          }
          tone="light"
        />
      </div>
      <div style={{ left: 160, position: "absolute", top: 806, width: 1180 }}>
        <BrowserWindowFrame
          browserName="Safari"
          imageAlt="Safari readable web page"
          imageSrc={sourceAssets.browserContextMenu}
          objectPosition="top center"
          tone="light"
          urlLabel="example.com/readable-page"
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 132,
          top: 572,
          width: 1040,
        }}
      >
        <MarkdownCard lines={markdownExcerptLines} />
      </div>
    </SlideShell>
  );
}
