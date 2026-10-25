export const CANVAS_WIDTH = 2880;
export const CANVAS_HEIGHT = 1800;

/** Mirrors /DESIGN.md §3. */
export const brandTokens = {
  paper: "#F2EEE5",
  paperDeep: "#E7E2D6",
  ink: "#151412",
  inkSoft: "#45413B",
  inkMuted: "#6C675E",
  rule: "#CFC8BA",
  signal: "#E2401C",
  signalText: "#B5300F",
  onInk: "#F2EEE5",
  onInkMuted: "#A39E93",
} as const;

/** Slide background, which decides how frames and type are inked on top of it. */
export type SlideTone = "paper" | "deep" | "ink";

export function isInkTone(tone: SlideTone) {
  return tone === "ink";
}
