import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: `Support and Help With Copied Pages | ${site.name}`,
  description:
    `Support for ${site.name}. Reach out on X or by email if you need help with the extension, copied output, or store listing questions.`,
  canonical: "/support",
});

export default function SupportPage() {
  const lastUpdated = "April 22, 2026";

  return (
    <article className="px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <p
            className="uppercase text-xs tracking-[0.2em] font-semibold mb-4"
            style={{ color: "var(--accent)" }}
          >
            Help
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Support
          </h1>
          <p className="text-sm text-text-tertiary">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="legal-summary">
          <p className="text-sm leading-relaxed text-text-secondary">
            If {site.name} is not copying a page the way you expect, or you
            have a question about the extension, reach out and include the page
            URL, your browser, and what went wrong.
          </p>
        </div>

        <div className="prose-legal">
          <section>
            <h2>How to Reach Us</h2>
            <p>
              You can contact us in either of these places:
            </p>
            <ul>
              <li>
                X:{" "}
                <a href={site.supportXUrl} target="_blank" rel="noreferrer">
                  {site.supportXHandle}
                </a>
              </li>
              <li>
                Email:{" "}
                <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
              </li>
            </ul>
          </section>

          <section>
            <h2>What to Send</h2>
            <p>
              The fastest way to get useful help is to include the source page,
              the browser you are using, and a short note about what you
              expected to be copied versus what actually ended up in the
              Markdown.
            </p>
            <p>
              If the problem is tied to a specific layout, a short screenshot
              of the page or the copied result also helps.
            </p>
          </section>

          <section>
            <h2>Best Fit for the Extension</h2>
            <p>
              {site.name} works best on readable web pages with a clear main
              content area, such as docs, articles, release notes, blog posts,
              and reference pages. Pages with heavy app chrome, infinite feeds,
              or embedded content can still produce rough output.
            </p>
          </section>

          <section>
            <h2>Store and Website Questions</h2>
            <p>
              You can use the same support channels for store listing questions,
              site issues, privacy questions, or general product feedback.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
