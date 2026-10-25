# Contributing to WebToMarkdown

Thanks for helping make WebToMarkdown better. Start by checking existing issues
and pull requests so work does not get duplicated.

## What to change

- Keep WebToMarkdown small, fast, and focused on clean Markdown.
- Keep user-facing words short and easy to understand.
- Do not change the WebToMarkdown name, icon, store screenshots, or other brand
  assets unless you have permission. See [BRAND_ASSETS.md](BRAND_ASSETS.md).
- Do not add tracking, analytics, or code that sends page content off the
  user's device.
- Do not add browser permissions unless the change truly needs them, and explain
  why in the pull request.

## Set up the extension

1. Build the browser packages from the repository root:

```sh
node build.mjs
```

2. Open `chrome://extensions`, turn on **Developer mode**, click **Load
   unpacked**, and select `dist/chrome`.
3. For Firefox, open `about:debugging#/runtime/this-firefox`, click **Load
   Temporary Add-on**, and select `dist/firefox/manifest.json`.
4. For Safari, open `safari/WebToMarkdown/WebToMarkdown.xcodeproj` in Xcode and
   run the `WebToMarkdown` scheme.

Use `node build.mjs` while developing. `./release.sh` is for maintainers: it
also bumps the Safari build number in the Xcode project.

Before opening a pull request, test your change on a few real pages, such as
static documentation sites, React or Next.js docs, and long articles. See
[docs/testing/manual-test-plan.md](docs/testing/manual-test-plan.md).

## Set up the website

```sh
cd web
npm ci
npm run dev
```

Run the website checks before opening a pull request:

```sh
cd web
npm run lint
npm run typecheck
npm run test
npm run build
```

## Pull requests

- Make one focused change per pull request.
- Explain the problem, the change, and how you checked it.
- Include before-and-after Markdown snippets for extraction changes.
- Include screenshots for visible popup, options, or website changes.
- Keep files focused: one component, helper, or piece of logic per file, named
  in `kebab-case.js`. See [AGENTS.md](AGENTS.md).
- Treat `safari/` as a stable native wrapper. If you change native Safari
  settings, also update the Safari refresh scripts in `scripts/`.
- Add or update the matching documentation when behavior changes.
- Do not include generated build output, local settings, or unrelated cleanup.

By contributing, you agree that your contribution may be distributed under the
[MIT License](LICENSE).
