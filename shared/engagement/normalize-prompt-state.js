import { createPromptState } from "./create-prompt-state.js";

function toCount(value, fallback) {
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

// Turns whatever is in storage (nothing, an old shape, a bad value) into a
// complete prompt state.
export function normalizePromptState(stored) {
  const defaults = createPromptState();
  const source = stored && typeof stored === "object" ? stored : {};
  const review = source.review && typeof source.review === "object" ? source.review : {};
  const share = source.share && typeof source.share === "object" ? source.share : {};

  const state = {
    successCount: toCount(source.successCount, defaults.successCount),
    activeCard: source.activeCard === "review" || source.activeCard === "share" ? source.activeCard : null,
    review: {
      done: review.done === true,
      nextAt: toCount(review.nextAt, defaults.review.nextAt),
      showings: toCount(review.showings, defaults.review.showings)
    },
    share: { done: share.done === true }
  };

  if (state.activeCard && state[state.activeCard].done) {
    state.activeCard = null;
  }

  return state;
}
