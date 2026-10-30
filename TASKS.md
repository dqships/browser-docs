# Tasks

## Done

- 2026-10-30: Checked main at e3c6619 for the 1.2.0 release: manifest correct, 41 tests pass, 0 fail.
- 2026-10-30: DQ uploaded the 1.2.0 package and screenshots, updated the privacy section, saved the new description, and submitted 1.2.0 for review. The pre-submit check of the saved draft was skipped.
- 2026-10-30: Added `store/` (runbook, template, images), `scripts/store-assets.mjs` and `scripts/package.mjs`, following the store folder playbook. Removed `scripts/build-chrome-store-assets.mjs`, `docs/maintenance/chrome-web-store-listing.md` and `docs/store-screenshots/browser-store-1280x800/`.
- 2026-10-30: Merged dqships/browser-docs#15 (store folder) and dqships/browser-docs#14 (website update for 1.2.0).

## Next

- Watch for the Chrome Web Store's review result on 1.2.0, and update the table in `store/README.md` when it's approved.
- Remove the retired `browser-store` set from `store-screenshots-studio/`, which is now only needed for the Mac App Store.

## Open decisions

None.

## Decisions

- 2026-10-30: Store listings follow `02 Playbooks/Development/store-folder-guide.md`. `store/README.md` can hold store-specific versions and details.
- 2026-10-30: Chrome dashboard steps are done by hand. Chrome refuses Claude in Chrome there: "The extensions gallery cannot be scripted."
- 2026-10-30: The repo stays without a root `package.json`. Store scripts run with plain `node`, and Playwright comes from the global install through `NODE_PATH`.
- 2026-10-30: DQ chose to merge the website update once 1.2.0 was submitted, without waiting for store approval.
