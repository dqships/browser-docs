# WebToMarkdown Extension

This project builds a browser extension that turns the current page into clean Markdown and copies it to the clipboard.

## Documentation Map

- [`docs/product/requirements.md`](product/requirements.md): product scope, users, and success criteria.
- [`docs/architecture/system-architecture.md`](architecture/system-architecture.md): extension structure, runtime boundaries, and permissions.
- [`docs/architecture/content-extraction-pipeline.md`](architecture/content-extraction-pipeline.md): extraction heuristics and Markdown conversion flow.
- [`docs/architecture/clerk-auth-architecture.md`](architecture/clerk-auth-architecture.md): recommended cross-browser Clerk authentication strategy and hosted auth flow.
- [`docs/implementation/build-plan.md`](implementation/build-plan.md): implementation phases and file responsibilities.
- [`docs/testing/manual-test-plan.md`](testing/manual-test-plan.md): sanity checks and browser validation steps.

## Build Constraints

- Manifest V3 only.
- No build step required.
- Aggressive code-splitting with single-purpose files.
- Documentation-first workflow with all project markdown stored under `docs/`.
