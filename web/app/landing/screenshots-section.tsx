import Image from "next/image";
import { LandingSection } from "@/app/landing/landing-section";

const FIGURES = [
  {
    number: 1,
    src: "/source/browser/context-menu-toast.png",
    alt: "Readable web page with the WebToMarkdown page menu action and a copy confirmation toast",
    width: 1440,
    height: 1533,
    caption: "Copying from the page menu. The toast confirms what was copied.",
    className: "md:col-span-6",
    frameClassName: "aspect-[4/3]",
  },
  {
    number: 2,
    src: "/source/popup/popup-success.png",
    alt: "WebToMarkdown popup with Copy Current Page and Download .md buttons, showing copied Markdown ready to paste",
    width: 360,
    height: 600,
    caption: "The popup, after a copy. Copy or download, and a preview shows exactly what you got.",
    className: "md:col-span-3",
    frameClassName: "aspect-[4/3] md:aspect-auto md:h-full",
  },
];

export function ScreenshotsSection() {
  return (
    <LandingSection id="screenshots" index="04" label="In the browser">
      <div className="grid gap-10 md:grid-cols-9 md:gap-6">
        {FIGURES.map((figure) => (
          <figure key={figure.number} className={`flex flex-col ${figure.className}`}>
            <div
              className={`relative overflow-hidden border border-ink bg-paper-deep ${figure.frameClassName}`}
            >
              <Image
                src={figure.src}
                alt={figure.alt}
                fill
                sizes="(min-width: 1024px) 40rem, 100vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="mt-3 font-mono text-xs text-ink-muted">
              Fig. {figure.number} — {figure.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </LandingSection>
  );
}
