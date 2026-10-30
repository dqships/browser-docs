import { runPromptAnswer } from "./run-prompt-answer.js";

// Wires the answer buttons of whatever card is in the slot. The card goes
// away when the stored state changes, so nothing is re-rendered here.
export function bindPromptAnswers(slot, statusElement) {
  slot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-prompt-answer]");
    if (!button) {
      return;
    }

    void runPromptAnswer(button.dataset.promptAnswer, statusElement).catch(() => {
      /* Leave the card up so the user can try again. */
    });
  });
}
