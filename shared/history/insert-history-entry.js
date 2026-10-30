// Puts entry at the top of a newest-first list and keeps at most `limit`
// entries. Copying the same URL again with identical Markdown moves the old
// entry to the top (keeping its id) instead of adding a duplicate.
export function insertHistoryEntry(entries, entry, limit) {
  const duplicate = entries.find(
    (existing) => existing.url === entry.url && existing.markdown === entry.markdown
  );
  const others = entries.filter((existing) => existing !== duplicate);
  const top = duplicate ? { ...entry, id: duplicate.id } : entry;

  return [top, ...others].slice(0, Math.max(0, limit));
}
