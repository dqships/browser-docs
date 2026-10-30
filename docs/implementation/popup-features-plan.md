# Popup Features Plan: Settings, Downloads, Copy History, Rate and Share

Four features ship together in one release. Each is built in its own thread and
branch, and each branch merges into the integration branch
`claude/settings-clipboard-features-dr8atx`. Only the integration branch gets a
pull request into `main`.

This file is the shared contract. If your thread needs to change a contract
below, update this file in the same PR and say so in the PR description.

## Branches and order

| Thread | Branch | Starts from | Merges into |
| --- | --- | --- | --- |
| T1 Settings in popup | `claude/popup-settings-view` | integration | integration |
| T2 Download as .md | `claude/download-markdown` | integration | integration |
| T3 Copy history | `claude/copy-history` | integration after T1 and T2 | integration |
| T4 Rate and share | `claude/rate-share-prompts` | integration after T1 and T2 | integration |

- **Wave 1:** T1 and T2 run in parallel. T1 merges first. T2 then rebases onto
  the integration branch before it merges.
- **Wave 2:** T3 and T4 start once T1 and T2 are merged. T3 merges first. T4
  then rebases onto the integration branch before it merges.
- Every PR targets `claude/settings-clipboard-features-dr8atx`, never `main`.
- The coordinating session merges each PR into the integration branch and opens
  the final PR into `main`.

## Ground rules (from AGENTS.md)

- One function or component per file, `kebab-case.js` names.
- Keep DOM rendering, event wiring, storage, and `browser.*` calls in separate
  files.
- Use the `browser.*` API through the bundled polyfill, not `chrome.*`.
- No new manifest permissions unless the plan below says so. In particular,
  do **not** add `downloads` (Safari does not support it and it adds an install
  warning).
- The Safari service worker bundler (`scripts/build-safari-service-worker-bundle.mjs`)
  only understands single-line `import { a, b } from "./relative.js";`,
  side-effect imports, and `export function`, `export async function`,
  `export const|let|var`. No `export default`, no multi-line imports, no
  re-exports in anything the service worker imports.
- Before opening a PR: run `node --check` on every changed `.js` file and run
  `node build.mjs` so the Safari bundle is proven to build.
- Add your feature's checks to `docs/testing/manual-test-plan.md` under its own
  `##` heading.
- Popup and options pages follow `DESIGN.md` and `shared/styles/tokens.css`:
  flat, ink borders, no shadows, no pills, no emoji.

## Shared contracts

### 1. The action hook (already on the integration branch)

`shared/actions/record-markdown-action.js` exports
`recordMarkdownAction({ kind, source, result })`.

- `kind`: `"copy"` or `"download"`.
- `source`: `"popup"`, `"context-menu"`, or `"shortcut"`.
- `result`: the extraction result `{ markdown, meta: { title, url, ... }, stats: { wordCount, charCount } }`.

It is called after every successful copy (popup, context menu, shortcut) and,
once T2 lands, every successful download. It is **not** called when a user
re-copies or re-downloads an item from the history view.

T3 and T4 each add one awaited call inside this function, each wrapped in its
own `try/catch`. Nothing else should call history or prompt code directly from
the copy and download paths.

`copyMarkdownInPage` now returns `true` only when the in-page copy succeeded,
so background handlers only record real copies.

### 2. Popup layout (owned by T1)

T1 turns the popup into views inside one `popup.html`:

```html
<main class="popup-shell">
  <header class="masthead">…</header>
  <div class="popup-views">
    <section class="popup-view" data-view="main">…existing hero, actions, status, result…</section>
    <section class="popup-view" data-view="settings" hidden>…</section>
    <!-- T3 adds data-view="history" -->
  </div>
  <div id="prompt-slot" class="prompt-slot"></div>   <!-- T4 renders cards here -->
  <nav class="popup-footer" aria-label="More">
    <button type="button" data-open-view="settings">Settings</button>
    <!-- T3 adds History, T4 adds Rate and Share -->
  </nav>
</main>
```

- `popup/views/show-view.js` exports `showView(name)`. It unhides
  `[data-view="name"]`, hides the others, and sets `aria-current` on the
  matching footer button.
