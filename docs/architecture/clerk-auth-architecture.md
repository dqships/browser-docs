# Clerk Authentication Architecture

## Decision

For this repository, Clerk authentication should be built around a hosted web auth surface, not around the extension popup as the primary auth runtime.

Recommended model:

- use a hosted web app or dedicated auth page for Clerk sign-in and sign-up
- let the extension open that auth page when the user needs to authenticate
- keep the extension responsible for session-aware UI and token use
- treat Chrome as the only browser where a direct Clerk extension SDK integration is optional
- treat Firefox and Safari as adapters to the same auth backend, not as separate auth products

## Why This Is The Best Long-Term Path

This project ships to Chrome, Firefox, and Safari, while Clerk currently provides first-class browser extension guidance for Chrome. Building the entire auth system around Chrome-only extension primitives would create unnecessary divergence across browsers.

A hosted auth surface keeps the hard parts in one place:

- OAuth redirects
- passkeys
- email links
- SAML or enterprise flows
- Clerk session lifecycle
- user profile and account management

The extension can then focus on what it actually needs:

- detect whether the user is signed in
- request a usable token for extension actions
- show signed-in or signed-out UI
- sign the user out cleanly

## Architecture Summary

### 1. Hosted Auth App

A separate web app or auth subdomain handles all Clerk UI and all provider redirects.

Examples:

- `https://app.example.com/sign-in`
- `https://auth.example.com/extension`

This app is the source of truth for:

- sign-in
- sign-up
- account recovery
- organization switching
- profile management
- Clerk session state

### 2. Extension Auth Adapter

The extension does not own the full auth flow. It only owns the browser-extension-specific steps needed to:

- launch sign-in
- receive a post-auth handoff
- exchange that handoff for an extension-safe session or token
- store minimal auth state
- refresh or revoke that state

### 3. Backend Session Bridge

Add a thin backend layer between Clerk and the extension.

That bridge should:

- verify the Clerk-authenticated user on the hosted app side
- mint a short-lived extension handoff code or token
- exchange the handoff for extension-usable credentials
- return only the data the extension needs
- revoke extension state on sign-out

This avoids trying to make the extension itself act like a full web app.

## Recommended Flow

### Sign-In

1. User opens the extension popup.
2. Popup sees no valid extension session.
3. Popup asks the background worker to open the hosted auth URL in a tab or popup window.
4. User completes Clerk authentication in the hosted web app.
5. Hosted app calls the backend session bridge and creates a one-time extension handoff.
6. Hosted app redirects to an extension callback URL or shows a completion page that the extension can detect.
7. Background worker exchanges the handoff for extension-safe session data.
8. Extension stores minimal session state and updates popup UI.

### Signed-In Usage

1. Popup or background checks stored auth state.
2. If a fresh token is needed, it calls the backend session bridge.
3. Backend returns a short-lived token or authorized response.
4. Extension performs the user action.

### Sign-Out

1. User clicks sign out in the extension.
2. Extension clears local auth state.
3. Extension optionally calls the backend revoke endpoint.
4. If desired, open the hosted app sign-out URL to end the Clerk web session too.

## Browser Strategy

### Chrome

Two viable options exist:

- Recommended default: use the same hosted auth flow as every other browser.
- Optional enhancement: add a Chrome-specific integration using Clerk's Chrome Extension SDK for popup or service-worker auth helpers.

Use the Chrome-specific SDK only if it gives clear product value. Do not make it the foundation for the cross-browser design.

### Firefox

Use the hosted auth flow plus the extension auth adapter. Do not assume Chrome-specific Clerk extension APIs will map cleanly.

### Safari

Use the hosted auth flow plus the extension auth adapter. The native Safari wrapper should stay thin and should not become a second auth implementation.

## What Should Not Happen

- Do not put Clerk directly in content scripts.
- Do not make content scripts responsible for session management.
- Do not build separate auth products for Chrome, Firefox, and Safari.
- Do not make the Safari native wrapper the owner of authentication logic.
- Do not couple the entire repo to Chrome-only Clerk extension behavior.

## Proposed Repository Shape

If Clerk auth is added, keep it modular and browser-agnostic where possible.

Suggested extension-side structure:

- `shared/auth/auth-config.js`
  Central auth endpoints, feature flags, and browser-specific constants.
- `shared/auth/auth-state.js`
  Read and write extension auth state.
- `shared/auth/launch-sign-in.js`
  Open the hosted auth flow from popup or background.
- `shared/auth/complete-sign-in.js`
  Exchange the handoff for extension-safe session data.
- `shared/auth/get-session-token.js`
  Resolve a short-lived token for protected actions.
- `shared/auth/sign-out.js`
  Clear local state and optionally call revoke endpoints.
- `popup/auth/`
  Signed-out and signed-in popup UI surfaces.
- `background/auth/`
  Browser-tab orchestration and callback handling.

Suggested hosted-app responsibilities:

- Clerk UI and provider flows
- account pages
- session bridge endpoints
- extension handoff creation

## Session Model

The extension should store the smallest possible auth state.

Prefer:

- user id
- session expiration metadata
- a short-lived extension token or exchange token
- lightweight profile fields needed by the popup

Avoid:

- long-lived secrets
- raw provider tokens
- duplicating Clerk browser session logic inside the extension

## Security Notes

- Keep extension tokens short-lived.
- Treat the extension as a semi-trusted client.
- Verify every privileged action on the backend.
- Use one-time handoff codes for sign-in completion where possible.
- Scope tokens to extension use cases only.
- Keep auth logic out of injected page contexts.

## Recommendation For This Repo

If the goal is the fewest long-term surprises, implement Clerk in two layers:

1. Hosted auth app as the primary auth system.
2. Lightweight extension adapter shared across Chrome, Firefox, and Safari.

If later there is a compelling reason to improve Chrome UX, add an optional Chrome-specific Clerk integration behind the same shared auth interfaces. That keeps Chrome optimized without forcing Firefox and Safari to imitate it.

## Implementation Phasing

### Phase 1

- define auth endpoints and the extension handoff contract
- add shared extension auth state utilities
- add popup signed-in and signed-out states
- launch hosted auth from the extension

### Phase 2

- add callback completion and token exchange
- gate any premium or account-bound features behind auth state
- add sign-out and session refresh

### Phase 3

- evaluate whether Chrome-specific Clerk SDK usage is worth adding
- keep it behind the same extension auth interfaces if adopted

