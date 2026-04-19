(() => {
  const app = globalThis.DocsToMarkdownContent;
  const copyToClipboard = app.require("copyToClipboard");
  const showToast = app.require("showToast");

  app.register("copyAndToast", async (markdown, successMessage) => {
    try {
      await copyToClipboard(markdown);
      showToast(successMessage || "Markdown copied.", "success");
      return true;
    } catch {
      showToast("Markdown copy failed.", "error");
      return false;
    }
  });
})();
