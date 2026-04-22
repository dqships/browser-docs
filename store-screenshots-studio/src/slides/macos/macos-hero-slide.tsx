import { BrowserWindowFrame } from "@/components/browser-window-frame";
import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosHeroSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} variant="electric">
      <div
        style={{
          left: 154,
          position: "absolute",
          top: 188,
          width: 1040,
        }}
      >
        <MarketingHeading
          body="Grab the readable part of the page and paste clean Markdown into notes, prompts, or your own archive."
          eyebrow="Safari extension"
          headline={
            <>
              Copy readable pages
              <br />
              as Markdown.
            </>
          }
        />
      </div>
      <div style={{ position: "absolute", right: 120, top: 160, width: 1500 }}>
        <BrowserWindowFrame
          browserName="Safari"
          imageAlt="Safari readable web page"
          imageSrc={sourceAssets.browserContextMenu}
          objectPosition="top center"
          tone="light"
          urlLabel="example.com/readable-page"
        />
      </div>
      <img
        alt="WebToMarkdown popup success"
        draggable={false}
        src={sourceAssets.popupSuccess}
        style={{
          borderRadius: 28,
          border: "1px solid rgba(0, 229, 255, 0.22)",
          boxShadow: "0 36px 92px rgba(0, 0, 0, 0.44)",
          position: "absolute",
          right: 72,
          top: 928,
          width: 370,
        }}
      />
    </SlideShell>
  );
}
