// "Copy link" (card or footer Share). The share card never comes back.
export function answerShareCopy(state) {
  return {
    ...state,
    activeCard: state.activeCard === "share" ? null : state.activeCard,
    share: { ...state.share, done: true }
  };
}
