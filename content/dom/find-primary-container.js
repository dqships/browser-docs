(() => {
  const app = globalThis.WebToMarkdownContent;
  const selectors = app.require("PRIMARY_CONTAINER_SELECTORS");
  const getTextContent = app.require("getTextContent");
  const isNoiseElement = app.require("isNoiseElement");

  function scoreCandidate(element, selector) {
    if (!(element instanceof Element) || isNoiseElement(element, true)) {
      return Number.NEGATIVE_INFINITY;
    }

    const textLength = getTextContent(element).length;
    if (textLength < 120) {
      return Number.NEGATIVE_INFINITY;
    }

    const headingCount = element.querySelectorAll("h1, h2, h3").length;
    const paragraphCount = element.querySelectorAll("p").length;
    const codeCount = element.querySelectorAll("pre, code").length;
    const listCount = element.querySelectorAll("ul, ol").length;
    const tableCount = element.querySelectorAll("table").length;
    const hasArticleTag = element.tagName.toLowerCase() === "article";
    const hasMainTag = element.tagName.toLowerCase() === "main";
    const selectorBonus =
      (selector.includes("article") ? 1200 : 0) +
      (selector.includes("main") ? 1000 : 0) +
      (selector.includes("markdown") ? 600 : 0) +
      (selector.includes("docs") ? 600 : 0);

    const bodyPenalty = element === document.body ? 3000 : 0;

    return (
      textLength +
      headingCount * 250 +
      paragraphCount * 90 +
      codeCount * 180 +
      listCount * 60 +
      tableCount * 100 +
      (hasArticleTag ? 600 : 0) +
      (hasMainTag ? 500 : 0) +
      selectorBonus -
      bodyPenalty
    );
  }

  app.register("findPrimaryContainer", () => {
    const seen = new Set();
    const candidates = [];

    for (const selector of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        if (seen.has(element)) {
          continue;
        }

        seen.add(element);
        const score = scoreCandidate(element, selector);
        if (Number.isFinite(score)) {
          candidates.push({ element, score, selector });
        }
      }
    }

    if (!candidates.length) {
      return {
        element: document.body,
        reason: "fallback-body"
      };
    }

    candidates.sort((left, right) => right.score - left.score);

    return {
      element: candidates[0].element,
      reason: candidates[0].selector
    };
  });
})();
