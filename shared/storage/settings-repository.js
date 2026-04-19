import { DEFAULT_SETTINGS } from "../constants/default-settings.js";

export async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
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

  await chrome.storage.sync.set(nextSettings);
  return nextSettings;
}
