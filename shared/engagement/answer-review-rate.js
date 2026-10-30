// "Rate WebToMarkdown" (card or footer). The browser cannot tell whether a
// review was posted, so the click ends the review prompt for good.
export function answerReviewRate(state) {
  return {
    ...state,
    activeCard: state.activeCard === "review" ? null : state.activeCard,
    review: { ...state.review, done: true }
  };
}
