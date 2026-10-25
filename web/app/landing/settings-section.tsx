import { LandingSection } from "@/app/landing/landing-section";

/** Mirrors shared/constants/default-settings.js and options/options.html. */
const SETTINGS = [
  {
    key: "aggressivePruning",
    name: "Aggressive pruning",
    description:
      "Remove sidebars, toolbars, feedback widgets, cookie prompts, and similar chrome.",
  },
  {
    key: "includeFrontmatter",
    name: "Include frontmatter",
    description: "Add title, source URL, and capture time as YAML frontmatter.",
  },
  {
    key: "includeTitleHeading",
    name: "Include title heading",
    description:
      "Insert a top-level Markdown heading when the page does not already have one.",
  },
  {
    key: "includeSourceLink",
    name: "Include source link",
    description: "Add a plain source URL line near the top of the document.",
  },
  {
    key: "preserveTables",
    name: "Preserve tables",
    description: "Convert HTML tables into Markdown pipe tables where possible.",
  },
];

export function SettingsSection() {
  return (
    <LandingSection id="settings" index="03" label="Settings">
      <h2 className="display max-w-3xl text-4xl md:text-6xl">
        Five switches. All on by default.
      </h2>
      <p className="mt-6 max-w-2xl text-lg text-ink-soft">
        Decide what wraps the content you copy. Settings are stored in your
        browser and apply to every copy.
      </p>

      <dl className="mt-14 border-t border-ink">
        {SETTINGS.map((setting) => (
          <div
            key={setting.key}
            className="grid gap-2 border-b border-rule py-5 md:grid-cols-9 md:gap-6"
          >
            <dt className="flex items-center gap-3 font-bold md:col-span-3">
              <span
                className="flex h-5 w-5 flex-none items-center justify-center border border-ink bg-ink"
                aria-hidden="true"
              >
                <span className="h-2 w-2 bg-signal" />
              </span>
              {setting.name}
            </dt>
            <dd className="text-ink-soft md:col-span-4">{setting.description}</dd>
            <dd className="hidden font-mono text-xs text-ink-muted md:col-span-2 md:block md:text-right">
              {setting.key}
            </dd>
          </div>
        ))}
      </dl>
    </LandingSection>
  );
}
