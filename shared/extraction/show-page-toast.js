export async function showPageToast(tabId, message, kind = "info") {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: (toastMessage, toastKind) =>
      globalThis.DocsToMarkdownContent.require("showToast")(toastMessage, toastKind),
    args: [message, kind]
  });
}
