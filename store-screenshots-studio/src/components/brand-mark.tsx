import { brandTokens } from "@/data/design-tokens";

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

/** The WebToMarkdown mark. Geometry mirrors /docs/brand/logo-mark.svg. */
export function BrandMark({
  size,
  onInk = false,
}: {
  size: number;
  onInk?: boolean;
}) {
  const clipId = `brand-mark-clip-${onInk ? "ink" : "paper"}`;

  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 120 120" width={size}>
      <defs>
        <clipPath id={clipId}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} fill={onInk ? brandTokens.onInk : brandTokens.ink}>
        {OUTER_CELLS.map(([x, y, width, height]) => (
          <rect height={height} key={`${x}-${y}`} width={width} x={x} y={y} />
        ))}
      </g>
      <rect fill={brandTokens.signal} height="38" width="38" x="41" y="41" />
    </svg>
  );
}
