const assert = require("assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { chromium } = require("/opt/homebrew/lib/node_modules/playwright");

const reportRoot = path.resolve(__dirname, "..");
const screenshotDir = path.join(reportRoot, "screenshots");
const artifactDir = path.join(reportRoot, "artifacts");
const sourceExtensionPath = path.resolve(__dirname, "../../../../..");
const chromeExecutablePath = chromium.executablePath();
const urls = {
  richDocs:
    "http://127.0.0.1:8123/docs/testing/reports/report-1/fixtures/rich-docs.html",
  titlelessDocs:
    "http://127.0.0.1:8123/docs/testing/reports/report-1/fixtures/titleless-docs.html",
  emptyPage:
    "http://127.0.0.1:8123/docs/testing/reports/report-1/fixtures/empty-page.html",
  internalPage: "chrome://version/"
};

const results = [];

function flushResults() {
  fs.writeFileSync(path.join(artifactDir, "results.json"), JSON.stringify(results, null, 2));
}

function pushResult(result) {
  results.push(result);
  flushResults();
}

function createUserDataDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "browser-docs-extension-"));
}

function createTestExtensionDir() {
  const testExtensionDir = fs.mkdtempSync(path.join(os.tmpdir(), "browser-docs-extension-build-"));

  fs.cpSync(sourceExtensionPath, testExtensionDir, {
    force: true,
    recursive: true,
    filter: (source) => !source.includes(`${path.sep}.git`)
  });

  const manifestPath = path.join(testExtensionDir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.host_permissions = Array.from(
    new Set([...(manifest.host_permissions || []), "http://127.0.0.1:8123/*"])
  );
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  const serviceWorkerPath = path.join(testExtensionDir, "background", "service-worker.js");
  const serviceWorkerSource = fs.readFileSync(serviceWorkerPath, "utf8");
  const testHook = "\nself.__TEST_handleContextMenuClick = handleContextMenuClick;\n";

  if (!serviceWorkerSource.includes("__TEST_handleContextMenuClick")) {
    fs.writeFileSync(serviceWorkerPath, `${serviceWorkerSource}${testHook}`);
  }

  return testExtensionDir;
}

async function launchExtensionContext({ extensionDir = sourceExtensionPath } = {}) {
  const userDataDir = createUserDataDir();
  const context = await chromium.launchPersistentContext(userDataDir, {
    executablePath: chromeExecutablePath,
    args: [
      `--disable-extensions-except=${extensionDir}`,
      `--load-extension=${extensionDir}`
    ],
    ignoreDefaultArgs: [
      "--disable-component-extensions-with-background-pages",
      "--disable-extensions"
    ],
    headless: false,
    viewport: {
      width: 1440,
      height: 1100
    }
  });

  const serviceWorker =
    context
      .serviceWorkers()
      .find((worker) => worker.url().endsWith("/background/service-worker.js")) ||
    (await context.waitForEvent("serviceworker", {
      predicate: (worker) => worker.url().endsWith("/background/service-worker.js")
    }));
  const extensionId = new URL(serviceWorker.url()).host;
  const extensionOrigin = `chrome-extension://${extensionId}`;

  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:8123"
  });

  return {
    context,
    extensionId,
    extensionOrigin,
    extensionDir,
    serviceWorker,
    userDataDir
  };
}

async function closeExtensionContext(runtime) {
  await runtime.context.close();
  fs.rmSync(runtime.userDataDir, { force: true, recursive: true });
  if (runtime.extensionDir !== sourceExtensionPath) {
    fs.rmSync(runtime.extensionDir, { force: true, recursive: true });
  }
}

async function getActiveTabId(serviceWorker) {
  return await serviceWorker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab?.id ?? null;
  });
}

async function openPopupPage(runtime, targetTabId) {
  const popupUrl = `${runtime.extensionOrigin}/popup/popup.html`;

  try {
    const popupPromise = runtime.context.waitForEvent("page", {
      timeout: 5000,
      predicate: (page) => page.url().startsWith(popupUrl)
    });

    await runtime.serviceWorker.evaluate(async () => {
      await chrome.action.openPopup();
    });

    const popupPage = await popupPromise;
    await popupPage.setViewportSize({ width: 420, height: 900 });
    return {
      popupPage,
      method: "action"
    };
  } catch {
    const popupPage = await runtime.context.newPage();
    await popupPage.setViewportSize({ width: 420, height: 900 });
    await popupPage.goto(popupUrl);
    await popupPage.evaluate((tabId) => {
      const replacement = async () => [{ id: tabId, active: true, currentWindow: true }];

      try {
        Object.defineProperty(chrome.tabs, "query", {
          configurable: true,
          value: replacement
        });
      } catch {
        chrome.tabs.query = replacement;
      }
    }, targetTabId);

    return {
      popupPage,
      method: "direct"
    };
  }
}

