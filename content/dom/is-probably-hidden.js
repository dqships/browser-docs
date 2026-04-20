(() => {
  const app = globalThis.DocsToMarkdownContent;

  function getClassTokens(element) {
    return String(element.className || "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  }

  function hasHiddenUtilityClass(element) {
    return getClassTokens(element).some(
      (token) => token === "hidden" || token === "visually-hidden" || token === "sr-only"
    );
  }

  app.register("isProbablyHidden", (element) => {
    if (!(element instanceof Element)) {
      return false;
    }

    return (
      element.hidden ||
      element.getAttribute("aria-hidden") === "true" ||
      element.getAttribute("type") === "hidden" ||
      hasHiddenUtilityClass(element)
    );
  });
})();
