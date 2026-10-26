import { site } from "@/lib/site";

/** The home page as Markdown, served to agents that ask for text/markdown and at /index.md. */
export function createHomeMarkdown() {
  const chrome = site.downloadTargets.chrome;

  return `# ${site.name}

> ${site.defaultDescription}

${site.name} is a browser extension. It copies the readable part of the page you are on, such as docs, articles, and release notes, and leaves the navigation, sidebars, and cookie prompts behind. The Markdown goes straight to your clipboard. There is no account, and pages are converted inside your browser.

## What it keeps

- Headings, paragraphs, and emphasis
- Lists
- Code blocks, with their language
- Tables, as Markdown pipe tables
- Links

It drops navigation bars, sidebars and tables of contents, cookie prompts, feedback widgets, footers, toolbars, and share buttons.

## How to copy

1. Toolbar popup: click the icon and press Copy Current Page. You get a word count and a preview.
2. Page menu: right-click the page and choose Copy page as Markdown.
3. Keyboard shortcut: Option+Shift+M (Alt+Shift+M on Windows). Rebind it in your browser's extension shortcut settings.

## Settings

All five are on by default and stored in your browser: aggressive pruning, YAML frontmatter (title, source URL, capture time), a title heading, a source link line, and table conversion.

## Install

- ${chrome.browserLabel}: [${chrome.ctaLabel}](${chrome.url})

## More

- [About](${site.url}/about): who makes ${site.name}
- [Support](${site.url}/support): ${site.supportEmail}
- [Privacy](${site.url}/privacy)
- [Terms](${site.url}/terms)
- [Blog](${site.url}/blog)

---
HTML version: ${site.url}/. Index for agents: ${site.url}/llms.txt
`;
}
