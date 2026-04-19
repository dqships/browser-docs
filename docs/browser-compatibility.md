# Browser Compatibility

## Current Support

This extension is currently designed and officially supported for **Chromium-based browsers**. Operating natively on Manifest V3, the architectural patterns leverage native Promise resolution and background service workers that function consistently across the Chromium ecosystem out of the box.

**Supported Browsers:**
- Google Chrome
- Microsoft Edge
- Brave
- Vivaldi
- Arc
- Opera

## Why Firefox and Safari Are Not Supported

Although both Mozilla Firefox and Apple Safari support WebExtensions and Manifest V3, this extension is not cross-compatible in its current "vanilla" architecture for two primary reasons:

### 1. API Namespace Constraints
The extension exclusively utilizes the `chrome.*` namespace for API calls (e.g., `chrome.scripting`, `chrome.storage`, `chrome.tabs`) using modern Promises. 

While Chromium supports Promises natively on the `chrome.*` APIs, Firefox and Safari officially use WebExtensions standards, which require Promises to be fired against the `browser.*` namespace instead. (Firefox does support `chrome.*`, but primarily natively binds it to older callback-based signatures unless explicitly adapted).

### 2. Background Execution Environments
The `manifest.json` file registers the background script as a `"service_worker"`.
While Chromium has standardized on Service Workers for Manifest V3 background tasks, Firefox historically preferred to run background tasks in non-persistent event pages (`"background": { "scripts": [...] }`) due to limitations with Service Workers and DOM parsing. Safari 15.4+ does support Service Workers, but managing cross-browser service worker lifecycles reliably requires structural concessions not currently present in this codebase.

## Architectural Paths to Cross-Browser Support

If comprehensive cross-browser support (Firefox/Safari) becomes a requirement, the repository should adopt one of the following two architectural patterns:

### Option A: Lightweight Manifest Muxing (The "Vanilla" Approach)
*Recommended to maintain the current no-bundler architectural philosophy.*

This approach preserves the strict single-purpose, vanilla JavaScript architecture outlined in `AGENTS.md` while solving the browser discrepancy:
1. **Adopt WebExtensions Standard:** Refactor the codebase to call `browser.*` natively and include Mozilla's `webextension-polyfill` as an explicitly imported script file.
2. **Minimal Build Script (`build.mjs`):** Create a tiny Node script that copies the raw `src/` files into `dist/chrome/` and `dist/firefox/`.
3. **Dynamic Manifesting:** During the copy phase, the script programmatically mutates the Firefox `manifest.json`—swapping the Chromium `"service_worker"` object for a Firefox `"scripts"` array without requiring code bundling or minification.

### Option B: Extension Frameworks (The "Scaled" Approach)
*Recommended only if the scope expands to include UI frameworks (e.g., React, Vue) or heavy external libraries.*

Frameworks like **WXT** (often called the Next.js of extensions) or **vite-plugin-web-extension** offer robust, out-of-the-box cross-browser generation:
1. **Automated Polyfills:** These tools automatically bridge the `chrome.*` and `browser.*` divide.
2. **Targeted Deployment:** They emit perfect, highly-optimized `manifest.json` configurations per target browser.
3. **Downside:** This completely violates the current "no complex build pipeline" rule and fundamentally alters the developer workflow.
