const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// "Just now", "5 min ago", "3 hr ago" (same day), "Yesterday", then a short
// date ("Oct 12", or "Oct 12, 2025" for another year).
export function formatRelativeTime(isoString, now = new Date(), locale = undefined) {
  const then = new Date(isoString);
  if (Number.isNaN(then.getTime())) {
    return "";
  }

  const elapsed = now.getTime() - then.getTime();

  if (elapsed < MINUTE) {
    return "Just now";
  }
  if (elapsed < HOUR) {
    return `${Math.floor(elapsed / MINUTE)} min ago`;
  }

  const dayDifference = Math.round((startOfDay(now) - startOfDay(then)) / (24 * HOUR));

  if (dayDifference === 0) {
    return `${Math.floor(elapsed / HOUR)} hr ago`;
  }
  if (dayDifference === 1) {
    return "Yesterday";
  }

  const options = { month: "short", day: "numeric" };
  if (then.getFullYear() !== now.getFullYear()) {
    options.year = "numeric";
  }
  return then.toLocaleDateString(locale, options);
}
