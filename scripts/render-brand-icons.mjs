// Rasterizes the master SVGs in docs/brand/ into every PNG icon the project ships.
// Usage: node scripts/render-brand-icons.mjs
// Requires Playwright with Chromium (e.g. `npm i -g playwright && npx playwright install chromium`,
// then run with NODE_PATH="$(npm root -g)").
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND_DIR = path.join(ROOT_DIR, "docs/brand");
const APP_ICON_SET = "safari/WebToMarkdown/WebToMarkdown/Assets.xcassets/AppIcon.appiconset";
const LARGE_ICON_SET = "safari/WebToMarkdown/WebToMarkdown/Assets.xcassets/LargeIcon.imageset";

const OUTPUTS = [
  // Extension (Chrome, Firefox, Safari web extension)
  { source: "logo-tile.svg", size: 1024, target: "shared/icon.png" },
  { source: "logo-tile.svg", size: 16, target: "shared/icons/icon-16.png" },
  { source: "logo-tile.svg", size: 32, target: "shared/icons/icon-32.png" },
  { source: "logo-tile.svg", size: 48, target: "shared/icons/icon-48.png" },
  { source: "logo-tile.svg", size: 128, target: "shared/icons/icon-128.png" },

  // Website
  { source: "logo-tile.svg", size: 512, target: "web/public/icon.png" },
  { source: "logo-tile.svg", size: 180, target: "web/public/apple-icon.png" },

  // Store screenshots studio
  { source: "logo-tile.svg", size: 512, target: "store-screenshots-studio/public/source/icon/app-icon.png" },

  // Safari container app
  { source: "logo-tile.svg", size: 1024, target: "safari/WebToMarkdown/WebToMarkdown/Resources/Icon.png" },
  { source: "logo-app-icon.svg", size: 16, target: `${APP_ICON_SET}/mac-icon-16@1x.png` },
  { source: "logo-app-icon.svg", size: 32, target: `${APP_ICON_SET}/mac-icon-16@2x.png` },
  { source: "logo-app-icon.svg", size: 32, target: `${APP_ICON_SET}/mac-icon-32@1x.png` },
  { source: "logo-app-icon.svg", size: 64, target: `${APP_ICON_SET}/mac-icon-32@2x.png` },
  { source: "logo-app-icon.svg", size: 128, target: `${APP_ICON_SET}/mac-icon-128@1x.png` },
  { source: "logo-app-icon.svg", size: 256, target: `${APP_ICON_SET}/mac-icon-128@2x.png` },
  { source: "logo-app-icon.svg", size: 256, target: `${APP_ICON_SET}/mac-icon-256@1x.png` },
  { source: "logo-app-icon.svg", size: 512, target: `${APP_ICON_SET}/mac-icon-256@2x.png` },
  { source: "logo-app-icon.svg", size: 512, target: `${APP_ICON_SET}/mac-icon-512@1x.png` },
  { source: "logo-app-icon.svg", size: 1024, target: `${APP_ICON_SET}/mac-icon-512@2x.png` },
  { source: "logo-tile.svg", size: 128, target: `${LARGE_ICON_SET}/icon-large-128.png` },
  { source: "logo-tile.svg", size: 256, target: `${LARGE_ICON_SET}/icon-large-128@2x.png` },
  { source: "logo-tile.svg", size: 384, target: `${LARGE_ICON_SET}/icon-large-128@3x.png` },
];

// SVGs shipped as-is.
const COPIES = [
  { source: "logo-tile.svg", target: "web/public/icon.svg" },
  { source: "logo-mark.svg", target: "shared/icons/logo-mark.svg" },
];

async function renderSvg(page, svgMarkup, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">` +
      svgMarkup.replace(/<svg /, `<svg style="display:block;width:${size}px;height:${size}px" `) +
      `</body></html>`,
  );
  return page.screenshot({ omitBackground: true, type: "png" });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const sources = new Map();

  for (const output of OUTPUTS) {
    if (!sources.has(output.source)) {
      sources.set(output.source, await fs.readFile(path.join(BRAND_DIR, output.source), "utf8"));
    }

    const png = await renderSvg(page, sources.get(output.source), output.size);
    const targetPath = path.join(ROOT_DIR, output.target);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, png);
    console.log(`${output.size}px  ${output.target}`);
  }

  await browser.close();

  for (const copy of COPIES) {
    await fs.copyFile(path.join(BRAND_DIR, copy.source), path.join(ROOT_DIR, copy.target));
    console.log(`svg    ${copy.target}`);
  }
}

await main();
