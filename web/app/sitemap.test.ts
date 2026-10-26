import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("covers the home page, blog index, and seeded blog posts", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://web-markdown.com/");
    expect(urls).toContain("https://web-markdown.com/blog");
    expect(urls).toContain(
      "https://web-markdown.com/blog/what-webtomarkdown-is-for",
    );
  });
});
