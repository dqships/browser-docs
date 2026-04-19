(() => {
  const app = globalThis.DocsToMarkdownContent;

  app.register("normalizeWhitespace", (input) => {
    if (!input) {
      return "";
    }

    const startsWithSpace = /^\s/.test(input);
    const endsWithSpace = /\s$/.test(input);
    const collapsed = input.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

    if (!collapsed) {
      return "";
    }

    return `${startsWithSpace ? " " : ""}${collapsed}${endsWithSpace ? " " : ""}`;
  });
})();
