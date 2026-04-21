import { CANVAS_HEIGHT, CANVAS_WIDTH, brandTokens } from "@/data/design-tokens";

type SlideShellProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "dark" | "light" | "electric";
};

const variantStyles = {
  dark: {
    background:
      "radial-gradient(circle at 15% 20%, rgba(0, 229, 255, 0.16), transparent 24%), radial-gradient(circle at 86% 16%, rgba(59, 130, 246, 0.14), transparent 24%), linear-gradient(135deg, #04070D 0%, #08111B 54%, #05080F 100%)",
    color: brandTokens.textPrimary,
  },
  electric: {
    background:
      "radial-gradient(circle at 18% 14%, rgba(0, 229, 255, 0.24), transparent 28%), radial-gradient(circle at 82% 12%, rgba(8, 47, 73, 0.62), transparent 26%), linear-gradient(135deg, #03060C 0%, #081522 45%, #07131E 100%)",
    color: brandTokens.textPrimary,
  },
  light: {
    background:
      "radial-gradient(circle at 18% 18%, rgba(0, 229, 255, 0.12), transparent 22%), radial-gradient(circle at 80% 10%, rgba(56, 189, 248, 0.14), transparent 18%), linear-gradient(135deg, #F5FAFF 0%, #EDF4FB 52%, #E8F0F7 100%)",
    color: brandTokens.lightText,
  },
} as const;

export function SlideShell({
  children,
  className = "",
  variant = "dark",
}: SlideShellProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        ...variantStyles[variant],
      }}
    >
      {children}
    </div>
  );
}
