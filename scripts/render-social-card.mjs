// Renders the default Open Graph / Twitter card to web/public/og/default.png (1200x630).
// Usage: node scripts/render-social-card.mjs
// Requires Playwright with Chromium (see scripts/render-brand-icons.mjs for setup).
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = path.join(ROOT_DIR, "web/public/og/default.png");
const WIDTH = 1200;
const HEIGHT = 630;

// Fonts are inlined because pages built with setContent cannot load file:// URLs.
async function fontDataUrl(file) {
  const data = await fs.readFile(path.join(ROOT_DIR, "shared/fonts", file));
  return `data:font/woff2;base64,${data.toString("base64")}`;
}

function cardHtml({ archivoUrl, plexMonoUrl, markSvg }) {
  return `<!doctype html><html><head><style>
    @font-face { font-family: Archivo; font-weight: 100 900; font-stretch: 62% 125%;
      src: url("${archivoUrl}") format("woff2"); }
    @font-face { font-family: "IBM Plex Mono"; font-weight: 500;
      src: url("${plexMonoUrl}") format("woff2"); }
    * { box-sizing: border-box; margin: 0; }
    body { width: ${WIDTH}px; height: ${HEIGHT}px; background: #F2EEE5; color: #151412;
      font-family: Archivo, sans-serif; padding: 0 64px; position: relative; overflow: hidden; }
    .mono { font-family: "IBM Plex Mono", monospace; font-weight: 500; font-size: 20px;
      letter-spacing: 0.08em; text-transform: uppercase; }
    header { height: 104px; border-bottom: 2px solid #151412; display: flex;
      align-items: center; justify-content: space-between; }
    .lockup { display: flex; align-items: center; gap: 14px; font-size: 30px;
      font-weight: 700; letter-spacing: -0.01em; }
    .lockup svg { width: 40px; height: 40px; display: block; }
    header .mono { color: #6C675E; }
    h1 { margin-top: 64px; font-size: 112px; font-weight: 800; font-stretch: 112%;
      letter-spacing: -0.04em; line-height: 0.92; }
    .dot { display: inline-block; width: 19px; height: 19px; background: #E2401C; margin-left: 6px; }
    footer { position: absolute; left: 64px; right: 64px; bottom: 52px; display: flex;
      align-items: center; gap: 14px; color: #151412; }
    footer .cell { width: 14px; height: 14px; background: #E2401C; }
  </style></head><body>
    <header>
      <span class="lockup">${markSvg}WebToMarkdown</span>
      <span class="mono">Chrome extension</span>
    </header>
    <h1>Web page in.<br>Markdown out<span class="dot"></span></h1>
    <footer class="mono"><span class="cell"></span>Copy the readable part of any page as clean Markdown</footer>
  </body></html>`;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });

  await page.setContent(
    cardHtml({
      archivoUrl: await fontDataUrl("archivo-latin-variable.woff2"),
      plexMonoUrl: await fontDataUrl("ibm-plex-mono-latin-500.woff2"),
      markSvg: await fs.readFile(path.join(ROOT_DIR, "docs/brand/logo-mark.svg"), "utf8"),
    }),
    { waitUntil: "load" },
  );
  await page.evaluate(() => document.fonts.ready);

  await fs.mkdir(path.dirname(TARGET), { recursive: true });
  await fs.writeFile(TARGET, await page.screenshot({ type: "png" }));
  await browser.close();
  console.log(path.relative(ROOT_DIR, TARGET));
}

await main();
