(() => {
  const app = globalThis.WebToMarkdownContent;
  const downloadMarkdown = app.require("downloadMarkdown");
  const showToast = app.require("showToast");

  app.register("downloadAndToast", (markdown, filename, successMessage) => {
    try {
      downloadMarkdown(markdown, filename);
      showToast(successMessage || `Saved ${filename}.`, "success");
      return true;
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Markdown download failed.",
        "error"
      );
      return false;
    }
  });
})();
