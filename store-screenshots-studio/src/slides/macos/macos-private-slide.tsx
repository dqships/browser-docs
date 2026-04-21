import { MarketingHeading } from "@/components/marketing-heading";
import { SlideShell } from "@/components/slide-shell";
import { sourceAssets } from "@/data/source-assets";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosPrivateSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} variant="dark">
      <div
        style={{
          left: 160,
          position: "absolute",
          top: 214,
          width: 1000,
        }}
      >
        <MarketingHeading
          body="It copies and converts pages on-device, with no account, upload queue, or hidden sync."
          eyebrow="Works locally"
          headline={
            <>
              Your docs stay
              <br />
              on your Mac.
            </>
          }
        />
      </div>
      <img
        alt="WebToMarkdown popup success"
        draggable={false}
        src={sourceAssets.popupSuccess}
        style={{
          borderRadius: 36,
          border: "1px solid rgba(0, 229, 255, 0.24)",
          boxShadow: "0 38px 120px rgba(0, 0, 0, 0.48)",
          position: "absolute",
          right: 206,
          top: 224,
          width: 530,
        }}
      />
      <img
        alt="WebToMarkdown icon"
        draggable={false}
        src={sourceAssets.icon}
        style={{
          borderRadius: 52,
          boxShadow: "0 32px 94px rgba(0, 0, 0, 0.42)",
          position: "absolute",
          right: 118,
          top: 1046,
          width: 230,
        }}
      />
    </SlideShell>
  );
}
