// Captures the extension's real UI (popup, settings page, in-page toast) for the
// website and the store-screenshots studio.
// Usage: node scripts/capture-extension-screenshots.mjs
// Requires Playwright with Chromium (see scripts/render-brand-icons.mjs for setup).
//
// Like docs/testing/reports/report-2, this loads a temporary copy of the
// extension with host access to the local fixture server and a hook on the
// context-menu handler, because automation cannot click native browser UI.
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE_PORT = 8123;
// Chromium resolves this host to the local fixture server, so the captured
// Markdown shows a realistic source URL instead of 127.0.0.1.
const FIXTURE_HOST = "docs.example.com";
const FIXTURE_ORIGIN = `http://${FIXTURE_HOST}`;
const FIXTURE_PATH = "/guides/fixture-api";
const FIXTURE_FILE = "docs/testing/reports/report-1/fixtures/rich-docs.html";
const EXTENSION_DIRECTORIES = ["background", "content", "options", "popup", "shared"];

const TARGETS = {
  popupSuccess: [
    "web/public/source/popup/popup-success.png",
    "store-screenshots-studio/public/source/popup/popup-success.png",
  ],
  popupBlocked: ["store-screenshots-studio/public/source/popup/popup-blocked.png"],
  contextMenuToast: [
    "web/public/source/browser/context-menu-toast.png",
    "store-screenshots-studio/public/source/browser/context-menu-toast.png",
  ],
  optionsUpdated: ["store-screenshots-studio/public/source/options/options-updated.png"],
};

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".css": "text/css",
  ".js": "text/javascript",
};

function startFixtureServer() {
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, FIXTURE_ORIGIN).pathname);
    const filePath = path.join(ROOT_DIR, pathname === FIXTURE_PATH ? FIXTURE_FILE : pathname);

    if (!filePath.startsWith(ROOT_DIR) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, { "Content-Type": CONTENT_TYPES[path.extname(filePath)] ?? "application/octet-stream" });
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve) => server.listen(FIXTURE_PORT, "127.0.0.1", () => resolve(server)));
}

function createTestExtensionDir() {
  const extensionDir = fs.mkdtempSync(path.join(os.tmpdir(), "webtomarkdown-capture-"));

  for (const directory of EXTENSION_DIRECTORIES) {
    fs.cpSync(path.join(ROOT_DIR, directory), path.join(extensionDir, directory), { recursive: true });
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "manifest.json"), "utf8"));
  manifest.host_permissions = [`${FIXTURE_ORIGIN}/*`];
  fs.writeFileSync(path.join(extensionDir, "manifest.json"), JSON.stringify(manifest, null, 2));

  const serviceWorkerPath = path.join(extensionDir, "background", "service-worker.js");
  fs.appendFileSync(serviceWorkerPath, "\nself.__CAPTURE_handleContextMenuClick = handleContextMenuClick;\n");

  return extensionDir;
}

function writeScreenshot(buffer, targets) {
  for (const target of targets) {
    const targetPath = path.join(ROOT_DIR, target);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, buffer);
    console.log(`wrote ${target}`);
  }
}

async function openPopupForTab(context, extensionOrigin, tabId) {
  const popupPage = await context.newPage();
  await popupPage.setViewportSize({ width: 420, height: 400 });
  await popupPage.goto(`${extensionOrigin}/popup/popup.html`);
  await popupPage.evaluate((targetTabId) => {
    Object.defineProperty(chrome.tabs, "query", {
      configurable: true,
      value: async () => [{ id: targetTabId, active: true, currentWindow: true }],
    });
  }, tabId);
  return popupPage;
}

async function copyFromPopup(popupPage) {
  await popupPage.getByRole("button", { name: "Copy Current Page" }).click();
  await popupPage.waitForFunction(() => ["success", "error"].includes(document.querySelector("#status")?.dataset.kind));
  await popupPage.evaluate(() => document.activeElement?.blur());
  await popupPage.mouse.move(0, 0);
}

async function main() {
  const server = await startFixtureServer();
  const extensionDir = createTestExtensionDir();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "webtomarkdown-profile-"));

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: "chromium",
    args: [
      `--disable-extensions-except=${extensionDir}`,
      `--load-extension=${extensionDir}`,
      `--host-resolver-rules=MAP ${FIXTURE_HOST} 127.0.0.1:${FIXTURE_PORT}`,
      // The clipboard API needs a secure context; 127.0.0.1 is one, the mapped host is not.
      `--unsafely-treat-insecure-origin-as-secure=${FIXTURE_ORIGIN}`,
    ],
    viewport: { width: 1440, height: 1100 },
  });

  try {
    const serviceWorker =
      context.serviceWorkers()[0] ?? (await context.waitForEvent("serviceworker"));
    const extensionOrigin = `chrome-extension://${new URL(serviceWorker.url()).host}`;
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: FIXTURE_ORIGIN });

    const docsPage = context.pages()[0] ?? (await context.newPage());
    await docsPage.goto(`${FIXTURE_ORIGIN}${FIXTURE_PATH}`);
    await docsPage.bringToFront();
    const tabId = await serviceWorker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab.id;
    });

    // In-page toast after copying from the page menu.
    await serviceWorker.evaluate(async (activeTabId) => {
      await self.__CAPTURE_handleContextMenuClick({ menuItemId: "web-to-markdown-copy-page" }, { id: activeTabId });
    }, tabId);
    await docsPage.waitForSelector("#web-to-markdown-toast");
    await docsPage.waitForTimeout(400);
    writeScreenshot(await docsPage.screenshot({ fullPage: true }), TARGETS.contextMenuToast);

    // Popup after a successful copy.
    const popupPage = await openPopupForTab(context, extensionOrigin, tabId);
    await copyFromPopup(popupPage);
    writeScreenshot(await popupPage.screenshot({ fullPage: true }), TARGETS.popupSuccess);

    // Popup on a page the extension is not allowed to read.
    const blockedPage = await context.newPage();
    await blockedPage.goto("chrome://version/");
    await blockedPage.bringToFront();
    const blockedTabId = await serviceWorker.evaluate(async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab.id;
    });
    const blockedPopup = await openPopupForTab(context, extensionOrigin, blockedTabId);
    await copyFromPopup(blockedPopup);
    writeScreenshot(await blockedPopup.screenshot({ fullPage: true }), TARGETS.popupBlocked);

    // Settings page.
    const optionsPage = await context.newPage();
    await optionsPage.goto(`${extensionOrigin}/options/options.html`);
    await optionsPage.waitForFunction(() => document.querySelector("#aggressivePruning")?.checked);
    await optionsPage.getByRole("button", { name: "Save Settings" }).click();
    await optionsPage.waitForFunction(() => document.querySelector("#status")?.textContent);
    await optionsPage.mouse.move(0, 0);
    writeScreenshot(await optionsPage.screenshot({ fullPage: true }), TARGETS.optionsUpdated);
  } finally {
    await context.close();
    server.close();
    fs.rmSync(extensionDir, { force: true, recursive: true });
    fs.rmSync(userDataDir, { force: true, recursive: true });
  }
}

await main();
