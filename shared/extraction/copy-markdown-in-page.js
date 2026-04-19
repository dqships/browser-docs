export async function copyMarkdownInPage(tabId, markdown, message) {
  await browser.scripting.executeScript({
    target: { tabId },
    func: (text, toastMessage) =>
      globalThis.DocsToMarkdownContent.require("copyAndToast")(text, toastMessage),
    args: [markdown, message]
  });
}
