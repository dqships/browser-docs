export const COPY_CONTEXT_MENU_ID = "web-to-markdown-copy-page";
export const DOWNLOAD_CONTEXT_MENU_ID = "web-to-markdown-download-page";

export async function registerContextMenu() {
  await browser.contextMenus.removeAll();

  browser.contextMenus.create({
    contexts: ["page"],
    id: COPY_CONTEXT_MENU_ID,
    title: "Copy page as Markdown"
  });

  browser.contextMenus.create({
    contexts: ["page"],
    id: DOWNLOAD_CONTEXT_MENU_ID,
    title: "Download page as Markdown"
  });
}
