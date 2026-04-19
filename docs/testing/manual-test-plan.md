# Manual Test Plan

## Smoke Tests

1. Load the unpacked extension in a Chromium browser.
2. Open a docs page with a clear `article` or `main` container.
3. Click the popup action.
4. Confirm:
   - success status renders
   - clipboard contains Markdown
   - preview text looks structured

## Context Menu Tests

1. Open a documentation page.
2. Right-click and trigger the page context-menu action.
3. Confirm:
   - a visible success toast appears on the page
   - pasted clipboard content is Markdown

## Content Quality Tests

Validate on at least one page that includes each of the following:

- headings and paragraphs
- nested lists
- fenced code blocks
- links
- tables
- images

## Settings Tests

1. Open the options page.
2. Toggle each setting and save.
3. Re-run extraction.
4. Confirm the output changes in the expected way.

## Failure Tests

- Browser internal pages should fail gracefully.
- Empty or highly interactive pages should show a useful error.
- Copy failures should surface a visible failure state rather than silent success.
