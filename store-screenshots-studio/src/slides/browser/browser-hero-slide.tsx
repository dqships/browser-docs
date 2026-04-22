import { BrowserWindowFrame } from "@/components/browser-window-frame";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserHeroSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} variant="electric">
      <div
        style={{
          display: "grid",
          gap: 28,
          left: 156,
          position: "absolute",
          top: 180,
          width: 1020,
        }}
      >
        <MarketingHeading
          body="One click copies the readable part of the page as clean Markdown for notes, prompts, or your own archive."
          eyebrow="Browser extension"
          headline={
            <>
              Copy readable pages
              <br />
              as Markdown.
            </>
          }
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 152,
          width: 1460,
        }}
      >
        <BrowserWindowFrame
          browserName="Chrome"
          imageAlt="WebToMarkdown on a readable web page"
          imageSrc={sourceAssets.browserContextMenu}
          objectPosition="top center"
          urlLabel="example.com/readable-page"
          tone="dark"
        />
      </div>
      <img
        alt="WebToMarkdown popup success"
        draggable={false}
        src={sourceAssets.popupSuccess}
        style={{
          borderRadius: 28,
          border: "1px solid rgba(0, 229, 255, 0.24)",
          boxShadow: "0 36px 92px rgba(0, 0, 0, 0.45)",
          position: "absolute",
          right: 54,
          top: 900,
          width: 360,
        }}
      />
    </SlideShell>
  );
}
