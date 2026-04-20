(() => {
  const app = globalThis.DocsToMarkdownContent;
  const getTextContent = app.require("getTextContent");
  const isProbablyHidden = app.require("isProbablyHidden");
  const resolveUrl = app.require("resolveUrl");

  const RESOURCE_LABEL_PATTERN =
    /\b(video|watch|demo|tutorial|guide|quickstart|notebook|colab|sample|example|github|repository|console|playground|open in)\b/i;
  const VIDEO_URL_PATTERN =
    /(youtube\.com|youtu\.be|vimeo\.com|loom\.com|wistia\.(?:com|net))/i;
  const SUBSTANTIVE_BLOCK_TAGS = new Set([
    "aside",
    "blockquote",
    "div",
    "ol",
    "p",
    "pre",
    "section",
    "table",
    "ul"
  ]);

  function getAttributeText(element) {
    const values = [];

    for (const name of element.getAttributeNames()) {
      values.push(name, element.getAttribute(name) || "");
    }

    return values.join(" ");
  }

  function isHashLink(element) {
    return (
      element instanceof HTMLAnchorElement &&
      Boolean(element.getAttribute("href")) &&
      element.getAttribute("href").startsWith("#")
    );
  }

  function hasSubstantiveAncestor(element, root) {
    let current = element.parentElement;

    while (current && current !== root) {
      if (
        SUBSTANTIVE_BLOCK_TAGS.has(current.tagName.toLowerCase()) &&
        getTextContent(current).length >= 80
      ) {
        return true;
      }

      current = current.parentElement;
    }

    return false;
  }

  function isLikelyResourceLink(element) {
    if (!(element instanceof HTMLAnchorElement) || isHashLink(element)) {
      return false;
    }

    const href = resolveUrl(element.getAttribute("href") || "");
    const text = getTextContent(element);
    const attributes = getAttributeText(element);

    return Boolean(
      href &&
        (VIDEO_URL_PATTERN.test(href) ||
          RESOURCE_LABEL_PATTERN.test(text) ||
          RESOURCE_LABEL_PATTERN.test(attributes))
    );
  }

  function createLinkResource(element) {
    const href = normalizeResourceUrl(resolveUrl(element.getAttribute("href") || ""));
    if (!href) {
      return null;
    }

    const text = getTextContent(element);
    const label = VIDEO_URL_PATTERN.test(href)
      ? "Video"
      : text || element.getAttribute("aria-label") || element.getAttribute("title") || "Resource";

    return {
      label: label.replace(/\s+/g, " ").trim(),
      url: href
    };
  }

  function createEmbeddedVideoResource(element) {
    const source =
      element.getAttribute("src") ||
      element.getAttribute("data-src") ||
      element.getAttribute("poster") ||
      "";
    const url = normalizeResourceUrl(resolveUrl(source));

    if (!url || !VIDEO_URL_PATTERN.test(url)) {
      return null;
    }

    return {
      label: "Video",
      url
    };
  }

  function normalizeResourceUrl(url) {
    if (!url) {
      return "";
    }

    try {
      const parsed = new URL(url, location.href);

      if (parsed.hostname.endsWith("youtube.com") && parsed.pathname.startsWith("/embed/")) {
        const videoId = parsed.pathname.split("/").filter(Boolean).pop();
        return videoId ? `https://www.youtube.com/watch?v=${videoId}` : parsed.toString();
      }

      if (parsed.hostname === "youtu.be") {
        const videoId = parsed.pathname.split("/").filter(Boolean).pop();
        return videoId ? `https://www.youtube.com/watch?v=${videoId}` : parsed.toString();
      }

      return parsed.toString();
    } catch {
      return url;
    }
  }

  app.register("getLeadingResources", (root) => {
    if (!(root instanceof Element)) {
      return [];
    }

    const titleElement = root.querySelector("h1");
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const resources = [];
    const seenUrls = new Set();
    let started = titleElement === null;
    let substantiveBlockCount = 0;

    while (walker.nextNode()) {
      const element = walker.currentNode;

      if (!(element instanceof Element) || isProbablyHidden(element)) {
        continue;
      }

      if (!started) {
        if (element === titleElement) {
          started = true;
        }
        continue;
      }

      const tagName = element.tagName.toLowerCase();
      if (/^h[2-6]$/.test(tagName)) {
        break;
      }

      if (
        SUBSTANTIVE_BLOCK_TAGS.has(tagName) &&
        getTextContent(element).length >= 80 &&
        !hasSubstantiveAncestor(element, root)
      ) {
        substantiveBlockCount += 1;
        if (substantiveBlockCount > 2) {
          break;
        }
      }

      let resource = null;
      if (isLikelyResourceLink(element)) {
        resource = createLinkResource(element);
      } else if (tagName === "iframe" || tagName === "video") {
        resource = createEmbeddedVideoResource(element);
      }

      if (!resource || seenUrls.has(resource.url)) {
        continue;
      }

      seenUrls.add(resource.url);
      resources.push(resource);

      if (resources.length >= 3) {
        break;
      }
    }

    return resources;
  });
})();
