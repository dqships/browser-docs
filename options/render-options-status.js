export function renderOptionsStatus(element, message, kind = "success") {
  element.dataset.kind = kind;
  element.textContent = message;
}
