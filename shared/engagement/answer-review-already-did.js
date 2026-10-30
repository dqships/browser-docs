// "I already did" ends the review prompt for good.
export function answerReviewAlreadyDid(state) {
  return {
    ...state,
    activeCard: state.activeCard === "review" ? null : state.activeCard,
    review: { ...state.review, done: true }
  };
}
