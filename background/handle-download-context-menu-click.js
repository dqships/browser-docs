import { DOWNLOAD_CONTEXT_MENU_ID } from "./bootstrap-context-menu.js";
import { getSettings } from "../shared/storage/settings-repository.js";
import { runPageExtraction } from "../shared/extraction/run-page-extraction.js";
import { downloadMarkdownInPage } from "../shared/extraction/download-markdown-in-page.js";
import { showPageToast } from "../shared/extraction/show-page-toast.js";
import { buildMarkdownFilename } from "../shared/files/build-markdown-filename.js";
import { recordMarkdownAction } from "../shared/actions/record-markdown-action.js";

export async function handleDownloadContextMenuClick(info, tab) {
  if (info.menuItemId !== DOWNLOAD_CONTEXT_MENU_ID || !tab?.id) {
    return;
  }

  try {
    const settings = await getSettings();
    const result = await runPageExtraction(tab.id, settings);
    const filename = buildMarkdownFilename(result.meta);

    const didDownload = await downloadMarkdownInPage(
      tab.id,
      result.markdown,
      filename,
      `Saved ${filename}.`
    );

    if (didDownload) {
      await recordMarkdownAction({ kind: "download", source: "context-menu", result });
    }
  } catch (error) {
    try {
      await showPageToast(
        tab.id,
        error instanceof Error ? error.message : "Markdown download failed.",
        "error"
      );
    } catch {
      /* Restricted pages do not allow injection-based feedback. */
    }
  }
}
