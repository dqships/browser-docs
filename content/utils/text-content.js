(() => {
  const app = globalThis.DocsToMarkdownContent;
  const normalizeWhitespace = app.require("normalizeWhitespace");

  app.register("getTextContent", (node) => {
    if (!node) {
      return "";
    }

    return normalizeWhitespace(node.textContent || "").trim();
  });
})();
