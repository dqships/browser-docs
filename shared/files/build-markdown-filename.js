const MAX_FILENAME_LENGTH = 80;
const EXTENSION = ".md";
const FALLBACK_BASENAME = "page";

// Names Windows refuses as file names, with or without an extension.
const WINDOWS_RESERVED_NAMES = new Set([
  "con", "prn", "aux", "nul",
  "com1", "com2", "com3", "com4", "com5", "com6", "com7", "com8", "com9",
  "lpt1", "lpt2", "lpt3", "lpt4", "lpt5", "lpt6", "lpt7", "lpt8", "lpt9"
]);

function slugify(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function getUrlText(url) {
  try {
    const { hostname, pathname } = new URL(url);
    return `${hostname.replace(/^www\./, "")} ${pathname}`;
  } catch {
    return "";
  }
}

function capLength(slug) {
  const maxBaseLength = MAX_FILENAME_LENGTH - EXTENSION.length;
  return Array.from(slug).slice(0, maxBaseLength).join("").replace(/-+$/g, "");
}

// Turns a page title (or, failing that, its URL) into a safe .md file name:
// lowercase kebab-case, letters and digits only, at most 80 characters.
export function buildMarkdownFilename({ title, url } = {}) {
  let basename = capLength(slugify(title)) || capLength(slugify(getUrlText(url)));

  if (!basename) {
    basename = FALLBACK_BASENAME;
  }

  if (WINDOWS_RESERVED_NAMES.has(basename)) {
    basename = `${basename}-${FALLBACK_BASENAME}`;
  }

  return `${basename}${EXTENSION}`;
}
