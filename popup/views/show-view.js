// Shows the [data-view="name"] section, hides the other views, marks the
// matching footer button, and tells the shown view to refresh itself.
export function showView(name) {
  const views = document.querySelectorAll(".popup-view[data-view]");
  let shownView = null;

  for (const view of views) {
    const isShown = view.dataset.view === name;
    view.hidden = !isShown;
    if (isShown) {
      shownView = view;
    }
  }

  for (const button of document.querySelectorAll("[data-open-view]")) {
    if (button.dataset.openView === name) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  }

  if (!shownView) {
    return;
  }

  shownView.closest(".popup-views")?.scrollTo(0, 0);
  shownView.querySelector("[data-view-heading]")?.focus({ preventScroll: true });
  shownView.dispatchEvent(new CustomEvent("popup-view-shown", { detail: { view: name } }));
}
