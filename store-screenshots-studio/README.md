# WebToMarkdown Store Screenshots Studio

Standalone local tool for designing and exporting store screenshots from the
current extension assets.

## What it generates

- `browser-store`: 5 screenshots sized for Chrome Web Store and Firefox AMO at
  `1280x800`
- `macos-app-store`: 5 screenshots sized for the Mac App Store at accepted
  `16:10` resolutions

## Source assets

The studio copies and reuses:

- `../shared/icon.png`
- `../docs/testing/reports/report-2/screenshots/01-popup-success.png`
- `../docs/testing/reports/report-2/screenshots/02-context-menu-toast.png`
- `../docs/testing/reports/report-2/screenshots/03-options-updated.png`
- `../docs/testing/reports/report-2/screenshots/04-popup-after-settings.png`

These are mirrored into `public/source/` so the generator is self-contained.

## Run locally

```bash
pnpm install
pnpm dev -- --hostname 127.0.0.1 --port 3100
```

Open:

```text
http://127.0.0.1:3100/store-screenshots
```

The route is local-only and returns `404` for non-local hosts.

## Export

Use the buttons in the page header for each set:

- `Export 1280x800` for browser stores
- `Export 2880x1800`, `2560x1600`, `1440x900`, `1280x800` for the Mac App Store
- `Export all Mac sizes` to download all accepted Apple sizes as separate ZIPs

Each ZIP contains zero-padded filenames so store uploads stay sorted.

## Build

```bash
pnpm build
```

`build` is pinned to Next.js Webpack mode because Turbopack hit a sandbox-only
panic during CSS processing in this environment.
