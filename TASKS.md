# Tasks

## Done

- 2026-10-30: Checked main at e3c6619 for the 1.2.0 release: manifest correct, 41 tests pass, 0 fail.
- 2026-10-30: DQ uploaded the 1.2.0 package and screenshots and updated the privacy section in the Chrome Web Store dashboard.
- 2026-10-30: Added `store/` (runbook, template, images), `scripts/store-assets.mjs` and `scripts/package.mjs`, following the store folder playbook. Removed `scripts/build-chrome-store-assets.mjs`, `docs/maintenance/chrome-web-store-listing.md` and `docs/store-screenshots/browser-store-1280x800/`.

## Next

- Paste the new description from `store/README.md` into the dashboard, item `gaglchmlnkelnokjkilcbkggfdembeem`, and save the draft.
- Review the package version, saved description, screenshot order and any dashboard warnings. Submit for review only after DQ confirms, with publishing left at the dashboard's default.
- After the store approves 1.2.0, mark dqships/browser-docs#14 ready and merge it.
- Remove the retired `browser-store` set from `store-screenshots-studio/`, which is now only needed for the Mac App Store.

## Open decisions

None.

## Decisions

- 2026-10-30: Store listings follow `02 Playbooks/Development/store-folder-guide.md`. `store/README.md` can hold store-specific versions and details.
- 2026-10-30: Chrome dashboard steps are done by hand. Chrome refuses Claude in Chrome there: "The extensions gallery cannot be scripted."
- 2026-10-30: The repo stays without a root `package.json`. Store scripts run with plain `node`, and Playwright comes from the global install through `NODE_PATH`.
