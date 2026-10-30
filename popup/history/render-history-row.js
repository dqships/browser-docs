import { isOpenableUrl } from "../../shared/history/is-openable-url.js";
import { formatRelativeTime } from "./format-relative-time.js";
import { formatWordCount } from "./format-word-count.js";
import { getDisplayHostname } from "./get-display-hostname.js";

const ACTIONS = [
  { action: "copy", label: "Copy again" },
  { action: "download", label: "Download .md" },
  { action: "visit", label: "Visit site" },
  { action: "delete", label: "Delete" }
];

function createText(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

// Builds one history list item. Titles and URLs come from arbitrary pages, so
// they are only ever set through textContent and attributes, never as HTML.
export function renderHistoryRow(entry, index, now) {
  const hostname = getDisplayHostname(entry.url);
  const titleId = `history-title-${index}`;

  const item = document.createElement("li");
  item.className = "history-row";
  item.dataset.entryId = entry.id;

  const title = createText("p", "history-title", entry.title || hostname || "Untitled page");
  title.id = titleId;
  title.title = entry.title || entry.url || "";

  const meta = document.createElement("p");
  meta.className = "history-meta";
  if (hostname) {
    meta.append(createText("span", "history-host", hostname));
  }
  const time = createText("time", "history-time", formatRelativeTime(entry.copiedAt, now));
  time.dateTime = entry.copiedAt || "";
  meta.append(time, createText("span", "history-words", formatWordCount(entry.wordCount)));

  const actions = document.createElement("div");
  actions.className = "history-actions";
  for (const { action, label } of ACTIONS) {
    const button = createText("button", "history-action", label);
    button.type = "button";
    button.dataset.historyAction = action;
    button.setAttribute("aria-describedby", titleId);
    if (action === "visit" && !isOpenableUrl(entry.url)) {
      button.disabled = true;
    }
    actions.append(button);
  }

  item.append(title, meta, actions);
  return item;
}
