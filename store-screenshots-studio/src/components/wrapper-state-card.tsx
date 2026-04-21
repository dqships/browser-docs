import { brandTokens } from "@/data/design-tokens";
import { sourceAssets } from "@/data/source-assets";

type WrapperStateCardProps = {
  state: "on" | "off";
};

const stateCopy = {
  on: {
    headline: "WebToMarkdown’s extension is currently on.",
    body: "You can turn it off in the Extensions section of Safari Settings.",
    button: "Quit and Open Safari Settings…",
  },
  off: {
    headline: "You can turn on WebToMarkdown’s extension in Safari Settings.",
    body: "The native wrapper walks people straight into the extension controls Apple expects.",
    button: "Quit and Open Safari Settings…",
  },
} as const;

export function WrapperStateCard({
  state,
}: WrapperStateCardProps) {
  const copy = stateCopy[state];

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 28,
        padding: "78px 80px 88px",
      }}
    >
      <img
        alt="WebToMarkdown icon"
        draggable={false}
        src={sourceAssets.icon}
        style={{
          borderRadius: 34,
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.18)",
          display: "block",
          height: 172,
          width: 172,
        }}
      />
      <div style={{ maxWidth: 820, textAlign: "center" }}>
        <p
          style={{
            color: brandTokens.lightText,
            fontFamily: "var(--font-heading-stack)",
            fontSize: 62,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1.02,
            margin: 0,
          }}
        >
          {copy.headline}
        </p>
        <p
          style={{
            color: brandTokens.lightMuted,
            fontSize: 30,
            lineHeight: 1.4,
            margin: "18px 0 0",
          }}
        >
          {copy.body}
        </p>
      </div>
      <button
        style={{
          background: "linear-gradient(180deg, #F5F7FB 0%, #E8EDF4 100%)",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          borderRadius: 16,
          color: brandTokens.lightText,
          fontSize: 28,
          fontWeight: 600,
          padding: "22px 40px",
        }}
        type="button"
      >
        {copy.button}
      </button>
    </div>
  );
}
