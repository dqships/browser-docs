(() => {
  const app = globalThis.WebToMarkdownContent;
  const escapeMarkdownTableCell = app.require("escapeMarkdownTableCell");
  const serializeInline = app.require("serializeInline");

  function serializeRow(row) {
    const cells = Array.from(row.children).filter((cell) =>
      ["td", "th"].includes(cell.tagName.toLowerCase())
    );

    return cells.map((cell) => {
      const content = Array.from(cell.childNodes)
        .map((child) => serializeInline(child))
        .join("")
        .replace(/\s+/g, " ")
        .trim();

      return escapeMarkdownTableCell(content);
    });
  }

  app.register("serializeTable", (tableElement) => {
    const rows = Array.from(tableElement.querySelectorAll("tr"));
    if (!rows.length) {
      return "";
    }

    const serializedRows = rows.map(serializeRow).filter((row) => row.length > 0);
    if (!serializedRows.length) {
      return "";
    }

    const headers = serializedRows[0];
    const bodyRows = serializedRows.slice(1);
    const divider = headers.map(() => "---");
    const lines = [
      `| ${headers.join(" | ")} |`,
      `| ${divider.join(" | ")} |`,
      ...bodyRows.map((row) => `| ${row.join(" | ")} |`)
    ];

    return lines.join("\n");
  });
})();
