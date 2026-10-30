import { renderSettingsForm } from "../../shared/settings/render-settings-form.js";
import { loadSettingsForm } from "../../shared/settings/load-settings-form.js";
import { bindSettingsAutosave } from "../../shared/settings/bind-settings-autosave.js";
import { renderStatus } from "../render-status.js";

// Sets up the settings view once. Values reload each time the view is shown,
// so changes made on the options page show up here too.
export function mountSettingsView(section) {
  const form = section.querySelector("[data-settings-form]");
  const list = section.querySelector("[data-settings-list]");
  const status = section.querySelector("[data-settings-status]");

  renderSettingsForm(list);

  bindSettingsAutosave(form, ({ ok }) => {
    if (ok) {
      renderStatus(status, "Saved.", "success");
    } else {
      renderStatus(status, "Settings could not be saved.", "error");
    }
  });

  section.addEventListener("popup-view-shown", async () => {
    renderStatus(status, "Changes save as you go.");
    try {
      await loadSettingsForm(form);
    } catch {
      renderStatus(status, "Settings could not be loaded.", "error");
    }
  });
}
