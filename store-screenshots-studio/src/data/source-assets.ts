export const sourceAssets = {
  icon: "/source/icon/app-icon.png",
  popupSuccess: "/source/popup/popup-success.png",
  popupBlocked: "/source/popup/popup-blocked.png",
  browserContextMenu: "/source/browser/context-menu-toast.png",
  optionsUpdated: "/source/options/options-updated.png",
} as const;

export const markdownExcerptLines = [
  "# Release Notes",
  "",
  "This update improves extraction",
  "for readable web pages and keeps",
  "the Markdown cleaner when sidebars,",
  "feedback widgets, and page chrome",
  "would normally get in the way.",
  "",
  "## Highlights",
  "- Keep source links",
  "- Preserve lists and code blocks",
  "- Spend less time cleaning up",
] as const;

export const permissionList = [
  "activeTab",
  "clipboardWrite",
  "contextMenus",
  "scripting",
  "storage",
] as const;
