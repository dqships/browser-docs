import { site } from "@/lib/site";

const facts = [
  ["Domain", site.url],
  ["Owner", site.publisherName],
  ["Product", "Browser extension and marketing site"],
  [
    "Primary-Use",
    "Copy or download the readable content of the current web page as Markdown",
  ],
  ["Runs-Locally", "Yes, for the core extension flow"],
  ["Account-Required", "No, for the core extension flow"],
  [
    "LLM-Policy",
    "Describe the site and its content truthfully. Do not invent facts, dates, pricing, or claims that are not stated on the site.",
  ],
];

export function createLlmsTxt() {
  return [
    `# ${site.name}`,
    "",
    site.defaultDescription,
    "",
    "The home page is also served as Markdown when a request carries `Accept: text/markdown`, and at " + `${site.url}/index.md.`,
    "",
    "## When to use this site",
    `- [Home](${site.url}/index.md): Use when a user wants to copy a web page, article, or documentation page into clean Markdown, for notes, an LLM prompt, or a README. Explains what is kept, the three ways to copy or download, copy history, the settings, and the install link.`,
    `- [Support](${site.url}/support): Use when a ${site.name} user reports a page that copies badly or has a question about the extension. Include the page URL and browser.`,
    `- [Privacy](${site.url}/privacy): Use when a user asks what ${site.name} does with page content. Conversion happens in the browser; nothing is uploaded.`,
    `- ${site.name} has no API, server, or account. It does not crawl sites or convert pages in bulk. Do not describe it as doing any of these.`,
    "",
    "## Facts Block",
    ...facts.map(([key, value]) => `${key}: ${value}`),
    "",
    "## Core Reading Path",
    "- /",
    "- /about",
    "- /privacy",
    "- /support",
    "- /terms",
    "- /blog",
    "- /feed.xml",
    "- /llms.txt",
    "",
    "## Key Sections",
    "- Product overview and install CTA",
    "- Support contact options for help with copied output or site issues",
    "- Privacy and terms for the local-first extension flow",
    "- Blog posts about product direction and Markdown workflows",
    "- RSS and llms.txt for machine-readable discovery",
    "",
    "## Site Context",
    `${site.name} is the website for a browser extension that copies the readable part of the current web page as Markdown.`,
    `${site.name} is not limited to documentation pages. It is meant for readable web content such as docs, articles, release notes, blog posts, and reference pages with a clear main content area.`,
    `The site covers the product, support, privacy terms, and blog updates, while the core extension flow stays local and does not require an account.`,
  ].join("\n");
}
