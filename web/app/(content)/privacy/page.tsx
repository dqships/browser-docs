import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: `Privacy Policy | ${site.name}`,
  description:
    `Privacy details for the ${site.name} website and extension, including what stays local in your browser, what settings are stored, and what data we do not collect.`,
  canonical: "/privacy",
});

export default function PrivacyPage() {
  const lastUpdated = "April 22, 2026";

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
            Privacy Policy
          </h1>
          <p className="text-sm text-text-tertiary">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="legal-summary">
          <p className="text-sm leading-relaxed text-text-secondary">
            {site.name} is designed so the core extraction flow happens
            locally in your browser. This policy covers both the marketing site
            and the extension, what stays on your device, and the limited data
            we may receive when you visit the site or contact us.
          </p>
        </div>

        <div className="prose-legal">
          <section>
            <h2>Overview</h2>
            <p>
              This Privacy Policy explains how {site.name} handles information
              when you use the website at <strong>{site.url}</strong> and the
              browser extension distributed under the same name. In this policy,
              &quot;we&quot; means the operator of {site.name}, and
              &quot;you&quot; means a visitor or extension user.
            </p>
          </section>

          <section>
            <h2>What the Extension Processes</h2>
            <p>
              When you trigger {site.name} from the popup, context menu, or
              keyboard shortcut, the extension reads the current page so it can
              identify the readable content area, convert that content into
              Markdown, and place the result on your clipboard.
            </p>
            <p>
              This core conversion flow is intended to happen locally in your
              browser. We do not require an account for the current core
              feature set, and we do not operate a remote page-conversion
              service for normal copy actions.
            </p>
          </section>

          <section>
            <h2>Settings Stored Locally</h2>
            <p>
              The extension stores your copy preferences in browser extension
              storage so the product can remember how you want Markdown
              exported. Those settings may include options such as:
            </p>
            <ul>
              <li>Aggressive pruning of page chrome and obvious noise</li>
              <li>Whether to include frontmatter</li>
              <li>Whether to include a source link</li>
              <li>Whether to include a title heading</li>
              <li>Whether to preserve tables when possible</li>
            </ul>
            <p>
              These preferences are stored locally for extension behavior. You
              can reset them from the extension settings or by removing the
              extension.
            </p>
          </section>

          <section>
            <h2>Permissions We Use</h2>
            <p>
              {site.name} currently requests a small set of browser
              permissions so the extension can perform the job you asked it to
              do:
            </p>
            <ul>
              <li>
                <strong>activeTab</strong> and <strong>scripting</strong> so
                the extension can work with the page you are currently viewing
                after you invoke it.
              </li>
              <li>
                <strong>clipboardWrite</strong> so the exported Markdown can be
                copied for you.
              </li>
              <li>
                <strong>contextMenus</strong> so the extension can add its page
                action to the browser context menu.
              </li>
              <li>
                <strong>storage</strong> so your export preferences can be
                remembered locally.
              </li>
            </ul>
          </section>

          <section>
            <h2>What We Do Not Collect for the Core Flow</h2>
            <p>
              For the current core copy-to-Markdown workflow, we do not claim
              ownership of the page content you copy and we do not intentionally
              collect or store that copied page content on our servers as part
              of the normal extension action.
            </p>
            <p>We also do not use the website for:</p>
            <ul>
              <li>Selling your copied content or browsing activity</li>
              <li>Running advertising profiles or cross-site tracking</li>
              <li>Requiring a user account just to use the core extension flow</li>
            </ul>
          </section>

          <section>
            <h2>Website Information</h2>
            <p>
              If you visit the website, normal hosting infrastructure may
              receive standard technical information such as IP address, browser
              type, requested pages, referrer information, and timestamp data.
              This information is used to deliver and secure the site.
            </p>
            <p>
              If you voluntarily contact us, we will receive the information you
              choose to send, such as your email address and the contents of
              your message.
            </p>
          </section>

          <section>
            <h2>Clipboard and Downstream Use</h2>
            <p>
              After {site.name} copies content to your clipboard, the
              handling of that content depends on your operating system and the
              apps or services where you paste it. If you paste copied
              page content into third-party products, those products will
              govern the pasted content under their own terms and privacy
              policies.
            </p>
          </section>

          <section>
            <h2>Cookies and Tracking</h2>
            <p>
              We do not use advertising cookies or cross-site tracking cookies
              on the website. Standard browser or hosting behavior may still
              involve basic technical session handling, caching, or security
              protections.
            </p>
          </section>

          <section>
            <h2>Third Parties</h2>
            <p>
              WebToMarkdown may be distributed through third-party browser
              stores or linked from third-party websites. Those platforms may
              collect their own telemetry, billing, or account information under
              their own rules. We are not responsible for the privacy practices
              of third-party platforms you use to install, discover, or discuss
              the extension.
            </p>
          </section>

          <section>
            <h2>Data Retention and Control</h2>
            <p>
              Extension settings remain in local browser storage until you
              change them, clear browser extension storage, or uninstall the
              extension. Website-side technical logs, if any, are retained only
              as long as reasonably necessary for security, operations, and
              support.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do,
              we will post the revised version on this page and update the
              &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have privacy questions about {site.name}, use the support
              or contact channel provided with the website, repository, or
              browser store listing where you found the product.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
