import { frameStyle } from "@/components/frame-style";
import { brandTokens, type SlideTone } from "@/data/design-tokens";

type MarkdownCardProps = {
  lines: readonly string[];
  className?: string;
  tone?: SlideTone;
};

const LEADING_SYNTAX = /^(#{1,6} |- |\d+\. |```|\| |---)/;

function MarkdownLine({ line }: { line: string }) {
  const syntax = line.match(LEADING_SYNTAX)?.[0] ?? "";

  return (
    <>
      <span style={{ color: brandTokens.signalText }}>{syntax}</span>
      {line.slice(syntax.length)}
    </>
  );
}

export function MarkdownCard({
  lines,
  className = "",
  tone = "paper",
}: MarkdownCardProps) {
  return (
    <div
      className={className}
      style={{ ...frameStyle(tone), background: brandTokens.paperDeep, color: brandTokens.ink }}
    >
      <div
        style={{
          alignItems: "center",
          borderBottom: `3px solid ${brandTokens.ink}`,
          display: "flex",
          fontFamily: "var(--font-mono-stack)",
          fontSize: 24,
          justifyContent: "space-between",
          padding: "22px 36px",
        }}
      >
        <span style={{ color: brandTokens.inkMuted }}>Clipboard</span>
        <span
          style={{
            alignItems: "center",
            display: "flex",
            fontWeight: 500,
            gap: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ background: brandTokens.signal, display: "block", height: 14, width: 14 }} />
          Markdown
        </span>
      </div>
      <pre
        style={{
          fontFamily: "var(--font-mono-stack)",
          fontSize: 30,
          lineHeight: 1.6,
          margin: 0,
          padding: "32px 36px 40px",
          whiteSpace: "pre-wrap",
        }}
      >
        {lines.map((line, index) => (
          <span key={index} style={{ display: "block" }}>
            {line ? <MarkdownLine line={line} /> : " "}
          </span>
        ))}
      </pre>
    </div>
  );
}
