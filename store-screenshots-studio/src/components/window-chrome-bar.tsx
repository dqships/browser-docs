import { brandTokens } from "@/data/design-tokens";

type WindowChromeBarProps = {
  left: React.ReactNode;
  right: string;
};

/** Square window title bar shared by the browser and Mac app frames. */
export function WindowChromeBar({ left, right }: WindowChromeBarProps) {
  return (
    <div
      style={{
        alignItems: "center",
        borderBottom: `3px solid ${brandTokens.ink}`,
        color: brandTokens.ink,
        display: "grid",
        gap: 26,
        gridTemplateColumns: "auto 1fr auto",
        padding: "24px 30px",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{
              border: `3px solid ${brandTokens.ink}`,
              display: "block",
              height: 20,
              width: 20,
            }}
          />
        ))}
      </div>
      <div style={{ minWidth: 0 }}>{left}</div>
      <div
        style={{
          color: brandTokens.inkMuted,
          fontFamily: "var(--font-mono-stack)",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {right}
      </div>
    </div>
  );
}
