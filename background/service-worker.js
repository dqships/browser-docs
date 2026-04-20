import "../shared/vendor/browser-polyfill.min.js";
import { registerContextMenu } from "./bootstrap-context-menu.js";
import { handleContextMenuClick } from "./handle-context-menu-click.js";
import { handleCommand } from "./handle-command.js";

browser.runtime.onInstalled.addListener(() => {
  void registerContextMenu();
});

browser.runtime.onStartup.addListener(() => {
  void registerContextMenu();
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  void handleContextMenuClick(info, tab);
});

browser.commands.onCommand.addListener((command, tab) => {
  void handleCommand(command, tab);
});
