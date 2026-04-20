(() => {
  const app = globalThis.WebToMarkdownContent;

  app.register("resolveUrl", (value) => {
    if (!value) {
      return "";
    }

    try {
      return new URL(value, document.baseURI).toString();
    } catch {
      return value;
    }
  });
})();
