import { brandTokens, isInkTone, type SlideTone } from "@/data/design-tokens";

/** Square, ink-bordered frame. On paper slides it casts a hard ink offset. */
export function frameStyle(tone: SlideTone): React.CSSProperties {
  return {
    background: brandTokens.paper,
    border: `3px solid ${isInkTone(tone) ? brandTokens.onInk : brandTokens.ink}`,
    boxShadow: isInkTone(tone) ? "none" : `24px 24px 0 ${brandTokens.ink}`,
    overflow: "hidden",
  };
}
