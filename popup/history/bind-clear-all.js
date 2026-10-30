// "Clear all" asks inline ("Clear all? Yes / Cancel") before onConfirm runs.
// Returns a function that closes the confirm step without clearing.
export function bindClearAll({ startButton, confirmGroup, yesButton, cancelButton, onConfirm }) {
  function setConfirming(isConfirming) {
    startButton.hidden = isConfirming;
    confirmGroup.hidden = !isConfirming;
  }

  function cancel() {
    const hadFocus = confirmGroup.contains(document.activeElement);
    setConfirming(false);
    if (hadFocus) {
      startButton.focus();
    }
  }

  startButton.addEventListener("click", () => {
    setConfirming(true);
    cancelButton.focus();
  });

  cancelButton.addEventListener("click", cancel);

  confirmGroup.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  });

  yesButton.addEventListener("click", async () => {
    yesButton.disabled = true;
    try {
      await onConfirm();
    } finally {
      yesButton.disabled = false;
      setConfirming(false);
    }
  });

  return () => setConfirming(false);
}
