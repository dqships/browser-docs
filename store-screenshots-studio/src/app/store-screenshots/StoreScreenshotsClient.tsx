"use client";

import { useRef, useState } from "react";
import { PreviewPanel } from "@/components/preview-panel";
import { browserStoreSlideSet } from "@/data/browser-store-slide-set";
import { macosStoreSlideSet } from "@/data/macos-store-slide-set";
import { captureSlide } from "@/lib/capture-slide";
import { createSlideKey } from "@/lib/create-slide-key";
import { exportSlideSet } from "@/lib/export-slide-set";
import type {
  SlideDefinition,
  SlideSetDefinition,
  StoreSize,
} from "@/types/slide-definition";

const slideSets = [browserStoreSlideSet, macosStoreSlideSet] as const;

function buttonLabel(size: StoreSize) {
  return `${size.width}x${size.height}`;
}

export default function StoreScreenshotsClient() {
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [status, setStatus] = useState(
    "Ready. Export browser-store and macOS-store ZIPs from the current layouts.",
  );

  async function getSource(setId: string, slug: string) {
    const key = createSlideKey(setId, slug);
    const element = slideRefs.current[key];

    if (!element) {
      throw new Error(`Missing export canvas for ${key}.`);
    }

    return captureSlide(element);
  }

  async function runExport(setDefinition: SlideSetDefinition, size: StoreSize) {
    const nextBusyKey = `${setDefinition.id}:${size.width}x${size.height}`;
    setBusyKey(nextBusyKey);
    setStatus(`Exporting ${setDefinition.label} at ${size.width}x${size.height}...`);

    try {
      await exportSlideSet({
        getSource: (slug) => getSource(setDefinition.id, slug),
        setDefinition,
        size,
      });

      setStatus(`Downloaded ${setDefinition.label} at ${size.width}x${size.height}.`);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Export failed for the selected size.",
      );
    } finally {
      setBusyKey(null);
    }
  }

  async function runExportAllMacSizes() {
    const nextBusyKey = `${macosStoreSlideSet.id}:all`;
    setBusyKey(nextBusyKey);
    setStatus("Exporting all accepted Mac App Store sizes...");

    try {
      for (const size of macosStoreSlideSet.storeTargets) {
        await exportSlideSet({
          getSource: (slug) => getSource(macosStoreSlideSet.id, slug),
          setDefinition: macosStoreSlideSet,
          size,
        });
      }

      setStatus("Downloaded Mac App Store ZIPs for all accepted 16:10 sizes.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Export failed for the Mac App Store sizes.",
      );
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <main className="min-h-screen px-6 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-[1780px] flex-col gap-8">
        <header className="rounded-[32px] border border-cyan-400/14 bg-slate-950/70 p-8 shadow-[0_32px_96px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="m-0 font-mono text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">
                WebToMarkdown screenshot studio
              </p>
              <h1 className="mt-4 mb-3 font-heading text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Browser-store and macOS-store screenshots,
                <br />
                rebuilt from the current extension UI.
              </h1>
              <p className="m-0 max-w-3xl text-lg leading-8 text-slate-300">
                This isolated Next.js tool reuses the extension icon, popup states,
                options screen, and browser test screenshots from the repository.
                The browser set is capped at five 1280x800 images for Chrome and
                Firefox. The macOS set exports Apple&apos;s accepted 16:10 sizes and
                includes the native Safari wrapper screen Apple expects.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-7 text-slate-300">
              <strong className="block font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                Current assumptions
              </strong>
              Existing brand palette: dark navy + cyan accent.
              <br />
              Existing font direction: Inter, Space Grotesk, JetBrains Mono.
              <br />
              Existing sources: `shared/icon.png` and `docs/testing/reports/report-2/screenshots`.
            </div>
          </div>
          <p className="mt-6 mb-0 rounded-2xl border border-cyan-400/14 bg-cyan-400/[0.06] px-4 py-3 text-sm text-cyan-100">
            {status}
          </p>
        </header>

        {slideSets.map((setDefinition) => (
          <section
            key={setDefinition.id}
            className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_28px_84px_rgba(0,0,0,0.32)]"
          >
            <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <p className="m-0 font-mono text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                  {setDefinition.label}
                </p>
                <h2 className="mt-3 mb-2 font-heading text-4xl font-semibold tracking-tight text-white">
                  {setDefinition.summary}
                </h2>
                <p className="m-0 text-base leading-7 text-slate-300">
                  {setDefinition.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {setDefinition.storeTargets.map((size) => {
                  const currentKey = `${setDefinition.id}:${size.width}x${size.height}`;

                  return (
                    <button
                      key={currentKey}
                      className="rounded-full border border-cyan-300/24 bg-cyan-400/[0.08] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-100 transition hover:bg-cyan-400/[0.16] disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={busyKey !== null}
                      onClick={() => runExport(setDefinition, size)}
                      type="button"
                    >
                      {busyKey === currentKey ? "Exporting…" : `Export ${buttonLabel(size)}`}
                    </button>
                  );
                })}
                {setDefinition.id === macosStoreSlideSet.id ? (
                  <button
                    className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={busyKey !== null}
                    onClick={runExportAllMacSizes}
                    type="button"
                  >
                    {busyKey === `${macosStoreSlideSet.id}:all`
                      ? "Exporting…"
                      : "Export all Mac sizes"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {setDefinition.slides.map((slide) => (
                <PreviewPanel
                  key={createSlideKey(setDefinition.id, slide.slug)}
                  subtitle={slide.headline}
                  title={`${slide.name} · ${slide.slug}`}
                >
                  <slide.Component />
                </PreviewPanel>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div
        aria-hidden="true"
        style={{
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          position: "fixed",
          zIndex: -1,
        }}
      >
        {slideSets.map((setDefinition) =>
          setDefinition.slides.map((slide) => (
            <ExportNode
              key={createSlideKey(setDefinition.id, slide.slug)}
              setDefinition={setDefinition}
              slide={slide}
              slideRefs={slideRefs.current}
            />
          )),
        )}
      </div>
    </main>
  );
}

type ExportNodeProps = {
  setDefinition: SlideSetDefinition;
  slide: SlideDefinition;
  slideRefs: Record<string, HTMLDivElement | null>;
};

function ExportNode({
  setDefinition,
  slide,
  slideRefs,
}: ExportNodeProps) {
  const slideKey = createSlideKey(setDefinition.id, slide.slug);
  const SlideComponent = slide.Component;

  return (
    <div
      ref={(node) => {
        slideRefs[slideKey] = node;
      }}
      style={{
        left: "-9999px",
        opacity: 0,
        position: "absolute",
        top: 0,
      }}
    >
      <SlideComponent />
    </div>
  );
}
