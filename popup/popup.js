import { getActiveTab } from "../shared/browser/get-active-tab.js";
import { getSettings } from "../shared/storage/settings-repository.js";
import { runPageExtraction } from "../shared/extraction/run-page-extraction.js";
import { renderStatus } from "./render-status.js";
import { renderResult } from "./render-result.js";
import { copyText } from "./copy-text.js";

const copyButton = document.querySelector("#copy-button");
const optionsButton = document.querySelector("#options-button");
const statusElement = document.querySelector("#status");
const resultPanel = document.querySelector("#result-panel");
const previewElement = document.querySelector("#preview");
const wordCountElement = document.querySelector("#word-count");
const charCountElement = document.querySelector("#char-count");

copyButton.addEventListener("click", async () => {
  copyButton.disabled = true;
  renderStatus(statusElement, "Extracting the current page...");

  try {
    const [tab, settings] = await Promise.all([getActiveTab(), getSettings()]);
    const result = await runPageExtraction(tab.id, settings);

    await copyText(result.markdown);

    renderResult(
      resultPanel,
      previewElement,
      wordCountElement,
      charCountElement,
      result
    );
    renderStatus(statusElement, "Markdown copied to the clipboard.", "success");
  } catch (error) {
    renderStatus(
      statusElement,
      error instanceof Error ? error.message : "Markdown copy failed.",
      "error"
    );
  } finally {
    copyButton.disabled = false;
  }
});

optionsButton.addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});
