import { frameStyle } from "@/components/frame-style";
import type { SlideTone } from "@/data/design-tokens";

type ScreenshotCardProps = {
  src: string;
  alt: string;
  tone?: SlideTone;
  style?: React.CSSProperties;
};

/** A bare UI capture (e.g. the popup) in the standard square frame. */
export function ScreenshotCard({ src, alt, tone = "paper", style }: ScreenshotCardProps) {
  return (
    <img
      alt={alt}
      draggable={false}
      src={src}
      style={{ display: "block", ...frameStyle(tone), ...style }}
    />
  );
}
