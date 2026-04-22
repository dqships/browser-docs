# Content Extraction Pipeline

## Pipeline Stages

1. Candidate discovery
   Search common readable-content containers such as `article`, `main`, `role=main`, markdown render roots, and known content wrappers.
2. Candidate scoring
   Prefer containers with meaningful text length, headings, paragraphs, code blocks, lists, and tables.
3. DOM cloning
   Clone the selected subtree so cleanup never mutates the live page.
4. Sanitization
   Remove obvious noise elements, hash-link anchors, controls, dialogs, cookie banners, nav, sidebars, and empty wrappers.
5. Markdown serialization
   Walk the cleaned subtree and emit structured Markdown for block and inline content.
6. Finalization
   Add optional frontmatter, title heading, source URL, and final whitespace normalization.

## Heuristics

The extractor is optimized for readable pages with a clear main content area. Documentation pages are a strong fit, but not the only fit.

Signals that increase confidence:

- multiple headings
- code blocks
- long-form paragraph content
- lists and tables
- containers named like `content`, `docs`, `markdown`, or `article`

Signals that reduce confidence:

- nav-like class names
- sidebar or table-of-contents patterns
- footer and feedback modules
- dialog, toolbar, or form-heavy wrappers

## Markdown Rules

- Headings become ATX headings.
- Paragraphs stay paragraph-based.
- Links resolve to absolute URLs.
- Inline code uses backticks.
- Code blocks use fenced code blocks with best-effort language detection.
- Tables use pipe tables.
- Lists preserve nesting.
- Images emit Markdown image syntax with absolute URLs when possible.

## Failure Modes

- Some JS-heavy apps may render late or split content across shadow roots.
- Complex layout tables may degrade into simplified pipe tables.
- Custom widgets may serialize as plain text rather than perfect Markdown.

The implementation goal is predictable usefulness, not full-fidelity HTML round-tripping.
