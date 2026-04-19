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

## Path to Cross-Browser Support

If comprehensive cross-browser support (Firefox/Safari) becomes a requirement, the following architectural updates would be necessary:

1. **Implement a Polyfill:**
   Incorporate Mozilla's `webextension-polyfill` to seamlessly normalize API calls across the codebase, allowing `browser.*` Promise syntax to function across all browsers while bridging the gap for Chrome.

2. **Abstract the Manifest:**
   Introduce a build step or configuration system to mutate `manifest.json` before deployment, emitting a `service_worker` for Chromium/Safari and a background `scripts` block for Firefox.

3. **Vendor Specific UI Constraints:**
   Test and potentially isolate rendering differences with CSS metrics or CSS variable scoping, particularly to account for varying default browser dimensions and font rendering within the extension's popup UI.
