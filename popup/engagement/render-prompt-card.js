const CARD_COPY = {
  review: {
    label: "Review",
    text: "Enjoying WebToMarkdown? A quick review helps other people find it.",
    answers: [
      { type: "review-rate", label: "Rate WebToMarkdown", className: "primary-button" },
      { type: "review-not-now", label: "Not now", className: "secondary-button" },
      { type: "review-already-did", label: "I already did", className: "text-button" }
    ]
  },
  share: {
    label: "Share",
    text: "Know someone who copies docs into an LLM or notes app? Share WebToMarkdown.",
    answers: [
      { type: "share-copy", label: "Copy link", className: "primary-button" },
      { type: "share-dismiss", label: "Not now", className: "secondary-button" }
    ]
  }
};

function createAnswerButton({ type, label, className }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.dataset.promptAnswer = type;
  button.textContent = label;
  return button;
}

// Renders the active prompt (from getActivePrompt) into the slot, or empties
// the slot when there is none. Answers are wired by bindPromptAnswers.
export function renderPromptCard(slot, activePrompt) {
  const copy = activePrompt ? CARD_COPY[activePrompt.card] : null;

  if (!copy) {
    slot.replaceChildren();
    return;
  }

  const card = document.createElement("section");
  card.className = "prompt-card";
  card.dataset.promptCard = activePrompt.card;
  card.setAttribute("aria-label", copy.label);

  const label = document.createElement("p");
  label.className = "prompt-card-label";
  label.textContent = copy.label;

  const text = document.createElement("p");
  text.className = "prompt-card-text";
  text.textContent = copy.text;

  const actions = document.createElement("div");
  actions.className = "prompt-card-actions";

  for (const answer of copy.answers) {
    if (answer.type === "review-already-did" && !activePrompt.offerAlreadyDid) {
      continue;
    }
    actions.append(createAnswerButton(answer));
  }

  card.append(label, text, actions);
  slot.replaceChildren(card);
}
