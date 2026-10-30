# Chrome Web Store Listing

The text for the WebToMarkdown listing in the Chrome Web Store dashboard. Keep
it in sync with what the extension does. The store doesn't read this file, so
paste changes into the dashboard by hand when you upload a new version.

## Summary

The store takes the summary from the `description` field in `manifest.json`
(132 characters at most). For 1.2.0 it reads:

> Copy or download the current page as clean Markdown.

## Description

Paste everything between the lines into the dashboard's **Description** field.
It's plain text: the dashboard shows the `*` bullets as typed.

---

WebToMarkdown turns the page you're reading into clean Markdown. Copy it to your clipboard or save it as a .md file in one click.

Docs sites, articles, and release notes are full of navigation, sidebars, cookie prompts, and "Was this helpful?" widgets. WebToMarkdown keeps the readable part and drops the rest, so what you paste into your notes, your README, or an AI chat is just the content.

What it keeps:
* Headings, paragraphs, and emphasis
* Lists and links
* Code blocks, with their language
* Tables, as Markdown pipe tables

Three ways to use it:
* Toolbar popup: press Copy Current Page or Download .md. You get a word count and a preview of the result.
* Right-click menu: Copy page as Markdown, or Download page as Markdown.
* Keyboard shortcut: Alt+Shift+M (Option+Shift+M on Mac) copies the page. You can add a shortcut for downloads in Chrome's extension shortcut settings.

New in 1.2:
* Download as .md: save the page as a Markdown file named after the page title.
* Copy history: every page you copy is listed in the popup. Copy it again, download it, open the source page, or delete it. History stays on your device, and you can turn it off.
* Settings in the popup: change them without leaving the page.

Settings (all on by default):
* Aggressive pruning of sidebars, toolbars, and similar chrome
* YAML frontmatter with title, source URL, and capture time
* A title heading and a source link line
* Table conversion
* Save copy history

Private by design:
* No account and nothing to sign in to.
* Pages are converted inside your browser. Nothing is uploaded, and there is no WebToMarkdown server.
* Settings and copy history are kept in Chrome's own extension storage on your device.

WebToMarkdown is open source under the MIT License.

---

## Privacy practices tab

Permissions are unchanged in 1.2.0 (`activeTab`, `clipboardWrite`,
`contextMenus`, `scripting`, `storage`), so the existing permission
justifications still apply.

Copy history stores page content in `chrome.storage.local`, on the device only.
It is never sent anywhere, so the "not collected" data disclosure still holds.
If the dashboard asks, here is a justification for the `storage` permission:

> Stores the user's settings and, when copy history is on, the pages they
> copied, locally on their device so they can copy or download them again.
> Nothing is transmitted off the device.
