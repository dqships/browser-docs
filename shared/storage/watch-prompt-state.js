import { ENGAGEMENT_PROMPTS_KEY } from "./engagement-prompts-repository.js";
import { normalizePromptState } from "../engagement/normalize-prompt-state.js";

// Calls onChange(state) whenever the prompt state changes in storage.local,
// whether the popup or the service worker wrote it.
export function watchPromptState(onChange) {
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && ENGAGEMENT_PROMPTS_KEY in changes) {
      onChange(normalizePromptState(changes[ENGAGEMENT_PROMPTS_KEY].newValue));
    }
  });
}
