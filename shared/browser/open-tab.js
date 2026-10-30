// Opens url in a new tab.
export function openTab(url) {
  return browser.tabs.create({ url });
}
