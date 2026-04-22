import Image from "next/image";

const PREVIEW_IMAGES = {
  browser: {
    alt: "Readable web page with the WebToMarkdown page menu action visible",
    height: 1509,
    src: "/source/browser/context-menu-toast.png",
    width: 1440,
  },
  popup: {
    alt: "WebToMarkdown popup showing copied Markdown ready to paste",
    height: 900,
    src: "/source/popup/popup-success.png",
    width: 420,
  },
} as const;

export function LandingScreenshotPreview() {
  return (
    <div className="animate-fade-up delay-500 hero-preview-stack">
      <article className="preview-card preview-card-browser">
        <p className="preview-label">Before</p>
        <h2 className="preview-title">The page you are already reading</h2>
        <div className="preview-screenshot-frame preview-screenshot-frame-browser">
          <Image
            src={PREVIEW_IMAGES.browser.src}
            alt={PREVIEW_IMAGES.browser.alt}
            fill
            priority
            sizes="(min-width: 1280px) 36rem, (min-width: 1024px) 42vw, 100vw"
            className="preview-screenshot"
          />
        </div>
        <p className="preview-copy">
          Trigger the extension from the page menu or shortcut while you read.
        </p>
      </article>

      <article className="preview-card preview-card-popup">
        <p className="preview-label">After</p>
        <h2 className="preview-title">Copied and ready to paste</h2>
        <div className="preview-screenshot-frame preview-screenshot-frame-popup">
          <Image
            src={PREVIEW_IMAGES.popup.src}
            alt={PREVIEW_IMAGES.popup.alt}
            fill
            priority
            sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 22vw, 70vw"
            className="preview-screenshot preview-screenshot-popup"
          />
        </div>
        <p className="preview-copy">
          The popup shows the cleaned result so you can copy it and move on.
        </p>
      </article>
    </div>
  );
}
