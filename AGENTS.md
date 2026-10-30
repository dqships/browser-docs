# Repository Guidelines

## Project Structure & Module Organization
This repository is a browser extension designed to copy webpage content as formatted Markdown, following a strictly modular architecture. 
The source code is organized into the following directores:
- **`/background`**: Contains the extension's service worker (`service-worker.js`).
- **`/content`**: Content scripts injected into web pages to handle DOM parsing and content extraction.
- **`/popup`**: HTML/CSS/JS for the extension's popup action interface (`popup.html`).
- **`/options`**: HTML/CSS/JS for the extension's configuration page.
- **`/shared`**: Reusable utilities, constants, and helper functions that can be imported across different components of the extension.
- **`/docs`**: Project documentation, specification briefs, and testing reports.
- **`/store`**: Store images, the image template, and the submission runbook (`store/README.md`) for every store.

## Build, Test, and Development Commands
This project is currently written in vanilla JavaScript (Manifest V3) without a complex build pipeline (no Node.js bundlers).
- **Run Locally**: Open `chrome://extensions` in your Chromium-based browser, enable **Developer Mode**, click **Load unpacked**, and select the root directory (where `manifest.json` is located).
- **Update Changes**: If you modify any background scripts or permissions, you will need to click the refresh icon on the extension's card in `chrome://extensions`. Popup and content script HTML/CSS changes will generally reflect immediately upon the next interaction.
- **Release Workflow**: Use `./release.sh` as the single release entrypoint. Use `./release.sh --refresh-safari` only when you intentionally need to regenerate the Safari wrapper.

## Coding Style & Naming Conventions
To ensure long-term maintainability and readability, you must adhere strictly to these architectural guidelines:
- **Strict Code-Splitting**: Modularize code aggressively.
- **Single-Purpose Files**: Every component, utility function, and piece of logic must be placed into its own individual file. Avoid sprawling "monolithic" files.
- **Separation of Concerns**: Keep DOM parsing, Markdown conversion, browser extension API interactions (`chrome.*`), UI rendering, and event handling isolated from one another.
- **Naming Conventions**: Use `kebab-case.js` for file names and descriptive variable/function names.
- **Safari Native Layer**: Treat `safari/` as a stable native Apple wrapper. Do not place Apple-native privacy metadata in `manifest.json`; keep it in the Safari project (`PrivacyInfo.xcprivacy`, asset catalogs, Xcode project metadata).
- **Safari Refresh Rule**: Any change to native Safari customizations must also update the Safari refresh automation so `./release.sh --refresh-safari` preserves or reapplies it. At minimum review and update:
  - `scripts/refresh-safari-project.sh`
  - `scripts/apply-safari-customizations.mjs`
  - `docs/maintenance/release-process.md`
- **Guaranteed Preservation Scope**: Only the explicitly scripted Safari customizations are guaranteed across wrapper refreshes. If you add `Info.plist` keys, entitlements, storyboard changes, or extra native resources, extend the automation in the same change.

## Testing Guidelines
- Given the current vanilla architecture, testing relies heavily on manual verification across actual documentation frameworks (e.g., standard static site generators, React/Next.js docs, Google docs).
- As testing tools are introduced, place any unit tests adjacent to the utility scripts they test in `__tests__` folders, or suffix them with `.test.js`.

## Commit & Pull Request Guidelines
- **Commits**: Write clear, descriptive commit messages summarizing the functional changes. Keep commits grouped by isolated features.
- **Pull Requests**: Provide a clear PR description. For UI alterations or improvements to Markdown extraction logic, provide before-and-after screenshots or Markdown snippets from test runs. 
- Ensure that PRs adhere to the **Single-Purpose File** rule before submitting for review.
