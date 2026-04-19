(() => {
  const app = globalThis.DocsToMarkdownContent;
  const serializeInline = app.require("serializeInline");

  function isListElement(node) {
    return node instanceof Element && ["ul", "ol"].includes(node.tagName.toLowerCase());
  }

  function serializeListItem(li, depth, index, ordered) {
    const indent = "  ".repeat(depth);
    const prefix = `${indent}${ordered ? `${index + 1}.` : "-"} `;
    const nestedLists = [];
    let content = "";

    for (const child of li.childNodes) {
      if (isListElement(child)) {
        nestedLists.push(serializeList(child, depth + 1));
        continue;
      }

      content += serializeInline(child);
    }

    const line = `${prefix}${content.replace(/\s+/g, " ").trim()}`.trimEnd();
    return [line, ...nestedLists.filter(Boolean)].filter(Boolean).join("\n");
  }

  function serializeList(listNode, depth = 0) {
    const ordered = listNode.tagName.toLowerCase() === "ol";
    const items = Array.from(listNode.children).filter(
      (child) => child.tagName.toLowerCase() === "li"
    );

    return items
      .map((item, index) => serializeListItem(item, depth, index, ordered))
      .filter(Boolean)
      .join("\n");
  }

  app.register("serializeList", serializeList);
})();
