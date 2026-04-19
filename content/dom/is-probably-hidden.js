(() => {
  const app = globalThis.DocsToMarkdownContent;

  app.register("isProbablyHidden", (element) => {
    if (!(element instanceof Element)) {
      return false;
    }

    const className = `${element.className || ""}`.toLowerCase();
    const hiddenByClass = /\b(hidden|visually-hidden|sr-only)\b/.test(className);

    return (
      element.hidden ||
      element.getAttribute("aria-hidden") === "true" ||
      element.getAttribute("type") === "hidden" ||
      hiddenByClass
    );
  });
})();
