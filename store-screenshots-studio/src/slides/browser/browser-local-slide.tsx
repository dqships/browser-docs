import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function BrowserLocalSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} variant="dark">
      <div
        style={{
          left: 158,
          position: "absolute",
          top: 202,
          width: 960,
        }}
      >
        <MarketingHeading
          body="No account, no upload, no hidden sync. Just copy the page and move on."
          eyebrow="Works locally"
          headline={
            <>
              Works locally
              <br />
              in your browser.
            </>
          }
        />
      </div>
      <img
        alt="WebToMarkdown icon"
        draggable={false}
        src={sourceAssets.icon}
        style={{
          borderRadius: 56,
          boxShadow: "0 34px 120px rgba(0, 0, 0, 0.42)",
          position: "absolute",
          right: 250,
          top: 180,
          width: 280,
        }}
      />
      <img
        alt="WebToMarkdown popup preview"
        draggable={false}
        src={sourceAssets.popupSuccess}
        style={{
          borderRadius: 34,
          border: "1px solid rgba(0, 229, 255, 0.22)",
          boxShadow: "0 42px 120px rgba(0, 0, 0, 0.46)",
          position: "absolute",
          right: 170,
          top: 390,
          width: 560,
        }}
      />
    </SlideShell>
  );
}
