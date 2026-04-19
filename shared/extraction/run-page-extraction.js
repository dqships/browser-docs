import { CONTENT_INJECTION_FILES } from "../browser/injection-files.js";

export async function runPageExtraction(tabId, settings) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: CONTENT_INJECTION_FILES
  });

  const [{ result: executionResult }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: (resolvedSettings) => {
      try {
        return {
          ok: true,
          payload: globalThis.DocsToMarkdownContent.require("extractPage")(resolvedSettings)
        };
      } catch (error) {
        return {
          ok: false,
          errorMessage:
            error instanceof Error
              ? error.message
              : "The page could not be converted to Markdown."
        };
      }
    },
    args: [settings]
  });

  if (!executionResult?.ok) {
    throw new Error(executionResult?.errorMessage || "The page could not be converted to Markdown.");
  }

  const result = executionResult.payload;
  if (!result?.markdown) {
    throw new Error("The page could not be converted to Markdown.");
  }

  return result;
}
