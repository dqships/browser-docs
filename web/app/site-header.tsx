import Image from "next/image";
import Link from "next/link";
import { BrowserAwareInstallCta } from "@/app/browser-aware-install-cta";
import { site } from "@/lib/site";

/**
 * Shared site header used across the landing page and content pages.
 *
 * @param variant
 *   - `"landing"` – fixed, transparent backdrop with section anchor links
 *   - `"content"` – static, solid background with page navigation links
 */
export function SiteHeader({
  variant = "content",
}: {
  variant?: "landing" | "content";
}) {
  const isLanding = variant === "landing";

  return (
    <nav
      id="navbar"
      className={`site-nav flex items-center justify-between px-6 py-4 backdrop-blur-xl z-50 ${
        isLanding
          ? "site-nav--landing fixed top-0 left-0 right-0"
          : "site-nav--content"
      }`}
    >
      <Link href="/" className="brand-lockup">
        <Image
          src="/icon.png"
          alt=""
          aria-hidden="true"
          width={22}
          height={22}
          className="brand-icon"
        />
        <span className="text-base font-semibold tracking-tight text-text-primary">
          {site.name}
        </span>
      </Link>

      <div className="hidden sm:flex items-center gap-6 text-sm text-text-secondary">
        {isLanding ? (
          <>
            <a
              href="#features"
              className="transition-colors hover:text-text-primary"
            >
              Features
            </a>
            <Link
              href="/blog"
              className="transition-colors hover:text-text-primary"
            >
              Blog
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="transition-colors hover:text-text-primary"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-text-primary"
            >
              Blog
            </Link>
          </>
        )}
        <BrowserAwareInstallCta
          className="btn-primary !py-2 !px-5 !text-sm"
          fallbackContainerClassName="flex items-center gap-2"
          fallbackPrimaryClassName="btn-primary !py-2 !px-4 !text-sm"
          fallbackSecondaryClassName="btn-secondary !py-2 !px-4 !text-sm"
          fallbackLabelMode="browser"
          resolvedLabelMode="cta"
        />
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden">
        <BrowserAwareInstallCta
          className="btn-primary !py-2 !px-4 !text-xs"
          fallbackContainerClassName="flex items-center gap-2"
          fallbackPrimaryClassName="btn-primary !py-2 !px-3 !text-xs"
          fallbackSecondaryClassName="btn-secondary !py-2 !px-3 !text-xs"
          fallbackLabelMode="browser"
          resolvedLabelMode="cta"
        />
      </div>
    </nav>
  );
}
