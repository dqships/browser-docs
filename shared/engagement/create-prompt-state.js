import { FIRST_REVIEW_PROMPT_AT } from "../constants/prompt-schedule.js";

// The prompt schedule on a fresh profile.
// successCount: successful copies and downloads so far.
// activeCard:   "review", "share", or null. Only one card shows at a time.
// review:       done (rated or "I already did"), the success count that next
//               raises the card, and how many times the card has been raised.
// share:        done once the share card was answered either way.
export function createPromptState() {
  return {
    successCount: 0,
    activeCard: null,
    review: { done: false, nextAt: FIRST_REVIEW_PROMPT_AT, showings: 0 },
    share: { done: false }
  };
}
