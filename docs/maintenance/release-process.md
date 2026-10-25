# Release Process

We follow a clean, single-codebase maintenance model to package our extension for Chrome, Firefox, and Safari.

## Clean Maintenance Model

- **One Source of Truth**: Edit only the source folders and root `manifest.json`.
- **Versioning**: Bump the version in `manifest.json` for every new release.
- **Build**: Run `./release.sh` as the primary release entrypoint.
- **Publish**: Release exclusively from the generated outputs:
  - `dist/chrome`
  - `dist/firefox`
  - `dist/safari`
  - `safari/WebToMarkdown.xcodeproj`

### The Safari Approach

For Safari, we deliberately do **not** use `--copy-resources`. Apple's default behavior references the original extension files directly (`dist/safari` in our case), keeping the codebase unified.

`dist/safari` is generated from the same source tree as Chrome and Firefox, but with one Safari-specific compatibility adjustment: the background service worker is bundled into a classic script and the Safari manifest omits `background.type = "module"`. This removes the Safari converter warning about the unsupported `type` manifest key without changing the authored source modules.

The Safari wrapper in `safari/` is treated as a stable, version-controlled native layer. This is where Apple-specific assets and metadata live, such as native app icons and `PrivacyInfo.xcprivacy` files. Do **not** regenerate the wrapper on every release.

## Setup Safari

The single release entrypoint is still `./release.sh`. When you intentionally want to refresh the Safari wrapper too, use:

```bash
./release.sh --refresh-safari

```

Under the hood this calls the dedicated refresh script, which preserves committed native customizations in `safari/`, including:

- `AppIcon.appiconset`
- `LargeIcon.imageset`
- `PrivacyInfo.xcprivacy`
- targeted `project.pbxproj` patches required to reference the privacy manifests
- Safari app and extension `DEVELOPMENT_TEAM`
- Safari app and extension `PRODUCT_BUNDLE_IDENTIFIER`
- Safari app `INFOPLIST_KEY_LSApplicationCategoryType`
- Safari app and extension `INFOPLIST_KEY_ITSAppUsesNonExemptEncryption`
- project and target deployment minimums such as `MACOSX_DEPLOYMENT_TARGET`

The PNGs inside `AppIcon.appiconset` and `LargeIcon.imageset` (and every other icon PNG in the repo) are generated from the master SVGs in `docs/brand/` by `scripts/render-brand-icons.mjs`; see `DESIGN.md` §2. To change the icon, edit the SVGs, re-run that script, and commit the regenerated PNGs. The refresh script then preserves them like any other committed asset.

Important caveat: only the files and patches in that preservation list are guaranteed. If you later add other native Safari customizations such as `Info.plist` keys, entitlements, storyboard changes, or extra native resources, you must update the Safari refresh automation to preserve or reapply them too.

For this project, the Safari app and extension explicitly set `ITSAppUsesNonExemptEncryption = NO` through Xcode build settings. That matches the current implementation, which does not ship custom cryptographic code and only relies on platform-provided browser and OS networking behavior. If a future release adds bundled cryptography beyond Apple's exempt platform encryption, change the value to `YES` and complete the App Store Connect export compliance flow before submission.

## Release Cycle

Follow these steps for every extension update:

1. Update code once in the repository.
2. Bump the extension version in `manifest.json`.
3. Run `./release.sh`.
4. **Chrome**: Run `node scripts/build-chrome-store-assets.mjs` (needs Playwright, see the script header). It writes `dist/chrome-web-store/` with the upload ZIP, the five 1280x800 screenshots as JPEG (the store rejects PNGs with an alpha channel), the 128px store icon, and the 440x280 and 1400x560 promo tiles. Upload the ZIP under **Package**, and the images under **Store listing**, in the Chrome Web Store dashboard.
5. **Firefox**: Zip `dist/firefox` and upload it to Mozilla AMO for signing and publishing.
6. **Safari**: `./release.sh` automatically syncs the Safari `MARKETING_VERSION` from `manifest.json` and increments the Safari `CURRENT_PROJECT_VERSION` build number. Open `safari/WebToMarkdown.xcodeproj`, Archive, then upload via Xcode/App Store Connect.

## Versioning Rules

- `manifest.json` is the source of truth for the public extension version.
- Safari `MARKETING_VERSION` is synced automatically from `manifest.json`.
- Safari `CURRENT_PROJECT_VERSION` is the App Store build number and is incremented automatically by `./release.sh`.
- Safari wrapper refreshes reapply only the explicitly scripted native customizations and preserved Xcode build settings. New native changes require updates to the refresh automation and this document.
- If you need to set a specific Safari build number manually, run:

```bash
./release.sh --safari-build 42
```

- If you need the release run to also refresh the Safari wrapper, run:

```bash
./release.sh --refresh-safari
```

## Distribution Platforms

- **Chrome**: Upload a ZIP to the Chrome Developer Dashboard. Updates require uploading a new ZIP with a higher version. 
  - Source: [Publish](https://developer.chrome.com/docs/webstore/publish/), [Update](https://developer.chrome.com/docs/webstore/update/)
- **Firefox**: Upload a ZIP or XPI to AMO. Mozilla signs the package, and listed add-ons update automatically through AMO. 
  - Source: [Submitting an add-on](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/), [Signing overview](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/)
- **Safari**: Distributed as a standard macOS App containing the extension, packaged and delivered through Xcode and App Store Connect.
  - Source: [Packaging a web extension for Safari](https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari), [Distributing your Safari web extension](https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension)
