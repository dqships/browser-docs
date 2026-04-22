"use client";

import { useEffect, useRef } from "react";
import { SiteHeader } from "@/app/site-header";
import { SiteFooter } from "@/app/site-footer";
import { site } from "@/lib/site";

const FEATURES = [
  {
    icon: "✂️",
    title: "Cuts the page chrome",
    description:
      "Targets the primary docs content instead of copying nav, sidebars, cookie banners, feedback widgets, and footer clutter.",
  },
  {
    icon: "##",
    title: "Keeps Markdown structure",
    description:
      "Preserves headings, paragraphs, nested lists, links, blockquotes, code blocks, images, and tables where possible.",
  },
  {
    icon: "⌘",
    title: "Fast ways to trigger it",
    description:
      "Copy from the popup, the page context menu, or the keyboard shortcut without breaking your reading flow.",
  },
  {
    icon: "⚙️",
    title: "Choose what gets exported",
    description:
      "Include frontmatter, source links, title headings, aggressive pruning, and table support from lightweight local settings.",
  },
  {
    icon: "🔒",
    title: "Runs locally",
    description:
      "The core flow works in your browser with no account, no hidden sync, and no server-side conversion step for the copied page.",
  },
  {
    icon: "🧠",
    title: "Built for notes and LLM workflows",
    description:
      "Paste usable Markdown into prompts, local knowledge bases, README drafts, PKM tools, or a documentation archive.",
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Open any documentation page",
    description:
      "Use it on common docs layouts built with article, main, or markdown-rendered HTML.",
  },
  {
    step: "02",
    title: "Trigger ${site.name}",
    description:
      "Run the popup, right-click the page, or use the shortcut to capture the current page in one action.",
  },
  {
    step: "03",
    title: "Paste clean Markdown anywhere",
    description:
      "Drop the result into notes, prompts, tickets, docs, or a local RAG pipeline without hand-cleaning first.",
  },
];

const TRUST_POINTS = [
  "No account required",
  "Copies the current page only",
  "Made for docs, prompts, and notes",
];

const SOURCE_PAGE_LINES = [
  "Sidebar navigation",
  "Page title and intro",
  "Code examples",
  "Cookie prompt",
  "Feedback widget",
];

const MARKDOWN_PREVIEW = `# Getting Started

Use ${site.name} to capture the readable docs content without the surrounding site chrome.

## Install
- Open the extension
- Copy as Markdown
- Paste into notes or prompts

| Setting | Effect |
| --- | --- |
| Source link | Keep citation |
| Frontmatter | Keep metadata |`;

export default function Home() {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    revealRefs.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (element: HTMLElement | null) => {
    if (element && !revealRefs.current.includes(element)) {
      revealRefs.current.push(element);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-background font-sans">
      <SiteHeader variant="landing" />

      <section
        id="hero"
        className="hero-grid relative overflow-hidden px-6 pt-32 pb-24 md:pt-40 md:pb-32"
      >
        <div className="max-w-6xl mx-auto w-full grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
          <div className="relative z-10">
            <p className="eyebrow-badge animate-fade-up delay-100">
              Browser extension for documentation pages
            </p>

            <h1 className="animate-fade-up delay-200 mt-6 max-w-4xl text-4xl font-bold leading-[1.02] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Copy docs as
              <br className="hidden sm:block" /> clean Markdown.
            </h1>

            <p className="animate-fade-up delay-300 mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              {site.name} finds the main article, skips the page chrome, and
              copies structured Markdown in one step. It is built for notes,
              local knowledge bases, archives, and LLM prompts.
            </p>

            <div className="animate-fade-up delay-400 mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                id="hero-cta"
                href={site.ctaUrl}
                className="btn-primary text-lg animate-pulse-glow"
              >
                {site.ctaLabel}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>

              <a href="#features" className="btn-secondary">
                See how it works
              </a>
            </div>

            <div className="animate-fade-up delay-500 mt-8 flex flex-wrap gap-3">
              {TRUST_POINTS.map((point) => (
                <span key={point} className="stat-badge">
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-fade-up delay-500 hero-preview-stack">
            <article className="preview-card preview-card-source">
              <p className="preview-label">Before</p>
              <h2 className="preview-title">A typical docs page</h2>
              <div className="doc-wireframe">
                <span className="doc-pill">Sidebar</span>
                <span className="doc-pill">TOC</span>
                <span className="doc-pill">Feedback</span>
              </div>
              <div className="doc-lines" aria-hidden="true">
                {SOURCE_PAGE_LINES.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
              <p className="preview-copy">
                Useful content is mixed with interface clutter, widgets, and
                layout chrome you do not want in your Markdown output.
              </p>
            </article>

            <article className="preview-card preview-card-markdown">
              <p className="preview-label">After</p>
              <h2 className="preview-title">Markdown you can use</h2>
              <pre className="markdown-preview">
                <code>{MARKDOWN_PREVIEW}</code>
              </pre>
            </article>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section
        id="features"
        className="relative px-6 py-24 md:py-32"
        style={{ background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div ref={addRevealRef} className="reveal text-center mb-16">
            <p className="section-kicker">Why people use it</p>
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl">
              Built to copy documentation
              <br className="hidden sm:block" /> without the cleanup pass.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary">
              ${site.name} focuses on the job developers actually have:
              turning a live docs page into readable Markdown that is ready for
              notes, prompts, and internal docs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <article
                ref={addRevealRef}
                key={feature.title}
                className="reveal card feature-card"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="mb-2 text-lg font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="relative px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div ref={addRevealRef} className="reveal text-center mb-16">
            <p className="section-kicker">Workflow</p>
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl">
              Open the page.
              <br className="hidden sm:block" /> Trigger the extension.
              <br className="hidden md:block" /> Paste the result.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary">
              The flow stays intentionally small so copying a docs page feels
              faster than cleaning one up by hand.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {WORKFLOW.map((item, index) => (
              <article
                ref={addRevealRef}
                key={item.step}
                className="reveal workflow-card"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <span className="workflow-step">{item.step}</span>
                <h3 className="mt-5 text-xl font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div ref={addRevealRef} className="reveal trust-panel mt-10">
            <p className="section-kicker !mb-3">Trust boundary</p>
            <h3 className="text-2xl font-semibold text-text-primary">
              No hidden sync. No surprise account wall.
            </h3>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary">
              The core product is a focused utility: copy the current page as
              Markdown, keep the important structure, and move on. That keeps
              the extension understandable, fast, and easy to trust.
            </p>
          </div>
        </div>
      </section>

      <section id="cta" className="cta-shell px-6 py-24 text-center md:py-32">
        <div className="max-w-3xl mx-auto">
          <div ref={addRevealRef} className="reveal">
            <p className="section-kicker">Ready</p>
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl">
              Stop cleaning pasted docs
              <br className="hidden sm:block" /> by hand.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary">
              Install ${site.name} and turn documentation pages into usable
              Markdown the moment you need them.
            </p>

            <a
              id="cta-button"
              href={site.ctaUrl}
              className="btn-primary mt-10 text-lg animate-pulse-glow"
            >
              {site.ctaLabel}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
