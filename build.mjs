import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function build() {
  const distDir = path.join(__dirname, "dist");
  await fs.rm(distDir, { recursive: true, force: true }).catch(() => {});

  const chromeDir = path.join(distDir, "chrome");
  const firefoxDir = path.join(distDir, "firefox");

  await fs.mkdir(chromeDir, { recursive: true });
  await fs.mkdir(firefoxDir, { recursive: true });

  // Copy all assets to both variants
  for (const dir of directoriesToCopy) {
    await copyDir(path.join(__dirname, dir), path.join(chromeDir, dir));
    await copyDir(path.join(__dirname, dir), path.join(firefoxDir, dir));
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
      id: "docs-to-markdown@starship.com",
      strict_min_version: "115.0"
    }
  };

  await fs.writeFile(path.join(firefoxDir, "manifest.json"), JSON.stringify(firefoxManifest, null, 2));

  console.log("✅ Build successfully completed. Artifacts located in /dist/chrome and /dist/firefox.");
}

build();
