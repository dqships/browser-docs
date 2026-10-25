import { SAMPLE_SOURCE_URL } from "@/app/landing/sample-markdown";

function ChromeBlock({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`diagram-chrome diagram-hatch flex items-start border border-rule p-2 ${className}`}
    >
      <span className="diagram-chrome-label mono-label bg-paper px-1 text-[0.625rem] text-ink-soft line-through decoration-2">
        {label}
      </span>
    </div>
  );
}

function TextLine({ width }: { width: string }) {
  return <span className="block h-1.5 bg-ink-soft" style={{ width }} />;
}

/**
 * Wireframe of a typical web page: chrome on the outside, the readable
 * main content in the middle. The same 3 × 3 idea as the brand mark.
 */
export function PageSchematic() {
  return (
    <div className="flex h-full flex-col border border-ink bg-paper">
      <div className="flex items-center gap-2 border-b border-ink px-3 py-2">
        <span className="h-2 w-2 border border-ink" aria-hidden="true" />
        <span className="font-mono text-xs text-ink-muted truncate">
          {SAMPLE_SOURCE_URL.replace("https://", "")}
        </span>
      </div>

      <div className="grid flex-1 grid-cols-[1fr_2.4fr_1fr] grid-rows-[auto_1fr_auto] gap-1.5 p-1.5">
        <ChromeBlock label="Header" className="col-span-3 h-11" />
        <ChromeBlock label="Nav" />

        <div className="relative border-2 border-signal bg-paper p-3 sm:p-4">
          <span className="mono-label absolute -top-[2px] -right-[2px] bg-signal px-1.5 py-0.5 text-[0.625rem] text-ink">
            Main
          </span>
          <span className="block h-3.5 w-3/4 bg-ink" />
          <div className="mt-4 space-y-2">
            <TextLine width="92%" />
            <TextLine width="64%" />
          </div>
          <span className="mt-5 block h-2.5 w-1/2 bg-ink" />
          <ul className="mt-3 space-y-2">
            {["58%", "40%"].map((width) => (
              <li key={width} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-ink" />
                <TextLine width={width} />
              </li>
            ))}
          </ul>
          <div className="mt-5 flex h-10 items-center bg-ink px-2">
            <span className="block h-1.5 w-2/3 bg-paper-deep" />
          </div>
          <div className="mt-5 space-y-2">
            <TextLine width="86%" />
            <TextLine width="72%" />
            <TextLine width="38%" />
          </div>
        </div>

        <ChromeBlock label="Aside" />
        <ChromeBlock label="Footer" className="col-span-2 h-11" />
        <ChromeBlock label="Cookies" className="h-11" />
      </div>
    </div>
  );
}
