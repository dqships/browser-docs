import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: `About the Extension and Who Makes It | ${site.name}`,
  description: `${site.name} is an open source browser extension from ${site.publisherName}, a small software company in Michigan, USA, that copies web pages as Markdown.`,
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <article className="px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <p
            className="uppercase text-xs tracking-[0.2em] font-semibold mb-4"
            style={{ color: "var(--accent)" }}
          >
            About
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            About {site.name}
          </h1>
        </header>

        <div className="prose-legal">
          <section>
            <h2>What It Is</h2>
            <p>
              {site.name} is a browser extension that copies the readable part
              of the page you are on as clean Markdown. It keeps headings,
              lists, code blocks, tables, and links, and leaves navigation,
              sidebars, and cookie prompts behind.
            </p>
          </section>

          <section>
            <h2>Who Makes It</h2>
            <p>
              {site.name} is made by{" "}
              <a href={site.publisherUrl}>{site.publisherName}</a>, a small
              software company in {site.publisherLocality},{" "}
              {site.publisherRegionName}, USA. The source code is available
              under the MIT License on{" "}
              <a href={site.sourceUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
              .
            </p>
          </section>

          <section>
            <h2>How It Works</h2>
            <p>
              Pages are converted inside your browser. There is no account, no
              upload, and no {site.name} server. Settings are kept in your
              browser&apos;s own extension storage.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Email{" "}
              <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> or
              find us on X at{" "}
              <a href={site.supportXUrl} target="_blank" rel="noreferrer">
                {site.supportXHandle}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
