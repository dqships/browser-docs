import { BrowserWindowFrame } from "@/components/browser-window-frame";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserContextMenuSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} variant="dark">
      <div
        style={{
          left: 500,
          position: "absolute",
          top: 128,
          width: 1760,
        }}
      >
        <MarketingHeading
          align="center"
          body="Use the keyboard shortcut or copy right from the extension while you read."
          eyebrow="Fast access"
          headline={
            <>
              Copy from the
              <br />
              page menu.
            </>
          }
        />
      </div>
      <div style={{ left: 230, position: "absolute", top: 712, width: 2420 }}>
        <BrowserWindowFrame
          browserName="Firefox"
          imageAlt="Context menu toast on docs page"
          imageSrc={sourceAssets.browserContextMenu}
          objectPosition="top center"
          tone="dark"
          urlLabel="docs.vendor.dev/getting-started"
        />
      </div>
    </SlideShell>
  );
}
