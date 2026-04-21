import { brandTokens } from "@/data/design-tokens";

type MarketingHeadingProps = {
  eyebrow: string;
  headline: React.ReactNode;
  body: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function MarketingHeading({
  eyebrow,
  headline,
  body,
  align = "left",
  tone = "dark",
  className = "",
}: MarketingHeadingProps) {
  const centered = align === "center";
  const headlineColor =
    tone === "dark" ? brandTokens.textPrimary : brandTokens.lightText;
  const bodyColor =
    tone === "dark" ? brandTokens.textSecondary : brandTokens.lightMuted;

  return (
    <div className={className} style={{ textAlign: centered ? "center" : "left" }}>
      <p
        style={{
          color: brandTokens.accent,
          fontFamily: "var(--font-mono-stack)",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "0.28em",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          color: headlineColor,
          fontFamily: "var(--font-heading-stack)",
          fontSize: 158,
          fontWeight: 700,
          letterSpacing: "-0.06em",
          lineHeight: 0.92,
          margin: "28px 0 22px",
          maxWidth: 980,
        }}
      >
        {headline}
      </h2>
      <p
        style={{
          color: bodyColor,
          fontSize: 46,
          lineHeight: 1.3,
          margin: 0,
          maxWidth: centered ? 980 : 860,
        }}
      >
        {body}
      </p>
    </div>
  );
}
