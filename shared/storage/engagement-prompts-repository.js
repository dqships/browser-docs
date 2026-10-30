import { normalizePromptState } from "../engagement/normalize-prompt-state.js";

export const ENGAGEMENT_PROMPTS_KEY = "engagementPrompts";

export async function getPromptState() {
  const stored = await browser.storage.local.get(ENGAGEMENT_PROMPTS_KEY);
  return normalizePromptState(stored[ENGAGEMENT_PROMPTS_KEY]);
}

export async function savePromptState(state) {
  await browser.storage.local.set({ [ENGAGEMENT_PROMPTS_KEY]: state });
}
