import { site } from "@/lib/site";

/** The home page as Markdown, served to agents that ask for text/markdown and at /index.md. */
export function createHomeMarkdown() {
  const chrome = site.downloadTargets.chrome;

  return `# ${site.name}

> ${site.defaultDescription}

${site.name} is a browser extension. It copies the readable part of the page you are on, such as docs, articles, and release notes, and leaves the navigation, sidebars, and cookie prompts behind. The Markdown goes straight to your clipboard, or into a .md file. There is no account, and pages are converted inside your browser.

## What it keeps

- Headings, paragraphs, and emphasis
- Lists
- Code blocks, with their language
- Tables, as Markdown pipe tables
- Links

It drops navigation bars, sidebars and tables of contents, cookie prompts, feedback widgets, footers, toolbars, and share buttons.

## How to copy or download

1. Toolbar popup: click the icon and press Copy Current Page or Download .md. You get a word count and a preview.
2. Page menu: right-click the page and choose Copy page as Markdown or Download page as Markdown.
3. Keyboard shortcut: Option+Shift+M (Alt+Shift+M on Windows) copies. Rebind it, or add a key for downloads, in your browser's extension shortcut settings.

Downloaded files are named after the page title, for example getting-started.md.

## History

Every page you copy is listed under History in the popup, newest first, up to 100. From there you can copy it again, download it as a .md file, open the source page, or delete it. History stays on your device and can be turned off in Settings.

## Settings

All six are on by default and stored in your browser: aggressive pruning, YAML frontmatter (title, source URL, capture time), a title heading, a source link line, table conversion, and copy history. Settings open inside the popup.

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
