import Link from "next/link";
import { BrandMark } from "@/app/brand-mark";
import { BrowserAwareInstallCta } from "@/app/browser-aware-install-cta";
import { site } from "@/lib/site";

const LANDING_LINKS = [
  { href: "#keeps", label: "What it keeps" },
  { href: "#copy", label: "How to copy" },
  { href: "/blog", label: "Blog" },
];

const CONTENT_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/support", label: "Support" },
];

/**
 * Shared site header used across the landing page and content pages.
 *
 * @param variant
 *   - `"landing"` – sticky, with section anchor links
 *   - `"content"` – static, with page navigation links
 */
export function SiteHeader({
  variant = "content",
}: {
  variant?: "landing" | "content";
}) {
  const isLanding = variant === "landing";
  const links = isLanding ? LANDING_LINKS : CONTENT_LINKS;

  return (
    <nav
      id="navbar"
      className={`site-nav z-50 ${isLanding ? "sticky top-0" : ""}`}
    >
      <div className="page-frame flex h-16 items-center justify-between gap-6">
        <Link href="/" className="brand-lockup text-[1.0625rem]">
          <BrandMark size={26} />
          <span>{site.name}</span>
        </Link>

        <div className="flex items-center gap-8">
          <ul className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="mono-label text-ink-soft transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <BrowserAwareInstallCta
            className="btn-primary !py-2.5 !px-4 !text-sm"
            fallbackContainerClassName="flex items-center gap-2"
            fallbackPrimaryClassName="btn-primary !py-2.5 !px-4 !text-sm"
            fallbackSecondaryClassName="btn-secondary !py-2.5 !px-4 !text-sm hidden sm:inline-flex"
            fallbackLabelMode="browser"
            resolvedLabelMode="cta"
          />
        </div>
      </div>
    </nav>
  );
}
