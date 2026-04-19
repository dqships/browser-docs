export function renderStatus(element, message, kind = "info") {
  element.dataset.kind = kind;
  element.textContent = message;
}
