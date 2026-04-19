(() => {
  const app = globalThis.DocsToMarkdownContent;

  app.register("getCodeLanguage", (element) => {
    if (!(element instanceof Element)) {
      return "";
    }

    const candidates = [
      element,
      element.querySelector("code")
    ].filter(Boolean);

    for (const candidate of candidates) {
      const classText = `${candidate.className || ""}`;
      const match = classText.match(
        /(?:language|lang|highlight-source|code-block-language)[-_]([a-z0-9#+.-]+)/i
      );

      if (match?.[1]) {
        return match[1].toLowerCase();
      }
    }

    return "";
  });
})();
