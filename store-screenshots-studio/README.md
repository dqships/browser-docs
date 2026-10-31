# WebToMarkdown Store Screenshots Studio

Standalone local tool for designing and exporting store screenshots from the
current extension assets.

## What it generates

- `macos-app-store`: 5 screenshots sized for the Mac App Store at accepted
  `16:10` resolutions

Browser store images come from `store/template.html` and
`scripts/store-assets.mjs` instead; see `store/README.md`.

## Source assets

Everything under `public/source/` is generated from the extension itself, so the
generator stays self-contained:

- `icon/app-icon.png` comes from `node scripts/render-brand-icons.mjs` (the
  master SVGs in `docs/brand/`).
- `popup/`, `browser/`, and `options/` captures come from
  `node scripts/capture-extension-screenshots.mjs`, which loads the real
  extension in Chromium against the report-1 fixture page. The browser store
  images use these captures too, so keep them here.
- `fonts/` mirrors `shared/fonts/` (Archivo and IBM Plex Mono, SIL OFL 1.1).

Slide styling follows `/DESIGN.md` at the repository root.

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

Use the buttons in the page header:

- `Export 2880x1800`, `2560x1600`, `1440x900`, `1280x800` for a single size
- `Export all Mac sizes` to download all accepted Apple sizes as separate ZIPs

Each ZIP contains zero-padded filenames so store uploads stay sorted.

## Build

```bash
pnpm build
```

`build` is pinned to Next.js Webpack mode because Turbopack hit a sandbox-only
panic during CSS processing in this environment.
