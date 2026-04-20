(() => {
  const app = globalThis.WebToMarkdownContent;
  const escapeMarkdownText = app.require("escapeMarkdownText");
  const isProbablyHidden = app.require("isProbablyHidden");
  const normalizeWhitespace = app.require("normalizeWhitespace");

  const IGNORED_HEADING_TAGS = new Set([
    "button",
    "dialog",
    "form",
    "input",
    "label",
    "menu",
    "nav",
    "noscript",
    "script",
    "select",
    "style",
    "svg",
    "textarea"
  ]);
  const IGNORED_HEADING_ROLES = new Set([
    "button",
    "dialog",
    "menu",
    "navigation",
    "tab",
    "toolbar",
    "tooltip"
  ]);
  const HEADING_UI_PATTERN =
    /(^|[\s_-])(action|bookmark|collection|copy|feedback|icon|menu|save|share|toolbar|tooltip|utility)([\s_-]|$)/;

  function hasHeadingUtilityMarker(element) {
    const attributeText = [
      element.id,
      element.className,
      element.getAttribute("aria-label"),
      element.getAttribute("data-testid"),
      element.getAttribute("data-tooltip"),
      element.getAttribute("title")
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return HEADING_UI_PATTERN.test(attributeText);
  }

  function shouldIgnoreHeadingAncestor(element) {
    if (!(element instanceof Element)) {
      return false;
    }

    const tagName = element.tagName.toLowerCase();
    const role = (element.getAttribute("role") || "").toLowerCase();

    if (isProbablyHidden(element) || IGNORED_HEADING_TAGS.has(tagName)) {
      return true;
    }

    if (IGNORED_HEADING_ROLES.has(role) || hasHeadingUtilityMarker(element)) {
      return true;
    }

    if (tagName === "a" && (element.getAttribute("href") || "").startsWith("#")) {
      const markerText = [
        element.className,
        element.getAttribute("aria-label"),
        element.getAttribute("title")
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const text = normalizeWhitespace(element.textContent || "").trim();

      return text.length <= 4 || /(^|[\s_-])(anchor|hash|link)([\s_-]|$)/.test(markerText);
    }

    return false;
  }

  function shouldSkipHeadingTextNode(textNode, heading) {
    let current = textNode.parentElement;

    while (current && current !== heading) {
      if (shouldIgnoreHeadingAncestor(current)) {
        return true;
      }

      current = current.parentElement;
    }

    return false;
  }

  app.register("getHeadingText", (heading) => {
    if (!(heading instanceof Element)) {
      return "";
    }

    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const parts = [];

    while (walker.nextNode()) {
      const textNode = walker.currentNode;
      if (shouldSkipHeadingTextNode(textNode, heading)) {
        continue;
      }

      const normalized = normalizeWhitespace(textNode.textContent || "");
      if (normalized.trim()) {
        parts.push(normalized);
      }
    }

    return escapeMarkdownText(parts.join("").replace(/\s+/g, " ").trim());
  });
})();
