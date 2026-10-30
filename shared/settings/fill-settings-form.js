import { SETTING_DEFINITIONS } from "../constants/setting-definitions.js";

// Copies stored setting values into the form's checkboxes.
export function fillSettingsForm(form, settings, definitions = SETTING_DEFINITIONS) {
  for (const { key } of definitions) {
    const input = form.elements.namedItem(key);
    if (input instanceof HTMLInputElement) {
      input.checked = Boolean(settings[key]);
    }
  }
}
