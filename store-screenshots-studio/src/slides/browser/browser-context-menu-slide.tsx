import { BrowserWindowFrame } from "@/components/browser-window-frame";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserContextMenuSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Fast access" tone="deep">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1000 }}>
        <MarketingHeading
          body="Right-click any page and pick “Copy page as Markdown” or “Download page as Markdown”. A small toast confirms it. ⌥⇧M copies too."
          eyebrow="03 — Page menu"
          headline={
            <>
              Right-click.
              <br />
              Copy or save.
            </>
          }
          tone="deep"
        />
      </div>
      <div style={{ left: 1260, position: "absolute", top: 252, width: 1464 }}>
        <BrowserWindowFrame
          browserName="Firefox"
          imageAlt="Copy confirmation toast on a readable web page"
          imageSrc={sourceAssets.browserContextMenu}
          tone="deep"
        />
      </div>
    </SlideShell>
  );
}
