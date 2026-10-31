# Shipping WebToMarkdown

Everything needed to publish the extension on each store. You need Node 22 or
later. There is no install step: the extension is plain JavaScript.

```sh
git clone https://github.com/dqships/browser-docs.git
cd browser-docs
node build.mjs             # writes dist/chrome, dist/firefox and dist/safari
node scripts/package.mjs   # writes release/webtomarkdown-chrome-<version>.zip
```

The images in this folder are ready to upload. After a UI change, make them
again from the real extension:

```sh
NODE_PATH="$(npm root -g)" node scripts/store-assets.mjs
```

That needs Playwright with Chromium (`npm i -g playwright && npx playwright install chromium`).
It also rewrites the captures in `web/public/source/` and
`store-screenshots-studio/public/source/`. To reword a screenshot without
recapturing, edit its entry in `SHOTS` in `scripts/store-assets.mjs` and add
`--reuse-captures`.

## Where each store stands

| Store | Version | State | Details |
| --- | --- | --- | --- |
| Chrome Web Store | 1.2.0 | Live, confirmed on the public listing on 2026-10-31 | [Below](#2-chrome-web-store) |
| Microsoft Edge Add-ons | None | No listing yet | [Below](#3-microsoft-edge-add-ons) |
| Firefox Add-ons | None | No listing yet | [Below](#4-firefox-add-ons) |
| Mac App Store (Safari) | None live | Pulled from the store, on hold | [Below](#5-mac-app-store-safari) |

`manifest.json` holds the public version for every store.

## Images

| File | Store field |
| --- | --- |
| `screenshot-1.png` … `screenshot-5.png` | Screenshots (1280×800) |
| `promo-small.png` | Small promo tile (440×280) |
| `promo-marquee.png` | Marquee promo tile (1400×560), optional |
| `store-icon-128.png` | Store icon (128×128, 96×96 artwork with transparent padding) |

Screenshots and tiles have no alpha channel. Only the icon is transparent.
`template.html` draws all of them.

## 1. The website

The listing links to the privacy policy, so the site goes live first. It is
already live at `https://web-markdown.com`. To set it up again:

1. On vercel.com, **Add New → Project**, and import `dqships/browser-docs`.
2. Set **Root Directory** to `web`. Vercel reads the rest, including the
   Ignored Build Step, from `web/vercel.json`.
3. Under **Settings → Domains**, add `web-markdown.com` and set the DNS record
   Vercel shows.

To check the deploy:

```sh
curl -sI https://web-markdown.com/                     # 200
curl -sI https://web-markdown.com/privacy              # 200
curl -sI https://web-markdown.com/support              # 200
curl -sI https://web-markdown.com/no-such-page         # 404
curl -s -H "Accept: text/markdown" https://web-markdown.com/   # the page as Markdown
```

## 2. Chrome Web Store

Item ID: `gaglchmlnkelnokjkilcbkggfdembeem`

Listing: <https://chromewebstore.google.com/detail/webtomarkdown/gaglchmlnkelnokjkilcbkggfdembeem>

In the [developer dashboard](https://chrome.google.com/webstore/devconsole),
open the item and upload `release/webtomarkdown-chrome-<version>.zip` under
**Package**. Then fill in the tabs as below. Press **Save draft** after each one.

Claude in Chrome can't drive this dashboard: Chrome refuses extension access
to it with "The extensions gallery cannot be scripted." Do these steps by hand.

### Store listing

- **Name:** WebToMarkdown (from the manifest)
- **Summary** (from the manifest): Copy or download the current page as clean Markdown.
- **Category:** leave it as it is
- **Language:** English
- **Homepage URL:** `https://web-markdown.com`
- **Support URL:** `https://web-markdown.com/support`
- **Support email:** `support@followusai.com`
- **Description:** paste the block below. Each paragraph is one line, because the dashboard keeps line breaks.

```
WebToMarkdown turns the page you're reading into clean Markdown.

Open a docs page, an article or a release note, click the toolbar button, and press Copy Current Page or Download .md. You get the readable part of the page, ready to paste into your notes, a README or an AI chat. There's nothing to sign up for.

What it does
• Keeps headings, lists, links, code blocks with their language, and tables
• Drops navigation, sidebars, cookie prompts and "Was this helpful?" widgets
• Copies to your clipboard, or saves a .md file named after the page
• Shows a word count and a preview of the result in the popup
• Works from the toolbar popup, the right-click menu or a keyboard shortcut: Alt+Shift+M (Option+Shift+M on Mac) copies the page, and you can add a shortcut for downloads in Chrome's extension shortcut settings
• Keeps your last 100 copies in the popup, so you can copy one again, download it, open its source page or delete it
• Lets you choose what's included: YAML frontmatter, a title heading, a source link and tables. Change settings from the popup, without leaving the page

How it works
Everything happens in your browser. When you press a button, pick the menu item or use the shortcut, WebToMarkdown reads the tab you're on, finds the main content and converts it to Markdown. It doesn't run on the pages you visit until you ask, and it never reads your other tabs.

Private by design
No accounts, no analytics, and no WebToMarkdown server. Pages are converted on your device and nothing is uploaded. Settings and copy history are kept in Chrome's extension storage on your device. You can delete any saved copy, clear them all, or turn history off.

Free and open source
WebToMarkdown is free to use and open source under the MIT License.

Not supported
• Browser pages such as chrome:// pages and the Chrome Web Store, which Chrome doesn't let extensions read
• Text inside embedded frames and canvases, which is left out
• Images are kept as links to the original, not saved with the Markdown
• Whole sites: it converts one page at a time
```

- **Screenshots:** remove the old ones, then upload `screenshot-1.png` to `screenshot-5.png` in order.
- **Icon and promo tiles:** `store-icon-128.png`, `promo-small.png`, `promo-marquee.png`.

### Privacy practices

- **Single purpose:** WebToMarkdown converts the page the user is viewing into Markdown, then copies it to the clipboard or saves it as a .md file.
- **Permission justifications:**

| Permission | Justification |
| --- | --- |
| `activeTab` | Gives the extension access to the current tab only when the user clicks the toolbar button, picks the right-click menu item or presses the shortcut, so it can read the page they asked to convert. The extension has no host permissions. |
| `scripting` | Runs the extension's own bundled scripts in that tab, after the user asks. They find the main content, convert it to Markdown, show a short confirmation, and save the .md file for a download. |
| `clipboardWrite` | Puts the finished Markdown on the clipboard when the user copies a page, or copies a saved page again from history. |
| `contextMenus` | Adds "Copy page as Markdown" and "Download page as Markdown" to the right-click menu. |
| `storage` | Stores the user's settings and, when copy history is on, the pages they copied, locally on their device so they can copy or download them again. Nothing is transmitted off the device. |

- **Remote code:** No, I am not using remote code. All scripts and fonts ship in the package.
- **Data usage:** tick nothing. Copy history stores page content in `chrome.storage.local`, on the device only, and is never sent anywhere, so no data is collected. Settings and the state of the rate and share prompts stay on the device too. Then tick all three certifications: no sale of data, no use for unrelated purposes, no use for creditworthiness.
- **Privacy policy URL:** `https://web-markdown.com/privacy`
- **In-app purchases:** No. The extension is free and takes no payment.

### Distribution

- **Visibility:** Public
- **Regions:** All

Press **Submit for review**. The extension asks for no host permissions, which
keeps the review simple, but review time varies. The table above answers most
questions from the review team.

## 3. Microsoft Edge Add-ons

There is no listing yet. The same zip, screenshots and tiles upload as they are.
Use the Chrome text, changing "Chrome" to "Edge" in the description. Check the
current image sizes in Partner Center before submitting.

When it goes live, add the listing to `shared/constants/store-links.js` and
`web/lib/site.ts`.

## 4. Firefox Add-ons

There is no listing yet. `node build.mjs` writes the Firefox build to
`dist/firefox`, with the add-on ID `web-to-markdown@followusai.com` and a
minimum version of Firefox 115. Zip that folder and upload it to Mozilla
Add-ons for signing. The 1280×800 screenshots fit. Firefox has no promo tiles.

The description and privacy text need Firefox wording, and the screenshots
label their window frames "Chrome". Test the build in Firefox first:
`docs/browser-compatibility.md` still lists Firefox as unsupported.

When it goes live, fill in `FIREFOX_LISTING_URL` and `FIREFOX_REVIEW_URL` in
`shared/constants/store-links.js`.

## 5. Mac App Store (Safari)

On hold. The app (ID `6762680685`) is pulled from the App Store, and
`downloadTargets.safari.available` in `web/lib/site.ts` hides it from the website.

When it comes back:

- Run `./release.sh`. It syncs the Xcode project's version and build number. Don't run it for a Chrome-only release.
- Archive and upload `safari/WebToMarkdown.xcodeproj` from Xcode. See `docs/maintenance/release-process.md` and `docs/maintenance/apple-review-guidelines.md`.
- Screenshots are in `docs/store-screenshots/macos-app-store-1280x800/`, made with `store-screenshots-studio/`.
- Fill in `SAFARI_LISTING_URL` and `SAFARI_REVIEW_URL` in `shared/constants/store-links.js`.

## 6. Shipping an update

1. Raise `version` in `manifest.json`.
2. Run `node build.mjs`, then `node scripts/package.mjs`.
3. If the UI changed, run `scripts/store-assets.mjs`, look at every image, and commit `store/` with the change.
4. Upload the zip under **Package** in the dashboard.
5. Update the description here if the features changed, and paste it into the dashboard.
6. If the permissions in `manifest.json` changed, update the justification table in the same pull request.
7. Update the table in [Where each store stands](#where-each-store-stands).

If someone keeps a copy of these images outside the repo, overwrite it too.
