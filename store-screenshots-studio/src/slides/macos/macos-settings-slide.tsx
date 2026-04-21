import { MacAppWindow } from "@/components/mac-app-window";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosSettingsSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} variant="dark">
      <div
        style={{
          left: 160,
          position: "absolute",
          top: 206,
          width: 960,
        }}
      >
        <MarketingHeading
          body="Add a title, source link, frontmatter, or table support before you copy."
          eyebrow="Copy options"
          headline={
            <>
              Choose what
              <br />
              gets copied.
            </>
          }
        />
      </div>
      <div style={{ position: "absolute", right: 120, top: 144, width: 1480 }}>
        <MacAppWindow title="WebToMarkdown Settings" tone="dark">
          <img
            alt="WebToMarkdown settings panel"
            draggable={false}
            src={sourceAssets.optionsUpdated}
            style={{
              display: "block",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              width: "100%",
            }}
          />
        </MacAppWindow>
      </div>
    </SlideShell>
  );
}
