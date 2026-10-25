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
          display: "block",
          height: 172,
          width: 172,
        }}
      />
      <div style={{ maxWidth: 820, textAlign: "center" }}>
        <p
          style={{
            color: brandTokens.ink,
            fontFamily: "var(--font-heading-stack)",
            fontSize: 62,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
            margin: 0,
          }}
        >
          {copy.headline}
        </p>
        <p
          style={{
            color: brandTokens.inkSoft,
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
          background: brandTokens.paper,
          border: `3px solid ${brandTokens.ink}`,
          borderRadius: 0,
          color: brandTokens.ink,
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
