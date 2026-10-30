import { REVIEW_PROMPT_SNOOZE } from "../constants/prompt-schedule.js";

// "Not now" on the review card hides it until five more successes.
export function answerReviewNotNow(state) {
  if (state.activeCard !== "review") {
    return state;
  }

  return {
    ...state,
    activeCard: null,
    review: { ...state.review, nextAt: state.successCount + REVIEW_PROMPT_SNOOZE }
  };
}
