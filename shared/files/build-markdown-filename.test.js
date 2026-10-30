import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMarkdownFilename } from "./build-markdown-filename.js";

test("slugs the title into kebab-case", () => {
  assert.equal(
    buildMarkdownFilename({ title: "Getting Started | Vite", url: "https://vite.dev/guide/" }),
    "getting-started-vite.md"
  );
});

test("removes characters that Windows and macOS reject", () => {
  assert.equal(
    buildMarkdownFilename({ title: 'a<b>c:d"e/f\\g|h?i*j', url: "" }),
    "a-b-c-d-e-f-g-h-i-j.md"
  );
});

test("strips accents and keeps non-Latin letters", () => {
  assert.equal(buildMarkdownFilename({ title: "Café Guide" }), "cafe-guide.md");
  assert.equal(buildMarkdownFilename({ title: "入門ガイド" }), "入門ガイド.md");
});

test("falls back to hostname and path when the title is empty", () => {
  assert.equal(
    buildMarkdownFilename({ title: "  ", url: "https://www.example.com/docs/intro?x=1" }),
    "example-com-docs-intro.md"
  );
});

test("falls back to page.md when nothing usable is given", () => {
  assert.equal(buildMarkdownFilename({ title: "!!!", url: "not a url" }), "page.md");
  assert.equal(buildMarkdownFilename(), "page.md");
});

test("caps the name at 80 characters without a trailing dash", () => {
  const filename = buildMarkdownFilename({ title: "word ".repeat(40) });
  assert.ok(filename.length <= 80, `${filename.length} > 80`);
  assert.ok(filename.endsWith(".md"));
  assert.ok(!filename.endsWith("-.md"));
});

test("avoids Windows reserved names", () => {
  assert.equal(buildMarkdownFilename({ title: "CON" }), "con-page.md");
});
