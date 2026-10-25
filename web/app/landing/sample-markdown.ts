/**
 * The Markdown shown in the hero diagram. It mirrors what the extension
 * produces with default settings (see content/markdown/finalize-markdown.js):
 * frontmatter, title heading, source line, then the cleaned body.
 */
export type MarkdownToken = { text: string; tone?: "syntax" | "dim" };

export const SAMPLE_SOURCE_URL = "https://example.com/docs/install";

export const SAMPLE_MARKDOWN_LINES: MarkdownToken[][] = [
  [{ text: "---", tone: "syntax" }],
  [{ text: "capturedAt: ", tone: "dim" }, { text: '"2026-10-25T09:14:02.118Z"' }],
  [{ text: "source: ", tone: "dim" }, { text: `"${SAMPLE_SOURCE_URL}"` }],
  [{ text: "title: ", tone: "dim" }, { text: '"Install the CLI | Example Docs"' }],
  [{ text: "documentTitle: ", tone: "dim" }, { text: '"Install the CLI"' }],
  [{ text: "---", tone: "syntax" }],
  [],
  [{ text: "# ", tone: "syntax" }, { text: "Install the CLI" }],
  [],
  [{ text: "Source: " }, { text: "<", tone: "syntax" }, { text: SAMPLE_SOURCE_URL }, { text: ">", tone: "syntax" }],
  [],
  [{ text: "Run the installer, then sign in." }],
  [],
  [{ text: "## ", tone: "syntax" }, { text: "Requirements" }],
  [],
  [{ text: "- ", tone: "syntax" }, { text: "Node.js 20 or later" }],
  [{ text: "- ", tone: "syntax" }, { text: "A terminal" }],
  [],
  [{ text: "```", tone: "syntax" }, { text: "bash", tone: "dim" }],
  [{ text: "npm install -g example-cli" }],
  [{ text: "```", tone: "syntax" }],
];
