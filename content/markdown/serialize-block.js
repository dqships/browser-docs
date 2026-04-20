(() => {
  const app = globalThis.DocsToMarkdownContent;
  const getCalloutMetadata = app.require("getCalloutMetadata");
  const getHeadingText = app.require("getHeadingText");
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

  function blockquoteFromChildren(node, options = {}) {
    const content = stripOuterBlankLines(serializeChildrenAsBlocks(node, options));
    return content
      .split("\n")
      .map((line) => (line ? `> ${line}` : ">"))
      .join("\n");
  }

  function serializeChildrenAsBlocks(node, options = {}) {
    const skipElements = options.skipElements || new Set();
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
      if (child instanceof Element && skipElements.has(child)) {
        flushInlineBuffer();
        continue;
      }

      if (isBlockNode(child)) {
        flushInlineBuffer();
        parts.push(stripOuterBlankLines(serializeBlock(child, options)));
      } else {
        inlineBuffer += serializeInline(child);
      }
    }

    flushInlineBuffer();

    return parts.filter(Boolean).join("\n\n");
  }

  function serializeDescriptionList(node, options = {}) {
    const lines = [];
    let currentTerm = "";

    for (const child of node.children) {
      const tagName = child.tagName.toLowerCase();
      const text = serializeChildrenAsBlocks(child, options).replace(/\s+/g, " ").trim();

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

  function formatCalloutLabel(kind) {
    if (!kind) {
      return "";
    }

    return kind.charAt(0).toUpperCase() + kind.slice(1);
  }

  function prefixBlockquote(content) {
    return content
      .split("\n")
      .map((line) => (line ? `> ${line}` : ">"))
      .join("\n");
  }

  function serializeCallout(node) {
    const metadata = getCalloutMetadata(node);
    if (!metadata) {
      return "";
    }

    const title = metadata.title || formatCalloutLabel(metadata.kind);
    const body = stripOuterBlankLines(
      serializeChildrenAsBlocks(node, {
        skipElements: metadata.titleElement ? new Set([metadata.titleElement]) : new Set()
      })
    );
    const sections = [];

    if (title) {
      sections.push(`**${title}**`);
    }

    if (body) {
      sections.push(body);
    }

    return sections.length ? prefixBlockquote(sections.join("\n\n")) : "";
  }

  function serializeBlock(node, options = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.trim() ? node.textContent.trim() : "";
    }

    if (!(node instanceof Element)) {
      return "";
    }

    const tagName = node.tagName.toLowerCase();

    switch (tagName) {
      case "blockquote":
        return blockquoteFromChildren(node, options);
      case "details": {
        const summary = node.querySelector("summary");
        const summaryText = summary ? serializeChildrenAsBlocks(summary, options) : "Details";
        const clone = node.cloneNode(true);
        clone.querySelector("summary")?.remove();
        const body = stripOuterBlankLines(serializeChildrenAsBlocks(clone, options));
        return [`**${summaryText.trim()}**`, body].filter(Boolean).join("\n\n");
      }
      case "dl":
        return serializeDescriptionList(node, options);
      case "aside": {
        const callout = serializeCallout(node);
        return callout || serializeChildrenAsBlocks(node, options);
      }
      case "figure":
      case "figcaption":
      case "section":
      case "article":
      case "main":
      case "div":
      case "body": {
        const callout =
          tagName === "section" || tagName === "div" ? serializeCallout(node) : "";
        return callout || serializeChildrenAsBlocks(node, options);
      }
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        const level = Number(tagName.slice(1));
        const content = getHeadingText(node);
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
