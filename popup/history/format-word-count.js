export function formatWordCount(count) {
  const value = Number.isFinite(count) ? count : 0;
  return `${value.toLocaleString()} ${value === 1 ? "word" : "words"}`;
}
