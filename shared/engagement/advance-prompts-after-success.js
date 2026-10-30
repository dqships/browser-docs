import { applyPromptEvent } from "./apply-prompt-event.js";
import { getActivePrompt } from "./get-active-prompt.js";
import { openActionPopup } from "../browser/open-action-popup.js";

// Counts a success. When it came from the context menu or the shortcut and a
// card is waiting, try to open the popup so the card is seen. The popup
// renders the card itself from storage.
export async function advancePromptsAfterSuccess({ source }) {
  const next = await applyPromptEvent({ type: "success" });

  if (source !== "popup" && getActivePrompt(next)) {
    await openActionPopup();
  }
}
