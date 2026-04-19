export const COPY_CONTEXT_MENU_ID = "docs-to-markdown-copy-page";

export async function registerContextMenu() {
  await chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    contexts: ["page"],
    id: COPY_CONTEXT_MENU_ID,
    title: "Copy page as Markdown"
  });
}
