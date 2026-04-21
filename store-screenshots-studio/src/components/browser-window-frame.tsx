import { brandTokens } from "@/data/design-tokens";

type BrowserWindowFrameProps = {
  imageSrc: string;
  imageAlt: string;
  className?: string;
  browserName?: string;
  urlLabel?: string;
  objectPosition?: string;
  children?: React.ReactNode;
  tone?: "dark" | "light";
};

export function BrowserWindowFrame({
  imageSrc,
  imageAlt,
  className = "",
  browserName = "Docs page",
  urlLabel = "docs.vendor.dev/getting-started",
  objectPosition = "top center",
  children,
  tone = "dark",
}: BrowserWindowFrameProps) {
  const surface =
    tone === "dark"
      ? "linear-gradient(180deg, rgba(17, 24, 39, 0.96) 0%, rgba(12, 18, 31, 0.98) 100%)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 247, 251, 0.96) 100%)";
  const textColor =
    tone === "dark" ? brandTokens.textSecondary : brandTokens.lightMuted;
  const addressFill =
    tone === "dark" ? "rgba(255,255,255,0.04)" : "rgba(15, 23, 42, 0.06)";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: surface,
        border: `1px solid ${tone === "dark" ? brandTokens.borderStrong : "rgba(15, 23, 42, 0.08)"}`,
        borderRadius: 40,
        boxShadow: brandTokens.shadow,
      }}
    >
      <div
        style={{
          alignItems: "center",
          borderBottom: `1px solid ${tone === "dark" ? "rgba(130, 153, 183, 0.18)" : "rgba(15, 23, 42, 0.08)"}`,
          display: "grid",
          gap: 26,
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
            alignItems: "center",
            background: addressFill,
            borderRadius: 999,
            color: textColor,
            display: "flex",
            fontFamily: "var(--font-mono-stack)",
            fontSize: 22,
            gap: 14,
            letterSpacing: "0.08em",
            padding: "18px 24px",
            textTransform: "uppercase",
          }}
        >
          <span>{browserName}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {urlLabel}
          </span>
        </div>
        <div
          style={{
            background: addressFill,
            borderRadius: 999,
            color: textColor,
            fontFamily: "var(--font-mono-stack)",
            fontSize: 20,
            padding: "18px 22px",
            textTransform: "uppercase",
          }}
        >
          live page
        </div>
      </div>
      <div className="relative">
        <img
          alt={imageAlt}
          draggable={false}
          src={imageSrc}
          style={{
            display: "block",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            width: "100%",
          }}
        />
        {children}
      </div>
    </div>
  );
}
