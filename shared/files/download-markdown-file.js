// Saves Markdown as a file from an extension page (the popup). Pages the
// extension does not own use the injected "downloadMarkdown" content module.
export function downloadMarkdownFile(markdown, filename) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = filename;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Revoking in the same task can cancel the download in Firefox.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
