export function Keycap({ children, label }: { children: string; label?: string }) {
  return (
    <kbd className="keycap" title={label} aria-label={label}>
      {children}
    </kbd>
  );
}
