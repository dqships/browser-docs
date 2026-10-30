// Turns an extraction result ({ markdown, meta, stats }) into a copy history
// entry. id and copiedAt are passed in so the function stays pure.
export function buildHistoryEntry(result, { id, copiedAt }) {
  const meta = result?.meta || {};
  const stats = result?.stats || {};
  const markdown = String(result?.markdown || "");

  return {
    id,
    title: String(meta.title || "").trim(),
    url: String(meta.url || ""),
    markdown,
    wordCount: Number.isFinite(stats.wordCount) ? stats.wordCount : 0,
    charCount: Number.isFinite(stats.charCount) ? stats.charCount : markdown.length,
    copiedAt
  };
}
