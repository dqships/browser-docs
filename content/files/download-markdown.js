(() => {
  const app = globalThis.WebToMarkdownContent;

  app.register("downloadMarkdown", (markdown, filename) => {
    if (!markdown || !filename) {
      throw new Error("Markdown download failed.");
    }

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = filename;
    link.style.display = "none";
    document.documentElement.appendChild(link);
    link.click();
    link.remove();

    // Revoking in the same task can cancel the download in Firefox.
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    return true;
  });
})();
