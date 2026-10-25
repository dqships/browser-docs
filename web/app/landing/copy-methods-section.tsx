import { LandingSection } from "@/app/landing/landing-section";
import { ShortcutKeys } from "@/app/landing/shortcut-keys";

const METHODS = [
  {
    number: "1",
    title: "Toolbar popup",
    description:
      "Click the icon, press Copy Current Page, and get a word count plus a preview of what was copied.",
    detail: <span className="font-mono text-sm">Copy Current Page</span>,
  },
  {
    number: "2",
    title: "Page menu",
    description:
      "Right-click anywhere on the page and choose the copy action. A small toast confirms it worked.",
    detail: <span className="font-mono text-sm">Right-click → Copy page as Markdown</span>,
  },
  {
    number: "3",
    title: "Keyboard shortcut",
    description:
      "Never leave the keyboard. Rebind it in your browser's extension shortcut settings.",
    detail: <ShortcutKeys />,
  },
];

export function CopyMethodsSection() {
  return (
    <LandingSection id="copy" index="02" label="How to copy">
      <h2 className="display max-w-3xl text-4xl md:text-6xl">
        Three ways in. Same result.
      </h2>

      <ol className="mt-14 grid border-t border-ink md:grid-cols-3">
        {METHODS.map((method) => (
          <li
            key={method.number}
            className="border-b border-rule py-8 md:border-b-0 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
          >
            <span className="display block text-7xl text-ink">
              {method.number}
            </span>
            <h3 className="mt-6 text-xl font-bold">{method.title}</h3>
            <p className="mt-3 text-ink-soft">{method.description}</p>
            <div className="mt-6">{method.detail}</div>
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}