async function clickPopupCopyAndWait(popupPage) {
  await popupPage.getByRole("button", { name: "Copy Current Page" }).click();
  await popupPage.waitForFunction(
    () => {
      const status = document.querySelector("#status");
      return status?.dataset.kind === "success" || status?.dataset.kind === "error";
    },
    undefined,
    { timeout: 15000 }
  );
}

async function readClipboard(page) {
  return await page.evaluate(async () => navigator.clipboard.readText());
}

async function getStatus(page) {
  return await page.evaluate(() => {
    const status = document.querySelector("#status");
    return {
      kind: status?.dataset.kind ?? null,
      text: status?.textContent ?? ""
    };
  });
}

async function triggerContextMenuHandler(serviceWorker, tabId) {
  await serviceWorker.evaluate(async ({ tabId: activeTabId }) => {
    await self.__TEST_handleContextMenuClick(
      { menuItemId: "docs-to-markdown-copy-page" },
      { id: activeTabId }
    );
  }, { tabId });
}

async function forceClipboardFailure(popupPage) {
  return await popupPage.evaluate(async () => {
    await navigator.clipboard.writeText("sentinel-value");

    const failure = async () => {
      throw new Error("forced-write-failure");
    };

    try {
      Object.defineProperty(navigator.clipboard, "writeText", {
        configurable: true,
        value: failure
      });
    } catch {
      navigator.clipboard.writeText = failure;
    }

    document.execCommand = () => false;
    return navigator.clipboard.readText();
  });
}

function screenshotPath(filename) {
  return path.join(screenshotDir, filename);
}

