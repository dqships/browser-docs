import { SETTING_DEFINITIONS } from "../constants/setting-definitions.js";

// Reads every defined setting from the form's checkboxes.
export function readSettingsForm(form, definitions = SETTING_DEFINITIONS) {
  const settings = {};

  for (const { key } of definitions) {
    const input = form.elements.namedItem(key);
    if (input instanceof HTMLInputElement) {
      settings[key] = input.checked;
    }
  }

  return settings;
}
