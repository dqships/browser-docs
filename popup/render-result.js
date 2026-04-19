export function renderResult(panel, preview, wordCount, charCount, result) {
  panel.classList.remove("hidden");
  preview.value = result.markdown.slice(0, 4000);
  wordCount.textContent = String(result.stats.wordCount);
  charCount.textContent = String(result.stats.charCount);
}
