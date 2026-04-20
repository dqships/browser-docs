(() => {
  const app = globalThis.WebToMarkdownContent;

  app.register("PRIMARY_CONTAINER_SELECTORS", [
    "main article",
    "article",
    "main",
    "[role='main']",
    ".docs-content",
    ".documentation",
    ".markdown",
    ".markdown-body",
    ".theme-doc-markdown",
    "#main-content",
    "#content",
    ".content"
  ]);
})();