- `popup/views/bind-view-buttons.js` wires every `[data-open-view]` button and
  every `[data-back-view]` button (each sub-view has a Back button that returns
  to `main`).
- Each sub-view module exposes `mount<Name>View(sectionElement)`, called once
  from `popup.js`, and refreshes its content when it is shown. `showView`
  dispatches a `popup-view-shown` `CustomEvent` on the section with
  `detail: { view }` so views can refresh without importing each other.
- `showView` also moves focus to the shown view's `[data-view-heading]`
  element (give it `tabindex="-1"`) so keyboard users land in the new view.
  Each sub-view starts with
  `<div class="view-header"><button class="back-button" type="button" data-back-view="main">Back</button><h1 tabindex="-1" data-view-heading>…</h1></div>`.
- The footer stays visible in every view. The prompt slot sits directly above
  the footer, like Vidzilla's card above its bottom buttons.
- Popup width stays 360px. Views scroll inside the popup. Chrome caps a popup
  at 800x600.

### 3. Settings definitions (owned by T1)

- `shared/constants/setting-definitions.js` exports `SETTING_DEFINITIONS`, an
  ordered array of `{ key, label, description }`. It is the single source for
  both the popup settings view and the options page.
- `shared/settings/render-settings-form.js` builds the checkbox list from the
  definitions.
- `shared/settings/fill-settings-form.js` and
  `shared/settings/read-settings-form.js` move values in and out of the form.
- `shared/settings/load-settings-form.js` exports `loadSettingsForm(form)`
  (reads storage, then fills the form), and
  `shared/settings/bind-settings-autosave.js` exports
  `bindSettingsAutosave(form, onResult)`, which saves on every change and
  calls `onResult({ ok, error })`.
- Checkbox row styles live in `shared/styles/settings-form.css`, used by both
  pages.
- Both the popup view and the options page save on change (no Save button) and
  show a short "Saved." status.
- `manifest.json` keeps `options_page` so the browser's own Options link still
  works. The popup no longer calls `openOptionsPage()`.
