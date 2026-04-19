(() => {
  const app = globalThis.DocsToMarkdownContent;

  app.register("NOISE_SELECTORS", [
    "aside",
    "dialog",
    "footer",
    "form",
    "header",
    "nav",
    "[aria-hidden='true']",
    "[role='alert']",
    "[role='banner']",
    "[role='complementary']",
    "[role='contentinfo']",
    "[role='dialog']",
    "[role='navigation']",
    ".admonition-title .hash-link",
    ".anchor",
    ".breadcrumbs",
    ".cookie-banner",
    ".cookie-notice",
    ".edit-page-link",
    ".feedback",
    ".hash-link",
    ".navbar",
    ".pagination",
    ".sidebar",
    ".table-of-contents",
    ".toc"
  ]);
})();
