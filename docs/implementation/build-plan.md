# Build Plan

## Phase 1: Project Skeleton

- Add the MV3 manifest.
- Create popup, options, background, shared, and content directories.
- Keep every file narrowly scoped.

## Phase 2: Shared Runtime

- Add default settings and storage accessors.
- Add active-tab lookup helpers.
- Add a reusable injected-script list.
- Add a shared extraction runner for popup and background code.

## Phase 3: Extraction Engine

- Bootstrap a page-local registry for injected content utilities.
- Implement candidate selection.
- Implement DOM sanitization.
- Implement Markdown serializers for inline and block content.
- Implement Markdown finalization and stats generation.

## Phase 4: User Flows

- Build the popup UI and status rendering.
- Build the options page and settings persistence.
- Build the background service worker for context-menu support.

## Phase 5: Validation

- Verify the manifest and file references.
- Run lightweight syntax validation over JavaScript.
- Review the docs tree and extension behavior for consistency.

## File Ownership Notes

- `shared/` owns browser API orchestration outside the page context.
- `content/` owns all page-aware extraction logic.
- `popup/` and `options/` stay UI-only.
- `background/` stays event-driven and thin.
