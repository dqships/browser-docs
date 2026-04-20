# System Architecture

## Runtime Model

The extension uses Manifest V3 with three distinct runtime surfaces:

1. `popup/`
   The user-triggered UI for one-click extraction and clipboard copy.
2. `background/`
   A service worker that manages the context menu and tab-scoped extraction flow.
3. `content/`
   A set of on-demand injected scripts that run inside the active page to locate content, sanitize the DOM, convert it to Markdown, and optionally show page-local feedback.

## Design Choice: No Persistent Content Script

The extension intentionally avoids a persistent `content_scripts` registration.

Reasoning:

- `activeTab` keeps permissions narrower than always-on host access.
- On-demand injection reduces idle work on unrelated pages.
- The content pipeline remains modular without introducing a bundler.

## Directory Responsibilities

- `background/`: context menu registration and background event orchestration.
- `popup/`: popup UI, interaction state, clipboard write from the extension page.
- `options/`: user-configurable defaults saved in extension storage.
- `shared/`: browser helpers, settings storage, and script-injection orchestration reused by popup and background code.
- `content/`: extraction heuristics, DOM cleanup, Markdown serialization, clipboard fallback, and in-page toasts.

## Permissions

- `activeTab`: temporary access to the tab the user explicitly acts on.
- `clipboardWrite`: allows popup-driven clipboard writes across browsers, including Safari after async extraction work.
- `scripting`: inject the modular extraction pipeline on demand.
- `storage`: persist user settings.
- `contextMenus`: expose a right-click action on pages.

## Data Flow

### Popup Flow

1. Popup loads settings from `chrome.storage.sync`.
2. Popup resolves the active tab.
3. Popup injects the content pipeline into that tab.
4. Popup calls the injected `extractPage()` entrypoint.
5. Popup copies returned Markdown with the extension clipboard API.
6. Popup renders stats and a short preview.

### Context Menu Flow

1. Background receives the context menu event.
2. Background loads settings and injects the content pipeline.
3. Background calls the injected `extractPage()` entrypoint.
4. Background asks the page runtime to copy the Markdown and show a toast.

## Extensibility Path

The architecture leaves room for future additions without rewrites:

- site-specific extractor overrides
- optional raw HTML snapshot support
- custom Markdown formatting profiles
- multi-page docs capture
- export targets beyond clipboard
