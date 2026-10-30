import { renderStatus } from "../render-status.js";
import { copyHistoryEntry } from "./copy-history-entry.js";
import { downloadHistoryEntry } from "./download-history-entry.js";
import { visitHistoryEntry } from "./visit-history-entry.js";
import { deleteHistoryEntry } from "./delete-history-entry.js";
import { focusHistoryRow } from "./focus-history-row.js";

const HANDLERS = {
  copy: copyHistoryEntry,
  download: downloadHistoryEntry,
  visit: visitHistoryEntry,
  delete: deleteHistoryEntry
};

const FAILURE_MESSAGES = {
  copy: "Copy failed.",
  download: "Download failed.",
  visit: "The page could not be opened.",
  delete: "The entry could not be deleted."
};

// One click listener for every row button. getEntry looks an entry up by id;
// refresh re-reads storage and redraws the list.
export function bindHistoryRowActions({ list, status, heading, getEntry, refresh }) {
  list.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-history-action]");
    const row = button?.closest(".history-row");
    const entry = row && getEntry(row.dataset.entryId);
    const action = button?.dataset.historyAction;

    if (!entry || !HANDLERS[action]) {
      return;
    }

    const index = Array.prototype.indexOf.call(list.children, row);
    button.disabled = true;

    try {
      const message = await HANDLERS[action](entry);
      renderStatus(status, message, "success");
    } catch (error) {
      renderStatus(
        status,
        error instanceof Error && error.message ? error.message : FAILURE_MESSAGES[action],
        "error"
      );
    } finally {
      button.disabled = false;
    }

    if (action === "delete") {
      await refresh();
      focusHistoryRow(list, index, heading);
    }
  });
}
