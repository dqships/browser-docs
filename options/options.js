import { getSettings, saveSettings } from "../shared/storage/settings-repository.js";

const form = document.querySelector("#settings-form");
const statusElement = document.querySelector("#status");

initialize();

async function initialize() {
  const settings = await getSettings();

  for (const [key, value] of Object.entries(settings)) {
    const input = document.querySelector(`#${key}`);
    if (input instanceof HTMLInputElement) {
      input.checked = Boolean(value);
    }
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const settings = Object.fromEntries(
    Array.from(formData.keys()).map((key) => [key, true])
  );

  const savedSettings = {
    aggressivePruning: false,
    includeFrontmatter: false,
    includeSourceLink: false,
    includeTitleHeading: false,
    preserveTables: false,
    ...settings
  };

  await saveSettings(savedSettings);
  statusElement.textContent = "Settings saved.";
});
