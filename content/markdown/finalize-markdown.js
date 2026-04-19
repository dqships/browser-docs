(() => {
  const app = globalThis.DocsToMarkdownContent;

  function collapseBlankLines(text) {
    return text.replace(/\n{3,}/g, "\n\n").trim();
  }

  function buildFrontmatter(metadata) {
    const entries = Object.entries(metadata).filter(([, value]) => Boolean(value));
    if (!entries.length) {
      return "";
    }

    const lines = entries.map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
    return `---\n${lines.join("\n")}\n---`;
  }

  app.register("finalizeMarkdown", ({ body, settings, title, url }) => {
    const sections = [];
    const cleanedBody = collapseBlankLines(body);
    const normalizedTitle = (title || "").trim();

    if (settings.includeFrontmatter) {
      sections.push(
        buildFrontmatter({
          capturedAt: new Date().toISOString(),
          source: url,
          title: normalizedTitle
        })
      );
    }

    if (
      settings.includeTitleHeading &&
      normalizedTitle &&
      !cleanedBody.startsWith(`# ${normalizedTitle}`)
    ) {
      sections.push(`# ${normalizedTitle}`);
    }

    if (settings.includeSourceLink && url) {
      sections.push(`Source: <${url}>`);
    }

    sections.push(cleanedBody);

    return collapseBlankLines(sections.filter(Boolean).join("\n\n"));
  });
})();
