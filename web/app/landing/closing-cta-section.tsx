import { BrowserAwareInstallCta } from "@/app/browser-aware-install-cta";

export function ClosingCtaSection() {
  return (
    <section id="cta" className="py-20 md:py-28">
      <div className="page-frame grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-6">
        <h2 className="display text-5xl md:text-7xl lg:col-span-8">
          Stop cleaning up copied pages by hand.
        </h2>
        <div className="lg:col-span-4">
          <p className="text-lg text-ink-soft">
            Available for Chrome and Safari. Open a page, press the
            shortcut, paste.
          </p>
          <BrowserAwareInstallCta
            id="cta-button"
            className="btn-primary mt-6 text-base"
            fallbackContainerClassName="mt-6 flex flex-wrap items-center gap-3"
            fallbackPrimaryClassName="btn-primary text-base"
            fallbackSecondaryClassName="btn-secondary text-base"
            fallbackLabelMode="cta"
            resolvedLabelMode="cta"
            includeArrowIcon
          />
        </div>
      </div>
    </section>
  );
}
