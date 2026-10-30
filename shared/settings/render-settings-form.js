import { SETTING_DEFINITIONS } from "../constants/setting-definitions.js";

// Builds one checkbox row per setting definition inside listElement.
export function renderSettingsForm(listElement, definitions = SETTING_DEFINITIONS) {
  const rows = definitions.map((definition) => {
    const label = document.createElement("label");
    label.className = "setting";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `setting-${definition.key}`;
    input.name = definition.key;

    const text = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = definition.label;
    const description = document.createElement("small");
    description.textContent = definition.description;
    text.append(title, description);

    label.append(input, text);
    return label;
  });

  listElement.replaceChildren(...rows);
}
