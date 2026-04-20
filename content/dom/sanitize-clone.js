(() => {
  const app = globalThis.WebToMarkdownContent;
  const isMeaningfulElement = app.require("isMeaningfulElement");
  const isNoiseElement = app.require("isNoiseElement");

  function collectElements(root) {
    const elements = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

    while (walker.nextNode()) {
      elements.push(walker.currentNode);
    }

    return elements;
  }

  app.register("sanitizeClone", (root, settings) => {
    const clone = root.cloneNode(true);
    const descendants = collectElements(clone);

    for (const element of descendants) {
      if (element === clone) {
        continue;
      }

      if (isNoiseElement(element, settings.aggressivePruning)) {
        element.remove();
      }
    }

    const reversed = collectElements(clone).reverse();
    for (const element of reversed) {
      if (element === clone) {
        continue;
      }

      if (!isMeaningfulElement(element)) {
        element.remove();
      }
    }

    return clone;
  });
})();
