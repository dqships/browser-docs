import { getActiveTab } from "../shared/browser/get-active-tab.js";
import { getSettings } from "../shared/storage/settings-repository.js";
import { runPageExtraction } from "../shared/extraction/run-page-extraction.js";
import { buildMarkdownFilename } from "../shared/files/build-markdown-filename.js";
import { downloadMarkdownFile } from "../shared/files/download-markdown-file.js";
import { recordMarkdownAction } from "../shared/actions/record-markdown-action.js";
import { renderStatus } from "./render-status.js";
import { renderResult } from "./render-result.js";

export function bindDownloadButton({
  button,
  statusElement,
  resultPanel,
  previewElement,
  wordCountElement,
  charCountElement
}) {
  button.addEventListener("click", async () => {
    button.disabled = true;
    renderStatus(statusElement, "Extracting the current page...");

    try {
      const [tab, settings] = await Promise.all([getActiveTab(), getSettings()]);
      const result = await runPageExtraction(tab.id, settings);
      const filename = buildMarkdownFilename(result.meta);

      downloadMarkdownFile(result.markdown, filename);

      renderResult(
        resultPanel,
        previewElement,
        wordCountElement,
        charCountElement,
        result
      );
      renderStatus(statusElement, `Saved ${filename}.`, "success");
      await recordMarkdownAction({ kind: "download", source: "popup", result });
    } catch (error) {
      renderStatus(
        statusElement,
        error instanceof Error ? error.message : "Markdown download failed.",
        "error"
      );
    } finally {
      button.disabled = false;
    }
  });
}
