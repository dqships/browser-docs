import { getSettings } from "../storage/settings-repository.js";
import { fillSettingsForm } from "./fill-settings-form.js";

// Reads the stored settings and shows them in the form.
export async function loadSettingsForm(form) {
  fillSettingsForm(form, await getSettings());
}
