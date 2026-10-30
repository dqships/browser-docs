import { SHARE_PROMPT_AT } from "../constants/prompt-schedule.js";

// One more successful copy or download. A card that is still waiting for an
// answer stays up. Otherwise the review card comes first when it is due, and
// the share card can only appear on a success that did not raise it.
export function recordPromptSuccess(state) {
  const next = {
    ...state,
    successCount: state.successCount + 1,
    review: { ...state.review },
    share: { ...state.share }
  };

  if (next.activeCard) {
    return next;
  }

  if (!next.review.done && next.successCount >= next.review.nextAt) {
    next.activeCard = "review";
    next.review.showings += 1;
    return next;
  }

  if (!next.share.done && (next.successCount >= SHARE_PROMPT_AT || next.review.done)) {
    next.activeCard = "share";
  }

  return next;
}
