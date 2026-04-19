export async function showPageToast(tabId, message, kind = "info") {
  await browser.scripting.executeScript({
    target: { tabId },
    func: (toastMessage, toastKind) =>
      globalThis.DocsToMarkdownContent.require("showToast")(toastMessage, toastKind),
    args: [message, kind]
  });
}
