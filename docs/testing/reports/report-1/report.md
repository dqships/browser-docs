# Report 1: Manual Test Plan Validation

## Scope

This report validates the browser extension against the scenarios defined in
[`docs/testing/manual-test-plan.md`](../../manual-test-plan.md).

## Environment

- Date: 2026-04-18
- Host: macOS
- Browser automation runtime: Playwright with bundled Chromium
- Target extension source: repository root
- Fixture server: local `python3 -m http.server` on `http://127.0.0.1:8123`

## Methodology Notes

Two execution modes were required.

1. **Source build, as shipped**
   The raw extension was loaded directly from the repository root.

2. **Test-only automation build**
   A temporary copy of the extension was created during the run with:
   - `host_permissions` for `http://127.0.0.1:8123/*`
   - a service-worker test hook exposing the existing background handler

This second mode was necessary because Chromium automation cannot faithfully
simulate the native browser-action or native context-menu gestures that grant
`activeTab`. The extension code under test remained the same, but the temporary
manifest and service-worker hook removed browser-UI limitations that would
otherwise block deterministic automation.

## Artifacts

- Raw results: [`artifacts/results.json`](./artifacts/results.json)
- Automation harness: [`artifacts/run-extension-report.js`](./artifacts/run-extension-report.js)
- Fixture pages: [`fixtures/`](./fixtures/)

## Result Matrix

| Scenario | Outcome | Notes |
| --- | --- | --- |
| Popup smoke test on docs fixture | Fail | Direct popup invocation could not access page contents because the automation path did not receive a native `activeTab` grant. |
| Context menu copy flow | Pass | Verified on the test-only automation build. Toast appeared and Markdown reached the clipboard. |
| Settings flow | Pass | Verified on the test-only automation build. Output changed when frontmatter, source link, title insertion, and tables were disabled. |
| Restricted browser page failure | Pass | `chrome://version` produced a visible error: `Cannot access a chrome:// URL`. |
| Empty or highly interactive page failure | Fail | The extension copied meaningless Markdown instead of rejecting the page. |
| Clipboard failure visibility | Fail | Forced clipboard failure still reported success while the clipboard remained unchanged. |

## Screenshots

- Popup smoke failure: [`01-popup-success.png`](./screenshots/01-popup-success.png)
- Context menu toast: [`02-context-menu-toast.png`](./screenshots/02-context-menu-toast.png)
- Updated settings UI: [`03-options-updated.png`](./screenshots/03-options-updated.png)
- Popup after settings changes: [`04-popup-after-settings.png`](./screenshots/04-popup-after-settings.png)
- Restricted page failure: [`05-internal-page-failure.png`](./screenshots/05-internal-page-failure.png)
- Empty page failure-path result: [`06-empty-page-result.png`](./screenshots/06-empty-page-result.png)
- Clipboard failure-path result: [`07-clipboard-failure-result.png`](./screenshots/07-clipboard-failure-result.png)

## What Passed

### Content quality on the docs fixture

On the test-only automation build, the extracted Markdown preserved:

- headings and paragraphs
- nested lists
- fenced code blocks
- links
- tables
- images

The exported Markdown also removed obvious chrome from the fixture page, such as
the cookie banner and the feedback block.

### Settings behavior

The settings page saved correctly and changed output as expected:

- disabling frontmatter removed the YAML header
- disabling source link removed the `Source:` line
- disabling title insertion removed the synthetic top heading on the titleless fixture
- disabling table preservation removed the Markdown pipe table on the rich docs fixture

### Restricted-page handling

On `chrome://version`, the popup showed a visible error instead of a false
success state.

## Findings

### 1. Empty pages are treated as successful exports

The manual plan expects empty or highly interactive pages to fail with a useful
error. Current behavior is the opposite: the extension falls back to `document.body`,
builds frontmatter from the page title, and copies thin UI text as Markdown.

Observed output began with:

```md
---
capturedAt: "2026-04-19T01:18:48.572Z"
source: "http://127.0.0.1:8123/docs/testing/reports/report-1/fixtures/empty-page.html"
title: "Interactive Shell"
---
```

Likely code paths involved:

- [`content/dom/find-primary-container.js`](/Users/starship/Documents/GitHub/browser-docs/content/dom/find-primary-container.js)
- [`content/application/extract-page.js`](/Users/starship/Documents/GitHub/browser-docs/content/application/extract-page.js)

### 2. Clipboard failure is reported as success

The manual plan expects copy failures to surface visibly. In the forced failure
test, the popup still showed `Markdown copied to the clipboard.` while the
clipboard value stayed at `sentinel-value`.

This strongly suggests the popup fallback path treats `document.execCommand("copy")`
as success without checking its return value.

Likely code path:

- [`popup/copy-text.js`](/Users/starship/Documents/GitHub/browser-docs/popup/copy-text.js)

### 3. As-shipped popup flow is not automation-friendly

When the popup page is opened directly as a URL, the extension cannot access the
page and shows:

`Cannot access contents of the page. Extension manifest must request permission to access the respective host.`

This is expected from the browser permission model, because direct popup
navigation is not equivalent to a real browser-action click. It is an automation
constraint rather than conclusive proof that the real browser-action flow is
broken for human users. That is why the remaining functional coverage used the
test-only automation build.

## Conclusion

The extraction pipeline, background copy path, settings behavior, and restricted
page handling all behaved correctly once browser-UI permission mechanics were
removed from the automation path.

Two product issues remain open from this run:

1. pages without meaningful readable content are accepted instead of rejected
2. clipboard failures are silently reported as success

In addition, the true browser-action popup flow still needs one manual check in
real Chrome because `activeTab` cannot be granted through direct popup URL
automation alone.
