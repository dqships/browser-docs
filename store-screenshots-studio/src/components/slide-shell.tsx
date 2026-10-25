import { BrandMark } from "@/components/brand-mark";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  brandTokens,
  isInkTone,
  type SlideTone,
} from "@/data/design-tokens";

type SlideShellProps = {
  children: React.ReactNode;
  className?: string;
  tone?: SlideTone;
  label: string;
};

const toneBackground = {
  paper: brandTokens.paper,
  deep: brandTokens.paperDeep,
  ink: brandTokens.ink,
} as const;

/** Flat slide canvas with a masthead: lockup on the left, mono label on the right. */
export function SlideShell({
  children,
  className = "",
  tone = "paper",
  label,
}: SlideShellProps) {
  const onInk = isInkTone(tone);
  const foreground = onInk ? brandTokens.onInk : brandTokens.ink;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: toneBackground[tone],
        color: foreground,
        fontFamily: "var(--font-sans-stack)",
        height: CANVAS_HEIGHT,
        width: CANVAS_WIDTH,
      }}
    >
      <div
        style={{
          alignItems: "center",
          borderBottom: `3px solid ${foreground}`,
          display: "flex",
          height: 132,
          justifyContent: "space-between",
          left: 156,
          position: "absolute",
          right: 156,
          top: 0,
        }}
      >
        <span
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            gap: 20,
            letterSpacing: "-0.01em",
          }}
        >
          <BrandMark onInk={onInk} size={52} />
          WebToMarkdown
        </span>
        <span
          style={{
            color: onInk ? brandTokens.onInkMuted : brandTokens.inkMuted,
            fontFamily: "var(--font-mono-stack)",
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
