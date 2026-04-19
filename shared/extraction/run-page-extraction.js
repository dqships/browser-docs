import { CONTENT_INJECTION_FILES } from "../browser/injection-files.js";

export async function runPageExtraction(tabId, settings) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: CONTENT_INJECTION_FILES
  });

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: (resolvedSettings) =>
      globalThis.DocsToMarkdownContent.require("extractPage")(resolvedSettings),
    args: [settings]
  });

  if (!result?.markdown) {
    throw new Error("The page could not be converted to Markdown.");
  }

  return result;
}
