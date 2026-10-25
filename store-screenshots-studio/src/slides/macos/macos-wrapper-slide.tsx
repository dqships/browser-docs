import { MarketingHeading } from "@/components/marketing-heading";
import { MacAppWindow } from "@/components/mac-app-window";
import { SlideShell } from "@/components/slide-shell";
import { WrapperStateCard } from "@/components/wrapper-state-card";
import type { SlideComponentProps } from "@/types/slide-definition";

export function MacosWrapperSlide({
  className = "",
}: SlideComponentProps) {
  return (
    <SlideShell className={className} label="Easy setup" tone="paper">
      <div style={{ left: 156, position: "absolute", top: 300, width: 1000 }}>
        <MarketingHeading
          body="The Mac app takes you straight to Safari settings so setup stays simple."
          eyebrow="04 — One-time setup"
          headline={
            <>
              Turn it on
              <br />
              in Safari.
            </>
          }
        />
      </div>
      <div style={{ left: 1260, position: "absolute", top: 300, width: 1464 }}>
        <MacAppWindow title="WebToMarkdown">
          <WrapperStateCard state="off" />
        </MacAppWindow>
      </div>
    </SlideShell>
  );
}
