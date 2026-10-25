import { useId } from "react";

const OUTER_CELLS = [
  [0, 0, 31, 31],
  [41, 0, 38, 31],
  [89, 0, 31, 31],
  [0, 41, 31, 38],
  [89, 41, 31, 38],
  [0, 89, 31, 31],
  [41, 89, 38, 31],
  [89, 89, 31, 31],
] as const;

/**
 * The WebToMarkdown mark: a circle (the web) cut by a `#` (Markdown), with
 * the center cell (the readable part) in signal red. See /DESIGN.md §2.
 */
export function BrandMark({
  size = 24,
  tone = "ink",
  className,
}: {
  size?: number;
  tone?: "ink" | "paper";
  className?: string;
}) {
  const clipId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <g
        clipPath={`url(#${clipId})`}
        fill={tone === "ink" ? "var(--ink)" : "var(--on-ink)"}
      >
        {OUTER_CELLS.map(([x, y, width, height]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} />
        ))}
      </g>
      <rect x="41" y="41" width="38" height="38" fill="var(--signal)" />
    </svg>
  );
}
