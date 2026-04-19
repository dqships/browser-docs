export async function copyText(text) {
  if (!text) {
    throw new Error("Clipboard write failed.");
  }

  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.left = "-9999px";
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const didCopy =
      typeof document.execCommand === "function" && document.execCommand("copy");
    textarea.remove();

    if (!didCopy) {
      throw new Error("Clipboard write failed.");
    }
  }
}
