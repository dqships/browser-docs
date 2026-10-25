import { frameStyle } from "@/components/frame-style";
import { WindowChromeBar } from "@/components/window-chrome-bar";
import { brandTokens, type SlideTone } from "@/data/design-tokens";

type BrowserWindowFrameProps = {
  imageSrc: string;
  imageAlt: string;
  className?: string;
  browserName?: string;
  urlLabel?: string;
  objectPosition?: string;
  children?: React.ReactNode;
  tone?: SlideTone;
};

export function BrowserWindowFrame({
  imageSrc,
  imageAlt,
  className = "",
  browserName = "Browser",
  urlLabel = "docs.example.com/guides/fixture-api",
  objectPosition = "top center",
  children,
  tone = "paper",
}: BrowserWindowFrameProps) {
  return (
    <div className={`relative ${className}`} style={frameStyle(tone)}>
      <WindowChromeBar
        left={
          <div
            style={{
              background: brandTokens.paperDeep,
              border: `2px solid ${brandTokens.ink}`,
              color: brandTokens.inkSoft,
              fontFamily: "var(--font-mono-stack)",
              fontSize: 24,
              overflow: "hidden",
              padding: "14px 22px",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {urlLabel}
          </div>
        }
        right={browserName}
      />
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
