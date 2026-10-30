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
2. Toggle each setting. There is no Save button; each change saves at once.
3. Re-run extraction.
4. Confirm the output changes in the expected way.

## Popup Settings View Tests

1. Reload the unpacked extension and open the popup.
2. Confirm the main view shows the headline, **Copy Current Page**, and the
   status line, with a footer below holding a **Settings** button.
3. Click **Settings** in the footer. Confirm:
   - the settings view replaces the main view inside the popup (no new tab)
   - the footer stays visible and **Settings** shows the red marker
   - the view shows the heading, intro, Mac and Windows shortcut hint, all
     five checkboxes, and the status line "Changes save as you go."
   - the checkboxes match the stored settings
4. Toggle a setting. Confirm the status line reads "Saved." right away.
5. Close and reopen the popup, open Settings, and confirm the change stuck.
6. Click **Back**. Confirm the main view returns and the footer marker clears.
7. Copy a page and confirm the output reflects the changed setting.
8. Open the options page from `chrome://extensions` (Details, Extension
   options). Confirm it shows the same list, saves on change with "Saved.",
   and that a change made there appears the next time the popup settings view
   opens.
9. Scroll: with a long preview in the main view, or with the settings list,
   confirm the view scrolls between the masthead and footer and the popup never
   grows past 600px tall.
10. Keyboard: Tab to the footer **Settings** button and press Enter, toggle a
    checkbox with Space, then Tab to **Back** and press Enter. Focus should
    land on the view heading each time.

Screenshots from a headless Chromium run of `dist/chrome`:
`docs/testing/screenshots/popup-main-view.png` and
`docs/testing/screenshots/popup-settings-view.png`.

## Failure Tests

- Browser internal pages should fail gracefully.
- Empty or highly interactive pages should show a useful error.
- Copy failures should surface a visible failure state rather than silent success.
