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

## Rate and Share Prompt Tests

Use a fresh profile (or clear `engagementPrompts` from the extension's
`storage.local`). A "success" is any successful copy or download from the
popup, the context menu, or the shortcut. Failed copies do not count.

Review card schedule:

1. Successes 1 and 2: no card.
2. Success 3: the review card appears above the footer with
   `Rate WebToMarkdown` and `Not now`, and no `I already did`.
3. Close the popup without answering, reopen it: the card is still there.
   Restart the browser and reopen: still there.
4. Do a copy from the context menu: the card is still the review card, and in
   Chrome the popup opens on its own. If the browser refuses to open it, the
   card is there the next time you open the popup.
5. Click `Not now`: the card goes away.
6. Successes 4 and 5: no card.

Share card:

7. Success 6: the share card appears (`Copy link`, `Not now`). The review card
   does not appear on the same success.
8. Leave it unanswered through success 8: the share card stays and the review
   card does not replace it.
9. Click `Copy link`: the status line reads `Link copied.` and the clipboard
   holds the Chrome Web Store listing. The share card never comes back.
10. Success 9: the review card returns, now with `I already did`.
11. Click `Not now`, then do 5 more successes: the review card returns on the
    5th (success 14).
12. Click `Rate WebToMarkdown`: the Chrome Web Store reviews page opens in a new
    tab. Do 20 more successes: no card ever appears.

Other paths:

- Fresh profile, success 3, `Not now`, then click footer `Rate` before success
  6: the review page opens and the review card never returns. The next success
  shows the share card.
- Fresh profile, success 3, `Rate WebToMarkdown`: success 4 shows the share
  card.
- `I already did` (from the second showing on) ends the review card for good,
  the same as rating.
- Footer `Share` copies the listing link, shows `Link copied.`, and stops the
  share card from appearing later.
- Firefox and Safari: `Rate` opens https://web-markdown.com and `Share` copies
  it, until their store listings are added to
  `shared/constants/store-links.js`.
- Only one card is ever visible.

The schedule logic is also covered by `node --test shared/` (see
`shared/engagement/advance-prompt-schedule.test.js`).

## Failure Tests

- Browser internal pages should fail gracefully.
- Empty or highly interactive pages should show a useful error.
- Copy failures should surface a visible failure state rather than silent success.
