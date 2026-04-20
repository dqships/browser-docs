(() => {
  const app = globalThis.WebToMarkdownContent;
  const getTextContent = app.require("getTextContent");

  const MEANINGFUL_TAGS = new Set([
    "blockquote",
    "code",
    "hr",
    "img",
    "li",
    "ol",
    "pre",
    "table",
    "ul"
  ]);

  app.register("isMeaningfulElement", (element) => {
    if (!(element instanceof Element)) {
      return false;
    }

    if (MEANINGFUL_TAGS.has(element.tagName.toLowerCase())) {
      return true;
    }

    return getTextContent(element).length > 0;
  });
})();
