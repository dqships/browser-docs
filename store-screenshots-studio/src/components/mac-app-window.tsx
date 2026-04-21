import { brandTokens } from "@/data/design-tokens";

type MacAppWindowProps = {
  className?: string;
  title: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
};

export function MacAppWindow({
  className = "",
  title,
  children,
  tone = "light",
}: MacAppWindowProps) {
  const fill =
    tone === "light"
      ? "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(243,246,252,0.96) 100%)"
      : "linear-gradient(180deg, rgba(17,24,39,0.96) 0%, rgba(12,18,31,0.98) 100%)";
  const textColor =
    tone === "light" ? brandTokens.lightText : brandTokens.textPrimary;
  const subColor =
    tone === "light" ? brandTokens.lightMuted : brandTokens.textSecondary;

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        background: fill,
        border: `1px solid ${tone === "light" ? "rgba(15, 23, 42, 0.08)" : brandTokens.borderStrong}`,
        borderRadius: 42,
        boxShadow: brandTokens.shadow,
      }}
    >
      <div
        style={{
          alignItems: "center",
          borderBottom: `1px solid ${tone === "light" ? "rgba(15, 23, 42, 0.08)" : "rgba(130, 153, 183, 0.18)"}`,
          display: "grid",
          gap: 22,
          gridTemplateColumns: "120px 1fr auto",
          padding: "26px 30px",
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          {["#FF5F57", "#FFBD2F", "#28C840"].map((dot) => (
            <span
              key={dot}
              style={{
                background: dot,
                borderRadius: "50%",
                display: "block",
                height: 18,
                width: 18,
              }}
            />
          ))}
        </div>
        <div
          style={{
            color: textColor,
            fontFamily: "var(--font-heading-stack)",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            textAlign: "center",
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: subColor,
            fontFamily: "var(--font-mono-stack)",
            fontSize: 20,
            letterSpacing: "0.12em",
            textAlign: "right",
            textTransform: "uppercase",
          }}
        >
          macOS
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
