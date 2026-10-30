import { getPromptState } from "../../shared/storage/engagement-prompts-repository.js";
import { watchPromptState } from "../../shared/storage/watch-prompt-state.js";
import { getActivePrompt } from "../../shared/engagement/get-active-prompt.js";
import { renderPromptCard } from "./render-prompt-card.js";
import { bindPromptAnswers } from "./bind-prompt-answers.js";
import { bindFooterEngagementButtons } from "./bind-footer-engagement-buttons.js";

// Shows the waiting review or share card when the popup opens, and again
// whenever the schedule changes (a copy or download from this popup, or an
// answer), plus the footer Rate and Share buttons.
export function mountEngagementPrompts({ slot, footer, statusElement }) {
  bindPromptAnswers(slot, statusElement);
  bindFooterEngagementButtons(footer, statusElement);
  watchPromptState((state) => renderPromptCard(slot, getActivePrompt(state)));

  void getPromptState()
    .then((state) => renderPromptCard(slot, getActivePrompt(state)))
    .catch(() => { });
}
