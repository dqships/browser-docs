import { MacAppWindow } from "@/components/mac-app-window";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserSettingsSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Copy options" tone="paper">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1000 }}>
        <MarketingHeading
          body="Frontmatter, title heading, source link, tables, pruning, and copy history. Six switches, all on by default, saved as you change them."
          eyebrow="05 — Settings"
          headline={
            <>
              Choose what
              <br />
              gets copied.
            </>
          }
        />
      </div>
      <div style={{ left: 1260, position: "absolute", top: 252, width: 1464 }}>
        <MacAppWindow platform="Chrome" title="WebToMarkdown Settings">
          <img
            alt="WebToMarkdown settings page"
            draggable={false}
            src={sourceAssets.optionsUpdated}
            style={{ display: "block", width: "100%" }}
          />
        </MacAppWindow>
      </div>
    </SlideShell>
  );
}
