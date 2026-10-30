import { LandingSection } from "@/app/landing/landing-section";
import { ShortcutKeys } from "@/app/landing/shortcut-keys";

const METHODS = [
  {
    number: "1",
    title: "Toolbar popup",
    description:
      "Click the icon and press Copy Current Page or Download .md. You get a word count, a preview, and the page saved to History.",
    detail: <span className="font-mono text-sm">Copy Current Page · Download .md</span>,
  },
  {
    number: "2",
    title: "Page menu",
    description:
      "Right-click anywhere on the page and choose to copy it or download it. A small toast confirms it worked.",
    detail: <span className="font-mono text-sm">Right-click → Copy or Download page as Markdown</span>,
  },
  {
    number: "3",
    title: "Keyboard shortcut",
    description:
      "Never leave the keyboard. Rebind it, or add a key for downloads, in your browser's extension shortcut settings.",
    detail: <ShortcutKeys />,
  },
];

export function CopyMethodsSection() {
  return (
    <LandingSection id="copy" index="02" label="How to copy">
      <h2 className="display max-w-3xl text-4xl md:text-6xl">
        Three ways in. Copy it or save it.
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
