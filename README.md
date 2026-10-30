# WebToMarkdown

WebToMarkdown is a browser extension that copies the readable part of a web page
as clean Markdown. Click the toolbar button, use the right-click menu, or press
`Alt+Shift+M` and the page's main content goes to your clipboard with headings,
lists, tables, links, and code blocks kept intact. You can also save the page as
a `.md` file from the popup, the right-click menu, or a shortcut you assign in
the browser's shortcut settings. It works in Chrome, Firefox, and Safari, and
converts pages locally in your browser.

[Get WebToMarkdown on the Chrome Web Store](https://chromewebstore.google.com/detail/webtomarkdown/gaglchmlnkelnokjkilcbkggfdembeem)

## Getting started

The extension is plain JavaScript with no dependencies to install. You only
need [Node.js](https://nodejs.org) to build the browser packages:

```sh
node build.mjs
```

This writes one package per browser to `dist/chrome`, `dist/firefox`, and
`dist/safari`.

To load it unpacked:

- **Chrome or another Chromium browser**: open `chrome://extensions`, turn on
  **Developer mode**, click **Load unpacked**, and select `dist/chrome`. You can
  also select the repository root to load the source directly.
- **Firefox**: open `about:debugging#/runtime/this-firefox`, click **Load
  Temporary Add-on**, and select `dist/firefox/manifest.json`.
- **Safari**: run `node build.mjs`, then open
  `safari/WebToMarkdown/WebToMarkdown.xcodeproj` in Xcode and run the
  `WebToMarkdown` scheme. Turn on the extension in Safari settings. You may need
  to allow unsigned extensions in Safari's developer settings.

After changing background scripts or permissions, click the reload button on the
extension's card in `chrome://extensions`.

`./release.sh` is for maintainers publishing a release. It builds the packages
and also bumps the Safari build number in the Xcode project.

## Project layout

- `manifest.json`: the extension manifest and the single source of truth for
  every browser.
- `background`: the service worker, keyboard command, and context menu.
- `content`: scripts injected into the page to find the main content and turn
  it into Markdown.
- `popup`: the toolbar popup.
- `options`: the settings page.
- `shared`: helpers, settings, the icon, and vendored libraries used across the
  extension.
- `safari`: the native Xcode wrapper for Safari.
- `scripts`: build and Safari maintenance scripts used by `build.mjs` and
  `release.sh`.
- `web`: the WebToMarkdown website.
- `store`: store images and the submission runbook. Start at
  [store/README.md](store/README.md).
- `store-screenshots-studio`: a local tool for making Mac App Store screenshots.
- `docs`: architecture, testing, and release notes.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request.

## License

The WebToMarkdown source code is available under the [MIT License](LICENSE).
The WebToMarkdown name, icon, store screenshots, and other brand assets are not
covered by that license. See [BRAND_ASSETS.md](BRAND_ASSETS.md).

`shared/vendor/browser-polyfill.min.js` is Mozilla's
[webextension-polyfill](https://github.com/mozilla/webextension-polyfill) and
keeps its own license, the Mozilla Public License 2.0.
