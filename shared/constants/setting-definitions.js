// Ordered list of user-facing settings. The popup settings view and the
// options page both render their checkbox lists from this array. To add a
// setting, append a definition here and a default in default-settings.js.
export const SETTING_DEFINITIONS = Object.freeze([
  Object.freeze({
    key: "aggressivePruning",
    label: "Aggressive pruning",
    description: "Remove sidebars, toolbars, feedback widgets, cookie prompts, and similar chrome."
  }),
  Object.freeze({
    key: "includeFrontmatter",
    label: "Include frontmatter",
    description: "Add title, source URL, and capture time as YAML frontmatter."
  }),
  Object.freeze({
    key: "includeTitleHeading",
    label: "Include title heading",
    description: "Insert a top-level Markdown heading when it is not already present."
  }),
  Object.freeze({
    key: "includeSourceLink",
    label: "Include source link",
    description: "Add a plain source URL line near the top of the document."
  }),
  Object.freeze({
    key: "preserveTables",
    label: "Preserve tables",
    description: "Convert HTML tables into Markdown pipe tables where possible."
  })
]);
