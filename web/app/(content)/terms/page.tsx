import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: `Terms of Use | ${site.name}`,
  description:
    `Terms for using the ${site.name} website and extension, including acceptable use, third-party content responsibilities, and service limitations.`,
  canonical: "/terms",
});

export default function TermsPage() {
  const lastUpdated = "October 25, 2026";

  return (
    <article className="px-6 py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <p
            className="uppercase text-xs tracking-[0.2em] font-semibold mb-4"
            style={{ color: "var(--accent)" }}
          >
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Terms of Use
          </h1>
          <p className="text-sm text-text-tertiary">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="legal-summary">
          <p className="text-sm leading-relaxed text-text-secondary">
            These terms apply to the {site.name} website and extension. The
            product is meant to help you copy page content as Markdown, not to
            transfer ownership of third-party content or guarantee compatibility
            with every site on the web.
          </p>
        </div>

        <div className="prose-legal">
          <section>
            <h2>Agreement to These Terms</h2>
            <p>
              {site.name} is owned and operated by {site.publisherName}
              (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
            </p>
            <p>
              By accessing the {site.name} website at <strong>{site.url}</strong>{" "}
              or installing or using the {site.name} extension, you agree to
              these Terms of Use. If you do not agree, do not use the website
              or extension.
            </p>
          </section>

          <section>
            <h2>Description of the Service</h2>
            <p>
              {site.name} provides a browser extension and related website
              content. The current core product helps you convert the readable
              portion of the current page into Markdown and copy that Markdown
              for your own downstream use.
            </p>
            <p>
              The product may evolve over time. We may add, remove, or modify
              features without guaranteeing that any specific feature will
              remain available forever.
            </p>
          </section>

          <section>
            <h2>Acceptable Use</h2>
            <p>
              You agree to use the website and extension only for lawful
              purposes and in a way that does not interfere with the product or
              the rights of others. You must not:
            </p>
            <ul>
              <li>Use the service to violate law, contract, or site rules</li>
              <li>Bypass access controls or restricted content protections</li>
              <li>Attempt to reverse engineer, disable, or abuse the service</li>
              <li>Introduce malware, malicious scripts, or harmful code</li>
              <li>
                Use the product in a way that infringes privacy, confidentiality,
                or intellectual property rights
              </li>
            </ul>
          </section>

          <section>
            <h2>Third-Party Content Responsibility</h2>
            <p>
              {site.name} helps you copy and reformat content from pages you
              choose to view. The source page content remains the property of
              its respective owner, not ours.
            </p>
            <p>
              You are responsible for making sure you have the right to copy,
              store, paste, reuse, or redistribute any third-party content you
              process with the extension. The extension does not grant you any
              license to source material and does not override the copyright,
              confidentiality, or terms of the websites you use it on.
            </p>
          </section>

          <section>
            <h2>Browser Stores and Third-Party Platforms</h2>
            <p>
              If you install {site.name} through a browser store or other
              third-party platform, that platform may impose additional rules,
              review policies, and billing or support procedures. Your use of
              those platforms is governed by their own agreements.
            </p>
          </section>

          <section>
            <h2>Intellectual Property</h2>
            <p>
              The source code for the {site.name} extension and website is
              open source under the MIT License. You may use, copy, modify, and
              distribute that code under the terms of the license included with
              it.
            </p>
            <p>
              The MIT License covers the code only. The {site.name} name, icon,
              store screenshots, website branding, and other brand assets are
              owned by {site.publisherName} and are not licensed for reuse. You
              may not use them to suggest that your version is official,
              approved, or connected with {site.name} without written
              permission.
            </p>
          </section>

          <section>
            <h2>No Warranty</h2>
            <p>
              The website and extension are provided on an &quot;as is&quot; and
              &quot;as available&quot; basis. We do not promise that:
            </p>
            <ul>
              <li>The service will work on every website or browser version</li>
              <li>Every page will convert perfectly into Markdown</li>
              <li>The service will always be uninterrupted, secure, or error-free</li>
            </ul>
            <p>
              Web layouts vary widely. Readable pages with a clear main content
              area are the best fit, but some layouts, scripts, or embedded
              content may still fail or degrade.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we are not liable for any
              indirect, incidental, special, consequential, exemplary, or
              punitive damages arising out of or related to your use of the
              website or extension. This includes loss of data, workflow
              interruption, compatibility problems, or issues caused by the
              third-party content you choose to process.
            </p>
          </section>

          <section>
            <h2>Termination</h2>
            <p>
              You may stop using WebToMarkdown at any time. We may suspend or
              discontinue the website or extension, in whole or in part, at any
              time and without liability.
            </p>
          </section>

          <section>
            <h2>Changes to These Terms</h2>
            <p>
              We may revise these Terms of Use from time to time. When we do,
              we will post the updated version on this page and revise the
              &quot;Last updated&quot; date. Your continued use after a change
              means you accept the revised terms.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have questions about these terms, visit the{" "}
              <a href="/support">support page</a> for current contact options.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
