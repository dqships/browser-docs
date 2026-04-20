(() => {
  const app = globalThis.WebToMarkdownContent;

  function inferLanguageFromText(text) {
    const normalized = text.trim();
    if (!normalized) {
      return "";
    }

    if (
      /^(?:#.*\n)*(?:git|npm|pnpm|yarn|bun|cd|mkdir|cp|mv|rm|curl|wget|docker|kubectl)\b/m.test(
        normalized
      ) ||
      /^(?:#.*\n)*[A-Z][A-Z0-9_]*=.+$/m.test(normalized)
    ) {
      return "bash";
    }

    if (
      /\bexport\s+(?:const|function|class)\b/.test(normalized) ||
      /\binterface\s+[A-Z]/.test(normalized) ||
      /\btype\s+[A-Z]/.test(normalized)
    ) {
      return "ts";
    }

    return "";
  }

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

    return inferLanguageFromText(element.textContent || "");
  });
})();
