// "Not now" on the share card. The share card never comes back.
export function answerShareDismiss(state) {
  return {
    ...state,
    activeCard: state.activeCard === "share" ? null : state.activeCard,
    share: { ...state.share, done: true }
  };
}
