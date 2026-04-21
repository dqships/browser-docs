import { brandTokens } from "@/data/design-tokens";

type MarkdownCardProps = {
  lines: readonly string[];
  className?: string;
};

export function MarkdownCard({
  lines,
  className = "",
}: MarkdownCardProps) {
  return (
    <div
      className={className}
      style={{
        background:
          "linear-gradient(180deg, rgba(6, 9, 15, 0.96) 0%, rgba(3, 4, 7, 0.98) 100%)",
        border: `1px solid ${brandTokens.borderStrong}`,
        borderRadius: 36,
        boxShadow: brandTokens.shadow,
        color: brandTokens.textPrimary,
        overflow: "hidden",
        padding: 42,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 18,
          marginBottom: 28,
        }}
      >
        <span
          style={{
            background: brandTokens.accent,
            borderRadius: "50%",
            boxShadow: `0 0 28px ${brandTokens.accentGlow}`,
            display: "block",
            height: 16,
            width: 16,
          }}
        />
        <span
          style={{
            color: brandTokens.textSecondary,
            fontFamily: "var(--font-mono-stack)",
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Markdown preview
        </span>
      </div>
      <pre
        style={{
          fontFamily: "var(--font-mono-stack)",
          fontSize: 28,
          lineHeight: 1.6,
          margin: 0,
          whiteSpace: "pre-wrap",
        }}
      >
        {lines.join("\n")}
      </pre>
    </div>
  );
}
