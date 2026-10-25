// Builds the Chrome Web Store upload kit in dist/chrome-web-store/:
//   - webtomarkdown-chrome-<version>.zip  (run ./release.sh first)
//   - screenshot-0N.jpg                   1280x800, no alpha (store requirement)
//   - store-icon-128.png                  96px artwork + 16px transparent padding
//   - small-promo-440x280.jpg, marquee-promo-1400x560.jpg
// Usage: node scripts/build-chrome-store-assets.mjs
// Requires Playwright with Chromium (see scripts/render-brand-icons.mjs) and `zip`.
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT_DIR, "dist/chrome-web-store");
const SCREENSHOT_DIR = path.join(ROOT_DIR, "docs/store-screenshots/browser-store-1280x800");
// Fonts are inlined because pages built with setContent cannot load file:// URLs.
async function fontDataUrl(file) {
  const data = await fs.readFile(path.join(ROOT_DIR, "shared/fonts", file));
  return `data:font/woff2;base64,${data.toString("base64")}`;
}
const ARCHIVO_URL = await fontDataUrl("archivo-latin-variable.woff2");
const PLEX_MONO_URL = await fontDataUrl("ibm-plex-mono-latin-500.woff2");
const MARK_SVG = await fs.readFile(path.join(ROOT_DIR, "docs/brand/logo-mark.svg"), "utf8");
const TILE_SVG = await fs.readFile(path.join(ROOT_DIR, "docs/brand/logo-tile.svg"), "utf8");

function promoHtml({ width, height, markSize, headlineSize, showBody }) {
  const pad = Math.round(height * 0.12);
  return `<!doctype html><html><head><style>
    @font-face { font-family: Archivo; font-weight: 100 900; font-stretch: 62% 125%;
      src: url("${ARCHIVO_URL}") format("woff2"); }
    @font-face { font-family: "IBM Plex Mono"; font-weight: 500;
      src: url("${PLEX_MONO_URL}") format("woff2"); }
    * { box-sizing: border-box; margin: 0; }
    body { width: ${width}px; height: ${height}px; background: #151412; color: #F2EEE5;
      font-family: Archivo, sans-serif; display: flex; align-items: center; gap: ${pad}px;
      padding: 0 ${pad}px; overflow: hidden; }
    .mark svg { width: ${markSize}px; height: ${markSize}px; display: block; }
    .mark svg g { fill: #F2EEE5; }
    h1 { font-size: ${headlineSize}px; font-weight: 800; font-stretch: 112%;
      letter-spacing: -0.035em; line-height: 0.95; white-space: nowrap; }
    p { margin-top: ${Math.round(headlineSize * 0.35)}px; color: #A39E93;
      font-family: "IBM Plex Mono", monospace; font-weight: 500;
      font-size: ${Math.round(headlineSize * 0.26)}px; letter-spacing: 0.08em; text-transform: uppercase; }
  </style></head><body>
    <div class="mark">${MARK_SVG.replace(/fill="#151412"/g, "")}</div>
    <div><h1>Web page in.<br>Markdown out.</h1>${showBody ? "<p>WebToMarkdown · Browser extension</p>" : ""}</div>
  </body></html>`;
}

async function screenshotHtml(page, html, width, height, type) {
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  return page.screenshot(type === "png" ? { type, omitBackground: true } : { type, quality: 92 });
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(ROOT_DIR, "manifest.json"), "utf8"));
  const chromeDir = path.join(ROOT_DIR, "dist/chrome");
  await fs.access(path.join(chromeDir, "manifest.json")).catch(() => {
    throw new Error("dist/chrome is missing. Run ./release.sh first.");
  });

  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const zipName = `webtomarkdown-chrome-${manifest.version}.zip`;
  execFileSync("zip", ["-qr", "-X", path.join(OUT_DIR, zipName), "."], { cwd: chromeDir });
  console.log(zipName);

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  const screenshots = (await fs.readdir(SCREENSHOT_DIR)).filter((name) => name.endsWith(".png")).sort();
  for (const [index, name] of screenshots.entries()) {
    const dataUrl = `data:image/png;base64,${(await fs.readFile(path.join(SCREENSHOT_DIR, name))).toString("base64")}`;
    const html = `<body style="margin:0;background:#F2EEE5"><img src="${dataUrl}" style="display:block;width:1280px;height:800px"></body>`;
    const target = `screenshot-${String(index + 1).padStart(2, "0")}.jpg`;
    await fs.writeFile(path.join(OUT_DIR, target), await screenshotHtml(page, html, 1280, 800, "jpeg"));
    console.log(`${target}  <- ${name}`);
  }

  const iconHtml = `<body style="margin:0;background:transparent;padding:16px">${TILE_SVG.replace(
    /<svg /,
    '<svg style="display:block;width:96px;height:96px" ',
  )}</body>`;
  await fs.writeFile(path.join(OUT_DIR, "store-icon-128.png"), await screenshotHtml(page, iconHtml, 128, 128, "png"));
  console.log("store-icon-128.png");

  const promos = [
    { name: "small-promo-440x280.jpg", width: 440, height: 280, markSize: 96, headlineSize: 30, showBody: false },
    { name: "marquee-promo-1400x560.jpg", width: 1400, height: 560, markSize: 300, headlineSize: 112, showBody: true },
  ];
  for (const promo of promos) {
    await fs.writeFile(
      path.join(OUT_DIR, promo.name),
      await screenshotHtml(page, promoHtml(promo), promo.width, promo.height, "jpeg"),
    );
    console.log(promo.name);
  }

  await browser.close();
}

await main();
