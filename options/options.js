import { renderSettingsForm } from "../shared/settings/render-settings-form.js";
import { loadSettingsForm } from "../shared/settings/load-settings-form.js";
import { bindSettingsAutosave } from "../shared/settings/bind-settings-autosave.js";
import { renderOptionsStatus } from "./render-options-status.js";

const form = document.querySelector("[data-settings-form]");
const list = document.querySelector("[data-settings-list]");
const statusElement = document.querySelector("#status");

renderSettingsForm(list);
bindSettingsAutosave(form, ({ ok }) => {
  if (ok) {
    renderOptionsStatus(statusElement, "Saved.");
  } else {
    renderOptionsStatus(statusElement, "Settings could not be saved.", "error");
  }
});

loadSettingsForm(form).catch(() => {
  renderOptionsStatus(statusElement, "Settings could not be loaded.", "error");
});
