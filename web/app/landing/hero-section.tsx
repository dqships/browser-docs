import { BrowserAwareInstallCta } from "@/app/browser-aware-install-cta";
import { PageToMarkdownDiagram } from "@/app/landing/page-to-markdown-diagram";
import { ShortcutKeys } from "@/app/landing/shortcut-keys";
import { formatAvailableBrowsers } from "@/lib/download-targets";
import { site } from "@/lib/site";

export function HeroSection() {
  return (
    <section id="hero" className="pt-8 pb-16 md:pt-10 md:pb-24">
      <div className="page-frame">
        <p className="mono-label flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-rule pb-3 text-ink-muted">
          <span>Browser extension — {formatAvailableBrowsers("&")}</span>
          <span>No account · Runs locally</span>
        </p>

        <h1 className="display mt-10 text-[clamp(2.75rem,11vw,8.25rem)] md:mt-14">
          Web page in.
          <br />
          Markdown out
          <span
            className="ml-[0.05em] inline-block h-[0.17em] w-[0.17em] bg-signal"
            aria-hidden="true"
          />
          <span className="sr-only">.</span>
        </h1>

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4 lg:pr-6">
            <p className="text-lg leading-relaxed text-ink-soft md:text-xl">
              {site.name} copies the readable part of the page you are on —
              docs, articles, release notes — and leaves the navigation,
              sidebars, and cookie prompts behind. Clean Markdown, straight to
              your clipboard.
            </p>

            <div className="mt-8">
              <BrowserAwareInstallCta
                id="hero-cta"
                className="btn-primary text-base"
                fallbackContainerClassName="flex flex-wrap items-center gap-3"
                fallbackPrimaryClassName="btn-primary text-base"
                fallbackSecondaryClassName="btn-secondary text-base"
                fallbackLabelMode="cta"
                resolvedLabelMode="cta"
                includeArrowIcon
              />
            </div>

            <p className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
              <ShortcutKeys />
              <span>copies the current page.</span>
            </p>
          </div>

          <div className="lg:col-span-8">
            <PageToMarkdownDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
