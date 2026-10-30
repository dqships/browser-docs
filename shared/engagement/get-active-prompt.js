import { normalizePromptState } from "./normalize-prompt-state.js";

// The card to show, or null. "I already did" is offered on every showing of
// the review card except the first.
export function getActivePrompt(state) {
  const current = normalizePromptState(state);

  if (current.activeCard === "review") {
    return { card: "review", offerAlreadyDid: current.review.showings > 1 };
  }

  if (current.activeCard === "share") {
    return { card: "share" };
  }

  return null;
}
