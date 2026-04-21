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
    <SlideShell className={className} variant="light">
      <div style={{ left: 130, position: "absolute", top: 242, width: 1450 }}>
        <BrowserWindowFrame
          browserName="Docs page"
          imageAlt="Documentation source page"
          imageSrc={sourceAssets.browserContextMenu}
          objectPosition="top center"
          tone="light"
          urlLabel="docs.vendor.dev/getting-started"
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 156,
          top: 184,
          width: 930,
        }}
      >
        <MarketingHeading
          body="Get Markdown you can actually use: headings, nested lists, code blocks, and tables stay intact."
          eyebrow="Keeps structure"
          headline={
            <>
              Keep headings,
              <br />
              lists, and tables.
            </>
          }
          tone="light"
        />
      </div>
      <div style={{ bottom: 122, position: "absolute", right: 136, width: 980 }}>
        <MarkdownCard lines={markdownExcerptLines} />
      </div>
    </SlideShell>
  );
}
