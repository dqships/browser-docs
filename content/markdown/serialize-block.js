(() => {
  const app = globalThis.DocsToMarkdownContent;
  const getCodeLanguage = app.require("getCodeLanguage");
  const serializeInline = app.require("serializeInline");
  const serializeList = app.require("serializeList");
  const serializeTable = app.require("serializeTable");

  const BLOCK_TAGS = new Set([
    "address",
    "article",
    "aside",
    "blockquote",
    "body",
    "details",
    "div",
    "dl",
    "figure",
    "figcaption",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "li",
    "main",
    "ol",
    "p",
    "pre",
    "section",
    "table",
    "ul"
  ]);

  function isBlockNode(node) {
    return node instanceof Element && BLOCK_TAGS.has(node.tagName.toLowerCase());
  }

  function stripOuterBlankLines(input) {
    return input.replace(/^\n+|\n+$/g, "");
  }

  function blockquoteFromChildren(node) {
    const content = stripOuterBlankLines(serializeChildrenAsBlocks(node));
    return content
      .split("\n")
      .map((line) => (line ? `> ${line}` : ">"))
      .join("\n");
  }

  function serializeChildrenAsBlocks(node) {
    const parts = [];
    let inlineBuffer = "";

    function flushInlineBuffer() {
      const normalized = inlineBuffer.replace(/\s+/g, " ").trim();
      if (normalized) {
        parts.push(normalized);
      }
      inlineBuffer = "";
    }

    for (const child of node.childNodes) {
      if (isBlockNode(child)) {
        flushInlineBuffer();
        parts.push(stripOuterBlankLines(serializeBlock(child)));
      } else {
        inlineBuffer += serializeInline(child);
      }
    }

    flushInlineBuffer();

    return parts.filter(Boolean).join("\n\n");
  }

  function serializeDescriptionList(node) {
    const lines = [];
    let currentTerm = "";

    for (const child of node.children) {
      const tagName = child.tagName.toLowerCase();
      const text = serializeChildrenAsBlocks(child).replace(/\s+/g, " ").trim();

      if (!text) {
        continue;
      }

      if (tagName === "dt") {
        currentTerm = text;
      }

      if (tagName === "dd") {
        lines.push(currentTerm ? `- **${currentTerm}**: ${text}` : `- ${text}`);
      }
    }

    return lines.join("\n");
  }

  function serializeBlock(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.trim() ? node.textContent.trim() : "";
    }

    if (!(node instanceof Element)) {
      return "";
    }

    const tagName = node.tagName.toLowerCase();

    switch (tagName) {
      case "blockquote":
        return blockquoteFromChildren(node);
      case "details": {
        const summary = node.querySelector("summary");
        const summaryText = summary ? serializeChildrenAsBlocks(summary) : "Details";
        const clone = node.cloneNode(true);
        clone.querySelector("summary")?.remove();
        const body = stripOuterBlankLines(serializeChildrenAsBlocks(clone));
        return [`**${summaryText.trim()}**`, body].filter(Boolean).join("\n\n");
      }
      case "dl":
        return serializeDescriptionList(node);
      case "figure":
      case "figcaption":
      case "section":
      case "article":
      case "main":
      case "div":
      case "body":
        return serializeChildrenAsBlocks(node);
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        const level = Number(tagName.slice(1));
        const content = serializeInline(node).replace(/\s+/g, " ").trim();
        return content ? `${"#".repeat(level)} ${content}` : "";
      }
      case "hr":
        return "---";
      case "ol":
      case "ul":
        return serializeList(node);
      case "p": {
        const content = serializeInline(node).replace(/\s+\n/g, "\n").trim();
        return content;
      }
      case "pre": {
        const codeElement = node.querySelector("code");
        const language = getCodeLanguage(node);
        const code = (codeElement?.textContent || node.textContent || "").replace(
          /^\n+|\n+$/g,
          ""
        );

        return code ? `\`\`\`${language}\n${code}\n\`\`\`` : "";
      }
      case "table":
        return serializeTable(node);
      default:
        return serializeChildrenAsBlocks(node);
    }
  }

  app.register("serializeBlock", serializeBlock);
})();
