import { MacAppWindow } from "@/components/mac-app-window";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosSettingsSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Copy options" tone="deep">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1000 }}>
        <MarketingHeading
          body="Frontmatter, title heading, source link, tables, and pruning. Five switches, all on by default."
          eyebrow="03 — Settings"
          headline={
            <>
              Choose what
              <br />
              gets copied.
            </>
          }
          tone="deep"
        />
      </div>
      <div style={{ left: 1260, position: "absolute", top: 252, width: 1464 }}>
        <MacAppWindow title="WebToMarkdown Settings" tone="deep">
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
