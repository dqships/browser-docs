(() => {
  const app = globalThis.WebToMarkdownContent;
  const finalizeMarkdown = app.require("finalizeMarkdown");
  const findPrimaryContainer = app.require("findPrimaryContainer");
  const getDocumentTitle = app.require("getDocumentTitle");
  const getLeadingResources = app.require("getLeadingResources");
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

  function getReadableSignalCount(element) {
    return element.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, pre, code, ul, ol, table, blockquote, img"
    ).length;
  }

  function hasReadableBody(markdownBody, element) {
    const trimmedBody = markdownBody.trim();
    if (!trimmedBody) {
      return false;
    }

    const bodyWordCount = getWordCount(trimmedBody);
    if (bodyWordCount >= 25) {
      return true;
    }

    const readableSignalCount = getReadableSignalCount(element);
    return bodyWordCount >= 12 && readableSignalCount >= 2;
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

    const documentTitle = getDocumentTitle(element, document.title);
    const cleanedClone = sanitizeClone(element, settings);
    const resources = getLeadingResources(element);
    if (!settings.preserveTables) {
      for (const table of cleanedClone.querySelectorAll("table")) {
        table.remove();
      }
    }
    const body = serializeBlock(cleanedClone);

    if (!hasReadableBody(body, cleanedClone)) {
      throw new Error("No meaningful readable content was found on this page.");
    }

    const markdown = finalizeMarkdown({
      body,
      settings,
      documentTitle,
      pageTitle: document.title,
      resources,
      url: location.href
    });

    if (!markdown) {
      throw new Error("The page did not produce any Markdown output.");
    }

    return {
      markdown,
      meta: {
        documentTitle,
        pageTitle: document.title,
        title: documentTitle || document.title,
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
