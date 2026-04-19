import { registerContextMenu } from "./bootstrap-context-menu.js";
import { handleContextMenuClick } from "./handle-context-menu-click.js";

chrome.runtime.onInstalled.addListener(() => {
  void registerContextMenu();
});

chrome.runtime.onStartup.addListener(() => {
  void registerContextMenu();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  void handleContextMenuClick(info, tab);
});
