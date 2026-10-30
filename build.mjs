import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeSafariServiceWorkerBundle } from "./scripts/build-safari-service-worker-bundle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directoriesToCopy = ["background", "content", "options", "popup", "shared"];

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.name.endsWith(".test.js")) {
      // Unit tests stay in the source tree and are not shipped.
      continue;
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function build() {
  const distDir = path.join(__dirname, "dist");
  await fs.rm(distDir, { recursive: true, force: true }).catch(() => { });

  const chromeDir = path.join(distDir, "chrome");
  const firefoxDir = path.join(distDir, "firefox");
  const safariDir = path.join(distDir, "safari");

  await fs.mkdir(chromeDir, { recursive: true });
  await fs.mkdir(firefoxDir, { recursive: true });
  await fs.mkdir(safariDir, { recursive: true });

  // Copy all assets to each browser-specific variant.
  for (const dir of directoriesToCopy) {
    await copyDir(path.join(__dirname, dir), path.join(chromeDir, dir));
    await copyDir(path.join(__dirname, dir), path.join(firefoxDir, dir));
    await copyDir(path.join(__dirname, dir), path.join(safariDir, dir));
  }

  const manifestStr = await fs.readFile(path.join(__dirname, "manifest.json"), "utf8");
  const manifest = JSON.parse(manifestStr);

  // --- CHROME MANIFEST ---
  // Chrome remains exactly as authored
  await fs.writeFile(path.join(chromeDir, "manifest.json"), JSON.stringify(manifest, null, 2));

  // --- FIREFOX MANIFEST ---
  const firefoxManifest = JSON.parse(manifestStr);

  // Firefox historically struggles with Service Workers, standardizing on Event Pages ("scripts") instead.
  // We seamlessly translate the `service_worker` to an Event Page structure while preserving the `"type": "module"` signature.
  firefoxManifest.background = {
    scripts: [manifest.background.service_worker],
    type: "module"
  };

  // Firefox requires an explicit gecko ID for a lot of internal features
  firefoxManifest.browser_specific_settings = {
    gecko: {
      id: "web-to-markdown@followusai.com",
      strict_min_version: "115.0"
    }
  };

  await fs.writeFile(path.join(firefoxDir, "manifest.json"), JSON.stringify(firefoxManifest, null, 2));

  // --- SAFARI MANIFEST + CLASSIC SERVICE WORKER BUNDLE ---
  // Safari warns on MV3 background.type = "module", so we emit a classic
  // service worker bundle while keeping the source tree authored as ES modules.
  const safariManifest = JSON.parse(manifestStr);
  safariManifest.background = {
    service_worker: manifest.background.service_worker
  };

  await fs.writeFile(path.join(safariDir, "manifest.json"), JSON.stringify(safariManifest, null, 2));
  await writeSafariServiceWorkerBundle({
    destinationRoot: safariDir,
    entryModuleId: manifest.background.service_worker,
    repoRoot: __dirname
  });

  console.log("✅ Build successfully completed. Artifacts located in /dist/chrome, /dist/firefox, and /dist/safari.");
}

build();
