(() => {
  const app = globalThis.DocsToMarkdownContent;
  const escapeMarkdownText = app.require("escapeMarkdownText");
  const normalizeWhitespace = app.require("normalizeWhitespace");
  const resolveUrl = app.require("resolveUrl");

  function serializeInlineChildren(element) {
    return element.childNodes
      ? Array.from(element.childNodes)
          .map((child) => serializeInline(child))
          .join("")
          .replace(/\s+\n/g, "\n")
          .replace(/\n\s+/g, "\n")
      : "";
  }

  function wrapInlineCode(text) {
    const fence = text.includes("`") ? "``" : "`";
    return `${fence}${text}${fence}`;
  }

  function serializeInline(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeMarkdownText(normalizeWhitespace(node.textContent || ""));
    }

    if (!(node instanceof Element)) {
      return "";
    }

    const tagName = node.tagName.toLowerCase();

    switch (tagName) {
      case "a": {
        const href = resolveUrl(node.getAttribute("href") || "");
        const text = serializeInlineChildren(node).trim() || href;
        return href ? `[${text}](${href})` : text;
      }
      case "br":
        return "\n";
      case "code": {
        if (node.closest("pre")) {
          return "";
        }

        const text = node.textContent?.trim() || "";
        return text ? wrapInlineCode(text) : "";
      }
      case "del":
      case "s":
        return `~~${serializeInlineChildren(node).trim()}~~`;
      case "em":
      case "i":
        return `*${serializeInlineChildren(node).trim()}*`;
      case "img": {
        const alt = node.getAttribute("alt") || "image";
        const src = resolveUrl(node.getAttribute("src") || "");
        return src ? `![${alt}](${src})` : "";
      }
      case "strong":
      case "b":
        return `**${serializeInlineChildren(node).trim()}**`;
      default:
        return serializeInlineChildren(node);
    }
  }

  app.register("serializeInline", serializeInline);
})();
