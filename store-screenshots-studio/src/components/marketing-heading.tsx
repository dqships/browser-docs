import { brandTokens, isInkTone, type SlideTone } from "@/data/design-tokens";

type MarketingHeadingProps = {
  eyebrow: string;
  headline: React.ReactNode;
  body: React.ReactNode;
  tone?: SlideTone;
  className?: string;
};

export function MarketingHeading({
  eyebrow,
  headline,
  body,
  tone = "paper",
  className = "",
}: MarketingHeadingProps) {
  const onInk = isInkTone(tone);

  return (
    <div className={className}>
      <p
        style={{
          alignItems: "center",
          color: onInk ? brandTokens.onInk : brandTokens.ink,
          display: "flex",
          fontFamily: "var(--font-mono-stack)",
          fontSize: 30,
          fontWeight: 500,
          gap: 18,
          letterSpacing: "0.08em",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        <span
          style={{
            background: brandTokens.signal,
            display: "block",
            height: 20,
            width: 20,
          }}
        />
        {eyebrow}
      </p>
      <h2
        style={{
          color: onInk ? brandTokens.onInk : brandTokens.ink,
          fontFamily: "var(--font-heading-stack)",
          fontSize: 116,
          fontStretch: "112%",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 0.92,
          margin: "40px 0 36px",
          whiteSpace: "nowrap",
        }}
      >
        {headline}
      </h2>
      <p
        style={{
          color: onInk ? brandTokens.onInkMuted : brandTokens.inkSoft,
          fontSize: 44,
          lineHeight: 1.35,
          margin: 0,
          maxWidth: 900,
        }}
      >
        {body}
      </p>
    </div>
  );
}
