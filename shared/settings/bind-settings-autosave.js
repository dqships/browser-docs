import { saveSettings } from "../storage/settings-repository.js";
import { readSettingsForm } from "./read-settings-form.js";

// Saves the whole form whenever a setting changes. onResult receives
// { ok: true } after a save, or { ok: false, error } when it fails.
export function bindSettingsAutosave(form, onResult) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  form.addEventListener("change", async () => {
    try {
      await saveSettings(readSettingsForm(form));
      onResult({ ok: true });
    } catch (error) {
      onResult({ ok: false, error });
    }
  });
}
