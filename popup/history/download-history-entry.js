import { buildMarkdownFilename } from "../../shared/files/build-markdown-filename.js";
import { downloadMarkdownFile } from "../../shared/files/download-markdown-file.js";

// Saves a history entry as a .md file named after its page.
export async function downloadHistoryEntry(entry) {
  const filename = buildMarkdownFilename(entry);
  downloadMarkdownFile(entry.markdown, filename);
  return `Saved ${filename}.`;
}
