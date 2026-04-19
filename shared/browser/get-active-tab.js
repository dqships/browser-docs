export async function getActiveTab() {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  if (!tab?.id) {
    throw new Error("No active browser tab was found.");
  }

  return tab;
}
