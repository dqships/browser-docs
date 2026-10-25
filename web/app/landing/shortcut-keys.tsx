import { Keycap } from "@/app/landing/keycap";

/** The default copy shortcut from manifest.json (Alt+Shift+M / ⌥⇧M). */
export function ShortcutKeys() {
  return (
    <span className="inline-flex items-center gap-1">
      <Keycap label="Option or Alt">⌥</Keycap>
      <Keycap label="Shift">⇧</Keycap>
      <Keycap>M</Keycap>
    </span>
  );
}
