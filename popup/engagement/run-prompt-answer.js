import { applyPromptEvent } from "../../shared/engagement/apply-prompt-event.js";
import { openReviewPage } from "./open-review-page.js";
import { copyStoreLink } from "./copy-store-link.js";
import { renderStatus } from "../render-status.js";

// Carries out one answer, from a card or the footer, then records it. Rating
// saves first because opening a tab can close the popup.
export async function runPromptAnswer(type, statusElement) {
  if (type === "review-rate") {
    await applyPromptEvent({ type });
    await openReviewPage();
    return;
  }

  if (type === "share-copy") {
    try {
      await copyStoreLink();
    } catch {
      renderStatus(statusElement, "The link could not be copied.", "error");
      return;
    }
    renderStatus(statusElement, "Link copied.", "success");
  }

  await applyPromptEvent({ type });
}
