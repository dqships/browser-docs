import { MacAppWindow } from "@/components/mac-app-window";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserSettingsSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} variant="light">
      <div
        style={{
          left: 158,
          position: "absolute",
          top: 212,
          width: 920,
        }}
      >
        <MarketingHeading
          body="Add title headings, source links, frontmatter, or table support before you copy."
          eyebrow="Copy options"
          headline={
            <>
              Choose what
              <br />
              gets copied.
            </>
          }
          tone="light"
        />
      </div>
      <div style={{ position: "absolute", right: 120, top: 148, width: 1520 }}>
        <MacAppWindow title="WebToMarkdown Settings" tone="light">
          <img
            alt="WebToMarkdown settings UI"
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
