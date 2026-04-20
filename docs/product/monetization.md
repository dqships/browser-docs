# Monetization & Product Strategy

WebToMarkdown is evolving from a simple utility into a high-performance productivity suite for developers. This document outlines the roadmap for monetization, premium features, and the technical strategy for managing billing across different browser ecosystems.

## The Freemium Model

We will maintain a "Free Forever" tier for the core "Copy Current Page" functionality, while introducing a "Pro" subscription for power users and teams.

### Free Tier
- **Copy to Clipboard**: Manual trigger for the current tab.
- **Vanilla Formatting**: Standard Markdown conversion.
- **General Support**: Community-driven via GitHub.

### Pro Tier (Subscription)
- **Direct Download**: Skip the clipboard and save files directly to disk (with custom naming patterns).
- **Bulk Crawling**: Select multiple documentation pages (or an entire sidebar) to capture as a single Markdown bundle/ZIP.
- **Project Folders**: (Safari Exclusive) Sync captures automatically to a specific local directory on macOS.
- **Custom CSS/Regex**: Define custom rules for specific documentation sites to clean up non-standard layouts.
- **Priority Support**: Direct assistance for custom parsing requests.

---

## Cross-Browser Monetization Strategy

Managing payments across three distinct stores requires a hybrid approach to balance user experience with store compliance.

### 1. Apple Safari (Mac App Store)
- **Mechanism**: **Native In-App Purchases (IAP)** via StoreKit.
- **Implementation**: The native macOS "wrapper" app will act as the billing engine. When a user upgrades, the native app stores the "Pro" entitlement in its local container / Keychain.
- **Syncing**: The Safari Extension will query the native app (the "Sidecar") to verify Pro status. No web-login is strictly required for users who only use Safari.

### 2. Google Chrome & Mozilla Firefox
- **Mechanism**: **Web-based Billing (Stripe)** via [ship-locker.com](https://ship-locker.com).
- **Implementation**: Users will log in via an OAuth flow (GitHub/Google) on the Ship-Locker hub. Billing is handled through Stripe Customer Portals.
- **Extension Sync**: The extension will store a secure JWT in `browser.storage.local` to verify the user's subscription status against the Ship-Locker API.

### 3. Universal Pro Access
To provide the best value, a "Pro" subscription should be cross-platform:
- A user who pays via **Apple IAP** can link their Apple ID to their **Ship-Locker account**.
- Once linked, they can log into the **Chrome/Firefox** versions of the extension to unlock Pro features there without paying twice.

---

## The "Ship-Locker" Hub Integration

As an anchor project of the **Ship-Locker** ecosystem, WebToMarkdown serves as a gateway to your wider toolset.

- **Unified Profiling**: "Pro" status on the extension could potentially unlock discounts or early access to other Ship-Locker agent skills or npm packages.
- **Centralized Documentation**: All legal, privacy, and support documentation for the monetization tiers will be hosted centrally on `ship-locker.com/legal`.

## Technical Implementation Roadmap

1. **Phase 1: Authentication**: Introduce a lightweight login system (OAuth) to the extension options page.
2. **Phase 2: The Sidecar (Safari)**: Update the macOS app from a static window to a background service capable of checking IAP status.
3. **Phase 3: The Crawling Engine**: Move the logic for handling multiple network requests and file bundling into a robust background processor.
