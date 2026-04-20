(() => {
  const app = globalThis.WebToMarkdownContent;
  const getHeadingText = app.require("getHeadingText");

  const GENERIC_TITLES = new Set([
    "getting started",
    "introduction",
    "overview"
  ]);

  function getPageTitleCandidate(pageTitle) {
    const normalized = String(pageTitle || "")
      .replace(/\s*[|:-]\s*[^|:-]+$/, "")
      .trim();

    return normalized;
  }

  app.register("getDocumentTitle", (root, pageTitle = "") => {
    if (!(root instanceof Element)) {
      return "";
    }

    const headings = Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6"))
      .map((heading) => ({
        level: Number(heading.tagName.slice(1)),
        text: getHeadingText(heading)
      }))
      .filter((heading) => heading.text);

    const preferredHeading = headings.find((heading) => heading.level === 1);
    if (preferredHeading?.text) {
      return preferredHeading.text;
    }

    const firstHeading = headings[0]?.text || "";
    const pageTitleCandidate = getPageTitleCandidate(pageTitle);

    if (
      firstHeading &&
      !GENERIC_TITLES.has(firstHeading.toLowerCase())
    ) {
      return firstHeading;
    }

    if (pageTitleCandidate && pageTitleCandidate !== firstHeading) {
      return pageTitleCandidate;
    }

    return firstHeading;
  });
})();
