import { BrandMark } from "@/app/brand-mark";

const FACTS = [
  { title: "No account", description: "Install it and use it. There is nothing to sign in to." },
  { title: "No upload", description: "Pages are converted inside your browser, on your machine." },
  { title: "No server", description: "There is no WebToMarkdown backend. Settings and copy history are kept in your browser's own extension storage." },
];

export function PrivacyBand() {
  return (
    <section id="privacy" className="bg-ink py-20 text-on-ink md:py-28">
      <div className="page-frame grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-3">
          <BrandMark size={72} tone="paper" />
        </div>
        <div className="lg:col-span-9">
          <h2 className="display max-w-4xl text-5xl md:text-7xl">
            Nothing leaves your browser.
          </h2>
          <dl className="mt-14 grid gap-8 border-t border-on-ink-muted pt-8 md:grid-cols-3 md:gap-6">
            {FACTS.map((fact) => (
              <div key={fact.title}>
                <dt className="mono-label text-on-ink">{fact.title}</dt>
                <dd className="mt-3 text-on-ink-muted">{fact.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
