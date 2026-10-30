import { runPromptAnswer } from "./run-prompt-answer.js";

// Footer Rate opens the review page and counts as rated. Footer Share copies
// the store link and counts as shared.
export function bindFooterEngagementButtons(footer, statusElement) {
  footer.querySelector("[data-rate-button]")?.addEventListener("click", () => {
    void runPromptAnswer("review-rate", statusElement).catch(() => { });
  });

  footer.querySelector("[data-share-button]")?.addEventListener("click", () => {
    void runPromptAnswer("share-copy", statusElement).catch(() => { });
  });
}
