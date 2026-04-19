(() => {
  const app = globalThis.DocsToMarkdownContent;
  const finalizeMarkdown = app.require("finalizeMarkdown");
  const findPrimaryContainer = app.require("findPrimaryContainer");
  const sanitizeClone = app.require("sanitizeClone");
  const serializeBlock = app.require("serializeBlock");

  const DEFAULT_RUNTIME_SETTINGS = {
    aggressivePruning: true,
    includeFrontmatter: true,
    includeSourceLink: true,
    includeTitleHeading: true,
    preserveTables: true
  };

  function getWordCount(text) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  app.register("extractPage", (partialSettings) => {
    const settings = {
      ...DEFAULT_RUNTIME_SETTINGS,
      ...partialSettings
    };
    const { element, reason } = findPrimaryContainer();

    if (!element) {
      throw new Error("No readable content container was found on this page.");
    }

    const cleanedClone = sanitizeClone(element, settings);
    if (!settings.preserveTables) {
      for (const table of cleanedClone.querySelectorAll("table")) {
        table.remove();
      }
    }
    const body = serializeBlock(cleanedClone);

    const markdown = finalizeMarkdown({
      body,
      settings,
      title: document.title,
      url: location.href
    });

    if (!markdown) {
      throw new Error("The page did not produce any Markdown output.");
    }

    return {
      markdown,
      meta: {
        title: document.title,
        url: location.href
      },
      stats: {
        charCount: markdown.length,
        wordCount: getWordCount(markdown)
      },
      strategy: {
        selectedContainer: reason
      }
    };
  });
})();
