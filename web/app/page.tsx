"use client";

import { useEffect, useRef } from "react";
import { LandingScreenshotPreview } from "@/app/landing-screenshot-preview";
import { SiteHeader } from "@/app/site-header";
import { SiteFooter } from "@/app/site-footer";
import { site } from "@/lib/site";

const FEATURES = [
  {
    icon: "✂️",
    title: "Skip the sidebar and site clutter",
    description:
      "Pulls the readable part of the page instead of copying nav, sidebars, cookie prompts, feedback widgets, and footer clutter.",
  },
  {
    icon: "##",
    title: "Keep headings, lists, and tables",
    description:
      "Preserves the structure you need from docs, articles, release notes, blog posts, and reference pages.",
  },
  {
    icon: "⌘",
    title: "Copy from the popup, menu, or shortcut",
    description:
      "Use whichever entry point fits the moment and keep reading.",
  },
  {
    icon: "⚙️",
    title: "Choose what gets copied",
    description:
      "Add title headings, source links, frontmatter, table support, or more aggressive pruning from local settings.",
  },
  {
    icon: "🔒",
    title: "Works locally in your browser",
    description:
      "No account, no upload, no hidden sync. The page stays on your machine.",
  },
  {
    icon: "🧠",
    title: "Stays focused on the job",
    description:
      "Open the page, copy it, paste it, move on. That focus keeps the extension fast and easy to trust.",
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Open any readable page",
    description:
      "Works best on pages with a clear main content area, including docs, articles, release notes, blog posts, and reference pages.",
  },
  {
    step: "02",
    title: "Copy it in one step",
    description:
      "Use the popup, page menu, or shortcut to grab the page without manual cleanup.",
  },
  {
    step: "03",
    title: "Paste it where you need it",
    description:
      "Drop the Markdown into notes, prompts, tickets, or internal docs and keep moving.",
  },
];

const TRUST_POINTS = [
  "No account",
  "Works locally",
  "Readable pages",
];

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
              Browser extension for readable web pages
            </p>

            <h1 className="animate-fade-up delay-200 mt-6 max-w-4xl text-4xl font-bold leading-[1.02] tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl">
              Copy readable
              <br className="hidden sm:block" /> web pages as Markdown.
            </h1>

            <p className="animate-fade-up delay-300 mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
              {site.name} grabs the main content area, leaves the page chrome
              behind, and puts clean Markdown on your clipboard. Docs are a
              strong fit, but they are not the only fit.
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

          <LandingScreenshotPreview />
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
            <p className="section-kicker">Built for readable pages</p>
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl">
              Built for the readable part
              <br className="hidden sm:block" /> of the web page.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary">
              {site.name} is for the part of the page you actually want to
              keep. That includes docs, but also articles, release notes, blog
              posts, and other readable pages with a clear main content area.
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
              The whole point is to make copying a readable page feel faster than
              cleaning one up by hand.
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
            <p className="section-kicker !mb-3">Why it stays simple</p>
            <h3 className="text-2xl font-semibold text-text-primary">
              No account. No upload. No extra layer to manage.
            </h3>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary">
              The page is processed locally in your browser. {site.name} does
              not try to be a dashboard, an agent platform, or a research
              workspace. It copies the readable part of the page you are on and
              gets out of the way.
            </p>
          </div>
        </div>
      </section>

      <section id="cta" className="cta-shell px-6 py-24 text-center md:py-32">
        <div className="max-w-3xl mx-auto">
          <div ref={addRevealRef} className="reveal">
            <p className="section-kicker">Ready</p>
            <h2 className="text-3xl font-bold text-text-primary sm:text-4xl md:text-5xl">
              Stop fixing copied pages
              <br className="hidden sm:block" /> by hand.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary">
              Install {site.name} and copy readable web pages as Markdown the
              moment you need them.
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
