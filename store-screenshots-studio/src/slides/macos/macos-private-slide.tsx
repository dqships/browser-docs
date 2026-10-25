import { MarketingHeading } from "@/components/marketing-heading";
import { ScreenshotCard } from "@/components/screenshot-card";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosPrivateSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Works locally" tone="ink">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1300 }}>
        <MarketingHeading
          body="Pages are converted on your Mac. No account, no upload, and no WebToMarkdown server."
          eyebrow="05 — Private by default"
          headline={
            <>
              Your pages stay
              <br />
              on your Mac.
            </>
          }
          tone="ink"
        />
      </div>
      <img
        alt="WebToMarkdown icon"
        draggable={false}
        src={sourceAssets.icon}
        style={{ left: 1660, position: "absolute", top: 300, width: 300 }}
      />
      <ScreenshotCard
        alt="WebToMarkdown popup preview"
        src={sourceAssets.popupSuccess}
        style={{ left: 2060, position: "absolute", top: 300, width: 664 }}
        tone="ink"
      />
    </SlideShell>
  );
}
