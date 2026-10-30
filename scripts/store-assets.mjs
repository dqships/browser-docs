// Makes the store images in store/ from the real extension: five 1280×800
// screenshots, the 440×280 and 1400×560 promo tiles, and the 128×128 icon.
// Usage: node scripts/store-assets.mjs [--reuse-captures] [outDir]
// --reuse-captures skips scripts/capture-extension-screenshots.mjs, for copy changes.
// Requires Playwright with Chromium (see scripts/render-brand-icons.mjs for setup).
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CAPTURE_SCRIPT = path.join(ROOT_DIR, "scripts/capture-extension-screenshots.mjs");
const CAPTURES = "../store-screenshots-studio/public/source";
const STORE_ORIGIN = "https://store-assets.web-markdown.example/";
const CONTENT_TYPES = {
  ".css": "text/css",
  ".html": "text/html",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

const POPUP_SUCCESS = `${CAPTURES}/popup/popup-success.png`;
const POPUP_HISTORY = `${CAPTURES}/popup/popup-history.png`;
const PAGE_WITH_TOAST = `${CAPTURES}/browser/context-menu-toast.png`;
const SETTINGS_PAGE = `${CAPTURES}/options/options-updated.png`;
const CAPTURE_URL = "docs.example.com/guides/fixture-api";

// An excerpt of what the extension copies from the capture fixture page.
const MARKDOWN_EXCERPT = `# Using the Fixture API

## Install

Start by running \`npm install fixture-sdk\`
in your project.

## Configure

- Add a token
  - Use a development token for local work.
- Enable logging

\`\`\`js
import { createFixtureClient } from "fixture-sdk";
\`\`\``;

// One entry per screenshot, in listing order.
const SHOTS = [
  {
    tone: "ink",
    head: "Browser extension",
    label: "Copy or download",
    title: "Copy it or\ndownload it.",
    lede: "One click turns the readable part of any page into clean Markdown. Copy it to your clipboard or save it as a .md file.",
    frame: "browser",
    url: CAPTURE_URL,
    img: PAGE_WITH_TOAST,
    x: 587,
    w: 624,
    over: POPUP_SUCCESS,
    ox: 962,
    oy: 249,
    ow: 267,
  },
  {
    tone: "paper",
    head: "Keeps structure",
    label: "What it keeps",
    title: "Content in.\nChrome out.",
    lede: "Headings, nested lists, code blocks, and tables stay intact. Navigation, sidebars, and cookie prompts stay behind.",
    frame: "browser",
    url: CAPTURE_URL,
    img: PAGE_WITH_TOAST,
    x: 604,
    w: 604,
    over: "markdown",
    md: MARKDOWN_EXCERPT,
    ox: 755,
    oy: 338,
    ow: 453,
  },
  {
    tone: "deep",
    head: "Fast access",
    label: "Page menu",
    title: "Right-click.\nCopy or save.",
    lede: "Right-click any page and pick “Copy page as Markdown” or “Download page as Markdown”. A small toast confirms it. ⌥⇧M copies too.",
    frame: "browser",
    url: CAPTURE_URL,
    img: PAGE_WITH_TOAST,
    x: 593,
    w: 617,
  },
  {
    tone: "ink",
    head: "Copy history",
    label: "Copy history",
    title: "Every copy,\nkept on your device.",
    lede: "Copy a page again, download it as .md, or go back to the site. History stays in your browser. No account, no upload, no server.",
    frame: "bare",
    img: POPUP_HISTORY,
    x: 873,
    w: 338,
  },
  {
    tone: "paper",
    head: "Copy options",
    label: "Settings",
    title: "Choose what\ngets copied.",
    lede: "Frontmatter, title heading, source link, tables, pruning, and copy history. Six switches, all on by default, saved as you change them.",
    frame: "window",
    name: "WebToMarkdown Settings",
    img: SETTINGS_PAGE,
    x: 560,
    w: 651,
  },
];

function parseArguments(args) {
  const reuseCaptures = args.includes("--reuse-captures");
  const outDir = args.find((arg) => !arg.startsWith("--"));
  return { reuseCaptures, outDir: path.resolve(outDir ?? path.join(ROOT_DIR, "store")) };
}

// The template and everything it links are served from the repo, so relative
// links work without a web server.
async function serveRepo(context) {
  await context.route(`${STORE_ORIGIN}**`, async (route) => {
    const relativePath = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
    const filePath = path.join(ROOT_DIR, relativePath);
    await route.fulfill({
      body: await fs.readFile(filePath),
      contentType: CONTENT_TYPES[path.extname(filePath)] ?? "application/octet-stream",
    });
  });
}

async function renderImage(context, outDir, name, query, width, height) {
  const page = await context.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(`${STORE_ORIGIN}store/template.html?${new URLSearchParams(query)}`);
  await page.waitForSelector("body[data-ready]");
  // Store images are exactly the listed size, so render at 1×.
  const image = await page.screenshot({ omitBackground: query.kind === "icon", scale: "css", type: "png" });
  await page.close();
  await fs.writeFile(path.join(outDir, name), image);
  console.log(`store image: ${name}`);
}

async function main() {
  const { reuseCaptures, outDir } = parseArguments(process.argv.slice(2));
  await fs.mkdir(outDir, { recursive: true });

  if (!reuseCaptures) {
    execFileSync(process.execPath, [CAPTURE_SCRIPT], { stdio: "inherit" });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 1 });

  try {
    await serveRepo(context);

    for (const [index, shot] of SHOTS.entries()) {
      const number = index + 1;
      await renderImage(context, outDir, `screenshot-${number}.png`, { kind: "shot", n: number, ...shot }, 1280, 800);
    }
    await renderImage(context, outDir, "promo-small.png", { kind: "tile" }, 440, 280);
    await renderImage(context, outDir, "promo-marquee.png", { kind: "marquee" }, 1400, 560);
    await renderImage(context, outDir, "store-icon-128.png", { kind: "icon" }, 128, 128);
  } finally {
    await browser.close();
  }

  console.log(`store images in ${outDir}`);
}

await main();
