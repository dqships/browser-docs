import { MarkdownOutputPanel } from "@/app/landing/markdown-output-panel";
import { PageSchematic } from "@/app/landing/page-schematic";

/** Hero figure: the page chrome recedes and the main content becomes Markdown. */
export function PageToMarkdownDiagram() {
  return (
    <figure>
      <div className="relative grid gap-3 md:grid-cols-2 md:gap-0">
        <PageSchematic />
        <span
          className="absolute left-1/2 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-signal font-mono text-lg text-ink md:flex"
          aria-hidden="true"
        >
          →
        </span>
        <MarkdownOutputPanel />
      </div>
      <figcaption className="mt-3 font-mono text-xs text-ink-muted">
        Fig. 0 — Header, nav, aside, footer and cookie prompt are left behind.
        The main content area goes to your clipboard as Markdown.
      </figcaption>
    </figure>
  );
}
