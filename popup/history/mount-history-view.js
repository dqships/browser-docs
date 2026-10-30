import { getCopyHistory } from "../../shared/history/get-copy-history.js";
import { clearCopyHistory } from "../../shared/history/clear-copy-history.js";
import { getSettings } from "../../shared/storage/settings-repository.js";
import { renderStatus } from "../render-status.js";
import { renderHistoryView } from "./render-history-view.js";
import { bindHistoryRowActions } from "./bind-history-row-actions.js";
import { bindClearAll } from "./bind-clear-all.js";

const IDLE_MESSAGE = "Saved copies stay on this device.";

// Sets up the history view once. The list reloads from storage every time
// the view is shown, so copies made from the context menu or shortcut appear.
export function mountHistoryView(section) {
  const heading = section.querySelector("[data-view-heading]");
  const status = section.querySelector("[data-history-status]");
  const elements = {
    toolbar: section.querySelector("[data-history-toolbar]"),
    count: section.querySelector("[data-history-count]"),
    list: section.querySelector("[data-history-list]"),
    empty: section.querySelector("[data-history-empty]"),
    offNote: section.querySelector("[data-history-off-note]")
  };
  let entries = [];

  async function refresh() {
    try {
      const [storedEntries, settings] = await Promise.all([getCopyHistory(), getSettings()]);
      entries = storedEntries;
      renderHistoryView(elements, entries, settings.saveCopyHistory !== false);
    } catch {
      renderStatus(status, "History could not be loaded.", "error");
    }
  }

  bindHistoryRowActions({
    list: elements.list,
    status,
    heading,
    getEntry: (id) => entries.find((entry) => entry.id === id),
    refresh
  });

  const closeClearAll = bindClearAll({
    startButton: section.querySelector("[data-history-clear-start]"),
    confirmGroup: section.querySelector("[data-history-clear-confirm]"),
    yesButton: section.querySelector("[data-history-clear-yes]"),
    cancelButton: section.querySelector("[data-history-clear-cancel]"),
    onConfirm: async () => {
      try {
        await clearCopyHistory();
        renderStatus(status, "History cleared.", "success");
      } catch {
        renderStatus(status, "History could not be cleared.", "error");
      }
      await refresh();
      heading.focus();
    }
  });

  section.addEventListener("popup-view-shown", () => {
    closeClearAll();
    renderStatus(status, IDLE_MESSAGE);
    void refresh();
  });
}
