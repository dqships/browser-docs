export async function downloadMarkdownInPage(tabId, markdown, filename, message) {
  const [{ result: didDownload } = {}] = await browser.scripting.executeScript({
    target: { tabId },
    func: (text, name, toastMessage) =>
      globalThis.WebToMarkdownContent.require("downloadAndToast")(text, name, toastMessage),
    args: [markdown, filename, message]
  });

  return didDownload === true;
}
