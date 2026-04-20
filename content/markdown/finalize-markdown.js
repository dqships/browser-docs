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

  function renderLeadingResources(resources, body) {
    const uniqueResources = resources.filter(
      (resource) => resource?.label && resource?.url && !body.includes(`(${resource.url})`)
    );

    if (!uniqueResources.length) {
      return "";
    }

    if (uniqueResources.length === 1) {
      const [resource] = uniqueResources;
      return `[${resource.label}](${resource.url})`;
    }

    return uniqueResources.map((resource) => `- [${resource.label}](${resource.url})`).join("\n");
  }

  app.register("finalizeMarkdown", ({ body, settings, documentTitle, pageTitle, url, resources }) => {
    const sections = [];
    const cleanedBody = collapseBlankLines(body);
    const normalizedDocumentTitle = (documentTitle || "").trim();
    const normalizedPageTitle = (pageTitle || "").trim();
    const bodyStartsWithHeading = /^#\s+/.test(cleanedBody);
    const renderedResources = renderLeadingResources(resources || [], cleanedBody);

    if (settings.includeFrontmatter) {
      sections.push(
        buildFrontmatter({
          capturedAt: new Date().toISOString(),
          source: url,
          title: normalizedPageTitle,
          documentTitle: normalizedDocumentTitle
        })
      );
    }

    if (
      settings.includeTitleHeading &&
      (normalizedDocumentTitle || normalizedPageTitle) &&
      !bodyStartsWithHeading
    ) {
      sections.push(`# ${normalizedDocumentTitle || normalizedPageTitle}`);
    }

    if (settings.includeSourceLink && url) {
      sections.push(`Source: <${url}>`);
    }

    if (renderedResources) {
      sections.push(renderedResources);
    }

    sections.push(cleanedBody);

    return collapseBlankLines(sections.filter(Boolean).join("\n\n"));
  });
})();
