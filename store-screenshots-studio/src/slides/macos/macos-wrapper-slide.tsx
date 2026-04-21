import { MarketingHeading } from "@/components/marketing-heading";
import { MacAppWindow } from "@/components/mac-app-window";
import { SlideShell } from "@/components/slide-shell";
import { WrapperStateCard } from "@/components/wrapper-state-card";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosWrapperSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} variant="light">
      <div style={{ left: 120, position: "absolute", top: 170, width: 1420 }}>
        <MacAppWindow title="WebToMarkdown" tone="light">
          <WrapperStateCard state="off" />
        </MacAppWindow>
      </div>
      <div
        style={{
          position: "absolute",
          right: 156,
          top: 220,
          width: 860,
        }}
      >
        <MarketingHeading
          body="The Mac app takes you straight to Safari settings so setup stays simple."
          eyebrow="Easy setup"
          headline={
            <>
              Turn it on
              <br />
              in Safari.
            </>
          }
          tone="light"
        />
      </div>
    </SlideShell>
  );
}
