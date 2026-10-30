import { getPromptState, savePromptState } from "../storage/engagement-prompts-repository.js";
import { advancePromptSchedule } from "./advance-prompt-schedule.js";

// Reads the stored schedule, applies one event, saves, and returns the result.
export async function applyPromptEvent(event) {
  const state = await getPromptState();
  const next = advancePromptSchedule(state, event);
  await savePromptState(next);
  return next;
}
