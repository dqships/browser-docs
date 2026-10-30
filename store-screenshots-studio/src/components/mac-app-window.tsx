import { frameStyle } from "@/components/frame-style";
import { WindowChromeBar } from "@/components/window-chrome-bar";
import type { SlideTone } from "@/data/design-tokens";

type MacAppWindowProps = {
  className?: string;
  title: string;
  children: React.ReactNode;
  tone?: SlideTone;
  /** Label on the right of the title bar. */
  platform?: string;
};

export function MacAppWindow({
  className = "",
  title,
  children,
  tone = "paper",
  platform = "macOS",
}: MacAppWindowProps) {
  return (
    <div className={className} style={frameStyle(tone)}>
      <WindowChromeBar
        left={
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          >
            {title}
          </div>
        }
        right={platform}
      />
      <div>{children}</div>
    </div>
  );
}
