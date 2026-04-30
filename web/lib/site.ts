const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "http://localhost:3000";

function normalizePathname(pathname = "/") {
  if (!pathname) {
    return "/";
  }

  let normalized = pathname.trim();

  try {
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      normalized = new URL(normalized).pathname;
    }
  } catch {
    normalized = pathname;
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized || "/";
}

export const site = {
  name: "WebToMarkdown",
  url: configuredSiteUrl.replace(/\/$/, ""),
  publisherName: "dqstartupbuild",
  supportEmail: "support@followusai.com",
  supportXHandle: "@dqstartupbuild",
  supportXUrl: "https://x.com/dqstartupbuild",
  defaultTitle: "WebToMarkdown",
  defaultDescription:
    "Copy readable web pages as clean Markdown with a lightweight browser extension that works locally and keeps headings, lists, code blocks, and tables intact.",
  keywords: [
    "web page to markdown",
    "copy web page as markdown",
    "readable web content to markdown",
    "markdown browser extension",
    "copy article as markdown",
  ] as string[],
  ctaLabel: "Get Extension",
  downloadTargets: {
    chrome: {
      browserLabel: "Chrome",
      ctaLabel: "Add to Chrome",
      url: "https://chromewebstore.google.com/detail/webtomarkdown/gaglchmlnkelnokjkilcbkggfdembeem",
    },
    safari: {
      browserLabel: "Safari",
      ctaLabel: "Download for Safari",
      url: "https://apps.apple.com/us/app/webtomarkdown/id6762680685?mt=12",
    },
  },
  staticPages: [
    {
      pathname: "/",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      pathname: "/blog",
      changeFrequency: "weekly" as const,
      priority: 0.88,
    },
    {
      pathname: "/privacy",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      pathname: "/support",
      changeFrequency: "yearly" as const,
      priority: 0.32,
    },
    {
      pathname: "/terms",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ],
};

export function createCanonicalUrl(pathname = "/") {
  return new URL(normalizePathname(pathname), `${site.url}/`).toString();
}

export function createOgAssetPath(pathname = "/") {
  const normalized = normalizePathname(pathname);
  return normalized === "/" ? "/og/default.png" : `/og${normalized}.png`;
}

export function createOgImageUrl(pathname = "/") {
  return createCanonicalUrl(createOgAssetPath(pathname));
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.defaultDescription,
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.publisherName,
    url: site.url,
    description: site.defaultDescription,
  };
}
