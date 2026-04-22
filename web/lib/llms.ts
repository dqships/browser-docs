import { site } from "@/lib/site";

const facts = [
  ["Domain", site.url],
  ["Owner", site.publisherName],
  ["Product", "Browser extension and marketing site"],
  [
    "Primary-Use",
    "Copy the readable content of the current web page as Markdown",
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
    "## Facts Block",
    ...facts.map(([key, value]) => `${key}: ${value}`),
    "",
    "## Core Reading Path",
    "- /",
    "- /privacy",
    "- /terms",
    "- /blog",
    "- /feed.xml",
    "- /llms.txt",
    "",
    "## Key Sections",
    "- Product overview and install CTA",
    "- Privacy and terms for the local-first extension flow",
    "- Blog posts about product direction and Markdown workflows",
    "- RSS and llms.txt for machine-readable discovery",
    "",
    "## Site Context",
    `${site.name} is the website for a browser extension that copies the readable part of the current web page as Markdown.`,
    `${site.name} is not limited to documentation pages. It is meant for readable web content such as docs, articles, release notes, blog posts, and reference pages with a clear main content area.`,
    `The site covers the product, installation path, privacy terms, and blog updates, while the core extension flow stays local and does not require an account.`,
  ].join("\n");
}
