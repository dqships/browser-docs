//
//  ViewController.swift
//  WebToMarkdown
//
//  Created by DaQuan Louden on 4/20/26.
//

import Cocoa
import SafariServices
import WebKit

class ViewController: NSViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!

    private var useSettingsInsteadOfPreferences: Bool {
        if #available(macOS 13, *) {
            return true
        }

        return false
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

        self.webView.configuration.userContentController.add(self, name: "controller")

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        guard let extensionBundleIdentifier = self.getExtensionBundleIdentifier() else {
            self.renderExtensionState(nil)
            NSLog("Unable to determine the Safari extension bundle identifier.")
            return
        }

        SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
            guard let state = state, error == nil else {
                DispatchQueue.main.async {
                    self.renderExtensionState(nil)
                }

                if let error = error {
                    NSLog("Unable to determine the Safari extension state: \(error.localizedDescription)")
                }

                return
            }

            DispatchQueue.main.async {
                self.renderExtensionState(state.isEnabled)
            }
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if (message.body as! String != "open-preferences") {
            return;
        }

        guard let extensionBundleIdentifier = self.getExtensionBundleIdentifier() else {
            self.presentAlert(
                title: "Safari Extension Not Found",
                message: "The bundled Safari extension could not be located. Rebuild the Safari wrapper and try again."
            )
            return
        }

        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            DispatchQueue.main.async {
                guard error == nil else {
                    self.presentAlert(
                        title: "Unable to Open Safari Settings",
                        message: error?.localizedDescription ?? "Safari could not open the extension settings."
                    )
                    return
                }

                NSApplication.shared.terminate(nil)
            }
        }
    }

    private func getExtensionBundleIdentifier() -> String? {
        if let pluginsURL = Bundle.main.builtInPlugInsURL,
           let pluginURLs = try? FileManager.default.contentsOfDirectory(
               at: pluginsURL,
               includingPropertiesForKeys: nil,
               options: [.skipsHiddenFiles]
           ) {
            for pluginURL in pluginURLs where pluginURL.pathExtension == "appex" {
                guard
                    let pluginBundle = Bundle(url: pluginURL),
                    let extensionInfo = pluginBundle.infoDictionary?["NSExtension"] as? [String: Any],
                    let extensionPointIdentifier = extensionInfo["NSExtensionPointIdentifier"] as? String,
                    extensionPointIdentifier == "com.apple.Safari.web-extension",
                    let bundleIdentifier = pluginBundle.bundleIdentifier
                else {
                    continue
                }

                return bundleIdentifier
            }
        }

        if let appBundleIdentifier = Bundle.main.bundleIdentifier {
            return "\(appBundleIdentifier).Extension"
        }

        return nil
    }

    private func renderExtensionState(_ enabled: Bool?) {
        let enabledArgument = enabled.map(String.init(describing:)) ?? "undefined"
        let labelModeArgument = String(self.useSettingsInsteadOfPreferences)

        self.webView.evaluateJavaScript("show(\(enabledArgument), \(labelModeArgument))")
    }

    private func presentAlert(title: String, message: String) {
        let alert = NSAlert()
        alert.messageText = title
        alert.informativeText = message
        alert.runModal()
    }

}
