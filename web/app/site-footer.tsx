import Link from "next/link";
import { BrandMark } from "@/app/brand-mark";
import { BrowserAwareInstallCta } from "@/app/browser-aware-install-cta";
import { site } from "@/lib/site";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/#keeps", label: "What it keeps" },
      { href: "/#copy", label: "How to copy" },
      { href: "/#settings", label: "Settings" },
    ],
  },
  {
    heading: "Read",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/support", label: "Support" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

/** Shared site footer used across all pages, set like a colophon. */
export function SiteFooter() {
  return (
    <footer className="site-footer-shell py-14">
      <div className="page-frame grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="brand-lockup text-lg">
            <BrandMark size={30} />
            <span>{site.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm text-ink-soft">
            {site.defaultDescription}
          </p>
          <BrowserAwareInstallCta
            className="text-link mt-5 inline-block text-sm font-semibold"
            fallbackContainerClassName="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold"
            fallbackPrimaryClassName="text-link"
            fallbackSecondaryClassName="text-link"
            fallbackLabelMode="cta"
            resolvedLabelMode="cta"
          />
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav
            key={column.heading}
            aria-label={column.heading}
            className="md:col-span-2 md:first-of-type:col-start-7"
          >
            <p className="mono-label text-ink-muted">{column.heading}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="page-frame mt-14">
        <p className="mono-label flex flex-wrap justify-between gap-3 border-t border-rule pt-5 text-ink-muted">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>Made by {site.supportXHandle}</span>
            Terms of Use
          </Link>
        </nav>
        <p className="text-sm text-text-tertiary mb-2">
          {site.defaultDescription}
        </p>
        <p className="text-xs text-text-tertiary">
          © {new Date().getFullYear()} {site.publisherName}. Source code
          available under the MIT License.
        </p>
      </div>
    </footer>
  );
}
