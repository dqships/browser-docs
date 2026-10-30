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

## Copy History Tests

Run the unit tests first:

```sh
node --test shared/history/*.test.js popup/history/*.test.js
```

They cover the entry shape, dedupe (same URL and identical Markdown moves to
the top), the 100-entry cap, the http(s)-only rule for **Visit site**, and the
relative time labels.

Recording:

1. Open the popup, then **History**. With nothing saved, the empty state reads
   "Nothing here yet."
2. Copy a page from the popup, another from the context menu, and another with
   `Alt+Shift+M`. Reopen **History** and confirm all three are listed, newest
   first, each with title, hostname, relative time ("Just now"), and word
   count.
3. Copy the first page again without changes. Confirm it moves to the top and
   is not listed twice. Change a setting that alters the Markdown (for example
   **Include frontmatter**) and copy it again: it is listed as a new entry.
4. Use **Download .md** on the main view, the context menu, and the download
   shortcut. Confirm downloads are not added to the history.

Row actions:

- **Copy again** puts the saved Markdown on the clipboard and shows "Markdown
  copied to the clipboard." It does not add or move a history entry.
- **Download .md** saves the saved Markdown as `<title-slug>.md` and shows
  "Saved <filename>."
- **Visit site** opens the source page in a new tab. It is disabled for entries
  without an http(s) address.
- **Delete** removes only that row and keeps keyboard focus in the list.
- **Clear all** turns into "Clear all? Yes / Cancel". **Cancel** (or `Escape`)
  keeps everything; **Yes** empties the list and shows "History cleared."

Setting:

1. In **Settings**, turn off **Save copy history**. Copy a page. Confirm it is
   not added, and the existing entries are still listed under a note that
   history is off.
2. Turn it back on and confirm new copies are recorded again.
3. Confirm the setting also appears on the options page and stays in sync.

Layout and safety:

- At the popup's 360px width, the four row buttons fit on one line, long
  titles clamp to two lines, and the list scrolls inside the popup while the
  status line stays visible.
- A page whose title contains HTML (for example `<img src=x onerror=alert(1)>`)
  shows the text literally.
- Fill the history past 100 copies and confirm only the newest 100 are kept.

Results so far (Playwright Chromium, built `dist/chrome`, 2026-10-30):

- Two copies and one download recorded through `recordMarkdownAction` at the
  same time saved exactly the two copies. Five copies recorded at the same time
  from two extension pages all landed (no lost writes).
- Re-copying the same URL with identical Markdown moved the entry to the top
  (6 entries before and after).
- Copy again, Download .md (`img-src-x-onerror-alert-1-tricky-title.md`),
  Visit site, Delete, and Clear all with Cancel and Yes all behaved as above.
  An HTML title rendered as text and its `javascript:` URL left **Visit site**
  disabled. No horizontal scroll at 360px.
- With the setting off, a copy was not recorded and the empty state explained
  why.
- Screenshots: `docs/testing/screenshots/copy-history/`.
- Not yet checked: the real context menu and keyboard shortcut paths (driven
  through the same hook in the test), Firefox, and Safari.

## Failure Tests

- Browser internal pages should fail gracefully.
- Empty or highly interactive pages should show a useful error.
- Copy failures should surface a visible failure state rather than silent success.
