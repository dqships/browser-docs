import { LandingSection } from "@/app/landing/landing-section";
import type { MarkdownToken } from "@/app/landing/sample-markdown";

const KEPT: { name: string; markdown: MarkdownToken[] }[] = [
  {
    name: "Headings",
    markdown: [{ text: "## ", tone: "syntax" }, { text: "Requirements" }],
  },
  {
    name: "Paragraphs & emphasis",
    markdown: [
      { text: "Run it " },
      { text: "**", tone: "syntax" },
      { text: "once" },
      { text: "**", tone: "syntax" },
    ],
  },
  {
    name: "Lists",
    markdown: [{ text: "- ", tone: "syntax" }, { text: "Node.js 20" }],
  },
  {
    name: "Code blocks, with language",
    markdown: [{ text: "```", tone: "syntax" }, { text: "bash" }],
  },
  {
    name: "Tables",
    markdown: [
      { text: "| ", tone: "syntax" },
      { text: "Flag " },
      { text: "| ", tone: "syntax" },
      { text: "Use " },
      { text: "|", tone: "syntax" },
    ],
  },
  {
    name: "Links",
    markdown: [
      { text: "[", tone: "syntax" },
      { text: "Guide" },
      { text: "](", tone: "syntax" },
      { text: "https://…" },
      { text: ")", tone: "syntax" },
    ],
  },
];

const DROPPED = [
  "Navigation bars",
  "Sidebars & tables of contents",
  "Cookie prompts",
  "“Was this helpful?” widgets",
  "Footers",
  "Toolbars & share buttons",
];

export function KeepDropSection() {
  return (
    <LandingSection id="keeps" index="01" label="What it keeps">
      <h2 className="display max-w-3xl text-4xl md:text-6xl">
        The content stays. The chrome goes.
      </h2>
      <p className="mt-6 max-w-2xl text-lg text-ink-soft">
        {`It finds the page's main content area and converts its structure,
        not just its text. Everything around it is left on the page.`}
      </p>

      <div className="mt-14 grid gap-12 md:grid-cols-9 md:gap-6">
        <div className="md:col-span-5">
          <p className="mono-label flex items-center justify-between border-b border-ink pb-2">
            <span>Kept</span>
            <span className="text-ink-muted">Becomes</span>
          </p>
          <ul>
            {KEPT.map((item) => (
              <li
                key={item.name}
                className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-rule py-3"
              >
                <span className="font-medium">{item.name}</span>
                <code className="whitespace-pre font-mono text-[0.8125rem] text-ink">
                  {item.markdown.map((token, index) => (
                    <span
                      key={index}
                      className={token.tone === "syntax" ? "md-syntax" : undefined}
                    >
                      {token.text}
                    </span>
                  ))}
                </code>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="mono-label border-b border-ink pb-2">Dropped</p>
          <ul>
            {DROPPED.map((item) => (
              <li
                key={item}
                className="border-b border-rule py-3 text-ink-muted line-through decoration-1"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </LandingSection>
  );
}
