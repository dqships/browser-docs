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
          body="Right-click the page, use the toolbar popup, or press ⌥⇧M. A small toast confirms what was copied."
          eyebrow="03 — Three ways in"
          headline={
            <>
              Three ways
              <br />
              to copy.
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
