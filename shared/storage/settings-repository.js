import { DEFAULT_SETTINGS } from "../constants/default-settings.js";

export async function getSettings() {
  const stored = await browser.storage.sync.get(DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...stored
  };
}

export async function saveSettings(partialSettings) {
  const nextSettings = {
    ...DEFAULT_SETTINGS,
    ...partialSettings
  };

  await browser.storage.sync.set(nextSettings);
  return nextSettings;
}