- New settings (T3's `saveCopyHistory`) are added by appending a definition and
  a default in `shared/constants/default-settings.js`. No markup changes.

### 4. Markdown files (owned by T2)

- `shared/files/build-markdown-filename.js` exports
  `buildMarkdownFilename({ title, url })`: lowercase kebab-case slug of the
  title, falling back to hostname plus path, with characters illegal on
  Windows/macOS removed, capped at 80 characters, ending in `.md`. Example:
  `"Getting Started | Vite"` gives `getting-started-vite.md`.
- `shared/files/download-markdown-file.js` exports
  `downloadMarkdownFile(markdown, filename)` for extension pages (popup):
  a `text/markdown;charset=utf-8` Blob, a temporary `<a download>`, then
  revoke the object URL.
- For the context menu and shortcut, the download runs inside the page (no
  `downloads` permission): a new content module registered as
  `downloadMarkdown`, added to `shared/browser/injection-files.js`, and
  `shared/extraction/download-markdown-in-page.js`, which mirrors
  `copy-markdown-in-page.js`, shows a toast, and returns `true` on success.
- T3 reuses `buildMarkdownFilename` and `downloadMarkdownFile` for its
  "Download .md" action.

### 5. Storage keys

| Key | Area | Owner | Shape |
| --- | --- | --- | --- |
| existing settings keys | `storage.sync` | T1 | see `default-settings.js` |
| `saveCopyHistory` | `storage.sync` | T3 | boolean, default `true` |
| `copyHistory` | `storage.local` | T3 | array of history entries, newest first |
| `engagementPrompts` | `storage.local` | T4 | prompt schedule state |

## T1: Settings inside the popup

Goal: the Settings button opens a settings view inside the popup instead of a
new tab.

- Build the view structure, footer, prompt slot, and settings definitions above.
- Move the settings form logic out of `options/options.js` into
  `shared/settings/`, and use it in both the popup view and the options page.
- Settings view: heading, the checkbox list, the shortcut hint the options page
  shows, a status line, and a Back button.
- Keep `options/options.html` working as a standalone page.

Done when: Settings opens in the popup, toggles save on change and persist,
Back returns to the main view, and the options page still works from
`chrome://extensions`.

## T2: Download as .md

Goal: users can save the page as a `.md` file as well as copying it.

- Popup: a "Download .md" button next to "Copy Current Page". On success, show
  the same stats and preview the copy flow shows, with the status
  "Saved <filename>."
- Context menu: a second item, "Download page as Markdown". Update
  `background/bootstrap-context-menu.js` and the click handler so each item has
  its own id and handler file.
- Keyboard: add a `download_markdown` command to `manifest.json` with **no**
  `suggested_key` (users assign it in the browser's shortcut settings), and a
  handler next to `handle-command.js`.
- Build the file helpers in contract 4.
- Call `recordMarkdownAction({ kind: "download", source, result })` after every
  successful download.
- Check that the in-page download works on a page with a strict CSP (for
  example github.com) and in Firefox. Note results in the test plan.

Done when: all three entry points save a correctly named `.md` file with the
same Markdown the copy flow produces.

## T3: Copy history

Goal: a browsable history of everything copied through the extension.

- `copyHistory` entry shape:
  `{ id, title, url, markdown, wordCount, charCount, copiedAt }`
  (`id` from `crypto.randomUUID()`, `copiedAt` as an ISO string).
- Record copies only (`kind === "copy"`), from all three sources, through the
  action hook. Skip when `saveCopyHistory` is off.
- Keep the newest 100 entries. If the same URL is copied again with identical
  Markdown, move the old entry to the top instead of adding a duplicate.
- Repository files under `shared/history/` (read, add, remove one, clear all),
  one function per file.
- Popup "History" view, opened from a footer button: newest first, each row
  shows title, hostname, relative time, and word count. Row actions: Copy
  again, Download .md (T2's helpers), Visit site (`browser.tabs.create`),
  Delete. A "Clear all" button with a confirm step. An empty state when there
  is nothing yet.
- Add the `saveCopyHistory` setting ("Save copy history: keep a local list of
  pages you copy so you can copy or download them again.") through T1's
  definitions. Turning it off does not delete existing history; say so in the
  description, and the History view offers Clear all.
- Update the privacy page (`web/app/(content)/privacy/page.tsx`) to say copied
  Markdown is stored locally in the browser when history is on, and never
  leaves the device.

Done when: copies from the popup, context menu, and shortcut all appear, and
every row action works.

## T4: Rate and share prompts

Goal: the same review and share flow as Vidzilla, minus ads. A "success" is any
successful copy or download recorded through the action hook.

Review prompt:

- First shows after the 3rd success, as a card in `#prompt-slot`.
- If the success came from the context menu or shortcut, try
  `browser.action.openPopup()` so the card is seen. It is not supported
  everywhere, so feature-check it and catch errors. If it fails, the card waits
  for the next time the popup opens.
- **Rate WebToMarkdown** opens the review page in a new tab and stops the
  prompt for good. The browser cannot tell whether a review was posted, so the
  click counts as done.
- **Not now** hides the card until 5 more successes, and the prompt repeats on
  that schedule until the user rates.
- **I already did** appears on every showing except the first and stops the
  prompt for good.
- If the popup closes without an answer, the card is still there the next time
  the popup opens, and the popup is opened again after the next success.

Share prompt:

- Shows once, on the 6th success, or on the first success after the review
  prompt is answered for good, whichever comes first. It never shows while the
  review card is waiting for an answer, and never on the same success that
  brings up the review card.
- **Copy link** copies the store link. **Not now** dismisses it. Either way it
  never comes back.

Always available:

- **Rate** and **Share** buttons in the popup footer, next to Settings and
  History. Share copies the store link and shows "Link copied." in the status
  line.

Implementation notes:

- `shared/constants/store-links.js` holds the Chrome listing
  `https://chromewebstore.google.com/detail/webtomarkdown/gaglchmlnkelnokjkilcbkggfdembeem`
  and its review page (`…/reviews`). Firefox and Safari have no live listing
  yet, so on those browsers fall back to `https://web-markdown.com` for both
  links and leave clearly named constants to fill in later.
- Keep the schedule logic pure in its own file
  (`shared/engagement/advance-prompt-schedule.js` taking state and returning
  the next state) so it is easy to check with a small `.test.js` file run by
  `node --test`.
- Only one card shows at a time.

Done when: the schedule above plays out exactly on a fresh profile, including
across popup closes and browser restarts.
