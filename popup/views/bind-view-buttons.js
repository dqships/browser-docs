import { showView } from "./show-view.js";

// Footer buttons open their view; Back buttons return to the named view.
export function bindViewButtons(root = document) {
  for (const button of root.querySelectorAll("[data-open-view]")) {
    button.addEventListener("click", () => {
      showView(button.dataset.openView);
    });
  }

  for (const button of root.querySelectorAll("[data-back-view]")) {
    button.addEventListener("click", () => {
      showView(button.dataset.backView || "main");
    });
  }
}