async function runSmokeAndContentQuality() {
  const runtime = await launchExtensionContext();

  try {
    const docsPage = await runtime.context.newPage();
    await docsPage.goto(urls.richDocs);
    await docsPage.bringToFront();

    const tabId = await getActiveTabId(runtime.serviceWorker);
    assert.notEqual(tabId, null, "Active rich-docs tab id should be available");

    const { popupPage, method } = await openPopupPage(runtime, tabId);
    await clickPopupCopyAndWait(popupPage);

    const status = await getStatus(popupPage);

    const screenshot = screenshotPath("01-popup-success.png");
    await popupPage.screenshot({ path: screenshot, fullPage: true });

    if (status.kind === "success") {
      const preview = await popupPage.locator("#preview").inputValue();
      const clipboard = await readClipboard(popupPage);

      assert.match(preview, /# Using the Fixture API/);
      assert.match(clipboard, /```js/);
      assert.match(
        clipboard,
        /\[full installation guide\]\(https:\/\/example\.com\/fixture-sdk\)/
      );
      assert.match(clipboard, /\| Setting \| Default \| Description \|/);
      assert.match(clipboard, /!\[Fixture diagram\]/);
      assert.match(clipboard, /- Add a token/);
      assert.doesNotMatch(clipboard, /We use cookies\./);
      assert.doesNotMatch(clipboard, /Was this page helpful\?/);

      pushResult({
        artifact: "popup smoke test",
        expected: "Popup copy succeeds and produces structured Markdown.",
        actual: "Popup copy succeeded with structured preview and clipboard output.",
        outcome: "pass",
        screenshot: screenshot,
        notes: {
          popupOpenMethod: method,
          previewExcerpt: preview.slice(0, 240),
          wordCount: await popupPage.locator("#word-count").textContent(),
          charCount: await popupPage.locator("#char-count").textContent()
        }
      });
    } else {
      pushResult({
        artifact: "popup smoke test",
        expected: "Popup copy succeeds and produces structured Markdown.",
        actual: status.text,
        outcome: "fail",
        screenshot: screenshot,
        notes: {
          popupOpenMethod: method
        }
      });
    }
  } finally {
    await closeExtensionContext(runtime);
  }
}

async function runContextMenuFlow() {
  const runtime = await launchExtensionContext({
    extensionDir: createTestExtensionDir()
  });

  try {
    const docsPage = await runtime.context.newPage();
    await docsPage.goto(urls.richDocs);
    await docsPage.bringToFront();

    const tabId = await getActiveTabId(runtime.serviceWorker);
    assert.notEqual(tabId, null, "Active rich-docs tab id should be available");

    const { popupPage: primingPopup } = await openPopupPage(runtime, tabId);
    await primingPopup.close();

    await triggerContextMenuHandler(runtime.serviceWorker, tabId);

    const toast = docsPage.locator("#docs-to-markdown-toast");
    await toast.waitFor({ state: "visible" });
    const toastText = (await toast.textContent()) || "";
    assert.match(toastText, /Copied/);

    const clipboard = await readClipboard(docsPage);
    assert.match(clipboard, /# Using the Fixture API/);
    assert.match(clipboard, /```js/);

    const screenshot = screenshotPath("02-context-menu-toast.png");
    await docsPage.screenshot({ path: screenshot, fullPage: true });

    pushResult({
      artifact: "context menu copy",
      expected: "Context menu flow shows a visible toast and copies Markdown.",
      actual: "Background handler produced a toast and updated the clipboard.",
      outcome: "pass",
      screenshot: screenshot,
      notes: {
        testBuild: true,
        toastText
      }
    });
  } finally {
    await closeExtensionContext(runtime);
  }
}

async function runSettingsFlow() {
  const runtime = await launchExtensionContext({
    extensionDir: createTestExtensionDir()
  });

  try {
    const optionsPage = await runtime.context.newPage();
    await optionsPage.goto(`${runtime.extensionOrigin}/options/options.html`);
    await optionsPage.locator("#includeFrontmatter").uncheck();
    await optionsPage.locator("#includeSourceLink").uncheck();
    await optionsPage.locator("#includeTitleHeading").uncheck();
    await optionsPage.locator("#preserveTables").uncheck();
    await optionsPage.getByRole("button", { name: "Save Settings" }).click();
    await optionsPage.waitForFunction(() => {
      const status = document.querySelector("#status");
      return status?.textContent === "Settings saved.";
    });

    const optionsScreenshot = screenshotPath("03-options-updated.png");
    await optionsPage.screenshot({ path: optionsScreenshot, fullPage: true });

    const titlelessPage = await runtime.context.newPage();
    await titlelessPage.goto(urls.titlelessDocs);
    await titlelessPage.bringToFront();

    const titlelessTabId = await getActiveTabId(runtime.serviceWorker);
    assert.notEqual(titlelessTabId, null, "Active titleless tab id should be available");

    const { popupPage: titlelessPopup } = await openPopupPage(runtime, titlelessTabId);
    await clickPopupCopyAndWait(titlelessPopup);
    const titlelessStatus = await getStatus(titlelessPopup);
    assert.equal(titlelessStatus.kind, "success");

    const titlelessClipboard = await readClipboard(titlelessPopup);
    assert.equal(titlelessClipboard.startsWith("---"), false);
    assert.equal(titlelessClipboard.includes("Source: <"), false);
    assert.equal(titlelessClipboard.includes("# Titleless Fixture Page"), false);
    assert.match(titlelessClipboard, /## Configuration Notes/);

    const richDocsPage = await runtime.context.newPage();
    await richDocsPage.goto(urls.richDocs);
    await richDocsPage.bringToFront();

    const richDocsTabId = await getActiveTabId(runtime.serviceWorker);
    assert.notEqual(richDocsTabId, null, "Active rich-docs tab id should be available");

    const { popupPage: richDocsPopup } = await openPopupPage(runtime, richDocsTabId);
    await clickPopupCopyAndWait(richDocsPopup);
    const richDocsStatus = await getStatus(richDocsPopup);
    assert.equal(richDocsStatus.kind, "success");

    const richDocsClipboard = await readClipboard(richDocsPopup);
    assert.equal(richDocsClipboard.includes("| Setting | Default | Description |"), false);
    assert.equal(richDocsClipboard.includes("Source: <"), false);
    assert.equal(richDocsClipboard.startsWith("---"), false);

    const popupScreenshot = screenshotPath("04-popup-after-settings.png");
    await richDocsPopup.screenshot({ path: popupScreenshot, fullPage: true });

    pushResult({
      artifact: "settings flow",
      expected: "Saved settings alter the extracted Markdown output.",
      actual:
        "Frontmatter, source lines, title-heading insertion, and table preservation changed as configured.",
      outcome: "pass",
      screenshot: [optionsScreenshot, popupScreenshot],
      notes: {
        testBuild: true,
        titlelessExcerpt: titlelessClipboard.slice(0, 180),
        richDocsExcerpt: richDocsClipboard.slice(0, 180)
      }
    });
  } finally {
    await closeExtensionContext(runtime);
  }
}

async function runInternalPageFailure() {
  const runtime = await launchExtensionContext({
    extensionDir: createTestExtensionDir()
  });

  try {
    const internalPage = await runtime.context.newPage();
    await internalPage.goto(urls.internalPage);
    await internalPage.bringToFront();

    const tabId = await getActiveTabId(runtime.serviceWorker);
    assert.notEqual(tabId, null, "Active internal-page tab id should be available");

    const { popupPage } = await openPopupPage(runtime, tabId);
    await clickPopupCopyAndWait(popupPage);

    const status = await getStatus(popupPage);
    assert.equal(status.kind, "error");
    assert.notEqual(status.text, "Ready.");

    const screenshot = screenshotPath("05-internal-page-failure.png");
    await popupPage.screenshot({ path: screenshot, fullPage: true });

    pushResult({
      artifact: "restricted page failure",
      expected: "Browser internal pages show an error instead of silent success.",
      actual: status.text,
      outcome: "pass",
      screenshot: screenshot,
      notes: {
        testBuild: true
      }
    });
  } finally {
    await closeExtensionContext(runtime);
  }
}

async function runEmptyPageFailureCheck() {
  const runtime = await launchExtensionContext({
    extensionDir: createTestExtensionDir()
  });

  try {
    const emptyPage = await runtime.context.newPage();
    await emptyPage.goto(urls.emptyPage);
    await emptyPage.bringToFront();

    const tabId = await getActiveTabId(runtime.serviceWorker);
    assert.notEqual(tabId, null, "Active empty-page tab id should be available");

    const { popupPage } = await openPopupPage(runtime, tabId);
    await clickPopupCopyAndWait(popupPage);

    const status = await getStatus(popupPage);
    const clipboard = await readClipboard(popupPage);

    const screenshot = screenshotPath("06-empty-page-result.png");
    await popupPage.screenshot({ path: screenshot, fullPage: true });

    pushResult({
      artifact: "empty page failure behavior",
      expected: "The extension should reject pages without meaningful readable content.",
      actual: `${status.kind}: ${status.text}`,
      outcome: status.kind === "error" ? "pass" : "fail",
      screenshot: screenshot,
      notes: {
        testBuild: true,
        clipboardExcerpt: clipboard.slice(0, 180)
      }
    });
  } finally {
    await closeExtensionContext(runtime);
  }
}

async function runClipboardFailureCheck() {
  const runtime = await launchExtensionContext({
    extensionDir: createTestExtensionDir()
  });

  try {
    const docsPage = await runtime.context.newPage();
    await docsPage.goto(urls.richDocs);
    await docsPage.bringToFront();

    const tabId = await getActiveTabId(runtime.serviceWorker);
    assert.notEqual(tabId, null, "Active rich-docs tab id should be available");

    const { popupPage } = await openPopupPage(runtime, tabId);
    const sentinel = await forceClipboardFailure(popupPage);
    assert.equal(sentinel, "sentinel-value");

    await clickPopupCopyAndWait(popupPage);

    const status = await getStatus(popupPage);
    const clipboard = await readClipboard(popupPage);

    const screenshot = screenshotPath("07-clipboard-failure-result.png");
    await popupPage.screenshot({ path: screenshot, fullPage: true });

    pushResult({
      artifact: "clipboard failure visibility",
      expected: "Clipboard write failures should be visible to the user.",
      actual: `${status.kind}: ${status.text}`,
      outcome: status.kind === "error" ? "pass" : "fail",
      screenshot: screenshot,
      notes: {
        testBuild: true,
        clipboardValue: clipboard.slice(0, 180)
      }
    });
  } finally {
    await closeExtensionContext(runtime);
  }
}

async function main() {
  const scenarios = {
    smoke: runSmokeAndContentQuality,
    context: runContextMenuFlow,
    settings: runSettingsFlow,
    internal: runInternalPageFailure,
    empty: runEmptyPageFailureCheck,
    clipboard: runClipboardFailureCheck
  };
  const requested = process.argv.slice(2);
  const queue = requested.length ? requested : Object.keys(scenarios);

  flushResults();

  for (const scenarioName of queue) {
    const scenario = scenarios[scenarioName];

    if (!scenario) {
      pushResult({
        artifact: scenarioName,
        expected: "A known scenario name.",
        actual: "Unknown scenario requested.",
        outcome: "error"
      });
      continue;
    }

    try {
      await scenario();
    } catch (error) {
      pushResult({
        artifact: scenarioName,
        expected: "The scripted scenario completes.",
        actual: error instanceof Error ? error.stack || error.message : String(error),
        outcome: "error"
      });
    }
  }
}

main().catch((error) => {
  results.push({
    artifact: "automation harness",
    expected: "The scripted browser run completes.",
    actual: error instanceof Error ? error.stack || error.message : String(error),
    outcome: "error"
  });
  flushResults();

  console.error(error);
  process.exitCode = 1;
});
