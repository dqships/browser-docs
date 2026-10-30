// After a row is removed, moves focus to the row now at the same position (or
// the last row), so keyboard users stay in the list. Falls back to fallback.
export function focusHistoryRow(listElement, index, fallback) {
  const rows = listElement.querySelectorAll(".history-row");
  const row = rows[Math.min(index, rows.length - 1)];
  const target = row?.querySelector("[data-history-action]") || fallback;

  target?.focus();
}
