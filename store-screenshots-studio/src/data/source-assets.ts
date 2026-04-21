export const sourceAssets = {
  icon: "/source/icon/app-icon.png",
  popupSuccess: "/source/popup/popup-success.png",
  popupBlocked: "/source/popup/popup-blocked.png",
  browserContextMenu: "/source/browser/context-menu-toast.png",
  optionsUpdated: "/source/options/options-updated.png",
} as const;

export const markdownExcerptLines = [
  "# Using the Fixture API",
  "",
  "This page exists to test whether",
  "the extension can convert a typical",
  "documentation layout into clean",
  "Markdown without copying site chrome.",
  "",
  "## Install",
  "- Add the package",
  "- Rotate the token before sharing",
  "- Run a dry run",
] as const;

export const permissionList = [
  "activeTab",
  "clipboardWrite",
  "contextMenus",
  "scripting",
  "storage",
] as const;
