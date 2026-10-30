// Opens the toolbar popup when the browser allows it. Not every browser has
// action.openPopup, and some need a user gesture, so failure is expected and
// returns false.
export async function openActionPopup() {
  if (typeof browser.action?.openPopup !== "function") {
    return false;
  }

  try {
    await browser.action.openPopup();
    return true;
  } catch {
    return false;
  }
}
