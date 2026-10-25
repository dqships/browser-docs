import { SAMPLE_MARKDOWN_LINES } from "@/app/landing/sample-markdown";

const FIRST_LINE_DELAY_MS = 1000;
const LINE_STAGGER_MS = 45;

function toneClassName(tone?: "syntax" | "dim") {
  if (tone === "syntax") return "md-syntax";
  if (tone === "dim") return "md-dim";
  return undefined;
}

/** The clipboard result: Markdown lines that print in one by one. */
export function MarkdownOutputPanel() {
  return (
    <div className="flex h-full flex-col border border-ink bg-paper-deep">
      <div className="flex items-center justify-between border-b border-ink px-3 py-2 md:pl-8">
        <span className="font-mono text-xs text-ink-muted">Clipboard</span>
        <span className="mono-label flex items-center gap-1.5 text-[0.625rem] text-ink">
          <span className="red-cell !h-1.5 !w-1.5" aria-hidden="true" />
          Markdown
        </span>
      </div>
      <pre className="md-sample flex-1 overflow-x-auto p-3 sm:p-4 md:pl-8">
        <code>
          {SAMPLE_MARKDOWN_LINES.map((tokens, lineIndex) => (
            <span
              key={lineIndex}
              className="diagram-line block"
              style={{
                animationDelay: `${FIRST_LINE_DELAY_MS + lineIndex * LINE_STAGGER_MS}ms`,
              }}
            >
              {tokens.length === 0
                ? " "
                : tokens.map((token, tokenIndex) => (
                    <span key={tokenIndex} className={toneClassName(token.tone)}>
                      {token.text}
                    </span>
                  ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
