# Release Process

We follow a clean, single-codebase maintenance model to package our extension for Chrome, Firefox, and Safari.

## Clean Maintenance Model

- **One Source of Truth**: Edit only the source folders and root `manifest.json`.
- **Versioning**: Bump the version in `manifest.json` for every new release.
- **Build**: Run `node build.mjs` to generate browser-specific artifacts.
- **Publish**: Release exclusively from the generated outputs:
  - `dist/chrome`
  - `dist/firefox`
  - `safari/WebToMarkdown.xcodeproj`

### The Safari Approach

For Safari, we deliberately do **not** use `--copy-resources`. Apple's default behavior references the original extension files directly (`dist/chrome` in our case), keeping the codebase unified. 

Our recommended setup generates the Safari project once into `safari/` without copying resources. This avoids the necessity of a manual re-sync/regeneration step before each Safari release.

## Setup Safari

Run these commands to initialize or refresh the Xcode project for Safari:

```bash
node build.mjs

xcrun safari-web-extension-converter dist/chrome \
  --app-name "WebToMarkdown" \
  --project-location safari
```

*(You can also use the `./release.sh` script to run these in one step.)*

## Release Cycle

Follow these steps for every extension update:

1. Update code once in the repository.
2. Bump the extension version in `manifest.json`.
3. Run `node build.mjs` (or `./release.sh`).
4. **Chrome**: Zip `dist/chrome` and upload it to the Chrome Web Store dashboard.
5. **Firefox**: Zip `dist/firefox` and upload it to Mozilla AMO for signing and publishing.
6. **Safari**: Open `safari/WebToMarkdown.xcodeproj`, increment the app build and version in Xcode, Archive, then upload via Xcode/App Store Connect.

## Distribution Platforms

- **Chrome**: Upload a ZIP to the Chrome Developer Dashboard. Updates require uploading a new ZIP with a higher version. 
  - Source: [Publish](https://developer.chrome.com/docs/webstore/publish/), [Update](https://developer.chrome.com/docs/webstore/update/)
- **Firefox**: Upload a ZIP or XPI to AMO. Mozilla signs the package, and listed add-ons update automatically through AMO. 
  - Source: [Submitting an add-on](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/), [Signing overview](https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/)
- **Safari**: Distributed as a standard macOS App containing the extension, packaged and delivered through Xcode and App Store Connect.
  - Source: [Packaging a web extension for Safari](https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari), [Distributing your Safari web extension](https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension)
