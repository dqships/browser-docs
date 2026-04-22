# Product Requirements

## Goal

Let a user visit a readable web page, trigger the extension, and immediately get a clean Markdown copy of the page content.

## Primary Use Cases

1. Copy a docs page, article, or reference page into notes or a local knowledge base.
2. Copy an article, release note, or reference page into notes or a local knowledge base.
3. Feed readable page content into an LLM prompt or a local RAG workflow.
4. Save a readable Markdown snapshot when the source site offers no native export.

## Core User Experience

1. The user opens any page.
2. The user clicks the extension popup or uses the page context menu.
3. The extension extracts the primary content area, converts it to Markdown, and copies it.
4. The user gets visible success or failure feedback.

## Functional Requirements

- Extract the most likely readable-content container instead of copying the entire page chrome.
- Remove obvious noise such as nav, sidebars, cookie banners, feedback widgets, and footer controls.
- Preserve important structure:
  - headings
  - paragraphs
  - lists
  - links
  - images
  - blockquotes
  - code blocks
  - tables
- Support lightweight settings for metadata and formatting behavior.
- Provide a popup flow and a context-menu flow.

## Non-Goals

- Perfect semantic conversion for every website.
- Crawling entire sites.
- Server-side processing.
- Dependency-heavy build tooling for the initial version.

## Success Criteria

- Works on readable page layouts built with `article`, `main`, or markdown-rendered HTML.
- Produces Markdown that is immediately usable without hand-cleaning in the common case.
- Keeps permissions lean enough to feel trustworthy.
- Remains easy to extend with site-specific heuristics later.
