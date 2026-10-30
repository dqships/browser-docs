import { normalizePromptState } from "./normalize-prompt-state.js";
import { recordPromptSuccess } from "./record-prompt-success.js";
import { answerReviewRate } from "./answer-review-rate.js";
import { answerReviewNotNow } from "./answer-review-not-now.js";
import { answerReviewAlreadyDid } from "./answer-review-already-did.js";
import { answerShareCopy } from "./answer-share-copy.js";
import { answerShareDismiss } from "./answer-share-dismiss.js";

const HANDLERS = {
  success: recordPromptSuccess,
  "review-rate": answerReviewRate,
  "review-not-now": answerReviewNotNow,
  "review-already-did": answerReviewAlreadyDid,
  "share-copy": answerShareCopy,
  "share-dismiss": answerShareDismiss
};

// Pure: (state, { type }) -> next state. Unknown events leave it unchanged.
export function advancePromptSchedule(state, event) {
  const current = normalizePromptState(state);
  const handler = HANDLERS[event?.type];
  return handler ? handler(current) : current;
}
