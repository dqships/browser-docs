(() => {
  const app = globalThis.DocsToMarkdownContent;
  const getTextContent = app.require("getTextContent");

  const CALLOUT_CONTAINER_PATTERN =
    /(^|[\s_-])(admonition|alert|callout|notice)([\s_-]|$)/;
  const CALLOUT_KIND_PATTERN =
    /(^|[\s_-])(caution|danger|error|important|info|note|success|tip|warning)([\s_-]|$)/;
  const CALLOUT_TITLE_PATTERN =
    /(^|[\s_-])(header|heading|label|title)([\s_-]|$)/;
  const TITLE_CLASS_PATTERN =
    /(^|[\s_-])(font-medium|font-semibold|font-bold)([\s_-]|$)/;

  function getAttributeText(element) {
    const values = [];

    for (const name of element.getAttributeNames()) {
      values.push(name, element.getAttribute(name) || "");
    }

    return values.join(" ").toLowerCase();
  }

  function getCalloutKind(markerText, role) {
    const kindMatch = markerText.match(CALLOUT_KIND_PATTERN);
    if (kindMatch?.[2]) {
      return kindMatch[2];
    }

    if (role === "note" || role === "status") {
      return "note";
    }

    if (role === "alert") {
      return "warning";
    }

    return "";
  }

  function getDirectTitleElement(element) {
    for (const child of element.children) {
      const tagName = child.tagName.toLowerCase();
      const markerText = getAttributeText(child);

      if (/^h[1-6]$/.test(tagName) || tagName === "summary") {
        return child;
      }

      if (CALLOUT_TITLE_PATTERN.test(markerText)) {
        return child;
      }

      if (
        (tagName === "p" || tagName === "div") &&
        child.children.length === 1 &&
        /^(strong|b)$/.test(child.firstElementChild?.tagName.toLowerCase() || "")
      ) {
        return child;
      }
    }

    for (const descendant of element.querySelectorAll("h1, h2, h3, h4, h5, h6, summary, p, div, strong, b")) {
      const markerText = getAttributeText(descendant);
      const text = getTextContent(descendant);

      if (!text || text.length > 80) {
        continue;
      }

      if (
        /^h[1-6]$/.test(descendant.tagName.toLowerCase()) ||
        descendant.tagName.toLowerCase() === "summary" ||
        descendant.tagName.toLowerCase() === "strong" ||
        descendant.tagName.toLowerCase() === "b" ||
        CALLOUT_TITLE_PATTERN.test(markerText) ||
        TITLE_CLASS_PATTERN.test(markerText)
      ) {
        return descendant;
      }
    }

    return null;
  }

  app.register("getCalloutMetadata", (element) => {
    if (!(element instanceof Element)) {
      return null;
    }

    const role = (element.getAttribute("role") || "").toLowerCase();
    const markerText = getAttributeText(element);
    const hasCalloutMarker =
      CALLOUT_CONTAINER_PATTERN.test(markerText) ||
      markerText.includes("callout-color") ||
      role === "alert" ||
      role === "note" ||
      role === "status";

    if (!hasCalloutMarker) {
      return null;
    }

    const titleElement = getDirectTitleElement(element);
    const title = titleElement ? getTextContent(titleElement) : "";
    const kind = getCalloutKind(markerText, role);

    if (!title && !kind) {
      return null;
    }

    return {
      kind,
      title,
      titleElement
    };
  });
})();
