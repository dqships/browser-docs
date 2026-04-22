import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/** Shared site footer used across all pages. */
export function SiteFooter() {
  return (
    <footer className="site-footer-shell px-6 py-10 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="brand-lockup justify-center mb-4">
          <Image
            src="/icon.png"
            alt=""
            aria-hidden="true"
            width={22}
            height={22}
            className="brand-icon"
          />
          <span className="text-sm font-semibold text-text-primary">
            {site.name}
          </span>
        </div>
        <nav className="flex items-center justify-center gap-5 text-sm text-text-secondary mb-4">
          <Link href="/" className="transition-colors hover:text-text-primary">
            Home
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-text-primary"
          >
            Blog
          </Link>
          <a
            href={site.ctaUrl}
            className="transition-colors hover:text-text-primary"
          >
            {site.ctaLabel}
          </a>
        </nav>
        <nav className="flex items-center justify-center gap-4 text-xs text-text-tertiary mb-4">
          <Link
            href="/privacy"
            className="transition-colors hover:text-text-secondary"
          >
            Privacy Policy
          </Link>
          <span className="text-border">·</span>
          <Link
            href="/support"
            className="transition-colors hover:text-text-secondary"
          >
            Support
          </Link>
          <span className="text-border">·</span>
          <Link
            href="/terms"
            className="transition-colors hover:text-text-secondary"
          >
            Terms of Use
          </Link>
        </nav>
        <p className="text-sm text-text-tertiary mb-2">
          {site.defaultDescription}
        </p>
        <p className="text-xs text-text-tertiary">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
