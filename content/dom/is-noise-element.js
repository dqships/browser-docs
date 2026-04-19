(() => {
  const app = globalThis.DocsToMarkdownContent;
  const noiseSelectors = app.require("NOISE_SELECTORS");
  const getTextContent = app.require("getTextContent");
  const isProbablyHidden = app.require("isProbablyHidden");

  const NOISE_TAGS = new Set([
    "button",
    "canvas",
    "iframe",
    "input",
    "label",
    "noscript",
    "script",
    "select",
    "style",
    "svg",
    "template",
    "textarea"
  ]);

  app.register("isNoiseElement", (element, aggressivePruning = true) => {
    if (!(element instanceof Element)) {
      return false;
    }

    if (isProbablyHidden(element) || NOISE_TAGS.has(element.tagName.toLowerCase())) {
      return true;
    }

    if (aggressivePruning && element.matches(noiseSelectors.join(","))) {
      return true;
    }

    const identifierText = [
      element.id,
      element.className,
      element.getAttribute("data-testid"),
      element.getAttribute("aria-label")
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (
      aggressivePruning &&
      /(announcement|banner|breadcrumb|cookie|consent|feedback|footer|nav|pagination|sidebar|social|share|toolbar|toc)/.test(
        identifierText
      )
    ) {
      return true;
    }

    if (element.tagName.toLowerCase() === "a") {
      const href = element.getAttribute("href") || "";
      const text = getTextContent(element);

      if (href.startsWith("#") && text.length <= 2) {
        return true;
      }
    }

    return false;
  });
})();
