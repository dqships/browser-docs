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
  const STRUCTURAL_NOISE_PATTERN =
    /(^|[\s_-])(announcement|banner|breadcrumb|cookie|consent|feedback|footer|nav|navbar|pagination|sidebar|social|share|toolbar|toc)([\s_-]|$)/;

  function isLinkCardNavigation(element) {
    const directChildren = Array.from(element.children);
    if (directChildren.length < 2) {
      return false;
    }

    const classText = `${element.className || ""}`.toLowerCase();
    if (!/(^|\s)(flex|grid)(\s|$)/.test(classText)) {
      return false;
    }

    if (
      !directChildren.every(
        (child) =>
          child instanceof HTMLAnchorElement &&
          Boolean(child.getAttribute("href")) &&
          !child.getAttribute("href").startsWith("#")
      )
    ) {
      return false;
    }

    return getTextContent(element).length >= 40;
  }

  app.register("isNoiseElement", (element, aggressivePruning = true) => {
    if (!(element instanceof Element)) {
      return false;
    }

    const tagName = element.tagName.toLowerCase();

    if (isProbablyHidden(element) || NOISE_TAGS.has(tagName)) {
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
      !/^h[1-6]$/.test(tagName) &&
      STRUCTURAL_NOISE_PATTERN.test(identifierText)
    ) {
      return true;
    }

    if (aggressivePruning && isLinkCardNavigation(element)) {
      return true;
    }

    if (tagName === "a") {
      const href = element.getAttribute("href") || "";
      const text = getTextContent(element);

      if (href.startsWith("#") && text.length <= 2) {
        return true;
      }
    }

    return false;
  });
})();
