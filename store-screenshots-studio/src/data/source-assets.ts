export const sourceAssets = {
  icon: "/source/icon/app-icon.png",
  popupSuccess: "/source/popup/popup-success.png",
  popupBlocked: "/source/popup/popup-blocked.png",
  popupHistory: "/source/popup/popup-history.png",
  browserContextMenu: "/source/browser/context-menu-toast.png",
  optionsUpdated: "/source/options/options-updated.png",
} as const;

/** An excerpt of what the extension copies from the capture fixture page. */
export const markdownExcerptLines = [
  "# Using the Fixture API",
  "",
  "## Install",
  "",
  "Start by running `npm install fixture-sdk`",
  "in your project.",
  "",
  "## Configure",
  "",
  "- Add a token",
  "  - Use a development token for local work.",
  "- Enable logging",
  "",
  "```js",
  "import { createFixtureClient } from \"fixture-sdk\";",
  "```",
] as const;

export const permissionList = [
  "activeTab",
  "clipboardWrite",
  "contextMenus",
  "scripting",
  "storage",
] as const;
