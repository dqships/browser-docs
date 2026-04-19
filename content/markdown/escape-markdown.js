(() => {
  const app = globalThis.DocsToMarkdownContent;

  app.register("escapeMarkdownText", (text) => text.replace(/\\/g, "\\\\"));
  app.register("escapeMarkdownTableCell", (text) => text.replace(/\|/g, "\\|"));
})();
