import { COPY_CONTEXT_MENU_ID } from "./bootstrap-context-menu.js";
import { getSettings } from "../shared/storage/settings-repository.js";
import { runPageExtraction } from "../shared/extraction/run-page-extraction.js";
import { copyMarkdownInPage } from "../shared/extraction/copy-markdown-in-page.js";
import { showPageToast } from "../shared/extraction/show-page-toast.js";
import { recordMarkdownAction } from "../shared/actions/record-markdown-action.js";

export async function handleContextMenuClick(info, tab) {
  if (info.menuItemId !== COPY_CONTEXT_MENU_ID || !tab?.id) {
    return;
  }

  try {
    const settings = await getSettings();
    const result = await runPageExtraction(tab.id, settings);

    const didCopy = await copyMarkdownInPage(
      tab.id,
      result.markdown,
      `Copied ${result.stats.wordCount} words of Markdown.`
    );

    if (didCopy) {
      await recordMarkdownAction({ kind: "copy", source: "context-menu", result });
    }
  } catch (error) {
    try {
      await showPageToast(
        tab.id,
        error instanceof Error ? error.message : "Markdown copy failed.",
        "error"
      );
    } catch {
      /* Restricted pages do not allow injection-based feedback. */
    }
  }
}
