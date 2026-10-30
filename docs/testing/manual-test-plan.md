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

## Download Tests

Run `node --test shared/files/build-markdown-filename.test.js` first. It checks
the file name rules (kebab-case title, illegal characters removed, URL
fallback, 80-character cap, Windows reserved names).

Popup:

1. Open a documentation page and open the popup.
2. Click **Download .md**.
3. Confirm:
   - a `.md` file is saved, named after the page title (for example
     `Getting Started | Vite` saves `getting-started-vite.md`)
   - the status reads `Saved <filename>.` and the word count, character count,
     and preview match the copy flow
   - the file contents match what **Copy Current Page** puts on the clipboard

Context menu:

1. Right-click the page and choose **Download page as Markdown**.
2. Confirm a `.md` file is saved and the page toast reads `Saved <filename>.`
3. Confirm **Copy page as Markdown** still copies, and does not download.

Keyboard command:

1. Open `chrome://extensions/shortcuts` (Firefox: Add-ons > gear menu >
   Manage Extension Shortcuts) and assign a key to **Download as Markdown**.
   It ships with no default key.
2. Press it on a documentation page.
3. Confirm a `.md` file is saved and the toast reads
   `Saved <filename> via shortcut.`
4. Confirm `Alt+Shift+M` still copies, and does not download.

Strict CSP and browsers:

- Repeat the context menu and shortcut checks on a page with a strict Content
  Security Policy, such as github.com. The download runs from the injected
  content script, so the page's CSP should not block it.
- Repeat all three entry points in Firefox and Safari.
- On restricted pages (`chrome://`, the Chrome Web Store), the context menu and
  shortcut should do nothing or show an error, never a broken file.

Results so far (Playwright Chromium, built `dist/chrome`, 2026-10-30):

- Popup button: saved `getting-started.md` with the same Markdown as the
  preview, status `Saved getting-started.md.`
- In-page download (the context menu and shortcut path), on a local page served
  with `default-src 'none'; script-src 'none'`: saved
  `getting-started-vite.md`, contents identical to the extraction, toast shown.
- `download_markdown` is registered with no default shortcut.
- Not yet checked: the real github.com (the test sandbox could not reach it),
  Firefox, and Safari. These need a manual run.

## Failure Tests

- Browser internal pages should fail gracefully.
- Empty or highly interactive pages should show a useful error.
- Copy failures should surface a visible failure state rather than silent success.
